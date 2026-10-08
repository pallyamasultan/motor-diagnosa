import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Tentang — Motor Diagnosa",
  description:
    "Tentang Motor Diagnosa, cara kerjanya, dan batasan hasilnya.",
};

export default function TentangPage() {
  return (
    <SiteShell>
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-6">
          Tentang Motor Diagnosa
        </h1>

        <div className="space-y-8 text-slate-700 leading-relaxed">
          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">
              Apa ini?
            </h2>
            <p>
              Motor Diagnosa adalah asisten AI untuk membantu pemilik motor di
              Indonesia. Anda cukup menyebutkan motor dan keluhan saja, lalu
              sistem memberi perkiraan penyebab, rekomendasi sparepart, dan
              estimasi biaya.
            </p>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">
              Cara kerjanya
            </h2>
            <ol className="space-y-2 list-decimal list-inside">
              <li>Anda memilih motor Anda.</li>
              <li>Anda menuliskan keluhan dalam bahasa sehari-hari.</li>
              <li>
                AI menganalisa dan menampilkan kartu hasil berisi perkiraan
                penyebab, daftar sparepart per tingkat, dan biaya.
              </li>
            </ol>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">
              Dari mana datanya?
            </h2>
            <ul className="space-y-2 list-disc list-inside">
              <li>
                <strong>Analisa:</strong> dibuat oleh model AI dari keluhan yang
                Anda tulis.
              </li>
              <li>
                <strong>Harga sparepart:</strong> diambil dari pencarian web
                aktual ke toko online, beserta tautan sumber dan tanggalnya.
              </li>
              <li>
                <strong>Biaya jasa bengkel:</strong> diambil dari tabel
                referensi internal, bukan dikarang oleh AI.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">
              Batasan penting
            </h2>
            <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
              <p className="text-amber-900 text-sm mb-3">
                Seluruh hasil di situs ini adalah <strong>estimasi awal</strong>,
                bukan hasil pemeriksaan mekanik. Penyebab sebenarnya hanya bisa
                dipastikan setelah motor diperiksa langsung.
              </p>
              <p className="text-amber-900 text-sm mb-3">
                Untuk masalah <strong>rem, kelistrikan, dan sistem bahan bakar</strong>,
                selalu bawa ke bengkel. Jangan mencoba memperbaikinya sendiri.
              </p>
              <p className="text-amber-900 text-sm">
                Jika hasil diagnosa berbeda dengan kondisi motor Anda,keputusan mekanik adalah acuan yang benar.
              </p>
            </div>
          </section>

          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-2">
              Privasi
            </h2>
            <p>
              Situs ini tidak meminta Anda masuk atau membuat akun. Riwayat
              percakapan hanya disimpan di browser Anda sendiri, dan terhapus
              saat Anda menutup sesi.
            </p>
          </section>
        </div>

        <div className="mt-10 text-center">
          <Link
            href="/diagnosa"
            className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            🔧 Mulai Diagnosa
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}