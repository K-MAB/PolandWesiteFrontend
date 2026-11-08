import type { HTMLAttributes } from "react";

import { cn } from "@/lib/utils";

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: "neutral" | "success" | "warning" | "info";
}

export function Badge({ className, tone = "neutral", ...props }: BadgeProps) {
  const tones = {
    neutral: "bg-slate-100 text-slate-700",
    success: "bg-emerald-50 text-success ring-emerald-600/15",
    warning: "bg-amber-50 text-amber-800 ring-amber-600/20",
    info: "bg-sky-50 text-blue ring-blue/15",
  } as const;

  return (
    <span
      className={cn("inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ring-inset", tones[tone], className)}
      {...props}
    />
  );
}
