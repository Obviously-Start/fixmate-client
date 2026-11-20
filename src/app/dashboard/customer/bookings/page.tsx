"use client";
import { Fragment, useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import PageLoader from "@/components/page-loader";
import EmptyState from "@/components/empty-state";
import ConfirmModal from "@/components/confirm-modal";
import StatusBadge from "@/components/status-badge";
import BookingTracker from "@/components/booking-tracker";
import PageHeader from "@/components/dashboard/page-header";
import { TD, TH, THead, TableWrap } from "@/components/dashboard/table-ui";
import { Button } from "@/components/ui/button";
import { apiFetch, useFetch } from "@/lib/api";
import { formatDate, formatMoney } from "@/lib/format";
import type { Booking } from "@/lib/types";

export default function CustomerBookingsPage() {
  const { data, loading, reload } = useFetch<Booking[]>("/api/bookings/my");
  const [cancelId, setCancelId] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [payingId, setPayingId] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);

  async function cancelBooking() {
    if (!cancelId) return;
    setBusy(true);
    try {
      await apiFetch(`/api/bookings/${cancelId}/cancel`, { method: "PATCH" });
      toast.success("Booking cancelled");
      setCancelId(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to cancel");
    } finally {
      setBusy(false);
    }
  }

  async function payNow(id: string) {
    setPayingId(id);
    try {
      const res = await apiFetch<{ url: string }>("/api/payments/create-checkout-session", {
        method: "POST",
        body: JSON.stringify({ bookingId: id }),
      });
      window.location.href = res.url; 
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Payment could not start");
      setPayingId(null);
    }
  }

  if (loading) return <PageLoader />;
  const list = data ?? [];

  return (
    <div>
      <PageHeader title="My Bookings" subtitle="Track your repair requests and pay for completed jobs." />
      {list.length === 0 ? (
        <EmptyState title="No bookings yet" text="Browse services and send your first repair request." ctaLabel="Browse Services" ctaHref="/services" />
      ) : (
        <TableWrap>
          <THead>
            <th className={TH}>Service</th>
            <th className={TH}>Technician</th>
            <th className={TH}>Preferred Date</th>
            <th className={TH}>Price</th>
            <th className={TH}>Status</th>
            <th className={TH}>Payment</th>
            <th className={TH}>Action</th>
          </THead>
          <tbody className="divide-y">
            {list.map((b) => (
              <Fragment key={b._id}>
                <tr>
                  <td className={TD}>
                    <div className="flex items-center gap-3">
                    
                      <img src={b.serviceImage} alt={b.serviceTitle} className="h-12 w-16 rounded object-cover" />
                      <span className="min-w-40 font-medium text-slate-900">{b.serviceTitle}</span>
                    </div>
                  </td>
                  <td className={TD}>{b.technicianName}</td>
                  <td className={`${TD} whitespace-nowrap`}>{formatDate(b.preferredDate)}</td>
                  <td className={`${TD} whitespace-nowrap`}>
                    {b.status === "completed" ? formatMoney(b.finalAmount) : `From ${formatMoney(b.basePrice)}`}
                  </td>
                  <td className={TD}><StatusBadge value={b.status} /></td>
                  <td className={TD}><StatusBadge value={b.paymentStatus} /></td>
                  <td className={TD}>
                    <div className="flex flex-wrap items-center gap-2">
                      <Button size="sm" variant="outline" onClick={() => setOpenId(openId === b._id ? null : b._id)}>
                        Track {openId === b._id ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </Button>
                      {b.status === "requested" && (
                        <Button size="sm" variant="outline" onClick={() => setCancelId(b._id)}>Cancel</Button>
                      )}
                      {b.status === "completed" && b.paymentStatus === "unpaid" && (
                        <Button size="sm" disabled={payingId === b._id} onClick={() => payNow(b._id)}>
                          {payingId === b._id ? "Redirecting..." : "Pay Now"}
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
                {openId === b._id && (
                  <tr className="bg-slate-50">
                    <td colSpan={7} className="px-4 py-5">
                      <BookingTracker booking={b} />
                    </td>
                  </tr>
                )}
              </Fragment>
            ))}
          </tbody>
        </TableWrap>
      )}

      <ConfirmModal
        open={!!cancelId}
        onOpenChange={(o) => !o && setCancelId(null)}
        title="Cancel this request?"
        description="This repair request will be cancelled and cannot be undone."
        confirmText="Yes, Cancel"
        loading={busy}
        onConfirm={cancelBooking}
      />
    </div>
  );
}