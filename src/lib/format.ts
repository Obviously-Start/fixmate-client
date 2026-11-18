export const formatDate = (d?: string | Date) =>
  d
    ? new Date(d).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })
    : "-";

export const formatMoney = (n?: number) => `$${Number(n ?? 0).toFixed(2)}`;

export const countByStatus = (items: { status: string }[]) =>
  ["requested", "accepted", "in-progress", "completed", "rejected", "cancelled"].map((s) => ({
    name: s.replace("-", " "),
    value: items.filter((i) => i.status === s).length,
  }));