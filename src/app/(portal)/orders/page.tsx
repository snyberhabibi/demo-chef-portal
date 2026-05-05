/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect, useCallback } from "react";
import Link from "next/link";
import { Search, Truck, ShoppingBag, Package, ChevronRight, MessageSquare, ExternalLink, ClipboardList, LayoutGrid, List, Volume2, VolumeX, X } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { orders, type Order, type OrderStatus, type Urgency } from "@/lib/mock-data";
import { statusDotColor } from "@/lib/utils/status-helpers";

/* ------------------------------------------------------------------ */
/*  Filter tabs                                                        */
/* ------------------------------------------------------------------ */
const filterTabs: { label: string; match: (o: Order) => boolean }[] = [
  { label: "All", match: () => true },
  { label: "Paid", match: (o) => o.status === "paid" },
  { label: "Confirmed", match: (o) => o.status === "confirmed" },
  { label: "Preparing", match: (o) => o.status === "preparing" },
  { label: "Ready", match: (o) => o.status === "ready" || o.status === "readyForPickup" },
  { label: "Delivered", match: (o) => o.status === "delivered" || o.status === "pickedUp" },
  { label: "Cancelled", match: (o) => o.status === "cancelled" || o.status === "rejected" },
];

/* Pipeline columns for Kanban view */
const pipelineColumns: { key: string; label: string; color: string; match: (s: OrderStatus) => boolean }[] = [
  { key: "new", label: "New", color: "var(--color-orange)", match: (s) => s === "paid" },
  { key: "preparing", label: "Preparing", color: "#e8a832", match: (s) => s === "confirmed" || s === "preparing" },
  { key: "ready", label: "Ready", color: "var(--color-sage)", match: (s) => s === "ready" || s === "readyForPickup" },
  { key: "done", label: "Done", color: "var(--color-brown-soft-2)", match: (s) => s === "delivered" || s === "pickedUp" || s === "outForDelivery" },
];

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */
function actionLabel(s: OrderStatus): string | null {
  switch (s) {
    case "paid": return "Confirm";
    case "confirmed": return "Start Prep";
    case "preparing": return "Mark Ready";
    case "ready": case "readyForPickup": return "Hand Off";
    default: return null;
  }
}

function actionToastMsg(hash: string, s: OrderStatus): string {
  switch (s) {
    case "paid": return `Order ${hash} confirmed`;
    case "confirmed": return `Order ${hash} prep started`;
    case "preparing": return `Order ${hash} marked ready`;
    case "ready": case "readyForPickup": return `Order ${hash} handed off`;
    default: return `Order ${hash} updated`;
  }
}

function linkId(hash: string): string { return hash.replace("#", "").slice(0, 7); }
function urgencyBackground(u: Urgency): string | undefined {
  if (u === "overdue") return "rgba(229,65,65,0.04)";
  if (u === "due-soon") return "rgba(252,157,53,0.04)";
  return undefined;
}
function itemCount(items: { qty: number; name: string }[]): number { return items.reduce((sum, i) => sum + i.qty, 0); }

/* ------------------------------------------------------------------ */
/*  Bottom Sheet Component                                             */
/* ------------------------------------------------------------------ */
function BottomSheet({ isOpen, onClose, children }: { isOpen: boolean; onClose: () => void; children: React.ReactNode }) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, [isOpen]);
  if (!isOpen) return null;
  return (
    <>
      <div className="bottom-sheet-backdrop" onClick={onClose} />
      <div className="bottom-sheet">
        <div className="bottom-sheet-handle" />
        {children}
      </div>
    </>
  );
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */
export default function OrdersPage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { const t = setTimeout(() => setLoaded(true), 300); return () => clearTimeout(t); }, []);

  const [activeTab, setActiveTab] = useState("All");
  const [showPrepList, setShowPrepList] = useState(false);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(12);
  const [page, setPage] = useState(1);
  const { toast } = useToast();
  const [statusOverrides, setStatusOverrides] = useState<Record<string, OrderStatus>>(() => {
    if (typeof window === "undefined") return {};
    try {
      const saved = localStorage.getItem("order-status-overrides");
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<"list" | "pipeline">("list");
  const [audioAlerts, setAudioAlerts] = useState(false);
  const [bottomSheetOrder, setBottomSheetOrder] = useState<Order | null>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 640);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    localStorage.setItem("order-status-overrides", JSON.stringify(statusOverrides));
  }, [statusOverrides]);

  const activeFilter = filterTabs.find((f) => f.label === activeTab)!;
  const tabCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    const eff = orders.map((o) => ({ ...o, status: statusOverrides[o.hash] || o.status }));
    for (const tab of filterTabs) counts[tab.label] = eff.filter(tab.match).length;
    return counts;
  }, [statusOverrides]);

  const filtered = useMemo(() => {
    let list = orders.filter((o) => {
      const effective = { ...o, status: statusOverrides[o.hash] || o.status };
      return activeFilter.match(effective);
    });
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((o) => o.hash.toLowerCase().includes(q) || o.customer.toLowerCase().includes(q) || o.items.some((it) => it.name.toLowerCase().includes(q)));
    }
    return list;
  }, [activeTab, search, activeFilter, statusOverrides]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage));
  const paginated = filtered.slice((page - 1) * rowsPerPage, page * rowsPerPage);
  const showingStart = filtered.length === 0 ? 0 : (page - 1) * rowsPerPage + 1;
  const showingEnd = Math.min(page * rowsPerPage, filtered.length);

  const getEffectiveStatus = useCallback((order: Order): OrderStatus => statusOverrides[order.hash] || order.status, [statusOverrides]);

  const advanceStatus = useCallback((hash: string, currentStatus: OrderStatus) => {
    const nextMap: Partial<Record<OrderStatus, OrderStatus>> = { paid: "confirmed", confirmed: "preparing", preparing: "ready", ready: "delivered", readyForPickup: "pickedUp" };
    const next = nextMap[currentStatus];
    if (next) setStatusOverrides((prev) => ({ ...prev, [hash]: next }));
  }, []);

  const handleOrderAction = useCallback((order: Order, effectiveStatus: OrderStatus) => {
    if (isMobile) { setBottomSheetOrder(order); }
    else { toast(actionToastMsg(order.hash, effectiveStatus)); advanceStatus(order.hash, effectiveStatus); }
  }, [isMobile, toast, advanceStatus]);

  const confirmBottomSheetAction = useCallback(() => {
    if (!bottomSheetOrder) return;
    const es = getEffectiveStatus(bottomSheetOrder);
    toast(actionToastMsg(bottomSheetOrder.hash, es));
    advanceStatus(bottomSheetOrder.hash, es);
    setBottomSheetOrder(null);
  }, [bottomSheetOrder, toast, advanceStatus, getEffectiveStatus]);

  if (!loaded) {
    return (<div className="content-default section-stack">{[0,1,2,3,4,5].map((i) => (<div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />))}</div>);
  }

  return (
    <div className="content-default section-stack page-enter">
      {/* Filter bar + controls */}
      <div className="flex items-center gap-3 flex-wrap">
        <div className="flex-1 min-w-0" style={{ overflow: "hidden" }}>
          <div style={{ display: "flex", gap: 6, overflowX: "auto", scrollbarWidth: "none", msOverflowStyle: "none", paddingBottom: 2 }}>
            <div className="order-filter-tabs" style={{ display: "flex", gap: 4 }}>
              {filterTabs.map((tab) => {
                const isActive = tab.label === activeTab && !showPrepList;
                const count = tabCounts[tab.label];
                return (
                  <button key={tab.label} onClick={() => { setActiveTab(tab.label); setShowPrepList(false); setPage(1); }} className="h-7 sm:h-8 text-[11px] sm:text-[12px]" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0 10px", borderRadius: 8, fontWeight: 600, whiteSpace: "nowrap", border: "none", cursor: "pointer", transition: "all var(--t-fast) var(--ease-spring)", background: isActive ? "var(--color-brown)" : "transparent", color: isActive ? "var(--color-cream)" : "var(--color-brown-soft-2)" }}
                    onMouseEnter={(e) => { if (!isActive) e.currentTarget.style.background = "rgba(51,31,46,0.04)"; }}
                    onMouseLeave={(e) => { if (!isActive) e.currentTarget.style.background = "transparent"; }}>
                    {tab.label}
                    {count > 0 && tab.label !== "All" && (<span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 16, height: 16, padding: "0 4px", borderRadius: 9999, fontSize: 10, fontWeight: 700, fontVariantNumeric: "tabular-nums", background: isActive ? "rgba(255,255,255,0.2)" : "var(--color-cream-sunken)", color: isActive ? "var(--color-cream)" : "var(--color-brown-soft-2)" }}>{count}</span>)}
                  </button>
                );
              })}
              <button onClick={() => setShowPrepList(true)} className="h-7 sm:h-8 text-[11px] sm:text-[12px]" style={{ display: "inline-flex", alignItems: "center", gap: 5, padding: "0 10px", borderRadius: 8, fontWeight: 600, whiteSpace: "nowrap", border: "none", cursor: "pointer", transition: "all var(--t-fast) var(--ease-spring)", background: showPrepList ? "var(--color-brown)" : "transparent", color: showPrepList ? "var(--color-cream)" : "var(--color-brown-soft-2)" }}
                onMouseEnter={(e) => { if (!showPrepList) e.currentTarget.style.background = "rgba(51,31,46,0.04)"; }}
                onMouseLeave={(e) => { if (!showPrepList) e.currentTarget.style.background = "transparent"; }}>
                <ClipboardList size={13} strokeWidth={2} /> Prep List
              </button>
            </div>
          </div>
        </div>

        {/* View toggle + Audio toggle */}
        <div className="flex items-center gap-2" style={{ flexShrink: 0 }}>
          <div style={{ display: "inline-flex", background: "var(--color-cream-sunken)", borderRadius: 8, padding: 2, gap: 1 }}>
            <button title="List view" aria-label="Switch to list view" onClick={() => setViewMode("list")} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 28, borderRadius: 6, border: "none", cursor: "pointer", background: viewMode === "list" ? "#fff" : "transparent", color: viewMode === "list" ? "var(--color-brown)" : "var(--color-brown-soft-2)", boxShadow: viewMode === "list" ? "0 1px 3px rgba(51,31,46,0.08)" : "none", transition: "all var(--t-fast) var(--ease-spring)" }}><List size={15} strokeWidth={2} /></button>
            <button title="Pipeline view" aria-label="Switch to pipeline view" onClick={() => setViewMode("pipeline")} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 32, height: 28, borderRadius: 6, border: "none", cursor: "pointer", background: viewMode === "pipeline" ? "#fff" : "transparent", color: viewMode === "pipeline" ? "var(--color-brown)" : "var(--color-brown-soft-2)", boxShadow: viewMode === "pipeline" ? "0 1px 3px rgba(51,31,46,0.08)" : "none", transition: "all var(--t-fast) var(--ease-spring)" }}><LayoutGrid size={15} strokeWidth={2} /></button>
          </div>
          <button title={audioAlerts ? "Mute order alerts" : "Enable order alerts"} aria-label={audioAlerts ? "Mute order alerts" : "Enable order alerts"} className={audioAlerts ? "audio-alert-on" : ""} onClick={() => { setAudioAlerts(!audioAlerts); toast(audioAlerts ? "Order alerts muted" : "Order alerts on", "info"); }} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 36, height: 32, borderRadius: 8, border: "1px solid rgba(51,31,46,0.1)", cursor: "pointer", background: audioAlerts ? "rgba(121,173,99,0.08)" : "#fff", color: audioAlerts ? "var(--color-sage-deep)" : "var(--color-brown-soft-2)", transition: "all var(--t-fast) var(--ease-spring)" }}>
            {audioAlerts ? <Volume2 size={16} strokeWidth={2} /> : <VolumeX size={16} strokeWidth={2} />}
          </button>
        </div>

        <form role="search" onSubmit={(e) => e.preventDefault()} className="hidden lg:block" style={{ position: "relative", width: 280, flexShrink: 0 }}>
          <Search size={15} strokeWidth={2} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-brown-soft-2)", pointerEvents: "none" }} />
          <input type="text" placeholder="Search orders..." aria-label="Search orders" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="text-[13px]" style={{ width: "100%", height: 44, paddingLeft: 36, paddingRight: 14, borderRadius: 10, border: "1px solid rgba(51,31,46,0.1)", background: "#fff", color: "var(--color-brown)", outline: "none" }} />
        </form>
      </div>

      <form role="search" onSubmit={(e) => e.preventDefault()} className="lg:hidden" style={{ position: "relative", marginTop: -8 }}>
        <Search size={15} strokeWidth={2} style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", color: "var(--color-brown-soft-2)", pointerEvents: "none" }} />
        <input type="text" placeholder="Search by order ID, customer, or dish..." aria-label="Search orders" value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} className="text-[13px]" style={{ width: "100%", height: 44, paddingLeft: 36, paddingRight: 14, borderRadius: 10, border: "1px solid rgba(51,31,46,0.1)", background: "#fff", color: "var(--color-brown)", outline: "none" }} />
      </form>

      {showPrepList && <PrepListView orders={orders} />}

      {!showPrepList && viewMode === "pipeline" && <PipelineView orders={orders} statusOverrides={statusOverrides} onAction={handleOrderAction} getEffectiveStatus={getEffectiveStatus} />}

      {!showPrepList && viewMode === "list" && (paginated.length === 0 ? (
        <div className="card" style={{ textAlign: "center", padding: "80px 20px" }}>
          <Package size={48} strokeWidth={1.2} style={{ color: "var(--color-brown-soft-2)", margin: "0 auto 16px" }} />
          <div className="heading-md" style={{ marginBottom: 6 }}>No orders found</div>
          <div className="body-sm" style={{ marginBottom: 24 }}>Try a different filter or search term</div>
          <Link href="/dashboard" className="btn btn-ghost" style={{ display: "inline-flex" }}>Back to Dashboard</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {paginated.map((order) => {
            const effectiveStatus = getEffectiveStatus(order);
            const label = actionLabel(effectiveStatus);
            const isTerminal = effectiveStatus === "cancelled" || effectiveStatus === "rejected";
            const count = itemCount(order.items);
            const dateTime = order.time ? `${order.date} ${order.time}` : order.date;
            const bg = urgencyBackground(order.urgency ?? null);
            const isExpanded = expandedOrder === order.hash;
            return (
              <div key={order.hash} className="card card-interactive" style={{ display: "block", padding: 0, opacity: isTerminal ? 0.5 : 1, background: bg || "#fff" }}>
                <button type="button" onClick={() => setExpandedOrder(isExpanded ? null : order.hash)} style={{ display: "block", width: "100%", padding: "14px 16px", border: "none", background: "transparent", cursor: "pointer", textAlign: "left" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusDotColor(effectiveStatus), flexShrink: 0, transition: "background 0.3s ease" }} />
                    <span style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customer}</span>
                    <span className="caption tnum" style={{ flexShrink: 0 }}>{order.readyBy ? `Ready ${order.readyBy}` : order.date}</span>
                    <span className="tnum" style={{ fontSize: 14, fontWeight: 600, color: "var(--color-brown)", flexShrink: 0 }}>{order.price}</span>
                    <ChevronRight size={14} style={{ color: "var(--color-brown-soft-2)", flexShrink: 0, transform: isExpanded ? "rotate(90deg)" : "rotate(0deg)", transition: "transform 0.2s ease" }} />
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 6 }}>
                    <span className="caption" style={{ display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0 }}>{order.method === "delivery" ? <Truck size={14} /> : <ShoppingBag size={14} />}{order.method === "delivery" ? "Delivery" : "Pickup"}</span>
                    <span className="caption" style={{ flexShrink: 0 }}>&middot;</span>
                    <span className="caption" style={{ flexShrink: 0 }}>{count} {count === 1 ? "item" : "items"}</span>
                    {order.urgency === "overdue" && (<><span className="caption" style={{ flexShrink: 0 }}>&middot;</span><span style={{ fontSize: 11, fontWeight: 700, textTransform: "uppercase" as const, color: "var(--color-red-deep)", flexShrink: 0 }}>OVERDUE</span></>)}
                    <span className="caption" style={{ display: "none" }}>{dateTime}</span>
                    <span style={{ flex: 1 }} />
                    {label && (<span role="button" tabIndex={0} className="btn btn-sm btn-dark" style={{ minWidth: 80, transition: "all 0.2s ease" }} onClick={(e) => { e.stopPropagation(); handleOrderAction(order, effectiveStatus); }} onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.stopPropagation(); handleOrderAction(order, effectiveStatus); } }}>{label} &rarr;</span>)}
                  </div>
                </button>
                <div style={{ maxHeight: isExpanded ? 400 : 0, opacity: isExpanded ? 1 : 0, overflow: "hidden", transition: "max-height 0.3s ease, opacity 0.2s ease" }}>
                  <div style={{ borderTop: "1px solid rgba(51,31,46,0.06)", padding: "12px 16px 14px" }}>
                    <div style={{ marginBottom: 10 }}>
                      <div className="caption" style={{ fontWeight: 600, marginBottom: 6 }}>Items</div>
                      {order.items.slice(0, 3).map((item, i) => (<div key={i} style={{ display: "flex", alignItems: "center", padding: "4px 0" }}><span style={{ fontSize: 13, color: "var(--color-brown)" }}>{item.qty > 1 && <span className="tnum" style={{ color: "var(--color-brown-soft-2)", marginRight: 4 }}>{item.qty}×</span>}{item.name}</span></div>))}
                      {order.items.length > 3 && <span className="caption" style={{ fontStyle: "italic" }}>+{order.items.length - 3} more items</span>}
                    </div>
                    {order.hash === "#a8f2c1" && (<div style={{ display: "flex", gap: 8, alignItems: "flex-start", padding: "8px 10px", background: "var(--color-cream-deep)", borderRadius: 10, marginBottom: 10 }}><MessageSquare size={13} style={{ color: "var(--color-brown-soft-2)", flexShrink: 0, marginTop: 1 }} /><span style={{ fontSize: 12, color: "var(--color-brown-soft)", fontStyle: "italic" }}>&quot;Please make it extra spicy&quot;</span></div>)}
                    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      {order.payout && !isTerminal && <span className="caption tnum">Payout: {order.payout}</span>}
                      {isTerminal && order.cancelNote && <span className="caption">Cancelled {order.cancelNote}</span>}
                      <span style={{ flex: 1 }} />
                      <Link href={"/orders/" + linkId(order.hash)} style={{ display: "inline-flex", alignItems: "center", gap: 4, fontSize: 12, fontWeight: 600, color: "var(--color-red)", textDecoration: "none" }} onClick={(e) => e.stopPropagation()}>View full details <ExternalLink size={11} /></Link>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ))}

      {!showPrepList && viewMode === "list" && filtered.length > 0 && (
        <div className="flex items-center justify-between flex-wrap gap-3 caption">
          <div className="flex items-center gap-2"><span>Rows per page</span><select value={rowsPerPage} onChange={(e) => { setRowsPerPage(Number(e.target.value)); setPage(1); }} style={{ width: "auto", padding: "4px 8px", fontSize: 12, minHeight: 28, borderRadius: 6, border: "1px solid rgba(51,31,46,0.1)", background: "#fff", color: "var(--color-brown-soft)", cursor: "pointer" }}><option value={12}>12</option><option value={24}>24</option><option value={48}>48</option></select></div>
          <span className="tnum">{showingStart}–{showingEnd} of {filtered.length}</span>
          <div className="flex gap-1">{Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (<button key={p} onClick={() => setPage(p)} style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 36, minHeight: 36, width: 36, height: 36, borderRadius: 6, fontSize: 12, fontWeight: 600, border: p === page ? "none" : "1px solid rgba(51,31,46,0.1)", background: p === page ? "var(--color-brown)" : "#fff", color: p === page ? "var(--color-cream)" : "var(--color-brown-soft)", cursor: "pointer", transition: "all var(--t-fast) var(--ease-spring)" }}>{p}</button>))}</div>
        </div>
      )}

      {/* Bottom Sheet for Mobile Order Actions */}
      <BottomSheet isOpen={bottomSheetOrder !== null} onClose={() => setBottomSheetOrder(null)}>
        {bottomSheetOrder && (() => {
          const es = getEffectiveStatus(bottomSheetOrder);
          const label = actionLabel(es);
          const count = itemCount(bottomSheetOrder.items);
          return (
            <div>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
                <span className="heading-sm">Confirm Action</span>
                <button onClick={() => setBottomSheetOrder(null)} style={{ display: "flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, borderRadius: 6, border: "none", background: "transparent", cursor: "pointer", color: "var(--color-brown-soft-2)" }}><X size={16} strokeWidth={2} /></button>
              </div>
              <div style={{ padding: "14px 16px", background: "var(--color-cream)", borderRadius: 12, marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: statusDotColor(es), flexShrink: 0 }} />
                  <span style={{ fontSize: 15, fontWeight: 600, color: "var(--color-brown)", flex: 1 }}>{bottomSheetOrder.customer}</span>
                  <span className="tnum" style={{ fontSize: 15, fontWeight: 600, color: "var(--color-brown)" }}>{bottomSheetOrder.price}</span>
                </div>
                <div className="caption" style={{ marginBottom: 4 }}>{count} {count === 1 ? "item" : "items"} &middot; {bottomSheetOrder.method === "delivery" ? "Delivery" : "Pickup"}</div>
                <div style={{ display: "flex", flexDirection: "column", gap: 2, marginTop: 8 }}>
                  {bottomSheetOrder.items.map((item, i) => (<span key={i} style={{ fontSize: 13, color: "var(--color-brown-soft)" }}>{item.qty > 1 && <span className="tnum" style={{ marginRight: 4 }}>{item.qty}×</span>}{item.name}</span>))}
                </div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                <button className="btn btn-dark btn-block" onClick={confirmBottomSheetAction}>{label ? `${label} Order` : "Update Order"} &rarr;</button>
                <button className="btn btn-ghost btn-block" onClick={() => setBottomSheetOrder(null)}>Cancel</button>
              </div>
            </div>
          );
        })()}
      </BottomSheet>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Pipeline (Kanban) View                                             */
/* ------------------------------------------------------------------ */
function PipelineView({ orders: allOrders, statusOverrides, onAction, getEffectiveStatus }: { orders: Order[]; statusOverrides: Record<string, OrderStatus>; onAction: (order: Order, status: OrderStatus) => void; getEffectiveStatus: (order: Order) => OrderStatus }) {
  const columns = useMemo(() => pipelineColumns.map((col) => ({ ...col, orders: allOrders.filter((o) => col.match(statusOverrides[o.hash] || o.status)) })), [allOrders, statusOverrides]);
  return (
    <div className="pipeline-scroll" style={{ display: "flex", gap: 12, overflowX: "auto", paddingBottom: 4 }}>
      {columns.map((col) => (
        <div key={col.key} style={{ minWidth: 280, flex: "1 0 280px", display: "flex", flexDirection: "column", gap: 8 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "8px 12px", borderRadius: 10, background: "var(--color-cream-deep)" }}>
            <span style={{ width: 8, height: 8, borderRadius: "50%", background: col.color, flexShrink: 0 }} />
            <span style={{ fontSize: 13, fontWeight: 700, color: "var(--color-brown)", flex: 1 }}>{col.label}</span>
            <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 20, height: 20, padding: "0 6px", borderRadius: 9999, fontSize: 11, fontWeight: 700, fontVariantNumeric: "tabular-nums", background: "rgba(51,31,46,0.06)", color: "var(--color-brown-soft)" }}>{col.orders.length}</span>
          </div>
          {col.orders.length === 0 ? (<div style={{ padding: "24px 16px", textAlign: "center", borderRadius: 12, border: "1px dashed rgba(51,31,46,0.1)", color: "var(--color-brown-soft-2)", fontSize: 12 }}>No orders</div>) : col.orders.map((order) => {
            const es = getEffectiveStatus(order);
            const label = actionLabel(es);
            const summary = order.items.map((i) => i.qty > 1 ? `${i.qty}× ${i.name}` : i.name).join(", ");
            return (
              <div key={order.hash} className="card" style={{ padding: "12px 14px", borderLeft: `3px solid ${col.color}` }}>
                <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brown)", flex: 1, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{order.customer}</span>
                  <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brown)", flexShrink: 0 }}>{order.price}</span>
                </div>
                <div className="caption" style={{ marginBottom: 6, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{summary}</div>
                <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                  <span className="caption" style={{ display: "inline-flex", alignItems: "center", gap: 3 }}>{order.method === "delivery" ? <Truck size={11} /> : <ShoppingBag size={11} />}{order.method === "delivery" ? "Delivery" : "Pickup"}</span>
                  {order.time && (<><span className="caption">&middot;</span><span className="caption tnum">{order.time}</span></>)}
                  {order.urgency === "overdue" && <span style={{ fontSize: 10, fontWeight: 700, textTransform: "uppercase" as const, color: "var(--color-red-deep)", marginLeft: "auto" }}>OVERDUE</span>}
                </div>
                {label && <button className="btn btn-sm btn-dark btn-block" style={{ marginTop: 8, fontSize: 12 }} onClick={() => onAction(order, es)}>{label} &rarr;</button>}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Prep List View                                                     */
/* ------------------------------------------------------------------ */
function PrepListView({ orders: allOrders }: { orders: Order[] }) {
  const todayOrders = useMemo(() => allOrders.filter((o) => o.date === "Today" && o.status !== "cancelled" && o.status !== "rejected" && o.status !== "delivered" && o.status !== "pickedUp"), [allOrders]);
  const prepGroups = useMemo(() => {
    const groups: Record<string, { totalQty: number; customers: { name: string; qty: number; method: string; readyBy?: string }[] }> = {};
    for (const order of todayOrders) for (const item of order.items) { if (!groups[item.name]) groups[item.name] = { totalQty: 0, customers: [] }; groups[item.name].totalQty += item.qty; groups[item.name].customers.push({ name: order.customer, qty: item.qty, method: order.method === "delivery" ? "Delivery" : "Pickup", readyBy: order.readyBy }); }
    return Object.entries(groups).sort((a, b) => b[1].totalQty - a[1].totalQty).map(([name, data]) => ({ name, ...data }));
  }, [todayOrders]);

  if (prepGroups.length === 0) return (<div className="card" style={{ textAlign: "center", padding: "60px 20px" }}><ClipboardList size={40} strokeWidth={1.2} style={{ color: "var(--color-brown-soft-2)", margin: "0 auto 12px" }} /><div className="heading-md" style={{ marginBottom: 6 }}>Nothing to prep</div><div className="body-sm">No active orders for today.</div></div>);

  return (
    <div>
      <div className="flex items-center gap-2" style={{ marginBottom: 12 }}><ClipboardList size={16} strokeWidth={2} style={{ color: "var(--color-brown-soft-2)" }} /><span className="eyebrow">PREP LIST &mdash; Today&apos;s Orders</span></div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
        {prepGroups.map((group) => (
          <div key={group.name} className="card" style={{ padding: "14px 16px" }}>
            <div className="flex items-center gap-2" style={{ marginBottom: 8 }}>
              <span style={{ fontSize: 15, fontWeight: 700, color: "var(--color-brown)" }}>{group.name}</span>
              <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", minWidth: 24, height: 22, padding: "0 7px", borderRadius: 9999, fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums", background: "var(--color-cream-sunken)", color: "var(--color-brown-soft)" }}>{group.totalQty} total</span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              {group.customers.map((c, ci) => (
                <div key={ci} className="flex items-center gap-2" style={{ padding: "4px 8px", borderRadius: 8, background: "var(--color-cream)" }}>
                  <span className="tnum" style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brown)", minWidth: 24 }}>{c.qty}&times;</span>
                  <span style={{ fontSize: 13, fontWeight: 600, color: "var(--color-brown)", flex: 1 }}>{c.name}</span>
                  <span className="caption" style={{ display: "inline-flex", alignItems: "center", gap: 3, flexShrink: 0 }}>{c.method === "Delivery" ? <Truck size={11} /> : <ShoppingBag size={11} />}{c.method}</span>
                  {c.readyBy && <span className="caption tnum" style={{ flexShrink: 0, fontWeight: 600 }}>Ready {c.readyBy}</span>}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
