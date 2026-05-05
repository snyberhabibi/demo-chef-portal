"use client";

import * as React from "react";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { ScrollArea } from "@/components/ui/scroll-area";

interface TimePickerProps {
  value?: string; // HH:mm format (24-hour)
  onChange?: (value: string) => void;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
}

// Generate hours (1-12 for AM/PM)
const hours12 = Array.from({ length: 12 }, (_, i) => String(i + 1));

// Generate minutes (00-59, in 5-minute intervals)
const minutes = Array.from({ length: 12 }, (_, i) =>
  String(i * 5).padStart(2, "0")
);

// Convert 24-hour to 12-hour format
const to12Hour = (hour24: string): { hour: string; period: "AM" | "PM" } => {
  const hour = parseInt(hour24, 10);
  if (hour === 0) return { hour: "12", period: "AM" };
  if (hour === 12) return { hour: "12", period: "PM" };
  if (hour > 12) return { hour: String(hour - 12), period: "PM" };
  return { hour: String(hour), period: "AM" };
};

// Convert 12-hour to 24-hour format
const to24Hour = (hour12: string, period: "AM" | "PM"): string => {
  const hour = parseInt(hour12, 10);
  if (period === "AM") {
    if (hour === 12) return "00";
    return String(hour).padStart(2, "0");
  } else {
    if (hour === 12) return "12";
    return String(hour + 12).padStart(2, "0");
  }
};

// Helper to find closest minute in our list
const findClosestMinute = (minute: string): string => {
  const minuteNum = parseInt(minute, 10);
  const closest = Math.round(minuteNum / 5) * 5;
  return String(closest % 60).padStart(2, "0");
};

export function TimePicker({
  value,
  onChange,
  disabled,
  className,
  placeholder = "Select time",
}: TimePickerProps) {
  const [open, setOpen] = React.useState(false);
  const [selectedHour12, setSelectedHour12] = React.useState<string>("9");
  const [selectedMinute, setSelectedMinute] = React.useState<string>("00");
  const [selectedPeriod, setSelectedPeriod] = React.useState<"AM" | "PM">("AM");
  const hourRef = React.useRef<HTMLDivElement>(null);
  const minuteRef = React.useRef<HTMLDivElement>(null);

  // Parse value when it changes (convert from 24-hour to 12-hour)
  React.useEffect(() => {
    if (value) {
      const [hour24, minute] = value.split(":");
      if (hour24 && minute) {
        const { hour, period } = to12Hour(hour24);
        setSelectedHour12(hour);
        setSelectedPeriod(period);
        // If minute is not in our list, find closest for display
        const normalizedMinute = minutes.includes(minute)
          ? minute
          : findClosestMinute(minute);
        setSelectedMinute(normalizedMinute);
      }
    } else {
      // Default to 9:00 AM if no value
      setSelectedHour12("9");
      setSelectedMinute("00");
      setSelectedPeriod("AM");
    }
  }, [value]);

  // Scroll to selected values when popover opens
  React.useEffect(() => {
    if (open) {
      // Scroll to selected hour
      setTimeout(() => {
        const hourIndex = hours12.indexOf(selectedHour12);
        const hourElement = hourRef.current?.children[hourIndex] as HTMLElement;
        if (hourElement) {
          hourElement.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }, 100);

      // Scroll to selected minute
      setTimeout(() => {
        const minuteIndex = minutes.indexOf(selectedMinute);
        const minuteElement = minuteRef.current?.children[
          minuteIndex
        ] as HTMLElement;
        if (minuteElement) {
          minuteElement.scrollIntoView({ block: "center", behavior: "smooth" });
        }
      }, 150);
    }
  }, [open, selectedHour12, selectedMinute]);

  const handleHourChange = (hour: string) => {
    setSelectedHour12(hour);
    // Convert to 24-hour format (HH:mm) - to24Hour already pads with padStart(2, "0")
    const hour24 = to24Hour(hour, selectedPeriod);
    const newValue = `${hour24}:${selectedMinute}`; // Format: HH:mm (24-hour)
    onChange?.(newValue);
  };

  const handleMinuteChange = (minute: string) => {
    setSelectedMinute(minute);
    // Convert to 24-hour format (HH:mm) - to24Hour already pads with padStart(2, "0")
    const hour24 = to24Hour(selectedHour12, selectedPeriod);
    const newValue = `${hour24}:${minute}`; // Format: HH:mm (24-hour)
    onChange?.(newValue);
  };

  const handlePeriodChange = (period: "AM" | "PM") => {
    setSelectedPeriod(period);
    // Convert to 24-hour format (HH:mm) - to24Hour already pads with padStart(2, "0")
    const hour24 = to24Hour(selectedHour12, period);
    const newValue = `${hour24}:${selectedMinute}`; // Format: HH:mm (24-hour)
    onChange?.(newValue);
  };

  const displayValue = value
    ? (() => {
        const [hour24, minute] = value.split(":");
        const { hour, period } = to12Hour(hour24);
        return `${hour}:${minute} ${period}`;
      })()
    : placeholder;

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "w-full flex items-center gap-[var(--p-space-200)] min-h-[2.25rem] px-[var(--p-space-300)] py-[var(--p-space-150)]",
            "rounded-[var(--p-border-radius-200)]",
            "border-[length:var(--p-border-width-0165)] border-solid border-[var(--p-color-control-border)]",
            "bg-[var(--p-color-input-bg-surface)]",
            "text-[0.8125rem] leading-[1.25rem] text-left",
            "font-[var(--p-font-weight-regular)] text-[var(--p-color-text)]",
            "cursor-pointer",
            "hover:border-[var(--p-color-input-border-hover)]",
            "hover:bg-[var(--p-color-input-bg-surface-hover)]",
            "data-[state=open]:border-[var(--p-color-control-border-focus)]",
            "data-[state=open]:bg-[var(--p-color-input-bg-surface-active)]",
            "data-[state=open]:shadow-[0_0_0_1px_var(--p-color-control-border-focus)]",
            "outline-none",
            !value && "text-[var(--p-color-text-secondary)]",
            disabled && "cursor-not-allowed opacity-50 pointer-events-none",
            className
          )}
          disabled={disabled}
        >
          <Clock className="size-4 text-[var(--p-color-icon-secondary)] shrink-0" />
          {displayValue}
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="flex">
          {/* Hours Column */}
          <div className="border-r">
            <div className="sticky top-0 z-10 bg-popover border-b px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground">Hour</p>
            </div>
            <ScrollArea className="h-[200px] w-20">
              <div ref={hourRef} className="p-1">
                {hours12.map((hour) => (
                  <button
                    key={hour}
                    type="button"
                    onClick={() => handleHourChange(hour)}
                    className={cn(
                      "w-full px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      selectedHour12 === hour &&
                        "bg-primary text-primary-foreground font-medium"
                    )}
                  >
                    {hour}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Minutes Column */}
          <div className="border-r">
            <div className="sticky top-0 z-10 bg-popover border-b px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground">
                Minute
              </p>
            </div>
            <ScrollArea className="h-[200px] w-20">
              <div ref={minuteRef} className="p-1">
                {minutes.map((minute) => (
                  <button
                    key={minute}
                    type="button"
                    onClick={() => {
                      handleMinuteChange(minute);
                      setTimeout(() => setOpen(false), 150);
                    }}
                    className={cn(
                      "w-full px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      selectedMinute === minute &&
                        "bg-primary text-primary-foreground font-medium"
                    )}
                  >
                    {minute}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* AM/PM Column */}
          <div>
            <div className="sticky top-0 z-10 bg-popover border-b px-3 py-2">
              <p className="text-xs font-medium text-muted-foreground">
                Period
              </p>
            </div>
            <ScrollArea className="h-[200px] w-16">
              <div className="p-1">
                {(["AM", "PM"] as const).map((period) => (
                  <button
                    key={period}
                    type="button"
                    onClick={() => handlePeriodChange(period)}
                    className={cn(
                      "w-full px-3 py-2 text-sm rounded-md transition-colors",
                      "hover:bg-accent hover:text-accent-foreground",
                      "focus:bg-accent focus:text-accent-foreground focus:outline-none",
                      selectedPeriod === period &&
                        "bg-primary text-primary-foreground font-medium"
                    )}
                  >
                    {period}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}

