import { Search, MapPin, X } from "lucide-react";
import { useTranslation } from "react-i18next";

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  locationValue: string;
  onLocationChange: (value: string) => void;
  onSearch: () => void;
}

const inputClass =
  "w-full rounded-xl border border-gray-200 bg-white py-3 text-sm text-gray-900 placeholder:text-gray-400 transition-all focus:border-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-50 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-muted dark:focus:border-dark-accent dark:focus:ring-dark-accent/15";

const clearBtnClass =
  "absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer rounded text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-dark-text-secondary";

export function SearchBar({
  value,
  onChange,
  locationValue,
  onLocationChange,
  onSearch,
}: SearchBarProps) {
  const { t } = useTranslation();

  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      {/* Keyword input */}
      <div className="relative flex-1">
        <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={t("search.placeholder")}
          className={`${inputClass} ps-10 ${value ? "pe-8" : "pe-4"}`}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange("")}
            className={clearBtnClass}
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Location input */}
      <div className="relative sm:w-56">
        <MapPin className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
        <input
          type="text"
          value={locationValue}
          onChange={(e) => onLocationChange(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onSearch()}
          placeholder={t("search.locationPlaceholder")}
          className={`${inputClass} ps-10 ${locationValue ? "pe-8" : "pe-4"}`}
        />
        {locationValue && (
          <button
            type="button"
            onClick={() => onLocationChange("")}
            className={clearBtnClass}
            aria-label="Clear location"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Search button — no debounce wait */}
      <button
        type="button"
        onClick={onSearch}
        className="flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary-600 px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-700 dark:bg-dark-accent dark:hover:opacity-90"
      >
        <Search className="h-4 w-4" />
        {t("search.button")}
      </button>
    </div>
  );
}
