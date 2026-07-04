import { cx } from "../../lib/format";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={cx(
        "animate-pulse rounded-md bg-gray-200 dark:bg-dark-surface",
        className,
      )}
    />
  );
}
