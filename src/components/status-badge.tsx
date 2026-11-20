const styles: Record<string, string> = {
  requested: "bg-blue-100 text-blue-700",
  accepted: "bg-indigo-100 text-indigo-700",
  "in-progress": "bg-amber-100 text-amber-700",
  completed: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  cancelled: "bg-gray-200 text-gray-700",
  paid: "bg-green-100 text-green-700",
  unpaid: "bg-orange-100 text-orange-700",
  pending: "bg-amber-100 text-amber-700",
  approved: "bg-green-100 text-green-700",
  available: "bg-green-100 text-green-700",
  unavailable: "bg-gray-200 text-gray-700",
};

export default function StatusBadge({ value }: { value: string }) {
  const label = value.replace("-", " ").replace(/^\w/, (c) => c.toUpperCase());
  return (
    <span
      className={`inline-flex whitespace-nowrap rounded-full px-2.5 py-0.5 text-xs font-medium ${
        styles[value] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {label}
    </span>
  );
}