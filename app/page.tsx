import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { MOTOR_DATA } from "@/knowledge/motor-data";

const LANGKAH = [
  {
    nomor: "1",
    judul: "Sebut motor Anda",
    teks: "Pilih merk dan tipe motor yang Anda pakai.",
  },
  {
    nomor: "2",
    judul: "Ceritakan keluhan",
    teks: "Tulis apa yang terasa salah. Boleh sesingkat apa saja.",
  },
  {
    nomor: "3",
    judul: "Baca kartu hasil",
    teks: "Dapat perkiraan penyebab, pilihan sparepart, dan estimasi biaya.",
  },
];

const FITUR = [
  {
    emoji: "🔍",
    judul: "Analisa kemunculan penyebab",
    teks: "AI menduga penyebab berdasarkan keluhan Anda, lalu mengurutkan dari yang paling mungkin.",
  },
  {
    emoji: "🔧",
    judul: "Rekomendasi sparepart 3 tingkat",
    teks: "Standar, aftermarket, sampai racing, diurutkan dari harga tertinggi.",
  },
  {
    emoji: "💰",
    judul: "Harga dari pencarian nyata",
    teks: "Harga diambil dari pencarian toko online, bukan dikarang oleh AI.",
  },
];

const CONTOH_KELUHAN = [
  "Tarikan terasa berat",
  "Susah hidup pagi hari",
  "Rem bunyi saat diinjak",
  "Lampu sein tidak menyala",
  "Mau ganti velg racing",
];

export default function Beranda() {
  return (
    <SiteShell>
      {/* Hero */}
      <section className="bg-gradient-to-b from-blue-600 to-blue-700 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 md:py-20 text-center">
          <span className="text-5xl block mb-4">🏍️</span>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-3">
            Motor Diagnosa
          </h1>
          <p className="text-blue-100 max-w-xl mx-auto leading-relaxed mb-8">
            Ceritakan keluhan motor Anda, dapatkan perkiraan penyebab, sparepart,
            dan biaya servis dari tangan mekanik.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/diagnosa"
              className="px-6 py-3 rounded-xl bg-white text-blue-700 font-bold shadow-lg hover:bg-blue-50 transition-colors"
            >
              🔧 Mulai Diagnosa
            </Link>
            <Link
              href="/motor"
              className="px-6 py-3 rounded-xl bg-blue-800/60 border border-blue-400/40 font-bold hover:bg-blue-800 transition-colors"
            >
              Lihat Daftar Motor
            </Link>
          </div>
        </div>
      </section>

      {/* Cara kerja */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">
          Cara kerja, cuma 3 langkah
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Tidak perlu login, tidak perlu pilih menu yang ribet.
        </p>
        <div className="grid sm:grid-cols-3 gap-4">
          {LANGKAH.map((s) => (
            <div
              key={s.nomor}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm"
            >
              <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center mb-3">
                {s.nomor}
              </span>
              <h3 className="font-bold text-slate-900 mb-1">{s.judul}</h3>
              <p className="text-sm text-slate-500 leading-relaxed">{s.teks}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Fitur */}
      <section className="bg-white border-y border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <h2 className="text-xl font-extrabold text-slate-900 mb-6">
            Apa yang Anda dapatkan
          </h2>
          <div className="grid sm:grid-cols-3 gap-4">
            {FITUR.map((f) => (
              <div
                key={f.judul}
                className="rounded-2xl border border-slate-200 p-5"
              >
                <span className="text-2xl block mb-2">{f.emoji}</span>
                <h3 className="font-bold text-slate-900 mb-1">{f.judul}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{f.teks}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contoh keluhan */}
      <section className="max-w-5xl mx-auto px-4 py-12">
        <h2 className="text-xl font-extrabold text-slate-900 mb-2">
          Contoh keluhan yang bisa ditanyakan
        </h2>
        <p className="text-slate-500 text-sm mb-6">
          Klik salah satu untuk langsung masuk ke halaman diagnosa.
        </p>
        <div className="flex flex-wrap gap-2">
          {CONTOH_KELUHAN.map((c) => (
            <Link
              key={c}
              href={`/diagnosa?q=${encodeURIComponent(c)}`}
              className="px-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
            >
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* Motor populer */}
      <section className="bg-white border-t border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-extrabold text-slate-900">
              Pilih motor Anda
            </h2>
            <Link
              href="/motor"
              className="text-sm font-semibold text-blue-600 hover:text-blue-700"
            >
              Semua motor →
            </Link>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.values(MOTOR_DATA).map((brand) => (
              <Link
                key={brand.id}
                href={`/motor`}
                className="group bg-slate-50 rounded-2xl border border-slate-200 p-5 text-center hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <div
                  className={`w-12 h-12 rounded-full ${brand.color} text-white font-bold text-xl flex items-center justify-center mx-auto mb-2 group-hover:scale-110 transition-transform`}
                >
                  {brand.name[0]}
                </div>
                <p className="font-bold text-slate-800 text-sm">{brand.name}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </SiteShell>
  );
}