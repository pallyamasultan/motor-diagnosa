/**
 * Daftar artikel panduan singkat.
 * PLACEHOLDER — nanti bisa dipindah ke database atau CMS.
 */

export interface Artikel {
  slug: string;
  judul: string;
  kategori: string;
  ringkas: string;
  poin: string[];
}

export const ARTIKEL: Artikel[] = [
  {
    slug: "mesin-susah-dihidupkan",
    judul: "Mesin Motor Susah Dihidupkan",
    kategori: "Mesin",
    ringkas:
      "Mesin yang tidak mau hidup saat pertama dinyalakan adalah keluhan paling umum.",
    poin: [
      "Periksa kabel aki dan kondisi terminalnya",
      "Cek busi apakah sudah kotor atau basah",
      "Pastikan katup choking pada posisi benar saat mesin dingin",
      "Kalau sering terjadi, kemungkinan perlu cek injektor atau sensor",
    ],
  },
  {
    slug: "tarikan-berat",
    judul: "Kenapa Motor Tarikan Terasa Berat?",
    kategori: "Performa",
    ringkas:
      "Tarikan berat adalah tanda gangguan. Jangan dipaksa, bisa berujung mesin rusak.",
    poin: [
      "Motor matic: cek kondisi CVT dan roller",
      "Motor bebek: cek filter udara yang tersumbat",
      "Periksa tekanan ban, ban kempis ikut membuat motor berat",
      "Kalau mendadak berat, segera cek di bengkel",
    ],
  },
  {
    slug: "rem-bunyi",
    judul: "Rem Bunyi Saat Ditekan",
    kategori: "Rem",
    ringkas:
      "Rem berbunyi tidak boleh diabaikan. Ini termasuk komponen keselamatan.",
    poin: [
      "Biasanya kampas rem sudah menipis",
      "Bisa juga karena disc brake tergores atau berkarat",
      "Cairan rem perlu diganti minimal 2 tahun sekali",
      "Wajib ke bengkel, jangan dikerjakan sendiri",
    ],
  },
  {
    slug: "arti-lampu-indikator",
    judul: "Arti Lampu Indikator Motor Menyala",
    kategori: "Kelistrikan",
    ringkas:
      "Lampu indikator menyala berarti ada sistem yang perlu diperiksa segera.",
    poin: [
      "Lampu merah: indikasi serius, segera hentikan motor",
      "Lampu kuning: tekanan atau sensor bermasalah",
      "Lampu bensi: bensin menipis",
      "Semua termasuk kelistrikan, wajib ke bengkel",
    ],
  },
  {
    slug: "servis-cvt",
    judul: "Kapan Motor Matic Perlu Servis CVT?",
    kategori: "Perawatan",
    ringkas:
      "CVT adalah komponen mahal motor matic. Perawatan rutin jauh lebih murah daripada penggantian.",
    poin: [
      "Servis setiap 2.500 sampai 3.000 km",
      "Bunyi klak saat perpindahan gigi adalah tanda awal",
      "Hindari tarikan mendadak di jalan",
      "Ganti oli CVT sesuai anjuran bengkel",
    ],
  },
  {
    slug: "bunyi-asing-mesin",
    judul: "Bunyi Asing dari Mesin, Apa Artinya?",
    kategori: "Mesin",
    ringkas:
      "Bunyi bisa jadi ringan, tapi juga tanda kerusakan mahal kalau diabaikan.",
    poin: [
      "Bunyi tak tak saat gas: biasanya seker idle",
      "Bunyi berat: bisa bearing atau karburator",
      "Bunyi dari knalpot: cek gasket head atau knalpot bocor",
      "Kalau tidak hilang, bawa ke bengkel",
    ],
  },
];