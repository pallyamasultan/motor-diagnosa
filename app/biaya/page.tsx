import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Referensi Biaya Servis — Motor Diagnosa",
  description:
    "Perkiraan biaya jasa bengkel motor: ganti busi, servis CVT, ganti kampas rem, dan lainnya.",
};

type Baris = {
  jenis: string;
  min: string;
  maks: string;
  catatan: string;
};

// Cerminan dari knowledge/biaya-jasa.md
const BIAYA_JASA: Baris[] = [
  {
    jenis: "Ganti busi",
    min: "15.000",
    maks: "35.000",
    catatan: "Bengkel umum, belum termasuk part",
  },
  {
    jenis: "Ganti aki",
    min: "20.000",
    maks: "50.000",
    catatan: "Bengkel umum, belum termasuk part",
  },
  {
    jenis: "Servis CVT (buka, bersihkan, ganti roller / v-belt)",
    min: "50.000",
    maks: "120.000",
    catatan: "Hanya motor matic, belum termasuk part",
  },
  {
    jenis: "Ganti kampas rem depan",
    min: "20.000",
    maks: "40.000",
    catatan: "Per sisi, belum termasuk part",
  },
  {
    jenis: "Ganti kampas rem belakang",
    min: "20.000",
    maks: "40.000",
    catatan: "Per sisi, belum termasuk part",
  },
  {
    jenis: "Bersihkan injektor",
    min: "80.000",
    maks: "150.000",
    catatan: "Termasuk jasa bersihkan throttle body",
  },
  {
    jenis: "Ganti oli mesin",
    min: "15.000",
    maks: "30.000",
    catatan: "Belum termasuk oli",
  },
  {
    jenis: "Tune up ringan (busi, filter udara, setel klep)",
    min: "50.000",
    maks: "100.000",
    catatan: "Belum termasuk part",
  },
  {
    jenis: "Ganti ban luar",
    min: "20.000",
    maks: "50.000",
    catatan: "Per ban, belum termasuk part",
  },
  {
    jenis: "Ganti ban dalam",
    min: "15.000",
    maks: "30.000",
    catatan: "Per ban, belum termasuk part",
  },
];

export default function BiayaPage() {
  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
          Referensi Biaya Servis
        </h1>
        <p className="text-slate-500 mb-8 max-w-2xl">
          Perkiraan biaya jasa bengkel motor di Indonesia. Angka ini bisa berbeda
          tiap kota, jenis bengkel, dan tahun motor.
        </p>

        <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-slate-50 border-b border-slate-200">
                  <th className="text-left font-bold text-slate-700 px-4 py-3">
                    Jenis Servis
                  </th>
                  <th className="text-left font-bold text-slate-700 px-4 py-3 whitespace-nowrap">
                    Jasa Min
                  </th>
                  <th className="text-left font-bold text-slate-700 px-4 py-3 whitespace-nowrap">
                    Jasa Maks
                  </th>
                  <th className="text-left font-bold text-slate-700 px-4 py-3">
                    Catatan
                  </th>
                </tr>
              </thead>
              <tbody>
                {BIAYA_JASA.map((b) => (
                  <tr
                    key={b.jenis}
                    className="border-b border-slate-100 last:border-0"
                  >
                    <td className="px-4 py-3 font-semibold text-slate-800">
                      {b.jenis}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      Rp {b.min}
                    </td>
                    <td className="px-4 py-3 text-slate-600 whitespace-nowrap">
                      Rp {b.maks}
                    </td>
                    <td className="px-4 py-3 text-slate-500 text-xs">
                      {b.catatan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-6 bg-amber-50 border border-amber-100 rounded-2xl p-5">
          <p className="text-amber-900 text-sm leading-relaxed">
            <strong>Catatan:</strong> tabel ini adalah estimasi kasar untuk
            membantu perkiraan awal. Harga asli bisa berbeda tergantung kota,
            bengkel resmi atau bukan, dan kondisi motor. Untuk angka yang lebih
            pasti, tanyakan langsung ke bengkel.
          </p>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/diagnosa"
            className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            🔧 Cek biaya motor saya
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}