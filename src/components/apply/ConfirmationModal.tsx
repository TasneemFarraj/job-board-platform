import { X, Check } from "lucide-react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import type { JobApplication } from "../../types/application";
import { Button } from "../ui/Button";

interface ConfirmationModalProps {
  application: JobApplication;
  onClose: () => void;
}

export function ConfirmationModal({ application, onClose }: ConfirmationModalProps) {
  const { t } = useTranslation();

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60 p-4"
      role="dialog"
      aria-modal="true"
    >
      <div className="w-full max-w-md rounded-2xl bg-white p-6 text-center dark:bg-dark-surface">
        <div className="mb-2 flex justify-end">
          <Button variant="icon" onClick={onClose} aria-label="Close">
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary-50 dark:bg-dark-bg">
          <Check className="h-6 w-6 text-primary-600" />
        </div>

        <h2 className="mb-2 text-lg font-bold text-gray-900 dark:text-dark-text-primary">{t("confirmation.title")}</h2>
        <p className="mb-5 text-sm text-gray-500 dark:text-dark-text-secondary">
          <Trans
            i18nKey="confirmation.message"
            values={{ jobTitle: application.jobTitle, company: application.companyName }}
            components={{ bold: <strong className="font-semibold text-gray-700 dark:text-dark-text-primary" /> }}
          />
        </p>

        <div className="mb-5 space-y-2 rounded-xl bg-gray-50 p-4 text-start text-sm dark:bg-dark-bg">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-dark-text-muted">
              {t("confirmation.details")}
            </p>
            <p className="text-xs text-gray-400 dark:text-dark-text-muted">
              {new Intl.DateTimeFormat(undefined, { month: "long", day: "numeric", year: "numeric" }).format(new Date(application.submittedAt))}
            </p>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-dark-text-muted">{t("confirmation.name")}</span>
            <span className="font-medium text-gray-700 dark:text-dark-text-primary">{application.fullName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-dark-text-muted">{t("confirmation.email")}</span>
            <span className="font-medium text-gray-700 dark:text-dark-text-primary">{application.email}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-dark-text-muted">{t("confirmation.cv")}</span>
            <span className="font-medium text-gray-700 dark:text-dark-text-primary">{application.cvFileName}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <Link
            to="/applications"
            onClick={onClose}
            className="flex-1 rounded-lg border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 hover:bg-gray-50 dark:border-dark-border dark:text-dark-text-secondary dark:hover:bg-dark-bg"
          >
            {t("confirmation.viewApplications")}
          </Link>
          <Button onClick={onClose} className="flex-1">
            {t("confirmation.browseMore")}
          </Button>
        </div>
      </div>
    </div>
  );
}
