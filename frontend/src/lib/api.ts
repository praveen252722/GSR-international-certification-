import type { Certification, Inquiry, Organization, Settings, AdminUser } from "./types";

export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
export const ASSET_URL = API_URL.replace(/\/api(\/v1)?\/?$/, "");

const REQUEST_TIMEOUT = 15_000;

function debugLog(level: string, ...args: unknown[]) {
  if (process.env.NODE_ENV === "development") {
    if (level === "error") console.error("[API]", ...args);
    else console.log("[API]", ...args);
  }
}

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

  const url = `${API_URL}${path}`;
  const hasBody = options.body && !(options.body instanceof FormData);
  const tokenHeader = (options.headers as Record<string, string> || {}).Authorization || "";
  const reqHeaders: Record<string, string> = {
    ...(hasBody ? { "Content-Type": "application/json" } : {}),
    ...(options.headers as Record<string, string>)
  };

  debugLog("info", `${options.method || "GET"} ${url}`, tokenHeader ? `token:${tokenHeader.slice(0, 25)}...` : "no-token");

  try {
    const response = await fetch(url, {
      ...options,
      headers: reqHeaders,
      cache: "no-store",
      signal: controller.signal
    });

    if (!response.ok) {
      let errorBody: { message?: string; errors?: Array<{ field: string; message: string }> } = {};
      try { errorBody = await response.json(); } catch { /* ignore */ }
      debugLog("error", `${response.status} ${url}`, errorBody.message || "");

      if (response.status === 401 && typeof window !== "undefined" && !path.startsWith("/auth/")) {
        localStorage.removeItem("adminToken");
        window.location.href = "/admin/login";
        throw new Error("Session expired. Redirecting to login...");
      }

      const statusLabels: Record<number, string> = {
        401: "401 Unauthorized",
        403: "403 Forbidden",
        404: "404 Not Found",
        500: "500 Internal Server Error"
      };
      const prefix = statusLabels[response.status] || `Error ${response.status}`;
      let detail = errorBody.message || response.statusText;
      if (response.status === 422 && errorBody.errors?.length) {
        detail += `: ${errorBody.errors.map((e) => `${e.field} ${e.message}`).join(", ")}`;
      }
      throw new Error(`${prefix}: ${detail}`);
    }

    return response.json();
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") {
      throw new Error(`Request timed out (${REQUEST_TIMEOUT / 1000}s) - Backend not responding at ${url}`);
    }
    if (err instanceof TypeError && err.message === "Failed to fetch") {
      const hint = url.includes("localhost") ? "Make sure the backend is running on port 5000." : "Check that the backend service is running.";
      throw new Error("Backend Offline - Cannot reach the API server at " + url + ". " + hint);
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
  verifyCertificate: (certificateId: string) => request<Certification>(`/certifications/verify/${encodeURIComponent(certificateId)}`),
  organizations: () => request<Organization[]>("/organizations?public=true"),
  submitInquiry: (payload: Record<string, unknown>) =>
    request<{ message: string }>("/inquiries", { method: "POST", body: JSON.stringify(payload) })
};

export const adminApi = {
  login: (payload: { username?: string; email?: string; password: string }) =>
    request<{ token: string; admin: { name: string; email: string } }>("/auth/login", {
      method: "POST",
      body: JSON.stringify(payload)
    }),
  dashboard: async () => {
    try {
      return await request<{
        totalCertifications: number;
        totalOrganizations: number;
        totalInquiries: number;
        totalUsers: number;
        activeCertifications: number;
        expiredCertifications: number;
        suspendedCertifications: number;
        activeOrganizations: number;
        recentActivity: Array<{ type: string; title: string; status: string; createdAt: string }>;
      }>("/dashboard", { headers: authHeaders() });
    } catch {
      const [certs, orgs, inqs, users] = await Promise.all([
        adminApi.certifications(),
        adminApi.organizations(),
        adminApi.inquiries(),
        adminApi.users()
      ]);
      return {
        totalCertifications: certs.length,
        totalOrganizations: orgs.length,
        totalInquiries: inqs.length,
        totalUsers: users.length,
        activeCertifications: certs.filter((c) => c.status === "Active").length,
        expiredCertifications: certs.filter((c) => c.certificateState === "Expired").length,
        suspendedCertifications: certs.filter((c) => c.certificateState === "Suspended").length,
        activeOrganizations: orgs.filter((o) => o.status === "Certified").length,
        recentActivity: [
          ...certs.slice(0, 5).map((item) => ({ type: "Certification", title: item.name, status: item.status, createdAt: item.createdAt })),
          ...orgs.slice(0, 5).map((item) => ({ type: "Organization", title: item.title, status: item.status, createdAt: item.createdAt })),
          ...inqs.slice(0, 5).map((item) => ({ type: "Inquiry", title: `${item.name} - ${item.source}`, status: item.status, createdAt: item.createdAt }))
        ].sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()).slice(0, 8)
      };
    }
  },
  certifications: () => request<Certification[]>("/certifications", { headers: authHeaders() }),
  saveCertification: (payload: Partial<Certification>, id?: string) =>
    request<Certification>(id ? `/certifications/${id}` : "/certifications", {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }),
  deleteCertification: (id: string) =>
    request<{ message: string }>(`/certifications/${id}`, { method: "DELETE", headers: authHeaders() }),
  organizations: () => request<Organization[]>("/organizations", { headers: authHeaders() }),
  saveOrganization: (payload: FormData, id?: string) =>
    request<Organization>(id ? `/organizations/${id}` : "/organizations", {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: payload
    }),
  deleteOrganization: (id: string) =>
    request<{ message: string }>(`/organizations/${id}`, { method: "DELETE", headers: authHeaders() }),
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
    }),
  users: () => request<AdminUser[]>("/users", { headers: authHeaders() }),
  saveUser: (payload: Partial<AdminUser> & { password?: string }, id?: string) =>
    request<AdminUser>(id ? `/users/${id}` : "/users", {
      method: id ? "PUT" : "POST",
      headers: authHeaders(),
      body: JSON.stringify(payload)
    }),
  deleteUser: (id: string) =>
    request<{ message: string }>(`/users/${id}`, { method: "DELETE", headers: authHeaders() })
};

export function asset(path?: string) {
  if (!path) return "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=1200&q=80";
  if (path.startsWith("http")) return path;
  return `${ASSET_URL}${path}`;
}
