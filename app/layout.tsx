import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Motor Diagnosa - Asisten AI Motor Anda",
  description: "Diagnosa kendala dan panduan modifikasi tampilan motor Yamaha, Honda, Suzuki, dan Kawasaki.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        {children}
      </body>
    </html>
  );
}
