import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Clock, MapPin, Wrench } from "lucide-react";
import RequestRepair from "@/components/request-repair";
import UserAvatar from "@/components/user-avatar";
import { publicFetch } from "@/lib/public-api";
import { formatMoney } from "@/lib/format";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

export default async function ServiceDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const service = await publicFetch<Service>(`/api/services/${id}`);

  
  if (!service) notFound();

  const tech = service.technician;
  const facts = [
    { icon: Clock, label: "Estimated time", value: service.estimatedDuration },
    { icon: Wrench, label: "Service mode", value: service.serviceMode },
    { icon: MapPin, label: "Service area", value: service.serviceArea },
  ];

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <Link href="/services" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-primary">
        <ArrowLeft className="h-4 w-4" /> Back to services
      </Link>

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
      
          <img src={service.image} alt={service.title} className="aspect-video w-full rounded-2xl border object-cover" />

          <div>
            <span className="rounded-full bg-teal-50 px-3 py-1 text-sm font-medium text-teal-700">{service.category}</span>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">{service.title}</h1>
            <p className="mt-4 whitespace-pre-line leading-relaxed text-slate-600">{service.description}</p>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            {facts.map(({ icon: Icon, label, value }) => (
              <div key={label} className="rounded-xl border bg-white p-4 shadow-sm">
                <Icon className="h-5 w-5 text-primary" />
                <p className="mt-2 text-xs uppercase tracking-wide text-slate-500">{label}</p>
                <p className="mt-0.5 font-semibold text-slate-900">{value}</p>
              </div>
            ))}
          </div>
        </div>

        <aside className="space-y-6">
          <div className="rounded-2xl border bg-white p-6 shadow-sm lg:sticky lg:top-24">
            <p className="text-sm text-slate-500">Starting price</p>
            <p className="text-4xl font-bold text-slate-900">{formatMoney(service.basePrice)}</p>
            <p className="mt-1 text-sm text-slate-500">You pay only after the job is completed.</p>
            <div className="mt-5">
              <RequestRepair service={service} />
            </div>

            <div className="mt-6 border-t pt-5">
              <p className="mb-3 text-sm font-semibold text-slate-900">About the technician</p>
              <div className="flex items-center gap-3">
                <UserAvatar name={tech?.name ?? service.technicianName} image={tech?.image} className="h-12 w-12" />
                <div>
                  <p className="font-semibold text-slate-900">{tech?.name ?? service.technicianName}</p>
                  {tech?.area && (
                    <p className="flex items-center gap-1 text-sm text-slate-500">
                      <MapPin className="h-3.5 w-3.5" /> {tech.area}
                    </p>
                  )}
                </div>
              </div>
              {tech?.bio && <p className="mt-3 text-sm text-slate-600">{tech.bio}</p>}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}