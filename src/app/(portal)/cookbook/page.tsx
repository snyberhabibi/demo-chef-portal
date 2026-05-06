/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { dishes, type Dish, type Recipe } from "@/lib/mock-data";
import { useDesignMode } from "@/lib/design-mode";
import { EmptyState } from "@/components/ui/empty-state";

/* ------------------------------------------------------------------ */
/*  Cookbook Page — "My Cookbook" — grandma's kitchen notebook feel       */
/* ------------------------------------------------------------------ */

export default function CookbookPage() {
  const { mode, isNewApplicant } = useDesignMode();
  const isB = mode === "b";

  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 300);
    return () => clearTimeout(t);
  }, []);

  const [search, setSearch] = useState("");
  const [expandedDish, setExpandedDish] = useState<string | null>(null);

  const dishesWithRecipes = useMemo(() => {
    let list = dishes.filter((d) => d.recipes && d.recipes.length > 0);
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter((d) => d.name.toLowerCase().includes(q));
    }
    return list;
  }, [search]);

  /* Accent color — terracotta in both modes */
  const accent = isB ? "#a17861" : "var(--color-terracotta)";

  if (!loaded) {
    return (
      <div className="content-default section-stack">
        <div className="skeleton" style={{ height: 40, borderRadius: 12, maxWidth: 260 }} />
        <div className="skeleton" style={{ height: 44, borderRadius: 14 }} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  // New Applicant: show empty state
  if (isNewApplicant) {
    return (
      <div className="content-default section-stack page-enter">
        <EmptyState
          icon={BookOpen}
          heading="Your cookbook is empty"
          subtitle="Add recipes to your dishes and they will appear here for quick reference while cooking."
        />
      </div>
    );
  }

  return (
    <div className="content-default section-stack page-enter">
      {/* ── Header — inside-cover-of-a-recipe-book feel ── */}
      <div style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
        <BookOpen
          size={28}
          strokeWidth={1.4}
          style={{ color: accent, flexShrink: 0, marginTop: 2 }}
        />
        <div>
          <h1
            className="cookbook-title"
            style={{
              fontSize: 26,
              lineHeight: 1.15,
              color: "var(--color-brown)",
            }}
          >
            My Cookbook
          </h1>
          <p
            className="cookbook-subtitle"
            style={{ marginTop: 4, fontSize: 14, lineHeight: 1.5 }}
          >
            Your private kitchen recipes — passed down, perfected, and ready to cook
          </p>
        </div>
      </div>

      {/* ── Search bar — soft, rounded, italic placeholder ── */}
      <div className="flex items-center gap-3 flex-wrap">
        <form
          role="search"
          onSubmit={(e) => e.preventDefault()}
          style={{ position: "relative", flex: 1, minWidth: 200 }}
        >
          <Search
            size={15}
            strokeWidth={2}
            style={{
              position: "absolute",
              left: 14,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-brown-soft-2)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search your recipes..."
            aria-label="Search dishes with recipes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{
              width: "100%",
              height: 44,
              paddingLeft: 40,
              paddingRight: 14,
              borderRadius: 14,
              border: "1px solid rgba(51,31,46,0.08)",
              fontStyle: search ? "normal" : "italic",
            }}
          />
        </form>
        <span
          className="caption tnum"
          style={{ flexShrink: 0, fontWeight: 600 }}
        >
          {dishesWithRecipes.length}{" "}
          {dishesWithRecipes.length === 1 ? "recipe" : "recipes"}
        </span>
      </div>

      {/* ── Empty state — warm and inviting ── */}
      {dishesWithRecipes.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "80px 20px",
            background: "#faf8f2",
            borderRadius: 16,
          }}
        >
          <BookOpen
            size={48}
            strokeWidth={1.2}
            style={{ color: accent, margin: "0 auto 16px" }}
          />
          <div
            className="cookbook-title"
            style={{
              fontSize: 20,
              color: "var(--color-brown)",
              marginBottom: 6,
              fontStyle: "italic",
            }}
          >
            {search ? "No recipes found" : "Your cookbook is empty"}
          </div>
          <div className="body-sm" style={{ maxWidth: 280, margin: "0 auto" }}>
            {search
              ? "Try a different search term"
              : "Add recipes to your dishes and they\u2019ll appear here"}
          </div>
        </div>
      ) : (
        /* ── Dish list — notebook pages ── */
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          {dishesWithRecipes.map((dish) => (
            <DishRecipeCard
              key={dish.id}
              dish={dish}
              isExpanded={expandedDish === dish.id}
              onToggle={() =>
                setExpandedDish(expandedDish === dish.id ? null : dish.id)
              }
              isB={isB}
              accent={accent}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dish Recipe Card — a page torn from a notebook                      */
/* ------------------------------------------------------------------ */
function DishRecipeCard({
  dish,
  isExpanded,
  onToggle,
  isB,
  accent,
}: {
  dish: Dish;
  isExpanded: boolean;
  onToggle: () => void;
  isB: boolean;
  accent: string;
}) {
  const recipes = dish.recipes || [];
  const [activePortionIdx, setActivePortionIdx] = useState(0);
  const activeRecipe: Recipe | undefined = recipes[activePortionIdx];

  return (
    <div
      style={{
        background: "#faf8f2",
        borderRadius: 0,
        borderBottom: "1px dashed rgba(51,31,46,0.12)",
        padding: 0,
        overflow: "hidden",
      }}
    >
      {/* ── Collapsed header ── */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          width: "100%",
          padding: "16px 4px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        {/* Round photo — like a sticker on a notebook page */}
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            width: 60,
            height: 60,
            borderRadius: "50%",
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            className="cookbook-dish-name"
            style={{
              color: "var(--color-brown)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {dish.name}
          </div>
          <div
            className="caption"
            style={{
              marginTop: 2,
              fontFamily: "var(--font-serif), Georgia, serif",
            }}
          >
            {dish.cuisine} &middot;{" "}
            {recipes.length} {recipes.length === 1 ? "portion size" : "portion sizes"}
          </div>
        </div>
        {isExpanded ? (
          <ChevronUp
            size={16}
            style={{ color: "var(--color-brown-soft-2)", flexShrink: 0 }}
          />
        ) : (
          <ChevronDown
            size={16}
            style={{ color: "var(--color-brown-soft-2)", flexShrink: 0 }}
          />
        )}
      </button>

      {/* ── Expanded recipe details ── */}
      <div
        style={{
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.2s ease",
          maxHeight: isExpanded ? 2000 : 0,
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div style={{ padding: "4px 4px 24px" }}>
          {/* ── Portion tabs — underline style, like chapter headings ── */}
          {recipes.length > 1 && (
            <div
              style={{
                display: "flex",
                gap: 20,
                marginBottom: 24,
                borderBottom: "1px solid rgba(51,31,46,0.06)",
                paddingBottom: 0,
              }}
            >
              {recipes.map((recipe, idx) => {
                const isActive = idx === activePortionIdx;
                return (
                  <button
                    key={recipe.portionSize}
                    onClick={() => setActivePortionIdx(idx)}
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      padding: "8px 4px",
                      fontSize: 14,
                      fontFamily: "var(--font-serif), Georgia, serif",
                      fontWeight: isActive ? 600 : 400,
                      cursor: "pointer",
                      border: "none",
                      background: "transparent",
                      color: isActive ? accent : "var(--color-brown-soft)",
                      borderBottom: isActive
                        ? `2px solid ${accent}`
                        : "2px solid transparent",
                      marginBottom: -1,
                      transition: "all var(--t-fast) var(--ease-spring)",
                    }}
                  >
                    {recipe.portionSize}
                  </button>
                );
              })}
            </div>
          )}

          {/* Single portion label */}
          {recipes.length === 1 && (
            <div
              className="cookbook-subtitle"
              style={{
                marginBottom: 18,
                fontSize: 13,
                fontWeight: 500,
              }}
            >
              {recipes[0].portionSize}
            </div>
          )}

          {activeRecipe && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 24,
                padding: "0 4px",
              }}
              className="cookbook-recipe-grid"
            >
              {/* ── Ingredients — bullet list with terracotta dots ── */}
              <div>
                <div
                  className="cookbook-section-header"
                  style={{ marginBottom: 12 }}
                >
                  Ingredients
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 6,
                  }}
                >
                  {activeRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: 10,
                      }}
                    >
                      <span className="cookbook-ingredient-dot" />
                      <span
                        style={{
                          fontSize: 14,
                          color: "var(--color-brown)",
                          lineHeight: 1.5,
                        }}
                      >
                        {ing.name}
                        {ing.quantity && (
                          <>
                            {" — "}
                            <span style={{ fontWeight: 600 }}>{ing.quantity}</span>
                          </>
                        )}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Divider — thin terracotta rule ── */}
              <hr
                style={{
                  border: "none",
                  height: 1,
                  background: accent,
                  opacity: 0.15,
                  margin: 0,
                }}
              />

              {/* ── Method — handwritten-style step numbers ── */}
              <div>
                <div
                  className="cookbook-section-header"
                  style={{ marginBottom: 12 }}
                >
                  Method
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 12,
                  }}
                >
                  {activeRecipe.steps.map((step, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        gap: 10,
                        alignItems: "flex-start",
                      }}
                    >
                      <span
                        className="cookbook-step-number"
                        style={{
                          fontSize: 16,
                          lineHeight: 1.5,
                          minWidth: 20,
                          textAlign: "right",
                          flexShrink: 0,
                        }}
                      >
                        {i + 1}.
                      </span>
                      <span
                        style={{
                          fontSize: 14,
                          color: "var(--color-brown)",
                          lineHeight: 1.7,
                        }}
                      >
                        {step}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Responsive grid — ingredients + method side-by-side on desktop */}
      <style jsx>{`
        @media (min-width: 768px) {
          .cookbook-recipe-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .cookbook-recipe-grid hr {
            display: none;
          }
        }
      `}</style>
    </div>
  );
}
