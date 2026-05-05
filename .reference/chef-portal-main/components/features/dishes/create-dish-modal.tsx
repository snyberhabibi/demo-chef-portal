"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  Button,
  Card,
  SearchBar,
  Spinner,
  Badge,
} from "@/components/polaris";
import {
  NoteIcon,
  DuplicateIcon,
  ChevronRightIcon,
  ChevronLeftIcon,
  ImageIcon,
} from "@shopify/polaris-icons";
import { cn } from "@/lib/utils";
import { useDishTemplates } from "@/hooks/use-dish-templates";
import { OptimizedImage } from "@/components/shared/image";
import { getCuisineEmoji } from "@/lib/cuisine-emoji";


interface CreateDishModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CreateDishModal({ open, onOpenChange }: CreateDishModalProps) {
  const router = useRouter();
  const [showTemplateSelect, setShowTemplateSelect] = useState(false);
  const [selectedTemplateId, setSelectedTemplateId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearchQuery(searchQuery), 500);
    return () => clearTimeout(timer);
  }, [searchQuery]);

  const { data: templatesData, isLoading: isLoadingTemplates } = useDishTemplates(
    showTemplateSelect,
    debouncedSearchQuery.trim() || undefined
  );

  const templates = Array.isArray(templatesData) ? templatesData : [];

  const handleCreateFromScratch = () => {
    router.push("/dashboard/dishes/new");
    onOpenChange(false);
  };

  const handleContinueWithTemplate = () => {
    if (selectedTemplateId) {
      router.push(`/dashboard/dishes/new?templateId=${selectedTemplateId}`);
      onOpenChange(false);
    }
  };

  const handleBack = () => {
    setShowTemplateSelect(false);
    setSelectedTemplateId(null);
  };

  const handleReset = () => {
    setShowTemplateSelect(false);
    setSelectedTemplateId(null);
    setSearchQuery("");
    setDebouncedSearchQuery("");
  };

  const handleClose = (open: boolean) => {
    if (!open) handleReset();
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-[100vw] sm:max-w-[600px] md:max-w-[700px] w-full !p-0 h-screen sm:h-auto max-h-screen sm:max-h-[90vh] flex flex-col overflow-hidden rounded-none sm:rounded-[var(--p-border-radius-300)] m-0 sm:m-4">
        {!showTemplateSelect ? (
          <>
            <DialogHeader className="px-[var(--p-space-400)] pt-[var(--p-space-400)]">
              <DialogTitle>Create New Dish</DialogTitle>
            </DialogHeader>
            <DialogBody className="flex flex-col items-center justify-center flex-1 min-h-[16rem] overflow-y-auto">
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-400)]">
                Choose how you want to create your dish
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--p-space-300)] w-full max-w-2xl">
                {/* From Scratch */}
                <button
                  onClick={handleCreateFromScratch}
                  className="flex flex-col items-center gap-[var(--p-space-200)] p-[var(--p-space-500)] rounded-[var(--p-border-radius-300)] border-2 border-dashed border-[var(--p-color-border)] text-center cursor-pointer transition-all hover:border-[var(--p-color-border-focus)] hover:bg-[var(--p-color-bg-surface-hover)] outline-none focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]"
                >
                  <div className="size-10 rounded-full bg-[var(--p-color-bg-fill-tertiary)] flex items-center justify-center">
                    <NoteIcon className="size-5 fill-[var(--p-color-icon-brand)]" />
                  </div>
                  <h3 className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                    Create from Scratch
                  </h3>
                  <p className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                    Start with a blank canvas
                  </p>
                </button>

                {/* From Template */}
                <button
                  onClick={() => setShowTemplateSelect(true)}
                  className="flex flex-col items-center gap-[var(--p-space-200)] p-[var(--p-space-500)] rounded-[var(--p-border-radius-300)] border-2 border-dashed border-[var(--p-color-border)] text-center cursor-pointer transition-all hover:border-[var(--p-color-border-focus)] hover:bg-[var(--p-color-bg-surface-hover)] outline-none focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]"
                >
                  <div className="size-10 rounded-full bg-[var(--p-color-bg-fill-tertiary)] flex items-center justify-center">
                    <DuplicateIcon className="size-5 fill-[var(--p-color-icon-brand)]" />
                  </div>
                  <h3 className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                    Create from Template
                  </h3>
                  <p className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                    Use a pre-made template as a starting point
                  </p>
                </button>
              </div>
            </DialogBody>
          </>
        ) : (
          <>
            {/* Header with back + search inline */}
            <div className="px-[var(--p-space-400)] pt-[var(--p-space-400)] pb-[var(--p-space-300)] border-b border-[var(--p-color-border-secondary)] space-y-[var(--p-space-300)]">
              <div className="flex items-center gap-[var(--p-space-200)]">
                <Button variant="tertiary" size="icon" onClick={handleBack}>
                  <ChevronLeftIcon className="size-4 fill-current" />
                </Button>
                <div>
                  <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                    Select Template
                  </h3>
                  <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                    {templates.length > 0 ? `${templates.length} templates available` : "Choose a starting point"}
                  </p>
                </div>
              </div>
              <SearchBar
                value={searchQuery}
                onChange={setSearchQuery}
                placeholder="Search templates..."
              />
            </div>

            {/* Templates grid */}
            <div className="flex-1 min-h-0 overflow-y-auto">
              {isLoadingTemplates ? (
                <div className="p-[var(--p-space-400)] space-y-[var(--p-space-300)]">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex gap-[var(--p-space-300)] animate-pulse">
                      <div className="w-20 h-20 rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] shrink-0" />
                      <div className="flex-1 space-y-[var(--p-space-200)] py-[var(--p-space-100)]">
                        <div className="h-4 w-32 rounded bg-[var(--p-color-bg-fill-secondary)]" />
                        <div className="h-3 w-48 rounded bg-[var(--p-color-bg-fill-secondary)]" />
                        <div className="h-5 w-16 rounded-full bg-[var(--p-color-bg-fill-secondary)]" />
                      </div>
                    </div>
                  ))}
                </div>
              ) : templates.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-[var(--p-space-1200)] px-[var(--p-space-400)]">
                  <div className="size-12 rounded-full bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center mb-[var(--p-space-300)]">
                    <NoteIcon className="size-6 fill-[var(--p-color-icon-secondary)]" />
                  </div>
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                    {debouncedSearchQuery ? "No templates found" : "No templates available"}
                  </p>
                  <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-050)]">
                    {debouncedSearchQuery ? "Try a different search term" : "Templates will appear here when available"}
                  </p>
                </div>
              ) : (
                <div className="p-[var(--p-space-400)] space-y-[var(--p-space-200)]">
                  {templates.map((template) => {
                    const isSelected = selectedTemplateId === template.id;
                    return (
                      <button
                        key={template.id}
                        onClick={() => setSelectedTemplateId(template.id)}
                        className={cn(
                          "flex w-full gap-[var(--p-space-300)] p-[var(--p-space-200)] rounded-[var(--p-border-radius-200)] text-left cursor-pointer transition-all outline-none",
                          "focus-visible:shadow-[0_0_0_0.125rem_var(--p-color-border-focus)]",
                          isSelected
                            ? "bg-[var(--p-color-bg-surface-selected)] ring-2 ring-[var(--p-color-border-focus)]"
                            : "hover:bg-[var(--p-color-bg-surface-hover)]"
                        )}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-20 h-20 rounded-[var(--p-border-radius-200)] overflow-hidden shrink-0 bg-[var(--p-color-bg-surface-secondary)] border border-[var(--p-color-border-secondary)]">
                          <OptimizedImage
                            src={template.image}
                            alt={template.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                            fallbackComponent={
                              <div className="w-full h-full flex items-center justify-center">
                                <ImageIcon className="size-6 fill-[var(--p-color-icon-secondary)]" />
                              </div>
                            }
                          />
                          {/* Selected check */}
                          {isSelected && (
                            <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                              <div className="size-6 rounded-full bg-white flex items-center justify-center">
                                <svg viewBox="0 0 20 20" className="size-4 text-[var(--p-color-bg-fill-brand)]">
                                  <path fill="currentColor" d="M7.5 14.5l-4-4 1.4-1.4 2.6 2.6 6.6-6.6 1.4 1.4z" />
                                </svg>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Info */}
                        <div className="flex-1 min-w-0 py-[var(--p-space-050)]">
                          <h4 className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] line-clamp-1">
                            {template.name}
                          </h4>
                          {template.description && (
                            <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] line-clamp-2 mt-[var(--p-space-050)]">
                              {template.description}
                            </p>
                          )}
                          {template.cuisine && (
                            <div className="mt-[var(--p-space-150)]">
                              <span className="inline-flex items-center gap-[var(--p-space-100)] text-[0.625rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-secondary)] bg-[var(--p-color-bg-fill-secondary)] px-[var(--p-space-150)] py-[var(--p-space-025)] rounded-[var(--p-border-radius-full)]">
                                <span className="text-[0.75rem] leading-none">{getCuisineEmoji(template.cuisine.name)}</span>
                                {template.cuisine.name}
                              </span>
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-[var(--p-space-400)] py-[var(--p-space-300)] border-t border-[var(--p-color-border-secondary)] flex items-center justify-between gap-[var(--p-space-200)]">
              <Button variant="tertiary" onClick={handleBack}>
                Back
              </Button>
              <Button onClick={handleContinueWithTemplate} disabled={!selectedTemplateId}>
                Use Template
                <ChevronRightIcon className="size-4 fill-current" />
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
