import type { LucideIcon } from "lucide-react";

export default function StatCard({
  title,
  value,
  icon: Icon,
  tone = "teal",
}: {
  title: string;
  value: string | number;
  icon: LucideIcon;
  tone?: "teal" | "blue" | "amber" | "green";
}) {
  const tones = {
    teal: "bg-teal-50 text-teal-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    green: "bg-green-50 text-green-700",
  };
  return (
    <div className="flex items-center gap-4 rounded-xl border bg-white p-5 shadow-sm">
      <span className={`flex h-12 w-12 items-center justify-center rounded-lg ${tones[tone]}`}>
        <Icon className="h-6 w-6" />
      </span>
      <div>
        <p className="text-sm text-slate-500">{title}</p>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
      </div>
    </div>
  );
}