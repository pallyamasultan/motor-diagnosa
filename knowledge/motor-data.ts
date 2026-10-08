export type BrandId = "honda" | "yamaha" | "suzuki" | "kawasaki";

export type MotorType =
  | "Matic"
  | "Bebek"
  | "Sport"
  | "Offroad"
  | "Classic"
  | "Cruiser"
  | "Supermoto"
  | "Listrik";

export interface MotorModel {
  id: string;
  name: string;
  type: MotorType;
  /** Tahun rilis. Untuk motor klasik ditulis dekadanya, mis. "1990-an". */
  tahun: string;
}

export interface BrandData {
  id: BrandId;
  name: string;
  color: string; // Tailwind color class for UI
  models: MotorModel[];
}

/**
 * Data motor: era modern (2016 - 2026) dan era klasik (1970-an - 2015).
 *
 * Aturan:
 * - Satu halaman per NAMA model. Varian berbedanama (NMAX Turbo vs NMAX Neo)
 *   tetap halaman sendiri, tapi strongholdnama sama digabung dengan tahun
 *   gabungan, mis. "2016-2026".
 * - Motor listrik memakai tipe "Listrik".
 */

// ═══════════════════════════════════════════════════════════════
// YAMAHA
// ═══════════════════════════════════════════════════════════════
const YAMAHA: MotorModel[] = [
  // ── Era modern ──
  { id: "grand-filano", name: "Grand Filano", type: "Matic", tahun: "2022-2026" },
  { id: "fazzio", name: "Fazzio", type: "Matic", tahun: "2021-2026" },
  { id: "mt-15", name: "MT-15", type: "Sport", tahun: "2018-2026" },
  { id: "xsr-155", name: "XSR 155", type: "Sport", tahun: "2019-2026" },
  { id: "nmax-turbo", name: "NMAX Turbo", type: "Matic", tahun: "2024" },
  { id: "nmax-neo", name: "NMAX Neo", type: "Matic", tahun: "2024" },
  { id: "nmax-155", name: "NMAX 155", type: "Matic", tahun: "2015-2019" },
  { id: "lexi-lx-155", name: "Lexi LX 155", type: "Matic", tahun: "2024" },
  { id: "lexi-125", name: "Lexi 125", type: "Matic", tahun: "2018" },
  { id: "r25", name: "R25", type: "Sport", tahun: "2010-2024" },
  { id: "r15m", name: "R15M", type: "Sport", tahun: "2021" },
  { id: "r15", name: "R15", type: "Sport", tahun: "2010-2021" },
  { id: "jupiter-z1", name: "Jupiter Z1", type: "Bebek", tahun: "2024" },
  { id: "aerox-155", name: "Aerox 155", type: "Matic", tahun: "2017-2020" },
  { id: "aerox-125", name: "Aerox 125", type: "Matic", tahun: "2016" },
  { id: "mio-m3", name: "Mio M3", type: "Matic", tahun: "2023" },
  { id: "mio-s-125", name: "Mio S 125", type: "Matic", tahun: "2017" },
  { id: "mx-king-150", name: "MX King 150", type: "Bebek", tahun: "2016-2023" },
  { id: "yzf-r7", name: "YZF-R7", type: "Sport", tahun: "2022" },
  { id: "xmax", name: "XMAX", type: "Matic", tahun: "2017-2022" },
  { id: "vixion", name: "Vixion", type: "Sport", tahun: "2007-2017" },
  { id: "vixion-r", name: "Vixion R", type: "Sport", tahun: "2017" },
  { id: "vega-force", name: "Vega Force", type: "Matic", tahun: "2021" },
  { id: "gear-125", name: "Gear 125", type: "Matic", tahun: "2020" },
  { id: "freego", name: "FreeGo", type: "Matic", tahun: "2018" },
  { id: "mt-07", name: "MT-07", type: "Sport", tahun: "2020" },
  { id: "mt-09", name: "MT-09", type: "Sport", tahun: "2020" },
  { id: "mt-25", name: "MT-25", type: "Sport", tahun: "2016" },
  { id: "wr-155r", name: "WR 155R", type: "Offroad", tahun: "2019" },
  { id: "xabre-150", name: "Xabre 150", type: "Bebek", tahun: "2016" },
  { id: "nouvo", name: "Nouvo", type: "Matic", tahun: "2002-2005" },
  { id: "mio-sporty", name: "Mio Sporty", type: "Matic", tahun: "2003-2008" },
  { id: "jupiter-z", name: "Jupiter Z", type: "Bebek", tahun: "2000-an" },
  { id: "byson", name: "Byson", type: "Sport", tahun: "2010-2015" },
  { id: "scorpio-z", name: "Scorpio Z", type: "Cruiser", tahun: "2000-an" },
  { id: "rx-king-135", name: "RX-King 135", type: "Bebek", tahun: "1983-2005" },
  { id: "tzm-150", name: "TZM 150", type: "Sport", tahun: "1990-an" },
  { id: "f1zr", name: "F1ZR / Force 1", type: "Sport", tahun: "1990-an" },
  { id: "alfa-sigma", name: "Alfa / Sigma", type: "Bebek", tahun: "1990-an" },
  { id: "rx-100", name: "RX 100 / RX-K", type: "Sport", tahun: "1970-an-1980-an" },
  { id: "l2-super", name: "L2 Super / L2G", type: "Sport", tahun: "1970-an-1980-an" },
  { id: "v75", name: "V75 / V80", type: "Classic", tahun: "1970-an-1980-an" },
];
// ═══════════════════════════════════════════════════════════════
// HONDA
// ═══════════════════════════════════════════════════════════════
const HONDA: MotorModel[] = [
  // ── Era modern ──
  { id: "beat", name: "BeAT", type: "Matic", tahun: "2008-2026" },
  { id: "pcx-160", name: "PCX 160", type: "Matic", tahun: "2021-2026" },
  { id: "pcx", name: "PCX 125 / 150", type: "Matic", tahun: "2010-2018" },
  { id: "vario-160", name: "Vario 160", type: "Matic", tahun: "2022" },
  { id: "vario", name: "Vario 110 / 125 / 150", type: "Matic", tahun: "2006-2018" },
  { id: "scoopy", name: "Scoopy", type: "Matic", tahun: "2010-2020" },
  { id: "stylo-160", name: "Stylo 160", type: "Matic", tahun: "2023" },
  { id: "adv-160", name: "ADV 160", type: "Matic", tahun: "2022" },
  { id: "adv-150", name: "ADV 150", type: "Matic", tahun: "2019" },
  { id: "ct125", name: "CT125", type: "Matic", tahun: "2010-2024" },
  { id: "super-cub-c125", name: "Super Cub C125", type: "Matic", tahun: "2018-2026" },
  { id: "genio-110", name: "Genio 110", type: "Matic", tahun: "2019" },
  { id: "rev-x", name: "Revo X", type: "Bebek", tahun: "2010-2023" },
  { id: "revo-fit", name: "Revo Fit", type: "Bebek", tahun: "2023" },
  { id: "cb150-verza", name: "CB150 Verza", type: "Bebek", tahun: "2018" },
  { id: "supra-x-125", name: "Supra X 125 / Karisma 125", type: "Bebek", tahun: "2000-an-2019" },
  { id: "supra-gtr-150", name: "Supra GTR 150", type: "Sport", tahun: "2016-2022" },
  { id: "cbr250rr", name: "CBR250RR", type: "Sport", tahun: "2016-2024" },
  { id: "cbr150r", name: "CBR150R", type: "Sport", tahun: "2020" },
  { id: "cb150r-streetfire", name: "CB150R StreetFire", type: "Sport", tahun: "2010-2021" },
  { id: "tiger-2000", name: "Tiger 2000", type: "Sport", tahun: "1993" },
  { id: "nsr-150", name: "NSR 150 R / SP", type: "Sport", tahun: "1990-an" },
  { id: "cs1", name: "CS1", type: "Sport", tahun: "2000-an" },
  { id: "cb125", name: "CB100 / CB125", type: "Sport", tahun: "1970-an-1980-an" },
  { id: "gl-max", name: "GL100 / GL Max", type: "Sport", tahun: "1970-an-1980-an" },
  { id: "astrea", name: "Astrea 800 / Astrea Star", type: "Bebek", tahun: "1970-an-1980-an" },
  { id: "astrea-grand", name: "Astrea Grand", type: "Bebek", tahun: "1990-an" },
  { id: "megapro", name: "MegaPro", type: "Bebek", tahun: "2000-an" },
  { id: "crf150l", name: "CRF150L", type: "Offroad", tahun: "2017" },
  { id: "crf250l", name: "CRF250L", type: "Offroad", tahun: "2023" },
  { id: "crf250-rally", name: "CRF250 RALLY", type: "Offroad", tahun: "2018" },
  { id: "c70", name: "C70 Pitung", type: "Classic", tahun: "1970-an-1980-an" },
  { id: "supra-100", name: "Supra 100", type: "Sport", tahun: "1997" },
  { id: "icon-e", name: "ICON e:", type: "Listrik", tahun: "2025-2026" },
  { id: "cuv-e", name: "CUV e:", type: "Listrik", tahun: "2025-2026" },
  { id: "em1-e", name: "EM1 e:", type: "Listrik", tahun: "2023" },
];

// ═══════════════════════════════════════════════════════════════
// SUZUKI
// ═══════════════════════════════════════════════════════════════
const SUZUKI: MotorModel[] = [
  // ── Era modern ──
  { id: "avenis-125", name: "Avenis 125", type: "Matic", tahun: "2022-2026" },
  { id: "v-strom-250sx", name: "V-Strom 250 SX", type: "Sport", tahun: "2023-2026" },
  { id: "gixxer-sf-250", name: "GIXXER SF 250", type: "Sport", tahun: "2021-2026" },
  { id: "burgman-street-125ex", name: "Burgman Street 125EX", type: "Matic", tahun: "2023-2024" },
  { id: "satria-f150", name: "Satria F150", type: "Bebek", tahun: "2004-2026" },
  { id: "gsxr-150", name: "GSX-R150", type: "Sport", tahun: "2016-2026" },
  { id: "gsxs-150", name: "GSX-S150", type: "Sport", tahun: "2016" },
  { id: "smash", name: "Smash FI / Smash 110", type: "Bebek", tahun: "2000-an-2019" },
  { id: "nex-crossover", name: "Nex Crossover", type: "Matic", tahun: "2021" },
  { id: "nex-ii-cross", name: "Nex II Cross", type: "Matic", tahun: "2019" },
  { id: "nex", name: "Nex / Nex II", type: "Matic", tahun: "2010-2018" },
  { id: "address", name: "Address", type: "Matic", tahun: "2016" },
  { id: "saluto-125", name: "Saluto 125", type: "Matic", tahun: "2020" },
  { id: "bandit-150", name: "Bandit 150", type: "Bebek", tahun: "2018" },
  { id: "shogun-125", name: "Shogun 125", type: "Bebek", tahun: "2000-an" },
  { id: "shogun-110", name: "Shogun 110 Kebo", type: "Bebek", tahun: "1996" },
  { id: "satria-120", name: "Satria 120S / RU", type: "Bebek", tahun: "1990-an" },
  { id: "fr80", name: "FR80", type: "Bebek", tahun: "1970-an-1980-an" },
  { id: "a100", name: "A100", type: "Sport", tahun: "1970-an-1980-an" },
  { id: "inazuma-250", name: "Inazuma 250", type: "Cruiser", tahun: "2010-2015" },
  { id: "thunder-125", name: "Thunder 125 / 250", type: "Cruiser", tahun: "2000-an" },
  { id: "hayate-125", name: "Hayate 125", type: "Matic", tahun: "2010-2015" },
  { id: "spin-125", name: "Spin 125", type: "Matic", tahun: "2000-an" },
  { id: "skywave", name: "Skywave / Skydrive", type: "Matic", tahun: "2000-an" },
  { id: "tornado", name: "Tornado GS / GX", type: "Bebek", tahun: "1990-an" },
  { id: "crystal", name: "RC100 / Bravo / Crystal", type: "Bebek", tahun: "1990-an" },
  { id: "rgr-150", name: "RGR 150", type: "Sport", tahun: "1990-an" },
];

// ═══════════════════════════════════════════════════════════════
// KAWASAKI
// ═══════════════════════════════════════════════════════════════
const KAWASAKI: MotorModel[] = [
  // ── Era modern ──
  { id: "klx-230sm", name: "KLX 230SM", type: "Supermoto", tahun: "2022-2026" },
  { id: "klx-230s", name: "KLX 230S", type: "Supermoto", tahun: "2022" },
  { id: "klx-230r", name: "KLX 230R", type: "Offroad", tahun: "2019" },
  { id: "klx-230", name: "KLX 230", type: "Offroad", tahun: "2019-2026" },
  { id: "klx-150bf", name: "KLX 150BF", type: "Offroad", tahun: "2020" },
  { id: "klx-150", name: "KLX 150", type: "Offroad", tahun: "2009-2023" },
  { id: "klx-250", name: "KLX 250", type: "Offroad", tahun: "2017" },
  { id: "d-tracker-150", name: "D-Tracker 150", type: "Offroad", tahun: "2010-2015" },
  { id: "ninja-zx-25rr", name: "Ninja ZX-25RR", type: "Sport", tahun: "2022-2026" },
  { id: "ninja-zx-25r", name: "Ninja ZX-25R", type: "Sport", tahun: "2020-2026" },
  { id: "ninja-zx-4rr", name: "Ninja ZX-4RR", type: "Sport", tahun: "2023" },
  { id: "ninja-zx-10r", name: "Ninja ZX-10R", type: "Sport", tahun: "2016" },
  { id: "ninja-zx-6r", name: "Ninja ZX-6R", type: "Sport", tahun: "2019" },
  { id: "ninja-250", name: "Ninja 250", type: "Sport", tahun: "2008-2018" },
  { id: "ninja-250r", name: "Ninja 250R", type: "Sport", tahun: "2008" },
  { id: "z250", name: "Z250 / Z250SL", type: "Sport", tahun: "2010-2015" },
  { id: "ninja-krr-150", name: "Ninja 150RR / KRR ZX150", type: "Sport", tahun: "2000-an" },
  { id: "ninja-150r", name: "Ninja 150R Barong", type: "Bebek", tahun: "1990-an" },
  { id: "z-h2", name: "Z H2", type: "Sport", tahun: "2020" },
  { id: "z900", name: "Z900", type: "Sport", tahun: "2016" },
  { id: "z650", name: "Z650 / Z650RS", type: "Cruiser", tahun: "2016-2022" },
  { id: "versys-650", name: "Versys 650", type: "Sport", tahun: "2021" },
  { id: "versys-x-250", name: "Versys-X 250", type: "Sport", tahun: "2016" },
  { id: "w800", name: "W800", type: "Cruiser", tahun: "2021" },
  { id: "meguro-k3", name: "Meguro K3", type: "Cruiser", tahun: "2021" },
  { id: "w175", name: "W175", type: "Matic", tahun: "2017-2026" },
  { id: "w175-cafe", name: "W175 Cafe", type: "Matic", tahun: "2018" },
  { id: "w175-tr", name: "W175 TR", type: "Matic", tahun: "2019" },
  { id: "elim-450", name: "Eliminator 450", type: "Cruiser", tahun: "2023" },
  { id: "binter-merzy", name: "Binter Merzy KZ200", type: "Cruiser", tahun: "1980-an" },
  { id: "binter-joy", name: "Binter Joy / AR125", type: "Bebek", tahun: "1980-an" },
  { id: "kaze-110", name: "Kaze 110", type: "Bebek", tahun: "1990-an" },
  { id: "blitz-r", name: "Blitz R / Edge", type: "Bebek", tahun: "2000-an" },
  { id: "ninja-e1", name: "Ninja e-1", type: "Listrik", tahun: "2024" },
  { id: "z-e1", name: "Z e-1", type: "Listrik", tahun: "2024" },
];

export const MOTOR_DATA: Record<BrandId, BrandData> = {
  yamaha: {
    id: "yamaha",
    name: "Yamaha",
    color: "bg-blue-700",
    models: YAMAHA,
  },
  honda: {
    id: "honda",
    name: "Honda",
    color: "bg-red-600",
    models: HONDA,
  },
  suzuki: {
    id: "suzuki",
    name: "Suzuki",
    color: "bg-blue-500",
    models: SUZUKI,
  },
  kawasaki: {
    id: "kawasaki",
    name: "Kawasaki",
    color: "bg-green-600",
    models: KAWASAKI,
  },
};

// ──────────────────────────────────────────────────────────────────────────────
// Helper untuk halaman-halaman website
// ──────────────────────────────────────────────────────────────────────────────

export function getBrand(id: string): BrandData | undefined {
  return (MOTOR_DATA as Record<string, BrandData>)[id];
}

export function getModel(
  brandId: string,
  modelId: string
): MotorModel | undefined {
  return getBrand(brandId)?.models.find((m) => m.id === modelId);
}

/** Nama motor lengkap, misal "Honda BeAT" - format sama dengan yang dikirim ke AI */
export function modelFullName(brand: BrandData, model: MotorModel): string {
  return `${brand.name} ${model.name}`;
}

/** Semua kombinasi brand+model, untuk generateStaticParams dan daftar motor */
export function allModelEntries() {
  return (Object.keys(MOTOR_DATA) as BrandId[]).flatMap((brandId) =>
    MOTOR_DATA[brandId].models.map((model) => ({
      brandId,
      modelId: model.id,
      brand: MOTOR_DATA[brandId],
      model,
    }))
  );
}

/** Hitung total motor per merk */
export function brandStats() {
  return (Object.keys(MOTOR_DATA) as BrandId[]).map((id) => ({
    brand: MOTOR_DATA[id],
    total: MOTOR_DATA[id].models.length,
  }));
}
