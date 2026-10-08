import { NextResponse } from "next/server";
import { generateText, Output } from "ai";
import { z } from "zod";
import fs from "fs";
import path from "path";
import { getModels } from "@/lib/ai-config";
import { getPartPrices } from "@/lib/search";

// ──────────────────────────────────────────────────────────────────────────────
// Rate limit – hanya dihitung saat giliran memicu pencarian harga ("hasil")
// ──────────────────────────────────────────────────────────────────────────────
const rateLimit = new Map<string, { count: number; resetTime: number }>();

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const limit = rateLimit.get(ip);
  if (!limit || now > limit.resetTime) {
    rateLimit.set(ip, { count: 1, resetTime: now + 60 * 60 * 1000 });
    return false;
  }
  if (limit.count >= 8) return true;
  limit.count++;
  return false;
}

// ──────────────────────────────────────────────────────────────────────────────
// Schema input
// ──────────────────────────────────────────────────────────────────────────────
const historyMessageSchema = z.object({
  role: z.enum(["user", "assistant"]),
  content: z.string().max(2000),
});

const inputSchema = z.object({
  motor: z.string().min(2).max(100),
  message: z.string().min(1).max(1000),
  history: z.array(historyMessageSchema).max(10).default([]),
  // Jumlah giliran "tanya" yang sudah terjadi sebelum pesan ini
  askCount: z.number().int().min(0).max(2).default(0),
});

// ──────────────────────────────────────────────────────────────────────────────
// Schema output – dua varian yang dibedakan oleh field "jenis"
// ──────────────────────────────────────────────────────────────────────────────
const tanyaSchema = z.object({
  jenis: z.literal("tanya"),
  pertanyaan: z.string(),
  opsi: z.array(z.string()).min(2).max(4),
});

const hasilSchema = z.object({
  jenis: z.literal("hasil"),
  mode: z.enum(["perbaikan", "modifikasi"]),
  ringkasan: z.string(),
  kemungkinan_penyebab: z.array(z.string()),
  tingkat_keparahan: z.enum(["ringan", "sedang", "berat"]),
  keputusan: z.object({
    label: z.enum([
      "Bisa servis sendiri",
      "Cek sendiri dulu, ke bengkel jika tidak membaik",
      "Wajib ke bengkel",
    ]),
    alasan: z.string(),
  }),
  bisa_diy: z.boolean(),
  langkah_diy: z.array(z.string()),
  wajib_ke_bengkel: z.boolean(),
  sparepart: z.array(
    z.object({
      nama: z.string(),
      tingkat: z.enum(["standar", "aftermarket", "racing"]),
      catatan_keawetan: z.string(),
      catatan_kecocokan: z.string(),
      // nama_jasa: kata kunci untuk lookup tabel biaya jasa; null jika tidak ada
      nama_jasa: z.string().nullable(),
    })
  ),
  disclaimer: z.string(),
});

const outputSchema = z.discriminatedUnion("jenis", [tanyaSchema, hasilSchema]);

// ──────────────────────────────────────────────────────────────────────────────
// Helpers – baca file statis
// ──────────────────────────────────────────────────────────────────────────────
function readFile(filePath: string): string {
  try {
    return fs.readFileSync(filePath, "utf-8");
  } catch {
    return "";
  }
}

// Parse tabel Markdown biaya-jasa.md → Map<keyword lowercase, {min,max}>
function parseBiayaJasa(
  md: string
): Map<string, { min: number; max: number }> {
  const map = new Map<string, { min: number; max: number }>();
  const lines = md.split("\n");
  for (const line of lines) {
    const cols = line
      .split("|")
      .map((c) => c.trim())
      .filter(Boolean);
    // Baris data: 4 kolom, kolom ke-2 dan ke-3 adalah angka
    if (cols.length >= 3) {
      const minStr = cols[1].replace(/\./g, "").replace(",", ".");
      const maxStr = cols[2].replace(/\./g, "").replace(",", ".");
      const minVal = parseInt(minStr, 10);
      const maxVal = parseInt(maxStr, 10);
      if (!isNaN(minVal) && !isNaN(maxVal) && minVal > 0) {
        map.set(cols[0].toLowerCase(), { min: minVal, max: maxVal });
      }
    }
  }
  return map;
}

// Cari baris paling relevan di tabel berdasarkan nama_jasa
function lookupBiayaJasa(
  namaJasa: string | null,
  table: Map<string, { min: number; max: number }>
): { min: number; max: number } | null {
  if (!namaJasa) return null;
  const keyword = namaJasa.toLowerCase();
  // Exact match dulu
  if (table.has(keyword)) return table.get(keyword)!;
  // Partial match
  for (const [key, val] of table) {
    if (keyword.includes(key) || key.includes(keyword)) return val;
  }
  return null;
}

// ──────────────────────────────────────────────────────────────────────────────
// POST handler
// ──────────────────────────────────────────────────────────────────────────────
export async function POST(req: Request) {
  try {
    if (!process.env.GEMINI_MODEL || !process.env.GEMINI_FALLBACK_MODEL) {
      return NextResponse.json(
        { error: "Konfigurasi AI belum lengkap di server." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = inputSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Input tidak valid." }, { status: 400 });
    }

    const { motor, message, history, askCount } = parsed.data;
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";

    const { primaryModel, fallbackModel } = getModels();

    // Bangun system prompt
    const systemPrompt = readFile(
      path.join(process.cwd(), "prompts", "chat.md")
    );

    const biayaJasaMd = readFile(
      path.join(process.cwd(), "knowledge", "biaya-jasa.md")
    );
    const biayaJasaTable = parseBiayaJasa(biayaJasaMd);

    // Instruksi tambahan berdasarkan askCount
    const forceResultNote =
      askCount >= 2
        ? "\n\nPENTING: Kamu sudah bertanya 2 kali. Giliran ini WAJIB memberikan jenis \"hasil\", bukan \"tanya\"."
        : "";

    const systemFull = `${systemPrompt}

## Data Motor Pengguna
Motor: ${motor}

## Tabel Biaya Jasa Bengkel (sumber resmi, wajib diikuti)
${biayaJasaMd}
${forceResultNote}`;

    // Susun pesan history untuk model
    // Vercel AI SDK: messages array dengan role user/assistant
    const messages: { role: "user" | "assistant"; content: string }[] = [
      ...history.slice(-10).map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      })),
      { role: "user", content: message },
    ];

    // Panggil model dengan retry ke fallback
    const callModel = async (model: ReturnType<typeof primaryModel extends infer T ? () => T : never>) => {
      // Tidak bisa pakai ReturnType trick dengan conditional — gunakan any
      return await (generateText as any)({
        model,
        system: systemFull,
        messages,
        output: Output.object({ schema: outputSchema }),
        abortSignal: AbortSignal.timeout(28000),
      });
    };

    let aiOutput: z.infer<typeof outputSchema>;
    try {
      const { output } = await generateText({
        model: primaryModel,
        system: systemFull,
        messages,
        output: Output.object({ schema: outputSchema }),
        abortSignal: AbortSignal.timeout(28000),
      });
      aiOutput = output;
    } catch (primaryError) {
      console.error("Primary model failed, trying fallback:", primaryError);
      try {
        const { output } = await generateText({
          model: fallbackModel,
          system: systemFull,
          messages,
          output: Output.object({ schema: outputSchema }),
          abortSignal: AbortSignal.timeout(28000),
        });
        aiOutput = output;
      } catch (fallbackError) {
        console.error("Fallback model failed:", fallbackError);
        return NextResponse.json(
          { error: "Layanan sedang ramai, coba lagi nanti." },
          { status: 503 }
        );
      }
    }

    // Jika jenis "tanya" → kembalikan langsung, tanpa rate limit pencarian harga
    if (aiOutput.jenis === "tanya") {
      return NextResponse.json(aiOutput);
    }

    // ────────────────────────────────────────────────────────────────────────
    // Jenis "hasil" — cek rate limit sebelum pencarian harga
    // ────────────────────────────────────────────────────────────────────────
    if (isRateLimited(ip)) {
      return NextResponse.json(
        { error: "Anda sudah banyak bertanya, coba lagi beberapa saat lagi." },
        { status: 429 }
      );
    }

    // Ambil harga sparepart
    const partNames = aiOutput.sparepart.map((p) => p.nama);
    const prices = await getPartPrices(partNames, motor);

    const sparepartWithExtras = aiOutput.sparepart.map((p, i) => {
      const harga = prices[i] || null;

      // Lookup biaya jasa dari tabel
      const jasaData = lookupBiayaJasa(p.nama_jasa, biayaJasaTable);
      const biaya_jasa = jasaData
        ? { min: jasaData.min, max: jasaData.max }
        : p.nama_jasa
        ? { min: null, max: null, keterangan: "tidak tersedia" }
        : null;

      return {
        nama: p.nama,
        tingkat: p.tingkat,
        catatan_keawetan: p.catatan_keawetan,
        catatan_kecocokan: p.catatan_kecocokan,
        harga,
        biaya_jasa,
      };
    });

    // Urutkan: kelompok per tingkat (standar → aftermarket → racing),
    // dalam tiap kelompok: harga tertinggi ke terendah, null di akhir
    const tiers = ["standar", "aftermarket", "racing"] as const;
    const finalSpareparts: typeof sparepartWithExtras = [];
    tiers.forEach((tier) => {
      const filtered = sparepartWithExtras.filter((p) => p.tingkat === tier);
      filtered.sort((a, b) => {
        const pa = a.harga?.max ?? a.harga?.min ?? -1;
        const pb = b.harga?.max ?? b.harga?.min ?? -1;
        return pb - pa;
      });
      finalSpareparts.push(...filtered);
    });

    return NextResponse.json({
      jenis: "hasil",
      mode: aiOutput.mode,
      ringkasan: aiOutput.ringkasan,
      kemungkinan_penyebab: aiOutput.kemungkinan_penyebab,
      tingkat_keparahan: aiOutput.tingkat_keparahan,
      keputusan: aiOutput.keputusan,
      bisa_diy: aiOutput.bisa_diy,
      langkah_diy: aiOutput.langkah_diy,
      wajib_ke_bengkel: aiOutput.wajib_ke_bengkel,
      sparepart: finalSpareparts,
      disclaimer: aiOutput.disclaimer,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Terjadi kesalahan internal." },
      { status: 500 }
    );
  }
}
