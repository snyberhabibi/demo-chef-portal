"use client";

import { useState, useEffect, useRef } from "react";
import { useForm, useFieldArray, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Plus,
  GripVertical,
  MoreVertical,
  ChevronUp,
  CalendarIcon,
} from "lucide-react";
import { format } from "date-fns";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { ChefProfile, Achievement } from "@/services/chef-profile.service";
import { StoreFrontIndicator } from "./store-front-indicator";

const achievementsSchema = z.object({
  achievements: z.array(
    z.object({
      id: z.string().nullable(),
      title: z.string().min(1, "Title is required"),
      description: z.string().nullable().optional(),
      startDate: z.string().nullable().optional(),
      endDate: z.string().nullable().optional(),
    })
  ),
});

type AchievementsFormValues = z.infer<typeof achievementsSchema>;

interface AchievementsTabProps {
  profile?: ChefProfile;
  isEditing: boolean;
  onSave: (data: Partial<ChefProfile>) => void;
  formRef?: (ref: {
    submit: () => void;
    setFieldError?: (field: string, message: string) => void;
    hasErrors?: () => boolean;
    isDirty?: () => boolean;
    validate?: () => Promise<boolean>;
  }) => void;
}

export function AchievementsTab({
  profile,
  isEditing,
  onSave,
  formRef,
}: AchievementsTabProps) {
  const [expandedAchievements, setExpandedAchievements] = useState<Set<string>>(
    new Set(
      profile?.achievements?.map((a, index) => a.id ?? `temp-${index}`) || []
    )
  );

  const form = useForm<AchievementsFormValues>({
    resolver: zodResolver(achievementsSchema),
    defaultValues: {
      achievements: profile?.achievements || [],
    },
  });

  // Sync form with profile data when it changes
  useEffect(() => {
    if (profile) {
      const achievements = profile.achievements || [];
      form.reset({
        achievements: achievements,
      });
      // Expand all achievements by default when loaded
      setExpandedAchievements(
        new Set(achievements.map((a, index) => a.id ?? `temp-${index}`))
      );
    }
  }, [profile, form]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "achievements",
  });

  // Track previous fields length to detect new additions
  const prevFieldsLengthRef = useRef(fields.length);

  // Auto-expand newly added achievements
  useEffect(() => {
    // Only run when fields array length increases (new achievement added)
    if (fields.length > prevFieldsLengthRef.current) {
      // Find any new fields that aren't expanded yet
      const newIds = fields
        .map((f, idx) => f.id ?? `temp-${idx}`)
        .filter((id) => !expandedAchievements.has(id));

      // Expand any new achievements
      if (newIds.length > 0) {
        setExpandedAchievements((prev) => new Set([...prev, ...newIds]));
      }
    }
    prevFieldsLengthRef.current = fields.length;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fields.length]);

  const toggleAchievement = (id: string) => {
    const newSet = new Set(expandedAchievements);
    if (newSet.has(id)) {
      newSet.delete(id);
    } else {
      newSet.add(id);
    }
    setExpandedAchievements(newSet);
  };

  const addAchievement = () => {
    const tempId = `achievement-${Date.now()}`;
    const newAchievement: Achievement = {
      id: tempId,
      title: "",
      description: null,
      startDate: null,
      endDate: null,
    };
    append(newAchievement);
    // Expand the new achievement after it's added using functional update
    setExpandedAchievements((prev) => new Set([...prev, tempId]));
  };

  const removeAchievement = (index: number) => {
    const achievement = fields[index];
    const achievementId = achievement.id ?? `temp-${index}`;
    remove(index);
    const newSet = new Set(expandedAchievements);
    newSet.delete(achievementId);
    setExpandedAchievements(newSet);
  };

  const onSubmit = (values: AchievementsFormValues) => {
    onSave({ achievements: values.achievements });
  };

  // Expose submit method and setFieldError to parent
  useEffect(() => {
    if (formRef) {
      formRef({
        submit: () => {
          form.handleSubmit(onSubmit)();
        },
        setFieldError: (field: string, message: string) => {
          // Handle nested fields like achievements.0.title
          if (field.startsWith("achievements.")) {
            const parts = field.split(".");
            if (parts.length >= 3) {
              const index = parseInt(parts[1]);
              const subField = parts.slice(2).join(".");
              form.setError(
                `achievements.${index}.${subField}` as Path<AchievementsFormValues>,
                {
                  type: "server",
                  message,
                }
              );
            } else {
              form.setError("achievements" as Path<AchievementsFormValues>, {
                type: "server",
                message,
              });
            }
          } else {
            form.setError(field as Path<AchievementsFormValues>, {
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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <h3 className="text-lg font-semibold break-words flex items-center gap-2">
                    Achievements
                    <StoreFrontIndicator description="Your achievements, awards, and certifications are displayed on your store-front profile in a dedicated section. This helps build credibility and trust with customers by showcasing your culinary expertise, awards, certifications, and notable accomplishments." />
                  </h3>
                  <p className="text-sm text-muted-foreground break-words">
                    Chef achievements, awards, and certifications
                  </p>
                </div>
                {isEditing && (
                  <div className="flex items-center gap-2 shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="whitespace-nowrap"
                      onClick={() => {
                        if (expandedAchievements.size === fields.length) {
                          setExpandedAchievements(new Set());
                        } else {
                          setExpandedAchievements(
                            new Set(
                              fields.map((f, idx) => f.id ?? `temp-${idx}`)
                            )
                          );
                        }
                      }}
                    >
                      {expandedAchievements.size === fields.length
                        ? "Collapse All"
                        : "Show All"}
                    </Button>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                {fields.map((field, index) => {
                  const achievementId = field.id ?? `temp-${index}`;
                  return (
                    <Collapsible
                      key={achievementId}
                      open={expandedAchievements.has(achievementId)}
                      onOpenChange={() => toggleAchievement(achievementId)}
                    >
                      <Card>
                        <CollapsibleTrigger asChild>
                          <CardHeader className="cursor-pointer">
                            <div className="flex items-center justify-between gap-2">
                              <div className="flex items-center gap-2 min-w-0 flex-1">
                                {isEditing && (
                                  <GripVertical className="h-4 w-4 text-muted-foreground shrink-0" />
                                )}
                                <CardTitle className="text-base break-words min-w-0">
                                  Achievement{" "}
                                  {String(index + 1).padStart(2, "0")}
                                </CardTitle>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                {isEditing && (
                                  <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="icon"
                                        className="shrink-0"
                                        onClick={(e) => e.stopPropagation()}
                                      >
                                        <MoreVertical className="h-4 w-4" />
                                      </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end">
                                      <DropdownMenuItem
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          removeAchievement(index);
                                        }}
                                        className="text-destructive"
                                      >
                                        Delete
                                      </DropdownMenuItem>
                                    </DropdownMenuContent>
                                  </DropdownMenu>
                                )}
                                <ChevronUp
                                  className={cn(
                                    "h-4 w-4 transition-transform shrink-0",
                                    expandedAchievements.has(achievementId) &&
                                      "rotate-180"
                                  )}
                                />
                              </div>
                            </div>
                          </CardHeader>
                        </CollapsibleTrigger>
                        <CollapsibleContent>
                          <CardContent className="space-y-4">
                            <FormField
                              control={form.control}
                              name={`achievements.${index}.title`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>
                                    Title{" "}
                                    <span className="text-destructive">*</span>
                                  </FormLabel>
                                  <FormControl>
                                    <Input
                                      {...field}
                                      disabled={!isEditing}
                                      placeholder="Title or name of the achievement"
                                      className="w-full"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Title or name of the achievement
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={form.control}
                              name={`achievements.${index}.description`}
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Description</FormLabel>
                                  <FormControl>
                                    <Textarea
                                      {...field}
                                      value={field.value ?? ""}
                                      disabled={!isEditing}
                                      placeholder="Detailed description of the achievement"
                                      className="resize-y min-h-[100px] w-full"
                                    />
                                  </FormControl>
                                  <FormDescription>
                                    Detailed description of the achievement
                                  </FormDescription>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <FormField
                                control={form.control}
                                name={`achievements.${index}.startDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>Start Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              "w-full justify-start text-left font-normal",
                                              !field.value &&
                                                "text-muted-foreground",
                                              !isEditing &&
                                                "cursor-not-allowed opacity-50"
                                            )}
                                            disabled={!isEditing}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? (
                                              format(
                                                new Date(field.value),
                                                "PPP"
                                              )
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      {isEditing && (
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <Calendar
                                            mode="single"
                                            selected={
                                              field.value
                                                ? new Date(field.value)
                                                : undefined
                                            }
                                            onSelect={(date) => {
                                              field.onChange(
                                                date
                                                  ? format(date, "yyyy-MM-dd")
                                                  : null
                                              );
                                            }}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      )}
                                    </Popover>
                                    <FormDescription>
                                      When the achievement was earned or period
                                      started
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />

                              <FormField
                                control={form.control}
                                name={`achievements.${index}.endDate`}
                                render={({ field }) => (
                                  <FormItem>
                                    <FormLabel>End Date</FormLabel>
                                    <Popover>
                                      <PopoverTrigger asChild>
                                        <FormControl>
                                          <Button
                                            variant="outline"
                                            className={cn(
                                              "w-full justify-start text-left font-normal",
                                              !field.value &&
                                                "text-muted-foreground",
                                              !isEditing &&
                                                "cursor-not-allowed opacity-50"
                                            )}
                                            disabled={!isEditing}
                                          >
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {field.value ? (
                                              format(
                                                new Date(field.value),
                                                "PPP"
                                              )
                                            ) : (
                                              <span>Pick a date</span>
                                            )}
                                          </Button>
                                        </FormControl>
                                      </PopoverTrigger>
                                      {isEditing && (
                                        <PopoverContent
                                          className="w-auto p-0"
                                          align="start"
                                        >
                                          <Calendar
                                            mode="single"
                                            selected={
                                              field.value
                                                ? new Date(field.value)
                                                : undefined
                                            }
                                            onSelect={(date) => {
                                              field.onChange(
                                                date
                                                  ? format(date, "yyyy-MM-dd")
                                                  : null
                                              );
                                            }}
                                            initialFocus
                                          />
                                        </PopoverContent>
                                      )}
                                    </Popover>
                                    <FormDescription>
                                      End date for time-bound achievements
                                      (optional)
                                    </FormDescription>
                                    <FormMessage />
                                  </FormItem>
                                )}
                              />
                            </div>
                          </CardContent>
                        </CollapsibleContent>
                      </Card>
                    </Collapsible>
                  );
                })}
              </div>

              {isEditing && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={addAchievement}
                  className="w-full"
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Achievement
                </Button>
              )}
            </div>
          </form>
      </Form>
    </div>
  );
}
