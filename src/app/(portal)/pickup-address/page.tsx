"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { MapPin, Copy, Edit3, Clock, Check } from "lucide-react";

export default function PickupAddressPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

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

  if (!loaded) {
    return (
      <div className="content-narrow section-stack">
        <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
        <div className="skeleton" style={{ height: 100, borderRadius: 16 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 16 }} />
      </div>
    );
  }

  return (
    <div className="content-narrow section-stack">
      {/* Map placeholder - rounded-xl, 200px, cream-deep bg with grid */}
      <div
        className="flex items-center justify-center"
        style={{
          height: 200,
          borderRadius: 16,
          background: "var(--color-cream-deep)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Subtle grid pattern */}
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
              width: 40,
              height: 40,
              borderRadius: "50%",
              background: "var(--color-red)",
              boxShadow: "0 4px 16px rgba(229,65,65,0.35)",
            }}
          >
            <MapPin size={20} style={{ color: "#fff" }} />
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
          <span className="heading-sm">Pickup Address</span>
          <span className="pill pill-sage" style={{ fontSize: 11 }}>Primary</span>
        </div>
        {editingAddress ? (
          <div>
            <input
              className="input"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              style={{ marginBottom: 10 }}
            />
            <button className="btn btn-dark btn-sm" onClick={() => setEditingAddress(false)}>
              <Check size={14} /> Save
            </button>
          </div>
        ) : (
          <>
            <div className="body" style={{ fontWeight: 600, lineHeight: 1.4 }}>{address}</div>
            <div className="flex gap-2" style={{ marginTop: 14 }}>
              <button className="btn btn-ghost btn-sm" onClick={handleCopy}>
                {copied ? <Check size={14} style={{ color: "var(--color-sage)" }} /> : <Copy size={14} />}
                {copied ? "Copied" : "Copy"}
              </button>
              <button className="btn btn-ghost btn-sm" onClick={() => setEditingAddress(true)}>
                <Edit3 size={14} /> Edit Address
              </button>
            </div>
          </>
        )}
      </div>

      {/* Pickup instructions */}
      <div className="card">
        <div className="heading-sm" style={{ marginBottom: 10 }}>Pickup Instructions</div>
        {editingInstructions ? (
          <div>
            <textarea
              className="textarea"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              rows={4}
              style={{ marginBottom: 10 }}
            />
            <button className="btn btn-dark btn-sm" onClick={() => setEditingInstructions(false)}>
              <Check size={14} /> Save
            </button>
          </div>
        ) : (
          <>
            <p className="body-sm" style={{ margin: 0 }}>{instructions}</p>
            <button className="btn btn-ghost btn-sm" style={{ marginTop: 12 }} onClick={() => setEditingInstructions(true)}>
              <Edit3 size={14} /> Edit instructions
            </button>
          </>
        )}
      </div>

      {/* Pickup hours info */}
      <div
        className="flex items-start gap-3"
        style={{ borderLeft: "3px solid var(--color-brown-soft-2)", borderRadius: 8, padding: "14px 16px" }}
      >
        <Clock size={18} style={{ color: "var(--color-brown-soft)", marginTop: 1, flexShrink: 0 }} />
        <div>
          <div className="body" style={{ fontWeight: 500 }}>Pickup hours follow your store schedule</div>
          <div className="body-sm" style={{ marginTop: 2 }}>
            Customers can only schedule pickups during your active operating hours.{" "}
            <Link href="/operations" style={{ color: "var(--color-red)", fontWeight: 500 }}>
              Manage hours &rarr;
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
