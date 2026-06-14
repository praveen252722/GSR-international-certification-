"use client";

import { FormEvent, useEffect, useState } from "react";
import { Download, Pencil, Plus, Trash2 } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { API_URL, adminApi, authHeaders } from "@/lib/api";
import type { Certification } from "@/lib/types";

type CertificationForm = {
  name: string;
  description: string;
  category: string;
  status: Certification["status"];
};

const emptyForm: CertificationForm = { name: "", description: "", category: "", status: "Active" };

export default function AdminCertificationsPage() {
  const [items, setItems] = useState<Certification[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | undefined>();

  async function load() {
    setItems(await adminApi.certifications());
  }

  useEffect(() => {
    load().catch(console.error);
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    await adminApi.saveCertification(form, editing);
    setForm(emptyForm);
    setEditing(undefined);
    await load();
  }

  function edit(item: Certification) {
    setEditing(item._id);
    setForm({ name: item.name, description: item.description, category: item.category, status: item.status });
  }

  async function remove(id: string) {
    if (!confirm("Delete this certification?")) return;
    await adminApi.deleteCertification(id);
    await load();
  }

  async function exportCsv() {
    const response = await fetch(`${API_URL}/certifications/export/csv`, {
      headers: authHeaders()
    });
    if (!response.ok) return alert("Export failed");
    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "certifications.csv";
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <h2 className="font-display text-4xl font-semibold">Certificate Management</h2>
        <button onClick={exportCsv} className="inline-flex items-center gap-2 rounded bg-moss px-5 py-3 font-semibold text-white">
          <Download size={17} /> Export
        </button>
      </div>
      <div className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr]">
        <AdminCard>
          <h3 className="text-xl font-semibold">{editing ? "Edit Certification" : "Create Certification"}</h3>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Certification Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
            <select className="focus-ring rounded border border-ink/10 px-4 py-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Certification["status"] })}>
              <option>Active</option>
              <option>Inactive</option>
            </select>
            <textarea className="focus-ring min-h-32 rounded border border-ink/10 px-4 py-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <button className="inline-flex items-center justify-center gap-2 rounded bg-copper px-5 py-4 font-semibold text-white">
              <Plus size={18} /> {editing ? "Update" : "Create"}
            </button>
          </form>
        </AdminCard>
        <AdminCard>
          <div className="grid gap-3">
            {items.map((item) => (
              <div key={item._id} className="rounded bg-pearl p-4">
                <div className="flex flex-col justify-between gap-3 md:flex-row md:items-start">
                  <div>
                    <h3 className="font-semibold">{item.name}</h3>
                    <p className="mt-1 text-sm text-graphite/60">{item.category} · {item.status}</p>
                    <p className="mt-2 text-sm leading-6 text-graphite/70">{item.description}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => edit(item)} className="grid h-10 w-10 place-items-center rounded bg-white" aria-label="Edit">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(item._id)} className="grid h-10 w-10 place-items-center rounded bg-white text-red-600" aria-label="Delete">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </AdminCard>
      </div>
    </AdminShell>
  );
}
