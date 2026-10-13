"use client";

import React, { useState } from "react";

// ──────────────────────────────────────────────────────────────────────────────
// Types
// ──────────────────────────────────────────────────────────────────────────────
interface BiayaJasa {
  min: number | null;
  max: number | null;
  keterangan?: string;
}

interface SparePart {
  nama: string;
  tingkat: "standar" | "aftermarket" | "racing";
  catatan_keawetan: string;
  catatan_kecocokan: string;
  harga: {
    min: number | null;
    max: number | null;
    sumber_url: string | null;
    tanggal: string;
  } | null;
  biaya_jasa: BiayaJasa | null;
}

interface Keputusan {
  label:
    | "Bisa servis sendiri"
    | "Cek sendiri dulu, ke bengkel jika tidak membaik"
    | "Wajib ke bengkel";
  alasan: string;
}

export interface ResultData {
  jenis: "hasil";
  mode: "perbaikan" | "modifikasi";
  ringkasan: string;
  kemungkinan_penyebab: string[];
  tingkat_keparahan: "ringan" | "sedang" | "berat";
  keputusan: Keputusan;
  bisa_diy: boolean;
  langkah_diy: string[];
  wajib_ke_bengkel: boolean;
  sparepart: SparePart[];
  disclaimer: string;
}

// ──────────────────────────────────────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────────────────────────────────────
const formatIDR = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0,
  }).format(amount);

const formatRange = (min: number | null, max: number | null): string => {
  if (min && max && min !== max) return `${formatIDR(min)} – ${formatIDR(max)}`;
  if (min || max) return formatIDR((min || max)!);
  return "–";
};

/** Buat teks pesan WhatsApp dari hasil diagnosa */
function buildWAText(data: ResultData, motor?: string): string {
  const header = motor
    ? `Halo, saya mau konsultasi motor *${motor}*.\n\n`
    : "Halo, saya mau konsultasi motor saya.\n\n";

  const ringkasan = `*Keluhan:*\n${data.ringkasan}\n\n`;

  const penyebab =
    data.kemungkinan_penyebab.length > 0
      ? `*Kemungkinan penyebab:*\n${data.kemungkinan_penyebab
          .map((p) => `• ${p}`)
          .join("\n")}\n\n`
      : "";

  const keputusan = `*Saran:* ${data.keputusan.label}\n${data.keputusan.alasan}\n\n`;

  const sparepart =
    data.sparepart.length > 0
      ? `*Estimasi sparepart:*\n${data.sparepart
          .slice(0, 3)
          .map((p) => {
            const harga =
              p.harga && (p.harga.min || p.harga.max)
                ? ` ~ ${formatRange(p.harga.min, p.harga.max)}`
                : "";
            return `• ${p.nama} (${p.tingkat})${harga}`;
          })
          .join("\n")}\n\n`
      : "";

  const footer = `_Dikirim dari Motor Diagnosa — hasil adalah estimasi awal AI._`;

  return `${header}${ringkasan}${penyebab}${keputusan}${sparepart}${footer}`;
}

// ──────────────────────────────────────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────────────────────────────────────
const keputusanConfig = {
  "Bisa servis sendiri": {
    bg: "bg-green-50",
    border: "border-green-200",
    icon: "✅",
    textColor: "text-green-900",
    subColor: "text-green-700",
  },
  "Cek sendiri dulu, ke bengkel jika tidak membaik": {
    bg: "bg-yellow-50",
    border: "border-yellow-200",
    icon: "🔍",
    textColor: "text-yellow-900",
    subColor: "text-yellow-700",
  },
  "Wajib ke bengkel": {
    bg: "bg-red-50",
    border: "border-red-200",
    icon: "🏍️",
    textColor: "text-red-900",
    subColor: "text-red-700",
  },
};

const tierBadgeClass = {
  standar: "bg-blue-100 text-blue-700",
  aftermarket: "bg-violet-100 text-violet-700",
  racing: "bg-orange-100 text-orange-700",
};

// ──────────────────────────────────────────────────────────────────────────────
// Tombol Share WhatsApp
// ──────────────────────────────────────────────────────────────────────────────
function ShareWAButton({ data, motor }: { data: ResultData; motor?: string }) {
  const [copied, setCopied] = useState(false);

  const handleShare = () => {
    const text = buildWAText(data, motor);
    const url = `https://wa.me/?text=${encodeURIComponent(text)}`;
    window.open(url, "_blank", "noopener,noreferrer");
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <button
      onClick={handleShare}
      className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${
        copied
          ? "bg-green-500 text-white"
          : "bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-sm hover:shadow-md hover:-translate-y-0.5"
      }`}
    >
      {copied ? (
        <>✅ Membuka WhatsApp…</>
      ) : (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="w-4 h-4"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
          </svg>
          Kirim ke Bengkel via WhatsApp
        </>
      )}
    </button>
  );
}

// ──────────────────────────────────────────────────────────────────────────────
// Main component
// ──────────────────────────────────────────────────────────────────────────────
export function ResultCard({
  data,
  motor,
}: {
  data: ResultData;
  motor?: string;
}) {
  const severityColors = {
    ringan: "bg-green-100 text-green-800 border-green-200",
    sedang: "bg-yellow-100 text-yellow-800 border-yellow-200",
    berat: "bg-red-100 text-red-800 border-red-200",
  };

  const kp = keputusanConfig[data.keputusan.label];

  return (
    <div className="w-full space-y-4 text-left">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">
          Hasil Analisa
        </span>
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold border ${
            severityColors[data.tingkat_keparahan]
          }`}
        >
          {data.tingkat_keparahan.toUpperCase()}
        </span>
      </div>

      {/* Ringkasan */}
      <p className="text-slate-700 leading-relaxed text-sm">{data.ringkasan}</p>

      {/* Kemungkinan Penyebab */}
      {data.kemungkinan_penyebab.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">
            Kemungkinan Penyebab
          </h3>
          <ul className="list-disc list-inside space-y-1 text-sm text-slate-600">
            {data.kemungkinan_penyebab.map((cause, i) => (
              <li key={i}>{cause}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Keputusan */}
      <div className={`rounded-xl border p-4 ${kp.bg} ${kp.border}`}>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-lg">{kp.icon}</span>
          <span className={`font-bold text-sm ${kp.textColor}`}>
            {data.keputusan.label}
          </span>
        </div>
        <p className={`text-xs leading-relaxed ${kp.subColor}`}>
          {data.keputusan.alasan}
        </p>
      </div>

      {/* Panduan DIY */}
      {data.bisa_diy && data.langkah_diy.length > 0 && (
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
          <h3 className="text-xs font-semibold text-blue-900 mb-2 uppercase tracking-wide">
            Panduan Perbaikan Mandiri
          </h3>
          <ol className="list-decimal list-inside space-y-1.5 text-sm text-blue-800">
            {data.langkah_diy.map((step, i) => (
              <li key={i}>{step}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Wajib ke bengkel banner */}
      {data.wajib_ke_bengkel && (
        <div className="p-4 bg-orange-50 rounded-xl border border-orange-100 flex items-start gap-3">
          <span className="text-orange-500 mt-0.5 text-base">⚠️</span>
          <div>
            <p className="text-xs font-semibold text-orange-900">Wajib ke Bengkel</p>
            <p className="text-xs text-orange-800 mt-0.5">
              Masalah ini melibatkan sistem vital. Jangan mencoba memperbaiki sendiri demi keselamatan.
            </p>
          </div>
        </div>
      )}

      {/* Sparepart */}
      {data.sparepart.length > 0 && (
        <div>
          <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Rekomendasi Sparepart
          </h3>
          <div className="space-y-3">
            {data.sparepart.map((part, i) => {
              const hasPartPrice =
                part.harga && (part.harga.min !== null || part.harga.max !== null);
              const hasJasa =
                part.biaya_jasa &&
                (part.biaya_jasa.min !== null || part.biaya_jasa.max !== null);

              return (
                <div
                  key={i}
                  className="p-3.5 border border-slate-100 rounded-xl bg-white shadow-sm"
                >
                  {/* Nama + tier */}
                  <div className="flex justify-between items-start gap-2 mb-1.5">
                    <span className="font-semibold text-sm text-slate-900 leading-tight">
                      {part.nama}
                    </span>
                    <span
                      className={`text-[10px] uppercase px-2 py-0.5 rounded font-bold shrink-0 ${
                        tierBadgeClass[part.tingkat]
                      }`}
                    >
                      {part.tingkat}
                    </span>
                  </div>
                  <p className="text-xs text-slate-600 mb-0.5">
                    {part.catatan_kecocokan}
                  </p>
                  <p className="text-[10px] text-slate-400 italic mb-3">
                    {part.catatan_keawetan}
                  </p>

                  {/* Estimasi Biaya */}
                  <div className="pt-2.5 border-t border-slate-100 space-y-1.5">
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wide">
                      Estimasi Biaya
                    </p>

                    {/* Harga part */}
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-slate-500">Harga part</span>
                      {hasPartPrice ? (
                        <div className="text-right">
                          <span className="text-xs font-bold text-blue-700">
                            {formatRange(part.harga!.min, part.harga!.max)}
                          </span>
                          {part.harga!.sumber_url && (
                            <a
                              href={part.harga!.sumber_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block text-[10px] text-blue-500 underline hover:text-blue-700"
                            >
                              Sumber · {part.harga!.tanggal}
                            </a>
                          )}
                          {!part.harga!.sumber_url && (
                            <span className="block text-[10px] text-slate-400">
                              per {part.harga!.tanggal}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-xs text-slate-400 italic">
                          Belum ditemukan
                        </span>
                      )}
                    </div>

                    {/* Biaya jasa */}
                    {part.biaya_jasa !== null && (
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-slate-500">
                          Jasa bengkel{" "}
                          <span className="text-[10px] text-slate-400 italic">
                            (perkiraan kasar)
                          </span>
                        </span>
                        {hasJasa ? (
                          <span className="text-xs font-bold text-emerald-700">
                            {formatRange(
                              part.biaya_jasa!.min,
                              part.biaya_jasa!.max
                            )}
                          </span>
                        ) : (
                          <span className="text-xs text-slate-400 italic">
                            tidak tersedia
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-2 text-[10px] text-slate-400 italic">
            * Harga dapat berbeda tiap penjual, kota, dan bengkel.
          </p>
        </div>
      )}

      {/* Tombol Share WhatsApp */}
      <div className="pt-2">
        <ShareWAButton data={data} motor={motor} />
      </div>

      {/* Disclaimer */}
      <div className="pt-3 border-t border-slate-100">
        <p className="text-[10px] text-slate-400 italic leading-relaxed">
          {data.disclaimer}
        </p>
      </div>
    </div>
  );
}
