export interface HimalayasJob {
  title: string;
  excerpt: string;
  companyName: string;
  companySlug: string;
  companyLogo: string;
  employmentType: string;
  minSalary: number | null;
  maxSalary: number | null;
  salaryPeriod: string;
  seniority: string[];
  currency: string | null;
  locationRestrictions: string[];
  timezoneRestrictions: number[];
  categories: string[];
  parentCategories: string[];
  description: string;
  pubDate: number;
  expiryDate: number;
  applicationLink: string;
  guid: string;
}

export interface HimalayasSearchResponse {
  updatedAt: number;
  offset: number;
  limit: number;
  totalCount: number;
  jobs: HimalayasJob[];
}

export interface Job {
  id: string;
  title: string;
  companyName: string;
  companyLogo: string;
  employmentType: string;
  minSalary: number | null;
  maxSalary: number | null;
  currency: string | null;
  seniority: string;
  categories: string[];
  location: string;
  isRemote: boolean;
  description: string;
  excerpt: string;
  pubDate: number;
}

export type SortOrder = "relevant" | "newest" | "salary-desc" | "salary-asc" | "company-az";

export interface JobFilters {
  keywords: string;
  category: string | null;
  seniority: string | null;
  sort: SortOrder;
}
