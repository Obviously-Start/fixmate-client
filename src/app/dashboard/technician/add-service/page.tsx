"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PageHeader from "@/components/dashboard/page-header";
import ServiceForm from "@/components/dashboard/service-form";
import { apiFetch } from "@/lib/api";

export default function AddServicePage() {
  const router = useRouter();

  async function handleAdd(payload: Record<string, unknown>) {
    await apiFetch("/api/services", { method: "POST", body: JSON.stringify(payload) });
    toast.success("Service added! It is waiting for admin approval.");
    router.push("/dashboard/technician/my-services");
  }

  return (
    <div className="max-w-3xl">
      <PageHeader title="Add a Service" subtitle="Your service will appear publicly after admin approval." />
      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <ServiceForm submitLabel="Submit Service" onSubmit={handleAdd} />
      </div>
    </div>
  );
}