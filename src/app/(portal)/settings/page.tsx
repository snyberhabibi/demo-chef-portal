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
  const [phone, setPhone] = useState("(469) 277-0767");
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
    <div className="content-narrow section-stack">
      {/* Profile section */}
      <div className="section-stack" style={{ gap: 0 }}>
        {/* Avatar + Name */}
        <div className="flex items-center gap-4">
          <img
            src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop"
            alt="Profile"
            className="rounded-full object-cover"
            style={{ width: 64, height: 64 }}
          />
          <div>
            <button className="btn btn-ghost btn-sm">Change photo</button>
          </div>
        </div>

        <div className="divider" style={{ margin: "20px 0" }} />

        {/* Name */}
        <div>
          <label className="field-label">Full Name</label>
          <input className="input" defaultValue="Amira Haddad" />
        </div>

        <div className="divider" style={{ margin: "20px 0" }} />

        {/* Email */}
        <div>
          <label className="field-label">Email</label>
          <div className="flex items-center gap-2">
            <input
              className="input"
              defaultValue="amira@yallakitchen.com"
              readOnly
              style={{ background: "var(--color-cream-sunken)", color: "var(--color-brown-soft)" }}
            />
            <span className="pill pill-sage" style={{ flexShrink: 0 }}>Verified</span>
          </div>
        </div>

        <div className="divider" style={{ margin: "20px 0" }} />

        {/* Phone */}
        <div>
          <label className="field-label">Phone</label>
          <div className="flex items-center gap-2">
            <input
              className="input"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              readOnly={!phoneEditing}
              style={{ background: phoneEditing ? "white" : "var(--color-cream-sunken)" }}
            />
            <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }} onClick={() => setPhoneEditing(!phoneEditing)}>
              {phoneEditing ? (<><Check size={14} style={{ color: "var(--color-sage)" }} /> Save</>) : "Change"}
            </button>
          </div>
        </div>
      </div>

      <div className="divider" />

      {/* Notifications */}
      <div>
        <div className="heading-sm" style={{ marginBottom: 4 }}>Notifications</div>
        <p className="body-sm" style={{ margin: "0 0 16px" }}>Choose how you want to be notified</p>

        {/* Channel headers */}
        <div className="flex items-center" style={{ padding: "8px 0", borderBottom: "1px solid rgba(51,31,46,0.06)" }}>
          <span style={{ flex: 1 }} />
          {CHANNELS.map((ch) => (
            <span key={ch} className="eyebrow" style={{ width: 64, textAlign: "center" }}>{ch}</span>
          ))}
        </div>

        {NOTIF_CATEGORIES.map((cat, i) => (
          <div key={cat.label}>
            {i > 0 && <div className="divider" />}
            <div className="flex items-center" style={{ padding: "14px 0" }}>
              <div style={{ flex: 1 }}>
                <div className="heading-sm" style={{ fontSize: 14 }}>{cat.label}</div>
                <div className="caption">{cat.desc}</div>
              </div>
              {CHANNELS.map((ch) => (
                <div key={ch} style={{ width: 64, display: "flex", justifyContent: "center" }}>
                  <button
                    className={`toggle ${notifs[cat.label][ch] ? "is-on" : ""}`}
                    onClick={() => toggleNotif(cat.label, ch)}
                    style={{ transform: "scale(0.85)" }}
                  >
                    <span className="toggle-thumb" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="divider" />

      {/* Co-pilot */}
      <button
        className="flex items-center justify-between w-full text-left"
        style={{ background: "none", border: "none", padding: "4px 0", cursor: "pointer" }}
        onClick={() => setShowInvite(!showInvite)}
      >
        <div className="flex items-center gap-3">
          <div
            className="flex items-center justify-center"
            style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-cream-sunken)" }}
          >
            <UserPlus size={18} style={{ color: "var(--color-brown-soft)" }} />
          </div>
          <div>
            <div className="heading-sm" style={{ fontSize: 14 }}>Invite a co-pilot</div>
            <div className="body-sm">Add a partner to manage your store</div>
          </div>
        </div>
        <ChevronRight
          size={18}
          style={{
            color: "var(--color-brown-soft-2)",
            transform: showInvite ? "rotate(90deg)" : "none",
            transition: `transform var(--t-fast) var(--ease-spring)`,
          }}
        />
      </button>
      {showInvite && (
        <div style={{ padding: "12px 0 0 52px" }}>
          <p className="body-sm" style={{ margin: "0 0 12px" }}>
            Co-pilot invitations coming soon. You will be able to share store access with a trusted partner.
          </p>
          <button className="btn btn-ghost btn-sm" style={{ opacity: 0.5, cursor: "not-allowed" }} disabled>Send Invite</button>
        </div>
      )}

      <div className="divider" />

      {/* Security */}
      <div>
        <div className="heading-sm" style={{ marginBottom: 12 }}>Security</div>

        <button
          className="flex items-center justify-between w-full text-left"
          style={{ padding: "14px 0", background: "none", border: "none", cursor: "pointer" }}
          onClick={() => setPasswordOpen(!passwordOpen)}
        >
          <div className="flex items-center gap-3">
            <Shield size={18} style={{ color: "var(--color-brown-soft)" }} />
            <span className="body" style={{ fontWeight: 500 }}>Change password</span>
          </div>
          <ChevronDown
            size={16}
            style={{
              color: "var(--color-brown-soft-2)",
              transform: passwordOpen ? "rotate(180deg)" : "none",
              transition: `transform var(--t-fast) var(--ease-spring)`,
            }}
          />
        </button>

        {passwordOpen && (
          <div style={{ padding: "0 0 14px 30px" }}>
            <div style={{ marginBottom: 12 }}>
              <label className="field-label" style={{ fontSize: 12 }}>Current Password</label>
              <input type="password" className="input" placeholder="Enter current password" />
            </div>
            <div style={{ marginBottom: 12 }}>
              <label className="field-label" style={{ fontSize: 12 }}>New Password</label>
              <input type="password" className="input" placeholder="Enter new password" />
            </div>
            <button className="btn btn-dark btn-sm">Update Password</button>
          </div>
        )}

        <div className="divider" />

        <div className="flex items-center justify-between w-full" style={{ padding: "14px 0" }}>
          <div className="flex items-center gap-3">
            <Shield size={18} style={{ color: "var(--color-brown-soft)" }} />
            <div>
              <span className="body" style={{ fontWeight: 500 }}>Two-factor authentication</span>
              <div className="caption">Not enabled</div>
            </div>
          </div>
          <button className="btn btn-ghost btn-sm">Set up</button>
        </div>
      </div>

      <div className="divider" />

      {/* Danger zone - minimal, caption red text, no separate card */}
      <div>
        <div className="caption" style={{ color: "var(--color-red)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>
          Danger Zone
        </div>
        <div className="flex flex-col gap-2">
          <Link
            href="/login"
            className="flex items-center gap-2 body"
            style={{ fontWeight: 500, color: "var(--color-brown-soft)", padding: "8px 0" }}
          >
            <LogOut size={16} />
            Log out
          </Link>
          <button
            className="flex items-center gap-2 body"
            style={{ background: "none", border: "none", fontWeight: 500, color: "var(--color-red)", padding: "8px 0", cursor: "pointer" }}
            onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}
          >
            <Trash2 size={16} />
            Delete my account
          </button>
          {showDeleteConfirm && (
            <div style={{ borderLeft: "3px solid var(--color-red)", borderRadius: 8, padding: "14px 16px", marginTop: 4 }}>
              <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
                <AlertTriangle size={16} style={{ color: "var(--color-red-deep)" }} />
                <span className="heading-sm" style={{ fontSize: 14, color: "var(--color-red-deep)" }}>Are you sure?</span>
              </div>
              <p className="body-sm" style={{ color: "var(--color-red-deep)", margin: "0 0 12px" }}>
                This action is permanent and cannot be undone. All your data, menu items, and order history will be deleted.
              </p>
              <div className="flex gap-2">
                <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                <button
                  className="btn btn-sm"
                  style={{ background: "var(--color-red-deep)", color: "#fff", border: "none", opacity: 0.5, cursor: "not-allowed" }}
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
