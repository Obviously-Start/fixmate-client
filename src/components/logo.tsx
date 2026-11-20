import Link from "next/link";
import { Wrench } from "lucide-react";

export default function Logo({ light = false }: { light?: boolean }) {
  return (
    <Link href="/" className="flex items-center gap-2">
      <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
        <Wrench className="h-5 w-5" />
      </span>
      <span className={`text-xl font-bold ${light ? "text-white" : "text-slate-900"}`}>
        Fix<span className="text-primary">Mate</span>
      </span>
    </Link>
  );
}