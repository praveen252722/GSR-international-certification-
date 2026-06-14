import { Mail, MapPin, Phone } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { InquiryForm } from "@/components/public/InquiryForm";
import { SectionHeading } from "@/components/public/SectionHeading";
import { publicApi } from "@/lib/api";

export default async function ContactPage() {
  const settings = await publicApi.settings().catch(() => undefined);

  return (
    <PublicShell>
      <section className="section bg-pearl">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <SectionHeading eyebrow="Contact" title="Talk to the certification desk." />
            <div className="mt-8 grid gap-4">
              {[
                [Mail, settings?.contactEmail || "gsrinternationalcertifications@gmail.com"],
                [Phone, settings?.contactNumber || "8008035779; 7075999265"],
                [MapPin, settings?.address || "India"]
              ].map(([Icon, text]) => (
                <div key={String(text)} className="lift-card flex items-center gap-4 rounded border border-moss/10 bg-white p-5 shadow-soft">
                  <Icon className="text-copper" />
                  <span className="font-medium">{String(text)}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 overflow-hidden rounded bg-white shadow-soft">
              {settings?.mapUrl ? (
                <iframe src={settings.mapUrl} className="h-72 w-full border-0" loading="lazy" title="Company map" />
              ) : (
                <div className="grid h-72 place-items-center bg-mint text-center font-semibold text-moss">
                  Google Maps embed can be added from Settings.
                </div>
              )}
            </div>
          </div>
          <div className="rounded border border-moss/10 bg-white p-6 shadow-soft md:p-8">
            <InquiryForm source="Contact" />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
