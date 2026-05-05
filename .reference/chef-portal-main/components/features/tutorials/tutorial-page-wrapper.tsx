"use client";

import {
  createContext,
  useCallback,
  useContext,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import {
  ArrowLeftIcon,
  PlayIcon,
  ResetIcon,
  CheckCircleIcon,
  GlobeIcon,
} from "@shopify/polaris-icons";
import { Card, Button, Banner, Breadcrumb } from "@/components/polaris";
import {
  isTutorialCompleted,
  markTutorialCompleted,
  resetTutorialCompletion,
} from "@/lib/tutorial/tutorial-config";
import {
  TUTORIAL_LANGUAGES,
  getSavedLanguage,
  saveLanguage,
  isRtl,
} from "@/lib/tutorial/tutorial-i18n";
import type { TutorialLanguage } from "@/lib/tutorial/tutorial-i18n";
import type { ComponentType, SVGProps } from "react";

/* ------------------------------------------------------------------ */
/*  Context — lets children read the active language                   */
/* ------------------------------------------------------------------ */

const TutorialLanguageContext = createContext<TutorialLanguage>("en");
export function useTutorialLanguage() {
  return useContext(TutorialLanguageContext);
}

/* ------------------------------------------------------------------ */
/*  Props                                                             */
/* ------------------------------------------------------------------ */

interface TutorialPageWrapperProps {
  /** Tutorial title (always English) */
  title: string;
  /** Tutorial description (always English) */
  description: string;
  /** Icon for the landing page */
  icon: ComponentType<SVGProps<SVGSVGElement>>;
  /** localStorage key for completion tracking */
  storageKey: string;
  /** Breadcrumb trail (always English) */
  breadcrumbs: Array<{ label: string; onClick?: () => void }>;
  /** driver.js steps per language — only these get translated */
  steps: Record<TutorialLanguage, DriveStep[]>;
  /** The visual demo content to render when tutorial is active */
  children: ReactNode;
  /** Optional delay before starting the driver (default 300ms) */
  startDelay?: number;
}

/* ------------------------------------------------------------------ */
/*  Language Selector                                                 */
/* ------------------------------------------------------------------ */

function LanguageSelector({
  value,
  onChange,
}: {
  value: TutorialLanguage;
  onChange: (lang: TutorialLanguage) => void;
}) {
  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      <GlobeIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
      <div className="flex rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] overflow-hidden">
        {TUTORIAL_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            className={`px-[var(--p-space-300)] py-[var(--p-space-100)] text-[0.75rem] font-[var(--p-font-weight-semibold)] transition-colors ${
              value === lang.code
                ? "bg-[var(--p-color-bg-fill-brand)] text-white"
                : "bg-[var(--p-color-bg-surface)] text-[var(--p-color-text-secondary)] hover:bg-[var(--p-color-bg-fill-secondary)]"
            }`}
          >
            {lang.nativeLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Component                                                         */
/* ------------------------------------------------------------------ */

export function TutorialPageWrapper({
  title,
  description,
  icon: Icon,
  storageKey,
  breadcrumbs,
  steps,
  children,
  startDelay = 300,
}: TutorialPageWrapperProps) {
  const router = useRouter();
  const [lang, setLang] = useState<TutorialLanguage>(getSavedLanguage);
  const [tutorialStarted, setTutorialStarted] = useState(false);
  const [completed, setCompleted] = useState(() =>
    isTutorialCompleted(storageKey)
  );
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const handleLanguageChange = useCallback(
    (newLang: TutorialLanguage) => {
      setLang(newLang);
      saveLanguage(newLang);

      // If driver is active, restart with new language
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
        setTimeout(() => {
          launchDriverForLang(newLang);
        }, 150);
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [steps, storageKey, startDelay]
  );

  const launchDriverForLang = useCallback(
    (driverLang: TutorialLanguage) => {
      const rtlClass = isRtl(driverLang) ? " tutorial-popover-rtl" : "";

      setTimeout(() => {
        if (driverRef.current) {
          driverRef.current.destroy();
          driverRef.current = null;
        }

        const driverInstance = driver({
          showProgress: true,
          animate: true,
          allowClose: true,
          overlayColor: "black",
          overlayOpacity: 0.6,
          stagePadding: 8,
          stageRadius: 12,
          popoverClass: `tutorial-popover${rtlClass}`,
          nextBtnText: "Next \u2192",
          prevBtnText: "\u2190 Back",
          doneBtnText: "Got it!",
          progressText: "Step {{current}} of {{total}}",
          steps: steps[driverLang],
          onDestroyed: () => {
            driverRef.current = null;
            setCompleted(true);
            markTutorialCompleted(storageKey);
          },
        });

        driverRef.current = driverInstance;
        driverInstance.drive();
      }, startDelay);
    },
    [steps, storageKey, startDelay]
  );

  const startTutorial = useCallback(() => {
    setTutorialStarted(true);
    setCompleted(false);
    resetTutorialCompletion(storageKey);
    launchDriverForLang(lang);
  }, [storageKey, lang, launchDriverForLang]);

  const restartTutorial = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
    setCompleted(false);
    resetTutorialCompletion(storageKey);
    setTimeout(() => launchDriverForLang(lang), 100);
  }, [storageKey, lang, launchDriverForLang]);

  const exitTutorial = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
    setTutorialStarted(false);
  }, []);

  // Landing state
  if (!tutorialStarted) {
    return (
      <div className="space-y-[var(--p-space-500)]">
        <Breadcrumb items={breadcrumbs} />

        <Card>
          <div className="flex flex-col items-center justify-center py-[var(--p-space-800)] px-[var(--p-space-400)]">
            <div className="max-w-lg text-center space-y-[var(--p-space-500)]">
              {/* Language selector */}
              <div className="flex justify-center">
                <LanguageSelector value={lang} onChange={handleLanguageChange} />
              </div>

              <div className="mx-auto size-20 rounded-[var(--p-border-radius-400)] bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center">
                <Icon className="size-10 fill-[var(--p-color-icon)]" />
              </div>
              <div>
                <h1 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]">
                  {title}
                </h1>
                <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">
                  {description}
                </p>
              </div>
              {completed && (
                <Banner tone="success">
                  <p className="flex items-center gap-[var(--p-space-200)]">
                    <CheckCircleIcon className="size-4 fill-current shrink-0" />
                    You&apos;ve completed this tutorial before. Feel free to run
                    it again!
                  </p>
                </Banner>
              )}
              <Button
                size="lg"
                onClick={startTutorial}
                className="px-[var(--p-space-800)]"
              >
                <PlayIcon className="size-5 fill-current" />
                Start Tutorial
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Active tutorial state
  return (
    <TutorialLanguageContext.Provider value={lang}>
      <div>
        {/* Tutorial controls bar */}
        <div className="flex items-center justify-between gap-[var(--p-space-400)] px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
          <Button variant="tertiary" size="sm" onClick={exitTutorial}>
            <ArrowLeftIcon className="size-4 fill-current" />
            Exit Tutorial
          </Button>
          <div className="flex items-center gap-[var(--p-space-300)]">
            <LanguageSelector value={lang} onChange={handleLanguageChange} />
            <Button variant="secondary" size="sm" onClick={restartTutorial}>
              <ResetIcon className="size-3.5 fill-current" />
              Restart Tutorial
            </Button>
          </div>
        </div>

        {/* Tutorial content */}
        <Card className="!rounded-t-none space-y-[var(--p-space-500)]">
          {children}
        </Card>
      </div>
    </TutorialLanguageContext.Provider>
  );
}
