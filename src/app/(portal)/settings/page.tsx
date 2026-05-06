/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  Shield,
  LogOut,
  Trash2,
  UserPlus,
  ChevronRight,
  ChevronDown,
  Check,
  AlertTriangle,
  Smartphone,
  Mail,
  MessageSquare,
  Webhook,
  Send,
  CheckCircle,
  AlertCircle,
  Loader2,
  ClipboardList,
  Layers,
  Package,
  Tag,
  List,
  User,
  Settings as SettingsIcon,
  MapPin,
  ArrowRight,
  Play,
  FileText,
  BookOpen,
  Video,
  Download,
} from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { useDesignMode } from "@/lib/design-mode";

type SettingsTab = "account" | "integrations" | "help";

const SETTINGS_TABS: { key: SettingsTab; label: string }[] = [
  { key: "account", label: "Account" },
  { key: "integrations", label: "Integrations" },
  { key: "help", label: "Help" },
];

const NOTIF_CATEGORIES = [
  { label: "New Orders", desc: "When a customer places an order" },
  { label: "Reviews", desc: "When someone leaves a review" },
  { label: "Payouts", desc: "When a payout is processed" },
  { label: "System Updates", desc: "Platform news and changes" },
];

const CHANNELS = ["Email", "Push", "SMS"];

const INITIAL_CHANNELS = [
  { id: "email", icon: Mail, name: "Email Notifications", desc: "Get order details sent to your inbox", connected: true, value: "amira@yallakitchen.com" },
  { id: "sms", icon: MessageSquare, name: "SMS Alerts", desc: "Instant text message for every order", connected: true, value: "(214) 555-0198" },
  { id: "webhook", icon: Webhook, name: "Webhook", desc: "Send order data to your own endpoint", connected: false, value: null },
];

const TUTORIALS = [
  { icon: ClipboardList, title: "Managing Orders", desc: "Learn how to accept, prepare, and complete customer orders efficiently.", steps: 14, completed: false },
  { icon: Layers, title: "Creating Dishes", desc: "Add dishes with photos, descriptions, pricing, and modifiers.", steps: 12, completed: false },
  { icon: Package, title: "Creating Bundles", desc: "Combine dishes into bundles with special pricing for families and groups.", steps: 10, completed: true },
  { icon: Tag, title: "Modifier Groups", desc: "Set up spice levels, sizes, add-ons, and other customization options.", steps: 6, completed: false },
  { icon: List, title: "Custom Menu Sections", desc: "Organize your menu with custom categories and featured sections.", steps: 7, completed: false },
  { icon: User, title: "Chef Profile", desc: "Set up your profile, bio, cuisines, and branding to attract customers.", steps: 10, completed: false },
  { icon: SettingsIcon, title: "Account Settings", desc: "Manage notifications, security, co-pilot access, and account preferences.", steps: 7, completed: false },
  { icon: MapPin, title: "Address Management", desc: "Set your pickup address, instructions, and operating zone.", steps: 6, completed: false },
];

const GUIDE_TABS = ["Video Tutorials", "Chef Playbook"] as const;
type GuideTab = (typeof GUIDE_TABS)[number];

export default function SettingsPage() {
  const { mode } = useDesignMode();
  const isB = mode === "b";

  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [name, setName] = useState("Amira Haddad");
  const [phone, setPhone] = useState("(469) 277-0767");
  const [phoneEditing, setPhoneEditing] = useState(false);
  const [showInvite, setShowInvite] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [passwordOpen, setPasswordOpen] = useState(false);
  const [notifs, setNotifs] = useState<Record<string, Record<string, boolean>>>(() => {
    const init: Record<string, Record<string, boolean>> = {};
    NOTIF_CATEGORIES.forEach((c) => { init[c.label] = { Email: true, Push: true, SMS: false }; });
    return init;
  });
  const [channels] = useState(INITIAL_CHANNELS);
  const [squareConnected, setSquareConnected] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [channelTestStates, setChannelTestStates] = useState<Record<string, "idle" | "sending" | "sent">>({});
  const [tutorials] = useState(TUTORIALS);
  const [activeGuideTab, setActiveGuideTab] = useState<GuideTab>("Video Tutorials");
  const { toast } = useToast();

  const toggleNotif = (cat: string, channel: string) => {
    setNotifs((prev) => ({ ...prev, [cat]: { ...prev[cat], [channel]: !prev[cat][channel] } }));
  };
  const handleSquareConnect = () => setSquareConnected(!squareConnected);
  const handleTestOrder = () => {
    setTestSending(true);
    setTimeout(() => { setTestSending(false); setTestSent(true); setTimeout(() => setTestSent(false), 3000); }, 1500);
  };
  const handleChannelAction = (id: string) => {
    if (channels.find((c) => c.id === id)?.connected) {
      setChannelTestStates((prev) => ({ ...prev, [id]: "sending" }));
      setTimeout(() => { setChannelTestStates((prev) => ({ ...prev, [id]: "sent" })); setTimeout(() => { setChannelTestStates((prev) => ({ ...prev, [id]: "idle" })); }, 2000); }, 1000);
    }
  };
  const completedCount = tutorials.filter((t) => t.completed).length;
  const totalCount = tutorials.length;
  const progressPct = (completedCount / totalCount) * 100;

  if (!loaded) {
    return (
      <div className="content-narrow section-stack">
        <div className="skeleton" style={{ height: 40, borderRadius: 10 }} />
        <div className="skeleton" style={{ height: 80, borderRadius: 16 }} />
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="skeleton" style={{ height: 50, borderRadius: 12 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="content-narrow section-stack">
      {/* Tabs */}
      <div className="flex gap-0" style={{ borderBottom: isB ? "none" : "1px solid rgba(51,31,46,0.06)", gap: isB ? 6 : 0 }}>
        {SETTINGS_TABS.map((t) => {
          const tabActive = activeTab === t.key;
          return (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              style={{
                padding: isB ? "8px 20px" : "10px 20px", background: isB ? (tabActive ? "linear-gradient(135deg, #df4746, #f19e37)" : "rgba(223,71,70,0.08)") : "none", border: "none", fontSize: 14,
                fontWeight: tabActive ? 600 : 400,
                color: isB ? (tabActive ? "#fff" : "var(--color-brown-soft)") : (tabActive ? "var(--color-red)" : "var(--color-brown-soft)"),
                borderBottom: isB ? "none" : (tabActive ? "2px solid var(--color-red)" : "2px solid transparent"),
                borderRadius: isB ? 9999 : 0,
                marginBottom: isB ? 0 : -1, cursor: "pointer", transition: "all var(--t-fast) var(--ease-spring)",
              }}
            >
              {t.label}
            </button>
          );
        })}
      </div>

      {/* ACCOUNT TAB */}
      {activeTab === "account" && (
        <>
          <div className="section-stack" style={{ gap: 0 }}>
            <div className="flex items-center gap-4">
              <div style={{ borderRadius: '50%' }}>
                <img src="https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop" alt="Profile" className="rounded-full object-cover" style={{ width: 64, height: 64 }} />
              </div>
              <div>
                <label className="btn btn-ghost btn-sm" style={{ cursor: "pointer" }}>
                  Change photo
                  <input type="file" accept="image/*" style={{ display: "none" }} onChange={() => toast("Photo updated")} />
                </label>
              </div>
            </div>
            <div className="divider" style={{ margin: "20px 0" }} />
            <div>
              <label className="field-label">Full Name</label>
              <input className="input" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div className="divider" style={{ margin: "20px 0" }} />
            <div>
              <label className="field-label">Email</label>
              <div className="flex items-center gap-2">
                <input className="input" defaultValue="amira@yallakitchen.com" readOnly style={{ background: "var(--color-cream-sunken)", color: "var(--color-brown-soft)" }} />
                <span className="pill pill-sage" style={{ flexShrink: 0 }}>Verified</span>
              </div>
            </div>
            <div className="divider" style={{ margin: "20px 0" }} />
            <div>
              <label className="field-label">Phone</label>
              <div className="flex items-center gap-2">
                <input className="input" value={phone} onChange={(e) => setPhone(e.target.value)} readOnly={!phoneEditing} style={{ background: phoneEditing ? "white" : "var(--color-cream-sunken)" }} />
                <button className="btn btn-ghost btn-sm" style={{ flexShrink: 0 }} onClick={() => setPhoneEditing(!phoneEditing)}>
                  {phoneEditing ? (<><Check size={14} style={{ color: "var(--color-sage)" }} /> Save</>) : "Change"}
                </button>
              </div>
            </div>
          </div>
          <div className="divider" />
          <div>
            <div className="heading-sm" style={{ marginBottom: 4 }}>Notifications</div>
            <p className="body-sm" style={{ margin: "0 0 16px" }}>Choose how you want to be notified</p>
            <div className="flex items-center" style={{ padding: "8px 0", borderBottom: "1px solid rgba(51,31,46,0.06)", ...(isB ? { background: "rgba(53,36,49,0.03)", borderRadius: 8, padding: "8px 12px", marginBottom: 4 } : {}) }}>
              <span style={{ flex: 1 }} />
              {CHANNELS.map((ch) => (<span key={ch} className="eyebrow" style={{ width: 64, textAlign: "center" }}>{ch}</span>))}
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
                      <button className={`toggle ${notifs[cat.label][ch] ? "is-on" : ""}`} role="switch" aria-checked={notifs[cat.label][ch]} aria-label={`${cat.label} ${ch} notifications`} onClick={() => toggleNotif(cat.label, ch)} style={isB && notifs[cat.label][ch] ? { background: "linear-gradient(135deg, #df4746, #f19e37)" } : {}}>
                        <span className="toggle-thumb" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <div className="divider" />
          <button className="flex items-center justify-between w-full text-left" style={{ background: "none", border: "none", padding: "4px 0", cursor: "pointer" }} onClick={() => setShowInvite(!showInvite)}>
            <div className="flex items-center gap-3">
              <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 10, background: "var(--color-cream-sunken)" }}>
                <UserPlus size={18} style={{ color: "var(--color-brown-soft)" }} />
              </div>
              <div>
                <div className="heading-sm" style={{ fontSize: 14 }}>Invite a co-pilot</div>
                <div className="body-sm">Add a partner to manage your store</div>
              </div>
            </div>
            <ChevronRight size={18} style={{ color: "var(--color-brown-soft-2)", transform: showInvite ? "rotate(90deg)" : "none", transition: `transform var(--t-fast) var(--ease-spring)` }} />
          </button>
          {showInvite && (
            <div style={{ padding: "12px 0 0 52px" }}>
              <p className="body-sm" style={{ margin: "0 0 12px" }}>Co-pilot invitations coming soon.</p>
              <button className="btn btn-ghost btn-sm" style={{ opacity: 0.5, cursor: "not-allowed" }} disabled>Send Invite</button>
            </div>
          )}
          <div className="divider" />
          <div>
            <div className="heading-sm" style={{ marginBottom: 12 }}>Security</div>
            <button className="flex items-center justify-between w-full text-left" style={{ padding: "14px 0", background: "none", border: "none", cursor: "pointer" }} onClick={() => setPasswordOpen(!passwordOpen)}>
              <div className="flex items-center gap-3">
                <Shield size={18} style={{ color: "var(--color-brown-soft)" }} />
                <span className="body" style={{ fontWeight: 500 }}>Change password</span>
              </div>
              <ChevronDown size={16} style={{ color: "var(--color-brown-soft-2)", transform: passwordOpen ? "rotate(180deg)" : "none", transition: `transform var(--t-fast) var(--ease-spring)` }} />
            </button>
            {passwordOpen && (
              <div style={{ padding: "0 0 14px 30px" }}>
                <div style={{ marginBottom: 12 }}><label className="field-label" style={{ fontSize: 12 }}>Current Password</label><input type="password" className="input" placeholder="Enter current password" /></div>
                <div style={{ marginBottom: 12 }}><label className="field-label" style={{ fontSize: 12 }}>New Password</label><input type="password" className="input" placeholder="Enter new password" /></div>
                <button className="btn btn-dark btn-sm">Update Password</button>
              </div>
            )}
            <div className="divider" />
            <div className="flex items-center justify-between w-full" style={{ padding: "14px 0" }}>
              <div className="flex items-center gap-3">
                <Shield size={18} style={{ color: "var(--color-brown-soft)" }} />
                <div><span className="body" style={{ fontWeight: 500 }}>Two-factor authentication</span><div className="caption">Not enabled</div></div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => toast("Two-factor authentication coming soon", "info")}>Set up</button>
            </div>
          </div>
          <div className="divider" />
          <div>
            <div className="caption" style={{ color: "var(--color-red)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 12 }}>Danger Zone</div>
            <div className="flex flex-col gap-2">
              <Link href="/login" className="flex items-center gap-2 body" style={{ fontWeight: 500, color: "var(--color-brown-soft)", padding: "8px 0" }}><LogOut size={16} />Log out</Link>
              <button className="flex items-center gap-2 body" style={{ background: "none", border: "none", fontWeight: 500, color: "var(--color-red)", padding: "8px 0", cursor: "pointer" }} onClick={() => setShowDeleteConfirm(!showDeleteConfirm)}><Trash2 size={16} />Delete my account</button>
              {showDeleteConfirm && (
                <div style={{ borderLeft: "3px solid var(--color-red)", borderRadius: 8, padding: "14px 16px", marginTop: 4 }}>
                  <div className="flex items-center gap-2" style={{ marginBottom: 8 }}><AlertTriangle size={16} style={{ color: "var(--color-red-deep)" }} /><span className="heading-sm" style={{ fontSize: 14, color: "var(--color-red-deep)" }}>Are you sure?</span></div>
                  <p className="body-sm" style={{ color: "var(--color-red-deep)", margin: "0 0 12px" }}>This action is permanent and cannot be undone.</p>
                  <div className="flex gap-2">
                    <button className="btn btn-ghost btn-sm" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
                    <button className="btn btn-sm" style={{ background: "var(--color-red-deep)", color: "#fff", border: "none", opacity: 0.5, cursor: "not-allowed" }} disabled>Delete Account</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* INTEGRATIONS TAB */}
      {activeTab === "integrations" && (
        <>
          <div><h1 className="heading-lg">POS & Integrations</h1><p className="body-sm" style={{ marginTop: 4 }}>Connect your tools and notification channels</p></div>
          <div className="card-cream flex items-start gap-3">
            <AlertCircle size={18} style={{ color: "var(--color-orange)", marginTop: 2, flexShrink: 0 }} />
            <div><div className="heading-sm" style={{ fontSize: 14, color: "var(--color-orange-text)" }}>Orders go to your phone only</div><div className="body-sm" style={{ marginTop: 2 }}>Consider connecting a POS or email for backup order notifications.</div></div>
          </div>
          <div className="card flex items-center gap-4">
            <div className="flex items-center justify-center" style={{ width: 44, height: 44, borderRadius: 12, background: squareConnected ? "var(--color-sage-soft)" : "#000", flexShrink: 0, transition: `background var(--t-fast) var(--ease-spring)` }}>
              <Smartphone size={20} style={{ color: squareConnected ? "var(--color-sage-deep)" : "#fff", transition: `color var(--t-fast)` }} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2"><span className="heading-sm" style={{ fontSize: 14 }}>Square POS</span>{squareConnected && <CheckCircle size={14} style={{ color: "var(--color-sage)" }} />}</div>
              <div className="body-sm" style={{ marginTop: 2 }}>{squareConnected ? "Connected and syncing orders" : "Sync orders directly to your Square terminal"}</div>
            </div>
            <button className={`btn btn-sm ${squareConnected ? "btn-ghost" : "btn-dark"}`} onClick={handleSquareConnect}>{squareConnected ? "Disconnect" : "Connect"}</button>
          </div>
          <div>
            <div className="eyebrow" style={{ marginBottom: 12 }}>Notification Channels</div>
            <div className="section-stack" style={{ gap: 8 }}>
              {channels.map((ch) => {
                const Icon = ch.icon;
                const testState = channelTestStates[ch.id] || "idle";
                return (
                  <div key={ch.id} className="card flex items-center gap-4">
                    <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: 10, background: ch.connected ? "var(--color-sage-soft)" : "var(--color-cream-sunken)", flexShrink: 0 }}>
                      <Icon size={18} style={{ color: ch.connected ? "var(--color-sage-deep)" : "var(--color-brown-soft-2)" }} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2"><span className="heading-sm" style={{ fontSize: 14 }}>{ch.name}</span>{ch.connected && <CheckCircle size={14} style={{ color: "var(--color-sage)" }} />}</div>
                      <div className="body-sm" style={{ marginTop: 2 }}>{ch.connected ? ch.value : ch.desc}</div>
                    </div>
                    <div className="flex gap-2">
                      {ch.connected && (
                        <button className="btn btn-ghost btn-sm" style={{ minWidth: 80 }} onClick={() => handleChannelAction(ch.id)}>
                          {testState === "sending" && <Loader2 size={14} className="animate-spin" />}
                          {testState === "sent" && <Check size={14} style={{ color: "var(--color-sage)" }} />}
                          {testState === "idle" ? "Send test" : testState === "sending" ? "Sending" : "Sent"}
                        </button>
                      )}
                      <button className="btn btn-ghost btn-sm" onClick={() => toast("Channel configuration coming soon", "info")}>{ch.connected ? "Edit" : "Set up"}</button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
          <div className="flex justify-center" style={{ paddingTop: 8 }}>
            <button className="btn btn-dark btn-lg" style={{ minWidth: 200 }} onClick={handleTestOrder} disabled={testSending}>
              {testSending ? (<><Loader2 size={14} className="animate-spin" /> Sending...</>) : testSent ? (<><Check size={14} /> Test sent</>) : (<><Send size={14} /> Send test order</>)}
            </button>
          </div>
        </>
      )}

      {/* HELP TAB */}
      {activeTab === "help" && (
        <>
          <div>
            <div className="heading-lg" style={{ marginBottom: 4 }}>Tutorials</div>
            <div className="flex items-center justify-between" style={{ marginBottom: 8 }}>
              <span className="body" style={{ fontWeight: 600 }}>Your progress</span>
              <span className="tnum caption">{completedCount} / {totalCount}</span>
            </div>
            <div style={{ height: 3, borderRadius: 2, background: "var(--color-cream-sunken)", overflow: "hidden", marginBottom: 20 }}>
              <div style={{ height: "100%", borderRadius: 2, background: "var(--color-sage)", width: `${progressPct}%`, transition: "width 0.3s var(--ease-spring)" }} />
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 16 }}>
              {tutorials.map((t, i) => {
                const Icon = t.icon;
                return (
                  <button key={i} onClick={() => toast(`Tutorial: ${t.title} \u2014 coming soon`, "info")} className="card card-hover" style={{ padding: 20, display: "flex", flexDirection: "column", gap: 12, color: "inherit", textAlign: "left", cursor: "pointer", border: "none", width: "100%" }}>
                    <div className="flex items-center justify-center" style={{ width: 40, height: 40, borderRadius: "50%", background: "var(--color-cream-deep)" }}>
                      <Icon size={20} style={{ color: "var(--color-brown-soft)" }} />
                    </div>
                    <div className="heading-sm">{t.title}</div>
                    <p className="body-sm" style={{ margin: 0, flex: 1 }}>{t.desc}</p>
                    <div className="flex items-center justify-between" style={{ marginTop: 4 }}>
                      {t.completed ? (<span className="pill pill-sage flex items-center gap-1" style={{ fontSize: 11 }}><CheckCircle size={12} />Completed</span>) : (<span className="pill pill-sage tnum" style={{ fontSize: 11 }}>{t.steps} steps</span>)}
                      <span className="caption flex items-center gap-1" style={{ fontWeight: 600, color: "var(--color-red)" }}>{t.completed ? "Run again" : "Start"}<ArrowRight size={12} /></span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
          <div className="divider" />
          <div className="section-stack">
            <div className="heading-lg">Portal Guide</div>
            <div className="flex gap-0" style={{ borderBottom: isB ? "none" : "1px solid rgba(51,31,46,0.06)", gap: isB ? 6 : 0 }}>
              {GUIDE_TABS.map((t) => {
                const Icon = t === "Video Tutorials" ? Video : BookOpen;
                const guideActive = activeGuideTab === t;
                return (
                  <button key={t} onClick={() => setActiveGuideTab(t)} className="flex items-center gap-1.5" style={{ padding: isB ? "8px 16px" : "10px 20px", background: isB ? (guideActive ? "linear-gradient(135deg, #df4746, #f19e37)" : "rgba(223,71,70,0.08)") : "none", border: "none", fontSize: 14, fontWeight: guideActive ? 600 : 400, color: isB ? (guideActive ? "#fff" : "var(--color-brown-soft)") : (guideActive ? "var(--color-red)" : "var(--color-brown-soft)"), borderBottom: isB ? "none" : (guideActive ? "2px solid var(--color-red)" : "2px solid transparent"), borderRadius: isB ? 9999 : 0, marginBottom: isB ? 0 : -1, cursor: "pointer", transition: `all var(--t-fast) var(--ease-spring)` }}>
                    <Icon size={16} />{t}
                  </button>
                );
              })}
            </div>
            {activeGuideTab === "Video Tutorials" && (
              <div className="section-stack">
                <div><h2 className="heading-lg">How-To Videos</h2><p className="body-sm" style={{ marginTop: 4 }}>Watch step-by-step guides to get the most out of your chef portal.</p></div>
                <div className="card flex flex-col items-center justify-center" style={{ aspectRatio: "16/9", background: "var(--color-brown)", position: "relative", cursor: "pointer", overflow: "hidden", padding: 0 }} onClick={() => toast("Video playback coming soon", "info")}>
                  <div className="flex items-center justify-center glow-red" style={{ width: 48, height: 48, borderRadius: "50%", background: "rgba(255,255,255,0.95)", boxShadow: "0 4px 20px rgba(0,0,0,0.2)" }}>
                    <Play size={22} fill="var(--color-red)" style={{ color: "var(--color-red)", marginLeft: 2 }} />
                  </div>
                  <div style={{ marginTop: 16, textAlign: "center" }}>
                    <div className="heading-sm" style={{ color: "var(--color-cream)" }}>Yalla Bites Chef Success Playbook</div>
                    <div className="caption" style={{ color: "rgba(255,255,255,0.5)", marginTop: 4 }}>Click to play video</div>
                  </div>
                </div>
              </div>
            )}
            {activeGuideTab === "Chef Playbook" && (
              <div className="section-stack">
                <div><h2 className="heading-lg">Chef Success Playbook</h2><p className="body-sm" style={{ marginTop: 4 }}>Everything you need to grow your kitchen on Yalla Bites.</p></div>
                <div className="card flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center" style={{ width: 48, height: 48, borderRadius: 12, background: "var(--color-cream-deep)" }}><FileText size={24} style={{ color: "var(--color-brown-soft)" }} /></div>
                    <div><div className="heading-sm">Chef Success Playbook</div><div className="caption" style={{ marginTop: 2 }}>18 pages</div></div>
                  </div>
                  <button className="btn btn-dark btn-sm" onClick={() => toast("PDF download coming soon", "info")}><Download size={14} />View Full Playbook</button>
                </div>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
