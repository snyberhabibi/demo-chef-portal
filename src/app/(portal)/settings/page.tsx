/* eslint-disable @next/next/no-img-element */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Shield, LogOut, Trash2, UserPlus, ChevronRight, ChevronDown, Check, AlertTriangle } from "lucide-react";

const NOTIF_CATEGORIES = [
  { label: "New Orders", desc: "When a customer places an order" },
  { label: "Reviews", desc: "When someone leaves a review" },
  { label: "Payouts", desc: "When a payout is processed" },
  { label: "System Updates", desc: "Platform news and changes" },
];

const CHANNELS = ["Email", "Push", "SMS"];

export default function SettingsPage() {
  const [phone, setPhone] = useState("(214) 555-0198");
  const [phoneEditing, setPhoneEditing] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [notifs, setNotifs] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    NOTIF_CATEGORIES.forEach((c) => {
      init[c.label] = { Email: true, Push: true, SMS: false };
    });
    return init;
  });

  const toggleNotif = (cat: string, channel: string) => {
    setNotifs((prev) => ({
      ...prev,
      [cat]: { ...prev[cat], [channel]: !prev[cat][channel] },
    }));
  };

  return (
    <div className="section-stack" style={{ maxWidth: 560 }}>
      {/* Avatar + Name + Email + Phone */}
      <div className="card section-stack" style={{ transition: "box-shadow 0.2s ease" }}>
        {/* Avatar */}
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop"
            alt="Profile"
            className="rounded-full object-cover"
            style={{ width: 80, height: 80 }}
          />
          <div>
            <button className="btn btn-ghost btn-sm" style={{ minHeight: 44, transition: "all 0.15s ease" }}>
              Change photo
            </button>
          </div>
        </div>

        {/* Name */}
        <div>
          <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
            Full Name
          </label>
          <input
            className="input"
            defaultValue="Amira Haddad"
            style={{ minHeight: 44, transition: "border-color 0.15s ease" }}
          />
        </div>

        {/* Email */}
        <div>
          <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
            Email
          </label>
          <div className="flex items-center gap-2">
            <input
              className="input"
              defaultValue="amira@yallakitchen.com"
              readOnly
              style={{ background: "var(--color-cream-sunken)", color: "var(--color-brown-soft)", minHeight: 44 }}
            />
            <span className="pill pill-sage" style={{ flexShrink: 0 }}>Verified</span>
          </div>
        </div>

        {/* Phone */}
        <div>
          <label className="eyebrow" style={{ display: "block", marginBottom: 6 }}>
            Phone
          </label>
          <div className="flex items-center gap-2">
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={!phoneEditing}
              style={{
                minHeight: 44,
                transition: "border-color 0.15s ease",
                background: phoneEditing ? "white" : "var(--color-cream-sunken)",
              }}
            />
            <button
              className="btn btn-ghost btn-sm"
              style={{ flexShrink: 0, minHeight: 44, transition: "all 0.15s ease" }}
              onClick={() => setPhoneEditing(!phoneEditing)}
            >
              {phoneEditing ? (
                <>
                  <Check size={14} style={{ color: "var(--color-sage)" }} />
                  Save
                </>
              ) : (
                "Change"
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Notifications */}
      <div className="card" style={{ padding: 0, transition: "box-shadow 0.2s ease" }}>
        <div style={{ padding: "16px 20px" }}>
          <div style={{ fontWeight: 600, fontSize: 16 }}>Notifications</div>
          <p style={{ fontSize: 13, color: "var(--color-brown-soft)", margin: "4px 0 0" }}>
            Choose how you want to be notified
          </p>
        </div>

        {/* Channel headers */}
        <div
          className="flex items-center"
          style={{
            padding: "8px 20px",
            borderTop: "1px solid var(--color-cream-sunken)",
            borderBottom: "1px solid var(--color-cream-sunken)",
            background: "var(--color-cream)",
          }}
        >
          <span style={{ flex: 1 }} />
          {CHANNELS.map((ch) => (
            <span
              key={ch}
              className="eyebrow"
              style={{ width: 64, textAlign: "center" }}
            >
              {ch}
            </span>
          ))}
        </div>

        {NOTIF_CATEGORIES.map((cat, i) => (
          <div
            key={cat.label}
            className="flex items-center"
            style={{
              padding: "14px 20px",
              borderTop: i > 0 ? "1px solid var(--color-cream-sunken)" : undefined,
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 500, fontSize: 14 }}>{cat.label}</div>
              <div style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}>{cat.desc}</div>
            </div>
            {CHANNELS.map((ch) => (
              <div key={ch} style={{ width: 64, display: "flex", justifyContent: "center" }}>
                <button
                  className={`toggle ${notifs[cat.label][ch] ? "is-on" : ""}`}
                  onClick={() => toggleNotif(cat.label, ch)}
                  style={{ transform: "scale(0.85)", minWidth: 44, minHeight: 28 }}
                >
                  <span className="toggle-thumb" />
                </button>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Co-pilot */}
      <button
        className="card flex items-center justify-between"
        style={{
          width: "100%",
          textAlign: "left",
          border: "none",
          cursor: "pointer",
          minHeight: 44,
          transition: "box-shadow 0.2s ease",
        }}
        onClick={() => setShowInvite(!showInvite)}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center"
            style={{
              width: 40,
              height: 40,
              borderRadius: 10,
              background: "var(--color-cream-sunken)",
            }}
          >
            <UserPlus size={18} style={{ color: "var(--color-brown-soft)" }} />
          </div>
          <div>
            <div style={{ fontWeight: 600, fontSize: 15 }}>Invite a co-pilot</div>
            <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
              Add a partner to manage your store
            </div>
          </div>
        </div>
        <ChevronRight
          size={18}
          style={{
            color: "var(--color-brown-soft-2)",
            transform: showInvite ? "rotate(90deg)" : "none",
            transition: "transform 0.2s ease",
          }}
        />
      </button>
      {showInvite && (
        <div className="card" style={{ background: "var(--color-cream-deep)", transition: "all 0.2s ease" }}>
          <p style={{ fontSize: 14, color: "var(--color-brown-soft)", margin: "0 0 12px" }}>
            Co-pilot invitations coming soon. You will be able to share store access with a trusted partner.
          </p>
          <button className="btn btn-ghost btn-sm" style={{ minHeight: 44, opacity: 0.5, cursor: "not-allowed" }} disabled>
            Send Invite
          </button>
        </div>
      )}

      {/* Security */}
      <div className="card section-stack" style={{ gap: 0, transition: "box-shadow 0.2s ease" }}>
        <div style={{ fontWeight: 600, fontSize: 16, marginBottom: 12 }}>Security</div>

        <button
          className="flex items-center justify-between w-full text-left"
          style={{
            padding: "14px 0",
            background: "none",
            border: "none",
            borderTop: "1px solid var(--color-cream-sunken)",
            cursor: "pointer",
            minHeight: 48,
            transition: "opacity 0.15s ease",
          }}
          onClick={() => setPasswordOpen(!passwordOpen)}
        >
          <div className="flex items-center gap-3">
            <Shield size={18} style={{ color: "var(--color-brown-soft)" }} />
            <span style={{ fontWeight: 500, fontSize: 14 }}>Change password</span>
          </div>
          <ChevronDown
            size={16}
            style={{
              color: "var(--color-brown-soft-2)",
              transform: passwordOpen ? "rotate(180deg)" : "none",
              transition: "transform 0.2s ease",
            }}
          />
        </button>

        {passwordOpen && (
          <div style={{ padding: "0 0 14px 30px" }}>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "var(--color-brown-soft)", display: "block", marginBottom: 4 }}>
                Current Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="Enter current password"
                style={{ minHeight: 44 }}
              />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label style={{ fontSize: 12, color: "var(--color-brown-soft)", display: "block", marginBottom: 4 }}>
                New Password
              </label>
              <input
                type="password"
                className="input"
                placeholder="Enter new password"
                style={{ minHeight: 44 }}
              />
            </div>
            <button className="btn btn-red btn-sm" style={{ minHeight: 44, transition: "all 0.15s ease" }}>
              Update Password
            </button>
          </div>
        )}

        <div
          className="flex items-center justify-between w-full"
          style={{
            padding: "14px 0",
            borderTop: "1px solid var(--color-cream-sunken)",
          }}
        >
          <div className="flex items-center gap-3">
            <Shield size={18} style={{ color: "var(--color-brown-soft)" }} />
            <div>
              <span style={{ fontWeight: 500, fontSize: 14 }}>Two-factor authentication</span>
              <div style={{ fontSize: 12, color: "var(--color-brown-soft-2)" }}>Not enabled</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm" style={{ minHeight: 44, transition: "all 0.15s ease" }}>
            Set up
          </button>
        </div>
      </div>

      {/* Danger zone */}
      <div style={{ borderTop: "1px solid var(--color-cream-sunken)", paddingTop: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: "var(--color-brown-soft-2)", marginBottom: 12, textTransform: "uppercase", letterSpacing: "0.06em" }}>
          Danger Zone
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="flex items-center gap-2"
            style={{
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-brown-soft)",
              padding: "8px 0",
              textDecoration: "none",
              minHeight: 44,
              transition: "color 0.15s ease",
            }}
          >
            <LogOut size={16} />
            Log out
          </Link>
          <button
            className="flex items-center gap-2"
            style={{
              background: "none",
              border: "none",
              fontSize: 14,
              fontWeight: 500,
              color: "var(--color-red)",
              padding: "8px 0",
              cursor: "pointer",
              minHeight: 44,
              transition: "opacity 0.15s ease",
            }}
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
          >
            <Trash2 size={16} />
            Delete my account
          </button>
          {showDeleteConfirm && (
            <div
              style={{
                background: "var(--color-red-soft)",
                borderRadius: 10,
                padding: 16,
                transition: "all 0.2s ease",
              }}
            >
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <AlertTriangle size={16} style={{ color: "var(--color-red-deep)" }} />
                <span style={{ fontWeight: 600, fontSize: 14, color: "var(--color-red-deep)" }}>
                  Are you sure?
                </span>
              </div>
              <p style={{ fontSize: 13, color: "var(--color-red-deep)", margin: "0 0 12px" }}>
                This action is permanent and cannot be undone. All your data, menu items, and order history will be deleted.
              </p>
              <div className="flex gap-2">
                <button
                  className="btn btn-ghost btn-sm"
                  style={{ minHeight: 44, transition: "all 0.15s ease" }}
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </button>
                <button
                  className="btn btn-sm"
                  style={{
                    minHeight: 44,
                    background: "var(--color-red-deep)",
                    color: "#fff",
                    border: "none",
                    opacity: 0.5,
                    cursor: "not-allowed",
                    transition: "all 0.15s ease",
                  }}
                  disabled
                >
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
