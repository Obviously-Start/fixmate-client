import { Suspense } from "react";
import { redirect } from "next/navigation";
import Section from "@/components/section";
import ServiceCard from "@/components/service-card";
import ServiceFilters from "@/components/service-filters";
import EmptyState from "@/components/empty-state";
import Pagination from "@/components/pagination";
import { publicFetchPaged } from "@/lib/public-api";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 12;

export default async function ServicesPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const sp = await searchParams;

 
  const filters: Record<string, string> = {};
  for (const key of ["search", "category", "mode", "sort"]) {
    const value = sp[key];
    if (typeof value === "string" && value) filters[key] = value;
  }
  const requestedPage = Math.max(1, parseInt(typeof sp.page === "string" ? sp.page : "1", 10) || 1);

  const qs = new URLSearchParams(filters);
  qs.set("page", String(requestedPage));
  qs.set("limit", String(PAGE_SIZE));


  const { data: services, pagination } = await publicFetchPaged<Service>(`/api/services?${qs.toString()}`);


  if (requestedPage > pagination.totalPages) {
    const back = new URLSearchParams(filters).toString();
    redirect(back ? `/services?${back}` : "/services");
  }

  const from = pagination.total === 0 ? 0 : (pagination.page - 1) * pagination.limit + 1;
  const to = from + services.length - (services.length ? 1 : 0);

  return (
    <Section title="Browse Repair Services" subtitle="Find the right technician for your device or appliance.">
      <Suspense>
        <ServiceFilters />
      </Suspense>

      {services.length === 0 ? (
        <EmptyState
          title="No services found"
          text="Try changing your search or filters to see more results."
          ctaLabel="Clear Filters"
          ctaHref="/services"
        />
      ) : (
        <>
          <p className="mb-4 text-sm text-slate-500">
            Showing {from}-{to} of {pagination.total} services
          </p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {services.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
          <Pagination page={pagination.page} totalPages={pagination.totalPages} params={filters} />
        </>
      )}
    </Section>
  );
}