/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import {
  ChefHat,
  UtensilsCrossed,
  Clock,
  Landmark,
  Rocket,
  ChevronRight,
} from "lucide-react";

const steps = [
  {
    num: 1,
    icon: ChefHat,
    title: "Tell us about your kitchen",
    href: "/profile",
  },
  {
    num: 2,
    icon: UtensilsCrossed,
    title: "Add your first dish",
    href: "/menu/new",
  },
  {
    num: 3,
    icon: Clock,
    title: "Set your hours",
    href: "/operations",
  },
  {
    num: 4,
    icon: Landmark,
    title: "Connect your bank",
    href: "/payments",
  },
  {
    num: 5,
    icon: Rocket,
    title: "Go live!",
    href: "/operations",
  },
];

export default function WelcomePage() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden px-5 py-12"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Decorative blobs — 2 only, subtle */}
      <div
        className="blob"
        style={{
          width: 300,
          height: 300,
          background: "var(--color-orange-soft)",
          top: "5%",
          left: "-10%",
          opacity: 0.2,
          filter: "blur(80px)",
        }}
      />
      <div
        className="blob"
        style={{
          width: 240,
          height: 240,
          background: "var(--color-terracotta-soft)",
          bottom: "8%",
          right: "-8%",
          opacity: 0.2,
          filter: "blur(80px)",
        }}
      />

      <div
        className="relative w-full page-fade"
        style={{ maxWidth: 480 }}
      >
        {/* Logo — 24px at top */}
        <div className="flex justify-center" style={{ marginBottom: 32 }}>
          <img
            src="/logo-light.png"
            alt="Yalla Bites"
            style={{ height: 24 }}
          />
        </div>

        {/* Celebration emoji — 72px circle, cream-deep bg, no shadow */}
        <div className="flex justify-center" style={{ marginBottom: 24 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--color-cream-deep)",
              fontSize: 36,
            }}
          >
            <span role="img" aria-label="celebration">
              🎉
            </span>
          </div>
        </div>

        {/* Headline — heading-xl, "Amira!" on second line in fraunces-italic */}
        <h1 className="heading-xl text-center" style={{ marginBottom: 0 }}>
          Welcome to Yalla Bites,
        </h1>
        <h1
          className="heading-xl fraunces-italic text-center"
          style={{ marginBottom: 0 }}
        >
          Amira!
        </h1>

        {/* Subtitle — body-lg */}
        <p
          className="body-lg text-center"
          style={{
            marginTop: 16,
            color: "var(--color-brown-soft)",
            marginBottom: 32,
          }}
        >
          Let&apos;s set up your kitchen. Takes about 5 minutes.
        </p>

        {/* Step cards — 56px height, 8px gap */}
        <div className="flex flex-col line-reveal" style={{ gap: 8, marginBottom: 32 }}>
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.num}
                href={step.href}
                className="card card-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "0 16px",
                  height: 56,
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                }}
              >
                {/* Number circle — 24px, cream-sunken bg */}
                <span
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: 24,
                    height: 24,
                    background: "var(--color-cream-sunken)",
                    fontSize: 12,
                    fontWeight: 700,
                    color: "var(--color-brown)",
                  }}
                >
                  {step.num}
                </span>

                {/* Icon — 18px, brown-soft-2 */}
                <Icon
                  size={18}
                  strokeWidth={1.8}
                  style={{
                    color: "var(--color-brown-soft-2)",
                    flexShrink: 0,
                  }}
                />

                {/* Text — 14px, 500 weight */}
                <span
                  className="flex-1 min-w-0"
                  style={{
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--color-brown)",
                  }}
                >
                  {step.title}
                </span>

                {/* Chevron — 14px, brown-soft-2 */}
                <ChevronRight
                  size={14}
                  style={{
                    color: "var(--color-brown-soft-2)",
                    flexShrink: 0,
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* CTA — btn-red btn-block btn-lg */}
        <Link
          href="/dashboard"
          className="btn btn-red btn-lg btn-block"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Let&apos;s go
        </Link>

        {/* Skip link — caption, 16px below CTA */}
        <div className="text-center" style={{ marginTop: 16 }}>
          <Link
            href="/dashboard"
            className="caption"
            style={{
              fontWeight: 500,
              color: "var(--color-brown-soft-2)",
              display: "inline-flex",
              alignItems: "center",
              minHeight: 44,
            }}
          >
            Skip for now &mdash; I&apos;ll explore on my own
          </Link>
        </div>
      </div>
    </div>
  );
}
