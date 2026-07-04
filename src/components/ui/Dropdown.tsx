import { Check, ChevronDown, Search } from "lucide-react";
import { useEffect, useRef, useState, type ReactNode } from "react";

interface BaseProps {
  options: string[];
  placeholder: string;
  allLabel: string;
  icon?: ReactNode;
  searchable?: boolean;
  searchPlaceholder?: string;
  formatOption?: (value: string) => string;
  variant?: "default" | "pill";
  hideAllOption?: boolean;
}

interface SingleDropdownProps extends BaseProps {
  multiple?: false;
  value: string | null;
  onChange: (value: string | null) => void;
}

interface MultiDropdownProps extends BaseProps {
  multiple: true;
  value: string[];
  onChange: (value: string[]) => void;
}

type DropdownProps = SingleDropdownProps | MultiDropdownProps;

export function Dropdown(props: DropdownProps) {
  const {
    options,
    placeholder,
    allLabel,
    icon,
    searchable = false,
    searchPlaceholder = "Search...",
    formatOption = (v) => v,
    variant = "default",
    hideAllOption = false,
  } = props;

  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const safeOptions = Array.isArray(options)
    ? options.filter((o): o is string => typeof o === "string")
    : [];

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setQuery("");
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpen(false);
        setQuery("");
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, []);

  useEffect(() => {
    if (open && searchable) searchRef.current?.focus();
  }, [open, searchable]);

  function safeFormat(value: string): string {
    try {
      return formatOption(value);
    } catch (err) {
      console.error("[Dropdown] formatOption threw for value:", value, err);
      return String(value);
    }
  }

  const filtered = query
    ? safeOptions.filter((o) =>
        safeFormat(o).toLowerCase().includes(query.toLowerCase()),
      )
    : safeOptions;

  const isMultiple = props.multiple === true;

  const isSelected = (option: string) =>
    isMultiple
      ? (props.value as string[]).includes(option)
      : props.value === option;

  function handleSelect(option: string | null) {
    if (isMultiple) {
      const multiProps = props as MultiDropdownProps;
      if (option === null) {
        multiProps.onChange([]);
        return;
      }
      const next = multiProps.value.includes(option)
        ? multiProps.value.filter((v) => v !== option)
        : [...multiProps.value, option];
      multiProps.onChange(next);
      return;
    }
    const singleProps = props as SingleDropdownProps;
    singleProps.onChange(option);
    setOpen(false);
    setQuery("");
  }

  const buttonLabel = isMultiple
    ? (props.value as string[]).length === 0
      ? placeholder
      : (props.value as string[]).length === 1
        ? safeFormat((props.value as string[])[0])
        : `${(props.value as string[]).length} selected`
    : props.value
      ? safeFormat(props.value as string)
      : placeholder;

  const noneSelected = isMultiple
    ? (props.value as string[]).length === 0
    : props.value === null;

  const focusRing =
    "border-primary-200 ring-4 ring-primary-50 dark:border-dark-accent dark:ring-dark-accent/15";
  const idleBorder =
    "border-gray-200 hover:border-gray-300 dark:border-dark-border dark:hover:border-dark-text-muted";

  const triggerClasses =
    variant === "pill"
      ? `flex h-9 items-center gap-2 rounded-lg border bg-gray-100 ${
          icon ? "ps-8" : "ps-3.5"
        } pe-3.5 text-sm font-medium text-gray-700 transition-colors hover:bg-white dark:bg-dark-surface dark:text-dark-text-secondary dark:hover:bg-dark-bg ${
          open ? focusRing : idleBorder
        }`
      : `flex h-10 items-center gap-2 rounded-xl border bg-white ${
          icon ? "ps-9" : "ps-3.5"
        } pe-3 text-sm font-medium transition-colors dark:bg-dark-bg ${
          open ? focusRing : idleBorder
        } ${noneSelected ? "text-gray-700 dark:text-dark-text-secondary" : "text-gray-900 dark:text-dark-text-primary"}`;
  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`relative cursor-pointer ${triggerClasses}`}
      >
        {icon && (
          <span className="pointer-events-none absolute start-3 text-gray-400 dark:text-dark-text-muted">
            {icon}
          </span>
        )}
        <span className="max-w-[10rem] truncate">{buttonLabel}</span>
        <ChevronDown
          className={`h-3.5 w-3.5 shrink-0 text-gray-400 transition-transform dark:text-dark-text-muted ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          role="listbox"
          aria-multiselectable={isMultiple}
          className="absolute start-0 top-full z-20 mt-1.5 min-w-[16rem] overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg dark:border-dark-border dark:bg-dark-surface"
        >
          {searchable && (
            <div className="relative border-b border-gray-100 p-2 dark:border-dark-border">
              <Search className="pointer-events-none absolute start-5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400 dark:text-dark-text-muted" />
              <input
                ref={searchRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={searchPlaceholder}
                className="w-full rounded-lg bg-gray-50 py-1.5 ps-8 pe-2 text-sm text-gray-700 outline-none placeholder:text-gray-400 dark:bg-dark-bg dark:text-dark-text-secondary dark:placeholder:text-dark-text-muted"
              />
            </div>
          )}

          <div className="scrollbar-modal max-h-64 overflow-y-auto p-1">
            {!hideAllOption && (
              <button
                type="button"
                role="option"
                aria-selected={noneSelected}
                onClick={() => handleSelect(null)}
                className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                  noneSelected
                    ? "bg-primary-50 font-medium text-primary-700 dark:bg-dark-bg dark:text-dark-accent"
                    : "text-gray-700 hover:bg-gray-50 dark:text-dark-text-secondary dark:hover:bg-dark-bg"
                }`}
              >
                {isMultiple && (
                  <span
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                      noneSelected
                        ? "border-primary-600 bg-primary-600"
                        : "border-gray-300 dark:border-dark-border"
                    }`}
                  >
                    {noneSelected && <Check className="h-3 w-3 text-white" />}
                  </span>
                )}
                <span className="flex-1 truncate">{allLabel}</span>
              </button>
            )}

            {filtered.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-gray-400 dark:text-dark-text-muted">
                No matches
              </p>
            )}

            {filtered.map((option) => {
              const selected = isSelected(option);
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={selected}
                  onClick={() => handleSelect(option)}
                  className={`flex w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-start text-sm capitalize transition-colors ${
                    selected
                      ? "bg-primary-50 font-medium text-primary-700 dark:bg-dark-bg dark:text-dark-accent"
                      : "text-gray-700 hover:bg-gray-50 dark:text-dark-text-secondary dark:hover:bg-dark-bg"
                  }`}
                >
                  {isMultiple ? (
                    <span
                      className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border transition-colors ${
                        selected
                          ? "border-primary-600 bg-primary-600"
                          : "border-gray-300 dark:border-dark-border"
                      }`}
                    >
                      {selected && <Check className="h-3 w-3 text-white" />}
                    </span>
                  ) : null}
                  <span className="flex-1 truncate">{safeFormat(option)}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
