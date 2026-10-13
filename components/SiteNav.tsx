"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useEffect } from "react";

const LINKS = [
  { href: "/", label: "Beranda" },
  { href: "/diagnosa", label: "Diagnosa" },
  { href: "/riwayat", label: "Riwayat" },
  { href: "/motor", label: "Motor" },
  { href: "/panduan", label: "Panduan" },
  { href: "/biaya", label: "Biaya" },
  { href: "/tentang", label: "Tentang" },
];

export function SiteNav() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);

  // Tutup drawer saat rute berpindah
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // Blokir scroll body saat menu terbuka
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [menuOpen]);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-5xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2 shrink-0">
              <span className="text-xl">🔧</span>
              <span className="font-extrabold text-slate-900 tracking-tight">
                Motor Diagnosa
              </span>
            </Link>

            {/* Nav desktop */}
            <nav className="hidden md:flex flex-wrap items-center gap-1">
              {LINKS.map((link) => {
                const active =
                  link.href === "/"
                    ? pathname === "/"
                    : pathname.startsWith(link.href);
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`px-3 py-1.5 rounded-lg text-sm font-semibold transition-colors ${
                      active
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {link.label}
                  </Link>
                );
              })}
            </nav>

            {/* Tombol hamburger – mobile only */}
            <button
              id="nav-menu-toggle"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Tutup menu" : "Buka menu"}
              aria-expanded={menuOpen}
              className="md:hidden flex flex-col justify-center items-center w-9 h-9 rounded-lg border border-slate-200 bg-white gap-[5px] hover:bg-slate-50 transition-colors shrink-0"
            >
              <span
                className={`block w-5 h-0.5 bg-slate-700 rounded transition-transform duration-300 origin-center ${
                  menuOpen ? "rotate-45 translate-y-[6.5px]" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-slate-700 rounded transition-opacity duration-300 ${
                  menuOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-5 h-0.5 bg-slate-700 rounded transition-transform duration-300 origin-center ${
                  menuOpen ? "-rotate-45 -translate-y-[6.5px]" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Overlay backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/30 backdrop-blur-sm md:hidden"
          onClick={() => setMenuOpen(false)}
          aria-hidden
        />
      )}

      {/* Drawer mobile */}
      <div
        className={`fixed top-0 right-0 z-50 h-full w-72 bg-white shadow-2xl flex flex-col md:hidden transition-transform duration-300 ease-in-out ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Header drawer */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔧</span>
            <span className="font-extrabold text-slate-900 tracking-tight text-sm">
              Motor Diagnosa
            </span>
          </div>
          <button
            onClick={() => setMenuOpen(false)}
            aria-label="Tutup menu"
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-100 hover:text-slate-700 transition-colors"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              className="w-5 h-5"
            >
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Links drawer */}
        <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
          {LINKS.map((link) => {
            const active =
              link.href === "/"
                ? pathname === "/"
                : pathname.startsWith(link.href);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${
                  active
                    ? "bg-blue-600 text-white"
                    : "text-slate-700 hover:bg-slate-100"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Footer drawer */}
        <div className="px-5 py-4 border-t border-slate-100">
          <Link
            href="/diagnosa"
            onClick={() => setMenuOpen(false)}
            className="block w-full text-center py-3 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors"
          >
            🔧 Mulai Diagnosa
          </Link>
        </div>
      </div>
    </>
  );
}