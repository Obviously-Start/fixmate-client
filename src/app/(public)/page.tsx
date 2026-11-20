import Link from "next/link";
import { Laptop, ShieldCheck, Smartphone, Snowflake, Star, Wind } from "lucide-react";
import Section from "@/components/section";
import HeroSearch from "@/components/hero-search";
import HowItWorks from "@/components/how-it-works";
import ServiceCard from "@/components/service-card";
import EmptyState from "@/components/empty-state";
import { buttonVariants } from "@/components/ui/button";
import { CATEGORIES } from "@/lib/constants";
import { CATEGORY_ICONS } from "@/lib/category-icons";
import { publicFetch } from "@/lib/public-api";
import type { Service } from "@/lib/types";

export const dynamic = "force-dynamic";

const trust = [
  { value: "100%", label: "Verified technicians" },
  { value: "500+", label: "Jobs completed" },
  { value: "Pay after", label: "Service is done" },
  { value: "4.8/5", label: "Average satisfaction" },
];

const testimonials = [
  { name: "Nusrat Jahan", text: "My laptop was fixed in a day and I could track every step. I paid only after it was done." },
  { name: "Tanvir Ahmed", text: "The AC technician arrived on time and the final price was exactly as discussed." },
  { name: "Mahmudul Hasan", text: "Finally a platform where I can see what is happening with my phone repair." },
];

export default async function HomePage() {
  const featured = (await publicFetch<Service[]>("/api/services/featured")) ?? [];

  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-br from-teal-50 via-white to-amber-50">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:px-8 lg:py-24">
          <div>
            <span className="inline-flex items-center gap-2 rounded-full bg-teal-100 px-3 py-1 text-sm font-medium text-teal-800">
              <ShieldCheck className="h-4 w-4" /> Verified technicians only
            </span>
            <h1 className="mt-5 text-4xl font-bold leading-tight text-slate-900 sm:text-5xl">
              Broken Device? Get It Fixed by Verified Technicians
            </h1>
            <p className="mt-4 max-w-xl text-lg text-slate-600">
              Book trusted repair services for phones, laptops and home appliances. Track your job step by step and pay
              only after the work is delivered.
            </p>
            <HeroSearch />
            <div className="mt-6">
              <Link href="/services" className={buttonVariants({ size: "lg" })}>
                Browse All Services
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {[
              { icon: Smartphone, label: "Phone Repair", color: "bg-teal-600" },
              { icon: Laptop, label: "Laptop Servicing", color: "bg-blue-600" },
              { icon: Wind, label: "AC Servicing", color: "bg-sky-600" },
              { icon: Snowflake, label: "Refrigerator", color: "bg-indigo-600" },
            ].map(({ icon: Icon, label, color }, i) => (
              <div key={label} className={`flex aspect-square flex-col items-center justify-center gap-3 rounded-2xl text-white shadow-md ${color} ${i % 2 ? "mt-6" : ""}`}>
                <Icon className="h-12 w-12" />
                <span className="font-semibold">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured services */}
      <Section title="Featured Services" subtitle="The latest approved repair services from verified technicians.">
        {featured.length === 0 ? (
          <EmptyState title="No services yet" text="Approved services will appear here soon." ctaLabel="Browse Services" ctaHref="/services" />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {featured.map((s) => (
              <ServiceCard key={s._id} service={s} />
            ))}
          </div>
        )}
      </Section>

      <HowItWorks muted />

      {/* Categories + Why choose us */}
      <Section title="Popular Categories" subtitle="Choose a category to see matching services.">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {CATEGORIES.map((c) => {
            const Icon = CATEGORY_ICONS[c];
            return (
              <Link
                key={c}
                href={`/services?category=${encodeURIComponent(c)}`}
                className="flex flex-col items-center gap-3 rounded-xl border bg-white p-6 text-center shadow-sm transition hover:border-primary hover:shadow-md"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-primary">
                  <Icon className="h-7 w-7" />
                </span>
                <span className="font-semibold text-slate-900">{c}</span>
              </Link>
            );
          })}
        </div>

        <div className="mt-14 grid grid-cols-2 gap-4 rounded-2xl bg-slate-900 p-8 text-center lg:grid-cols-4">
          {trust.map((t) => (
            <div key={t.label}>
              <p className="text-3xl font-bold text-white">{t.value}</p>
              <p className="mt-1 text-sm text-slate-400">{t.label}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section title="What Customers Say" muted>
        <div className="grid gap-6 md:grid-cols-3">
          {testimonials.map((t) => (
            <div key={t.name} className="rounded-xl border bg-white p-6 shadow-sm">
              <div className="mb-3 flex gap-1 text-amber-500">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="text-slate-600">&ldquo;{t.text}&rdquo;</p>
              <p className="mt-4 font-semibold text-slate-900">{t.name}</p>
            </div>
          ))}
        </div>
      </Section>
    </>
  );
}