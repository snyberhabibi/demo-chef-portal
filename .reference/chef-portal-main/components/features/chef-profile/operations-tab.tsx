"use client";

import { useState, useEffect } from "react";
import { useForm, useWatch, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { TimePicker } from "@/components/polaris";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { cn } from "@/lib/utils";
import {
  PlusIcon,
  XSmallIcon,
  ChevronUpIcon,
} from "@shopify/polaris-icons";
import {
  Button,
  Card,
  Label,
  HelpText,
  Switch,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/polaris";
import { FieldError } from "@/components/shared/field-error";
import type {
  ChefProfile,
  AvailabilitySchedule,
  Timezone,
  Weekday,
} from "@/services/chef-profile.service";
import { StoreFrontIndicator } from "./store-front-indicator";
import { ConfirmationDialog } from "@/components/shared/confirmation-dialog";

// Valid timezone values according to API
const VALID_TIMEZONES: Timezone[] = [
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "America/Anchorage",
  "Pacific/Honolulu",
];

// Valid weekday values according to API
const VALID_WEEKDAYS: Weekday[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

// Timezone display mapping
const TIMEZONE_DISPLAY_MAP: Record<Timezone, string> = {
  "America/New_York": "Eastern Time (ET)",
  "America/Chicago": "Central Time (CT)",
  "America/Denver": "Mountain Time (MT)",
  "America/Los_Angeles": "Pacific Time (PT)",
  "America/Anchorage": "Alaska Time (AKT)",
  "Pacific/Honolulu": "Hawaii Time (HST)",
};

// Weekday display mapping
const WEEKDAY_DISPLAY_MAP: Record<Weekday, string> = {
  monday: "Monday",
  tuesday: "Tuesday",
  wednesday: "Wednesday",
  thursday: "Thursday",
  friday: "Friday",
  saturday: "Saturday",
  sunday: "Sunday",
};

// Helper function to validate HH:mm time format
const isValidTimeFormat = (time: string): boolean => {
  const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};

// Parse "HH:mm" to { hours, minutes } numbers
const parseTime = (time: string): { hours: number; minutes: number } => {
  if (!time) return { hours: 9, minutes: 0 };
  const [h, m] = time.split(":").map(Number);
  return { hours: isNaN(h) ? 9 : h, minutes: isNaN(m) ? 0 : m };
};

// Format hours + minutes numbers to "HH:mm" string
const toTimeString = (hours: number, minutes: number): string =>
  `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;

// Format HH:mm to 12-hour AM/PM
const formatTimeAmPm = (time: string): string => {
  if (!time || !isValidTimeFormat(time)) return time;
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
};

// Helper function to compare times (HH:mm format)
const compareTimes = (time1: string, time2: string): number => {
  const [h1, m1] = time1.split(":").map(Number);
  const [h2, m2] = time2.split(":").map(Number);
  const minutes1 = h1 * 60 + m1;
  const minutes2 = h2 * 60 + m2;
  return minutes1 - minutes2;
};

// Availability schedule entry schema
const availabilityScheduleEntrySchema = z
  .object({
    id: z.string().nullable(),
    weekday: z
      .string()
      .min(1, "Weekday is required")
      .refine((val) => VALID_WEEKDAYS.includes(val as Weekday), {
        message: `Weekday must be one of: ${VALID_WEEKDAYS.join(", ")}`,
      }),
    startTime: z
      .string()
      .min(1, "Start time is required")
      .refine(
        isValidTimeFormat,
        "Start time must be in HH:mm format (e.g., 09:00)"
      ),
    endTime: z
      .string()
      .min(1, "End time is required")
      .refine(
        isValidTimeFormat,
        "End time must be in HH:mm format (e.g., 17:00)"
      ),
  })
  .refine(
    (data) => {
      if (!data.startTime || !data.endTime) return true;
      if (
        !isValidTimeFormat(data.startTime) ||
        !isValidTimeFormat(data.endTime)
      ) {
        return true; // Let format validation handle this
      }
      const comparison = compareTimes(data.endTime, data.startTime);
      return comparison > 0; // End time must be after start time
    },
    {
      message: "End time must be after start time",
      path: ["endTime"],
    }
  );

const operationsSchema = z
  .object({
    timezone: z
      .string()
      .min(1, "Timezone is required")
      .refine((val) => VALID_TIMEZONES.includes(val as Timezone), {
        message: `Timezone must be one of: ${VALID_TIMEZONES.join(", ")}`,
      }),
    available: z.boolean(),
    autoAcceptOrders: z.boolean().nullable(),
    pickupEnabled: z.boolean(),
    availabilitySchedule: z
      .array(availabilityScheduleEntrySchema)
      .min(0, "At least one availability entry is recommended"),
  })
  .refine(
    (data) => {
      // Check for duplicate weekdays in availability schedule
      const weekdays = data.availabilitySchedule
        .map((s) => s.weekday)
        .filter((w) => w);
      const uniqueWeekdays = new Set(weekdays);
      return weekdays.length === uniqueWeekdays.size;
    },
    {
      message: "Each weekday can only appear once in the availability schedule",
      path: ["availabilitySchedule"],
    }
  );

type OperationsFormValues = z.infer<typeof operationsSchema>;

interface OperationsTabProps {
  profile?: ChefProfile;
  isEditing: boolean;
  onSave: (data: Partial<ChefProfile>) => void;
  onSaveImmediate?: (data: Partial<ChefProfile>) => Promise<void>;
  formRef?: (ref: {
    submit: () => void;
    setFieldError?: (field: string, message: string) => void;
    hasErrors?: () => boolean;
    isDirty?: () => boolean;
    validate?: () => Promise<boolean>;
  }) => void;
}

export function OperationsTab({
  profile,
  isEditing,
  onSave,
  onSaveImmediate,
  formRef,
}: OperationsTabProps) {
  const [expandedSchedules, setExpandedSchedules] = useState<Set<string>>(
    new Set(
      profile?.availabilitySchedule
        ?.map((s) => s.id ?? `temp-${Date.now()}`)
        .filter((id): id is string => id !== null) || []
    )
  );
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [scheduleToDelete, setScheduleToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [toggleConfirm, setToggleConfirm] = useState<{
    field: "available" | "pickupEnabled";
    newValue: boolean;
  } | null>(null);

  const form = useForm<OperationsFormValues>({
    resolver: zodResolver(operationsSchema),
    mode: "onChange", // Track changes as user types/selects
    defaultValues: {
      timezone: profile?.timezone || "",
      available: profile?.adminAvailable ? profile.available : false,
      autoAcceptOrders: profile?.autoAcceptOrders ?? false,
      pickupEnabled: profile?.pickup?.enabled ?? false,
      availabilitySchedule: profile?.availabilitySchedule || [],
    },
  });

  const isPickupAdminAllowed = profile?.pickup?.adminAllowed ?? false;
  const isAvailableAdminAllowed = profile?.adminAvailable ?? false;

  // Sync form with profile data when it changes
  useEffect(() => {
    if (profile) {
      const schedule = profile.availabilitySchedule || [];
      form.reset({
        timezone: profile.timezone || "",
        available: profile.adminAvailable ? profile.available : false,
        autoAcceptOrders: profile.autoAcceptOrders ?? false,
        pickupEnabled: profile.pickup?.enabled ?? false,
        availabilitySchedule: schedule,
      }, {
        keepDirty: false, // Reset dirty state when profile data changes from server
        keepValues: false, // Always use new profile values
      });
      setExpandedSchedules(
        new Set(
          schedule
            .map((s) => s.id ?? `temp-${Date.now()}`)
            .filter((id): id is string => id !== null)
        )
      );
    }
  }, [profile, form]);

  const watchedValues = useWatch({ control: form.control });
  const availabilitySchedule = watchedValues.availabilitySchedule || [];

  const toggleSchedule = (id: string) => {
    const newSet = new Set(expandedSchedules);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedSchedules(newSet);
  };

  const addAvailability = () => {
    const tempId = `schedule-${Date.now()}`;
    const newSchedule: AvailabilitySchedule = {
      id: tempId,
      weekday: "" as Weekday, // Empty string to show placeholder, will be validated on submit
      startTime: "09:00",
      endTime: "17:00",
    };
    const current = form.getValues("availabilitySchedule");
    form.setValue("availabilitySchedule", [...current, newSchedule], { shouldDirty: true });
    setExpandedSchedules(new Set([...expandedSchedules, tempId]));
  };

  const handleDeleteClick = (id: string | null) => {
    if (id === null || id === undefined) return;
    setScheduleToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (scheduleToDelete === null) return;
    
    setIsDeleting(true);
    try {
      // Get current form values
      const current = form.getValues("availabilitySchedule");
      const scheduleToDeleteId = scheduleToDelete;
      
      // Find the index of the schedule to delete for proper cleanup
      // Use the same logic as in the map: id ?? `temp-${index}`
      const scheduleIndex = current.findIndex((s, idx) => {
        const scheduleId = s.id ?? `temp-${idx}`;
        return scheduleId === scheduleToDeleteId;
      });
      
      // Remove the schedule from the form using the same identification logic
      const updatedSchedule = current.filter((s, idx) => {
        const scheduleId = s.id ?? `temp-${idx}`;
        return scheduleId !== scheduleToDeleteId;
      });
      
      // If schedule not found, abort
      if (scheduleIndex === -1) {
        console.warn("Schedule to delete not found:", scheduleToDeleteId);
        setDeleteDialogOpen(false);
        setScheduleToDelete(null);
        setIsDeleting(false);
        return;
      }
      
      // Clear validation errors for all schedule entries to prevent stale errors
      // Clear errors for all indices (including ones that will be re-indexed)
      current.forEach((_, idx) => {
        form.clearErrors(`availabilitySchedule.${idx}.weekday` as Path<OperationsFormValues>);
        form.clearErrors(`availabilitySchedule.${idx}.startTime` as Path<OperationsFormValues>);
        form.clearErrors(`availabilitySchedule.${idx}.endTime` as Path<OperationsFormValues>);
      });
      
      // Update form state with the updated schedule
      form.setValue("availabilitySchedule", updatedSchedule, { 
        shouldDirty: true,
        shouldValidate: false // Don't validate immediately to avoid stale errors
      });
      
      // Update expanded schedules
      const newSet = new Set(expandedSchedules);
      newSet.delete(scheduleToDeleteId);
      setExpandedSchedules(newSet);
      
      // Trigger validation on the updated schedule to ensure clean state
      await form.trigger("availabilitySchedule");
      
      // Get all current form values after update
      const formValues = form.getValues();
      
      // Normalize the schedule for submission
      const normalizedSchedule = updatedSchedule.map((s) => {
        const normalizeTime = (time: string): string => {
          if (!time) return time;
          if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
            return time;
          }
          const match = time.match(/^(\d{1,2}):(\d{2})$/);
          if (match) {
            const [, hour, minute] = match;
            return `${hour.padStart(2, "0")}:${minute}`;
          }
          return time;
        };

        return {
          ...s,
          weekday: s.weekday as Weekday,
          startTime: normalizeTime(s.startTime),
          endTime: normalizeTime(s.endTime),
        };
      });

      const saveData = {
        ...formValues,
        timezone: formValues.timezone as Timezone | undefined,
        availabilitySchedule: normalizedSchedule,
      };

      if (onSaveImmediate) {
        await onSaveImmediate(saveData);
      } else {
        await onSave(saveData);
      }
      
      // Close dialog and reset state
      setDeleteDialogOpen(false);
      setScheduleToDelete(null);
    } catch (error) {
      console.error("Error deleting availability:", error);
      // Don't close dialog on error so user can retry
    } finally {
      setIsDeleting(false);
    }
  };


  const onSubmit = (values: OperationsFormValues) => {
    // Ensure all times are in HH:mm format (24-hour) before submission
    const normalizedSchedule = values.availabilitySchedule.map((s) => {
      // Normalize startTime and endTime to ensure HH:mm format
      const normalizeTime = (time: string): string => {
        if (!time) return time;
        // If already in HH:mm format, return as-is
        if (/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/.test(time)) {
          return time;
        }
        // If in H:mm format, pad hour
        const match = time.match(/^(\d{1,2}):(\d{2})$/);
        if (match) {
          const [, hour, minute] = match;
          return `${hour.padStart(2, "0")}:${minute}`;
        }
        return time;
      };

      return {
        ...s,
        weekday: s.weekday as Weekday,
        startTime: normalizeTime(s.startTime),
        endTime: normalizeTime(s.endTime),
      };
    });

    onSave({
      ...values,
      timezone: values.timezone as Timezone | undefined,
      availabilitySchedule: normalizedSchedule,
      pickup: { enabled: values.pickupEnabled, adminAllowed: isPickupAdminAllowed },
    });
  };

  // Expose submit method and setFieldError to parent
  useEffect(() => {
    if (formRef) {
      formRef({
        submit: () => {
          form.handleSubmit(onSubmit)();
        },
        setFieldError: (field: string, message: string) => {
          // Handle nested fields like availabilitySchedule.0.weekday
          if (field.startsWith("availabilitySchedule.")) {
            const parts = field.split(".");
            if (parts.length >= 3) {
              const index = parseInt(parts[1]);
              const subField = parts.slice(2).join(".");
              form.setError(
                `availabilitySchedule.${index}.${subField}` as Path<OperationsFormValues>,
                {
                  type: "server",
                  message,
                }
              );
            } else {
              form.setError(
                "availabilitySchedule" as Path<OperationsFormValues>,
                {
                  type: "server",
                  message,
                }
              );
            }
          } else {
            form.setError(field as Path<OperationsFormValues>, {
              type: "server",
              message,
            });
          }
        },
        hasErrors: () => {
          return Object.keys(form.formState.errors).length > 0;
        },
        isDirty: () => {
          return form.formState.isDirty;
        },
        validate: async () => {
          const result = await form.trigger();
          return result;
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [formRef, form]);

  return (
    <div className="w-full">
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-[var(--p-space-500)]">
          {/* Timezone */}
          <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border-secondary)] bg-[var(--p-color-bg-surface)] p-[var(--p-space-500)] shadow-[var(--p-shadow-100)]">
            <div className="space-y-[var(--p-space-150)]">
              <Label className="flex items-center gap-[var(--p-space-100)]">
                Timezone <span className="text-[var(--p-color-text-critical)]">*</span>
                <StoreFrontIndicator description="Your timezone ensures that your availability schedule and order times are displayed correctly to customers." />
              </Label>
              <Select
                onValueChange={(v) => form.setValue("timezone", v, { shouldDirty: true })}
                value={watchedValues.timezone || ""}
                disabled={!isEditing}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select timezone" />
                </SelectTrigger>
                <SelectContent>
                  {VALID_TIMEZONES.map((tz) => (
                    <SelectItem key={tz} value={tz}>
                      {TIMEZONE_DISPLAY_MAP[tz]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldError message={form.formState.errors.timezone?.message} />
            </div>
          </div>

          {/* Toggles */}
          <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border-secondary)] bg-[var(--p-color-bg-surface)] p-[var(--p-space-500)] shadow-[var(--p-shadow-100)] space-y-[var(--p-space-400)]">
            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-[var(--p-space-100)]">
                  Available
                  <StoreFrontIndicator description="When enabled, customers can place orders. When disabled, your profile won't be visible." />
                </Label>
                <HelpText>
                  {isAvailableAdminAllowed
                    ? "Is the chef currently accepting orders?"
                    : "Pending admin approval — once approved, you can toggle availability."}
                </HelpText>
              </div>
              <Switch
                checked={watchedValues.available ?? false}
                onCheckedChange={(checked) => setToggleConfirm({ field: "available", newValue: checked })}
                disabled={!isEditing || !isAvailableAdminAllowed}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label className="flex items-center gap-[var(--p-space-100)]">
                  Auto Accept Orders
                  <StoreFrontIndicator description="When enabled, orders will be automatically accepted without requiring manual approval." />
                </Label>
                <HelpText>Automatically accept orders without manual approval</HelpText>
              </div>
              <Switch
                checked={watchedValues.autoAcceptOrders ?? false}
                onCheckedChange={(checked) => form.setValue("autoAcceptOrders", checked, { shouldDirty: true })}
                disabled={!isEditing}
              />
            </div>

            {isPickupAdminAllowed && (
              <div className="flex items-center justify-between">
                <div>
                  <Label className="flex items-center gap-[var(--p-space-100)]">
                    Pickup Orders
                    <StoreFrontIndicator description="When enabled, customers can choose to pick up orders from your location." />
                  </Label>
                  <HelpText>Allow customers to pick up orders from your location</HelpText>
                </div>
                <Switch
                  checked={watchedValues.pickupEnabled}
                  onCheckedChange={(checked) => setToggleConfirm({ field: "pickupEnabled", newValue: checked })}
                  disabled={!isEditing}
                />
              </div>
            )}
          </div>

          {/* Availability Schedule */}
          <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border-secondary)] bg-[var(--p-color-bg-surface)] p-[var(--p-space-500)] shadow-[var(--p-shadow-100)] space-y-[var(--p-space-400)]">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[var(--p-space-200)]">
              <div>
                <h3 className="text-[0.9375rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] flex items-center gap-[var(--p-space-100)]">
                  Delivery/Pickup Times
                  <StoreFrontIndicator description="Your availability schedule shows customers when you're open for orders." />
                </h3>
                <HelpText>Weekly delivery/pickup times</HelpText>
              </div>
              {isEditing && (
                <Button
                  type="button"
                  variant="tertiary"
                  size="sm"
                  onClick={() => {
                    if (expandedSchedules.size === availabilitySchedule.length) {
                      setExpandedSchedules(new Set());
                    } else {
                      setExpandedSchedules(new Set(
                        availabilitySchedule
                          .map((s) => s.id ?? `temp-${Date.now()}`)
                          .filter((id): id is string => id !== null)
                      ));
                    }
                  }}
                >
                  {expandedSchedules.size === availabilitySchedule.length ? "Collapse All" : "Show All"}
                </Button>
              )}
            </div>

            <div className="space-y-[var(--p-space-200)]">
              {availabilitySchedule.map((schedule, index) => {
                const scheduleId = schedule.id ?? `temp-${index}`;
                const weekdayErrors = form.formState.errors.availabilitySchedule?.[index]?.weekday?.message;
                const startTimeErrors = form.formState.errors.availabilitySchedule?.[index]?.startTime?.message;
                const endTimeErrors = form.formState.errors.availabilitySchedule?.[index]?.endTime?.message;
                const selectedWeekdays = availabilitySchedule
                  .map((s, i) => i !== index ? s.weekday : null)
                  .filter((w): w is string => w !== null && w !== "");

                return (
                  <Collapsible
                    key={scheduleId}
                    open={expandedSchedules.has(scheduleId)}
                    onOpenChange={() => toggleSchedule(scheduleId)}
                  >
                    <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)]">
                      <CollapsibleTrigger asChild>
                        <button type="button" className="w-full flex items-center justify-between px-[var(--p-space-400)] py-[var(--p-space-300)] cursor-pointer hover:bg-[var(--p-color-bg-surface-hover)] transition-colors rounded-[var(--p-border-radius-200)]">
                          <div className="flex items-center gap-[var(--p-space-200)] min-w-0">
                            <span className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                              {schedule.weekday ? WEEKDAY_DISPLAY_MAP[schedule.weekday as Weekday] : `Slot ${index + 1}`}
                            </span>
                            {schedule.startTime && schedule.endTime && (
                              <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                                {formatTimeAmPm(schedule.startTime)} – {formatTimeAmPm(schedule.endTime)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-[var(--p-space-200)] shrink-0">
                            {isEditing && (
                              <Button
                                type="button"
                                variant="tertiary"
                                size="sm"
                                className="text-[var(--p-color-text-critical)] hover:text-[var(--p-color-text-critical)]"
                                onClick={(e) => { e.stopPropagation(); handleDeleteClick(scheduleId); }}
                              >
                                Delete
                              </Button>
                            )}
                            <ChevronUpIcon className={cn("size-4 fill-[var(--p-color-icon-secondary)] transition-transform", expandedSchedules.has(scheduleId) && "rotate-180")} />
                          </div>
                        </button>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <div className="px-[var(--p-space-400)] pb-[var(--p-space-400)] pt-[var(--p-space-200)]">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--p-space-400)]">
                            <div className="space-y-[var(--p-space-150)]">
                              <Label>Weekday <span className="text-[var(--p-color-text-critical)]">*</span></Label>
                              <Select
                                onValueChange={(v) => form.setValue(`availabilitySchedule.${index}.weekday`, v, { shouldDirty: true })}
                                value={schedule.weekday || undefined}
                                disabled={!isEditing}
                              >
                                <SelectTrigger className="w-full">
                                  <SelectValue placeholder="Select day" />
                                </SelectTrigger>
                                <SelectContent>
                                  {VALID_WEEKDAYS.map((day) => (
                                    <SelectItem key={day} value={day} disabled={selectedWeekdays.includes(day) && day !== schedule.weekday}>
                                      {WEEKDAY_DISPLAY_MAP[day]}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FieldError message={weekdayErrors} />
                            </div>
                            <div className="space-y-[var(--p-space-150)]">
                              <Label>Start Time <span className="text-[var(--p-color-text-critical)]">*</span></Label>
                              <TimePicker
                                hours={parseTime(schedule.startTime || "").hours}
                                minutes={parseTime(schedule.startTime || "").minutes}
                                onChange={(h, m) => {
                                  form.setValue(`availabilitySchedule.${index}.startTime`, toTimeString(h, m), { shouldDirty: true });
                                  form.trigger(`availabilitySchedule.${index}.endTime`);
                                }}
                                disabled={!isEditing}
                              />
                              <FieldError message={startTimeErrors} />
                            </div>
                            <div className="space-y-[var(--p-space-150)]">
                              <Label>End Time <span className="text-[var(--p-color-text-critical)]">*</span></Label>
                              <TimePicker
                                hours={parseTime(schedule.endTime || "").hours}
                                minutes={parseTime(schedule.endTime || "").minutes}
                                onChange={(h, m) => {
                                  form.setValue(`availabilitySchedule.${index}.endTime`, toTimeString(h, m), { shouldDirty: true });
                                  form.trigger(`availabilitySchedule.${index}.endTime`);
                                }}
                                disabled={!isEditing}
                              />
                              <FieldError message={endTimeErrors} />
                            </div>
                          </div>
                        </div>
                      </CollapsibleContent>
                    </div>
                  </Collapsible>
                );
              })}
            </div>

            {isEditing && (
              <Button
                type="button"
                variant="secondary"
                onClick={addAvailability}
                className="w-full"
              >
                <PlusIcon className="size-4 fill-current" />
                Add Availability
              </Button>
            )}
          </div>
        </form>

      {/* Delete Confirmation Dialog */}
      <ConfirmationDialog
        open={deleteDialogOpen}
        onOpenChange={(open) => {
          if (!isDeleting) {
            setDeleteDialogOpen(open);
            if (!open) {
              setScheduleToDelete(null);
            }
          }
        }}
        type="delete"
        title="Delete Availability Slot"
        description={
          scheduleToDelete
            ? (() => {
                const schedule = availabilitySchedule.find((s, idx) => {
                  const scheduleId = s.id ?? `temp-${idx}`;
                  return scheduleId === scheduleToDelete;
                });
                if (schedule) {
                  const dayName = schedule.weekday
                    ? WEEKDAY_DISPLAY_MAP[schedule.weekday as Weekday]
                    : "this availability slot";
                  return `Are you sure you want to delete the availability slot for ${dayName}? This action cannot be undone.`;
                }
                return "Are you sure you want to delete this availability slot? This action cannot be undone.";
              })()
            : "Are you sure you want to delete this availability slot? This action cannot be undone."
        }
        onConfirm={handleDeleteConfirm}
        isLoading={isDeleting}
        variant="destructive"
        confirmLabel={isDeleting ? "Saving..." : "Delete"}
      />

      {/* Toggle Confirmation Dialog */}
      <ConfirmationDialog
        open={!!toggleConfirm}
        onOpenChange={(open) => {
          if (!open) setToggleConfirm(null);
        }}
        type="custom"
        title={
          toggleConfirm?.field === "available"
            ? toggleConfirm.newValue
              ? "Enable Accepting Orders"
              : "Disable Accepting Orders"
            : toggleConfirm?.newValue
              ? "Enable Pickup Orders"
              : "Disable Pickup Orders"
        }
        description={
          toggleConfirm?.field === "available"
            ? toggleConfirm.newValue
              ? "Your profile will be visible and customers will be able to place new orders."
              : "Your profile won't be visible to customers and no new orders can be placed."
            : toggleConfirm?.newValue
              ? "Customers will be able to choose pickup as a fulfillment option when placing orders."
              : "Customers will no longer see the pickup option. Any existing pickup orders will not be affected."
        }
        confirmLabel={
          toggleConfirm?.field === "available"
            ? toggleConfirm?.newValue
              ? "Yes, Go Available"
              : "Yes, Go Unavailable"
            : toggleConfirm?.newValue
              ? "Yes, Enable Pickup"
              : "Yes, Disable Pickup"
        }
        onConfirm={() => {
          if (toggleConfirm) {
            form.setValue(toggleConfirm.field, toggleConfirm.newValue, { shouldDirty: true });
            setToggleConfirm(null);
          }
        }}
        warning={
          toggleConfirm?.field === "available" && !toggleConfirm?.newValue
            ? "While unavailable, your profile won't be visible and no new orders can be placed. Existing orders will not be affected."
            : undefined
        }
      />
    </div>
  );
}
