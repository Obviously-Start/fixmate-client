import Link from "next/link";
import { MapPin, User } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";
import type { Service } from "@/lib/types";
import { formatMoney } from "@/lib/format";

export default function ServiceCard({ service }: { service: Service }) {
  return (
    <div className="flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-sm transition hover:shadow-md">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={service.image} alt={service.title} className="h-48 w-full object-cover" />
      <div className="flex flex-1 flex-col p-5">
        <div className="mb-2 flex items-center justify-between gap-2">
          <span className="rounded-full bg-teal-50 px-2.5 py-0.5 text-xs font-medium text-teal-700">
            {service.category}
          </span>
          <span className="text-xs font-medium text-slate-500">{service.serviceMode}</span>
        </div>
        <h3 className="line-clamp-1 text-lg font-semibold text-slate-900">{service.title}</h3>
        <p className="mt-2 flex items-center gap-1 text-sm text-slate-500">
          <MapPin className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{service.serviceArea}</span>
        </p>
        <p className="mt-1 flex items-center gap-1 text-sm text-slate-500">
          <User className="h-4 w-4 shrink-0" />
          <span className="line-clamp-1">{service.technicianName}</span>
        </p>
        <div className="mt-auto flex items-center justify-between pt-5">
          <p className="text-sm text-slate-500">
            Starts at <span className="text-lg font-bold text-slate-900">{formatMoney(service.basePrice)}</span>
          </p>
          <Link href={`/services/${service._id}`} className={buttonVariants({ size: "sm" })}>
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}