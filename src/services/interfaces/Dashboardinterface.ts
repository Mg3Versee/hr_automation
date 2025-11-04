import { LucideIcon } from "lucide-react";

type Props = {
  title: string;
  value: string | number;
  change?: number;
  icon: LucideIcon;
  color: string; // e.g. "bg-blue-600"
  subtitle?: string;
  loading?: boolean;
};