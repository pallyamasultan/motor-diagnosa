import { SiteNav } from "./SiteNav";
import { SiteFooter } from "./SiteFooter";

/**
 * Kerangka halaman untuk halaman marketing (bukan halaman app).
 * Halaman app seperti /diagnosa tidak memakai ini karena full screen.
 */
export function SiteShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <SiteNav />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </div>
  );
}