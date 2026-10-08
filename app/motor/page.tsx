import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { MOTOR_DATA } from "@/knowledge/motor-data";

export const metadata: Metadata = {
  title: "Daftar Motor — Motor Diagnosa",
  description:
    "Pilih merk dan tipe motor Honda, Yamaha, Suzuki, atau Kawasaki untuk mulai diagnosa.",
};

export default function MotorIndexPage() {
  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 mb-2">
          Daftar Motor
        </h1>
        <p className="text-slate-500 mb-8">
          Pilih motor Anda untuk melihat keluhan umum dan mulai diagnosa.
        </p>

        <div className="space-y-10">
          {Object.values(MOTOR_DATA).map((brand) => (
            <section key={brand.id}>
              <div className="flex items-center gap-3 mb-4">
                <div
                  className={`w-10 h-10 rounded-full ${brand.color} text-white font-bold flex items-center justify-center`}
                >
                  {brand.name[0]}
                </div>
                <div>
                  <h2 className="text-lg font-extrabold text-slate-900">
                    {brand.name}
                  </h2>
                  <p className="text-xs text-slate-400">
                    {brand.models.length} tipe tersedia
                  </p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {brand.models.map((model) => (
                  <Link
                    key={model.id}
                    href={`/motor/${brand.id}/${model.id}`}
                    className="flex items-center justify-between gap-3 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  >
                    <span className="font-bold text-slate-800 text-sm">
                      {model.name}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-slate-100 px-2 py-1 rounded-md shrink-0 text-center">
                      {model.type}
                      <span className="block font-medium normal-case tracking-normal">
                        {model.tahun}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </SiteShell>
  );
}