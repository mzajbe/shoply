import * as React from "react";
import { cn } from "@/lib/utils";

type Variant = "default" | "secondary" | "outline";

const variants: Record<Variant, string> = {
  default: "bg-slate-900 text-white",
  secondary: "bg-slate-100 text-slate-700",
  outline: "border border-slate-200 text-slate-600",
};

export function Badge({
  className,
  variant = "default",
  ...props
}: React.HTMLAttributes<HTMLSpanElement> & { variant?: Variant }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-3 py-1 text-[10px] font-black uppercase tracking-widest",
        variants[variant],
        className
      )}
      {...props}
    />
  );
}
