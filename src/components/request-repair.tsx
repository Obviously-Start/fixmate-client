"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import Field from "@/components/field";
import { useSession } from "@/lib/auth-client";
import { apiFetch } from "@/lib/api";
import type { Service } from "@/lib/types";

export default function RequestRepair({ service }: { service: Service }) {
  const router = useRouter();
  const { data: session, isPending } = useSession();
  const [open, setOpen] = useState(false);
  const [busy, setBusy] = useState(false);
  const [form, setForm] = useState({ phone: "", address: "", date: "", problem: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().split("T")[0];
  const role = session?.user.role ?? "customer";

  if (isPending) return <Button disabled className="w-full">Loading...</Button>;

  // Logged out: sign in e pathai, login er por ei page e ferot ashbe
  if (!session) {
    return (
      <Button
        size="lg"
        className="w-full"
        onClick={() => router.push(`/sign-in?redirect=${encodeURIComponent(`/services/${service._id}`)}`)}
      >
        Request Repair
      </Button>
    );
  }

  if (role !== "customer") {
    return (
      <div className="space-y-2">
        <Button size="lg" className="w-full" disabled>Request Repair</Button>
        <p className="rounded-md bg-amber-50 p-3 text-sm text-amber-800">Only customers can request a repair.</p>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!/^[+\d][\d\s-]{7,}$/.test(form.phone.trim())) errs.phone = "Enter a valid phone number";
    if (form.address.trim().length < 5) errs.address = "Address is required";
    if (!form.date) errs.date = "Preferred date is required";
    else if (form.date < today) errs.date = "Date must be today or a future date";
    if (form.problem.trim().length < 20) errs.problem = "Describe the problem in at least 20 characters";
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      await apiFetch("/api/bookings", {
        method: "POST",
        body: JSON.stringify({
          serviceId: service._id,
          customerPhone: form.phone,
          address: form.address,
          preferredDate: form.date,
          problemDescription: form.problem,
        }),
      });
      toast.success("Repair request sent successfully!", {
        action: { label: "My Bookings", onClick: () => router.push("/dashboard/customer/bookings") },
      });
      setOpen(false);
      setForm({ phone: "", address: "", date: "", problem: "" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to send request");
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      <Button size="lg" className="w-full" onClick={() => setOpen(true)}>
        Request Repair
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Request: {service.title}</DialogTitle>
            <DialogDescription>Fill in the details and the technician will respond to your request.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4" noValidate>
            <Field label="Name"><Input value={session.user.name} readOnly className="bg-slate-50" /></Field>
            <Field label="Email"><Input value={session.user.email} readOnly className="bg-slate-50" /></Field>
            <Field label="Phone" error={errors.phone}>
              <Input value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} placeholder="01XXXXXXXXX" />
            </Field>
            <Field label="Address" error={errors.address}>
              <Input value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} placeholder="House, road, area" />
            </Field>
            <Field label="Preferred Date" error={errors.date}>
              <Input type="date" min={today} value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} />
            </Field>
            <Field label="Problem Description" error={errors.problem}>
              <Textarea rows={4} value={form.problem} onChange={(e) => setForm({ ...form, problem: e.target.value })} placeholder="What is wrong with your device? (min 20 characters)" />
            </Field>
            <Button type="submit" className="w-full" disabled={busy}>
              {busy ? "Sending..." : "Send Repair Request"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}