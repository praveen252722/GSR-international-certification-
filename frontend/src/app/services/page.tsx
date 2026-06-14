import { ArrowRight } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { services } from "@/data/services";

export default function ServicesPage() {
  return (
    <PublicShell>
      <section className="section bg-white">
        <div className="container">
          <SectionHeading
            eyebrow="Services"
            title="A complete support suite for certification planning, readiness, and maintenance."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {services.map((service) => (
              <article key={service.title} className="lift-card rounded border border-moss/10 bg-white p-7 shadow-soft">
                <div className="flex items-start gap-4">
                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded bg-moss text-white">
                    <ArrowRight size={18} />
                  </span>
                  <div>
                    <h2 className="text-2xl font-semibold">{service.title}</h2>
                    <p className="mt-3 leading-7 text-graphite/70">{service.description}</p>
                    <p className="mt-4 text-sm leading-7 text-graphite/60">{service.detail}</p>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
