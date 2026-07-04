import { ChevronLeft, ChevronRight } from "lucide-react";
import { cx } from "../../lib/format";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

function buildPageList(
  current: number,
  total: number,
): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);

  const pages = new Set<number>([
    1,
    2,
    total - 1,
    total,
    current - 1,
    current,
    current + 1,
  ]);
  const sorted = [...pages]
    .filter((p) => p >= 1 && p <= total)
    .sort((a, b) => a - b);

  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
}: PaginationProps) {
  if (totalPages <= 1) return null;
  const pages = buildPageList(currentPage, totalPages);

  return (
    <div className="mt-8 flex items-center justify-center gap-1.5">
      <button
        type="button"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        aria-label="Previous page"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:cursor-default disabled:opacity-40 dark:border-dark-border dark:text-dark-text-muted"
      >
        <ChevronLeft className="h-4 w-4 rtl:rotate-180" />
      </button>

      {pages.map((p, i) =>
        p === "ellipsis" ? (
          <span
            key={`ellipsis-${i}`}
            className="px-1 text-sm text-gray-400 dark:text-dark-text-muted"
          >
            …
          </span>
        ) : (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            aria-current={p === currentPage ? "page" : undefined}
            className={cx(
              "flex h-8 min-w-8 cursor-pointer items-center justify-center rounded-lg border px-2 text-sm font-medium",
              p === currentPage
                ? "border-primary-600 bg-primary-600 text-white"
                : "border-gray-200 text-gray-600 hover:bg-gray-100 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-surface",
            )}
          >
            {p}
          </button>
        ),
      )}

      <button
        type="button"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        aria-label="Next page"
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-lg border border-gray-200 text-gray-500 disabled:cursor-default disabled:opacity-40 dark:border-dark-border dark:text-dark-text-muted"
      >
        <ChevronRight className="h-4 w-4 rtl:rotate-180" />
      </button>
    </div>
  );
}
