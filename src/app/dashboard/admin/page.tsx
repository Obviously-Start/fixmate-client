"use client";
import { ReceiptText, ShieldAlert, Users, Wrench } from "lucide-react";
import PageLoader from "@/components/page-loader";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import BarChartCard from "@/components/dashboard/bar-chart-card";
import { useFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";

interface Stats {
  totalUsers: number;
  totalTechnicians: number;
  pendingServices: number;
  totalRevenue: number;
  bookingsByStatus: { name: string; value: number }[];
  servicesByCategory: { name: string; value: number }[];
}

export default function AdminOverview() {
  const { data, loading } = useFetch<Stats>("/api/admin/stats");
  if (loading || !data) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader title="Admin Overview" subtitle="Platform activity at a glance." />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard title="Total Users" value={data.totalUsers} icon={Users} />
        <StatCard title="Total Technicians" value={data.totalTechnicians} icon={Wrench} tone="blue" />
        <StatCard title="Pending Services" value={data.pendingServices} icon={ShieldAlert} tone="amber" />
        <StatCard title="Total Revenue" value={formatMoney(data.totalRevenue)} icon={ReceiptText} tone="green" />
      </div>
      <div className="grid gap-6 lg:grid-cols-2">
        <BarChartCard title="Bookings by status" data={data.bookingsByStatus} />
        <BarChartCard title="Services by category" data={data.servicesByCategory} />
      </div>
    </div>
  );
}