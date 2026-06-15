import { PublicShell } from "@/components/public/PublicShell";
import { InquiryForm } from "@/components/public/InquiryForm";
import { SectionHeading } from "@/components/public/SectionHeading";

export default function ApplyPage() {
  return (
    <PublicShell>
      <section className="section bg-[#e9f1fa]">
        <div className="container grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
          <SectionHeading
            eyebrow="Apply"
            title="Submit your certification application request."
            text="Applications are stored as Apply inquiries in the backend and can be reviewed, marked, and deleted by admins."
          />
          <div className="rounded-2xl border border-[#d6a842]/20 bg-white p-6 shadow-soft md:p-8">
            <InquiryForm source="Apply" />
          </div>
        </div>
      </section>
    </PublicShell>
  );
}
