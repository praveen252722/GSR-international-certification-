import { asset, publicApi } from "@/lib/api";
import { PublicShell } from "@/components/public/PublicShell";
import { SectionHeading } from "@/components/public/SectionHeading";
import Link from "next/link";

export default async function OrganizationsPage() {
  const organizations = await publicApi.organizations().catch(() => []);

  return (
    <PublicShell>
      <section className="section bg-pearl">
        <div className="container">
          <SectionHeading
            eyebrow="Certified organizations"
            title="Dynamic public registry of recently certified organizations."
          />
          <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {organizations.map((org) => (
              <article key={org._id} className="lift-card overflow-hidden rounded border border-moss/10 bg-white shadow-soft">
                <img src={asset(org.imageUrl)} alt={org.title} className="h-60 w-full object-cover" />
                <div className="p-6">
                  <div className="flex items-center justify-between gap-4">
                    <h2 className="text-xl font-semibold">{org.title}</h2>
                    <span className="rounded bg-mint px-3 py-1 text-xs font-bold text-moss">{org.status}</span>
                  </div>
                  <p className="mt-3 leading-7 text-graphite/70">{org.description}</p>
                  <p className="mt-5 text-sm font-semibold text-copper">
                    Certified on {new Date(org.certificationDate).toLocaleDateString()}
                  </p>
                  <Link href="/contact" className="mt-5 block rounded bg-moss px-4 py-3 text-center text-sm font-bold text-white">
                    Send inquiry
                  </Link>
                </div>
              </article>
            ))}
          </div>
          {!organizations.length ? (
            <p className="mt-10 rounded bg-white p-6 text-graphite/70">No certified organizations have been published yet.</p>
          ) : null}
        </div>
      </section>
    </PublicShell>
  );
}
