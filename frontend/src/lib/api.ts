import type { Certification, Inquiry, Organization, Settings } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";
export const ASSET_URL = API_URL.replace(/\/api\/?$/, "");

const REQUEST_TIMEOUT = 15_000;

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  try {
    const response = await fetch(`${API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.body instanceof FormData ? {} : { "Content-Type": "application/json" }),
        ...options.headers
      },
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: "Request failed" }));
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error("Request timed out. Please check your connection and try again.");
    }
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      throw new Error("Unable to connect to server. Please check your connection and try again.");
    }
    throw err;
  } finally {
    clearTimeout(timeout);
  }
}

export function authHeaders(): Record<string, string> {
  if (typeof window === "undefined") return {};
  const token = localStorage.getItem("adminToken");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

export const publicApi = {
  settings: () => request<Settings>("/settings"),
  certifications: () => request<Certification[]>("/certifications?public=true"),
  organizations: () => request<Organization[]>("/v1/organizations?public=true"),
  submitInquiry: (payload: Record<string, unknown>) =>
    request<{ message: string }>("/inquiries", { method: "POST", body: JSON.stringify(payload) })
};

export const adminApi = {
  login: (payload: { username?: string; email?: string; password: string }) =>
    request<{ token: string; admin: { name: string; email: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  dashboard: () =>
    request<{
      totalCertifications: number;
      totalOrganizations: number;
      totalInquiries: number;
      recentActivity: Array<{ type: string; title: string; status: string; createdAt: string }>;
    }>("/dashboard", { headers: authHeaders() }),
  certifications: () => request<Certification[]>("/certifications", { headers: authHeaders() }),
  saveCertification: (payload: Partial<Certification>, id?: string) =>
    request<Certification>(id ? `/certifications/${id}` : "/certifications", {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }),
  deleteCertification: (id: string) =>
    request<{ message: string }>(`/certifications/${id}`, { method: "DELETE", headers: authHeaders() }),
  organizations: () => request<Organization[]>("/v1/organizations", { headers: authHeaders() }),
  saveOrganization: (payload: FormData, id?: string) =>
    request<Organization>(id ? `/v1/organizations/${id}` : "/v1/organizations", {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: payload
    }),
  deleteOrganization: (id: string) =>
    request<{ message: string }>(`/v1/organizations/${id}`, { method: "DELETE", headers: authHeaders() }),
  inquiries: () => request<Inquiry[]>("/inquiries", { headers: authHeaders() }),
  updateInquiryStatus: (id: string, status: Inquiry["status"]) =>
    request<Inquiry>(`/inquiries/${id}/status`, {
      method: "PATCH",
      headers: authHeaders(),
      body: JSON.stringify({ status })
    }),
  deleteInquiry: (id: string) =>
    request<{ message: string }>(`/inquiries/${id}`, { method: "DELETE", headers: authHeaders() }),
  settings: () => request<Settings>("/settings", { headers: authHeaders() }),
  saveSettings: (payload: Settings) =>
    request<Settings>("/settings", {
      method: "PUT",
      headers: authHeaders(),
      body: JSON.stringify(payload)
    })
};

export function asset(path?: string) {
  if (!path) return "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80";
  if (path.startsWith("http")) return path;
  return `${ASSET_URL}${path}`;
}
