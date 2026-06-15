import Link from "next/link";
import type { Settings } from "@/lib/types";

export function Footer({ settings }: { settings?: Settings }) {
  return (
    <footer className="bg-[linear-gradient(120deg,#061b82,#0a57d5)] py-14 text-white">
      <div className="container grid gap-10 md:grid-cols-[1.3fr_0.7fr_0.7fr]">
        <div>
          <div className="flex items-center gap-4">
            <span className="grid h-16 w-16 place-items-center overflow-hidden rounded-full bg-white">
              <img src="/gsr-logo.png" alt="GSR International Certifications logo" className="h-14 w-14 object-contain" />
            </span>
            <div className="font-sans text-2xl font-extrabold">{settings?.companyName || "GSR INTERNATIONAL CERTIFICATIONS"}</div>
          </div>
          <p className="mt-4 max-w-md text-sm leading-7 text-white/70">
            Global Standards | Integrity | Assurance
          </p>
        </div>
        <div>
          <h3 className="font-semibold">Company</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <Link href="/about">About</Link>
            <Link href="/certifications">Certifications</Link>
            <Link href="/organizations">Certified Organizations</Link>
            <Link href="/contact">Contact</Link>
          </div>
        </div>
        <div>
          <h3 className="font-semibold">Contact</h3>
          <div className="mt-4 grid gap-3 text-sm text-white/70">
            <span>{settings?.contactEmail || "gsrinternationalcertifications@gmail.com"}</span>
            <span>{settings?.contactNumber || "8008035779; 7075999265"}</span>
            <span>WhatsApp: {settings?.whatsapp || "7075999265"}</span>
            <span>{settings?.address || "India"}</span>
            <span>{settings?.domain || "gsrinternationalcertifications.com"}</span>
          </div>
        </div>
      </div>
      <div className="container mt-12 border-t border-white/10 pt-6 text-xs text-white/50">
        {"\u00A9"} {new Date().getFullYear()} {settings?.companyName || "GSR INTERNATIONAL CERTIFICATIONS"}. All rights reserved.
      </div>
    </footer>
  );
}
