"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import clsx from "clsx";

const links = [
  { label: "Home", href: "/", id: "home" },
  { label: "About Us", href: "/about", id: "about" },
  { label: "ISO Services", href: "/services", id: "services" },
  { label: "Certifications", href: "/certifications", id: "certs" },
  { label: "Projects", href: "/organizations", id: "projects" },
  { label: "Verify Certificate", href: "/certifications", id: "verify" },
  { label: "Contact", href: "/contact", id: "contact" }
];

export function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[linear-gradient(90deg,#970747_0%,#7d053b_58%,#230713_100%)] shadow-[0_10px_30px_rgba(35,7,19,0.16)]">
      <div className="header-shell flex h-[82px] items-center justify-between gap-5">
        <Link href="/" className="brand-lockup flex min-w-0 items-center gap-3">
          <span className="grid h-[58px] w-[58px] shrink-0 place-items-center overflow-hidden rounded-full bg-white shadow-soft">
            <img src="/gsr-logo.png" alt="GSR International Certifications logo" className="h-[52px] w-[52px] object-contain" />
          </span>
          <span className="min-w-0">
            <span className="block max-w-[calc(100vw-112px)] truncate whitespace-nowrap font-sans text-[15px] font-extrabold uppercase leading-tight text-white sm:max-w-none sm:text-[20px] lg:text-[22px]">
              <span>GSR INTERNATIONAL CERTIFICATIONS</span>
            </span>
            <span className="mt-1 block max-w-[calc(100vw-112px)] truncate text-[11px] font-semibold leading-tight text-white/85 sm:max-w-none sm:text-[14px]">
              Global Standards | Integrity | Assurance
            </span>
          </span>
        </Link>

        <nav className="hidden items-center gap-5 text-[14px] font-bold text-white xl:flex">
          {links.map(({ label, href, id }) => (
            <Link key={id} href={href} className="whitespace-nowrap transition hover:text-white/70">
              {label}
            </Link>
          ))}
        </nav>

        <button
          aria-label="Toggle navigation"
          className="grid h-11 w-11 shrink-0 place-items-center rounded border border-white/20 text-white xl:hidden"
          onClick={() => setOpen((value) => !value)}
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <div className={clsx("border-t border-white/10 bg-moss text-white xl:hidden", open ? "block" : "hidden")}>
        <div className="container grid gap-1 py-4">
          {links.map(({ label, href, id }) => (
            <Link
              key={id}
              href={href}
              className="rounded px-3 py-3 text-sm font-semibold hover:bg-white/10"
              onClick={() => setOpen(false)}
            >
              {label}
            </Link>
          ))}
          <Link href="/apply" className="mt-2 rounded bg-white px-4 py-3 text-center text-sm font-bold text-moss">
            Apply Now
          </Link>
        </div>
      </div>
    </header>
  );
}
