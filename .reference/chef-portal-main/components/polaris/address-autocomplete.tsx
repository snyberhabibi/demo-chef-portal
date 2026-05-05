"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  useGooglePlacesAutocomplete,
  type GooglePlacesSuggestion,
} from "@/hooks/use-google-places-autocomplete";
import {
  LocationIcon,
  CheckIcon,
  XSmallIcon,
  ChevronDownIcon,
} from "@shopify/polaris-icons";
import { Spinner } from "./spinner";
import * as PopoverPrimitive from "@radix-ui/react-popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { AddressSearchResult } from "@/types/addresses.types";

interface AddressAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  onSelect: (address: AddressSearchResult) => void;
  onClear: () => void;
  placeholder?: string;
  className?: string;
}

export function AddressAutocomplete({
  value,
  onChange,
  onSelect,
  onClear,
  placeholder = "Search for an address...",
  className,
}: AddressAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const [isSelectingPlace, setIsSelectingPlace] = useState(false);
  const {
    suggestions,
    isLoading,
    error,
    isReady,
    getPlaceDetails,
  } = useGooglePlacesAutocomplete(value);

  const handleSelect = async (suggestion: GooglePlacesSuggestion) => {
    setIsSelectingPlace(true);
    try {
      const placeDetails = await getPlaceDetails(suggestion.placeId);
      if (placeDetails) {
        onSelect(placeDetails);
        onChange(placeDetails.description);
      }
    } finally {
      setIsSelectingPlace(false);
      setOpen(false);
    }
  };

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    onClear();
    setOpen(false);
  };

  const hasSelection = value && value.length > 0;
  const showLoadingState =
    isLoading || isSelectingPlace || (!isReady && value.length >= 3);

  return (
    <PopoverPrimitive.Root open={open} onOpenChange={setOpen}>
      <PopoverPrimitive.Trigger asChild>
        <button
          type="button"
          role="combobox"
          className={cn(
            "w-full flex items-center justify-between min-h-[2.25rem] px-[var(--p-space-300)] py-[var(--p-space-150)]",
            "rounded-[var(--p-border-radius-200)]",
            "border-[length:var(--p-border-width-0165)] border-solid border-[var(--p-color-control-border)]",
            "bg-[var(--p-color-input-bg-surface)]",
            "text-[0.8125rem] leading-[1.25rem]",
            "font-[var(--p-font-weight-regular)] text-[var(--p-color-text)]",
            "text-left cursor-pointer",
            "outline-none",
            "hover:border-[var(--p-color-input-border-hover)]",
            "hover:bg-[var(--p-color-input-bg-surface-hover)]",
            "data-[state=open]:border-[var(--p-color-control-border-focus)]",
            "data-[state=open]:bg-[var(--p-color-input-bg-surface-active)]",
            "data-[state=open]:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
            "focus-visible:border-[var(--p-color-control-border-focus)]",
            "focus-visible:bg-[var(--p-color-input-bg-surface-active)]",
            "focus-visible:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
            className,
          )}
        >
          <span className={cn(
            "flex-1 truncate text-left pr-2",
            !value && "text-[var(--p-color-text-secondary)]"
          )}>
            {value || placeholder}
          </span>
          <div className="flex items-center gap-[var(--p-space-100)] shrink-0">
            {hasSelection && !showLoadingState && (
              <span
                role="button"
                tabIndex={0}
                onClick={handleClear}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    handleClear(e as unknown as React.MouseEvent);
                  }
                }}
                className="rounded-full p-0.5 hover:bg-[var(--p-color-bg-surface-hover)] transition-colors cursor-pointer"
                aria-label="Clear selection"
              >
                <XSmallIcon className="size-4 fill-[var(--p-color-icon-secondary)] hover:fill-[var(--p-color-icon)]" />
              </span>
            )}
            {showLoadingState ? (
              <Spinner size="small" />
            ) : (
              <ChevronDownIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
            )}
          </div>
        </button>
      </PopoverPrimitive.Trigger>
      <PopoverPrimitive.Portal>
        <PopoverPrimitive.Content
          align="start"
          sideOffset={4}
          className={cn(
            "z-50 w-[var(--radix-popover-trigger-width)] p-0",
            "bg-[var(--p-color-bg-surface)]",
            "border border-[var(--p-color-border)]",
            "rounded-[var(--p-border-radius-300)]",
            "shadow-[var(--p-shadow-300)]",
            "overflow-hidden",
            "animate-in fade-in-0 zoom-in-95 duration-150",
          )}
        >
          <Command>
            <CommandInput
              placeholder="Type address, city, or ZIP code..."
              value={value}
              onValueChange={onChange}
              className="h-10"
            />
            <CommandList className="max-h-[400px]">
              {isLoading && (
                <div className="p-[var(--p-space-400)] text-center text-[0.8125rem] text-[var(--p-color-text-secondary)]">
                  <div className="flex justify-center mb-[var(--p-space-200)]"><Spinner size="small" /></div>
                  Searching...
                </div>
              )}
              {error && (
                <div className="p-[var(--p-space-400)] text-center">
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text-critical)] mb-[var(--p-space-050)]">Failed to search addresses</p>
                  <p className="text-[0.75rem] text-[var(--p-color-text-secondary)]">{error}</p>
                </div>
              )}
              {!isLoading && !error && suggestions.length === 0 && value.length > 2 && (
                <CommandEmpty>No addresses found.</CommandEmpty>
              )}
              {!isLoading && !error && value.length <= 2 && (
                <CommandEmpty>Type at least 3 characters to search...</CommandEmpty>
              )}
              <CommandGroup>
                {suggestions.map((suggestion) => {
                  const isSelected = value === suggestion.description;
                  return (
                    <CommandItem
                      key={suggestion.placeId}
                      value={suggestion.description}
                      onSelect={() => handleSelect(suggestion)}
                      className="cursor-pointer py-[var(--p-space-300)] px-[var(--p-space-300)]"
                    >
                      <LocationIcon className="mr-[var(--p-space-200)] size-4 fill-[var(--p-color-icon-secondary)] shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-[0.8125rem] font-[var(--p-font-weight-medium)] text-[var(--p-color-text)] leading-tight mb-[var(--p-space-050)]">
                          {suggestion.mainText}
                        </p>
                        <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] leading-tight">
                          {suggestion.secondaryText}
                        </p>
                      </div>
                      {isSelected ? (
                        <div className="ml-[var(--p-space-200)] size-4 shrink-0 rounded-full bg-[var(--p-color-bg-fill-brand)] flex items-center justify-center">
                          <CheckIcon className="size-2.5 fill-white" />
                        </div>
                      ) : (
                        <div className="ml-[var(--p-space-200)] size-4 shrink-0 rounded-full border-2 border-[var(--p-color-border)]" />
                      )}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverPrimitive.Content>
      </PopoverPrimitive.Portal>
    </PopoverPrimitive.Root>
  );
}
