import type { Metadata } from "next";
import { Mail, MapPin, Phone } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { InquiryForm } from "@/components/public/InquiryForm";
import { SectionHeading } from "@/components/public/SectionHeading";
import { publicApi } from "@/lib/api";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with GSR International Certifications. Contact our certification team for ISO certification support, audit coordination, and compliance services.",
  openGraph: { title: "Contact Us | GSR International Certifications", url: "https://www.gsrinternationalcertifications.com/contact" },
  alternates: { canonical: "https://www.gsrinternationalcertifications.com/contact" }
};

export default async function ContactPage() {
  const settings = await publicApi.settings().catch(() => undefined);

  return (
    <PublicShell>
      <section className="section bg-[#e9f1fa]">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Contact" title="Talk to the certification desk." />
            <div className="mt-6 rounded-2xl border border-[#d6a842]/20 bg-white p-5 shadow-soft">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#b8862b]">Business Name</p>
              <p className="mt-2 text-lg font-extrabold text-[#071b3f]">GSR International Certifications</p>
            </div>
            <div className="mt-4 grid gap-4">
              {[
                [Mail, settings?.contactEmail || "gsrinternationalcertifications@gmail.com"],
                [Phone, settings?.contactNumber || "8008035779; 7075999265"],
                [MapPin, settings?.address || "India"]
              ].map(([Icon, text]) => (
                <div key={String(text)} className="lift-card flex items-center gap-4 rounded-2xl border border-[#d6a842]/20 bg-white p-5 shadow-soft">
                  <Icon className="text-[#b8862b]" />
                  <span className="font-medium">{String(text)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded-2xl bg-white shadow-soft">
              {settings?.mapUrl ? (
                <iframe src={settings.mapUrl} className="h-72 w-full border-0" loading="lazy" title="Company map" />
              ) : (
                <div className="grid h-72 place-items-center bg-white text-center font-semibold text-[#b8862b]">
                  Google Maps embed can be added from Settings.
                </div>
              )}
            </div>
          </div>
          <div className="rounded-2xl border border-[#d6a842]/20 bg-white p-6 shadow-soft md:p-8">
            <InquiryForm source="Contact" />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
