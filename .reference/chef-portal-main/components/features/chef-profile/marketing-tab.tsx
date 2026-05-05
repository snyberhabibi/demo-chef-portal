"use client";

import { useEffect } from "react";
import { useForm } from "react-hook-form";
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
import { Save } from "lucide-react";
import type { ChefProfile } from "@/services/chef-profile.service";

const marketingSchema = z.object({
  socialMediaLinks: z.object({
    facebook: z.string().optional(),
    instagram: z.string().optional(),
    twitter: z.string().optional(),
    website: z.string().optional(),
  }).optional(),
  marketingDescription: z.string().optional(),
});

type MarketingFormValues = z.infer<typeof marketingSchema>;

interface MarketingTabProps {
  profile?: ChefProfile;
  isEditing: boolean;
  onSave: (data: Partial<ChefProfile>) => void;
}

export function MarketingTab({
  profile,
  isEditing,
  onSave,
}: MarketingTabProps) {
  const form = useForm<MarketingFormValues>({
    resolver: zodResolver(marketingSchema),
    defaultValues: {
      socialMediaLinks: {
        facebook: "",
        instagram: "",
        twitter: "",
        website: "",
      },
      marketingDescription: "",
    },
  });

  // Sync form with profile data when it changes
  useEffect(() => {
    if (profile) {
      form.reset({
        socialMediaLinks: profile.socialMediaLinks || {
          facebook: "",
          instagram: "",
          twitter: "",
          website: "",
        },
        marketingDescription: profile.marketingDescription || "",
      });
    }
  }, [profile, form]);

  const onSubmit = (values: MarketingFormValues) => {
    onSave(values);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Social Media</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Connect your social media accounts to reach more customers
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <FormField
              control={form.control}
              name="socialMediaLinks.facebook"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="https://facebook.com/yourpage"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialMediaLinks.instagram"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="https://instagram.com/yourprofile"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialMediaLinks.twitter"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Twitter</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="https://twitter.com/yourhandle"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="socialMediaLinks.website"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      disabled={!isEditing}
                      placeholder="https://yourwebsite.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="marketingDescription"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Marketing Description</FormLabel>
                <FormControl>
                  <Textarea
                    {...field}
                    disabled={!isEditing}
                    placeholder="Additional marketing information and promotional content"
                    className="resize-y min-h-[120px]"
                  />
                </FormControl>
                <FormDescription>
                  Additional marketing information and promotional content
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        {isEditing && (
          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button type="submit" disabled={form.formState.isSubmitting}>
              <Save className="mr-2 h-4 w-4" />
              Save Changes
            </Button>
          </div>
        )}
      </form>
    </Form>
  );
}

