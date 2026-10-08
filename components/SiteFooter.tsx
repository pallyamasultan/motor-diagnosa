import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-3 gap-6 text-sm">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span>🔧</span>
              <span className="font-extrabold text-slate-900">Motor Diagnosa</span>
            </div>
            <p className="text-slate-500 leading-relaxed">
              Asisten AI untuk keluhan dan modifikasi tampilan motor.
            </p>
          </div>

          <div>
            <p className="font-bold text-slate-900 mb-2">Halaman</p>
            <ul className="space-y-1.5">
              <li>
                <Link href="/diagnosa" className="text-slate-500 hover:text-blue-600">
                  Diagnosa Motor
                </Link>
              </li>
              <li>
                <Link href="/motor" className="text-slate-500 hover:text-blue-600">
                  Daftar Motor
                </Link>
              </li>
              <li>
                <Link href="/panduan" className="text-slate-500 hover:text-blue-600">
                  Panduan
                </Link>
              </li>
              <li>
                <Link href="/biaya" className="text-slate-500 hover:text-blue-600">
                  Referensi Biaya
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <p className="font-bold text-slate-900 mb-2">Peringatan</p>
            <p className="text-slate-500 leading-relaxed">
              Semua hasil adalah estimasi awal berbasis AI, bukan pengganti
              diagnosa mekanik resmi. Untuk masalah rem, kelistrikan, dan bahan
              bakar, selalu konsultasi ke bengkel.
            </p>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-slate-100 text-xs text-slate-400">
          © {new Date().getFullYear()} Motor Diagnosa. Dibuat untuk pemilik
          motor di Indonesia.
        </div>
      </div>
    </footer>
  );
}