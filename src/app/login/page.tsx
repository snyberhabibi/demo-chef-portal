/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronDown, ChevronUp } from "lucide-react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  return (
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden px-5"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Decorative blobs with drift animation */}
      <div
        className="blob"
        style={{
          width: 340,
          height: 340,
          background: "var(--color-orange-soft)",
          top: "-8%",
          right: "-6%",
          animationDelay: "0s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 280,
          height: 280,
          background: "var(--color-terracotta-soft)",
          bottom: "-5%",
          left: "-8%",
          animationDelay: "-6s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 200,
          height: 200,
          background: "var(--color-sage-soft)",
          top: "40%",
          left: "60%",
          animationDelay: "-10s",
          opacity: 0.25,
        }}
      />

      <div
        className="relative w-full page-fade"
        style={{ maxWidth: 400 }}
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <img
            src="/logo-light.png"
            alt="Yalla Bites"
            style={{ height: 28, display: "inline-block" }}
          />
        </div>

        {/* Headline */}
        <h1
          className="fraunces text-center"
          style={{
            fontSize: "clamp(32px, 6vw, 52px)",
            lineHeight: 1.1,
            color: "var(--color-brown)",
            marginBottom: 32,
          }}
        >
          Welcome to
          <br />
          your kitchen.
        </h1>

        {/* Magic link form — full width on mobile */}
        <div className="flex flex-col gap-3">
          <input
            type="email"
            placeholder="chef@example.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input"
            style={{ minHeight: 44 }}
          />
          <button
            className="btn btn-red btn-lg btn-block"
            style={{ minHeight: 44 }}
            onClick={() => router.push("/welcome")}
          >
            Send me a login link
          </button>
        </div>

        <p
          className="text-center mt-3"
          style={{
            fontSize: 13,
            color: "var(--color-brown-soft-2)",
          }}
        >
          We&apos;ll email you a link that signs you in instantly.
        </p>

        {/* Divider */}
        <div className="flex items-center gap-3 my-6">
          <div
            className="flex-1"
            style={{ height: 1, background: "rgba(51,31,46,0.1)" }}
          />
          <span
            style={{
              fontSize: 13,
              color: "var(--color-brown-soft-2)",
              fontWeight: 500,
            }}
          >
            or
          </span>
          <div
            className="flex-1"
            style={{ height: 1, background: "rgba(51,31,46,0.1)" }}
          />
        </div>

        {/* Google sign-in */}
        <button
          className="btn btn-ghost btn-block"
          style={{ minHeight: 44 }}
          onClick={() => router.push("/welcome")}
        >
          <svg
            width="18"
            height="18"
            viewBox="0 0 18 18"
            fill="none"
          >
            <path
              d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 0 1-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615Z"
              fill="#4285F4"
            />
            <path
              d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18Z"
              fill="#34A853"
            />
            <path
              d="M3.964 10.71A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.997 8.997 0 0 0 0 9c0 1.452.348 2.827.957 4.042l3.007-2.332Z"
              fill="#FBBC05"
            />
            <path
              d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58Z"
              fill="#EA4335"
            />
          </svg>
          Sign in with Google
        </button>

        {/* Collapsible password section */}
        <div className="mt-4">
          <button
            onClick={() => setShowPassword(!showPassword)}
            className="flex items-center gap-1 mx-auto"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-brown-soft)",
              background: "none",
              border: "none",
              minHeight: 44,
            }}
          >
            Sign in with password
            {showPassword ? (
              <ChevronUp size={16} />
            ) : (
              <ChevronDown size={16} />
            )}
          </button>

          {showPassword && (
            <div className="mt-3 flex flex-col gap-3 page-fade">
              <input
                type="email"
                placeholder="Email"
                className="input"
                style={{ minHeight: 44 }}
              />
              <input
                type="password"
                placeholder="Password"
                className="input"
                style={{ minHeight: 44 }}
              />
              <button
                className="btn btn-ghost btn-block"
                style={{ minHeight: 44 }}
                onClick={() => router.push("/dashboard")}
              >
                Sign in
              </button>
              <button
                className="mx-auto"
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "var(--color-brown-soft-2)",
                  background: "none",
                  border: "none",
                  minHeight: 44,
                  cursor: "pointer",
                }}
              >
                Forgot password?
              </button>
            </div>
          )}
        </div>

        {/* Help — mailto link */}
        <p
          className="text-center mt-8"
          style={{
            fontSize: 13,
            color: "var(--color-brown-soft-2)",
          }}
        >
          Need help?{" "}
          <a
            href="mailto:support@yallabites.com"
            style={{
              color: "var(--color-red)",
              fontWeight: 500,
            }}
          >
            support@yallabites.com
          </a>
        </p>
      </div>
    </div>
  );
}
