import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ApplicationStatus, JobApplication } from "../types/application";

const STATUS_POOL: ApplicationStatus[] = ["Under review", "Interview", "Rejected", "Withdrawn"];

function randomStatus(): ApplicationStatus {
  return STATUS_POOL[Math.floor(Math.random() * STATUS_POOL.length)];
}

interface NewApplicationInput {
  jobId: string;
  jobTitle: string;
  companyName: string;
  location: string;
  fullName: string;
  email: string;
  phone?: string;
  cvFileName: string;
  coverNote?: string;
}

interface ApplicationsState {
  applications: JobApplication[];
  addApplication: (input: NewApplicationInput) => JobApplication;
  hasAppliedTo: (jobId: string) => boolean;
}

export const useApplicationsStore = create<ApplicationsState>()(
  persist(
    (set, get) => ({
      applications: [],

      addApplication: (input) => {
        const application: JobApplication = {
          id: `app-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          status: randomStatus(),
          submittedAt: Date.now(),
          ...input,
        };
        set((state) => ({ applications: [application, ...state.applications] }));
        return application;
      },

      hasAppliedTo: (jobId) => get().applications.some((a) => a.jobId === jobId),
    }),
    { name: "jobbr-applications" }
  )
);
