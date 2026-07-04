import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Bookmark } from "lucide-react";
import { useBookmarksStore } from "../../store/bookmarksStore";
import { cx } from "../../lib/format";
import { UserMenu } from "./UserMenu";

export function Navbar() {
  const { t, i18n } = useTranslation();
  const savedCount = useBookmarksStore((s) => s.bookmarkedIds.length);

  const navLinkClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      "cursor-pointer text-sm font-medium underline-offset-4 decoration-[1.5px] transition-colors hover:text-primary-700 hover:underline dark:hover:text-dark-accent",
      isActive
        ? "text-primary-700 underline dark:text-dark-accent"
        : "text-gray-600 dark:text-dark-text-secondary",
    );

  return (
    <header className="border-b border-gray-100 bg-white dark:border-dark-border dark:bg-dark-surface">
      <div className="mx-auto flex max-w-6xl items-center px-4 py-4 sm:px-6">
        <NavLink
          to="/"
          className="flex items-center gap-2 font-bold text-gray-900 dark:text-dark-text-primary"
        >
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary-600 text-sm text-white">
            J
          </span>
          {t("nav.brand")}
        </NavLink>

        <div className="ms-auto flex items-center gap-5">
          <nav className="hidden items-center gap-6 sm:flex">
            <NavLink to="/" end className={navLinkClass}>
              {t("nav.browseJobs")}
            </NavLink>
            <NavLink to="/applications" className={navLinkClass}>
              {t("nav.myApplications")}
            </NavLink>
          </nav>

          <div className="flex overflow-hidden rounded-lg border border-gray-200 text-xs font-semibold dark:border-dark-border">
            <button
              type="button"
              onClick={() => i18n.changeLanguage("en")}
              className={cx(
                "cursor-pointer px-2.5 py-1.5",
                i18n.language === "en"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-500 dark:bg-dark-surface dark:text-dark-text-muted",
              )}
            >
              EN
            </button>
            <button
              type="button"
              onClick={() => i18n.changeLanguage("ar")}
              className={cx(
                "cursor-pointer px-2.5 py-1.5",
                i18n.language === "ar"
                  ? "bg-primary-600 text-white"
                  : "bg-white text-gray-500 dark:bg-dark-surface dark:text-dark-text-muted",
              )}
            >
              AR
            </button>
          </div>

          <NavLink
            to="/saved"
            className="hidden cursor-pointer items-center gap-1.5 text-sm text-gray-600 transition-colors hover:text-primary-700 sm:flex dark:text-dark-text-secondary dark:hover:text-dark-accent"
          >
            {savedCount > 0 ? (
              <Bookmark className="h-4 w-4 fill-primary-600 text-primary-600 dark:fill-dark-accent dark:text-dark-accent" />
            ) : (
              <Bookmark className="h-4 w-4" />
            )}
            <span>{t("nav.saved")}</span>
            {savedCount > 0 && (
              <span className="flex h-5 min-w-5 items-center justify-center rounded-full bg-primary-50 px-1 text-xs font-semibold text-primary-700 dark:bg-dark-bg dark:text-dark-accent">
                {savedCount}
              </span>
            )}
          </NavLink>

          <UserMenu />
        </div>
      </div>
    </header>
  );
}
