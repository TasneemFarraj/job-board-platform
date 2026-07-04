import type { HimalayasJob, HimalayasSearchResponse, Job } from "../types/job";

const BASE_URL = import.meta.env.DEV
  ? "/himalayas-api/jobs/api/search"
  : "https://himalayas.app/jobs/api/search";

export async function fetchJobs(limit = 100): Promise<Job[]> {
  let res: Response;
  try {
    res = await fetch(`${BASE_URL}?limit=${limit}`);
  } catch (err) {

    console.error("[Himalayas API] network error:", err);
    throw new Error("Could not reach the jobs API. Check your network or CORS settings.");
  }

  if (!res.ok) {
    console.error(`[Himalayas API] responded with ${res.status}`);
    throw new Error(`Himalayas API error: ${res.status}`);
  }

  const data: HimalayasSearchResponse = await res.json();
  return data.jobs.map(normalizeJob);
}

function normalizeJob(raw: HimalayasJob): Job {
  const location = raw.locationRestrictions?.length
    ? raw.locationRestrictions.join(", ")
    : "Worldwide";

  const isRemote = /remote/i.test(raw.employmentType) || raw.timezoneRestrictions?.length > 3;

  return {
    id: raw.guid || `${raw.companySlug}-${raw.title}`,
    title: raw.title,
    companyName: raw.companyName,
    companyLogo: raw.companyLogo,
    employmentType: raw.employmentType,
    minSalary: raw.minSalary,
    maxSalary: raw.maxSalary,
    currency: raw.currency,
    seniority: raw.seniority?.[0] ?? "Not specified",
    categories: raw.categories ?? [],
    location,
    isRemote,
    description: stripHtml(raw.description),
    excerpt: raw.excerpt,
    pubDate: raw.pubDate,
  };
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}
