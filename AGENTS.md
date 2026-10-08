# Panduan Agen & Aturan Proyek: Motor Diagnosa

Website asisten AI untuk keluhan dan modifikasi tampilan motor (Yamaha, Honda, Suzuki, Kawasaki) bagi pengguna orang awam.

## 1. Stack Teknologi
- **Framework & UI:** Next.js (App Router) + TypeScript + Tailwind CSS.
- **AI & Integrasi (Tahap Mendatang):** Vercel AI SDK, Gemini sebagai model utama.
- **Database/Cache:** Supabase (cache hasil diagnosa).

## 2. Bahasa & Antarmuka (UX)
- Semua teks tampilan wajib menggunakan Bahasa Indonesia yang ramah dan sederhana.
- Alur pengguna hanya 3 langkah:
  1. Sebut motor.
  2. Ceritakan keluhan.
  3. Baca kartu hasil.
- Tidak ada opsi pemilihan model AI bagi pengguna.
- Tidak ada sistem login / autentikasi.

## 3. Keamanan Kunci API
- Kunci API hanya boleh diakses di sisi server (`.env.local`).
- Dilarang mengekspos kunci API ke bundle/klien.
- Pastikan `.env.local` terdaftar di `.gitignore`.

## 4. Aturan Keamanan AI
- **Harga:** Wajib berasal dari hasil web search aktual dengan tautan sumber dan tanggal perolehan. Dilarang mengarang harga.
- **Isu Kritis:** Masalah terkait rem, kelistrikan, dan sistem bahan bakar wajib selalu diarahkan ke bengkel fisik demi keselamatan.
- **Disclaimer:** Selalu sertakan catatan bahwa seluruh hasil adalah estimasi awal.
- **Transparansi:** Jika informasi atau data tidak ditemukan, nyatakan secara terbuka dan jujur.

## 5. Standar Rekomendasi Sparepart
- Rekomendasi dibagi dalam 3 tier:
  1. Standar / Original (OEM)
  2. Aftermarket Berkualitas
  3. Racing
- Urutan tampilan wajib dari harga tertinggi ke termurah.

## 6. Struktur & Konfigurasi Kode
- Konfigurasi model AI terpusat di satu file: `lib/ai-config.ts` (model utama + cadangan).
- File prompt AI disimpan di direktori `prompts/`.
- Basis pengetahuan kurasi disimpan di direktori `knowledge/`.
- Komponen UI disimpan di direktori `components/`.

## 7. Batasan Ruang Lingkup
- Modifikasi mesin berat (bore up, remap/penggantian ECU, injektor) ditunda ke Fase 2.
- Fokus saat ini: diagnosa keluhan umum dan modifikasi tampilan/estetika.

## 8. Workflow Pengerjaan
- Kerjakan satu tahap per perintah.
- Jelaskan secara singkat dan padat setiap hal yang dibuat.

<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
