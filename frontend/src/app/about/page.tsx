import { Compass, Target } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export default function AboutPage() {
  return (
    <PublicShell>
      <section className="brand-surface relative overflow-hidden py-20 text-white">
        <div className="container section-reveal">
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-[#d6a842]">About Us</p>
          <h1 className="mt-4 font-sans text-4xl font-extrabold md:text-6xl">About GSR INTERNATIONAL CERTIFICATIONS</h1>
          <p className="mt-4 max-w-2xl text-lg leading-8 text-white/80">
            Helping organizations achieve and maintain management-system certification with transparent, rigorous support.
          </p>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid place-items-center">
            <img src="/gsr-logo.png" alt="GSR logo" className="h-24 w-24 object-contain" />
          </div>
          <div className="section-reveal mt-8 space-y-6 text-center text-lg leading-8 text-slate-600">
            <p>
              GSR INTERNATIONAL CERTIFICATIONS guides organizations through every stage of the certification process,
              from understanding requirements and preparing documentation, to submitting applications and managing
              certification visibility through a secure digital workflow.
            </p>
            <p>
              Our team of certification coordinators, auditors, and client-success specialists works closely with each
              client to ensure practical documentation, audit readiness, and responsive support at every step.
            </p>
          </div>
        </div>
      </section>

      <section className="section bg-[#f8fbff]">
        <div className="container">
          <SectionHeading eyebrow="Founder" title="Leadership with compliance, technology, and trust at the center." />
          <div className="mt-10 grid gap-8 lg:grid-cols-[420px_1fr] lg:items-stretch">
            <div className="section-reveal overflow-hidden rounded-3xl border border-[#d6a842]/20 bg-white shadow-[0_24px_70px_rgba(7,27,63,0.14)]">
              <img
                src="/founder-praveen-talluri.jpeg"
                alt="Rajesh, Founder and Managing Director"
                className="h-full min-h-[440px] w-full object-cover object-center"
              />
            </div>
            <div className="section-reveal rounded-3xl border border-[#d6a842]/20 bg-white p-7 shadow-soft md:p-9">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#b8862b]">Founder & Managing Director</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#071b3f]">Rajesh Kumar</h2>
              <p className="mt-5 text-base leading-8 text-slate-600">
                Rajesh Kumar is a technology-driven entrepreneur and certification management professional focused on
                helping organizations achieve internationally recognized quality standards. With expertise in compliance
                systems, digital transformation, and certification workflows, he has guided numerous organizations
                through successful certification journeys. His vision is to simplify certification processes while
                maintaining the highest standards of integrity, transparency, and professional excellence.
              </p>
              <div className="mt-8 grid gap-4 md:grid-cols-2">
                {[
                  {
                    Icon: Target,
                    title: "Mission",
                    text: "To help businesses achieve global standards through reliable certification support, professional guidance, and technology-enabled solutions."
                  },
                  {
                    Icon: Compass,
                    title: "Vision",
                    text: "To become a trusted international certification partner recognized for quality, integrity, and customer success."
                  }
                ].map(({ Icon, title, text }) => (
                  <div key={title} className="stagger-card rounded-2xl border border-[#d6a842]/20 bg-[#fffaf0] p-5">
                    <Icon className="text-[#b8862b]" />
                    <h3 className="mt-4 text-lg font-extrabold text-[#071b3f]">{title}</h3>
                    <p className="mt-2 text-sm leading-6 text-slate-600">{text}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
