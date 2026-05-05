"use client";

import { useState } from "react";
import { CreditCard, CheckCircle, AlertTriangle, ChevronDown, ArrowRight, ExternalLink, Shield, Zap, Eye } from "lucide-react";

type StripeState = "A" | "B" | "C";

const FAQ_ITEMS = [
  { q: "When do I get paid?", a: "Payouts are processed every Friday for all orders completed through Sunday." },
  { q: "What are the fees?", a: "Yalla Bites charges 10% per order. Stripe charges 2.9% + $0.30 per transaction." },
  { q: "Can I use my existing Stripe account?", a: "Yes! If you already have a Stripe account, we'll link it during the connection process." },
];

const TRANSACTIONS = [
  { date: "May 2, 2026", desc: "Order #1042 - Sarah K.", amount: "+$48.00", type: "order" },
  { date: "May 1, 2026", desc: "Order #1041 - Marcus T.", amount: "+$36.00", type: "order" },
  { date: "Apr 30, 2026", desc: "Weekly payout", amount: "-$342.00", type: "payout" },
  { date: "Apr 29, 2026", desc: "Platform fee - Week of Apr 21", amount: "-$18.40", type: "fee" },
  { date: "Apr 28, 2026", desc: "Order #1038 - Priya R.", amount: "+$64.00", type: "order" },
];

const INFO_BLOCKS = [
  { icon: Shield, title: "Secure Payments", desc: "Bank-level encryption protects every transaction. PCI-DSS Level 1 certified." },
  { icon: Zap, title: "Fast Payouts", desc: "Get paid weekly, every Friday. Express payouts available for instant access." },
  { icon: Eye, title: "Transparent Fees", desc: "10% platform fee + standard Stripe processing. No hidden charges." },
];

export default function PaymentsPage() {
  const [state, setState] = useState<StripeState>("A");
  const [faqOpen, setFaqOpen] = useState<number | null>(null);

  return (
    <div className="section-stack" style={{ maxWidth: 560 }}>
      {/* State toggle */}
      <div className="flex gap-2">
        {(["A", "B", "C"] as StripeState[]).map((s) => (
          <button
            key={s}
            className={`btn btn-sm ${state === s ? "btn-red" : "btn-ghost"}`}
            style={{ minHeight: 44, transition: "all 0.15s ease" }}
            onClick={() => setState(s)}
          >
            State {s}
          </button>
        ))}
      </div>

      {/* State A: Not connected */}
      {state === "A" && (
        <>
          <div className="card-cream" style={{ textAlign: "center", padding: 32 }}>
            <div className="fraunces" style={{ fontSize: 28, marginBottom: 8 }}>
              Get paid for your cooking
            </div>
            <p style={{ fontSize: 14, color: "var(--color-brown-soft)", maxWidth: 380, margin: "0 auto 28px" }}>
              Connect your bank account through Stripe to receive payouts for every order.
            </p>

            {/* 3-step visual */}
            <div className="flex items-center justify-center gap-0" style={{ marginBottom: 28 }}>
              {[
                { num: 1, label: "Connect Stripe" },
                { num: 2, label: "Verify identity" },
                { num: 3, label: "Start earning" },
              ].map((step, i) => (
                <div key={step.num} className="flex items-center">
                  {i > 0 && (
                    <div
                      style={{
                        width: 40,
                        height: 2,
                        background: "var(--color-cream-sunken)",
                      }}
                    />
                  )}
                  <div className="flex flex-col items-center gap-2">
                    <div
                      className="flex items-center justify-center"
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: "50%",
                        background: "var(--color-cream-sunken)",
                        fontSize: 15,
                        fontWeight: 700,
                        color: "var(--color-brown-soft)",
                      }}
                    >
                      {step.num}
                    </div>
                    <span style={{ fontSize: 12, fontWeight: 500, color: "var(--color-brown-soft)", whiteSpace: "nowrap" }}>
                      {step.label}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            <button
              className="btn btn-red btn-block btn-lg"
              style={{ minHeight: 48, transition: "all 0.15s ease" }}
              onClick={() => setState("C")}
            >
              <CreditCard size={18} />
              Connect with Stripe
            </button>
          </div>

          {/* About Stripe Connect */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(150px, 1fr))",
              gap: 12,
            }}
          >
            {INFO_BLOCKS.map((block) => {
              const Icon = block.icon;
              return (
                <div key={block.title} className="card" style={{ padding: 16, textAlign: "center" }}>
                  <div
                    className="flex items-center justify-center"
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 10,
                      background: "var(--color-cream-sunken)",
                      margin: "0 auto 10px",
                    }}
                  >
                    <Icon size={20} style={{ color: "var(--color-brown-soft)" }} />
                  </div>
                  <div style={{ fontWeight: 600, fontSize: 14, marginBottom: 4 }}>{block.title}</div>
                  <div style={{ fontSize: 12, lineHeight: 1.5, color: "var(--color-brown-soft)" }}>{block.desc}</div>
                </div>
              );
            })}
          </div>

          {/* FAQ */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "16px 20px 0", fontWeight: 600, fontSize: 15 }}>
              Frequently Asked Questions
            </div>
            {FAQ_ITEMS.map((item, i) => (
              <div key={i} style={{ borderTop: i > 0 ? "1px solid var(--color-cream-sunken)" : undefined }}>
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
                    minHeight: 48,
                    transition: "background 0.1s ease",
                  }}
                  onClick={() => setFaqOpen(faqOpen === i ? null : i)}
                >
                  {item.q}
                  <ChevronDown
                    size={16}
                    style={{
                      color: "var(--color-brown-soft-2)",
                      transform: faqOpen === i ? "rotate(180deg)" : "none",
                      transition: "transform 0.2s ease",
                      flexShrink: 0,
                    }}
                  />
                </button>
                {faqOpen === i && (
                  <div style={{ padding: "0 20px 14px", fontSize: 13, color: "var(--color-brown-soft)", lineHeight: 1.6 }}>
                    {item.a}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}

      {/* State B: Needs more info */}
      {state === "B" && (
        <div
          style={{
            background: "var(--color-orange-soft)",
            borderRadius: 12,
            padding: 20,
            transition: "all 0.2s ease",
          }}
        >
          <div className="flex items-center gap-2 mb-3">
            <AlertTriangle size={20} style={{ color: "var(--color-orange-text)" }} />
            <span style={{ fontWeight: 600, color: "var(--color-orange-text)", fontSize: 15 }}>
              Stripe needs more information
            </span>
          </div>
          <p style={{ fontSize: 14, color: "var(--color-orange-text)", opacity: 0.85, marginBottom: 16 }}>
            Complete the following to start receiving payouts:
          </p>
          <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
            {[
              "Verify your identity (government-issued ID)",
              "Add your bank account or debit card",
              "Confirm your business address",
            ].map((item, i) => (
              <li
                key={i}
                className="flex items-start gap-2"
                style={{
                  padding: "8px 0",
                  borderTop: i > 0 ? "1px solid rgba(122,74,14,0.12)" : undefined,
                }}
              >
                <div
                  className="flex items-center justify-center tnum"
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: "rgba(122,74,14,0.15)",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "var(--color-orange-text)",
                    flexShrink: 0,
                    marginTop: 1,
                  }}
                >
                  {i + 1}
                </div>
                <span style={{ fontSize: 14, color: "var(--color-orange-text)" }}>{item}</span>
              </li>
            ))}
          </ul>
          <button
            className="btn btn-amber btn-block"
            style={{ marginTop: 16, minHeight: 44, transition: "all 0.15s ease" }}
            onClick={() => setState("C")}
          >
            Continue Setup
            <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* State C: Connected */}
      {state === "C" && (
        <>
          <div className="card" style={{ textAlign: "center", padding: 24 }}>
            <div className="flex items-center justify-center gap-2 mb-3">
              <CheckCircle size={20} style={{ color: "var(--color-sage)" }} />
              <span className="pill pill-sage">Stripe Connected</span>
            </div>
            <div className="fraunces" style={{ fontSize: 42, lineHeight: 1, margin: "16px 0 4px" }}>
              $2,184.50
            </div>
            <div style={{ fontSize: 14, color: "var(--color-brown-soft)" }}>
              Total earnings
            </div>
          </div>

          <div className="card flex items-center justify-between">
            <div>
              <div className="eyebrow" style={{ marginBottom: 4 }}>Next Payout</div>
              <div className="fraunces tnum" style={{ fontSize: 22 }}>$342.00</div>
              <div style={{ fontSize: 13, color: "var(--color-brown-soft)", marginTop: 2 }}>
                Arriving Friday, May 9
              </div>
            </div>
            <div
              className="flex items-center justify-center"
              style={{
                width: 48,
                height: 48,
                borderRadius: 12,
                background: "var(--color-sage-soft)",
              }}
            >
              <CreditCard size={22} style={{ color: "var(--color-sage-deep)" }} />
            </div>
          </div>

          <div className="card">
            <div className="flex items-center justify-between">
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Bank Account</div>
                <div className="mono" style={{ fontSize: 14, color: "var(--color-brown-soft)", marginTop: 2 }}>
                  Chase ****4829
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" style={{ minHeight: 44 }}>
                Manage
              </button>
            </div>
          </div>

          {/* Transaction history */}
          <div className="card" style={{ padding: 0 }}>
            <div style={{ padding: "16px 20px", fontWeight: 600, fontSize: 15 }}>
              Recent Transactions
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
                <thead>
                  <tr style={{ borderTop: "1px solid var(--color-cream-sunken)", borderBottom: "1px solid var(--color-cream-sunken)" }}>
                    <th className="eyebrow" style={{ padding: "10px 20px", textAlign: "left", fontWeight: 600 }}>Date</th>
                    <th className="eyebrow" style={{ padding: "10px 12px", textAlign: "left", fontWeight: 600 }}>Description</th>
                    <th className="eyebrow" style={{ padding: "10px 20px", textAlign: "right", fontWeight: 600 }}>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {TRANSACTIONS.map((tx, i) => (
                    <tr key={i} style={{ borderTop: i > 0 ? "1px solid var(--color-cream-sunken)" : undefined }}>
                      <td className="tnum" style={{ padding: "12px 20px", color: "var(--color-brown-soft)", whiteSpace: "nowrap" }}>
                        {tx.date}
                      </td>
                      <td style={{ padding: "12px 12px" }}>
                        <div className="flex items-center gap-2">
                          <span>{tx.desc}</span>
                          <span
                            className="pill"
                            style={{
                              fontSize: 10,
                              padding: "2px 6px",
                              background:
                                tx.type === "order" ? "var(--color-sage-soft)" :
                                tx.type === "payout" ? "var(--color-cream-sunken)" :
                                "var(--color-orange-soft)",
                              color:
                                tx.type === "order" ? "var(--color-sage-deep)" :
                                tx.type === "payout" ? "var(--color-brown-soft)" :
                                "var(--color-orange-text)",
                            }}
                          >
                            {tx.type}
                          </span>
                        </div>
                      </td>
                      <td
                        className="tnum"
                        style={{
                          padding: "12px 20px",
                          textAlign: "right",
                          fontWeight: 600,
                          color: tx.amount.startsWith("+") ? "var(--color-sage-deep)" : "var(--color-brown-soft)",
                        }}
                      >
                        {tx.amount}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <a
            href="#"
            className="card flex items-center justify-between"
            style={{ textDecoration: "none", color: "inherit" }}
          >
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>Stripe Dashboard</div>
              <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                View full transaction history and settings
              </div>
            </div>
            <ExternalLink size={18} style={{ color: "var(--color-brown-soft-2)", flexShrink: 0 }} />
          </a>
        </>
      )}
    </div>
  );
}
