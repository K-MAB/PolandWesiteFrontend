import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-cyan disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        primary: "bg-blue text-white hover:bg-[#1d4789]",
        secondary: "border border-border bg-white text-navy hover:border-blue/40 hover:bg-[#f8fbff]",
        dark: "bg-navy text-white hover:bg-[#172d4c]",
        ghost: "text-navy hover:bg-slate-100",
        cyan: "bg-cyan text-white hover:bg-[#066b84]",
      },
      size: {
        sm: "min-h-8 px-3 text-xs",
        md: "min-h-10 px-4",
        lg: "min-h-12 px-5 text-[0.9375rem]",
        icon: "size-10 p-0",
      },
    },
    defaultVariants: { variant: "primary", size: "md" },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild, ...props }: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return <Component className={cn(buttonVariants({ variant, size }), className)} {...props} />;
}

export { buttonVariants };
