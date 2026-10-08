import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4">
      <div className="text-center">
        <span className="text-6xl block mb-4">🔍</span>
        <h1 className="text-2xl font-extrabold text-slate-900 mb-2">
          Halaman tidak ditemukan
        </h1>
        <p className="text-slate-500 mb-6">
          Motor yang Anda cari mungkin belum tersedia.
        </p>
        <Link
          href="/"
          className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
        >
          ← Kembali ke beranda
        </Link>
      </div>
    </div>
  );
}