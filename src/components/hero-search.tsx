"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push(q.trim() ? `/services?search=${encodeURIComponent(q.trim())}` : "/services");
      }}
      className="mt-8 flex max-w-xl gap-2 rounded-xl border bg-white p-2 shadow-sm"
    >
      <div className="flex flex-1 items-center gap-2 px-3">
        <Search className="h-5 w-5 text-slate-400" />
        <input
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Search iPhone screen, AC servicing..."
          className="w-full bg-transparent text-sm outline-none"
        />
      </div>
      <Button type="submit">Find Technician</Button>
    </form>
  );
}