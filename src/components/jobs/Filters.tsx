import { SlidersHorizontal } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { SortOrder } from "../../types/job";
import { Dropdown } from "../ui/Dropdown";
import { Button } from "../ui/Button";
import { cx } from "../../lib/format";

const SORT_OPTIONS: SortOrder[] = ["relevant", "newest", "salary-desc", "salary-asc", "company-az"];

function formatCategoryLabel(value: string) {
  return value.replace(/-/g, " ");
}

interface FiltersProps {
  categories: string[];
  category: string | null;
  onCategoryChange: (value: string | null) => void;
  seniorities: string[];
  seniority: string | null;
  onSeniorityChange: (value: string | null) => void;
  sort: SortOrder;
  onSortChange: (value: SortOrder) => void;
  onClear: () => void;
  resultCount: number;
  hasActiveFilters: boolean;
}

export function Filters({
  categories,
  category,
  onCategoryChange,
  seniorities,
  seniority,
  onSeniorityChange,
  sort,
  onSortChange,
  onClear,
  resultCount,
  hasActiveFilters,
}: FiltersProps) {
  const { t } = useTranslation();

  return (
    <div className="w-full">
      <div className="w-full border-b border-gray-100 bg-white dark:border-dark-border dark:bg-dark-bg">
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3 pb-3 pt-4">
            <Dropdown
              value={category}
              onChange={onCategoryChange}
              options={categories}
              placeholder={t("search.allCategories")}
              allLabel={t("search.allCategories")}
              searchable
              searchPlaceholder={t("search.searchCategories", "Search categories...")}
              formatOption={formatCategoryLabel}
              variant="pill"
            />

            <Dropdown
              value={seniority}
              onChange={onSeniorityChange}
              options={seniorities}
              placeholder={t("search.seniority")}
              allLabel={t("search.seniority")}
              variant="pill"
            />

            <Dropdown
              value={sort}
              onChange={(v) => v && onSortChange(v as SortOrder)}
              options={SORT_OPTIONS}
              placeholder={t(`sort.${sort}`)}
              allLabel=""
              hideAllOption
              icon={<SlidersHorizontal className="h-3.5 w-3.5" />}
              formatOption={(v) => t(`sort.${v}`)}
              variant="pill"
            />

            <Button
              variant="ghost"
              onClick={onClear}
              disabled={!hasActiveFilters}
              aria-disabled={!hasActiveFilters}
            >
              {t("search.clearFilters")}
            </Button>

            <span className="ms-auto text-sm text-gray-500 dark:text-dark-text-muted">
              {t("search.jobsFound", { count: resultCount })}
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="flex flex-wrap items-center gap-2 pb-3 pt-2">
          <span className="text-sm text-gray-500 dark:text-dark-text-muted">{t("search.sortBy")}</span>
          {SORT_OPTIONS.map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => onSortChange(option)}
              className={cx(
                "cursor-pointer rounded-lg px-3.5 py-1.5 text-xs font-semibold transition-colors",
                sort === option
                  ? "bg-primary-600 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200 dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:bg-dark-border"
              )}
            >
              {t(`sort.${option}`)}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
