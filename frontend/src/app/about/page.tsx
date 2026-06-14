import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";

const values = ["Independence", "Evidence", "Clarity", "Confidentiality"];

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="brand-surface py-20 text-white">
        <div className="container">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-copper">About</p>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-semibold md:text-6xl">
            GSR INTERNATIONAL CERTIFICATIONS for organizations that value rigor.
          </h1>
        </div>
      </section>
      <section className="section bg-pearl">
        <div className="container grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Company introduction"
            title="Built around transparent certification support."
            text="GSR INTERNATIONAL CERTIFICATIONS helps companies understand requirements, prepare documentation, submit applications, and manage certification visibility through a secure digital workflow."
          />
          <div className="overflow-hidden rounded">
            <img
              src="https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1400&q=80"
              alt="Certification team meeting"
              className="h-full min-h-80 w-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container grid gap-5 md:grid-cols-3">
          {[
            ["Vision", "To make credible management-system certification easier to understand and maintain."],
            ["Mission", "To guide organizations with practical documentation, audit readiness, and responsive support."],
            ["Team", "A multidisciplinary group of certification coordinators, auditors, and client-success specialists."]
          ].map(([title, text]) => (
            <div key={title} className="lift-card rounded border border-moss/10 bg-white p-8">
              <h2 className="font-display text-3xl font-semibold">{title}</h2>
              <p className="mt-4 leading-8 text-graphite/70">{text}</p>
            </div>
          ))}
        </div>
      </section>
      <section className="section bg-mint">
        <div className="container">
          <SectionHeading eyebrow="Values" title="Principles that shape every engagement." />
          <div className="mt-10 grid gap-4 md:grid-cols-4">
            {values.map((value) => (
              <div key={value} className="lift-card rounded border border-moss/10 bg-white p-6 text-center font-semibold shadow-soft">
                {value}
              </div>
            ))}
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
