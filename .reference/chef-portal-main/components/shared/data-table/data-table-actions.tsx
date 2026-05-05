"use client";

import * as React from "react";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface DataTableAction<T> {
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  onClick: (row: T) => void;
  variant?: "default" | "destructive";
  disabled?: (row: T) => boolean;
  description?: string;
}

export interface DataTableActionsProps<T> {
  row: T;
  actions: DataTableAction<T>[];
  variant?: "dropdown" | "inline";
  className?: string;
}

const defaultIcons = {
  edit: Pencil,
  delete: Trash2,
  view: Eye,
};

export function DataTableActions<T>({
  row,
  actions,
  variant = "dropdown",
  className,
}: DataTableActionsProps<T>) {
  if (variant === "inline") {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {actions.map((action, index) => {
          const Icon = action.icon || defaultIcons.edit;
          const isDisabled = action.disabled?.(row) ?? false;

          return (
            <Button
              key={index}
              variant={
                action.variant === "destructive" ? "destructive" : "ghost"
              }
              size="icon"
              onClick={() => action.onClick(row)}
              disabled={isDisabled}
              className="h-8 w-8"
            >
              <Icon className="h-4 w-4" />
              <span className="sr-only">{action.label}</span>
            </Button>
          );
        })}
      </div>
    );
  }

  if (actions.length === 0) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="h-8 w-8 p-0">
          <span className="sr-only">Open menu</span>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className={className}>
        <DropdownMenuLabel>Actions</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {actions.map((action, index) => {
          const Icon = action.icon || defaultIcons.edit;
          const isDisabled = action.disabled?.(row) ?? false;

          return (
            <DropdownMenuItem
              key={index}
              onClick={() => !isDisabled && action.onClick(row)}
              disabled={isDisabled}
              className={cn(
                action.variant === "destructive" &&
                  "text-destructive focus:text-destructive"
              )}
            >
              <Icon className="mr-2 h-4 w-4" />
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
