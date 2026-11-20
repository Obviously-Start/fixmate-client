"use client";
import { useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { selectClass } from "@/components/field";
import { CATEGORIES, SERVICE_MODES } from "@/lib/constants";

export default function ServiceFilters() {
  const router = useRouter();
  const pathname = usePathname();
  const params = useSearchParams();
  const [search, setSearch] = useState(params.get("search") ?? "");

  // Filter URL e thake, tai reload korleo thik thake
  function update(key: string, value: string) {
    const next = new URLSearchParams(params.toString());
    if (value) next.set(key, value);
    else next.delete(key);
    next.delete("page"); // filter badlale abar page 1 theke
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname);
  }

  const hasFilters = ["search", "category", "mode", "sort"].some((k) => params.get(k));

  return (
    <div className="mb-8 space-y-4 rounded-xl border bg-white p-4 shadow-sm">
      <form
        onSubmit={(e) => {
          e.preventDefault();
          update("search", search.trim());
        }}
        className="flex gap-2"
      >
        <div className="flex flex-1 items-center gap-2 rounded-md border px-3">
          <Search className="h-4 w-4 text-slate-400" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title or category..."
            className="h-10 w-full bg-transparent text-sm outline-none"
          />
        </div>
        <Button type="submit">Search</Button>
      </form>

      <div className="grid gap-3 sm:grid-cols-3">
        <select className={selectClass} value={params.get("category") ?? ""} onChange={(e) => update("category", e.target.value)}>
          <option value="">All Categories</option>
          {CATEGORIES.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
        <select className={selectClass} value={params.get("mode") ?? ""} onChange={(e) => update("mode", e.target.value)}>
          <option value="">All Service Modes</option>
          {SERVICE_MODES.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>
        <select className={selectClass} value={params.get("sort") ?? "newest"} onChange={(e) => update("sort", e.target.value)}>
          <option value="newest">Newest</option>
          <option value="price-asc">Price: Low to High</option>
          <option value="price-desc">Price: High to Low</option>
        </select>
      </div>

      {hasFilters && (
        <button
          type="button"
          onClick={() => {
            setSearch("");
            router.replace(pathname);
          }}
          className="text-sm font-medium text-primary hover:underline"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
}