"use client";
import { useState } from "react";
import { Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import PageLoader from "@/components/page-loader";
import EmptyState from "@/components/empty-state";
import ConfirmModal from "@/components/confirm-modal";
import StatusBadge from "@/components/status-badge";
import PageHeader from "@/components/dashboard/page-header";
import ServiceForm from "@/components/dashboard/service-form";
import { TD, TH, THead, TableWrap } from "@/components/dashboard/table-ui";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { apiFetch, useFetch } from "@/lib/api";
import { formatMoney } from "@/lib/format";
import type { Service } from "@/lib/types";

export default function MyServicesPage() {
  const { data, loading, reload } = useFetch<Service[]>("/api/services/my");
  const [editing, setEditing] = useState<Service | null>(null);
  const [deleting, setDeleting] = useState<Service | null>(null);
  const [busy, setBusy] = useState(false);

  async function handleUpdate(payload: Record<string, unknown>) {
    await apiFetch(`/api/services/${editing!._id}`, { method: "PATCH", body: JSON.stringify(payload) });
    toast.success("Service updated. It is pending approval again.");
    setEditing(null);
    reload();
  }

  async function handleDelete() {
    setBusy(true);
    try {
      await apiFetch(`/api/services/${deleting!._id}`, { method: "DELETE" });
      toast.success("Service deleted");
      setDeleting(null);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setBusy(false);
    }
  }

  async function toggle(id: string) {
    try {
      const res = await apiFetch<{ message: string }>(`/api/services/${id}/availability`, { method: "PATCH" });
      toast.success(res.message);
      reload();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update");
    }
  }

  if (loading) return <PageLoader />;
  const list = data ?? [];

  return (
    <div>
      <PageHeader title="My Services" subtitle="Edit, delete or turn your services on and off." />
      {list.length === 0 ? (
        <EmptyState title="No services yet" text="Add your first repair service to start getting requests." ctaLabel="Add Service" ctaHref="/dashboard/technician/add-service" />
      ) : (
        <TableWrap>
          <THead>
            <th className={TH}>Service</th>
            <th className={TH}>Category</th>
            <th className={TH}>Price</th>
            <th className={TH}>Approval</th>
            <th className={TH}>Available</th>
            <th className={TH}>Actions</th>
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
                <td className={TD}>{s.category}</td>
                <td className={TD}>{formatMoney(s.basePrice)}</td>
                <td className={TD}><StatusBadge value={s.approvalStatus} /></td>
                <td className={TD}>
                  <button
                    onClick={() => toggle(s._id)}
                    aria-label="Toggle availability"
                    className={`relative h-6 w-11 rounded-full transition ${s.isAvailable ? "bg-primary" : "bg-slate-300"}`}
                  >
                    <span className={`absolute top-0.5 h-5 w-5 rounded-full bg-white transition-all ${s.isAvailable ? "left-5" : "left-0.5"}`} />
                  </button>
                </td>
                <td className={TD}>
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline" onClick={() => setEditing(s)}><Pencil className="h-4 w-4" /></Button>
                    <Button size="sm" variant="outline" onClick={() => setDeleting(s)}><Trash2 className="h-4 w-4 text-red-600" /></Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </TableWrap>
      )}

      <Dialog open={!!editing} onOpenChange={(o) => !o && setEditing(null)}>
        <DialogContent className="max-h-[90vh] max-w-2xl overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Service</DialogTitle>
            <DialogDescription>After editing, the service goes back to pending approval.</DialogDescription>
          </DialogHeader>
          {editing && <ServiceForm initial={editing} submitLabel="Save Changes" onSubmit={handleUpdate} />}
        </DialogContent>
      </Dialog>

      <ConfirmModal
        open={!!deleting}
        onOpenChange={(o) => !o && setDeleting(null)}
        title="Delete this service?"
        description={`"${deleting?.title ?? ""}" will be permanently deleted.`}
        confirmText="Delete"
        loading={busy}
        onConfirm={handleDelete}
      />
    </div>
  );
}