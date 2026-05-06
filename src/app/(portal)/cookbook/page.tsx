/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { dishes, type Dish, type Recipe } from "@/lib/mock-data";
import { useDesignMode } from "@/lib/design-mode";

/* ------------------------------------------------------------------ */
/*  Cookbook Page — Private chef recipes per portion size               */
/* ------------------------------------------------------------------ */

export default function CookbookPage() {
  const { mode } = useDesignMode();
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

  if (!loaded) {
    return (
      <div className="content-default section-stack">
        <div className="skeleton" style={{ height: 40, borderRadius: 12, maxWidth: 260 }} />
        <div className="skeleton" style={{ height: 44, borderRadius: 10 }} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 80, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="content-default section-stack page-enter">
      {/* Header */}
      <div>
        <h1 className={`heading-lg${isB ? " heading-gradient" : ""}`}>Cookbook</h1>
        <p className="body-sm" style={{ marginTop: 2 }}>
          Your private kitchen recipes
        </p>
      </div>

      {/* Search + count */}
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
              left: 12,
              top: "50%",
              transform: "translateY(-50%)",
              color: "var(--color-brown-soft-2)",
              pointerEvents: "none",
            }}
          />
          <input
            type="text"
            placeholder="Search dishes..."
            aria-label="Search dishes with recipes"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="input"
            style={{
              width: "100%",
              height: 44,
              paddingLeft: 36,
              paddingRight: 14,
              borderRadius: 10,
            }}
          />
        </form>
        <span
          className="caption tnum"
          style={{ flexShrink: 0, fontWeight: 600 }}
        >
          {dishesWithRecipes.length} {dishesWithRecipes.length === 1 ? "dish" : "dishes"} with recipes
        </span>
      </div>

      {/* Dish list */}
      {dishesWithRecipes.length === 0 ? (
        <div
          className="card"
          style={{ textAlign: "center", padding: "80px 20px" }}
        >
          <BookOpen
            size={48}
            strokeWidth={1.2}
            style={{ color: "var(--color-brown-soft-2)", margin: "0 auto 16px" }}
          />
          <div className="heading-md" style={{ marginBottom: 6 }}>
            No recipes found
          </div>
          <div className="body-sm">
            {search ? "Try a different search term" : "Add recipes to your dishes to see them here"}
          </div>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {dishesWithRecipes.map((dish) => (
            <DishRecipeCard
              key={dish.id}
              dish={dish}
              isExpanded={expandedDish === dish.id}
              onToggle={() =>
                setExpandedDish(expandedDish === dish.id ? null : dish.id)
              }
              isB={isB}
            />
          ))}
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Dish Recipe Card                                                    */
/* ------------------------------------------------------------------ */
function DishRecipeCard({
  dish,
  isExpanded,
  onToggle,
  isB,
}: {
  dish: Dish;
  isExpanded: boolean;
  onToggle: () => void;
  isB: boolean;
}) {
  const recipes = dish.recipes || [];
  const [activePortionIdx, setActivePortionIdx] = useState(0);
  const activeRecipe: Recipe | undefined = recipes[activePortionIdx];

  return (
    <div
      className="card"
      style={{
        padding: 0,
        overflow: "hidden",
        borderRadius: isB ? 16 : undefined,
        ...(isB ? { boxShadow: "0 2px 12px rgba(161,120,97,0.08)" } : {}),
      }}
    >
      {/* Collapsed header */}
      <button
        type="button"
        onClick={onToggle}
        style={{
          display: "flex",
          alignItems: "center",
          gap: 14,
          width: "100%",
          padding: "14px 16px",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          textAlign: "left",
        }}
      >
        <img
          src={dish.image}
          alt={dish.name}
          style={{
            width: 60,
            height: 60,
            borderRadius: 10,
            objectFit: "cover",
            flexShrink: 0,
          }}
        />
        <div style={{ flex: 1, minWidth: 0 }}>
          <div
            style={{
              fontSize: 15,
              fontWeight: 600,
              color: "var(--color-brown)",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap",
            }}
          >
            {dish.name}
          </div>
          <div className="caption" style={{ marginTop: 2 }}>
            ${dish.price.toFixed(2)} &middot;{" "}
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

      {/* Expanded recipe details */}
      <div
        style={{
          overflow: "hidden",
          transition: "max-height 0.3s ease, opacity 0.2s ease",
          maxHeight: isExpanded ? 2000 : 0,
          opacity: isExpanded ? 1 : 0,
        }}
      >
        <div
          style={{
            borderTop: "1px solid rgba(51,31,46,0.06)",
            padding: "16px 16px 20px",
          }}
        >
          {/* Portion size tabs */}
          {recipes.length > 1 && (
            <div
              className="flex gap-2 flex-wrap"
              style={{ marginBottom: 20 }}
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
                      padding: "0 16px",
                      height: 34,
                      borderRadius: 9999,
                      fontSize: 13,
                      fontWeight: 600,
                      cursor: "pointer",
                      border: `1.5px solid ${
                        isActive
                          ? isB
                            ? "#df4746"
                            : "var(--color-brown)"
                          : "rgba(51,31,46,0.12)"
                      }`,
                      background: isActive
                        ? isB
                          ? "#df4746"
                          : "var(--color-brown)"
                        : "transparent",
                      color: isActive
                        ? isB
                          ? "#fff"
                          : "var(--color-cream)"
                        : "var(--color-brown-soft)",
                      transition: "all var(--t-fast) var(--ease-spring)",
                    }}
                  >
                    {recipe.portionSize}
                  </button>
                );
              })}
            </div>
          )}

          {/* Single portion label when only one recipe */}
          {recipes.length === 1 && (
            <div className="eyebrow" style={{ marginBottom: 14 }}>
              {recipes[0].portionSize}
            </div>
          )}

          {activeRecipe && (
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr",
                gap: 20,
              }}
              className="cookbook-recipe-grid"
            >
              {/* Ingredients */}
              <div>
                <div
                  className="eyebrow"
                  style={{ marginBottom: 10 }}
                >
                  Ingredients
                </div>
                <div
                  style={{
                    borderRadius: 10,
                    border: "1px solid rgba(51,31,46,0.06)",
                    overflow: "hidden",
                  }}
                >
                  {activeRecipe.ingredients.map((ing, i) => (
                    <div
                      key={i}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        padding: "8px 14px",
                        fontSize: 13,
                        borderBottom:
                          i < activeRecipe.ingredients.length - 1
                            ? "1px solid rgba(51,31,46,0.04)"
                            : "none",
                        background:
                          i % 2 === 0 ? "#fff" : "var(--color-cream)",
                      }}
                    >
                      <span
                        style={{
                          color: "var(--color-brown)",
                          fontWeight: 500,
                        }}
                      >
                        {ing.name}
                      </span>
                      <span
                        className="tnum"
                        style={{
                          color: "var(--color-brown-soft)",
                          fontWeight: 600,
                          flexShrink: 0,
                          marginLeft: 12,
                        }}
                      >
                        {ing.quantity}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Steps */}
              <div>
                <div
                  className="eyebrow"
                  style={{ marginBottom: 10 }}
                >
                  Steps
                </div>
                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 8,
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
                        style={{
                          display: "inline-flex",
                          alignItems: "center",
                          justifyContent: "center",
                          width: 24,
                          height: 24,
                          minWidth: 24,
                          borderRadius: "50%",
                          background: isB
                            ? "rgba(223,71,70,0.08)"
                            : "var(--color-cream-deep)",
                          color: isB
                            ? "#df4746"
                            : "var(--color-brown-soft)",
                          fontSize: 11,
                          fontWeight: 700,
                          flexShrink: 0,
                          marginTop: 1,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        style={{
                          fontSize: 13,
                          color: "var(--color-brown)",
                          lineHeight: 1.5,
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

      {/* Responsive grid for ingredients + steps side-by-side on desktop */}
      <style jsx>{`
        @media (min-width: 768px) {
          .cookbook-recipe-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
