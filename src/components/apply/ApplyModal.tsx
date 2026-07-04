import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { X, Upload, FileText } from "lucide-react";
import { useTranslation } from "react-i18next";
import { applySchema, type ApplyFormValues } from "./applySchema";
import type { Job } from "../../types/job";
import { Button } from "../ui/Button";

interface ApplyModalProps {
  job: Job;
  onClose: () => void;
  onSubmit: (values: ApplyFormValues) => void;
}

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-900 placeholder:text-gray-400 focus:border-primary-200 focus:outline-none focus:ring-4 focus:ring-primary-50 dark:border-dark-border dark:bg-dark-bg dark:text-dark-text-primary dark:focus:border-dark-accent dark:focus:ring-dark-accent/15";

function RequiredMark() {
  return <span className="ms-0.5 text-red-500">*</span>;
}

export function ApplyModal({ job, onClose, onSubmit }: ApplyModalProps) {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, touchedFields },
  } = useForm<ApplyFormValues>({
    resolver: zodResolver(applySchema),
    mode: "onTouched",
  });

  const cvFiles = watch("cv");
  const cvFile = cvFiles?.[0] ?? null;

  const showError = (field: keyof ApplyFormValues) =>
    touchedFields[field] && errors[field] ? t(errors[field]!.message as string) : null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-lg overflow-hidden rounded-2xl bg-white shadow-xl dark:bg-dark-surface">
      <div className="scrollbar-modal max-h-[85vh] overflow-y-auto p-6">
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-dark-text-primary">
              {t("apply.title", { jobTitle: job.title })}
            </h2>
            <p className="text-sm text-gray-500 dark:text-dark-text-muted">{t("apply.at", { company: job.companyName })}</p>
          </div>
          <Button variant="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
          {/* Full name */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
              {t("apply.fullName")}<RequiredMark />
            </label>
            <input
              {...register("fullName")}
              placeholder={t("apply.fullNamePlaceholder")}
              className={inputClass}
            />
            {showError("fullName") && <p className="mt-1 text-xs text-red-500">{showError("fullName")}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
              {t("apply.email")}<RequiredMark />
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder={t("apply.emailPlaceholder")}
              className={inputClass}
            />
            {showError("email") && <p className="mt-1 text-xs text-red-500">{showError("email")}</p>}
          </div>

          {/* Phone — optional */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
              {t("apply.phone")}
              <span className="text-xs font-normal text-gray-400 dark:text-dark-text-muted">({t("apply.optional")})</span>
            </label>
            <input
              {...register("phone")}
              placeholder={t("apply.phonePlaceholder")}
              className={inputClass}
            />
          </div>

          {/* CV upload */}
          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
              {t("apply.cv")}<RequiredMark />
            </label>
            <label className={`flex cursor-pointer flex-col items-center gap-1.5 rounded-xl border-2 border-dashed px-4 py-4 text-center transition-colors ${
              cvFile
                ? "border-primary-400 bg-primary-50 dark:border-dark-accent dark:bg-dark-bg"
                : "border-gray-200 hover:border-primary-300 dark:border-dark-border dark:hover:border-dark-accent"
            }`}>
              {cvFile ? (
                <>
                  <FileText className="h-5 w-5 text-primary-600 dark:text-dark-accent" />
                  <span className="max-w-[220px] truncate text-sm font-medium text-primary-600 dark:text-dark-accent">
                    {cvFile.name}
                  </span>
                  <span className="text-xs text-gray-400">{t("apply.cvChange")}</span>
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 text-gray-400" />
                  <span className="text-sm text-gray-600 dark:text-dark-text-secondary">
                    {t("apply.cvDrop")} <span className="text-primary-600 underline dark:text-dark-accent">{t("apply.cvBrowse")}</span>
                  </span>
                  <span className="text-xs text-gray-400 dark:text-dark-text-muted">{t("apply.cvHint")}</span>
                </>
              )}
              <input {...register("cv")} type="file" accept=".pdf,.docx" className="hidden" />
            </label>
            {showError("cv") && <p className="mt-1 text-xs text-red-500">{showError("cv")}</p>}
          </div>

          {/* Cover note */}
          <div>
            <label className="mb-1 flex items-center gap-1.5 text-sm font-medium text-gray-700 dark:text-dark-text-secondary">
              {t("apply.coverNote")}
              <span className="text-xs font-normal text-gray-400 dark:text-dark-text-muted">({t("apply.optional")})</span>
            </label>
            <textarea
              {...register("coverNote")}
              placeholder={t("apply.coverNotePlaceholder")}
              rows={2}
              className={inputClass}
            />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <Button variant="secondary" type="button" onClick={onClose}>
              {t("apply.cancel")}
            </Button>
            <Button type="submit" disabled={!cvFile}>
              {t("apply.submit")}
            </Button>
          </div>
        </form>
      </div>
      </div>
    </div>
  );
}
