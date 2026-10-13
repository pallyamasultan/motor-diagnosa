"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { ResultCard } from "@/components/ResultCard";
import {
  loadRiwayat,
  deleteRiwayat,
  clearRiwayat,
  formatTanggal,
  type RiwayatItem,
} from "@/lib/riwayat";

export default function RiwayatPage() {
  const [riwayat, setRiwayat] = useState<RiwayatItem[]>([]);
  const [mounted, setMounted] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    setRiwayat(loadRiwayat());
  }, []);

  const handleDelete = (id: string) => {
    if (confirm("Hapus catatan diagnosa ini?")) {
      deleteRiwayat(id);
      setRiwayat(loadRiwayat());
      if (expandedId === id) setExpandedId(null);
    }
  };

  const handleClearAll = () => {
    if (confirm("Yakin ingin menghapus seluruh riwayat diagnosa?")) {
      clearRiwayat();
      setRiwayat([]);
      setExpandedId(null);
    }
  };

  const toggleExpand = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  return (
    <SiteShell>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8 pb-6 border-b border-slate-200">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">📋</span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Riwayat Diagnosa
              </h1>
            </div>
            <p className="text-sm text-slate-500">
              Hasil diagnosa tersimpan otomatis di browser Anda (maksimal 10 riwayat terakhir).
            </p>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            {mounted && riwayat.length > 0 && (
              <button
                onClick={handleClearAll}
                className="px-3.5 py-2 text-xs font-semibold rounded-xl text-rose-600 bg-rose-50 border border-rose-200 hover:bg-rose-100 transition-colors"
              >
                Hapus Semua
              </button>
            )}
            <Link
              href="/diagnosa"
              className="px-4 py-2 text-xs font-bold rounded-xl bg-blue-600 text-white hover:bg-blue-700 shadow-sm transition-all"
            >
              + Diagnosa Baru
            </Link>
          </div>
        </div>

        {/* Loading state SSR placeholder */}
        {!mounted && (
          <div className="space-y-4">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="p-6 rounded-2xl bg-white border border-slate-200 shadow-sm animate-pulse space-y-3"
              >
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-6 bg-slate-200 rounded w-3/4" />
                <div className="h-4 bg-slate-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {mounted && riwayat.length === 0 && (
          <div className="text-center py-16 px-4 bg-white rounded-3xl border border-slate-200 shadow-sm">
            <span className="text-5xl block mb-4">📭</span>
            <h2 className="text-lg font-bold text-slate-800 mb-2">
              Belum Ada Riwayat Diagnosa
            </h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
              Hasil konsultasi keluhan atau modifikasi motor Anda akan otomatis disimpan di sini agar mudah dibaca kembali saat ke bengkel.
            </p>
            <Link
              href="/diagnosa"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-blue-600 text-white font-bold text-sm hover:bg-blue-700 shadow-md transition-all hover:scale-[1.02]"
            >
              <span>Mulai Diagnosa Sekarang</span>
              <span>→</span>
            </Link>
          </div>
        )}

        {/* Riwayat List */}
        {mounted && riwayat.length > 0 && (
          <div className="space-y-4">
            {riwayat.map((item) => {
              const isExpanded = expandedId === item.id;
              const keparahanColor =
                item.hasil.tingkat_keparahan === "berat"
                  ? "bg-rose-100 text-rose-700 border-rose-200"
                  : item.hasil.tingkat_keparahan === "sedang"
                  ? "bg-amber-100 text-amber-800 border-amber-200"
                  : "bg-emerald-100 text-emerald-800 border-emerald-200";

              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:border-slate-300 transition-all overflow-hidden"
                >
                  {/* Card Header & Preview */}
                  <div className="p-5">
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded-md bg-blue-50 text-blue-700 text-xs font-bold border border-blue-100">
                          {item.motor}
                        </span>
                        <span className={`px-2 py-0.5 rounded-md text-[11px] font-bold border capitalize ${keparahanColor}`}>
                          {item.hasil.tingkat_keparahan}
                        </span>
                        <span className="text-xs text-slate-400">
                          {formatTanggal(item.tanggal)}
                        </span>
                      </div>

                      <button
                        onClick={() => handleDelete(item.id)}
                        className="text-slate-400 hover:text-rose-600 p-1 rounded-lg hover:bg-rose-50 transition-colors text-xs"
                        title="Hapus riwayat ini"
                        aria-label="Hapus riwayat"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className="w-4 h-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M8.75 1A2.75 2.75 0 006 3.75v.443c-.795.077-1.584.176-2.365.298a.75.75 0 10.23 1.482l.149-.022.841 10.518A2.75 2.75 0 007.596 19h4.807a2.75 2.75 0 002.742-2.53l.841-10.52.149.023a.75.75 0 00.23-1.482A41.03 41.03 0 0014 4.193V3.75A2.75 2.75 0 0011.25 1h-2.5zM10 4c.84 0 1.673.025 2.5.075V3.75c0-.69-.56-1.25-1.25-1.25h-2.5c-.69 0-1.25.56-1.25 1.25v.325C8.327 4.025 9.16 4 10 4zM8.58 7.72a.75.75 0 00-1.5.06l.3 7.5a.75.75 0 101.5-.06l-.3-7.5zm4.34.06a.75.75 0 10-1.5-.06l-.3 7.5a.75.75 0 101.5.06l.3-7.5z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>

                    {/* Ringkasan Keluhan */}
                    <div className="mb-3">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Keluhan
                      </p>
                      <p className="text-sm font-medium text-slate-800 line-clamp-2">
                        &ldquo;{item.keluhan}&rdquo;
                      </p>
                    </div>

                    {/* Ringkasan Masalah */}
                    <div className="mb-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">
                        Hasil Analisa
                      </p>
                      <p className="text-sm text-slate-700 font-semibold">
                        {item.hasil.ringkasan}
                      </p>
                    </div>

                    {/* Info Footer baris */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-slate-100">
                      <div className="flex items-center gap-3 text-xs text-slate-500">
                        <span className="font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                          {item.hasil.keputusan?.label}
                        </span>
                        <span>
                          {item.hasil.sparepart?.length || 0} rekomendasi sparepart
                        </span>
                      </div>

                      <button
                        onClick={() => toggleExpand(item.id)}
                        className="inline-flex items-center gap-1.5 text-xs font-bold text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        <span>{isExpanded ? "Tutup Detail" : "Lihat Kartu Lengkap"}</span>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          className={`w-4 h-4 transition-transform duration-200 ${
                            isExpanded ? "rotate-180" : ""
                          }`}
                        >
                          <path
                            fillRule="evenodd"
                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.168l3.71-3.938a.75.75 0 111.08 1.04l-4.25 4.5a.75.75 0 01-1.08 0l-4.25-4.5a.75.75 0 01.02-1.06z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>

                  {/* Expanded ResultCard view */}
                  {isExpanded && (
                    <div className="p-5 bg-slate-50 border-t border-slate-200 animate-in fade-in duration-200">
                      <div className="mb-4 flex items-center justify-between">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                          Kartu Diagnosa &amp; Estimasi Biaya
                        </span>
                        <Link
                          href={`/diagnosa?motor=${encodeURIComponent(
                            item.motor
                          )}&q=${encodeURIComponent(item.keluhan)}`}
                          className="text-xs text-blue-600 hover:underline font-semibold"
                        >
                          Konsultasikan Ulang →
                        </Link>
                      </div>
                      <ResultCard data={item.hasil} motor={item.motor} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </SiteShell>
  );
}
