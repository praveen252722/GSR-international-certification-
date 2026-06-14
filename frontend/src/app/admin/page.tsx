"use client";

import { useEffect, useState } from "react";
import { Activity, Award, Building2, Inbox } from "lucide-react";
import { AdminShell } from "@/components/admin/AdminShell";
import { AdminCard } from "@/components/admin/AdminCard";
import { adminApi } from "@/lib/api";

type Dashboard = Awaited<ReturnType<typeof adminApi.dashboard>>;
const metricIcons = { certifications: Award, organizations: Building2, inquiries: Inbox };

export default function AdminDashboardPage() {
  const [data, setData] = useState<Dashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    adminApi
      .dashboard()
      .then((result) => {
        setData(result);
        setError("");
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Dashboard data could not be loaded. Please try again later.");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <AdminShell>
        <div className="grid min-h-[300px] place-items-center">
          <p className="text-graphite/60">Loading dashboard data...</p>
        </div>
      </AdminShell>
    );
  }

  if (error) {
    return (
      <AdminShell>
        <AdminCard>
          <div className="grid min-h-[200px] place-items-center text-center">
            <p className="text-red-600 font-semibold">{error}</p>
          </div>
        </AdminCard>
      </AdminShell>
    );
  }

  return (
    <AdminShell>
      <div className="grid gap-5 md:grid-cols-3">
        {[
          { Icon: metricIcons.certifications, label: "Total Certifications", value: data?.totalCertifications ?? 0 },
          { Icon: metricIcons.organizations, label: "Total Organizations", value: data?.totalOrganizations ?? 0 },
          { Icon: metricIcons.inquiries, label: "Total Inquiries", value: data?.totalInquiries ?? 0 }
        ].map(({ Icon, label, value }) => (
          <AdminCard key={label}>
            <Icon className="text-copper" />
            <div className="mt-5 text-4xl font-semibold">{value}</div>
            <div className="mt-1 text-sm text-graphite/60">{label}</div>
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
    </AdminShell>
  );
}
