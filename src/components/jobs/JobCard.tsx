import { Bookmark, BookmarkCheck, MapPin } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { Job } from "../../types/job";
import { Badge } from "../ui/Badge";
import { Button } from "../ui/Button";
import { Tooltip } from "../ui/Tooltip";
import { formatSalary } from "../../lib/format";
import { useBookmarksStore } from "../../store/bookmarksStore";
import { useApplicationsStore } from "../../store/applicationsStore";

interface JobCardProps {
  job: Job;
  onApply: (job: Job) => void;
}

export function JobCard({ job, onApply }: JobCardProps) {
  const { t } = useTranslation();
  const isBookmarked = useBookmarksStore((s) => s.isBookmarked(job.id));
  const toggleBookmark = useBookmarksStore((s) => s.toggleBookmark);
  const hasApplied = useApplicationsStore((s) => s.hasAppliedTo(job.id));
  const salary = formatSalary(job);

  return (
    <div className="flex flex-col rounded-2xl border border-gray-200 bg-white p-5 transition-shadow hover:shadow-md dark:border-dark-border dark:bg-dark-surface">
      <div className="mb-3 flex items-start justify-between">
        <span className="text-sm text-gray-500 dark:text-dark-text-muted">{job.companyName}</span>
        <button
          type="button"
          aria-label={isBookmarked ? "Remove bookmark" : "Save job"}
          onClick={() => toggleBookmark(job.id)}
          className="cursor-pointer text-gray-400 transition-colors hover:text-primary-600 dark:text-dark-text-muted dark:hover:text-dark-accent"
        >
          {isBookmarked ? (
            <BookmarkCheck className="h-5 w-5 fill-primary-600 text-primary-600 dark:fill-dark-accent dark:text-dark-accent" />
          ) : (
            <Bookmark className="h-5 w-5" />
          )}
        </button>
      </div>

      <Tooltip
        text={job.title}
        as="h3"
        className="font-semibold text-gray-900 dark:text-dark-text-primary"
        wrapClassName="mb-2"
      />

      <Tooltip
        text={job.location}
        className="text-sm text-gray-500 dark:text-dark-text-secondary"
        wrapClassName="mb-1"
        prefix={<MapPin className="h-3.5 w-3.5 shrink-0 text-gray-500 dark:text-dark-text-secondary" />}
      />

      <p className="mb-3 text-sm">
        {salary
          ? <span className="font-medium text-gray-700 dark:text-dark-text-secondary">{salary}</span>
          : <span className="italic text-gray-400 dark:text-dark-text-muted">{t("job.salaryUndisclosed")}</span>
        }
      </p>

      <div className="mb-4 flex flex-wrap gap-2">
        {job.isRemote && <Badge>{t("job.remote")}</Badge>}
        <Badge>{job.employmentType}</Badge>
        {job.seniority !== "Not specified" && <Badge>{job.seniority}</Badge>}
      </div>

      <Button
        onClick={() => onApply(job)}
        disabled={hasApplied}
        fullWidth
        className="mt-auto"
      >
        {hasApplied ? t("job.applied") : t("job.apply")}
      </Button>
    </div>
  );
}
