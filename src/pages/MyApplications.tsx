import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Search, ChevronRight, Calendar, Inbox, X } from "lucide-react";
import { useApplicationsStore } from "../store/applicationsStore";
import type { ApplicationStatus } from "../types/application";
import { EmptyState } from "../components/ui/EmptyState";
import { Dropdown } from "../components/ui/Dropdown";

type DateRange = "all" | "30d" | "90d";
type StatusFilter = ApplicationStatus | "all";

const STATUS_LIST: ApplicationStatus[] = [
  "Under review",
  "Interview",
  "Rejected",
  "Withdrawn",
];

const STATUS_STYLES: Record<
  ApplicationStatus,
  {
    badgeBg: string;
    badgeText: string;
    badgeBorder: string;
    dot: string;
    pillCountBg: string;
  }
> = {
  "Under review": {
    badgeBg: "bg-amber-50 dark:bg-amber-950/30",
    badgeText: "text-amber-700 dark:text-amber-400",
    badgeBorder: "border-amber-200 dark:border-amber-800",
    dot: "bg-amber-500",
    pillCountBg: "bg-amber-500",
  },
  Interview: {
    badgeBg: "bg-emerald-50 dark:bg-emerald-950/30",
    badgeText: "text-emerald-700 dark:text-emerald-400",
    badgeBorder: "border-emerald-200 dark:border-emerald-800",
    dot: "bg-emerald-500",
    pillCountBg: "bg-emerald-500",
  },
  Rejected: {
    badgeBg: "bg-rose-50 dark:bg-rose-950/30",
    badgeText: "text-rose-700 dark:text-rose-400",
    badgeBorder: "border-rose-200 dark:border-rose-800",
    dot: "bg-rose-500",
    pillCountBg: "bg-rose-500",
  },
  Withdrawn: {
    badgeBg: "bg-gray-100 dark:bg-dark-surface",
    badgeText: "text-gray-600 dark:text-dark-text-muted",
    badgeBorder: "border-gray-200 dark:border-dark-border",
    dot: "bg-gray-400",
    pillCountBg: "bg-gray-400",
  },
};

const AVATAR_COLORS = [
  "bg-indigo-100 text-indigo-700",
  "bg-emerald-100 text-emerald-700",
  "bg-rose-100 text-rose-700",
  "bg-orange-100 text-orange-700",
  "bg-blue-100 text-blue-700",
  "bg-violet-100 text-violet-700",
  "bg-teal-100 text-teal-700",
];

function avatarColor(name: string) {
  const sum = [...name].reduce((a, c) => a + c.charCodeAt(0), 0);
  return AVATAR_COLORS[sum % AVATAR_COLORS.length];
}

function getInitials(name: string) {
  return name.slice(0, 2).toUpperCase();
}

export function MyApplications() {
  const { t, i18n } = useTranslation();
  const applications = useApplicationsStore((s) => s.applications);

  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [dateRange, setDateRange] = useState<DateRange>("all");

  const statusCounts = useMemo<Record<string, number>>(() => {
    const counts: Record<string, number> = { all: applications.length };
    for (const status of STATUS_LIST) {
      counts[status] = applications.filter((a) => a.status === status).length;
    }
    return counts;
  }, [applications]);

  const filtered = useMemo(() => {
    let result = applications;
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      result = result.filter(
        (a) =>
          a.jobTitle.toLowerCase().includes(q) ||
          a.companyName.toLowerCase().includes(q),
      );
    }
    if (statusFilter !== "all") {
      result = result.filter((a) => a.status === statusFilter);
    }
    if (dateRange !== "all") {
      const days = dateRange === "30d" ? 30 : 90;
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      result = result.filter((a) => a.submittedAt >= cutoff);
    }
    return [...result].sort((a, b) => b.submittedAt - a.submittedAt);
  }, [applications, query, statusFilter, dateRange]);

  function formatDate(ts: number) {
    return new Intl.DateTimeFormat(i18n.language, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(ts));
  }

  const inputClass =
    "w-full rounded-xl border border-gray-200 bg-white py-2.5 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-50 dark:border-dark-border dark:bg-dark-surface dark:text-dark-text-primary dark:placeholder:text-dark-text-muted dark:focus:border-dark-accent dark:focus:ring-dark-accent/15";
  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8 sm:px-6 dark:bg-dark-bg">
      <div className="mx-auto max-w-6xl">
        <div className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-dark-text-primary">
              {t("applications.title")}
            </h1>
            <p className="text-gray-500 dark:text-dark-text-secondary">
              {t("applications.subtitle")}
            </p>
          </div>
          <span className="whitespace-nowrap text-sm text-gray-500 dark:text-dark-text-muted">
            {t("applications.count", { count: applications.length })}
          </span>
        </div>

        {/* Search + filters row */}
        <div className="mb-4 flex flex-col gap-3 sm:flex-row">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute start-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("applications.searchPlaceholder")}
              className={`${inputClass} ps-10 ${query ? "pe-8" : "pe-4"}`}
            />
            {query && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Clear search"
                className="absolute end-3 top-1/2 -translate-y-1/2 cursor-pointer rounded text-gray-400 transition-colors hover:text-gray-600 dark:hover:text-dark-text-secondary"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            )}
          </div>

          <Dropdown
            options={STATUS_LIST}
            value={statusFilter === "all" ? null : statusFilter}
            onChange={(v) => setStatusFilter(v ?? "all")}
            placeholder={t("applications.allStatuses")}
            allLabel={t("applications.allStatuses")}
            formatOption={(v) => t(`status.${v}`)}
          />

          <Dropdown
            options={["30d", "90d"]}
            value={dateRange === "all" ? null : dateRange}
            onChange={(v) => setDateRange((v ?? "all") as DateRange)}
            placeholder={t("applications.allTime")}
            allLabel={t("applications.allTime")}
            icon={<Calendar className="h-4 w-4" />}
            formatOption={(v) =>
              v === "30d"
                ? t("applications.last30d")
                : t("applications.last90d")
            }
          />
        </div>

        {/* Status filter chips */}
        <div className="mb-5 flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setStatusFilter("all")}
            className={`cursor-pointer rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
              statusFilter === "all"
                ? "border-primary-600 text-primary-700 dark:border-dark-accent dark:text-dark-accent"
                : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-surface"
            }`}
          >
            {t("applications.all")}{" "}
            <span className="ms-1">{statusCounts.all}</span>
          </button>
          {STATUS_LIST.map((status) => {
            const s = STATUS_STYLES[status];
            const active = statusFilter === status;
            return (
              <button
                key={status}
                type="button"
                onClick={() => setStatusFilter(status)}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-semibold transition-colors ${
                  active
                    ? "border-primary-600 text-primary-700 dark:border-dark-accent dark:text-dark-accent"
                    : "border-gray-200 text-gray-600 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-surface"
                }`}
              >
                <span className={`h-1.5 w-1.5 rounded-full ${s.dot}`} />
                {t(`status.${status}`)}
                <span
                  className={`ms-0.5 inline-flex h-4 min-w-[16px] items-center justify-center rounded-full px-1 text-[10px] font-bold text-white ${s.pillCountBg}`}
                >
                  {statusCounts[status]}
                </span>
              </button>
            );
          })}
        </div>

        {/* Results */}
        {filtered.length === 0 ? (
          <EmptyState
            icon={Inbox}
            title={t("empty.noApplications")}
            hint={t("empty.noApplicationsHint")}
          />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white dark:border-dark-border dark:bg-dark-surface">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-100 text-left text-xs uppercase tracking-wide text-gray-400 dark:border-dark-border dark:text-dark-text-muted">
                  <th className="px-5 py-3 font-medium">
                    {t("applications.position")}
                  </th>
                  <th className="px-5 py-3 font-medium">
                    {t("applications.company")}
                  </th>
                  <th className="px-5 py-3 font-medium">
                    {t("applications.submitted")}
                  </th>
                  <th className="px-5 py-3 font-medium">
                    {t("applications.status")}
                  </th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((app) => {
                  const inactive =
                    app.status === "Rejected" || app.status === "Withdrawn";
                  const s = STATUS_STYLES[app.status];
                  return (
                    <tr
                      key={app.id}
                      className="border-b border-gray-50 last:border-0 hover:bg-gray-50 dark:border-dark-border dark:hover:bg-dark-bg"
                    >
                      <td className="px-5 py-4">
                        <p
                          className={`font-medium ${inactive ? "text-gray-400 dark:text-dark-text-disabled" : "text-gray-900 dark:text-dark-text-primary"}`}
                        >
                          {app.jobTitle}
                        </p>
                        <p
                          className={`text-xs ${inactive ? "text-gray-300 dark:text-dark-text-disabled/50" : "text-gray-400 dark:text-dark-text-muted"}`}
                        >
                          {app.location}
                        </p>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-[11px] font-semibold ${inactive ? "bg-gray-100 text-gray-400 dark:bg-dark-bg dark:text-dark-text-disabled" : avatarColor(app.companyName)}`}
                          >
                            {getInitials(app.companyName)}
                          </span>
                          <span
                            className={
                              inactive
                                ? "text-gray-400 dark:text-dark-text-disabled"
                                : "text-gray-700 dark:text-dark-text-secondary"
                            }
                          >
                            {app.companyName}
                          </span>
                        </div>
                      </td>
                      <td
                        className={`px-5 py-4 ${inactive ? "text-gray-400 dark:text-dark-text-disabled" : "text-gray-500 dark:text-dark-text-muted"}`}
                      >
                        {formatDate(app.submittedAt)}
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold ${s.badgeBg} ${s.badgeText} ${s.badgeBorder}`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${s.dot}`}
                          />
                          {t(`status.${app.status}`)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right text-gray-300 dark:text-dark-text-muted">
                        <ChevronRight className="ms-auto h-4 w-4" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
