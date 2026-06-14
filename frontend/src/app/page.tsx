import Link from "next/link";
import {
  Award,
  BadgeCheck,
  CalendarDays,
  ClipboardCheck,
  Factory,
  FileCheck2,
  Mail,
  MapPin,
  Phone,
  ShieldCheck,
  Sparkles
} from "lucide-react";
import { asset, publicApi } from "@/lib/api";
import { services } from "@/data/services";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";

export default async function HomePage() {
  const [certifications, organizations] = await Promise.all([
    publicApi.certifications().catch(() => []),
    publicApi.organizations().catch(() => [])
  ]);

  const featuredCertifications = certifications.slice(0, 4);
  const latestOrganizations = organizations.slice(0, 3);

  return (
    <PublicShell>
      <section className="brand-surface relative overflow-hidden text-white">
        <div
          className="absolute inset-0 opacity-30"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1497366811353-6870744d04b2?auto=format&fit=crop&w=1800&q=80')",
            backgroundSize: "cover",
            backgroundPosition: "center"
          }}
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(151,7,71,0.98),rgba(151,7,71,0.82),rgba(35,7,19,0.44))]" />
        <div className="container relative grid min-h-[calc(100vh-82px)] items-center gap-10 py-16 lg:grid-cols-[1fr_480px]">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-[#fff4c8] px-4 py-2 text-xs font-bold text-moss">
              <Sparkles size={16} /> ISO certification services in Hyderabad
            </div>
            <h1 className="mt-6 max-w-3xl font-sans text-4xl font-extrabold leading-[1.08] text-[#ffefad] md:text-5xl lg:text-[56px]">
              GSR INTERNATIONAL CERTIFICATIONS
            </h1>
            <p className="mt-5 max-w-2xl text-base font-medium leading-8 text-[#fff4d0] md:text-lg">
              Global Standards | Integrity | Assurance. Professional ISO documentation, certification guidance, audit
              coordination, and verification support.
            </p>
            <div className="mt-6 grid max-w-2xl gap-3 text-sm font-semibold text-[#fff4d0] md:grid-cols-2">
              <a href="tel:8008035779" className="inline-flex items-center gap-3">
                <Phone size={17} className="text-white" /> 8008035779
              </a>
              <a href="tel:7075999265" className="inline-flex items-center gap-3">
                <Phone size={17} className="text-white" /> 7075999265
              </a>
              <a href="mailto:gsrinternationalcertifications@gmail.com" className="inline-flex items-center gap-3 md:col-span-2">
                <Mail size={17} className="text-white" /> gsrinternationalcertifications@gmail.com
              </a>
              <div className="inline-flex items-start gap-3 md:col-span-2">
                <MapPin size={17} className="mt-1 shrink-0 text-white" />
                <span>Hyderabad, Telangana, India</span>
              </div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/apply" className="rounded bg-[#e7ab20] px-5 py-3 text-sm font-extrabold text-ink transition hover:-translate-y-0.5 hover:bg-[#f0bd3f]">
                Apply for Certification
              </Link>
              <Link href="/certifications" className="rounded border border-white/35 px-5 py-3 text-sm font-extrabold text-white transition hover:-translate-y-0.5 hover:bg-white/10">
                Verify Certificate
              </Link>
            </div>
            <div className="mt-9 grid max-w-3xl gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {[
                ["1,240+", "Certified Companies"],
                ["98.7%", "Audit Completion"],
                ["22", "Countries Served"],
                ["1,500+", "Certificates Issued"]
              ].map(([value, label]) => (
                <div key={label} className="rounded border border-white/15 bg-white/10 p-4 backdrop-blur">
                  <div className="text-2xl font-extrabold text-white">{value}</div>
                  <div className="mt-1 text-xs font-bold text-[#fff4c8]">{label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="overflow-hidden rounded bg-white text-ink shadow-soft">
            <iframe
              src="https://www.google.com/maps?q=Hyderabad%2C%20Telangana%2C%20India&output=embed"
              className="h-[270px] w-full border-0"
              loading="lazy"
              title="GSR International Certifications location map"
            />
            <div className="p-5">
              <div className="flex items-start gap-3">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint text-moss">
                  <MapPin size={19} />
                </span>
                <div>
                  <h2 className="text-base font-extrabold">GSR INTERNATIONAL CERTIFICATIONS</h2>
                  <p className="mt-2 text-sm font-semibold leading-6 text-graphite/70">Hyderabad, Telangana, India</p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <a href="https://www.google.com/maps/search/?api=1&query=Hyderabad%2C%20Telangana%2C%20India" target="_blank" className="rounded bg-moss px-4 py-3 text-center text-sm font-bold text-white">
                  Open map
                </a>
                <Link href="/contact" className="rounded border border-moss/15 px-4 py-3 text-center text-sm font-bold text-moss">
                  Contact office
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section bg-pearl">
        <div className="container grid gap-10 lg:grid-cols-[0.85fr_1.15fr]">
          <SectionHeading
            eyebrow="Company overview"
            title="Global Standards | Integrity | Assurance"
            text="We combine compliance expertise with practical operating insight, helping teams build systems that are audit-ready and useful after the certificate is issued."
          />
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              ["12+", "Standards supported"],
              ["500+", "Client engagements"],
              ["4", "Core workflow modules"]
            ].map(([value, label]) => (
              <div key={label} className="lift-card rounded border border-moss/10 bg-white p-6 shadow-soft">
                <div className="font-display text-4xl font-semibold text-moss">{value}</div>
                <div className="mt-2 text-sm text-graphite/70">{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-white">
        <div className="container">
          <SectionHeading eyebrow="Certifications" title="Standards managed through the admin workspace." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {(featuredCertifications.length ? featuredCertifications : fallbackCertifications).map((item) => (
              <div key={item._id || item.name} className="lift-card rounded border border-moss/10 bg-white p-6">
                <BadgeCheck className="text-copper" />
                <h3 className="mt-5 text-xl font-semibold">{item.name}</h3>
                <p className="mt-3 line-clamp-4 text-sm leading-7 text-graphite/70">{item.description}</p>
                <div className="mt-5 text-xs font-bold uppercase tracking-[0.18em] text-moss">{item.category}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-mint">
        <div className="container grid gap-12 lg:grid-cols-[0.9fr_1.1fr]">
          <SectionHeading
            eyebrow="Why choose us"
            title="A certification process with strong controls and human guidance."
            text="Every engagement is structured around eligibility, documentation, audit preparation, certification status tracking, and post-certification support."
          />
          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { Icon: ShieldCheck, title: "Secure workflows" },
              { Icon: ClipboardCheck, title: "Evidence-led reviews" },
              { Icon: FileCheck2, title: "Clean documentation" },
              { Icon: Factory, title: "Industry-fit advice" }
            ].map(({ Icon, title }) => (
              <div key={title} className="lift-card rounded border border-moss/10 bg-white p-6">
                <Icon className="text-copper" />
                <h3 className="mt-5 font-semibold">{title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-pearl">
        <div className="container">
          <SectionHeading eyebrow="Services" title="Operational support across the certification lifecycle." />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {services.slice(0, 6).map((service) => (
              <div key={service.title} className="lift-card rounded border border-moss/10 bg-white p-6 shadow-soft">
                <Award className="text-moss" />
                <h3 className="mt-5 text-xl font-semibold">{service.title}</h3>
                <p className="mt-3 text-sm leading-7 text-graphite/70">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="brand-surface section text-white">
        <div className="container">
          <SectionHeading eyebrow="Process flow" title="From first inquiry to certified recognition." light />
          <div className="mt-10 grid gap-4 md:grid-cols-5">
            {["Consult", "Assess", "Prepare", "Audit", "Certify"].map((step, index) => (
              <div key={step} className="rounded border border-white/20 bg-white/5 p-5 transition hover:bg-white/10">
                <div className="font-display text-4xl text-white">0{index + 1}</div>
                <div className="mt-4 font-semibold">{step}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-[#eef3f7]">
        <div className="container">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-end">
            <SectionHeading eyebrow="Projects showcase" title="Latest certified organizations" />
            <Link href="/organizations" className="text-sm font-extrabold text-ink transition hover:text-moss">
              View all projects
            </Link>
          </div>
          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {latestOrganizations.map((org) => (
              <article key={org._id} className="lift-card overflow-hidden rounded border border-ink/10 bg-white shadow-soft">
                <img src={asset(org.imageUrl)} alt={org.title} className="h-56 w-full bg-ink object-cover" />
                <div className="p-6">
                  <div className="mb-4 flex items-center justify-between gap-4">
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-graphite/70">
                      <CalendarDays size={17} className="text-moss" />
                      {new Date(org.certificationDate).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric"
                      })}
                    </span>
                    <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-extrabold text-green-700">
                      {org.status}
                    </span>
                  </div>
                  <h3 className="text-xl font-extrabold uppercase text-ink">{org.title}</h3>
                  <p className="mt-3 min-h-16 text-sm font-medium uppercase leading-7 text-graphite/70">
                    {org.description}
                  </p>
                  <Link href="/contact" className="mt-6 block rounded bg-moss px-4 py-3 text-center text-sm font-extrabold text-white">
                    Send inquiry
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="section bg-pearl">
        <div className="container grid gap-8 lg:grid-cols-2">
          <div>
            <SectionHeading eyebrow="Testimonials" title="Trusted by teams who need calm, capable guidance." />
            <blockquote className="mt-8 rounded border border-moss/10 bg-white p-8 text-lg leading-8 shadow-soft">
              “GSR made our certification preparation structured, fast, and easy for department heads to follow.”
              <span className="mt-5 block text-sm font-semibold text-copper">Operations Director, Manufacturing</span>
            </blockquote>
          </div>
          <div>
            <SectionHeading eyebrow="FAQ" title="Clear answers before you apply." />
            <div className="mt-8 grid gap-3">
              {[
                ["Do you support verification?", "Yes. Active certifications show verification support on the public listing."],
                ["Can organizations apply online?", "Yes. The Apply page submits directly into admin inquiry management."],
                ["Can admin update certified organizations?", "Yes. Updates immediately reflect on the public website."]
              ].map(([question, answer]) => (
                <details key={question} className="rounded border border-moss/10 bg-white p-5 transition hover:border-moss/30">
                  <summary className="cursor-pointer font-semibold">{question}</summary>
                  <p className="mt-3 text-sm leading-7 text-graphite/70">{answer}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-moss py-16 text-white">
        <div className="container flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h2 className="font-display text-4xl font-semibold">Ready for a cleaner certification path?</h2>
            <p className="mt-3 text-white/80">Submit your requirement and the admin team can manage it instantly.</p>
          </div>
          <Link href="/apply" className="rounded bg-white px-6 py-4 font-semibold text-moss transition hover:-translate-y-0.5 hover:bg-mint">
            Apply for Certification
          </Link>
        </div>
      </section>
    </PublicShell>
  );
}

const fallbackCertifications = [
  {
    _id: "iso-9001",
    name: "ISO 9001",
    description: "Quality management system certification for consistent products, services, and processes.",
    category: "Quality",
    status: "Active",
    verificationSupport: true
  },
  {
    _id: "iso-14001",
    name: "ISO 14001",
    description: "Environmental management system certification for responsible operational control.",
    category: "Environment",
    status: "Active",
    verificationSupport: true
  },
  {
    _id: "iso-45001",
    name: "ISO 45001",
    description: "Occupational health and safety management system certification.",
    category: "Safety",
    status: "Active",
    verificationSupport: true
  },
  {
    _id: "iso-22000",
    name: "ISO 22000",
    description: "Food safety management system certification for food-chain organizations.",
    category: "Food Safety",
    status: "Active",
    verificationSupport: true
  }
];
