import type { Metadata } from "next";
import DiagnosaApp from "@/components/DiagnosaApp";

export const metadata: Metadata = {
  title: "Diagnosa Motor — Motor Diagnosa",
  description:
    "Ceritakan keluhan motor Anda dan dapatkan perkiraan penyebab, sparepart, serta biaya servis.",
};

export default function DiagnosaPage() {
  return <DiagnosaApp />;
}