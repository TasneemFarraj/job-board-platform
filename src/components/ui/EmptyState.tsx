import type { LucideIcon } from "lucide-react";

export function EmptyState({
  icon: Icon,
  title,
  hint,
}: {
  icon: LucideIcon;
  title: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center dark:border-dark-border">
      <Icon className="mb-3 h-10 w-10 text-gray-300 dark:text-dark-text-disabled" />
      <p className="font-medium text-gray-700 dark:text-dark-text-secondary">
        {title}
      </p>
      <p className="mt-1 text-sm text-gray-400 dark:text-dark-text-muted">
        {hint}
      </p>
    </div>
  );
}
