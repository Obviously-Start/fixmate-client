import { Smartphone, Laptop, Wind, Snowflake, Tv, Shirt, Zap, Wrench, type LucideIcon } from "lucide-react";

export const CATEGORY_ICONS: Record<string, LucideIcon> = {
  Smartphone,
  "Laptop & PC": Laptop,
  AC: Wind,
  Refrigerator: Snowflake,
  TV: Tv,
  "Washing Machine": Shirt,
  Electrical: Zap,
};

export const DefaultCategoryIcon = Wrench;