import Link from "next/link";
import { Inbox } from "lucide-react";
import { buttonVariants } from "@/components/ui/button";

export default function EmptyState({
  title,
  text,
  ctaLabel,
  ctaHref,
}: {
  title: string;
  text: string;
  ctaLabel?: string;
  ctaHref?: string;
}) {
  return (
    <div className="flex flex-col items-center rounded-xl border border-dashed bg-white px-6 py-14 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-teal-50 text-primary">
        <Inbox className="h-7 w-7" />
      </span>
      <h3 className="text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-slate-500">{text}</p>
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className={`${buttonVariants()} mt-5`}>
          {ctaLabel}
        </Link>
      )}
    </div>
  );
}