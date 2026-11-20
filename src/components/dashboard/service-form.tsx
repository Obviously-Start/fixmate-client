"use client";
import { useState } from "react";
import { toast } from "sonner";
import Field, { selectClass } from "@/components/field";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSession } from "@/lib/auth-client";
import { uploadImage } from "@/lib/imgbb";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";
import type { Service } from "@/lib/types";

export default function ServiceForm({
  initial,
  submitLabel,
  onSubmit,
}: {
  initial?: Service;
  submitLabel: string;
  onSubmit: (payload: Record<string, unknown>) => Promise<void>;
}) {
  const { data: session } = useSession();
  const [v, setV] = useState({
    title: initial?.title ?? "",
    category: initial?.category ?? CATEGORIES[0],
    description: initial?.description ?? "",
    basePrice: initial ? String(initial.basePrice) : "",
    estimatedDuration: initial?.estimatedDuration ?? "",
    serviceMode: initial?.serviceMode ?? SERVICE_MODES[0],
    serviceArea: initial?.serviceArea ?? "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);

  const set =
    (key: keyof typeof v) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
      setV((p) => ({ ...p, [key]: e.target.value }));

  function validate() {
    const errs: Record<string, string> = {};
    if (v.title.trim().length < 3) errs.title = "Title must be at least 3 characters";
    if (v.description.trim().length < 20) errs.description = "Description must be at least 20 characters";
    if (!(Number(v.basePrice) > 0)) errs.basePrice = "Enter a positive price";
    if (!v.estimatedDuration.trim()) errs.estimatedDuration = "Estimated duration is required";
    if (!v.serviceArea.trim()) errs.serviceArea = "Service area is required";
    if (!file && !initial?.image) errs.image = "Service image is required";
    return errs;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const image = file ? await uploadImage(file) : initial!.image;
      await onSubmit({ ...v, basePrice: Number(v.basePrice), image });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4" noValidate>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Technician Name"><Input value={session?.user.name ?? ""} readOnly className="bg-slate-50" /></Field>
        <Field label="Technician Email"><Input value={session?.user.email ?? ""} readOnly className="bg-slate-50" /></Field>
      </div>
      <Field label="Title" error={errors.title}><Input value={v.title} onChange={set("title")} placeholder="e.g. iPhone Screen Replacement" /></Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Category">
          <select className={selectClass} value={v.category} onChange={set("category")}>
            {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
          </select>
        </Field>
        <Field label="Service Mode">
          <select className={selectClass} value={v.serviceMode} onChange={set("serviceMode")}>
            {SERVICE_MODES.map((m) => <option key={m}>{m}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Description" error={errors.description}>
        <Textarea rows={4} value={v.description} onChange={set("description")} placeholder="What does this service include?" />
      </Field>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Base Price (USD)" error={errors.basePrice}><Input type="number" min="1" step="0.01" value={v.basePrice} onChange={set("basePrice")} /></Field>
        <Field label="Estimated Duration" error={errors.estimatedDuration}><Input value={v.estimatedDuration} onChange={set("estimatedDuration")} placeholder="e.g. 2-3 hours" /></Field>
      </div>
      <Field label="Service Area" error={errors.serviceArea}><Input value={v.serviceArea} onChange={set("serviceArea")} placeholder="e.g. Dhanmondi, Dhaka" /></Field>
      <Field label="Service Image" error={errors.image}>
        <Input type="file" accept="image/*" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
        {initial?.image && !file && <p className="text-xs text-slate-500">Current image will be kept if you do not choose a new one.</p>}
      </Field>
      <Button type="submit" className="w-full" disabled={busy}>
        {busy ? "Please wait..." : submitLabel}
      </Button>
    </form>
  );
}