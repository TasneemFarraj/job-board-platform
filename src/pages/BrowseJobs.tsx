import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { SearchX } from "lucide-react";
import { fetchJobs } from "../api/himalayas";
import type { Job, SortOrder } from "../types/job";
import { SearchBar } from "../components/jobs/SearchBar";
import { Filters } from "../components/jobs/Filters";
import { JobCard } from "../components/jobs/JobCard";
import { JobCardSkeleton } from "../components/jobs/JobCardSkeleton";
import { Pagination } from "../components/jobs/Pagination";
import { EmptyState } from "../components/ui/EmptyState";
import { ApplyModal } from "../components/apply/ApplyModal";
import { ConfirmationModal } from "../components/apply/ConfirmationModal";
import { useApplicationsStore } from "../store/applicationsStore";
import type { ApplyFormValues } from "../components/apply/applySchema";
import type { JobApplication } from "../types/application";

const PAGE_SIZE = 6;

export function BrowseJobs() {
  const { t } = useTranslation();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [keywords, setKeywords] = useState("");
  const [location, setLocation] = useState("");

  const [activeKeywords, setActiveKeywords] = useState("");
  const [activeLocation, setActiveLocation] = useState("");

  const [category, setCategory] = useState<string | null>(null);
  const [seniority, setSeniority] = useState<string | null>(null);
  const [sort, setSort] = useState<SortOrder>("relevant");
  const [page, setPage] = useState(1);

  const [applyingTo, setApplyingTo] = useState<Job | null>(null);
  const [confirmedApp, setConfirmedApp] = useState<JobApplication | null>(null);
  const addApplication = useApplicationsStore((s) => s.addApplication);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);
    fetchJobs(100)
      .then((data) => {
        if (!cancelled) setJobs(data);
      })
      .catch((err: Error) => {
        if (!cancelled)
          setError(err.message || "Failed to load jobs. Please try again.");
      })
      .finally(() => {
        if (!cancelled) setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!keywords) {
      setActiveKeywords("");
      return;
    }
    const id = setTimeout(() => setActiveKeywords(keywords), 300);
    return () => clearTimeout(id);
  }, [keywords]);

  useEffect(() => {
    if (!location) {
      setActiveLocation("");
      return;
    }
    const id = setTimeout(() => setActiveLocation(location), 300);
    return () => clearTimeout(id);
  }, [location]);

  function handleSearch() {
    setActiveKeywords(keywords);
    setActiveLocation(location);
  }

  const categories = useMemo(
    () =>
      Array.from(new Set(jobs.flatMap((j) => j.categories)))
        .sort()
        .slice(0, 40),
    [jobs],
  );

  const seniorities = useMemo(
    () =>
      Array.from(
        new Set(
          jobs.map((j) => j.seniority).filter((s) => s !== "Not specified"),
        ),
      ).sort(),
    [jobs],
  );

  const filteredJobs = useMemo(() => {
    let result = jobs;

    if (activeKeywords.trim()) {
      const q = activeKeywords.trim().toLowerCase();
      result = result.filter(
        (j) =>
          j.title.toLowerCase().includes(q) ||
          j.companyName.toLowerCase().includes(q) ||
          j.excerpt.toLowerCase().includes(q),
      );
    }
    if (activeLocation.trim()) {
      const loc = activeLocation.trim().toLowerCase();
      result = result.filter((j) => j.location.toLowerCase().includes(loc));
    }
    if (category) {
      result = result.filter((j) => j.categories.includes(category));
    }
    if (seniority) {
      result = result.filter((j) => j.seniority === seniority);
    }

    const sorted = [...result];
    switch (sort) {
      case "newest":
        sorted.sort((a, b) => b.pubDate - a.pubDate);
        break;
      case "salary-desc":
        sorted.sort((a, b) => (b.maxSalary ?? -1) - (a.maxSalary ?? -1));
        break;
      case "salary-asc":
        sorted.sort(
          (a, b) => (a.minSalary ?? Infinity) - (b.minSalary ?? Infinity),
        );
        break;
      case "company-az":
        sorted.sort((a, b) => a.companyName.localeCompare(b.companyName));
        break;
      default:
        break;
    }
    return sorted;
  }, [jobs, activeKeywords, activeLocation, category, seniority, sort]);

  useEffect(() => {
    setPage(1);
  }, [activeKeywords, activeLocation, category, seniority, sort]);

  const totalPages = Math.max(1, Math.ceil(filteredJobs.length / PAGE_SIZE));
  const pagedJobs = filteredJobs.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

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
    <div>
      <div className="border-b border-gray-100 bg-gradient-to-br from-primary-50 via-violet-50 to-gray-50 dark:border-dark-border dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
        <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
          <h1 className="mb-1 text-2xl font-bold text-gray-900 sm:text-3xl dark:text-dark-text-primary">
            {t("hero.title")}
          </h1>
          <p className="mb-6 text-gray-500 dark:text-dark-text-secondary">
            {t("hero.subtitle")}
          </p>
          <SearchBar
            value={keywords}
            onChange={setKeywords}
            locationValue={location}
            onLocationChange={setLocation}
            onSearch={handleSearch}
          />
        </div>
      </div>

      <Filters
        categories={categories}
        category={category}
        onCategoryChange={setCategory}
        seniorities={seniorities}
        seniority={seniority}
        onSeniorityChange={setSeniority}
        sort={sort}
        onSortChange={setSort}
        hasActiveFilters={
          !!activeKeywords.trim() ||
          !!activeLocation.trim() ||
          category !== null ||
          seniority !== null ||
          sort !== "relevant"
        }
        onClear={() => {
          setCategory(null);
          setSeniority(null);
          setSort("relevant");
          setKeywords("");
          setLocation("");
          setActiveKeywords("");
          setActiveLocation("");
        }}
        resultCount={filteredJobs.length}
      />

      <div className="mx-auto max-w-6xl px-4 py-6 sm:px-6">
        {error && (
          <p className="mb-4 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <JobCardSkeleton key={i} />
            ))}
          </div>
        ) : filteredJobs.length === 0 ? (
          <EmptyState
            icon={SearchX}
            title={t("empty.noResults")}
            hint={t("empty.noResultsHint")}
          />
        ) : (
          <>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {pagedJobs.map((job) => (
                <JobCard key={job.id} job={job} onApply={setApplyingTo} />
              ))}
            </div>
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={setPage}
            />
          </>
        )}
      </div>

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
