import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Bookmark } from "lucide-react";
import { fetchJobs } from "../api/himalayas";
import type { Job } from "../types/job";
import { useBookmarksStore } from "../store/bookmarksStore";
import { useApplicationsStore } from "../store/applicationsStore";
import { JobCard } from "../components/jobs/JobCard";
import { JobCardSkeleton } from "../components/jobs/JobCardSkeleton";
import { EmptyState } from "../components/ui/EmptyState";
import { ApplyModal } from "../components/apply/ApplyModal";
import { ConfirmationModal } from "../components/apply/ConfirmationModal";
import type { ApplyFormValues } from "../components/apply/applySchema";
import type { JobApplication } from "../types/application";

export function SavedJobs() {
  const { t } = useTranslation();
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const bookmarkedIds = useBookmarksStore((s) => s.bookmarkedIds);
  const removeBookmark = useBookmarksStore((s) => s.removeBookmark);
  const addApplication = useApplicationsStore((s) => s.addApplication);

  const [applyingTo, setApplyingTo] = useState<Job | null>(null);
  const [confirmedApp, setConfirmedApp] = useState<JobApplication | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchJobs(100)
      .then((data) => {
        if (!cancelled) {
          setAllJobs(data);
          const validIds = new Set(data.map((j) => j.id));
          bookmarkedIds.forEach((id) => {
            if (!validIds.has(id)) removeBookmark(id);
          });
        }
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const savedJobs = allJobs.filter((j) => bookmarkedIds.includes(j.id));

  function handleApplySubmit(values: ApplyFormValues) {
    if (!applyingTo) return;
    const application = addApplication({
      jobId: applyingTo.id,
      jobTitle: applyingTo.title,
      companyName: applyingTo.companyName,
      location: applyingTo.location,
      fullName: values.fullName,
      email: values.email,
      phone: values.phone,
      cvFileName: values.cv[0]?.name ?? "resume.pdf",
      coverNote: values.coverNote,
    });
    setApplyingTo(null);
    setConfirmedApp(application);
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
      <h1 className="mb-1 text-2xl font-bold text-gray-900 dark:text-dark-text-primary">
        {t("saved.title")}
      </h1>
      <p className="mb-6 text-gray-500 dark:text-dark-text-secondary">
        {t("saved.subtitle")}
      </p>

      {isLoading ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <JobCardSkeleton key={i} />
          ))}
        </div>
      ) : savedJobs.length === 0 ? (
        <EmptyState
          icon={Bookmark}
          title={t("empty.noSaved")}
          hint={t("empty.noSavedHint")}
        />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {savedJobs.map((job) => (
            <JobCard key={job.id} job={job} onApply={setApplyingTo} />
          ))}
        </div>
      )}

      {applyingTo && (
        <ApplyModal
          job={applyingTo}
          onClose={() => setApplyingTo(null)}
          onSubmit={handleApplySubmit}
        />
      )}
      {confirmedApp && (
        <ConfirmationModal
          application={confirmedApp}
          onClose={() => setConfirmedApp(null)}
        />
      )}
    </div>
  );
}
