import { BadgeCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <PublicShell>
      <section className="section bg-white">
        <div className="container">
          <div className="text-center">
            <SectionHeading
              eyebrow="Services"
              title="A complete support suite for certification planning, readiness, and maintenance."
            />
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service) => (
              <article key={service.title} className="lift-card rounded-2xl border border-[#0a57d5]/10 bg-white p-6 shadow-soft">
                <BadgeCheck className="text-[#0a57d5]" size={22} />
                <h2 className="mt-5 text-lg font-extrabold text-[#08172f]">{service.title}</h2>
                <p className="mt-2 text-sm font-semibold text-[#0a57d5]">{service.description}</p>
                <p className="mt-4 text-sm leading-7 text-slate-600">{service.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
