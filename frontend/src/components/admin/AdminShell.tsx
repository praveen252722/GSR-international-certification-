"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { Award, Building2, Inbox, LayoutDashboard, LogOut, Settings } from "lucide-react";
import clsx from "clsx";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/organizations", label: "Latest Certified Organizations", icon: Building2 },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();

  function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  }

  return (
    <div className="min-h-screen bg-mint text-ink">
      <aside className="fixed inset-y-0 left-0 hidden w-72 border-r border-ink/10 bg-ink p-5 text-white lg:block">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white">
            <img src="/gsr-logo.png" alt="GSR logo" className="h-12 w-12 object-contain" />
          </span>
          <span>
            <span className="block font-display text-xl">GSR Admin</span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/50">Control room</span>
          </span>
        </Link>
        <nav className="mt-10 grid gap-2">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded px-4 py-3 text-sm font-medium transition",
                  active ? "bg-white text-ink" : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>
      <div className="lg:pl-72">
        <header className="sticky top-0 z-30 border-b border-moss/10 bg-white/90 backdrop-blur-xl">
          <div className="flex min-h-20 items-center justify-between px-4 md:px-8">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-copper">Admin panel</p>
              <h1 className="font-display text-2xl font-semibold">Certification Operations</h1>
            </div>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded bg-ink px-4 py-3 text-sm font-semibold text-white">
              <LogOut size={16} /> Logout
            </button>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="shrink-0 rounded bg-pearl px-3 py-2 text-sm font-medium">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="p-4 md:p-8">{children}</main>
      </div>
    </div>
  );
}
