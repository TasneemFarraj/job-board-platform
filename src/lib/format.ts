import type { Job } from "../types/job";

export function formatSalary(job: Pick<Job, "minSalary" | "maxSalary" | "currency">): string | null {
  const { minSalary, maxSalary, currency } = job;
  if (minSalary == null && maxSalary == null) return null;

  const symbol = currencySymbol(currency);
  const format = (n: number) => `${symbol}${Math.round(n / 1000)}k`;

  if (minSalary != null && maxSalary != null) return `${format(minSalary)} – ${format(maxSalary)}`;
  if (minSalary != null) return `${format(minSalary)}+`;
  if (maxSalary != null) return `Up to ${format(maxSalary as number)}`;
  return null;
}

function currencySymbol(currency: string | null): string {
  switch (currency) {
    case "USD":
      return "$";
    case "GBP":
      return "£";
    case "EUR":
      return "€";
    default:
      return "$";
  }
}

export function formatDate(timestampMs: number, locale: string): string {
  return new Date(timestampMs).toLocaleDateString(locale === "ar" ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function cx(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}
