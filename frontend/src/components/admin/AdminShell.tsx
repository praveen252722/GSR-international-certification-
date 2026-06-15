"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react";
import { Award, Building2, Inbox, LayoutDashboard, LogOut, Menu, Settings, Users, X } from "lucide-react";
import clsx from "clsx";

const nav = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/certifications", label: "Certifications", icon: Award },
  { href: "/admin/organizations", label: "Latest Certified Organizations", icon: Building2 },
  { href: "/admin/inquiries", label: "Inquiries", icon: Inbox },
  { href: "/admin/users", label: "Users", icon: Users },
  { href: "/admin/settings", label: "Settings", icon: Settings }
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      router.replace("/admin/login");
    }
  }, [router]);

  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  function logout() {
    localStorage.removeItem("adminToken");
    window.location.href = "/admin/login";
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#eef4fb] text-[#08172f]">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Mobile drawer sidebar */}
      <aside
        className={clsx(
          "brand-surface fixed inset-y-0 left-0 z-50 flex w-72 max-w-[86vw] flex-col p-5 text-white shadow-xl transition-transform duration-200 lg:hidden",
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white shadow-md">
              <img src="/gsr-logo.png" alt="GSR logo" className="h-12 w-12 object-contain" />
            </span>
            <span>
              <span className="block font-sans text-xl font-extrabold tracking-tight">GSR Admin</span>
              <span className="text-xs uppercase tracking-[0.2em] text-white/70">Control room</span>
            </span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="p-2 text-white/70 hover:text-white">
            <X size={20} />
          </button>
        </div>
        <nav className="mt-10 grid flex-1 gap-1.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-4 py-3 text-sm font-semibold transition-all",
                  active
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Desktop sidebar */}
      <aside className="brand-surface hidden w-64 shrink-0 flex-col p-4 text-white shadow-xl lg:flex">
        <Link href="/admin" className="flex items-center gap-3">
          <span className="grid h-14 w-14 place-items-center overflow-hidden rounded-full bg-white shadow-md">
            <img src="/gsr-logo.png" alt="GSR logo" className="h-12 w-12 object-contain" />
          </span>
          <span>
            <span className="block font-sans text-lg font-extrabold tracking-tight">GSR Admin</span>
            <span className="text-xs uppercase tracking-[0.2em] text-white/70">Control room</span>
          </span>
        </Link>
        <nav className="mt-10 grid flex-1 gap-1.5">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={clsx(
                  "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-semibold transition-all",
                  active
                    ? "bg-white/20 text-white shadow-sm"
                    : "text-white/70 hover:bg-white/10 hover:text-white"
                )}
              >
                <Icon size={18} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="brand-surface shadow-md">
          <div className="flex min-h-16 items-center justify-between gap-3 px-4 md:px-6">
            <div className="flex items-center gap-4">
              <button onClick={() => setSidebarOpen(true)} className="p-2 text-white hover:text-white/80 lg:hidden" aria-label="Open menu">
                <Menu size={22} />
              </button>
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-white/75">Admin panel</p>
                <h1 className="font-sans text-xl font-extrabold text-white">Certification Operations</h1>
              </div>
            </div>
            <button onClick={logout} className="inline-flex items-center gap-2 rounded-lg bg-white/15 px-4 py-2.5 text-sm font-bold text-white backdrop-blur transition hover:bg-white/25">
              <LogOut size={16} /> Logout
            </button>
          </div>
          <nav className="flex gap-2 overflow-x-auto px-4 pb-4 lg:hidden">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="shrink-0 rounded-lg bg-white/15 px-4 py-2 text-sm font-bold text-white backdrop-blur">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>
        <main className="min-w-0 flex-1 overflow-y-auto overflow-x-hidden p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
