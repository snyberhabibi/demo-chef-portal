"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { CheckIcon, ChevronLeftIcon, ChevronRightIcon, InfoIcon } from "@shopify/polaris-icons";
import { Button } from "./button";
import { Card } from "./card";

// ── Types ─────────────────────────────────────────────────────────────

export interface WizardStep {
  id: string;
  title: string;
  description: string;
  /** Whether all required fields in this step are filled */
  isComplete?: boolean;
  /** Number of validation errors in this step */
  errorCount?: number;
}

export interface FormWizardProps {
  steps: WizardStep[];
  activeStep: number;
  onStepChange: (index: number) => void;
  /** Content to render for the current step */
  children: React.ReactNode;
  /** Page title shown in the header */
  pageTitle?: string;
  /** Live preview component for the sidebar */
  preview?: React.ReactNode;
  /** Tip text for the current step */
  tip?: string;
  /** Progress percentage (0-100) */
  progress?: number;
  /** Header right actions (save button etc.) */
  headerActions?: React.ReactNode;
  /** Current step title override */
  stepTitle?: string;
  /** Status badge in the header */
  statusBadge?: React.ReactNode;
  /** Whether save is in progress */
  isSaving?: boolean;
  /** Callback for the final step "Review" button */
  onComplete?: () => void;
  /** Called before navigating forward. Return true to allow, false to block. */
  onBeforeNext?: (currentStepIndex: number) => boolean;
}

// ── Sidebar Step Item ─────────────────────────────────────────────────

function SidebarStep({
  step,
  index,
  isActive,
  isPast,
  onClick,
}: {
  step: WizardStep;
  index: number;
  isActive: boolean;
  isPast: boolean;
  onClick: () => void;
}) {
  const hasErrors = (step.errorCount || 0) > 0;
  const isComplete = step.isComplete && !hasErrors;

  return (
    <button
      type="button"
      onClick={onClick}
      data-testid={`wizard-step-${step.id}`}
      className={cn(
        "w-full flex items-center gap-[var(--p-space-300)] p-[var(--p-space-300)] rounded-[var(--p-border-radius-200)] transition-all text-left cursor-pointer",
        "outline-none focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
        isActive
          ? "bg-[var(--p-color-bg-fill-brand)] text-white shadow-[var(--p-shadow-200)]"
          : "text-[var(--p-color-text)] hover:bg-[var(--p-color-bg-surface-hover)]"
      )}
    >
      {/* Step indicator */}
      <div className={cn(
        "size-7 rounded-full flex items-center justify-center shrink-0 text-[0.6875rem] font-[var(--p-font-weight-bold)]",
        isActive
          ? "bg-white/20 text-white"
          : isComplete
          ? "bg-[rgba(205,254,212,1)] text-[rgba(1,75,64,1)]"
          : hasErrors
          ? "bg-[var(--p-color-bg-fill-critical)] text-white"
          : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)]"
      )}>
        {isComplete ? (
          <CheckIcon className="size-4 fill-current" />
        ) : hasErrors ? (
          step.errorCount
        ) : (
          index + 1
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className={cn(
          "text-[0.8125rem] font-[var(--p-font-weight-semibold)] leading-tight",
          isActive ? "text-white" : "text-[var(--p-color-text)]"
        )}>
          {step.title}
        </p>
        <p className={cn(
          "text-[0.6875rem] leading-tight mt-[var(--p-space-025)]",
          isActive ? "text-white/60" : "text-[var(--p-color-text-secondary)]"
        )}>
          {step.description}
        </p>
      </div>
    </button>
  );
}

// ── Progress Bar ──────────────────────────────────────────────────────

function ProgressBar({ value }: { value: number }) {
  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      <div className="flex-1 h-1.5 bg-[var(--p-color-bg-fill-secondary)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--p-color-bg-fill-brand)] rounded-full transition-all duration-500 ease-out"
          style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
        />
      </div>
      <span className="text-[0.6875rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)] tabular-nums shrink-0">
        {Math.round(value)}%
      </span>
    </div>
  );
}

// ── Mobile Stepper ────────────────────────────────────────────────────

function MobileStepper({
  steps,
  activeStep,
  onStepChange,
}: {
  steps: WizardStep[];
  activeStep: number;
  onStepChange: (index: number) => void;
}) {
  return (
    <div className="flex gap-[var(--p-space-100)] overflow-x-auto scrollbar-hide px-[var(--p-space-050)]">
      {steps.map((step, index) => {
        const isActive = index === activeStep;
        const isComplete = step.isComplete && !(step.errorCount || 0);
        const hasErrors = (step.errorCount || 0) > 0;

        return (
          <button
            type="button"
            key={step.id}
            onClick={() => onStepChange(index)}
            className={cn(
              "flex items-center gap-[var(--p-space-100)] px-[var(--p-space-200)] py-[var(--p-space-150)] rounded-[var(--p-border-radius-full)] shrink-0 transition-all cursor-pointer",
              "text-[0.6875rem] font-[var(--p-font-weight-medium)]",
              "outline-none focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
              isActive
                ? "bg-[var(--p-color-bg-fill-brand)] text-white"
                : "bg-[var(--p-color-bg-surface)] text-[var(--p-color-text-secondary)] border border-[var(--p-color-border)]"
            )}
          >
            {isComplete ? (
              <CheckIcon className="size-3 fill-current" />
            ) : hasErrors ? (
              <span className="size-3.5 rounded-full bg-[var(--p-color-bg-fill-critical)] text-white text-[0.5rem] flex items-center justify-center font-bold">
                {step.errorCount}
              </span>
            ) : null}
            <span className="whitespace-nowrap">{step.title}</span>
          </button>
        );
      })}
    </div>
  );
}

// ── Main Wizard Layout ────────────────────────────────────────────────

export function FormWizard({
  steps,
  activeStep,
  onStepChange,
  children,
  pageTitle,
  preview,
  tip,
  progress,
  headerActions,
  stepTitle,
  statusBadge,
  onComplete,
  onBeforeNext,
}: FormWizardProps) {
  const currentStep = steps[activeStep];
  const isFirstStep = activeStep === 0;
  const isLastStep = activeStep === steps.length - 1;
  const [shakeError, setShakeError] = React.useState(false);
  const [fadeIn, setFadeIn] = React.useState(false);
  const prevStep = React.useRef(activeStep);

  React.useEffect(() => {
    if (prevStep.current !== activeStep) {
      prevStep.current = activeStep;
      setFadeIn(true);
      const timer = setTimeout(() => setFadeIn(false), 200);
      return () => clearTimeout(timer);
    }
  }, [activeStep]);

  const canProceed = () => {
    if (onBeforeNext) return onBeforeNext(activeStep);
    // Block if current step has errors or is not complete
    if (currentStep?.errorCount && currentStep.errorCount > 0) return false;
    if (currentStep?.isComplete === false) return false;
    return true;
  };

  const goNext = () => {
    if (!canProceed()) {
      setShakeError(true);
      setTimeout(() => setShakeError(false), 600);
      return;
    }
    if (isLastStep) {
      onComplete?.();
    } else {
      onStepChange(activeStep + 1);
    }
  };

  const goPrev = () => {
    if (!isFirstStep) onStepChange(activeStep - 1);
  };

  // Sidebar: allow going back freely, gate going forward
  const handleSidebarStepClick = (index: number) => {
    if (index <= activeStep) {
      // Going back — always allowed
      onStepChange(index);
    } else {
      // Going forward — validate current step first
      if (!canProceed()) {
        setShakeError(true);
        setTimeout(() => setShakeError(false), 600);
        return;
      }
      onStepChange(index);
    }
  };

  return (
    <div className="flex min-h-[calc(100vh-8rem)] border border-[var(--p-color-border)]">
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          10%, 30%, 50%, 70%, 90% { transform: translateX(-4px); }
          20%, 40%, 60%, 80% { transform: translateX(4px); }
        }
        @keyframes wizardFadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        [data-shake-error=true] [data-slot=input]:placeholder-shown,
        [data-shake-error=true] [data-slot=textarea]:placeholder-shown,
        [data-shake-error=true] [aria-invalid=true] {
          border-color: var(--p-color-bg-fill-critical) !important;
          background-color: var(--p-color-bg-surface-critical) !important;
        }
      `}} />
      {/* ── Desktop Sidebar ── */}
      <aside className="w-72 shrink-0 hidden lg:flex flex-col border-r border-[var(--p-color-border-secondary)] bg-[var(--p-color-bg-surface)] p-[var(--p-space-400)]">
        {/* Steps */}
        <nav className="space-y-[var(--p-space-100)] flex-1">
          {steps.map((step, index) => (
            <SidebarStep
              key={step.id}
              step={step}
              index={index}
              isActive={index === activeStep}
              isPast={index < activeStep}
              onClick={() => handleSidebarStepClick(index)}
            />
          ))}
        </nav>

        {/* Progress */}
        {progress !== undefined && (
          <div className="mt-[var(--p-space-400)]">
            <ProgressBar value={progress} />
          </div>
        )}

        {/* Live Preview */}
        {preview && (
          <div className="mt-[var(--p-space-400)]">
            <p className="text-[0.6875rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">
              Preview
            </p>
            {preview}
          </div>
        )}

        {/* Tip Card */}
        {tip && (
          <div className="mt-[var(--p-space-400)] p-[var(--p-space-300)] bg-[rgba(234,244,255,1)] rounded-[var(--p-border-radius-200)] border border-[rgba(0,58,90,0.1)]">
            <div className="flex items-center gap-[var(--p-space-100)] text-[rgba(0,58,90,1)] mb-[var(--p-space-100)]">
              <InfoIcon className="size-3.5 fill-current" />
              <span className="text-[0.6875rem] font-[var(--p-font-weight-bold)]">Tip</span>
            </div>
            <p className="text-[0.6875rem] leading-relaxed text-[rgba(0,58,90,0.7)]">
              {tip}
            </p>
          </div>
        )}
      </aside>

      {/* ── Main Area ── */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <header className="shrink-0 bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] px-[var(--p-space-500)] py-[var(--p-space-300)] sticky top-0 z-10">
          <div className="flex items-center justify-between gap-[var(--p-space-400)]">
            <div className="flex items-center gap-[var(--p-space-200)] min-w-0">
              {pageTitle && (
                <h1 data-testid="form-wizard-title" className="text-[1.125rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)] truncate">
                  {pageTitle}
                </h1>
              )}
              <span className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)] shrink-0">
                Step {activeStep + 1} of {steps.length}
              </span>
              {statusBadge}
            </div>
            <div className="flex items-center gap-[var(--p-space-200)] shrink-0">
              {headerActions}
            </div>
          </div>
        </header>

        {/* Mobile stepper */}
        <div className="lg:hidden bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] px-[var(--p-space-400)] py-[var(--p-space-200)]">
          <MobileStepper steps={steps} activeStep={activeStep} onStepChange={handleSidebarStepClick} />
          {progress !== undefined && (
            <div className="mt-[var(--p-space-200)]">
              <ProgressBar value={progress} />
            </div>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div style={fadeIn ? { animation: "wizardFadeIn 0.2s ease-out" } : undefined}>
            {/* Step description */}
            {currentStep && (
              <div className="w-full px-[var(--p-space-400)] sm:px-[var(--p-space-600)] pt-[var(--p-space-500)] pb-[var(--p-space-200)]">
                <h2 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">{currentStep.title}</h2>
                <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">{currentStep.description}</p>
              </div>
            )}
            <div
              data-shake-error={shakeError || undefined}
              className={cn(
                "w-full px-[var(--p-space-400)] sm:px-[var(--p-space-600)] pb-[var(--p-space-600)]",
                "[&>[data-slot=card]]:rounded-t-none [&>div>[data-slot=card]]:rounded-t-none",
                shakeError && "animate-[shake_0.5s_ease-in-out]"
              )}>
              {children}
            </div>
          </div>
        </div>

        {/* Footer */}
        <footer className="shrink-0 bg-[var(--p-color-bg-surface)] border-t border-[var(--p-color-border-secondary)] px-[var(--p-space-500)] py-[var(--p-space-300)] flex items-center justify-between">
          <Button
            type="button"
            variant="tertiary"
            onClick={goPrev}
            disabled={isFirstStep}
          >
            <ChevronLeftIcon className="size-4 fill-current" />
            Back
          </Button>

          {/* Progress dots */}
          <div className="hidden sm:flex gap-[var(--p-space-100)]">
            {steps.map((_, i) => (
              <div
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-300",
                  i === activeStep
                    ? "w-8 bg-[var(--p-color-bg-fill-brand)]"
                    : "w-4 bg-[var(--p-color-bg-fill-secondary)]"
                )}
              />
            ))}
          </div>

          {(() => {
            const hasErrors = (currentStep?.errorCount || 0) > 0;
            const isIncomplete = currentStep?.isComplete === false;
            const blocked = hasErrors || isIncomplete;
            return (
              <Button
                type="button"
                variant={blocked ? "secondary" : "default"}
                size="lg"
                onClick={goNext}
                disabled={blocked}
              >
                {isLastStep ? "Review & Save" : "Continue"}
                <ChevronRightIcon className="size-4 fill-current" />
              </Button>
            );
          })()}
        </footer>
      </div>
    </div>
  );
}
