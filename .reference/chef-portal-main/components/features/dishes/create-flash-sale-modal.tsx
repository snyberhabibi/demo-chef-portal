"use client";

import * as React from "react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Check, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import type { Dish } from "@/types/dishes.types";

export interface SelectedDish extends Dish {
  maxQuantity?: number;
}

interface CreateFlashSaleModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  dishes: Dish[];
  onSubmit: (data: {
    startDate: Date;
    endDate: Date;
    dishes: SelectedDish[];
  }) => void;
  isLoading?: boolean;
}

export function CreateFlashSaleModal({
  open,
  onOpenChange,
  onSubmit,
  dishes,
  isLoading = false,
}: CreateFlashSaleModalProps) {
  const [startDate, setStartDate] = useState<Date>();
  const [endDate, setEndDate] = useState<Date>();
  const [selectedDishes, setSelectedDishes] = useState<Map<string, SelectedDish>>(
    new Map()
  );

  const handleDishToggle = (dish: Dish) => {
    const newSelected = new Map(selectedDishes);
    if (newSelected.has(dish.id)) {
      newSelected.delete(dish.id);
    } else {
      newSelected.set(dish.id, { ...dish, maxQuantity: 1 });
    }
    setSelectedDishes(newSelected);
  };

  const handleQuantityChange = (dishId: string, quantity: number) => {
    const newSelected = new Map(selectedDishes);
    const dish = newSelected.get(dishId);
    if (dish) {
      newSelected.set(dishId, { ...dish, maxQuantity: Math.max(1, quantity) });
      setSelectedDishes(newSelected);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!startDate || !endDate || selectedDishes.size === 0) {
      return;
    }
    onSubmit({
      startDate,
      endDate,
      dishes: Array.from(selectedDishes.values()),
    });
  };

  const handleReset = () => {
    setStartDate(undefined);
    setEndDate(undefined);
    setSelectedDishes(new Map());
  };

  const handleClose = (open: boolean) => {
    if (!open) {
      handleReset();
    }
    onOpenChange(open);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl sm:max-w-5xl max-h-[90vh] overflow-y-auto w-[95vw] sm:w-auto">
        <DialogHeader>
          <DialogTitle>Create Flash Sale</DialogTitle>
          <DialogDescription>
            Select dishes and set the sale period
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Pickers */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Start Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !startDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {startDate ? format(startDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={startDate}
                    onSelect={setStartDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label>End Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !endDate && "text-muted-foreground"
                    )}
                  >
                    <Calendar className="mr-2 h-4 w-4" />
                    {endDate ? format(endDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <CalendarComponent
                    mode="single"
                    selected={endDate}
                    onSelect={setEndDate}
                    disabled={(date) => startDate ? date < startDate : false}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          {/* Dishes Grid */}
          <div className="space-y-2">
            <Label>Select Dishes *</Label>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-[400px] overflow-y-auto p-2 border rounded-md">
              {dishes.map((dish) => {
                const isSelected = selectedDishes.has(dish.id);

                return (
                  <Card
                    key={dish.id}
                    className={cn(
                      "cursor-pointer transition-all relative",
                      isSelected
                        ? "ring-2 ring-primary border-primary"
                        : "hover:border-primary/50"
                    )}
                    onClick={() => handleDishToggle(dish)}
                  >
                    {isSelected && (
                      <div className="absolute top-2 right-2 z-10">
                        <div className="bg-primary text-primary-foreground rounded-full p-1">
                          <Check className="h-3 w-3" />
                        </div>
                      </div>
                    )}
                    <CardContent className="p-4">
                      <h4 className="font-semibold text-sm mb-1">{dish.name}</h4>
                      <p className="text-xs text-muted-foreground line-clamp-2 mb-2">
                        {dish.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">
                          ${dish.price.toFixed(2)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {dish.category}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
            {dishes.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No dishes available
              </p>
            )}
          </div>

          {/* Selected Dishes with Quantity */}
          {selectedDishes.size > 0 && (
            <div className="space-y-2">
              <Label>Set Max Quantity for Selected Dishes</Label>
              <div className="space-y-2 border rounded-md p-4">
                {Array.from(selectedDishes.values()).map((dish) => (
                  <div
                    key={dish.id}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex-1">
                      <p className="font-medium text-sm">{dish.name}</p>
                      <p className="text-xs text-muted-foreground">
                        ${dish.price.toFixed(2)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Label htmlFor={`qty-${dish.id}`} className="text-xs whitespace-nowrap">
                        Max Qty:
                      </Label>
                      <Input
                        id={`qty-${dish.id}`}
                        type="number"
                        min="1"
                        value={dish.maxQuantity || 1}
                        onChange={(e) =>
                          handleQuantityChange(
                            dish.id,
                            parseInt(e.target.value) || 1
                          )
                        }
                        className="w-20"
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button
              type="button"
              variant="outline"
              onClick={() => handleClose(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={
                isLoading ||
                !startDate ||
                !endDate ||
                selectedDishes.size === 0
              }
            >
              {isLoading ? "Creating..." : "Create Flash Sale"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

