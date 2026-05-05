"use client";

import { useState, useEffect } from "react";
import { CreditCard, CheckCircle, AlertTriangle, ChevronDown, ArrowRight, ExternalLink, Shield, Zap, Eye } from "lucide-react";
import { transactions as TRANSACTIONS } from "@/lib/mock-data";

type StripeState = "A" | "B" | "C";

const FAQ_ITEMS = [
  { q: "When do I get paid?", a: "Payouts are processed every Friday for all orders completed through Sunday." },
  { q: "What are the fees?", a: "Yalla Bites charges 10% per order. Stripe charges 2.9% + $0.30 per transaction." },
  { q: "Can I use my existing Stripe account?", a: "Yes! If you already have a Stripe account, we'll link it during the connection process." },
];

const INFO_BLOCKS = [
  { icon: Shield, title: "Secure Payments", desc: "Bank-level encryption protects every transaction. PCI-DSS Level 1 certified." },
  { icon: Zap, title: "Fast Payouts", desc: "Get paid weekly, every Friday. Express payouts available for instant access." },
  { icon: Eye, title: "Transparent Fees", desc: "10% platform fee + standard Stripe processing. No hidden charges." },
];

export default function PaymentsPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  const [state, setState] = useState<StripeState>("A");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  if (!loaded) {
    return (
      <div className="content-narrow section-stack">
        <div className="skeleton" style={{ height: 200, borderRadius: 16 }} />
        <div className="grid grid-cols-3 gap-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="skeleton" style={{ height: 100, borderRadius: 16 }} />
          ))}
        </div>
        <div className="skeleton" style={{ height: 160, borderRadius: 16 }} />
      </div>
    );
  }

  return (
    <div className="content-narrow section-stack">
      {/* State toggle */}
      <div style={{ display: "inline-flex", gap: 4, alignItems: "center" }}>
        <span className="caption" style={{ fontWeight: 600, marginRight: 4 }}>Demo:</span>
        {(["A", "B", "C"] as StripeState[]).map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${state === s ? "btn-dark" : "btn-ghost"}`}
            style={{ fontSize: 12 }}
            onClick={() => setState(s)}
          >
            {s === "A" ? "Not connected" : s === "B" ? "Needs info" : "Connected"}
          </button>
        ))}
      </div>

      {/* State A: Not connected */}
      {state === "A" && (
        <>
          <div className="card-cream" style={{ textAlign: "center", padding: 32 }}>
            <div className="heading-lg" style={{ fontSize: 24, marginBottom: 8 }}>
              Get paid for your cooking
            </div>
            <p className="body-sm" style={{ maxWidth: 380, margin: "0 auto 28px" }}>
              Connect your bank account through Stripe to receive payouts for every order.
            </p>

            {/* 3-step visual */}
            <div className="flex items-center justify-center" style={{ marginBottom: 28 }}>
              {[
                { num: 1, label: "Connect Stripe" },
                { num: 2, label: "Verify identity" },
                { num: 3, label: "Start earning" },
              ].map((step, i) => (
                <div key={step.num} className="flex items-center">
                  {i > 0 && (
                    <div className="w-6 sm:w-10" style={{ height: 1.5, background: "var(--color-cream-sunken)" }} />
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="flex items-center justify-center tnum w-6 h-6 sm:w-7 sm:h-7"
                      style={{
                        borderRadius: "50%",
                        background: "var(--color-cream-sunken)",
                        fontSize: 13,
                        fontWeight: 700,
                        color: "var(--color-brown-soft)",
                      }}
                    >
                      {step.num}
                    </div>
                    <span className="caption" style={{ fontWeight: 500, whiteSpace: "nowrap" }}>
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn btn-gradient btn-block btn-lg"
              onClick={() => setState("C")}
            >
              <CreditCard size={18} />
              Connect with Stripe
            </button>
          </div>

          {/* Info blocks */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))", gap: 12 }}>
            {INFO_BLOCKS.map((block) => {
              const Icon = block.icon;
              return (
                <div key={block.title} className="card" style={{ padding: 16, textAlign: "center" }}>
                  <div
                    className="flex items-center justify-center"
                    style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-cream-sunken)", margin: "0 auto 10px" }}
                  >
                    <Icon size={20} style={{ color: "var(--color-brown-soft)" }} />
                  </div>
                  <div className="heading-sm" style={{ fontSize: 14, marginBottom: 4 }}>{block.title}</div>
                  <div className="caption" style={{ lineHeight: 1.5 }}>{block.desc}</div>
                </div>
              );
            })}
          </div>

          {/* FAQ accordion */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "16px 20px 12px" }}>
              <span className="heading-sm">Frequently Asked Questions</span>
            </div>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i}>
                <div className="divider" />
                <button
                  className="flex items-center justify-between w-full text-left"
                  style={{
                    padding: "14px 20px",
                    background: "none",
                    border: "none",
                    fontSize: 14,
                    fontWeight: 500,
                    color: "var(--color-brown)",
                    cursor: "pointer",
                    transition: `background var(--t-fast)`,
                  }}
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  {item.q}
                  <ChevronDown
                    size={16}
                    style={{
                      color: "var(--color-brown-soft-2)",
                      transform: faqOpen === i ? "rotate(180deg)" : "none",
                      transition: `transform var(--t-fast) var(--ease-spring)`,
                      flexShrink: 0,
                    }}
                  />
                </button>
                <div
                  style={{
                    overflow: "hidden",
                    transition: "max-height 0.3s ease, opacity 0.3s ease",
                    maxHeight: faqOpen === i ? 200 : 0,
                    opacity: faqOpen === i ? 1 : 0,
                  }}
                >
                  <div className="body-sm" style={{ padding: "0 20px 14px", lineHeight: 1.6 }}>
                    {item.a}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* State B: Needs more info */}
      {state === "B" && (
        <div style={{ borderLeft: "3px solid var(--color-orange)", borderRadius: 8, padding: "14px 16px" }}>
          <div className="flex items-center gap-2" style={{ marginBottom: 10 }}>
            <AlertTriangle size={18} style={{ color: "var(--color-orange)" }} />
            <span className="heading-sm" style={{ fontSize: 14, color: "var(--color-orange-text)" }}>
              Stripe needs more information
            </span>
          </div>
          <p className="body-sm" style={{ marginBottom: 14 }}>
            Complete the following to start receiving payouts:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Verify your identity (government-issued ID)",
              "Add your bank account or debit card",
              "Confirm your business address",
            ].map((item, i) => (
              <li key={i}>
                {i > 0 && <div className="divider" style={{ margin: "6px 0" }} />}
                <div className="flex items-start gap-2" style={{ padding: "4px 0" }}>
                  <div
                    className="flex items-center justify-center tnum"
                    style={{
                      width: 20, height: 20, borderRadius: "50%",
                      background: "rgba(252,157,53,0.15)", fontSize: 11,
                      fontWeight: 700, color: "var(--color-orange-text)",
                      flexShrink: 0, marginTop: 1,
                    }}
                  >
                    {i + 1}
                  </div>
                  <span className="body-sm">{item}</span>
                </div>
              </li>
            ))}
          </ul>
          <button className="btn btn-dark btn-block" style={{ marginTop: 16 }} onClick={() => setState("C")}>
            Continue Setup <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* State C: Connected */}
      {state === "C" && (
        <>
          <div className="card-gradient-border glow-sage" style={{ textAlign: "center", padding: 24 }}>
            <div className="flex items-center justify-center gap-2" style={{ marginBottom: 12 }}>
              <CheckCircle size={18} style={{ color: "var(--color-sage)" }} />
              <span className="pill pill-sage">Stripe Connected</span>
            </div>
            <div className="fraunces" style={{ fontSize: "clamp(28px, 7vw, 40px)", lineHeight: 1, margin: "12px 0 4px" }}>
              $2,184.50
            </div>
            <div className="body-sm">Total earnings</div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Next Payout</div>
              <div className="fraunces tnum" style={{ fontSize: 22 }}>$342.00</div>
              <div className="body-sm" style={{ marginTop: 2 }}>Arriving Friday, May 9</div>
            </div>
            <div
              className="flex items-center justify-center"
              style={{ width: 44, height: 44, borderRadius: 12, background: "var(--color-sage-soft)" }}
            >
              <CreditCard size={20} style={{ color: "var(--color-sage-deep)" }} />
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <div className="heading-sm" style={{ fontSize: 14 }}>Bank Account</div>
              <div className="mono" style={{ color: "var(--color-brown-soft)", marginTop: 2 }}>Chase ****4829</div>
            </div>
            <button className="btn btn-ghost btn-sm">Manage</button>
          </div>

          {/* Transaction history */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "16px 20px" }}>
              <span className="heading-sm">Recent Transactions</span>
            </div>
            {TRANSACTIONS.map((tx, i) => (
              <div key={i}>
                <div className="divider" />
                <div className="flex items-center gap-3 text-[12px] sm:text-[13px]" style={{ padding: "12px 20px" }}>
                  <span className="tnum caption" style={{ minWidth: 90, whiteSpace: "nowrap" }}>{tx.date}</span>
                  <div className="flex-1 flex items-center gap-2 min-w-0">
                    <span className="body-sm truncate" style={{ color: "var(--color-brown)" }}>{tx.desc}</span>
                    <span className={`pill ${tx.type === "order" ? "pill-sage" : tx.type === "payout" ? "pill-mute" : "pill-orange"}`} style={{ fontSize: 10, padding: "2px 6px" }}>
                      {tx.type}
                    </span>
                  </div>
                  <span
                    className="tnum body"
                    style={{
                      fontWeight: 600,
                      color: tx.amount.startsWith("+") ? "var(--color-sage-deep)" : "var(--color-brown-soft)",
                    }}
                  >
                    {tx.amount}
                  </span>
                </div>
              </div>
            ))}
          </div>

          <a href="https://dashboard.stripe.com" target="_blank" rel="noopener noreferrer" className="card card-hover flex items-center justify-between" style={{ textDecoration: "none", color: "inherit" }}>
            <div>
              <div className="heading-sm" style={{ fontSize: 14 }}>Stripe Dashboard</div>
              <div className="body-sm">View full transaction history and settings</div>
            </div>
            <ExternalLink size={18} style={{ color: "var(--color-brown-soft-2)", flexShrink: 0 }} />
          </a>
        </>
      )}
    </div>
  );
}
