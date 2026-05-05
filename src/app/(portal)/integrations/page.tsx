"use client";

import { useState } from "react";
import { Smartphone, Mail, MessageSquare, Webhook, Send, CheckCircle, AlertCircle, Check, Loader2 } from "lucide-react";

const INITIAL_CHANNELS = [
  {
    id: "email",
    icon: Mail,
    name: "Email Notifications",
    desc: "Get order details sent to your inbox",
    connected: true,
    value: "amira@yallakitchen.com",
  },
  {
    id: "sms",
    icon: MessageSquare,
    name: "SMS Alerts",
    desc: "Instant text message for every order",
    connected: true,
    value: "(214) 555-0198",
  },
  {
    id: "webhook",
    icon: Webhook,
    name: "Webhook",
    desc: "Send order data to your own endpoint",
    connected: false,
    value: null,
  },
];

export default function IntegrationsPage() {
  const [channels] = useState(INITIAL_CHANNELS);
  const [squareConnected, setSquareConnected] = useState(false);
  const [testSending, setTestSending] = useState(false);
  const [testSent, setTestSent] = useState(false);
  const [channelTestStates, setChannelTestStates] = useState<Record<string, "idle" | "sending" | "sent">>({});

  const handleSquareConnect = () => {
    setSquareConnected(!squareConnected);
  };

  const handleTestOrder = () => {
    setTestSending(true);
    setTimeout(() => {
      setTestSending(false);
      setTestSent(true);
      setTimeout(() => setTestSent(false), 3000);
    }, 1500);
  };

  const handleChannelAction = (id: string) => {
    if (channels.find((c) => c.id === id)?.connected) {
      setChannelTestStates((prev) => ({ ...prev, [id]: "sending" }));
      setTimeout(() => {
        setChannelTestStates((prev) => ({ ...prev, [id]: "sent" }));
        setTimeout(() => {
          setChannelTestStates((prev) => ({ ...prev, [id]: "idle" }));
        }, 2000);
      }, 1000);
    }
  };

  return (
    <div className="section-stack" style={{ maxWidth: 640 }}>
      {/* Status banner */}
      <div
        className="flex items-start gap-3"
        style={{
          background: "var(--color-orange-soft)",
          borderRadius: 12,
          padding: 16,
          transition: "all 0.2s ease",
        }}
      >
        <AlertCircle size={20} style={{ color: "var(--color-orange-text)", marginTop: 2, flexShrink: 0 }} />
        <div>
          <div style={{ fontWeight: 600, color: "var(--color-orange-text)" }}>
            Orders go to your phone only
          </div>
          <div style={{ fontSize: 13, color: "var(--color-orange-text)", opacity: 0.85, marginTop: 2 }}>
            Consider connecting a POS or email for backup order notifications.
          </div>
        </div>
      </div>

      {/* Square native card */}
      <div className="card flex items-center gap-4" style={{ transition: "box-shadow 0.2s ease", minHeight: 56 }}>
        <div
          className="flex items-center justify-center"
          style={{
            width: 48,
            height: 48,
            borderRadius: 12,
            background: squareConnected ? "var(--color-sage-soft)" : "#000",
            flexShrink: 0,
            transition: "background 0.2s ease",
          }}
        >
          <Smartphone size={22} style={{ color: squareConnected ? "var(--color-sage-deep)" : "#fff", transition: "color 0.2s ease" }} />
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <span style={{ fontWeight: 600, fontSize: 15 }}>Square POS</span>
            {squareConnected && <CheckCircle size={14} style={{ color: "var(--color-sage)" }} />}
          </div>
          <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
            {squareConnected ? "Connected and syncing orders" : "Sync orders directly to your Square terminal"}
          </div>
        </div>
        <button
          className={`btn btn-sm ${squareConnected ? "btn-ghost" : "btn-red"}`}
          style={{ minHeight: 44, transition: "all 0.15s ease" }}
          onClick={handleSquareConnect}
        >
          {squareConnected ? "Disconnect" : "Connect"}
        </button>
      </div>

      {/* Universal channels */}
      <div>
        <div className="eyebrow" style={{ marginBottom: 12 }}>
          Notification Channels
        </div>
        <div className="section-stack" style={{ gap: 8 }}>
          {channels.map((ch) => {
            const Icon = ch.icon;
            const testState = channelTestStates[ch.id] || "idle";
            return (
              <div
                key={ch.id}
                className="card flex items-center gap-4"
                style={{ transition: "box-shadow 0.2s ease", minHeight: 56 }}
              >
                <div
                  className="flex items-center justify-center"
                  style={{
                    width: 42,
                    height: 42,
                    borderRadius: 10,
                    background: ch.connected ? "var(--color-sage-soft)" : "var(--color-cream-sunken)",
                    flexShrink: 0,
                  }}
                >
                  <Icon
                    size={20}
                    style={{
                      color: ch.connected ? "var(--color-sage-deep)" : "var(--color-brown-soft-2)",
                    }}
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span style={{ fontWeight: 600, fontSize: 14 }}>{ch.name}</span>
                    {ch.connected && <CheckCircle size={14} style={{ color: "var(--color-sage)" }} />}
                  </div>
                  <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
                    {ch.connected ? ch.value : ch.desc}
                  </div>
                </div>
                <div className="flex gap-2">
                  {ch.connected && (
                    <button
                      className="btn btn-ghost btn-sm"
                      style={{ minHeight: 44, transition: "all 0.15s ease", minWidth: 80 }}
                      onClick={() => handleChannelAction(ch.id)}
                    >
                      {testState === "sending" && <Loader2 size={14} className="animate-spin" />}
                      {testState === "sent" && <Check size={14} style={{ color: "var(--color-sage)" }} />}
                      {testState === "idle" ? "Send test" : testState === "sending" ? "Sending" : "Sent"}
                    </button>
                  )}
                  <button
                    className="btn btn-ghost btn-sm"
                    style={{ minHeight: 44, transition: "all 0.15s ease" }}
                  >
                    {ch.connected ? "Edit" : "Set up"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Send test order */}
      <div className="card flex items-center justify-between" style={{ background: "var(--color-cream-deep)", transition: "box-shadow 0.2s ease", minHeight: 56 }}>
        <div>
          <div style={{ fontWeight: 600, fontSize: 15 }}>Test your setup</div>
          <div style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>
            Send a test order to verify all channels work
          </div>
        </div>
        <button
          className="btn btn-red btn-sm"
          style={{ minHeight: 44, transition: "all 0.15s ease", minWidth: 140 }}
          onClick={handleTestOrder}
          disabled={testSending}
        >
          {testSending ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Sending...
            </>
          ) : testSent ? (
            <>
              <Check size={14} />
              Test sent
            </>
          ) : (
            <>
              <Send size={14} />
              Send test order
            </>
          )}
        </button>
      </div>
    </div>
  );
}
