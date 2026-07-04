import { Component, type ErrorInfo, type ReactNode } from "react";
import { Button } from "../ui/Button";
import { AlertTriangle, RotateCcw, Home, ChevronDown } from "lucide-react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
  showDetails: boolean;
}

export class ErrorBoundary extends Component<
  ErrorBoundaryProps,
  ErrorBoundaryState
> {
  state: ErrorBoundaryState = { error: null, showDetails: false };

  static getDerivedStateFromError(error: Error): Partial<ErrorBoundaryState> {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      "[ErrorBoundary] caught an error:",
      error,
      info.componentStack,
    );
  }

  handleReload = () => {
    window.location.reload();
  };

  handleGoHome = () => {
    window.location.href = "/";
  };

  toggleDetails = () => {
    this.setState((s) => ({ showDetails: !s.showDetails }));
  };

  render() {
    const { error, showDetails } = this.state;

    if (error) {
      return (
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-primary-50 via-violet-50 to-gray-50 px-4 dark:from-dark-bg dark:via-dark-surface dark:to-dark-bg">
          <div className="pointer-events-none absolute -left-24 -top-24 h-72 w-72 rounded-full bg-primary-200/40 blur-3xl dark:bg-dark-accent/10" />
          <div className="pointer-events-none absolute -bottom-32 -right-24 h-96 w-96 rounded-full bg-teal-300/30 blur-3xl dark:bg-dark-accent/10" />

          <div className="relative w-full max-w-lg rounded-3xl border border-gray-100 bg-white/90 p-8 text-center shadow-xl backdrop-blur-sm dark:border-dark-border dark:bg-dark-surface/90">
            <div className="relative mx-auto mb-5 flex h-16 w-16 items-center justify-center">
              <span className="absolute inset-0 animate-pulse rounded-full bg-red-100 dark:bg-red-500/10" />
              <span className="relative flex h-14 w-14 items-center justify-center rounded-full bg-red-50 dark:bg-red-500/15">
                <AlertTriangle className="h-6 w-6 text-red-500" />
              </span>
            </div>

            <h1 className="mb-2 text-xl font-bold text-gray-900 dark:text-dark-text-primary">
              Something went wrong
            </h1>
            <p className="mb-6 text-sm leading-relaxed text-gray-500 dark:text-dark-text-secondary">
              This part of the app hit an unexpected error. It's not you —
              reloading usually fixes it.
            </p>

            <div className="flex flex-col gap-2.5 sm:flex-row">
              <Button onClick={this.handleReload} className="flex-1">
                <RotateCcw className="h-4 w-4" />
                Reload page
              </Button>
              <Button
                variant="secondary"
                onClick={this.handleGoHome}
                className="flex-1"
              >
                <Home className="h-4 w-4" />
                Go home
              </Button>
            </div>

            {import.meta.env.DEV && (
              <div className="mt-5 border-t border-gray-100 pt-4 text-start dark:border-dark-border">
                <button
                  type="button"
                  onClick={this.toggleDetails}
                  className="flex w-full cursor-pointer items-center justify-between text-xs font-medium text-gray-400 hover:text-gray-600 dark:text-dark-text-muted dark:hover:text-dark-text-secondary"
                >
                  <span>Error details (dev only)</span>
                  <ChevronDown
                    className={`h-3.5 w-3.5 transition-transform ${showDetails ? "rotate-180" : ""}`}
                  />
                </button>
                {showDetails && (
                  <pre className="mt-2 max-h-40 overflow-auto rounded-lg bg-gray-50 p-3 text-start font-mono text-xs text-red-600 dark:bg-dark-bg dark:text-red-400">
                    {error.message}
                    {error.stack ? `\n\n${error.stack}` : ""}
                  </pre>
                )}
              </div>
            )}
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
