"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  CheckCircleIcon,
  PlayIcon,
} from "@shopify/polaris-icons";
import { Card, Breadcrumb, Badge, ProgressBar } from "@/components/polaris";
import {
  TUTORIALS,
  isTutorialCompleted,
  type TutorialMeta,
} from "@/lib/tutorial/tutorial-config";

export default function TutorialsPage() {
  const router = useRouter();
  const [completionMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {};
    for (const t of TUTORIALS) {
      map[t.id] = isTutorialCompleted(t.storageKey);
    }
    return map;
  });

  const completedCount = Object.values(completionMap).filter(Boolean).length;
  const totalCount = TUTORIALS.length;
  const progressPercent =
    totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  return (
    <div className="space-y-[var(--p-space-500)]">
      <Breadcrumb
        items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Tutorials" },
        ]}
      />

      {/* Header */}
      <div className="space-y-[var(--p-space-300)]">
        <div>
          <h1 data-testid="tutorials-heading" className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]">
            Tutorials
          </h1>
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)]">
            Interactive guides to help you master every part of your Chef Portal.
          </p>
        </div>

        {/* Overall progress */}
        <Card data-testid="tutorials-progress" className="!py-[var(--p-space-400)]">
          <div className="flex items-center gap-[var(--p-space-400)]">
            <div className="flex-1 space-y-[var(--p-space-200)]">
              <div className="flex items-center justify-between">
                <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                  Your progress
                </p>
                <p className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                  {completedCount} of {totalCount} completed
                </p>
              </div>
              <ProgressBar progress={progressPercent} size="small" />
            </div>
          </div>
        </Card>
      </div>

      {/* Tutorial cards grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--p-space-400)]">
        {TUTORIALS.map((tutorial) => (
          <TutorialCard
            key={tutorial.id}
            tutorial={tutorial}
            isCompleted={completionMap[tutorial.id] ?? false}
            onClick={() => router.push(tutorial.href)}
          />
        ))}
      </div>
    </div>
  );
}

function TutorialCard({
  tutorial,
  isCompleted,
  onClick,
}: {
  tutorial: TutorialMeta;
  isCompleted: boolean;
  onClick: () => void;
}) {
  const Icon = tutorial.icon;

  return (
    <Card
      className="cursor-pointer transition-shadow hover:shadow-md group"
      onClick={onClick}
      data-testid="tutorial-card"
    >
      <div className="space-y-[var(--p-space-400)]">
        {/* Icon + badge row */}
        <div className="flex items-start justify-between">
          <div className="size-12 rounded-[var(--p-border-radius-300)] bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center">
            <Icon className="size-6 fill-[var(--p-color-icon)]" />
          </div>
          {isCompleted ? (
            <Badge tone="success" size="sm">
              <span className="flex items-center gap-[var(--p-space-100)]">
                <CheckCircleIcon className="size-3 fill-current" />
                Completed
              </span>
            </Badge>
          ) : (
            <Badge tone="info" size="sm">
              {tutorial.stepCount} steps
            </Badge>
          )}
        </div>

        {/* Title + description */}
        <div>
          <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] group-hover:text-[var(--p-color-text-brand)]">
            {tutorial.title}
          </h3>
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)] line-clamp-2">
            {tutorial.description}
          </p>
        </div>

        {/* Action hint */}
        <div className="flex items-center gap-[var(--p-space-100)] text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-brand)]">
          <PlayIcon className="size-3.5 fill-current" />
          {isCompleted ? "Run again" : "Start tutorial"}
        </div>
      </div>
    </Card>
  );
}
