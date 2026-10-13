import type { ResultData } from "@/components/ResultCard";

// ─── Types ────────────────────────────────────────────────────────────────────
export interface RiwayatItem {
  id: string;
  motor: string;
  /** Keluhan pertama yang dikirim user */
  keluhan: string;
  tanggal: string; // ISO 8601
  hasil: ResultData;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const LS_KEY = "motor_diagnosa_riwayat";
const MAX_ITEMS = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Muat semua riwayat dari localStorage (aman di SSR). */
export function loadRiwayat(): RiwayatItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? (JSON.parse(raw) as RiwayatItem[]) : [];
  } catch {
    return [];
  }
}

/** Simpan satu hasil diagnosa ke riwayat. FIFO — maks 10 item. */
export function saveRiwayat(
  motor: string,
  keluhan: string,
  hasil: ResultData
): void {
  if (typeof window === "undefined") return;
  const existing = loadRiwayat();

  const newItem: RiwayatItem = {
    id: Math.random().toString(36).slice(2, 10),
    motor,
    keluhan,
    tanggal: new Date().toISOString(),
    hasil,
  };

  // Tambah di depan, potong jika melebihi batas
  const updated = [newItem, ...existing].slice(0, MAX_ITEMS);
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
}

/** Hapus satu item riwayat berdasarkan id. */
export function deleteRiwayat(id: string): void {
  if (typeof window === "undefined") return;
  const updated = loadRiwayat().filter((r) => r.id !== id);
  localStorage.setItem(LS_KEY, JSON.stringify(updated));
}

/** Hapus seluruh riwayat. */
export function clearRiwayat(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LS_KEY);
}

/** Format tanggal ISO ke string lokal Indonesia, mis. "13 Okt 2026, 23:45". */
export function formatTanggal(iso: string): string {
  try {
    return new Date(iso).toLocaleString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return iso;
  }
}
