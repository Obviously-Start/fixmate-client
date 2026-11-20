"use client";
import { useState } from "react";
import PageLoader from "@/components/page-loader";
import EmptyState from "@/components/empty-state";
import StatusBadge from "@/components/status-badge";
import { selectClass } from "@/components/field";
import PageHeader from "@/components/dashboard/page-header";
import { TD, TH, THead, TableWrap } from "@/components/dashboard/table-ui";
import { useFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import { BOOKING_STATUSES } from "@/lib/constants";
import type { Booking } from "@/lib/types";

export default function AdminBookingsPage() {
  const [filter, setFilter] = useState("");
  const { data, loading } = useFetch<Booking[]>(`/api/admin/bookings${filter ? `?status=${filter}` : ""}`);
  if (loading) return <PageLoader />;
  const list = data ?? [];

  return (
    <div>
      <PageHeader title="All Bookings" subtitle="Read-only list of every repair job on the platform." />
      <div className="mb-4 max-w-xs">
        <select className={selectClass} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All Statuses</option>
          {BOOKING_STATUSES.map((s) => (
            <option key={s} value={s}>{s.replace("-", " ")}</option>
          ))}
        </select>
      </div>
      {list.length === 0 ? (
        <EmptyState title="No bookings found" text="No bookings match this filter." />
      ) : (
        <TableWrap>
          <THead>
            <th className={TH}>Service</th>
            <th className={TH}>Customer</th>
            <th className={TH}>Technician</th>
            <th className={TH}>Date</th>
            <th className={TH}>Status</th>
            <th className={TH}>Payment</th>
            <th className={TH}>Amount</th>
          </THead>
          <tbody className="divide-y">
            {list.map((b) => (
              <tr key={b._id}>
                <td className={`${TD} min-w-40 font-medium text-slate-900`}>{b.serviceTitle}</td>
                <td className={TD}>{b.customerName}</td>
                <td className={TD}>{b.technicianName}</td>
                <td className={`${TD} whitespace-nowrap`}>{formatDate(b.preferredDate)}</td>
                <td className={TD}><StatusBadge value={b.status} /></td>
                <td className={TD}><StatusBadge value={b.paymentStatus} /></td>
                <td className={TD}>{formatMoney(b.status === "completed" ? b.finalAmount : b.basePrice)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}