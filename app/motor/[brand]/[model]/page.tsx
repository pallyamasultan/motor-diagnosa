import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import {
  MOTOR_DATA,
  getBrand,
  getModel,
  modelFullName,
  allModelEntries,
} from "@/knowledge/motor-data";
import { getModelContent } from "@/knowledge/model-content";

// Halaman ini di-prender untuk semua motor saat build
export function generateStaticParams() {
  return allModelEntries().map(({ brandId, modelId }) => ({
    brand: brandId,
    model: modelId,
  }));
}

type Props = {
  params: Promise<{ brand: string; model: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { brand: brandId, model: modelId } = await params;
  const brand = getBrand(brandId);
  const model = getModel(brandId, modelId);
  if (!brand || !model) return { title: "Motor tidak ditemukan" };

  return {
    title: `${brand.name} ${model.name} — Keluhan & Biaya Servis`,
    description: `Keluhan umum, estimasi biaya servis, dan diagnosa untuk ${brand.name} ${model.name}.`,
  };
}

export default async function MotorDetailPage({ params }: Props) {
  const { brand: brandId, model: modelId } = await params;

  const brand = getBrand(brandId);
  const model = getModel(brandId, modelId);
  if (!brand || !model) notFound();

  const namaMotor = modelFullName(brand, model);
  const konten = getModelContent(model);

  // Link ke diagnosa dengan motor yang sudah dipilih otomatis
  const linkDiagnosa = `/diagnosa?motor=${encodeURIComponent(namaMotor)}`;

  // Motor lain dari merk yang sama
  const motorLain = brand.models.filter((m) => m.id !== model.id).slice(0, 6);

  return (
    <SiteShell>
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-2 text-xs text-slate-400 mb-6">
          <Link href="/" className="hover:text-blue-600">
            Beranda
          </Link>
          <span>/</span>
          <Link href="/motor" className="hover:text-blue-600">
            Motor
          </Link>
          <span>/</span>
          <span className="text-slate-600 font-semibold">{namaMotor}</span>
        </nav>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-8">
          <div
            className={`w-16 h-16 rounded-2xl ${brand.color} text-white font-extrabold text-3xl flex items-center justify-center shrink-0`}
          >
            {brand.name[0]}
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              {brand.name} · {model.type} · {model.tahun}
            </p>
            <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              {model.name}
            </h1>
          </div>
        </div>

        {/* CTA utama — inilah titik masuk traffic Google ke aplikasi */}
        <div className="bg-blue-600 text-white rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-extrabold mb-1">
            Ada masalah dengan {namaMotor} Anda?
          </h2>
          <p className="text-blue-100 text-sm mb-4">
            Ceritakan keluhan Anda, AI akan bantu perkirakan penyebab dan biaya
            perbaikannya.
          </p>
          <Link
            href={linkDiagnosa}
            className="inline-block px-5 py-3 rounded-xl bg-white text-blue-700 font-bold hover:bg-blue-50 transition-colors"
          >
            🔧 Diagnosis motor ini
          </Link>
        </div>

        {/* Keluhan umum */}
        <section className="mb-10">
          <h2 className="text-lg font-extrabold text-slate-900 mb-1">
            Keluhan umum {model.name}
          </h2>
          <p className="text-sm text-slate-500 mb-4">
            Keluhan yang sering dilaporkan pengguna {model.name}.
          </p>
          <div className="grid sm:grid-cols-2 gap-3">
            {konten.keluhanUmum.map((k) => (
              <Link
                key={k}
                href={linkDiagnosa}
                className="flex items-center justify-between gap-2 p-4 rounded-xl bg-white border border-slate-200 hover:border-blue-400 hover:bg-blue-50 transition-colors group"
              >
                <span className="text-sm font-semibold text-slate-700">{k}</span>
                <span className="text-slate-300 group-hover:text-blue-500 shrink-0">
                  →
                </span>
              </Link>
            ))}
          </div>
        </section>

        {/* Info perawatan */}
        <section className="bg-white border border-slate-200 rounded-2xl p-6 mb-10">
          <h2 className="text-lg font-extrabold text-slate-900 mb-4">
            Catatan perawatan
          </h2>
          <div className="grid sm:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Interval servis
              </p>
              <p className="font-semibold text-slate-800">{konten.intervalSpa}</p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                Catatan
              </p>
              <p className="font-semibold text-slate-800">{konten.catatanSpa}</p>
            </div>
          </div>
          <Link
            href="/biaya"
            className="inline-block mt-5 text-sm font-semibold text-blue-600 hover:text-blue-700"
          >
            Lihat referensi biaya servis →
          </Link>
        </section>

        {/* Motor lain */}
        {motorLain.length > 0 && (
          <section>
            <h2 className="text-lg font-extrabold text-slate-900 mb-4">
              Motor {brand.name} lainnya
            </h2>
            <div className="flex flex-wrap gap-2">
              {motorLain.map((m) => (
                <Link
                  key={m.id}
                  href={`/motor/${brand.id}/${m.id}`}
                  className="px-4 py-2.5 rounded-full bg-white border border-slate-200 text-sm font-semibold text-slate-700 hover:border-blue-400 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                >
                  {m.name}
                </Link>
              ))}
            </div>
          </section>
        )}

        <p className="mt-10 pt-6 border-t border-slate-200 text-xs text-slate-400 italic">
          Informasi pada halaman ini bersifat umum dan menjadi perkiraan awal.
          Harga dan gejala dapat berbeda tergantung kondisi, tahun, dan lokasi
          bengkel Anda.
        </p>
      </div>
    </SiteShell>
  );
}