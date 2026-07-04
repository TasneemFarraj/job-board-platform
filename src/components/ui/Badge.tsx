import type { ReactNode } from "react";
import { cx } from "../../lib/format";

const VARIANTS = {
  neutral: "bg-gray-100 text-gray-700 dark:bg-dark-bg dark:text-dark-text-secondary",
  primary: "bg-primary-50 text-primary-700 dark:bg-dark-bg dark:text-dark-accent",
  warning: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300",
  success: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300",
  danger: "bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300",
  muted: "bg-gray-100 text-gray-500 dark:bg-dark-bg dark:text-dark-text-disabled",
} as const;

export function Badge({
  children,
  variant = "neutral",
  className,
}: {
  children: ReactNode;
  variant?: keyof typeof VARIANTS;
  className?: string;
}) {
  return (
    <span
      className={cx(
        "inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium",
        VARIANTS[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
