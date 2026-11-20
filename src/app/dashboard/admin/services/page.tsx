"use client";
import { useState } from "react";
import { toast } from "sonner";
import PageLoader from "@/components/page-loader";
import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";
import { selectClass } from "@/components/field";
import PageHeader from "@/components/dashboard/page-header";
import { TD, TH, THead, TableWrap } from "@/components/dashboard/table-ui";
import { Button } from "@/components/ui/button";
import { apiFetch, useFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { Service } from "@/lib/types";

export default function AdminServicesPage() {
  const [filter, setFilter] = useState("pending"); // default: pending age dekhabe
  const { data, loading, reload } = useFetch<Service[]>(`/api/admin/services${filter ? `?approvalStatus=${filter}` : ""}`);

  async function decide(id: string, approvalStatus: "approved" | "rejected") {
    try {
      const res = await apiFetch<{ message: string }>(`/api/admin/services/${id}/approval`, {
        method: "PATCH",
        body: JSON.stringify({ approvalStatus }),
      });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update service");
    }
  }

  if (loading) return <PageLoader />;
  const list = data ?? [];

  return (
    <div>
      <PageHeader title="Service Approval" subtitle="Approve or reject services submitted by technicians." />
      <div className="mb-4 max-w-xs">
        <select className={selectClass} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="">All</option>
        </select>
      </div>
      {list.length === 0 ? (
        <EmptyState title="No services found" text="No services match this filter." />
      ) : (
        <TableWrap>
          <THead>
            <th className={TH}>Service</th>
            <th className={TH}>Technician</th>
            <th className={TH}>Category</th>
            <th className={TH}>Price</th>
            <th className={TH}>Status</th>
            <th className={TH}>Action</th>
          </THead>
          <tbody className="divide-y">
            {list.map((s) => (
              <tr key={s._id}>
                <td className={TD}>
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={s.image} alt={s.title} className="h-12 w-16 rounded object-cover" />
                    <span className="min-w-40 font-medium text-slate-900">{s.title}</span>
                  </div>
                </td>
                <td className={TD}>{s.technicianName}</td>
                <td className={TD}>{s.category}</td>
                <td className={TD}>{formatMoney(s.basePrice)}</td>
                <td className={TD}><StatusBadge value={s.approvalStatus} /></td>
                <td className={TD}>
                  <div className="flex gap-2">
                    {s.approvalStatus !== "approved" && <Button size="sm" onClick={() => decide(s._id, "approved")}>Approve</Button>}
                    {s.approvalStatus !== "rejected" && <Button size="sm" variant="outline" onClick={() => decide(s._id, "rejected")}>Reject</Button>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}