"use client";

import { FormEvent, useEffect, useState } from "react";
import { Pencil, Plus, Trash2, X } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { adminApi } from "@/lib/api";
import type { AdminUser } from "@/lib/types";

type UserForm = {
  username: string;
  password: string;
  name: string;
};

const emptyForm: UserForm = { username: "", password: "", name: "" };

export default function AdminUsersPage() {
  const [items, setItems] = useState<AdminUser[]>([]);
  const [form, setForm] = useState(emptyForm);
  const [editing, setEditing] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");
    try {
      setItems(await adminApi.users());
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load users");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  function resetForm() {
    setForm(emptyForm);
    setEditing(undefined);
  }

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage("");
    setError("");

    try {
      const payload: Record<string, string> = { username: form.username, name: form.name };
      if (form.password) payload.password = form.password;
      await adminApi.saveUser(payload, editing);
      setMessage(editing ? "User updated successfully" : "User created successfully");
      resetForm();
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save user");
    }
  }

  function edit(item: AdminUser) {
    setMessage("");
    setError("");
    setEditing(item._id);
    setForm({ username: item.username, password: "", name: item.name });
  }

  async function remove(id: string) {
    if (!confirm("Delete this user?")) return;
    setMessage("");
    setError("");
    try {
      await adminApi.deleteUser(id);
      setMessage("User deleted successfully");
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete user");
    }
  }

  return (
    <AdminShell>
      <div className="mb-6">
        <p className="text-sm font-bold uppercase tracking-[0.2em] text-copper">Administration</p>
        <h2 className="mt-1 font-display text-4xl font-semibold">User Management</h2>
      </div>

      {message ? <div className="mb-4 rounded border border-green-200 bg-green-50 p-4 text-sm font-semibold text-green-700">{message}</div> : null}
      {error ? <div className="mb-4 rounded border border-red-200 bg-red-50 p-4 text-sm font-semibold text-red-700">{error}</div> : null}

      <div className="grid gap-6 lg:grid-cols-[420px_1fr]">
        <AdminCard>
          <div className="flex items-center justify-between gap-4">
            <h3 className="text-xl font-semibold">{editing ? "Update User" : "Create User"}</h3>
            {editing ? (
              <button onClick={resetForm} className="grid h-9 w-9 place-items-center rounded bg-mint text-moss" aria-label="Cancel edit">
                <X size={16} />
              </button>
            ) : null}
          </div>
          <form onSubmit={submit} className="mt-5 grid gap-4">
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Username" value={form.username} onChange={(e) => setForm({ ...form, username: e.target.value })} required />
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder="Full Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="focus-ring rounded border border-ink/10 px-4 py-3" placeholder={editing ? "New Password (leave blank to keep)" : "Password"} type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} required={!editing} />
            <button className="inline-flex items-center justify-center gap-2 rounded bg-copper px-5 py-4 font-semibold text-white">
              <Plus size={18} /> {editing ? "Update User" : "Create User"}
            </button>
          </form>
        </AdminCard>

        <AdminCard>
          {loading ? (
            <div className="grid min-h-40 place-items-center text-sm font-semibold text-graphite/60">Loading users...</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-separate border-spacing-y-3 text-left">
                <thead>
                  <tr className="text-xs uppercase tracking-[0.14em] text-graphite/50">
                    <th className="px-3 py-2">Username</th>
                    <th className="px-3 py-2">Name</th>
                    <th className="px-3 py-2">Email</th>
                    <th className="px-3 py-2">Created</th>
                    <th className="px-3 py-2">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr key={item._id} className="rounded bg-mint align-top">
                      <td className="rounded-l px-3 py-3 font-bold">{item.username}</td>
                      <td className="px-3 py-3">{item.name}</td>
                      <td className="px-3 py-3 text-sm text-graphite/70">{item.email}</td>
                      <td className="px-3 py-3 text-sm text-graphite/70">{item.createdAt ? new Date(item.createdAt).toLocaleDateString() : "-"}</td>
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
              {!items.length ? <div className="grid min-h-40 place-items-center text-sm font-semibold text-graphite/60">No users found.</div> : null}
            </div>
          )}
        </AdminCard>
      </div>
    </AdminShell>
  );
}
