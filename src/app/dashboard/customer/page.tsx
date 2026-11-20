"use client";
import { CheckCircle2, ClipboardList, Clock } from "lucide-react";
import PageLoader from "@/components/page-loader";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import BarChartCard from "@/components/dashboard/bar-chart-card";
import { useFetch } from "@/lib/api";
import { countByStatus } from "@/lib/format";
import type { Booking } from "@/lib/types";

export default function CustomerOverview() {
  const { data, loading } = useFetch<Booking[]>("/api/bookings/my");
  if (loading) return <PageLoader />;

  const list = data ?? [];
  const active = list.filter((b) => ["requested", "accepted", "in-progress"].includes(b.status)).length;
  const completed = list.filter((b) => b.status === "completed").length;

  return (
    <div className="space-y-6">
      <PageHeader title="Customer Overview" subtitle="A quick look at your repair requests." />
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard title="Total Requests" value={list.length} icon={ClipboardList} />
        <StatCard title="Active Jobs" value={active} icon={Clock} tone="amber" />
        <StatCard title="Completed Jobs" value={completed} icon={CheckCircle2} tone="green" />
      </div>
      <BarChartCard title="Requests by status" data={countByStatus(list)} />
    </div>
  );
}