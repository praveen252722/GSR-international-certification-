"use client";

import { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { adminApi } from "@/lib/api";
import type { Inquiry } from "@/lib/types";

export default function AdminInquiriesPage() {
  const [items, setItems] = useState<Inquiry[]>([]);

  async function load() {
    setItems(await adminApi.inquiries());
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function updateStatus(id: string, status: Inquiry["status"]) {
    await adminApi.updateInquiryStatus(id, status);
    await load();
  }

  async function remove(id: string) {
    if (!confirm("Delete this inquiry?")) return;
    await adminApi.deleteInquiry(id);
    await load();
  }

  return (
    <AdminShell>
      <h2 className="mb-6 font-display text-4xl font-semibold">Inquiry Management</h2>
      <AdminCard>
        <div className="grid gap-4">
          {items.map((item) => (
            <article key={item._id} className="rounded bg-pearl p-5">
              <div className="flex flex-col justify-between gap-4 lg:flex-row lg:items-start">
                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-xl font-semibold">{item.name}</h3>
                    <span className="rounded bg-white px-3 py-1 text-xs font-bold text-copper">{item.source}</span>
                  </div>
                  <p className="mt-2 text-sm text-graphite/60">
                    {item.email} {item.phone ? `· ${item.phone}` : ""} {item.company ? `· ${item.company}` : ""}
                  </p>
                  <p className="mt-3 leading-7 text-graphite/75">{item.message}</p>
                  {item.service ? <p className="mt-2 text-sm font-semibold text-moss">{item.service}</p> : null}
                </div>
                <div className="flex items-center gap-2">
                  <select
                    className="focus-ring rounded border border-ink/10 bg-white px-3 py-2"
                    value={item.status}
                    onChange={(event) => updateStatus(item._id, event.target.value as Inquiry["status"])}
                  >
                    <option>New</option>
                    <option>In Progress</option>
                    <option>Closed</option>
                  </select>
                  <button onClick={() => remove(item._id)} className="grid h-10 w-10 place-items-center rounded bg-white text-red-600" aria-label="Delete">
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </AdminCard>
    </AdminShell>
  );
}
