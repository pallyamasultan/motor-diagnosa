import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import {
  getBrand,
  getModel,
  modelFullName,
  allModelEntries,
} from "@/knowledge/motor-data";
import { getModelContent } from "@/knowledge/model-content";

// ─── Static Params ───────────────────────────────────────────────────────────
export function generateStaticParams() {
  return allModelEntries().map(({ brandId, model }) => ({
    brand: brandId,
    model: model.id,
  }));
}

// ─── Metadata ────────────────────────────────────────────────────────────────
export async function generateMetadata({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}): Promise<Metadata> {
  const { brand: brandId, model: modelId } = await params;
  const brand = getBrand(brandId);
  const model = brand ? getModel(brandId, modelId) : undefined;
  if (!brand || !model) return {};
  const fullName = modelFullName(brand, model);
  return {
    title: `${fullName} — Motor Diagnosa`,
    description: `Keluhan umum, jadwal servis, dan diagnosa AI untuk ${fullName}. Gratis, tanpa login.`,
  };
}

// ─── Komponen badge tipe motor ────────────────────────────────────────────────
const TYPE_COLOR: Record<string, string> = {
  Matic:     "bg-blue-100 text-blue-700",
  Bebek:     "bg-emerald-100 text-emerald-700",
  Sport:     "bg-orange-100 text-orange-700",
  Offroad:   "bg-yellow-100 text-yellow-700",
  Classic:   "bg-purple-100 text-purple-700",
  Cruiser:   "bg-rose-100 text-rose-700",
  Supermoto: "bg-teal-100 text-teal-700",
  Listrik:   "bg-lime-100 text-lime-700",
};

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function MotorDetailPage({
  params,
}: {
  params: Promise<{ brand: string; model: string }>;
}) {
  const { brand: brandId, model: modelId } = await params;
  const brand = getBrand(brandId);
  const model = brand ? getModel(brandId, modelId) : undefined;

  if (!brand || !model) {
    notFound();
  }

  const content   = getModelContent(model);
  const fullName  = modelFullName(brand, model);
  const typeColor = TYPE_COLOR[model.type] ?? "bg-slate-100 text-slate-600";

  // Chip contoh keluhan untuk motor ini
  const contohKeluhan = content.keluhanUmum.slice(0, 3);

  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 py-10">

        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-xs text-slate-400 mb-6 flex-wrap">
          <Link href="/" className="hover:text-blue-600 transition-colors">Beranda</Link>
          <span>/</span>
          <Link href="/motor" className="hover:text-blue-600 transition-colors">Motor</Link>
          <span>/</span>
          <Link href={`/motor/${brandId}`} className="hover:text-blue-600 transition-colors capitalize">{brand.name}</Link>
          <span>/</span>
          <span className="text-slate-600 font-medium">{model.name}</span>
        </nav>

        {/* Header motor */}
        <div className="flex items-start gap-5 mb-10">
          <div
            className={`w-16 h-16 rounded-2xl ${brand.color} text-white font-extrabold text-2xl flex items-center justify-center shrink-0 shadow-md`}
          >
            {brand.name[0]}
          </div>
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 leading-tight mb-1">
              {fullName}
            </h1>
            <div className="flex items-center gap-2 flex-wrap">
              <span className={`text-xs font-bold uppercase tracking-wide px-2.5 py-1 rounded-lg ${typeColor}`}>
                {model.type}
              </span>
              <span className="text-xs text-slate-400 font-medium">
                Tahun {model.tahun}
              </span>
            </div>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">

          {/* Keluhan Umum */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-1">
              🔧 Keluhan Umum
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Masalah yang paling sering dilaporkan pengguna {model.name}.
            </p>
            <ul className="space-y-2.5">
              {content.keluhanUmum.map((keluhan, i) => (
                <li key={i} className="flex items-start gap-2.5">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-blue-100 text-blue-600 text-[10px] font-bold flex items-center justify-center mt-0.5">
                    {i + 1}
                  </span>
                  <span className="text-sm text-slate-700 leading-snug">{keluhan}</span>
                </li>
              ))}
            </ul>

            {/* Chip keluhan cepat */}
            <div className="mt-5 pt-4 border-t border-slate-100">
              <p className="text-xs text-slate-400 font-medium mb-2">Langsung diagnosa keluhan ini:</p>
              <div className="flex flex-wrap gap-2">
                {contohKeluhan.map((k) => (
                  <Link
                    key={k}
                    href={`/diagnosa?motor=${encodeURIComponent(fullName)}&q=${encodeURIComponent(k)}`}
                    className="px-3 py-1.5 text-xs font-semibold rounded-full border border-blue-200 bg-blue-50 text-blue-700 hover:bg-blue-100 hover:border-blue-300 transition-colors"
                  >
                    {k}
                  </Link>
                ))}
              </div>
            </div>
          </section>

          {/* Jadwal Servis */}
          <section className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            <h2 className="text-base font-extrabold text-slate-900 mb-1">
              📅 Jadwal Servis Berkala
            </h2>
            <p className="text-xs text-slate-400 mb-4">
              Estimasi umum untuk tipe {model.type}. Ikuti buku manual untuk angka pasti.
            </p>

            <div className="space-y-3">
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-sm text-slate-600">🔄 Ganti Oli Mesin</span>
                <span className="text-sm font-bold text-slate-800">
                  {model.type === "Sport" ? "2.500 km" : model.type === "Offroad" || model.type === "Supermoto" ? "1.500–2.000 km" : "2.000–2.500 km"}
                </span>
              </div>
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-sm text-slate-600">⚡ Ganti Busi</span>
                <span className="text-sm font-bold text-slate-800">
                  {model.type === "Sport" ? "12.000 km" : "8.000 km"}
                </span>
              </div>
              {(model.type === "Matic") && (
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-sm text-slate-600">⚙️ Servis CVT / V-Belt</span>
                  <span className="text-sm font-bold text-slate-800">20.000–25.000 km</span>
                </div>
              )}
              {(model.type === "Bebek" || model.type === "Sport" || model.type === "Offroad" || model.type === "Supermoto") && (
                <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                  <span className="text-sm text-slate-600">🔗 Rantai & Gear Set</span>
                  <span className="text-sm font-bold text-slate-800">
                    {model.type === "Offroad" || model.type === "Supermoto" ? "10.000–15.000 km" : "15.000 km"}
                  </span>
                </div>
              )}
              <div className="flex justify-between items-center py-2.5 border-b border-slate-100">
                <span className="text-sm text-slate-600">🛑 Kampas Rem</span>
                <span className="text-sm font-bold text-slate-800">10.000–15.000 km</span>
              </div>
              <div className="flex justify-between items-center py-2.5">
                <span className="text-sm text-slate-600">💨 Filter Udara</span>
                <span className="text-sm font-bold text-slate-800">10.000 km</span>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100">
              <p className="text-[11px] text-slate-400 italic leading-relaxed">
                {content.catatanSpa}
              </p>
            </div>
          </section>
        </div>

        {/* CTA Diagnosa */}
        <div className="mt-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-2xl p-6 md:p-8 text-white text-center shadow-lg">
          <p className="text-sm text-blue-100 mb-2">Punya keluhan dengan {model.name} Anda?</p>
          <h2 className="text-xl md:text-2xl font-extrabold mb-4">
            Diagnosa sekarang, gratis 🔧
          </h2>
          <Link
            href={`/diagnosa?motor=${encodeURIComponent(fullName)}`}
            className="inline-block px-6 py-3 bg-white text-blue-700 font-bold rounded-xl text-sm hover:bg-blue-50 shadow-md transition-colors"
          >
            Mulai Diagnosa {model.name}
          </Link>
        </div>

        {/* Link kembali */}
        <div className="mt-8">
          <Link
            href="/motor"
            className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            ← Kembali ke Daftar Motor
          </Link>
        </div>

      </div>
    </SiteShell>
  );
}