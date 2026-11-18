export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

export const CATEGORIES = [
  "Smartphone",
  "Laptop & PC",
  "AC",
  "Refrigerator",
  "TV",
  "Washing Machine",
  "Electrical",
] as const;

export const SERVICE_MODES = ["Home Visit", "Shop Drop-off"] as const;

export type Role = "customer" | "technician" | "admin";

export const ROLE_LABEL: Record<Role, string> = {
  customer: "Customer",
  technician: "Technician",
  admin: "Admin",
};

export const BOOKING_STATUSES = [
  "requested",
  "accepted",
  "in-progress",
  "completed",
  "rejected",
  "cancelled",
] as const;

export const dashboardPath = (role?: string) =>
  role === "admin"
    ? "/dashboard/admin"
    : role === "technician"
      ? "/dashboard/technician"
      : "/dashboard/customer";