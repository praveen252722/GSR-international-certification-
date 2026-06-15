import { BadgeCheck, Calendar, Building2, ShieldCheck } from "lucide-react";
import { PublicShell } from "@/components/public/PublicShell";
import { CertificateVerifyForm } from "@/components/public/CertificateVerifyForm";
import { publicApi } from "@/lib/api";

function formatDate(value?: string) {
  if (!value) return null;
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "short",
    day: "numeric"
  });
}

export default async function CertificationsPage() {
  const certifications = await publicApi.certifications().catch(() => []);

  return (
    <PublicShell>
      <section className="bg-gradient-to-br from-[#0a57d5] to-[#061b82] py-20 text-white">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-3xl text-center">
            <BadgeCheck className="mx-auto h-12 w-12 text-blue-200" />
            <h1 className="mt-6 font-sans text-4xl font-extrabold md:text-5xl">
              Certifications
            </h1>
            <p className="mt-4 text-lg text-blue-200">
              Certification programs available for application and verification support.
            </p>
          </div>
        </div>
      </section>

      <section className="bg-[#f0f5ff] py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl">
            <CertificateVerifyForm />
          </div>
        </div>
      </section>

      <section className="bg-white py-16">
        <div className="container mx-auto max-w-6xl px-4">
          <div className="mb-10 text-center">
            <h2 className="font-sans text-3xl font-bold text-[#08172f]">Our Certification Programs</h2>
            <p className="mt-2 text-slate-500">Explore our range of certification programs designed for excellence.</p>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {certifications.map((item) => (
              <article
                key={item._id}
                className="group rounded-xl border border-slate-100 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-blue-500/10"
              >
                <div className="flex items-start justify-between">
                  <div className="rounded-lg bg-blue-50 p-3 text-[#0a57d5]">
                    <ShieldCheck size={24} />
                  </div>
                  <span
                    className={`rounded-full px-3 py-1 text-xs font-bold ${
                      item.status === "Active"
                        ? "bg-green-50 text-green-700"
                        : "bg-slate-100 text-slate-500"
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
                <h3 className="mt-4 text-xl font-bold text-[#08172f]">{item.name}</h3>
                {item.companyName ? (
                  <div className="mt-2 flex items-center gap-1.5 text-sm text-slate-500">
                    <Building2 size={14} />
                    <span>{item.companyName}</span>
                  </div>
                ) : null}
                <p className="mt-3 line-clamp-2 text-sm leading-6 text-slate-500">{item.description}</p>
                <div className="mt-5 flex flex-wrap gap-3 border-t border-slate-50 pt-4 text-xs text-slate-400">
                  {item.publishDate ? (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Valid from {formatDate(item.publishDate)}
                    </span>
                  ) : null}
                  {item.expiryDate ? (
                    <span className="flex items-center gap-1">
                      <Calendar size={12} />
                      Expires {formatDate(item.expiryDate)}
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
          {!certifications.length ? (
            <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-12 text-center text-slate-400">
              <ShieldCheck className="mx-auto h-8 w-8" />
              <p className="mt-3 font-medium">No active certifications have been published yet.</p>
            </div>
          ) : null}
        </div>
      </section>
    </PublicShell>
  );
}
