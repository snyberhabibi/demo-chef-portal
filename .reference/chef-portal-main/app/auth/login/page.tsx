"use client";

import Link from "next/link";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PasswordInput } from "@/components/ui/password-input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Spinner } from "@/components/ui/spinner";
import { useFormErrorHandler } from "@/hooks/use-form-error-handler";
import { FormErrorAlert } from "@/components/shared/form-error-alert";
import { YallaBitesLogoHorizontal } from "@/components/shared";

const loginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  remember: z.boolean(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const carouselMessages = [
  { line1: "Manage your catering orders", line2: "and showcase your homemade specialties" },
  { line1: "Track deliveries and events", line2: "and keep your catering schedule organized" },
  { line1: "Connect with customers", line2: "and grow your homemade food business" },
];

export default function LoginPage() {
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % carouselMessages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);
  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      remember: false,
    },
  });

  const {
    register,
    handleSubmit,
    setError,
    control,
    formState: { errors },
  } = form;

  const { handleError, generalError, clearError } = useFormErrorHandler({
    setError,
    mapFieldNames: {
      email: "email",
      password: "password",
    },
    showToast: false, // Disable toast - we show errors in the form instead
    getCustomMessage: (error) => {
      if (error instanceof Error) {
        const message = error.message;

        // Provide more specific messages for common auth errors
        if (
          message.includes("401") ||
          message.includes("Invalid email or password")
        ) {
          // Set errors on both fields since we don't know which one is wrong
          setError("email", {
            type: "server",
            message: "Invalid email or password",
          });
          setError("password", {
            type: "server",
            message: "Invalid email or password",
          });
          return "Invalid email or password. Please check your credentials and try again.";
        } else if (message.includes("400")) {
          return "Invalid request. Please check your input.";
        } else if (
          message.includes("network") ||
          message.includes("fetch") ||
          message.includes("Unable to connect") ||
          message.includes("backend server")
        ) {
          return message; // Use the improved error message from http-client
        } else if (message.includes("Supabase") || message.includes("AuthRetryableFetchError")) {
          // Handle Supabase connection errors from backend
          return "Unable to connect to authentication service. Please check if the backend server is running and properly configured.";
        } else if (message.includes("Server Action Error")) {
          return "Something went wrong on our side. Please try again later.";
        }
      }
      return null;
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (isLoading) {
      return;
    }

    clearError();

    try {
      setIsLoading(true);
      await login(data.email, data.password);
    } catch (error) {
      console.error("Login error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50" translate="no">
      {/* Form section - appears first when stacked */}
      <div className="w-full lg:flex-5 flex flex-col justify-center items-center p-8 md:p-12 lg:p-20 bg-white order-1 lg:order-2 min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md">
          <div className="mb-10">
            <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Welcome back</h2>
            <p className="text-gray-500 mt-2">Please enter your details to sign in.</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" translate="no" data-testid="login-form">
            {/* General form error - show either generalError or errors.root, not both */}
            <FormErrorAlert error={generalError || errors.root?.message} />

            <div>
              <Label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-2" translate="no">
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                {...register("email")}
                disabled={isLoading}
                aria-invalid={!!errors.email}
                className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black focus:bg-white shadow-none"
                translate="no"
                data-testid="login-email-input"
              />
              <p
                className={`text-sm text-destructive min-h-5 mt-1 ${
                  !errors.email ? "invisible" : ""
                }`}
              >
                {errors.email?.message || "\u00A0"}
              </p>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <Label htmlFor="password" className="text-sm font-semibold text-gray-700" translate="no">
                  Password
                </Label>
                <Link
                  href="/auth/forgot-password"
                  className="text-sm font-semibold text-black hover:text-gray-800"
                  data-testid="login-forgot-password-link"
                >
                  Forgot?
                </Link>
              </div>
              <PasswordInput
                id="password"
                placeholder="••••••••"
                {...register("password")}
                disabled={isLoading}
                aria-invalid={!!errors.password}
                className="w-full h-12 px-4 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 text-sm transition-all focus:outline-none focus:ring-2 focus:ring-black/20 focus:border-black focus:bg-white shadow-none"
                toggleButtonClassName="right-4 top-1/2 -translate-y-1/2 h-auto [&_svg]:h-5 [&_svg]:w-5 [&_svg]:text-gray-400 hover:[&_svg]:text-gray-600"
                translate="no"
                data-testid="login-password-input"
              />
              <p
                className={`text-sm text-destructive min-h-5 mt-1 ${
                  !errors.password ? "invisible" : ""
                }`}
              >
                {errors.password?.message || "\u00A0"}
              </p>
            </div>

            <div className="flex items-center">
              <Controller
                name="remember"
                control={control}
                render={({ field }) => (
                  <Checkbox
                    id="remember"
                    checked={field.value}
                    onCheckedChange={field.onChange}
                    disabled={isLoading}
                    className="w-4 h-4 text-black border-gray-300 rounded focus:ring-black data-[state=checked]:bg-black data-[state=checked]:border-black"
                  />
                )}
              />
              <Label htmlFor="remember" className="ml-2 text-sm text-gray-600 cursor-pointer" translate="no">
                Keep me logged in
              </Label>
            </div>

            <Button
              type="submit"
              className="w-full h-12 bg-[#e54141] hover:bg-[#d13838] text-white font-bold rounded-lg transition-all transform active:scale-[0.98]"
              disabled={isLoading}
              translate="no"
              data-testid="login-submit-button"
            >
              {isLoading ? (
                <>
                  <Spinner className="mr-2 h-4 w-4" />
                  Logging in...
                </>
              ) : (
                "Sign In to Portal"
              )}
            </Button>
          </form>
        </div>
      </div>

      {/* Left side - Branded section */}
      <div className="flex w-full lg:flex-3 relative bg-[#331f2e] items-center justify-center p-6 md:p-8 lg:p-10 overflow-hidden min-h-[50vh] lg:min-h-screen order-2 lg:order-1">
        <div className="absolute top-0 left-0 w-48 h-48 lg:w-56 lg:h-56 bg-[#F2A968] rounded-full mix-blend-multiply filter blur-3xl opacity-30 -translate-x-1/2 -translate-y-1/2"></div>
        <div className="absolute bottom-0 right-0 w-72 h-72 lg:w-80 lg:h-80 bg-gray-800 rounded-full mix-blend-multiply filter blur-3xl opacity-10 translate-x-1/3 translate-y-1/3"></div>

        <div className="relative z-10 w-full text-white px-4 lg:px-6">
          <div className="mb-8 lg:mb-10 flex justify-start">
            <YallaBitesLogoHorizontal className="w-48 h-auto md:w-52 lg:w-56" />
          </div>
          <p className="text-lg md:text-xl lg:text-xl font-light leading-relaxed opacity-90 mb-6 lg:mb-8">
            The platform for finest chefs to manage their catering business and showcase homemade specialties.
          </p>
          <div className="w-full mb-6 lg:mb-8">
            <div className="h-16 lg:h-20 flex flex-col justify-center mb-4 lg:mb-6">
              <p className="text-sm md:text-base lg:text-base font-light opacity-80 transition-opacity duration-500">
                {carouselMessages[currentMessageIndex].line1}
              </p>
              <p className="text-sm md:text-base lg:text-base font-light opacity-80 transition-opacity duration-500">
                {carouselMessages[currentMessageIndex].line2}
              </p>
            </div>
            <div className="flex gap-2 md:gap-3 justify-start">
              {carouselMessages.map((_, index) => (
                <div
                  key={index}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    index === currentMessageIndex
                      ? "w-10 lg:w-12 bg-[#F2A968]"
                      : "w-3 lg:w-4 bg-white/30"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
