"use client";

/**
 * Portal Guide Page
 *
 * Tabbed layout: Chef Playbook (iframe) and How-To Videos (YouTube).
 */

import { useState } from "react";
import { useRouter } from "next/navigation";
import { YouTubeEmbed } from "@/components/shared";
import { Breadcrumb, Card, Spinner, FilterPills } from "@/components/polaris";
import type { FilterPill } from "@/components/polaris";

const tabs: FilterPill[] = [
  { id: "videos", label: "Video Tutorials" },
  { id: "playbook", label: "Chef Playbook" },
];

export default function PortalGuidePage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("videos");
  const [iframeLoaded, setIframeLoaded] = useState(false);

  return (
    <div className="space-y-[var(--p-space-500)]">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Portal Guide" },
      ]} />

      {/* Header + Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--p-space-300)]">
        <div>
          <h2 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]">
            Portal Guide
          </h2>
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
            Everything you need to know about running your kitchen on Yalla Bites
          </p>
        </div>
        <FilterPills
          pills={tabs}
          selected={activeTab}
          onSelect={(id) => setActiveTab(Array.isArray(id) ? id[0] : id)}
        />
      </div>

      <div className="w-full">
        {/* Playbook tab */}
        {activeTab === "playbook" && (
          <Card className="!p-0 overflow-hidden">
            <div className="relative" style={{ minHeight: "40rem" }}>
              {!iframeLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-[var(--p-color-bg-surface)]">
                  <div className="flex flex-col items-center gap-[var(--p-space-300)]">
                    <Spinner size="large" />
                    <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Loading playbook...</p>
                  </div>
                </div>
              )}
              <iframe
                src="https://apply.yallabites.com/playbook"
                title="Yalla Bites Chef Playbook"
                className="w-full border-0"
                style={{ height: "40rem" }}
                onLoad={() => setIframeLoaded(true)}
                allow="fullscreen"
              />
            </div>
          </Card>
        )}

        {/* Videos tab */}
        {activeTab === "videos" && (
          <Card>
            <div className="mb-[var(--p-space-400)]">
              <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                How-To Videos
              </h3>
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
                Watch these instructional videos to master all the features of the Chef Portal.
              </p>
            </div>
            <YouTubeEmbed
              url="https://www.youtube.com/playlist?list=PL7T8s1rRuKeqM8YMDtUFiAPpOeHQ6lz7F"
              className="w-full"
            />
          </Card>
        )}
      </div>
    </div>
  );
}
