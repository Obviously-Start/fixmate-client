"use client";
import { ReceiptText } from "lucide-react";
import PageLoader from "@/components/page-loader";
import EmptyState from "@/components/empty-state";
import PageHeader from "@/components/dashboard/page-header";
import StatCard from "@/components/dashboard/stat-card";
import { TD, TH, THead, TableWrap } from "@/components/dashboard/table-ui";
import { apiFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Payment } from "@/lib/types";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export default function AdminTransactionsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch<{ data: Payment[]; totalRevenue: number }>("/api/admin/payments")
      .then((res) => {
        setPayments(res.data);
        setTotal(res.totalRevenue);
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;

  return (
    <div className="space-y-6">
      <PageHeader title="Transactions" subtitle="Every Stripe payment recorded on FixMate." />
      <div className="max-w-xs">
        <StatCard title="Total Revenue" value={formatMoney(total)} icon={ReceiptText} tone="green" />
      </div>
      {payments.length === 0 ? (
        <EmptyState title="No transactions yet" text="Payments will appear here once customers pay for completed jobs." />
      ) : (
        <TableWrap>
          <THead>
            <th className={TH}>Customer</th>
            <th className={TH}>Technician</th>
            <th className={TH}>Service</th>
            <th className={TH}>Amount</th>
            <th className={TH}>Transaction ID</th>
            <th className={TH}>Date</th>
          </THead>
          <tbody className="divide-y">
            {payments.map((p) => (
              <tr key={p._id}>
                <td className={TD}>{p.customerName}</td>
                <td className={TD}>{p.technicianName}</td>
                <td className={`${TD} min-w-40`}>{p.serviceTitle}</td>
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