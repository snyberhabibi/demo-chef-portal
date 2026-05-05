"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Copy, Edit3, Clock, Check } from "lucide-react";

export default function PickupAddressPage() {
  const [copied, setCopied] = useState(false);
  const [editingAddress, setEditingAddress] = useState(false);
  const [editingInstructions, setEditingInstructions] = useState(false);

  const [address, setAddress] = useState("2847 Elm Street, Dallas, TX 75226");
  const [instructions, setInstructions] = useState(
    "Ring doorbell at the side gate. Orders are placed on the table by the front door. Please bring your own bags for larger orders."
  );

  const handleCopy = () => {
    navigator.clipboard.writeText(address);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="section-stack" style={{ maxWidth: 560 }}>
      {/* Map placeholder */}
      <div
        className="flex items-center justify-center"
        style={{
          height: 220,
          borderRadius: 16,
          background: "var(--color-cream-deep)",
          border: "1px solid var(--color-cream-sunken)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Grid pattern to suggest a map */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "linear-gradient(rgba(51,31,46,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(51,31,46,0.04) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Pin marker */}
        <div className="flex flex-col items-center" style={{ position: "relative", zIndex: 1 }}>
          <div
            className="flex items-center justify-center"
            style={{
              width: 44,
              height: 44,
              borderRadius: "50%",
              background: "var(--color-red)",
              boxShadow: "0 4px 16px rgba(229,65,65,0.35)",
            }}
          >
            <MapPin size={22} style={{ color: "#fff" }} />
          </div>
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "6px solid transparent",
              borderRight: "6px solid transparent",
              borderTop: "8px solid var(--color-red)",
              marginTop: -1,
            }}
          />
        </div>
      </div>

      {/* Address card */}
      <div className="card">
        <div className="flex items-center justify-between" style={{ marginBottom: 10 }}>
          <div className="eyebrow">Pickup Address</div>
          <span className="pill pill-sage" style={{ fontSize: 11 }}>Primary</span>
        </div>
        {editingAddress ? (
          <div>
            <input
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ minHeight: 44, marginBottom: 10 }}
            />
            <button
              className="btn btn-red btn-sm"
              style={{ minHeight: 44 }}
              onClick={() => setEditingAddress(false)}
            >
              <Check size={14} />
              Save
            </button>
          </div>
        ) : (
          <>
            <div style={{ fontSize: 16, fontWeight: 600, lineHeight: 1.4 }}>
              {address}
            </div>
            <div className="flex gap-2" style={{ marginTop: 14 }}>
              <button
                className="btn btn-ghost btn-sm"
                style={{ minHeight: 44 }}
                onClick={handleCopy}
              >
                {copied ? <Check size={14} style={{ color: "var(--color-sage)" }} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button
                className="btn btn-ghost btn-sm"
                style={{ minHeight: 44 }}
                onClick={() => setEditingAddress(true)}
              >
                <Edit3 size={14} />
                Edit Address
              </button>
            </div>
          </>
        )}
      </div>

      {/* Pickup instructions */}
      <div className="card">
        <div className="eyebrow" style={{ marginBottom: 10 }}>Pickup Instructions</div>
        {editingInstructions ? (
          <div>
            <textarea
              className="textarea"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              style={{ minHeight: 100, marginBottom: 10 }}
            />
            <button
              className="btn btn-red btn-sm"
              style={{ minHeight: 44 }}
              onClick={() => setEditingInstructions(false)}
            >
              <Check size={14} />
              Save
            </button>
          </div>
        ) : (
          <>
            <p style={{ fontSize: 14, lineHeight: 1.6, color: "var(--color-brown-soft)", margin: 0 }}>
              {instructions}
            </p>
            <button
              className="btn btn-ghost btn-sm"
              style={{ marginTop: 12, minHeight: 44 }}
              onClick={() => setEditingInstructions(true)}
            >
              <Edit3 size={14} />
              Edit instructions
            </button>
          </>
        )}
      </div>

      {/* Pickup hours info */}
      <div
        className="flex items-start gap-3"
        style={{
          background: "var(--color-cream-deep)",
          borderRadius: 12,
          padding: 16,
        }}
      >
        <Clock size={18} style={{ color: "var(--color-brown-soft)", marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 500, fontSize: 14 }}>
            Pickup hours follow your store schedule
          </div>
          <div style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 2 }}>
            Customers can only schedule pickups during your active operating hours.{" "}
            <Link
              href="/operations"
              style={{ color: "var(--color-red)", fontWeight: 500, textDecoration: "none" }}
            >
              Manage hours &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
