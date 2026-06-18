"use client";

import { useEffect, useState, useRef } from "react";
import {
  Activity,
  AlertTriangle,
  Award,
  Building2,
  Clock,
  Inbox,
  LogIn,
  ShieldCheck,
  Users
} from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { BackendWakingBanner } from "@/components/admin/BackendWakingBanner";
import { adminApi, isColdStarting } from "@/lib/api";

type Dashboard = Awaited<ReturnType<typeof adminApi.dashboard>>;

function DashboardSkeleton() {
  return (
    <AdminShell>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <AdminCard key={i}>
            <div className="h-6 w-6 animate-pulse rounded bg-gray-200" />
            <div className="mt-5 h-9 w-20 animate-pulse rounded bg-gray-200" />
            <div className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-200" />
            <div className="mt-1 h-3 w-24 animate-pulse rounded bg-gray-200" />
          </AdminCard>
        ))}
      </div>
      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <AdminCard key={`state-${i}`}>
            <div className="h-5 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-gray-200" />
          </AdminCard>
        ))}
      </div>
      <AdminCard className="mt-6">
        <div className="h-6 w-40 animate-pulse rounded bg-gray-200" />
        <div className="mt-5 grid gap-3">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={`act-${i}`} className="h-16 animate-pulse rounded bg-gray-100" />
          ))}
        </div>
      </AdminCard>
    </AdminShell>
  );
}

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentRole, setCurrentRole] = useState<string>("");
  const [waking, setWaking] = useState(false);
  const startRef = useRef(Date.now());

  useEffect(() => {
    const stored = localStorage.getItem("adminUser");
    if (stored) {
      try {
        setCurrentRole(JSON.parse(stored).role);
      } catch { /* ignore */ }
    }
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError("");

      try {
        const result = await adminApi.dashboard();
        setData(result);
        setWaking(false);
      } catch (err) {
        const msg = err instanceof Error ? err.message : "";
        const isWaking = msg.includes("Backend is waking up") || (isColdStarting && Date.now() - startRef.current < 60000);
        if (isWaking) {
          setWaking(true);
          setError("");
          setTimeout(() => {
            adminApi
              .dashboard()
              .then((r) => { setData(r); setWaking(false); setError(""); })
              .catch((e) => { setError(e instanceof Error ? e.message : "Dashboard data could not be loaded."); setWaking(false); })
              .finally(() => setLoading(false));
          }, 10000);
          return;
        }
        setError(msg || "Dashboard data could not be loaded. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  if (loading && waking) {
    return (
      <AdminShell>
        <BackendWakingBanner />
        <DashboardSkeleton />
      </AdminShell>
    );
  }

  if (loading) {
    return (
      <AdminShell>
        <DashboardSkeleton />
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell>
        {waking && <BackendWakingBanner />}
        <AdminCard>
          <div className="grid min-h-[200px] place-items-center text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </AdminCard>
      </AdminShell>
    );
  }

  const mainMetrics = [
    { Icon: Award, label: "Total Certificates", value: data?.totalCertifications ?? 0, sub: `${data?.activeCertifications ?? 0} Active` },
    { Icon: Building2, label: "Certified Organizations", value: data?.activeOrganizations ?? 0, sub: `${data?.totalOrganizations ?? 0} Total` },
    { Icon: Inbox, label: "Total Inquiries", value: data?.totalInquiries ?? 0, sub: "All submissions" },
    { Icon: Users, label: "Admin Users", value: data?.totalUsers ?? 0, sub: "Registered" }
  ];

  const certStates = [
    { Icon: ShieldCheck, label: "Active Certificates", value: data?.activeCertifications ?? 0, color: "text-green-600" },
    { Icon: AlertTriangle, label: "Expired", value: data?.expiredCertifications ?? 0, color: "text-red-600" },
    { Icon: AlertTriangle, label: "Suspended", value: data?.suspendedCertifications ?? 0, color: "text-orange-600" }
  ];

  const isAdmin = currentRole === "ADMIN";

  return (
    <AdminShell>
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {mainMetrics.map(({ Icon, label, value, sub }) => (
          <AdminCard key={label}>
            <Icon className="text-copper" />
            <div className="mt-5 text-4xl font-semibold">{value}</div>
            <div className="mt-1 text-sm text-graphite/60">{label}</div>
            <div className="text-xs text-graphite/40">{sub}</div>
          </AdminCard>
        ))}
      </div>

      {isAdmin && data?.securityWidgets && (
        <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          <AdminCard>
            <div className="flex items-center gap-3">
              <LogIn className="text-blue-600" size={20} />
              <span className="text-sm font-semibold text-graphite/70">Total Logins</span>
            </div>
            <div className="mt-3 text-3xl font-semibold">{data.securityWidgets.loginCount}</div>
          </AdminCard>
          <AdminCard>
            <div className="flex items-center gap-3">
              <AlertTriangle className="text-red-500" size={20} />
              <span className="text-sm font-semibold text-graphite/70">Failed Logins</span>
            </div>
            <div className="mt-3 text-3xl font-semibold text-red-600">{data.securityWidgets.failedLogins}</div>
          </AdminCard>
          <AdminCard>
            <div className="flex items-center gap-3">
              <Activity className="text-moss" size={20} />
              <span className="text-sm font-semibold text-graphite/70">Total Logs</span>
            </div>
            <div className="mt-3 text-3xl font-semibold">{data.securityWidgets.totalLogs}</div>
          </AdminCard>
          <AdminCard>
            <div className="flex items-center gap-3">
              <Users className="text-copper" size={20} />
              <span className="text-sm font-semibold text-graphite/70">Active Users</span>
            </div>
            <div className="mt-3 text-3xl font-semibold">{data?.totalUsers ?? 0}</div>
          </AdminCard>
        </div>
      )}

      {isAdmin && data?.securityWidgets?.recentLogins && data.securityWidgets.recentLogins.length > 0 && (
        <AdminCard className="mt-6">
          <div className="flex items-center gap-3">
            <Clock className="text-blue-600" />
            <h2 className="text-xl font-semibold">Recent Logins</h2>
          </div>
          <div className="mt-4 grid gap-2">
            {data.securityWidgets.recentLogins.slice(0, 5).map((login, i) => (
              <div key={i} className="flex items-center justify-between rounded bg-pearl px-4 py-2 text-sm">
                <span className="font-semibold">{login.adminName}</span>
                <span className="text-graphite/60">
                  {new Date(login.createdAt).toLocaleDateString("en-IN", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
                <span className="text-xs text-graphite/50">{login.browser} · {login.device}</span>
              </div>
            ))}
          </div>
        </AdminCard>
      )}

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {certStates.map(({ Icon, label, value, color }) => (
          <AdminCard key={label}>
            <div className="flex items-center gap-3">
              <Icon className={color} />
              <span className="text-sm font-semibold text-graphite/70">{label}</span>
            </div>
            <div className={`mt-3 text-3xl font-semibold ${color}`}>{value}</div>
          </AdminCard>
        ))}
      </div>

      <AdminCard className="mt-6">
        <div className="flex items-center gap-3">
          <Activity className="text-moss" />
          <h2 className="text-xl font-semibold">Recent Activity</h2>
        </div>
        <div className="mt-5 grid gap-3">
          {data?.recentActivity?.map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex flex-col justify-between gap-2 rounded bg-pearl p-4 md:flex-row md:items-center">
              <div>
                <div className="font-semibold">{item.title}</div>
                <div className="text-sm text-graphite/60">{item.type}</div>
              </div>
              <span className="text-sm font-semibold text-copper">{item.status}</span>
            </div>
          ))}
        </div>
      </AdminCard>

      {isAdmin && data?.recentActivities && data.recentActivities.length > 0 && (
        <AdminCard className="mt-6">
          <div className="flex items-center gap-3">
            <Activity className="text-copper" />
            <h2 className="text-xl font-semibold">Admin Activity Feed</h2>
          </div>
          <div className="mt-5 grid gap-2">
            {data.recentActivities.slice(0, 8).map((item, i) => (
              <div key={i} className="flex items-center justify-between rounded bg-pearl px-4 py-3 text-sm">
                <div>
                  <span className="font-semibold">{item.adminName}</span>
                  <span className="text-graphite/60"> {item.description}</span>
                </div>
                <span className="text-xs text-graphite/50">
                  {new Date(item.createdAt).toLocaleDateString("en-IN", {
                    month: "short", day: "numeric", hour: "2-digit", minute: "2-digit"
                  })}
                </span>
              </div>
            ))}
          </div>
        </AdminCard>
      )}
    </AdminShell>
  );
}
