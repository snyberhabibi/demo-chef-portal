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
    time: "1 min",
    href: "/profile",
  },
  {
    num: 2,
    icon: UtensilsCrossed,
    title: "Add your first dish",
    time: "2 min",
    href: "/menu/new",
  },
  {
    num: 3,
    icon: Clock,
    title: "Set your hours",
    time: "1 min",
    href: "/operations",
  },
  {
    num: 4,
    icon: Landmark,
    title: "Connect your bank",
    time: "1 min",
    href: "/payments",
  },
  {
    num: 5,
    icon: Rocket,
    title: "Go live!",
    time: "Instant",
    href: "/operations",
  },
];

export default function WelcomePage() {
  return (
    <div
      className="relative flex items-center justify-center min-h-screen overflow-hidden px-5 py-12"
      style={{ background: "var(--color-cream)" }}
    >
      {/* Decorative blobs */}
      <div
        className="blob"
        style={{
          width: 320,
          height: 320,
          background: "var(--color-orange-soft)",
          top: "5%",
          left: "-10%",
          animationDelay: "-3s",
        }}
      />
      <div
        className="blob"
        style={{
          width: 260,
          height: 260,
          background: "var(--color-terracotta-soft)",
          bottom: "8%",
          right: "-8%",
          animationDelay: "-8s",
        }}
      />

      <div
        className="relative w-full page-fade"
        style={{ maxWidth: 480 }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img
            src="/logo-light.png"
            alt="Yalla Bites"
            style={{ height: 28 }}
          />
        </div>

        {/* Celebration emoji sticker */}
        <div className="flex justify-center mb-6">
          <div
            className="card-sticker flex items-center justify-center"
            style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              padding: 0,
              fontSize: 40,
            }}
          >
            <span role="img" aria-label="celebration">
              🎉
            </span>
          </div>
        </div>

        {/* Headline */}
        <h1
          className="fraunces text-center"
          style={{
            fontSize: "clamp(28px, 5vw, 40px)",
            lineHeight: 1.15,
            color: "var(--color-brown)",
            marginBottom: 8,
          }}
        >
          Welcome to Yalla Bites,{" "}
          <span className="fraunces-italic">Amira!</span>
        </h1>
        <p
          className="text-center"
          style={{
            fontSize: 16,
            color: "var(--color-brown-soft)",
            marginBottom: 32,
          }}
        >
          Let&apos;s get your kitchen set up. This takes about 5 minutes.
        </p>

        {/* Step cards — staggered entrance */}
        <div className="flex flex-col gap-3 mb-8 line-reveal">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.num}
                href={step.href}
                className="card-hover"
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "14px 16px",
                  cursor: "pointer",
                  textDecoration: "none",
                  color: "inherit",
                  minHeight: 44,
                  background: "var(--color-cream-deep)",
                  borderRadius: 16,
                }}
              >
                {/* Number circle */}
                <span
                  className="flex items-center justify-center rounded-full shrink-0"
                  style={{
                    width: 32,
                    height: 32,
                    background: "var(--color-cream-sunken)",
                    fontSize: 14,
                    fontWeight: 700,
                    color: "var(--color-brown)",
                  }}
                >
                  {step.num}
                </span>

                {/* Icon */}
                <Icon
                  size={20}
                  strokeWidth={1.8}
                  style={{
                    color: "var(--color-brown-soft)",
                    flexShrink: 0,
                  }}
                />

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <div
                    style={{
                      fontSize: 15,
                      fontWeight: 600,
                      color: "var(--color-brown)",
                    }}
                  >
                    {step.title}
                  </div>
                  <div
                    style={{
                      fontSize: 12,
                      color: "var(--color-brown-soft-2)",
                      marginTop: 1,
                    }}
                  >
                    {step.time}
                  </div>
                </div>

                {/* Chevron */}
                <ChevronRight
                  size={18}
                  style={{
                    color: "var(--color-brown-soft-2)",
                    flexShrink: 0,
                  }}
                />
              </Link>
            );
          })}
        </div>

        {/* CTA */}
        <Link
          href="/dashboard"
          className="btn btn-red btn-lg btn-block"
          style={{
            minHeight: 44,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          Let&apos;s go
        </Link>

        {/* Skip */}
        <div className="text-center mt-4">
          <Link
            href="/dashboard"
            style={{
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-brown-soft-2)",
              minHeight: 44,
              display: "inline-flex",
              alignItems: "center",
            }}
          >
            Skip for now
          </Link>
        </div>
      </div>
    </div>
  );
}
