import { Check, XCircle } from "lucide-react";
import { formatDate } from "@/lib/format";
import type { Booking } from "@/lib/types";

const STEPS = [
  { key: "requested", label: "Requested" },
  { key: "accepted", label: "Accepted" },
  { key: "in-progress", label: "In Progress" },
  { key: "completed", label: "Completed" },
  { key: "paid", label: "Paid" },
];

export default function BookingTracker({ booking }: { booking: Booking }) {
  const history = booking.statusHistory ?? [];
  const when = (key: string) => history.find((h) => h.status === key)?.changedAt;

 
  if (booking.status === "rejected" || booking.status === "cancelled") {
    const rejected = booking.status === "rejected";
    const date = when(booking.status);
    return (
      <div
        className={`flex flex-wrap items-center gap-2 rounded-lg px-4 py-3 text-sm font-medium ${
          rejected ? "bg-red-50 text-red-700" : "bg-gray-100 text-gray-700"
        }`}
      >
        <XCircle className="h-5 w-5" />
        {rejected ? "The technician rejected this request." : "You cancelled this request."}
        {date && <span className="font-normal opacity-80">({formatDate(date)})</span>}
      </div>
    );
  }

  const statusIndex = STEPS.findIndex((s) => s.key === booking.status);
  const current = booking.paymentStatus === "paid" ? STEPS.length - 1 : statusIndex;

  return (
    <div className="overflow-x-auto">
      <ol className="flex min-w-[34rem] items-start">
        {STEPS.map((step, i) => {
          const done = i <= current;
          const date = when(step.key);
          return (
            <li key={step.key} className="relative flex-1 text-center">
              {i > 0 && (
                <span className={`absolute left-[-50%] top-4 h-0.5 w-full ${done ? "bg-primary" : "bg-slate-200"}`} />
              )}
              <span
                className={`relative z-10 mx-auto flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-semibold ${
                  done ? "border-primary bg-primary text-white" : "border-slate-300 bg-white text-slate-400"
                }`}
              >
                {done ? <Check className="h-4 w-4" /> : i + 1}
              </span>
              <p className={`mt-2 text-xs font-medium ${done ? "text-slate-900" : "text-slate-400"}`}>{step.label}</p>
              {date && <p className="text-[11px] text-slate-500">{formatDate(date)}</p>}
            </li>
          );
        })}
      </ol>
    </div>
  );
}