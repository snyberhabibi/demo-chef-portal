"use client";

import { useState, useRef, useEffect } from "react";
import { OptimizedImage } from "@/components/shared/image";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";

export interface DishTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  basePrice: number;
  image?: string;
  cuisine?: string;
}

interface DishTemplateSelectorProps {
  templates: DishTemplate[];
  selectedTemplate: DishTemplate | null;
  onTemplateSelect: (template: DishTemplate) => void;
}

export function DishTemplateSelector({
  templates,
  selectedTemplate,
  onTemplateSelect,
}: DishTemplateSelectorProps) {
  const [templateSearchOpen, setTemplateSearchOpen] = useState(false);
  const [popoverWidth, setPopoverWidth] = useState<number | undefined>(
    undefined
  );
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (templateSearchOpen && triggerRef.current) {
      setPopoverWidth(triggerRef.current.offsetWidth);
    }
  }, [templateSearchOpen]);

  const handleTemplateSelect = (template: DishTemplate) => {
    onTemplateSelect(template);
    setTemplateSearchOpen(false);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label>Select Template</Label>
        <Popover open={templateSearchOpen} onOpenChange={setTemplateSearchOpen}>
          <PopoverTrigger asChild>
            <Button
              ref={triggerRef}
              variant="outline"
              role="combobox"
              className="w-full justify-between"
            >
              {selectedTemplate ? selectedTemplate.name : "Search templates..."}
              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
            </Button>
          </PopoverTrigger>
          <PopoverContent
            className="p-0 z-[100]"
            align="start"
            side="bottom"
            sideOffset={4}
            style={popoverWidth ? { width: `${popoverWidth}px` } : undefined}
          >
            <Command className="flex flex-col h-[500px]">
              <CommandInput
                placeholder="Search templates..."
                className="h-12 flex-shrink-0"
              />
              <CommandList className="flex-1 overflow-y-auto min-h-0">
                <CommandEmpty>No templates found.</CommandEmpty>
                <CommandGroup>
                  {templates.map((template) => (
                    <CommandItem
                      key={template.id}
                      value={template.name}
                      onSelect={() => handleTemplateSelect(template)}
                      className="p-0"
                    >
                      <div
                        className={cn(
                          "relative flex w-full items-start gap-4 p-4 rounded-lg transition-colors cursor-pointer",
                          "hover:bg-muted/50",
                          selectedTemplate?.id === template.id && "bg-muted"
                        )}
                      >
                        {selectedTemplate?.id === template.id && (
                          <div className="absolute top-1/2 right-4 -translate-y-1/2 z-10 h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-lg">
                            <Check className="h-5 w-5 text-white" />
                          </div>
                        )}
                        {template.image && (
                          <div className="relative h-24 w-24 flex-shrink-0 rounded-md overflow-hidden border">
                            <OptimizedImage
                              src={template.image}
                              alt={template.name}
                              fill
                              className="object-cover"
                              sizes="96px"
                              showSkeleton={true}
                            />
                          </div>
                        )}
                        <div className="flex-1 min-w-0 space-y-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap">
                              <h4 className="font-semibold text-base leading-tight">
                                {template.name}
                              </h4>
                              <Badge variant="outline" className="shrink-0">
                                {template.category}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                              {template.description}
                            </p>
                            {template.cuisine && (
                              <div className="mt-2">
                                <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                                  {template.cuisine}
                                </span>
                              </div>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium text-primary">
                              ${template.basePrice.toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>
      </div>

      {selectedTemplate && (
        <Card>
          <CardContent className="pt-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="font-semibold">{selectedTemplate.name}</h4>
                <Badge>{selectedTemplate.category}</Badge>
              </div>
              <p className="text-sm text-muted-foreground">
                {selectedTemplate.description}
              </p>
              <p className="text-sm font-medium">
                Base Price: ${selectedTemplate.basePrice.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
