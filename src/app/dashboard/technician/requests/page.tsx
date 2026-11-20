"use client";
import { useState } from "react";
import { toast } from "sonner";
import PageLoader from "@/components/page-loader";
import EmptyState from "@/components/empty-state";
import ConfirmModal from "@/components/confirm-modal";
import StatusBadge from "@/components/status-badge";
import Field, { selectClass } from "@/components/field";
import PageHeader from "@/components/dashboard/page-header";
import { TD, TH, THead, TableWrap } from "@/components/dashboard/table-ui";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiFetch, useFetch } from "@/lib/api";
import { formatDate } from "@/lib/format";
import type { Booking } from "@/lib/types";

export default function TechnicianRequestsPage() {
  const [filter, setFilter] = useState("");
  const { data, loading, reload } = useFetch<Booking[]>(`/api/bookings/technician${filter ? `?status=${filter}` : ""}`);
  const [rejecting, setRejecting] = useState<Booking | null>(null);
  const [completing, setCompleting] = useState<Booking | null>(null);
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);

  async function changeStatus(id: string, status: string, finalAmount?: number) {
    setBusy(true);
    try {
      const res = await apiFetch<{ message: string }>(`/api/bookings/${id}/status`, {
        method: "PATCH",
        body: JSON.stringify({ status, finalAmount }),
      });
      toast.success(res.message);
      setRejecting(null);
      setCompleting(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setBusy(false);
    }
  }

  function openComplete(b: Booking) {
    setAmount(String(b.basePrice)); // base price diye pre-fill
    setCompleting(b);
  }

  if (loading) return <PageLoader />;
  const list = data ?? [];

  return (
    <div>
      <PageHeader title="Manage Requests" subtitle="Accept jobs and move them through the repair pipeline." />
      <div className="mb-4 max-w-xs">
        <select className={selectClass} value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">All</option>
          <option value="requested">Requested</option>
          <option value="accepted">Accepted</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {list.length === 0 ? (
        <EmptyState title="No requests found" text="Repair requests for your services will appear here." />
      ) : (
        <TableWrap>
          <THead>
            <th className={TH}>Customer</th>
            <th className={TH}>Phone</th>
            <th className={TH}>Address</th>
            <th className={TH}>Date</th>
            <th className={TH}>Problem</th>
            <th className={TH}>Service</th>
            <th className={TH}>Status</th>
            <th className={TH}>Action</th>
          </THead>
          <tbody className="divide-y">
            {list.map((b) => (
              <tr key={b._id}>
                <td className={`${TD} font-medium text-slate-900`}>{b.customerName}</td>
                <td className={`${TD} whitespace-nowrap`}>{b.customerPhone}</td>
                <td className={`${TD} min-w-40`}>{b.address}</td>
                <td className={`${TD} whitespace-nowrap`}>{formatDate(b.preferredDate)}</td>
                <td className={`${TD} min-w-56`}>{b.problemDescription}</td>
                <td className={`${TD} min-w-40`}>{b.serviceTitle}</td>
                <td className={TD}><StatusBadge value={b.status} /></td>
                <td className={TD}>
                  <div className="flex gap-2">
                    {b.status === "requested" && (
                      <>
                        <Button size="sm" disabled={busy} onClick={() => changeStatus(b._id, "accepted")}>Accept</Button>
                        <Button size="sm" variant="outline" onClick={() => setRejecting(b)}>Reject</Button>
                      </>
                    )}
                    {b.status === "accepted" && (
                      <Button size="sm" disabled={busy} onClick={() => changeStatus(b._id, "in-progress")}>Start Work</Button>
                    )}
                    {b.status === "in-progress" && (
                      <Button size="sm" onClick={() => openComplete(b)}>Mark Completed</Button>
                    )}
                    {b.status === "completed" && <StatusBadge value={b.paymentStatus} />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <ConfirmModal
        open={!!rejecting}
        onOpenChange={(o) => !o && setRejecting(null)}
        title="Reject this request?"
        description="The customer will see this request as rejected."
        confirmText="Reject"
        loading={busy}
        onConfirm={() => rejecting && changeStatus(rejecting._id, "rejected")}
      />

      <Dialog open={!!completing} onOpenChange={(o) => !o && setCompleting(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark job as completed</DialogTitle>
            <DialogDescription>Enter the final amount the customer needs to pay.</DialogDescription>
          </DialogHeader>
          <Field label="Final Amount (USD)">
            <Input type="number" min="1" step="0.01" value={amount} onChange={(e) => setAmount(e.target.value)} />
          </Field>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCompleting(null)}>Cancel</Button>
            <Button
              disabled={busy}
              onClick={() => {
                if (!(Number(amount) > 0)) return toast.error("Final amount must be greater than 0");
                changeStatus(completing!._id, "completed", Number(amount));
              }}
            >
              Complete Job
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}