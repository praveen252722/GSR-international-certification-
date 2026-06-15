"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Pencil, Plus, Search, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { adminApi, asset } from "@/lib/api";
import type { Organization } from "@/lib/types";

type FormState = {
  title: string;
  description: string;
  certificationDate: string;
  status: Organization["status"];
  image1: File | null;
  image2: File | null;
};

const emptyForm: FormState = {
  title: "",
  description: "",
  certificationDate: "",
  status: "Certified",
  image1: null,
  image2: null
};

export default function AdminOrganizationsPage() {
  const [items, setItems] = useState<Organization[]>([]);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [editing, setEditing] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter((item) =>
      [item.title, item.description, item.status].some((value) => value.toLowerCase().includes(term))
    );
  }, [items, search]);

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await adminApi.organizations());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load organizations");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditing(undefined);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    if (!editing && !form.image1) {
      setError("Project Image 1 is required for new organization records");
      return;
    }

    const payload = new FormData();
    payload.append("title", form.title);
    payload.append("description", form.description);
    payload.append("certificationDate", form.certificationDate);
    payload.append("status", form.status);
    if (form.image1) payload.append("image1", form.image1);
    if (form.image2) payload.append("image2", form.image2);

    try {
      setSaving(true);
      await adminApi.saveOrganization(payload, editing);
      setMessage(editing ? "Organization updated successfully" : "Organization created successfully");
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save organization");
    } finally {
      setSaving(false);
    }
  }

  function edit(item: Organization) {
    setMessage("");
    setError("");
    setEditing(item._id);
    setForm({
      title: item.title,
      description: item.description,
      certificationDate: item.certificationDate.slice(0, 10),
      status: item.status,
      image1: null,
      image2: null
    });
  }

  async function remove(id: string) {
    if (!confirm("Are you sure you want to delete this organization?")) return;
    setMessage("");
    setError("");

    try {
      await adminApi.deleteOrganization(id);
      setMessage("Organization deleted successfully");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete organization");
    }
  }

  return (
    <AdminShell>
      <div className="mb-6 flex flex-col justify-between gap-4 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-copper">Projects showcase</p>
          <h2 className="mt-1 font-display text-4xl font-semibold">Latest Certified Organizations</h2>
        </div>
        <div className="relative w-full lg:max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-graphite/50" size={18} />
          <input
            className="focus-ring w-full rounded border border-moss/10 bg-white py-3 pl-10 pr-4"
            placeholder="Search organizations..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
      </div>

      {message ? <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{message}</div> : null}
      {error ? <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}

      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <AdminCard>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">{editing ? "Update Organization" : "Create Organization"}</h3>
            {editing ? (
              <button onClick={resetForm} className="grid h-9 w-9 place-items-center rounded bg-mint text-moss" aria-label="Cancel edit">
                <X size={16} />
              </button>
            ) : null}
          </div>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <textarea className="focus-ring min-h-32 rounded border border-ink/10 px-4 py-3" placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" type="date" value={form.certificationDate} onChange={(e) => setForm({ ...form, certificationDate: e.target.value })} required />
            <select className="focus-ring rounded border border-ink/10 px-4 py-3" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value as Organization["status"] })} required>
              <option>Certified</option>
              <option>Active</option>
            </select>
            <label className="grid gap-2 text-sm font-semibold text-graphite/70">
              Project Image 1
              <input className="focus-ring rounded border border-ink/10 px-4 py-3 text-ink" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image1: e.target.files?.[0] || null })} required={!editing} />
            </label>
            <label className="grid gap-2 text-sm font-semibold text-graphite/70">
              Project Image 2
              <input className="focus-ring rounded border border-ink/10 px-4 py-3 text-ink" type="file" accept="image/*" onChange={(e) => setForm({ ...form, image2: e.target.files?.[0] || null })} />
            </label>
            <button disabled={saving} className="inline-flex items-center justify-center gap-2 rounded bg-copper px-5 py-4 font-semibold text-white disabled:opacity-60">
              <Plus size={18} /> {saving ? "Saving..." : editing ? "Update Organization" : "Create Organization"}
            </button>
          </form>
        </AdminCard>

        <AdminCard>
          {loading ? (
            <div className="grid min-h-72 place-items-center text-sm font-semibold text-graphite/60">Loading organizations...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.14em] text-graphite/50">
                    <th className="px-3 py-2">Image Previews</th>
                    <th className="px-3 py-2">Title</th>
                    <th className="px-3 py-2">Description</th>
                    <th className="px-3 py-2">Certification Date</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Created Date</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr key={item._id} className="rounded bg-mint align-top">
                      <td className="rounded-l px-3 py-3">
                        <div className="flex gap-2">
                          <img src={asset(item.imageUrl)} alt={`${item.title} image 1`} className="h-20 w-24 rounded object-cover" />
                          {item.imageUrl2 ? (
                            <img src={asset(item.imageUrl2)} alt={`${item.title} image 2`} className="h-20 w-24 rounded object-cover" />
                          ) : null}
                        </div>
                      </td>
                      <td className="px-3 py-3 font-bold">{item.title}</td>
                      <td className="max-w-sm px-3 py-3 text-sm leading-6 text-graphite/70">{item.description}</td>
                      <td className="px-3 py-3 text-sm font-semibold">{new Date(item.certificationDate).toLocaleDateString()}</td>
                      <td className="px-3 py-3">
                        <span className="rounded-full bg-white px-3 py-1 text-xs font-bold text-moss">{item.status}</span>
                      </td>
                      <td className="px-3 py-3 text-sm text-graphite/70">
                        {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}
                      </td>
                      <td className="rounded-r px-3 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => edit(item)} className="grid h-10 w-10 place-items-center rounded bg-white" aria-label="Edit">
                            <Pencil size={16} />
                          </button>
                          <button onClick={() => remove(item._id)} className="grid h-10 w-10 place-items-center rounded bg-white text-red-600" aria-label="Delete">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {!filteredItems.length ? (
                <div className="grid min-h-40 place-items-center text-sm font-semibold text-graphite/60">No organizations found.</div>
              ) : null}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
