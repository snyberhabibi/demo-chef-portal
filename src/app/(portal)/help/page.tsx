"use client";

import { useState, useEffect } from "react";
import {
  ClipboardList,
  Layers,
  Package,
  Tag,
  List,
  User,
  Settings as SettingsIcon,
  MapPin,
  ArrowRight,
  CheckCircle,
  ChevronDown,
  Mail,
  Phone,
  MessageCircle,
  Headphones,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { useDesignMode } from "@/lib/design-mode";

/* ------------------------------------------------------------------ */
/*  Tutorial data (same as Settings page)                              */
/* ------------------------------------------------------------------ */
const TUTORIALS = [
  { icon: ClipboardList, title: "Managing Orders", desc: "Learn how to accept, prepare, and complete customer orders efficiently.", steps: 14, completed: true },
  { icon: Layers, title: "Creating Dishes", desc: "Add dishes with photos, descriptions, pricing, and modifiers.", steps: 12, completed: false },
  { icon: Package, title: "Creating Bundles", desc: "Combine dishes into bundles with special pricing for families and groups.", steps: 10, completed: true },
  { icon: Tag, title: "Modifier Groups", desc: "Set up spice levels, sizes, add-ons, and other customization options.", steps: 6, completed: false },
  { icon: List, title: "Custom Menu Sections", desc: "Organize your menu with custom categories and featured sections.", steps: 7, completed: false },
  { icon: User, title: "Chef Profile", desc: "Set up your profile, bio, cuisines, and branding to attract customers.", steps: 10, completed: false },
  { icon: SettingsIcon, title: "Account Settings", desc: "Manage notifications, security, co-pilot access, and account preferences.", steps: 7, completed: true },
  { icon: MapPin, title: "Address Management", desc: "Set your pickup address, instructions, and operating zone.", steps: 6, completed: false },
];

/* ------------------------------------------------------------------ */
/*  FAQ data                                                           */
/* ------------------------------------------------------------------ */
const FAQS = [
  {
    q: "How do I create my first dish?",
    a: "Go to Menu from the sidebar, then click Create New Dish. Fill in the name, price, description, and upload a photo. Choose your category and cuisine, set pricing and portion sizes, then hit Publish.",
  },
  {
    q: "How do Flash Sales work?",
    a: "Flash Sales follow the drop model: you set a menu with special pricing, open an order window for a limited time, customers place their orders before it closes, then you prep and fulfill everything at once. Go to Flash Sales to create one.",
  },
  {
    q: "When do I get paid?",
    a: "After an order is fulfilled, your payout is calculated (order total minus the 10% platform fee and Stripe processing). Payouts are processed weekly every Friday and deposited into your connected bank account.",
  },
  {
    q: "Can I change an order after it's confirmed?",
    a: "Once an order is confirmed, it cannot be modified. However, you can contact the customer directly through the order detail page using the phone or email buttons to discuss any changes.",
  },
  {
    q: "How do I set my availability?",
    a: "Go to Operations from the sidebar. You can set your weekly hours for each day, add time off for vacations, and create date overrides for special hours on specific dates like holidays.",
  },
  {
    q: "What if I need to cancel an order?",
    a: "Open the order from the Orders page, scroll down to the bottom of the order detail, and tap Cancel Order. You will be asked to confirm before the cancellation is processed.",
  },
  {
    q: "How do I edit my menu?",
    a: "Go to Menu and click on any dish card to open it in edit mode. You can also use the three-dot menu on each dish card for quick actions like Archive or Delete.",
  },
  {
    q: "Can customers leave reviews?",
    a: "Yes, customers can leave reviews after their order is fulfilled. You can view and reply to all reviews from the Reviews page in your sidebar. Responding to reviews helps build trust with future customers.",
  },
];

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export default function HelpPage() {
  const { mode } = useDesignMode();
  const isB = mode === "b";

  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  const { toast } = useToast();
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const completedCount = TUTORIALS.filter((t) => t.completed).length;
  const totalCount = TUTORIALS.length;
  const progressPct = (completedCount / totalCount) * 100;

  if (!loaded) {
    return (
      <div className="content-narrow section-stack">
        <div className="skeleton" style={{ height: 40, borderRadius: 10 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 16 }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 120, borderRadius: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="content-narrow section-stack page-enter">
      {/* ================================================================ */}
      {/*  Section 1: Getting Started Tutorials                            */}
      {/* ================================================================ */}
      <div>
        <div className={`heading-lg${isB ? " heading-gradient" : ""}`} style={{ marginBottom: 4 }}>Getting Started</div>
        <p className="body-sm" style={{ margin: "0 0 16px" }}>
          Step-by-step guides to help you get the most out of your chef portal.
        </p>

        {/* Progress bar */}
        <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
          <span className="body" style={{ fontWeight: 600 }}>
            {completedCount} of {totalCount} tutorials completed
          </span>
          <span className="tnum caption">{Math.round(progressPct)}%</span>
        </div>
        <div style={{ height: 4, borderRadius: 2, background: "var(--color-cream-sunken)", overflow: "hidden", marginBottom: 20 }}>
          <div style={{ height: "100%", borderRadius: 2, background: isB ? "linear-gradient(90deg, #df4746, #f19e37)" : "var(--color-sage)", width: `${progressPct}%`, transition: "width 0.3s var(--ease-spring)" }} />
        </div>

        {/* Tutorial grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
          {TUTORIALS.map((t, i) => {
            const Icon = t.icon;
            return (
              <button
                key={i}
                onClick={() => toast(`Tutorial: ${t.title} \u2014 coming soon`, "info")}
                className="card card-hover"
                style={{
                  padding: 20,
                  display: "flex",
                  flexDirection: "column",
                  gap: 12,
                  color: "inherit",
                  textAlign: "left",
                  cursor: "pointer",
                  border: "none",
                  width: "100%",
                }}
              >
                <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: "50%", background: t.completed ? "var(--color-sage-soft)" : "var(--color-cream-deep)" }}>
                  <Icon size={20} style={{ color: t.completed ? "var(--color-sage-deep)" : "var(--color-brown-soft)" }} />
                </div>
                <div className="heading-sm">{t.title}</div>
                <p className="body-sm" style={{ margin: 0, flex: 1 }}>{t.desc}</p>
                <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                  {t.completed ? (
                    <span className="pill pill-sage flex items-center gap-1" style={{ fontSize: 11 }}>
                      <CheckCircle size={12} />Completed
                    </span>
                  ) : (
                    <span className="pill pill-sage tnum" style={{ fontSize: 11 }}>
                      {t.steps} steps
                    </span>
                  )}
                  <span className="caption flex items-center gap-1" style={{ fontWeight: 600, color: "var(--color-red)", ...(isB && !t.completed ? { background: "linear-gradient(135deg, #df4746, #f19e37)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" } : {}) }}>
                    {t.completed ? "Run again" : "Start"}<ArrowRight size={12} style={isB && !t.completed ? { color: "#df4746" } : {}} />
                  </span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="divider" />

      {/* ================================================================ */}
      {/*  Section 2: FAQs                                                 */}
      {/* ================================================================ */}
      <div>
        <div className={`heading-lg${isB ? " heading-gradient" : ""}`} style={{ marginBottom: 4 }}>Frequently Asked Questions</div>
        <p className="body-sm" style={{ margin: "0 0 16px" }}>
          Quick answers to the most common questions from home chefs.
        </p>

        <div className="card" style={{ padding: 0, overflow: "hidden" }}>
          {FAQS.map((faq, i) => (
            <div key={i}>
              {i > 0 && <div className="divider" />}
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
                  transition: "background var(--t-fast)",
                }}
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
              >
                {faq.q}
                <ChevronDown
                  size={16}
                  style={{
                    color: isB && openFaq === i ? "#df4746" : "var(--color-brown-soft-2)",
                    transform: openFaq === i ? "rotate(180deg)" : "none",
                    transition: "transform var(--t-fast) var(--ease-spring), color var(--t-fast)",
                    flexShrink: 0,
                    marginLeft: 12,
                  }}
                />
              </button>
              <div
                style={{
                  overflow: "hidden",
                  transition: "max-height 0.3s ease, opacity 0.3s ease",
                  maxHeight: openFaq === i ? 300 : 0,
                  opacity: openFaq === i ? 1 : 0,
                }}
              >
                <div className="body-sm" style={{ padding: "0 20px 14px", lineHeight: 1.6 }}>
                  {faq.a}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="divider" />

      {/* ================================================================ */}
      {/*  Section 3: Contact Support                                      */}
      {/* ================================================================ */}
      <div>
        <div className={`heading-lg${isB ? " heading-gradient" : ""}`} style={{ marginBottom: 4 }}>Contact Support</div>
        <p className="body-sm" style={{ margin: "0 0 16px" }}>
          Need help? Our team is here for you.
        </p>

        <div className="card" style={{ padding: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: 10, marginBottom: 16 }}>
            <a
              href="mailto:support@yallabites.com"
              className="btn btn-dark"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center", textDecoration: "none", ...(isB ? { background: "linear-gradient(135deg, #df4746, #f19e37)", border: "none" } : {}) }}
            >
              <Mail size={16} />
              Email Support
            </a>
            <button
              className="btn btn-ghost"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}
              onClick={() => toast("WhatsApp support \u2014 coming soon", "info")}
            >
              <MessageCircle size={16} />
              WhatsApp
            </button>
            <a
              href="tel:+12145550199"
              className="btn btn-ghost"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center", textDecoration: "none" }}
            >
              <Phone size={16} />
              Call Us
            </a>
            <button
              className="btn btn-ghost"
              style={{ display: "inline-flex", alignItems: "center", gap: 8, justifyContent: "center" }}
              onClick={() => toast("Live chat \u2014 coming soon", "info")}
            >
              <Headphones size={16} />
              Live Chat
            </button>
          </div>
          <div className="caption" style={{ textAlign: "center", color: "var(--color-brown-soft-2)" }}>
            Available Mon&ndash;Fri, 9am&ndash;6pm CST
          </div>
        </div>
      </div>
    </div>
  );
}
