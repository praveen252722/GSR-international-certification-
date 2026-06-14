import { BadgeCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import { publicApi } from "@/lib/api";

export default async function CertificationsPage() {
  const certifications = await publicApi.certifications().catch(() => []);

  return (
    <PublicShell>
      <section className="section bg-pearl">
        <div className="container">
          <SectionHeading
            eyebrow="Certifications"
            title="Certification programs available for application and verification support."
            text="All entries are controlled from the admin panel. PDF upload, download, PDF URL, and certificate ID fields are intentionally excluded."
          />
          <div className="mt-10 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {certifications.map((item) => (
              <article key={item._id} className="lift-card rounded border border-moss/10 bg-white p-7 shadow-soft">
                <BadgeCheck className="text-copper" />
                <div className="mt-5 flex items-start justify-between gap-4">
                  <h2 className="text-2xl font-semibold">{item.name}</h2>
                  <span className="rounded bg-mint px-3 py-1 text-xs font-bold text-moss">{item.status}</span>
                </div>
                <p className="mt-4 leading-7 text-graphite/70">{item.description}</p>
                <div className="mt-6 flex flex-wrap gap-2 text-xs font-bold uppercase tracking-[0.16em]">
                  <span className="rounded border border-ink/10 px-3 py-2 text-graphite">{item.category}</span>
                  <span className="rounded border border-ink/10 px-3 py-2 text-copper">
                    {item.verificationSupport ? "Verification Support" : "No Verification"}
                  </span>
                </div>
              </article>
            ))}
          </div>
          {!certifications.length ? (
            <p className="mt-10 rounded bg-white p-6 text-graphite/70">No active certifications have been published yet.</p>
          ) : null}
        </div>
      </section>
    </PublicShell>
  );
}
