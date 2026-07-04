import { useEffect, useRef, useState } from "react";
import { Moon, Sun, LogOut, Pencil } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useThemeStore } from "../../store/themeStore";
import { cx } from "../../lib/format";

export function UserMenu() {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const theme = useThemeStore((s) => s.theme);
  const toggleTheme = useThemeStore((s) => s.toggleTheme);
  const isDark = theme === "dark";

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={menuRef}>
      <button
        type="button"
        onClick={() => setIsOpen((v) => !v)}
        aria-label="Account menu"
        aria-expanded={isOpen}
        className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary-600 text-xs font-semibold text-white transition-colors hover:bg-primary-700"
      >
        TF
      </button>

      {isOpen && (
        <div className="absolute end-0 top-full z-40 mt-2 w-73 overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-lg dark:border-dark-border dark:bg-dark-surface">
          <div className="flex items-center gap-3 px-4 py-3.5">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary-600 text-sm font-semibold text-white">
              TF
            </div>
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-semibold text-gray-900 dark:text-dark-text-primary">
                Tasneem Farraj
              </p>
              <p className="truncate text-xs text-gray-500 dark:text-dark-text-muted">
                tasneemfarraj6@gmail.com
              </p>
            </div>
            <button
              type="button"
              aria-label="Edit profile"
              className="flex h-7 w-7 shrink-0 cursor-pointer items-center justify-center rounded-lg  border-gray-200 text-gray-500 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-bg"
            >
              <Pencil className="h-3.5 w-3.5" />
            </button>
          </div>

          <div className="border-t border-gray-100 dark:border-dark-border" />

          <button
            type="button"
            onClick={toggleTheme}
            className="flex w-full cursor-pointer items-center justify-between px-4 py-3 text-start text-sm text-gray-700 hover:bg-gray-50 dark:text-dark-text-secondary dark:hover:bg-dark-bg"
          >
            <span className="flex items-center gap-2.5">
              {isDark ? (
                <Sun className="h-4 w-4" />
              ) : (
                <Moon className="h-4 w-4" />
              )}
              {t("user.darkMode")}
            </span>
            <span
              role="switch"
              aria-checked={isDark}
              className={cx(
                "relative h-6 w-11 shrink-0 rounded-full transition-colors",
                isDark ? "bg-primary-600" : "bg-gray-300 dark:bg-dark-border",
              )}
            >
              <span
                className={cx(
                  "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform",
                  isDark ? "translate-x-5" : "translate-x-0.5",
                )}
              />
            </span>
          </button>

          <div className="border-t border-gray-100 dark:border-dark-border" />

          <button
            type="button"
            onClick={() => setIsOpen(false)}
            className="flex w-full cursor-pointer items-center gap-2.5 rounded-b-2xl px-4 py-3 text-start text-sm text-red-600 hover:bg-red-50 dark:hover:bg-dark-bg"
          >
            <LogOut className="h-4 w-4" />
            {t("user.logout")}
          </button>
        </div>
      )}
    </div>
  );
}
