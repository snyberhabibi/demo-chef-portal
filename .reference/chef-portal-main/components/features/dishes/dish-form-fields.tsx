"use client";

import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { SearchableSelect } from "@/components/ui/searchable-select";
import type { Dish } from "@/types/dishes.types";

interface DishFormFieldsProps {
  formData: Partial<Dish>;
  onFieldChange: (field: keyof Dish, value: unknown) => void;
}

export function DishFormFields({ formData, onFieldChange }: DishFormFieldsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">
          Dish Name <span className="text-destructive">*</span>
        </Label>
        <Input
          id="name"
          value={formData.name || ""}
          onChange={(e) => onFieldChange("name", e.target.value)}
          placeholder="e.g., Shawarma Plate"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description || ""}
          onChange={(e) => onFieldChange("description", e.target.value)}
          placeholder="Describe your dish..."
          rows={4}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="price">
            Price <span className="text-destructive">*</span>
          </Label>
          <Input
            id="price"
            type="number"
            step="0.01"
            min="0"
            value={formData.price || ""}
            onChange={(e) =>
              onFieldChange("price", parseFloat(e.target.value) || 0)
            }
            placeholder="0.00"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="category">
            Category <span className="text-destructive">*</span>
          </Label>
          <SearchableSelect
            options={[
              { value: "Main Course", label: "Main Course" },
              { value: "Appetizers", label: "Appetizers" },
              { value: "Desserts", label: "Desserts" },
              { value: "Beverages", label: "Beverages" },
              { value: "Salads", label: "Salads" },
            ]}
            value={formData.category}
            onValueChange={(value) => onFieldChange("category", value)}
            placeholder="Select category"
            searchPlaceholder="Search categories..."
            emptyMessage="No categories found."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Status</Label>
        <SearchableSelect
          options={[
            { value: "draft", label: "Draft" },
            { value: "published", label: "Published" },
          ]}
          value={formData.status || "draft"}
          onValueChange={(value) =>
            onFieldChange("status", value as "draft" | "published")
          }
          placeholder="Select status"
          searchPlaceholder="Search status..."
          emptyMessage="No status found."
        />
      </div>
    </div>
  );
}

