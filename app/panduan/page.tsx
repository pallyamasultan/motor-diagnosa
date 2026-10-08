import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { ARTIKEL } from "@/knowledge/artikel";

export const metadata: Metadata = {
  title: "Panduan Motor — Motor Diagnosa",
  description:
    "Panduan singkat penanganan keluhan motor umum: mesin, rem, performa, dan perawatan.",
};

export default function PanduanPage() {
  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
          Panduan
        </h1>
        <p className="text-slate-500 mb-8">
          Penjelasan singkat beberapa keluhan motor yang paling sering muncul.
        </p>

        <div className="space-y-4">
          {ARTIKEL.map((a) => (
            <article
              key={a.slug}
              className="bg-white border border-slate-200 rounded-2xl p-6"
            >
              <div className="flex items-start justify-between gap-3 mb-2">
                <h2 className="text-lg font-extrabold text-slate-900">
                  {a.judul}
                </h2>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md shrink-0">
                  {a.kategori}
                </span>
              </div>

              <p className="text-sm text-slate-600 leading-relaxed mb-4">
                {a.ringkas}
              </p>

              <ul className="space-y-1.5 mb-5">
                {a.poin.map((p, i) => (
                  <li
                    key={i}
                    className="flex gap-2 text-sm text-slate-600"
                  >
                    <span className="text-blue-500 shrink-0">•</span>
                    <span>{p}</span>
                  </li>
                ))}
              </ul>

              <Link
                href="/diagnosa"
                className="inline-block text-sm font-semibold text-blue-600 hover:text-blue-700"
              >
                Tanya motor saya →
              </Link>
            </article>
          ))}
        </div>

        <div className="mt-8 bg-blue-50 border border-blue-100 rounded-2xl p-6 text-center">
          <p className="text-slate-700 mb-4">
            Punya keluhan yang tidak ada di daftar ini?
          </p>
          <Link
            href="/diagnosa"
            className="inline-block px-5 py-3 rounded-xl bg-blue-600 text-white font-bold hover:bg-blue-700 transition-colors"
          >
            🔧 Diagnosis Sekarang
          </Link>
        </div>
      </div>
    </SiteShell>
  );
}