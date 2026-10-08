import { generateText, Output } from "ai";
import { z } from "zod";
import { getModels } from "./ai-config";
import fs from "fs";
import path from "path";

const CACHE_DIR = path.join(process.cwd(), "cache");
const CACHE_FILE = path.join(CACHE_DIR, "prices.json");

// Tanggal hari ini dihasilkan oleh kode, bukan model
const TODAY = new Date().toLocaleDateString("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
});

interface CachedPrice {
  min: number | null;
  max: number | null;
  sumber_url: string | null;
  tanggal: string;
  expires: number;
}

const getCache = (): Record<string, CachedPrice> => {
  if (!fs.existsSync(CACHE_FILE)) return {};
  try {
    const data = fs.readFileSync(CACHE_FILE, "utf-8");
    return JSON.parse(data);
  } catch {
    return {};
  }
};

const saveCache = (cache: Record<string, CachedPrice>) => {
  if (!fs.existsSync(CACHE_DIR)) fs.mkdirSync(CACHE_DIR, { recursive: true });
  fs.writeFileSync(CACHE_FILE, JSON.stringify(cache, null, 2));
};

// Schema untuk ekstraksi SEMUA part sekaligus (array)
const batchPriceSchema = z.object({
  parts: z.array(
    z.object({
      harga_min: z.number().nullable(),
      harga_max: z.number().nullable(),
      sumber_url: z.string().nullable(),
    })
  ),
});

type PriceResult = {
  min: number | null;
  max: number | null;
  sumber_url: string | null;
  tanggal: string;
} | null;

export async function getPartPrices(
  parts: string[],
  motor: string
): Promise<PriceResult[]> {
  const apiKey = process.env.TAVILY_API_KEY;
  if (!apiKey) return parts.map(() => null);

  // Domain marketplace Indonesia — sumber URL dijamin dari toko langsung
  const MARKETPLACE_DOMAINS = [
    "tokopedia.com",
    "shopee.co.id",
    "bukalapak.com",
    "lazada.co.id",
    "blibli.com",
    "tiktok.com",
  ];

  const cache = getCache();
  const now = Date.now();

  // Batasi maks 4 part
  const partsToSearch = parts.slice(0, 4);
  const totalParts = parts.length;

  // Pisahkan part yang sudah di-cache vs yang perlu dicari
  const cached: (PriceResult | undefined)[] = partsToSearch.map((partName) => {
    const cacheKey = `${partName.toLowerCase()}_${motor.toLowerCase()}`;
    const hit = cache[cacheKey];
    if (hit && hit.expires > now) {
      return {
        min: hit.min,
        max: hit.max,
        sumber_url: hit.sumber_url,
        tanggal: hit.tanggal,
      };
    }
    return undefined;
  });

  const uncachedIndexes = partsToSearch
    .map((_, i) => i)
    .filter((i) => cached[i] === undefined);

  let searchResults: Record<number, { snippets: string; url: string | null }> =
    {};

  // Jalankan semua Tavily search secara paralel
  if (uncachedIndexes.length > 0) {
    await Promise.all(
      uncachedIndexes.map(async (i) => {
        const partName = partsToSearch[i];
        // Tambahkan keyword marketplace agar lebih terarah, tanpa membatasi domain
        const query = `harga ${partName} ${motor} (shopee ATAU tokopedia ATAU bukalapak)`;
        try {
          const response = await fetch("https://api.tavily.com/search", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              api_key: apiKey,
              query,
              search_depth: "basic",
              max_results: 5,
            }),
          });
          if (!response.ok) throw new Error("Tavily search failed");
          const data = await response.json();
          const snippets = (data.results as any[])
            .map((r) => `URL: ${r.url}\nContent: ${r.content}`)
            .join("\n\n");
          const topUrl: string | null = data.results?.[0]?.url ?? null;
          searchResults[i] = { snippets, url: topUrl };
        } catch (err) {
          console.error(`Tavily search failed for ${partName}:`, err);
          searchResults[i] = { snippets: "", url: null };
        }
      })
    );

    // Satu panggilan Gemini untuk semua part yang perlu diekstrak
    const partBlocks = uncachedIndexes
      .map((i) => {
        const partName = partsToSearch[i];
        const { snippets } = searchResults[i];
        return `### Part ${i + 1}: ${partName} ${motor}\n${snippets || "(Tidak ada hasil pencarian)"}`;
      })
      .join("\n\n---\n\n");

    try {
      const { primaryModel } = getModels();
      const extraction = await generateText({
        model: primaryModel,
        system: `Kamu adalah asisten ekstraksi data harga sparepart motor Indonesia.
Tugas: Untuk SETIAP blok "### Part N: ..." berikut, ekstrak rentang harga min dan max dalam Rupiah (integer).
Aturan:
1. HANYA gunakan angka yang benar-benar ada di teks. Jangan mengarang harga.
2. Jika ada beberapa harga, ambil rentang terendah (min) dan tertinggi (max) yang masuk akal.
3. Jika tidak ada harga ditemukan, isi null untuk harga_min dan harga_max.
4. sumber_url: URL yang paling relevan mencantumkan harga tersebut, atau null jika tidak ada.
5. Urutan output array harus sesuai urutan blok Part 1, Part 2, dst.`,
        prompt: `Ekstrak harga dari hasil pencarian berikut:\n\n${partBlocks}`,
        output: Output.object({ schema: batchPriceSchema }),
        abortSignal: AbortSignal.timeout(20000),
      });

      const extractedParts = extraction.output?.parts ?? [];

      // Simpan hasil ke cache dan gabungkan ke array cached
      uncachedIndexes.forEach((idx, pos) => {
        const partName = partsToSearch[idx];
        const cacheKey = `${partName.toLowerCase()}_${motor.toLowerCase()}`;
        const extracted = extractedParts[pos] ?? null;

        const hasPrice =
          extracted &&
          (extracted.harga_min !== null || extracted.harga_max !== null);

        const priceResult: PriceResult = extracted
          ? {
              min: extracted.harga_min,
              max: extracted.harga_max,
              sumber_url: extracted.sumber_url,
              tanggal: TODAY,
            }
          : null;

        // Simpan ke cache:
        // - Ada harga → TTL 2 hari
        // - Null (tidak ketemu) → TTL 6 jam (hindari panggil Tavily ulang)
        const ttl = hasPrice
          ? 2 * 24 * 60 * 60 * 1000
          : 6 * 60 * 60 * 1000;

        cache[cacheKey] = {
          min: extracted?.harga_min ?? null,
          max: extracted?.harga_max ?? null,
          sumber_url: extracted?.sumber_url ?? null,
          tanggal: TODAY,
          expires: now + ttl,
        };

        cached[idx] = priceResult;
      });

      saveCache(cache);
    } catch (err) {
      console.error("Batch Gemini extraction failed:", err);
      // Jika Gemini gagal, isi uncached dengan null (tanpa cache)
      uncachedIndexes.forEach((idx) => {
        cached[idx] = null;
      });
    }
  }

  // Susun hasil akhir
  const finalResults: PriceResult[] = partsToSearch.map(
    (_, i) => cached[i] ?? null
  );

  // Padkan dengan null jika parts > 4
  while (finalResults.length < totalParts) {
    finalResults.push(null);
  }

  return finalResults;
}
