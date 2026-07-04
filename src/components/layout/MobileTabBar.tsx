import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Briefcase, Bookmark, User } from "lucide-react";
import { cx } from "../../lib/format";

export function MobileTabBar() {
  const { t } = useTranslation();

  const tabClass = ({ isActive }: { isActive: boolean }) =>
    cx(
      "flex flex-1 flex-col items-center gap-1 py-2.5 text-xs font-medium",
      isActive
        ? "text-primary-600 dark:text-dark-accent"
        : "text-gray-400 dark:text-dark-text-muted",
    );

  return (
    <nav className="fixed inset-x-0 bottom-0 z-30 flex border-t border-gray-100 bg-white sm:hidden dark:border-dark-border dark:bg-dark-surface">
      <NavLink to="/" end className={tabClass}>
        <Briefcase className="h-5 w-5" />
        {t("nav.browseJobs").split(" ")[0]}
      </NavLink>
      <NavLink to="/saved" className={tabClass}>
        <Bookmark className="h-5 w-5" />
        {t("nav.saved")}
      </NavLink>
      <NavLink to="/applications" className={tabClass}>
        <User className="h-5 w-5" />
        {t("nav.myApplications").split(" ")[0]}
      </NavLink>
    </nav>
  );
}
