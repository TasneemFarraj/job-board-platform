import { cx } from "../../lib/format";
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Variant = "primary" | "secondary" | "ghost" | "icon";
type Size = "sm" | "md";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  fullWidth?: boolean;
  children: ReactNode;
}

const base = "inline-flex cursor-pointer items-center justify-center gap-2 font-semibold transition-colors disabled:cursor-not-allowed";

const variants: Record<Variant, string> = {
  primary:
    "rounded-lg bg-primary-600 text-white hover:bg-primary-700 disabled:bg-gray-300 disabled:text-white dark:disabled:bg-dark-border",
  secondary:
    "rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-bg",
  ghost:
    "rounded-lg text-primary-600 hover:text-primary-700 disabled:text-gray-300 dark:text-dark-accent dark:disabled:text-dark-text-muted/50",
  icon:
    "rounded-lg bg-gray-100 text-gray-500 hover:bg-gray-200 dark:bg-dark-bg dark:text-dark-text-secondary dark:hover:bg-dark-border",
};

const sizes: Record<Size, string> = {
  sm: "px-3 py-1.5 text-xs",
  md: "px-4 py-2.5 text-sm",
};

const iconSizes: Record<Size, string> = {
  sm: "p-1 text-xs",
  md: "p-1.5 text-sm",
};

export function Button({
  variant = "primary",
  size = "md",
  fullWidth = false,
  className,
  children,
  ...props
}: ButtonProps) {
  const sizeClass = variant === "icon" ? iconSizes[size] : sizes[size];

  return (
    <button
      {...props}
      className={cx(base, variants[variant], sizeClass, fullWidth ? "w-full" : "", className ?? "")}
    >
      {children}
    </button>
  );
}
