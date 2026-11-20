"use client";
import PageLoader from "@/components/page-loader";
import EmptyState from "@/components/empty-state";
import PageHeader from "@/components/dashboard/page-header";
import { TD, TH, THead, TableWrap } from "@/components/dashboard/table-ui";
import { useFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Payment } from "@/lib/types";

export default function CustomerPaymentsPage() {
  const { data, loading } = useFetch<Payment[]>("/api/payments/my");
  if (loading) return <PageLoader />;
  const list = data ?? [];

  return (
    <div>
      <PageHeader title="Payment History" subtitle="All payments you have made." />
      {list.length === 0 ? (
        <EmptyState title="No payments yet" text="Payments appear here after you pay for a completed job." ctaLabel="View Bookings" ctaHref="/dashboard/customer/bookings" />
      ) : (
        <TableWrap>
          <THead>
            <th className={TH}>Service</th>
            <th className={TH}>Technician</th>
            <th className={TH}>Amount</th>
            <th className={TH}>Transaction ID</th>
            <th className={TH}>Date</th>
          </THead>
          <tbody className="divide-y">
            {list.map((p) => (
              <tr key={p._id}>
                <td className={`${TD} font-medium text-slate-900`}>{p.serviceTitle}</td>
                <td className={TD}>{p.technicianName}</td>
                <td className={`${TD} font-semibold`}>{formatMoney(p.amount)}</td>
                <td className={`${TD} font-mono text-xs`}>{p.transactionId}</td>
                <td className={`${TD} whitespace-nowrap`}>{formatDate(p.paidAt)}</td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}
    </div>
  );
}