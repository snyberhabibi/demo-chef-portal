"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useAuth } from "@/components/providers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Spinner } from "@/components/ui/spinner";
import { useFormErrorHandler } from "@/hooks/use-form-error-handler";
import { FormErrorAlert } from "@/components/shared/form-error-alert";
import { YallaBitesLogoHorizontal } from "@/components/shared";
import { Mail, Info } from "lucide-react";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

const carouselMessages = [
  { line1: "Manage your catering orders", line2: "and showcase your homemade specialties" },
  { line1: "Track deliveries and events", line2: "and keep your catering schedule organized" },
  { line1: "Connect with customers", line2: "and grow your homemade food business" },
];

const RESEND_COOLDOWN_SECONDS = 60;

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState<string>("");
  const [isLinkSent, setIsLinkSent] = useState(false);
  const { forgotPassword } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);
  const [countdown, setCountdown] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % carouselMessages.length);
    }, 3000); // Change message every 3 seconds

    return () => clearInterval(interval);
  }, []);

  // Countdown timer for resend button
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);

      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = form;

  const { handleError, generalError, clearError } = useFormErrorHandler({
    setError,
    mapFieldNames: {
      email: "email",
    },
    showToast: false, // Disable toast - we show errors in the form instead
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    if (isLoading) {
      return;
    }

    clearError();

    try {
      setIsLoading(true);
      const response = await forgotPassword(data);

      if (response.data && !response.data.success) {
        throw new Error(
          response.data.message || "Failed to send reset link. Please try again."
        );
      }

      setEmail(data.email);
      setIsLinkSent(true);
      setCountdown(RESEND_COOLDOWN_SECONDS); // Start countdown when link is sent
    } catch (error) {
      console.error("Forgot password error:", error);
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (isResending || countdown > 0) {
      return;
    }

    try {
      setIsResending(true);
      const response = await forgotPassword({ email });

      if (response.data && !response.data.success) {
        throw new Error(
          response.data.message || "Failed to resend link. Please try again."
        );
      }

      // Start countdown after successful resend
      setCountdown(RESEND_COOLDOWN_SECONDS);
    } catch (error) {
      console.error("Resend error:", error);
      handleError(error);
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-gray-50" translate="no">
      {/* Form section - appears first when stacked */}
      <div className="w-full lg:flex-5 flex flex-col justify-center items-center p-8 md:p-12 lg:p-20 bg-white order-1 lg:order-2 min-h-[50vh] lg:min-h-screen">
        <div className="w-full max-w-md">
          {isLinkSent ? (
            <>
              <div className="mb-10">
                <div className="flex justify-center mb-6">
                  <div className="w-16 h-16 bg-[#e54141]/10 rounded-full flex items-center justify-center">
                    <Mail className="w-8 h-8 text-[#e54141]" />
                  </div>
                </div>
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center">Check your email</h2>
                <p className="text-gray-500 mt-2 text-center">
                  We&apos;ve sent a reset link to <span className="font-medium">{email}</span>
                </p>
              </div>

              <div className="space-y-4">
                {/* General form error */}
                <FormErrorAlert error={generalError} />

                <div className="bg-blue-50/50 border border-blue-100 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Info className="w-5 h-5 text-blue-600 mt-0.5 shrink-0" />
                    <div className="flex-1">
                      <p className="text-sm text-gray-700 leading-relaxed">
                        Click the link in your email to reset your password. The link expires in{" "}
                        <span className="font-semibold text-gray-900">60 minutes</span>.
                      </p>
                      <p className="text-sm text-gray-600 mt-2 leading-relaxed">
                        Check your inbox or spam folder.
                      </p>
                    </div>
                  </div>
                </div>

                <Button
                  onClick={handleResend}
                  disabled={isResending || countdown > 0}
                  className="w-full h-12 bg-[#e54141] hover:bg-[#d13838] text-white font-bold rounded-lg transition-all transform active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                  translate="no"
                >
                  {isResending ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : countdown > 0 ? (
                    `Resend link (${countdown}s)`
                  ) : (
                    "Resend link"
                  )}
                </Button>

                <div className="flex items-center justify-between pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setIsLinkSent(false);
                      form.reset();
                      clearError();
                      setCountdown(0);
                    }}
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    translate="no"
                  >
                    Use different email
                  </button>
                  <Link
                    href="/auth/login"
                    className="text-sm text-gray-600 hover:text-gray-800 transition-colors"
                    translate="no"
                  >
                    Back to login
                  </Link>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-gray-900 tracking-tight">Forgot Password</h2>
                <p className="text-gray-500 mt-2">We&apos;ll send you a reset link.</p>
              </div>

              <form onSubmit={handleSubmit(onSubmit)} className="space-y-3" translate="no" data-testid="forgot-password-form">
                {/* General form error */}
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
                    data-testid="forgot-password-email-input"
                  />
                  <p
                    className={`text-sm text-destructive min-h-5 mt-1 ${
                      !errors.email ? "invisible" : ""
                    }`}
                  >
                    {errors.email?.message || "\u00A0"}
                  </p>
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 bg-[#e54141] hover:bg-[#d13838] text-white font-bold rounded-lg transition-all transform active:scale-[0.98]"
                  disabled={isLoading}
                  translate="no"
                  data-testid="forgot-password-submit-button"
                >
                  {isLoading ? (
                    <>
                      <Spinner className="mr-2 h-4 w-4" />
                      Sending...
                    </>
                  ) : (
                    "Send Reset Link"
                  )}
                </Button>

                <div className="text-center text-sm pt-2">
                  <Link
                    href="/auth/login"
                    className="text-black font-semibold hover:text-gray-800 transition-colors"
                    translate="no"
                    data-testid="forgot-password-back-to-login"
                  >
                    Back to login
                  </Link>
                </div>
              </form>
            </>
          )}
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
