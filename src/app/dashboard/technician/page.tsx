"use client";
import { CheckCircle2, ClipboardList, Wrench } from "lucide-react";
import PageLoader from "@/components/page-loader";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import BarChartCard from "@/components/dashboard/bar-chart-card";
import { useFetch } from "@/lib/api";
import { countByStatus } from "@/lib/format";
import type { Booking, Service } from "@/lib/types";

export default function TechnicianOverview() {
  const services = useFetch<Service[]>("/api/services/my");
  const bookings = useFetch<Booking[]>("/api/bookings/technician");
  if (services.loading || bookings.loading) return <PageLoader />;

  const s = services.data ?? [];
  const b = bookings.data ?? [];

  return (
    <div className="space-y-6">
      <PageHeader title="Technician Overview" subtitle="Your services and incoming jobs at a glance." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Services" value={s.length} icon={Wrench} />
        <StatCard title="Approved Services" value={s.filter((x) => x.approvalStatus === "approved").length} icon={CheckCircle2} tone="green" />
        <StatCard title="Pending Requests" value={b.filter((x) => x.status === "requested").length} icon={ClipboardList} tone="amber" />
      </div>
      <BarChartCard title="Jobs by status" data={countByStatus(b)} />
    </div>
  );
}