"use client";

import { FormEvent, useState } from "react";
import { BadgeCheck, Building2, Calendar, Search, ShieldCheck, XCircle } from "lucide-react";
import { publicApi } from "@/lib/api";
import type { Certification } from "@/lib/types";

function formatDate(value?: string) {
  if (!value) return "Not published";
  return new Date(value).toLocaleDateString("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric"
  });
}

function StateBadge({ state }: { state?: string }) {
  switch (state) {
    case "Active":
      return <span className="rounded-full bg-green-50 px-4 py-1.5 text-sm font-bold text-green-700">Active</span>;
    case "Expired":
      return <span className="rounded-full bg-red-50 px-4 py-1.5 text-sm font-bold text-red-700">Expired</span>;
    case "Suspended":
      return <span className="rounded-full bg-orange-50 px-4 py-1.5 text-sm font-bold text-orange-700">Suspended</span>;
    default:
      return <span className="rounded-full bg-slate-100 px-4 py-1.5 text-sm font-bold text-slate-500">{state || "Unknown"}</span>;
  }
}

export function CertificateVerifyForm() {
  const [certificateId, setCertificateId] = useState("");
  const [result, setResult] = useState<Certification | null>(null);
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setResult(null);
    setMessage("");

    try {
      const certification = await publicApi.verifyCertificate(certificateId.trim().toUpperCase());
      setResult(certification);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Certificate not found");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="rounded-2xl bg-white p-6 shadow-lg shadow-blue-500/5 sm:p-8">
      <div className="text-center">
        <div className="mx-auto grid h-16 w-16 place-items-center rounded-2xl bg-gradient-to-br from-[#0a57d5] to-[#061b82] text-white shadow-lg shadow-blue-500/20">
          <ShieldCheck size={28} />
        </div>
        <h2 className="mt-5 font-sans text-2xl font-bold text-[#08172f]">Verify Certificate</h2>
        <p className="mt-1 text-sm text-slate-500">
          Enter the certificate ID to verify its authenticity and view details.
        </p>
      </div>

      <form onSubmit={submit} className="mt-6 flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
          <input
            required
            value={certificateId}
            onChange={(event) => setCertificateId(event.target.value.toUpperCase())}
            className="focus:ring-[#0a57d5]/20 h-14 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm font-bold uppercase tracking-wide text-[#08172f] placeholder:font-normal placeholder:normal-case placeholder:text-slate-300 focus:border-[#0a57d5] focus:outline-none focus:ring-4"
            placeholder="Enter Certificate ID (e.g. GSR-2024-001)"
          />
        </div>
        <button
          disabled={busy}
          className="inline-flex h-14 shrink-0 items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#0a57d5] to-[#061b82] px-8 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition-all hover:shadow-blue-500/30 disabled:opacity-60"
        >
          {busy ? (
            <span className="flex items-center gap-2">
              <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Verifying...
            </span>
          ) : (
            <>
              <Search size={18} />
              Verify Certificate
            </>
          )}
        </button>
      </form>

      {message ? (
        <div className="mt-6 animate-[fadeIn_0.3s_ease] rounded-xl border border-red-100 bg-red-50 p-5">
          <div className="flex items-start gap-3">
            <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-500" />
            <div>
              <p className="font-semibold text-red-700">Certificate Not Found</p>
              <p className="mt-0.5 text-sm text-red-500">{message}</p>
            </div>
          </div>
        </div>
      ) : null}

      {result ? (
        <div className="mt-6 animate-[fadeIn_0.4s_ease] overflow-hidden rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-white shadow-sm">
          <div className="border-b border-blue-100 bg-blue-50/50 px-6 py-4">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div className="flex items-center gap-3">
                <div className="grid h-10 w-10 place-items-center rounded-full bg-green-100">
                  <BadgeCheck className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-green-700">Verified Certificate</p>
                  <p className="text-sm text-slate-500">ID: {result.certificateId}</p>
                </div>
              </div>
              <StateBadge state={result.certificateState || result.status} />
            </div>
          </div>
          <div className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Certificate Name</p>
                <p className="mt-1 font-bold text-[#08172f]">{result.name}</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Organization</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-[#08172f]">
                  <Building2 size={14} className="text-slate-400" />
                  {result.companyName || "Not provided"}
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Issue Date</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-[#08172f]">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDate(result.publishDate)}
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Expiry Date</p>
                <p className="mt-1 flex items-center gap-1.5 font-semibold text-[#08172f]">
                  <Calendar size={14} className="text-slate-400" />
                  {formatDate(result.expiryDate)}
                </p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Category</p>
                <p className="mt-1 font-semibold text-[#08172f]">{result.category}</p>
              </div>
              <div className="rounded-lg bg-white p-4 shadow-sm">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Certification Status</p>
                <p className="mt-1 font-semibold text-[#08172f]">{result.certificateState || result.status}</p>
              </div>
            </div>
            {result.scope ? (
              <div className="mt-5 rounded-lg border border-blue-100 bg-white p-4">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">Scope</p>
                <p className="mt-1 leading-6 text-slate-600">{result.scope}</p>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}
    </div>
  );
}
