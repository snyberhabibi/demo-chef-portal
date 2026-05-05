"use client";

import { useEffect } from "react";
import { useForm, type Path } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import type { ChefProfile } from "@/services/chef-profile.service";

const businessInfoSchema = z.object({
  licenseNumber: z.string().optional(),
  taxId: z.string().optional(),
});

type BusinessInfoFormValues = z.infer<typeof businessInfoSchema>;

interface BusinessInfoTabProps {
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

export function BusinessInfoTab({
  profile,
  isEditing,
  onSave,
  formRef,
}: BusinessInfoTabProps) {
  const form = useForm<BusinessInfoFormValues>({
    resolver: zodResolver(businessInfoSchema),
    defaultValues: {
      licenseNumber: profile?.licenseNumber || "",
      taxId: profile?.taxId || "",
    },
  });

  // Sync form with profile data when it changes
  useEffect(() => {
    if (profile) {
      form.reset({
        licenseNumber: profile.licenseNumber || "",
        taxId: profile.taxId || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (values: BusinessInfoFormValues) => {
    onSave(values);
  };

  // Expose submit method and setFieldError to parent
  useEffect(() => {
    if (formRef) {
      formRef({
        submit: () => {
          form.handleSubmit(onSubmit)();
        },
        setFieldError: (field: string, message: string) => {
          form.setError(field as Path<BusinessInfoFormValues>, {
            type: "server",
            message,
          });
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
            {/* License Number and Tax ID - 2 columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="licenseNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>License Number</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="Business license number"
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>Business license number</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="taxId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tax Id</FormLabel>
                    <FormControl>
                      <Input
                        {...field}
                        disabled={!isEditing}
                        placeholder="Tax identification number"
                        className="w-full"
                      />
                    </FormControl>
                    <FormDescription>Tax identification number</FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </form>
      </Form>
    </div>
  );
}

