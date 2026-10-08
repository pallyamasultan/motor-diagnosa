import type { MotorModel } from "./motor-data";

/**
 * Konten dasar untuk halaman detail motor.
 *
 * CATATAN: ini masih placeholder yang diturunkan dari TIPE motor,
 * belum data kurasi per model. Nanti bisa diganti satu per satu.
 */

export interface ModelContent {
  keluhanUmum: string[];
  intervalSpa: string;
  catatanSpa: string;
}

const CONTENT_BY_TYPE: Record<MotorModel["type"], ModelContent> = {
  Matic: {
    keluhanUmum: [
      "Tarikan terasa berat, terutama saat menyalip",
      "Bunyi 'klak' saat perpindahan gigi dari gelap ke terang",
      "Oli berubah warna atau berbau gosong",
      "Motor tersendat-nyendat saat mulai jalan",
    ],
    intervalSpa: "Setiap 2.500 - 3.000 km",
    catatanSpa: "Servis CVT rutin adalah kunci umur panjang motor matic.",
  },
  Listrik: {
    keluhanUmum: [
      "Jarak tempuh jauh lebih pendek dari perkiraan",
      "Motor tidak mau mengisi daya meskipun sudah dicharger",
      "Baterai terasa cepat habis saat dipakai lama",
      "Lampu indikator menyala tanpa sebab jelas",
    ],
    intervalSpa: "Cek baterai setiap 3 bulan",
    catatanSpa:
      "Hindari mengisi daya di bawah 20 persen dan di atas 80 persen terlalu sering.",
  },
  Bebek: {
    keluhanUmum: [
      "Bunyi decel 'tak tak' saat melepas gas",
      "Bocor di area silinder atau kopling",
      "Susah dihidupkan saat pagi hari",
      "Rantai terasa kasar dan berbunyi",
    ],
    intervalSpa: "Setiap 2.000 - 3.000 km",
    catatanSpa: "Cek kopling dan rantai secara berkala agar motor awet.",
  },
  Sport: {
    keluhanUmum: [
      "Bunyi dari arah rem depan saat ditekan",
      "Kulit kopling mulai licin dan selip",
      "Oli cepat habis atau berubah warna",
      "Bearing roda berbunyi saat berputar",
    ],
    intervalSpa: "Setiap 2.000 - 2.500 km",
    catatanSpa: "Prioritaskan perawatan rem dan kopling demi keselamatan.",
  },
  Offroad: {
    keluhanUmum: [
      "Rantai berantakan saat suspensi ditekan",
      "Bunyi dari arah roda saat putaran pelan",
      "Kabel dan selang getas karena pemakaian luar ruang",
      "Bocor kecil di area filter udara",
    ],
    intervalSpa: "Setiap 1.500 - 2.500 km",
    catatanSpa: "Cek rantai, suspensi, dan bearing setelah pemakaian berat.",
  },
  Supermoto: {
    keluhanUmum: [
      "Bunyi dari arah roda depan saat dikendarai",
      "Rantai cepat kendur setelah dipakai lama",
      "Pelek penyuspensi terasa keras",
      "Oli cepat berkurang padahal tidak bocor terlihat",
    ],
    intervalSpa: "Setiap 2.000 - 3.000 km",
    catatanSpa: "Sering dipakai di aspal, jadi cek Kampas rem dan ban lebih sering.",
  },
  Classic: {
    keluhanUmum: [
      "Bunyi langsam saat mengendingkan gas",
      "Lampu redup saat putaran mesin naik",
      "Karat pada bodi dan knalpot",
      "Rembor kecil di area tangki",
    ],
    intervalSpa: "Setiap 2.000 - 3.000 km",
    catatanSpa: "Simpan di tempat kering dan bersihkan dari garam.",
  },
  Cruiser: {
    keluhanUmum: [
      "Oli cepat habis dan perlu ditambah secara rutin",
      "Bunyi rem dari arah depan",
      "Kulit kopling mulai selip saat menanjak",
      "Baterai sering drop di pagi hari",
    ],
    intervalSpa: "Setiap 2.000 - 3.000 km",
    catatanSpa: "Perawatan rutin penting karena motor ini sering dipakai jarak jauh.",
  },
};

export function getModelContent(model: MotorModel): ModelContent {
  return CONTENT_BY_TYPE[model.type];
}