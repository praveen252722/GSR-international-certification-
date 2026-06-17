import type { Metadata } from "next";
import { Compass, Target } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about GSR International Certifications ? our mission, vision, and leadership in providing professional ISO certification and compliance services.",
  openGraph: { title: "About Us | GSR International Certifications", url: "https://www.gsrinternationalcertifications.com/about" },
  alternates: { canonical: "https://www.gsrinternationalcertifications.com/about" }
};

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

      <section className="section bg-[#f8fbff]">
        <div className="container">
          <SectionHeading eyebrow="Founder" title="Leadership with compliance, technology, and trust at the center." />
          <div className="mt-10 grid gap-8 lg:grid-cols-[420px_1fr] lg:items-stretch">
            <div className="section-reveal overflow-hidden rounded-3xl border border-[#d6a842]/20 bg-white shadow-[0_24px_70px_rgba(7,27,63,0.14)]">
              <img
                src="/founder-praveen-talluri.jpeg"
                alt="Srinivas Gesala, Founder and Managing Director"
                className="h-full min-h-[440px] w-full object-cover object-center"
              />
            </div>
            <div className="section-reveal rounded-3xl border border-[#d6a842]/20 bg-white p-7 shadow-soft md:p-9">
              <p className="text-sm font-bold uppercase tracking-[0.22em] text-[#b8862b]">Founder & Managing Director</p>
              <h2 className="mt-3 text-3xl font-extrabold text-[#071b3f]">Srinivas Gesala</h2>
              <p className="mt-1 text-sm font-semibold text-[#b8862b]">GSR International Certifications</p>
              <p className="mt-5 text-base leading-8 text-slate-600">
                GSR International Certifications was established with a vision to simplify ISO certification and
                compliance processes for organizations across industries. Under the leadership of Srinivas Gesala,
                the company is committed to delivering transparent certification guidance, professional audit
                coordination, and reliable compliance solutions that help businesses achieve internationally
                recognized standards.
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

      <section className="section bg-white">
        <div className="container mx-auto max-w-5xl">
          <div className="grid place-items-center">
            <img src="/gsr-logo.png" alt="GSR logo" className="h-24 w-24 object-contain" />
          </div>
          <div className="section-reveal mt-8 space-y-6 text-center text-lg leading-8 text-slate-600">
            <p>
              GSR International Certifications is a Hyderabad-based certification services provider dedicated to
              helping organizations achieve internationally recognized ISO standards. Our mission is to simplify
              the certification process through expert guidance, structured documentation support, and transparent
              audit coordination ? enabling businesses to focus on what matters most: quality, safety, and
              continuous improvement.
            </p>
            <p>
              From ISO 9001 (Quality Management) and ISO 14001 (Environmental Management) to ISO 45001 (Occupational
              Health & Safety), GSR International Certifications offers end-to-end compliance solutions tailored to
              each organization's industry, size, and regulatory context. Our team of certification coordinators,
              auditors, and client-success specialists works closely with every client to ensure practical
              documentation, audit readiness, and responsive support at every stage of the certification journey.
            </p>
            <p>
              Beyond certification guidance, GSR International Certifications provides certificate verification
              services, compliance management tools, and ongoing support to help organizations maintain their
              certified status. Whether you are pursuing your first ISO certification or upgrading to a newer
              standard, our structured approach ensures clarity, efficiency, and lasting results.
            </p>
          </div>
        </div>
      </section>
    </PublicShell>
  );
}

