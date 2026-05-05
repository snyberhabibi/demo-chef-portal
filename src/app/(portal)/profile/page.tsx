/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Camera, ExternalLink, ChevronRight, ChevronLeft, Check } from "lucide-react";

const STEPS = [
  { label: "Your Kitchen", num: 1 },
  { label: "Menu Setup", num: 2 },
  { label: "Pickup Details", num: 3 },
  { label: "Go Live", num: 4 },
];

export default function ProfilePage() {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("Yalla Kitchen by Amira");
  const [tagline, setTagline] = useState("Authentic Jordanian home cooking in DFW");
  const [bio, setBio] = useState("");
  const [experience, setExperience] = useState("5+");
  const [avatarHover, setAvatarHover] = useState(false);

  return (
    <div className="section-stack" style={{ maxWidth: 560 }}>
      {/* Progress dots */}
      <div className="flex items-center justify-center gap-0" style={{ padding: "8px 0" }}>
        {STEPS.map((s, i) => {
          const isCurrent = s.num === step;
          const isDone = s.num < step;
          const isFuture = s.num > step;

          return (
            <div key={s.num} className="flex items-center">
              {/* Connector line */}
              {i > 0 && (
                <div
                  style={{
                    width: 40,
                    height: 2,
                    background: isDone || isCurrent ? "var(--color-sage)" : "var(--color-cream-sunken)",
                    transition: "background 0.2s",
                  }}
                />
              )}
              {/* Dot */}
              <div className="flex flex-col items-center" style={{ position: "relative" }}>
                <button
                  onClick={() => setStep(s.num)}
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: "50%",
                    background: isDone
                      ? "var(--color-sage)"
                      : isCurrent
                      ? "var(--color-red)"
                      : "var(--color-cream-sunken)",
                    color: isDone || isCurrent ? "#fff" : "var(--color-brown-soft-2)",
                    fontSize: 13,
                    fontWeight: 700,
                    transition: "all 0.2s",
                    border: "none",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minWidth: 44,
                    minHeight: 44,
                  }}
                >
                  {isDone ? <Check size={16} /> : s.num}
                </button>
                <span
                  style={{
                    position: "absolute",
                    top: 38,
                    fontSize: 11,
                    fontWeight: isCurrent ? 600 : 500,
                    color: isFuture ? "var(--color-brown-soft-2)" : "var(--color-brown)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {s.label}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Spacer for labels */}
      <div style={{ height: 16 }} />

      {/* Step 1: Your Kitchen */}
      {step === 1 && (
        <div className="card section-stack" style={{ transition: "box-shadow 0.2s ease" }}>
          <div>
            <h2 className="fraunces" style={{ fontSize: 22, margin: 0 }}>Your Kitchen</h2>
            <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "4px 0 0" }}>
              Tell customers about your kitchen and cooking style
            </p>
          </div>

          {/* Avatar upload */}
          <div className="flex justify-center">
            <div
              style={{ position: "relative", cursor: "pointer" }}
              onMouseEnter={() => setAvatarHover(true)}
              onMouseLeave={() => setAvatarHover(false)}
            >
              <div
                className="flex items-center justify-center"
                style={{
                  width: 100,
                  height: 100,
                  borderRadius: "50%",
                  background: avatarHover ? "var(--color-cream-deep)" : "var(--color-cream-sunken)",
                  border: `3px dashed ${avatarHover ? "var(--color-red)" : "var(--color-brown-soft-2)"}`,
                  transition: "all 0.2s ease",
                }}
              >
                <Camera size={28} style={{ color: avatarHover ? "var(--color-red)" : "var(--color-brown-soft-2)", transition: "color 0.2s ease" }} />
              </div>
              <div
                className="flex items-center justify-center"
                style={{
                  position: "absolute",
                  bottom: 0,
                  right: 0,
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: "var(--color-red)",
                  color: "#fff",
                  cursor: "pointer",
                  transition: "transform 0.15s ease",
                  transform: avatarHover ? "scale(1.1)" : "scale(1)",
                }}
              >
                <Camera size={14} />
              </div>
            </div>
          </div>

          {/* Business name */}
          <div>
            <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
              Kitchen Name
            </label>
            <input
              className="input"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your kitchen name"
              style={{ minHeight: 44, transition: "border-color 0.15s ease" }}
            />
          </div>

          {/* Tagline */}
          <div>
            <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
              Tagline
            </label>
            <input
              className="input"
              value={tagline}
              onChange={(e) => setTagline(e.target.value.slice(0, 80))}
              placeholder="A short description that appears on your store"
              style={{ minHeight: 44, transition: "border-color 0.15s ease" }}
            />
            <div style={{ fontSize: 12, color: "var(--color-brown-soft-2)", marginTop: 4 }}>
              {tagline.length}/80 characters
            </div>
          </div>

          {/* Bio */}
          <div>
            <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
              Bio
            </label>
            <textarea
              className="textarea"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tell your story. What inspires your cooking? What makes your kitchen special?"
              rows={4}
              style={{ minHeight: 100, transition: "border-color 0.15s ease" }}
            />
          </div>

          {/* Experience */}
          <div>
            <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
              Cooking Experience
            </label>
            <select
              className="select"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
              style={{ minHeight: 44 }}
            >
              <option value="1">Less than 1 year</option>
              <option value="1-3">1-3 years</option>
              <option value="3-5">3-5 years</option>
              <option value="5+">5+ years</option>
              <option value="pro">Professional / Trained chef</option>
            </select>
          </div>
        </div>
      )}

      {/* Step 2: Menu Setup */}
      {step === 2 && (
        <div className="card section-stack" style={{ transition: "box-shadow 0.2s ease", textAlign: "center", padding: 32 }}>
          <div className="fraunces" style={{ fontSize: 22 }}>Menu Setup</div>
          <p style={{ fontSize: 14, color: "var(--color-brown-soft)" }}>
            Add your dishes, set prices, and upload photos. You can manage your full menu from the menu page.
          </p>
          <Link href="/menu" className="btn btn-red" style={{ minHeight: 44 }}>
            Go to Menu
            <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* Step 3: Pickup Details */}
      {step === 3 && (
        <div className="card section-stack" style={{ transition: "box-shadow 0.2s ease", textAlign: "center", padding: 32 }}>
          <div className="fraunces" style={{ fontSize: 22 }}>Pickup Details</div>
          <p style={{ fontSize: 14, color: "var(--color-brown-soft)" }}>
            Set your pickup address, instructions, and schedule so customers know where and when to pick up.
          </p>
          <Link href="/pickup-address" className="btn btn-red" style={{ minHeight: 44 }}>
            Set Pickup Address
            <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* Step 4: Go Live */}
      {step === 4 && (
        <div className="card section-stack" style={{ transition: "box-shadow 0.2s ease", textAlign: "center", padding: 32 }}>
          <div className="fraunces" style={{ fontSize: 22 }}>Go Live</div>
          <p style={{ fontSize: 14, color: "var(--color-brown-soft)" }}>
            Your profile is ready. Head to Operations to toggle your store online and start receiving orders.
          </p>
          <Link href="/operations" className="btn btn-red" style={{ minHeight: 44 }}>
            Go to Operations
            <ChevronRight size={16} />
          </Link>
        </div>
      )}

      {/* Navigation */}
      <div className="flex items-center justify-between">
        <button
          className="btn btn-ghost"
          disabled={step <= 1}
          onClick={() => setStep(step - 1)}
          style={{ opacity: step <= 1 ? 0.4 : 1, minHeight: 44, transition: "all 0.15s ease" }}
        >
          <ChevronLeft size={16} />
          Back
        </button>

        <Link
          href="/menu"
          className="flex items-center gap-1"
          style={{
            fontSize: 13,
            fontWeight: 500,
            color: "var(--color-red)",
            textDecoration: "none",
            minHeight: 44,
            display: "inline-flex",
            alignItems: "center",
            transition: "opacity 0.15s ease",
          }}
        >
          <ExternalLink size={13} />
          Preview My Store
        </Link>

        <div className="flex gap-2">
          <button className="btn btn-ghost" style={{ minHeight: 44, transition: "all 0.15s ease" }}>Save</button>
          <button
            className="btn btn-red"
            onClick={() => setStep(Math.min(step + 1, 4))}
            disabled={step >= 4}
            style={{ minHeight: 44, opacity: step >= 4 ? 0.5 : 1, transition: "all 0.15s ease" }}
          >
            Next
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
