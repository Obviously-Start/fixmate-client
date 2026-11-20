import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

type Props = {
  page: number;
  totalPages: number;
  params: Record<string, string>; 
};

export default function Pagination({ page, totalPages, params }: Props) {
  if (totalPages <= 1) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams(params);
    if (p > 1) qs.set("page", String(p));
    else qs.delete("page");
    const s = qs.toString();
    return s ? `/services?${s}` : "/services";
  };

 
  const items: (number | "dots")[] = [];
  for (let p = 1; p <= totalPages; p++) {
    if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) items.push(p);
    else if (items[items.length - 1] !== "dots") items.push("dots");
  }

  const disabled = "pointer-events-none opacity-50";

  return (
    <nav aria-label="Pagination" className="mt-10 flex flex-wrap items-center justify-center gap-2">
      <Link
        href={href(page - 1)}
        aria-disabled={page <= 1}
        className={`${buttonVariants({ variant: "outline", size: "sm" })} ${page <= 1 ? disabled : ""}`}
      >
        <ChevronLeft className="h-4 w-4" /> Previous
      </Link>

      {items.map((item, i) =>
        item === "dots" ? (
          <span key={`dots-${i}`} className="px-2 text-slate-400">…</span>
        ) : (
          <Link
            key={item}
            href={href(item)}
            aria-current={item === page ? "page" : undefined}
            className={buttonVariants({ variant: item === page ? "default" : "outline", size: "sm" })}
          >
            {item}
          </Link>
        )
      )}

      <Link
        href={href(page + 1)}
        aria-disabled={page >= totalPages}
        className={`${buttonVariants({ variant: "outline", size: "sm" })} ${page >= totalPages ? disabled : ""}`}
      >
        Next <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}