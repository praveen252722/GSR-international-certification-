import { PublicShell } from "@/components/public/PublicShell";

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="brand-surface relative overflow-hidden py-20 text-white">
        <div className="container">
          <h1 className="font-sans text-4xl font-extrabold md:text-6xl">About GSR INTERNATIONAL CERTIFICATIONS</h1>
          <p className="mt-4 max-w-2xl text-lg text-white/80">
            Helping organizations achieve and maintain management-system certification with transparent, rigorous support.
          </p>
        </div>
      </section>
      <section className="section bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="grid place-items-center">
            <img src="/gsr-logo.png" alt="GSR logo" className="h-24 w-24 object-contain" />
          </div>
          <div className="mt-8 space-y-6 text-center text-lg leading-8 text-slate-600">
            <p>
              GSR INTERNATIONAL CERTIFICATIONS guides organizations through every stage of the certification process — from understanding requirements and preparing documentation, to submitting applications and managing certification visibility through a secure digital workflow.
            </p>
            <p>
              Our team of certification coordinators, auditors, and client-success specialists works closely with each client to ensure practical documentation, audit readiness, and responsive support at every step.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
