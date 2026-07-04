export type ApplicationStatus = "Under review" | "Interview" | "Rejected" | "Withdrawn";

export interface JobApplication {
  id: string;
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  fullName: string;
  email: string;
  phone?: string;
  cvFileName: string;
  coverNote?: string;
  status: ApplicationStatus;
  submittedAt: number;
}
