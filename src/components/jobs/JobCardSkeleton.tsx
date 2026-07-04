import { Skeleton } from "../ui/Skeleton";

export function JobCardSkeleton() {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-dark-border dark:bg-dark-surface">
      <Skeleton className="mb-3 h-4 w-24" />
      <Skeleton className="mb-2 h-5 w-3/4" />
      <Skeleton className="mb-4 h-4 w-1/2" />
      <div className="mb-4 flex gap-2">
        <Skeleton className="h-6 w-16" />
        <Skeleton className="h-6 w-16" />
      </div>
      <Skeleton className="h-10 w-full rounded-lg" />
    </div>
  );
}
