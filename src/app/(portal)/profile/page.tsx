/* eslint-disable @next/next/no-img-element */
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { Camera, X, Upload, ExternalLink } from "lucide-react";
import { useToast } from "@/components/ui/toast-provider";
import { SectionCard } from "@/components/ui/section-card";
import { chefProfile, allCuisines as ALL_CUISINES } from "@/lib/mock-data";

export default function ProfilePage() {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => { setLoaded(true); }, []);

  const { toast } = useToast();

  // Form state — initialized from centralized mock data
  const [businessName, setBusinessName] = useState(chefProfile.businessName);
  const [tagline, setTagline] = useState(chefProfile.tagline);
  const [bio, setBio] = useState(chefProfile.bio);
  const [story, setStory] = useState(chefProfile.story);
  const [inspires, setInspires] = useState(chefProfile.inspires);
  const [experience, setExperience] = useState(chefProfile.experience);
  const [cuisines, setCuisines] = useState(chefProfile.cuisines);
  const [cuisineSearch, setCuisineSearch] = useState("");
  const [cuisineDropdownOpen, setCuisineDropdownOpen] = useState(false);
  const cuisineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (cuisineRef.current && !cuisineRef.current.contains(e.target as Node)) {
        setCuisineDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Section collapse state
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    kitchen: true, about: true, cuisines: true, branding: false,
  });

  const toggleSection = (key: string) => {
    setOpenSections((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const removeCuisine = (c: string) => setCuisines((prev) => prev.filter((x) => x !== c));
  const addCuisine = (c: string) => { if (!cuisines.includes(c)) setCuisines((prev) => [...prev, c]); setCuisineSearch(""); };

  const filteredCuisines = ALL_CUISINES.filter(
    (c) => !cuisines.includes(c) && c.toLowerCase().includes(cuisineSearch.toLowerCase())
  );

  if (!loaded) {
    return (
      <div className="content-narrow section-stack">
        <div className="skeleton" style={{ height: 36, width: 180, borderRadius: 10 }} />
        <div className="skeleton" style={{ height: 100, borderRadius: 16 }} />
        {[0, 1, 2].map((i) => (
          <div key={i} className="skeleton" style={{ height: 60, borderRadius: 16 }} />
        ))}
      </div>
    );
  }

  return (
    <div className="content-narrow section-stack">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 8 }}>
        <div>
          <h1 className="heading-lg">{businessName || "Your Kitchen"}</h1>
          <div className="body-sm" style={{ marginTop: 2 }}>Manage your kitchen profile and settings</div>
        </div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          <Link href="/store-preview" className="btn btn-ghost btn-sm" style={{ gap: 4 }}>
            <ExternalLink size={14} /> Preview Store
          </Link>
          <button className="btn btn-dark btn-sm" onClick={() => toast("Profile saved")}>
            Save
          </button>
        </div>
      </div>

      {/* Profile Photo + Name — always visible */}
      <div className="card" style={{ display: "flex", alignItems: "center", gap: 20 }}>
        <div style={{ position: "relative", flexShrink: 0 }}>
          <img
            src={chefProfile.avatar}
            alt="Chef"
            style={{ width: 80, height: 80, borderRadius: "50%", objectFit: "cover" }}
          />
          <label
            style={{
              position: "absolute", bottom: -2, right: -2,
              width: 28, height: 28, borderRadius: "50%",
              background: "var(--color-brown)", color: "#fff",
              display: "grid", placeItems: "center", cursor: "pointer",
              border: "2px solid #fff",
            }}
          >
            <Camera size={13} />
            <input type="file" accept="image/*" style={{ display: "none" }} />
          </label>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 20, fontWeight: 700, color: "var(--color-brown)" }}>{businessName}</div>
          <div className="body-sm">{tagline || "Add a tagline"}</div>
          <div style={{ display: "flex", alignItems: "center", gap: 6, marginTop: 4 }}>
            <span className="dot dot-sage" />
            <span className="caption" style={{ fontWeight: 600, color: "var(--color-sage-deep)" }}>Live</span>
          </div>
        </div>
      </div>

      {/* Section: Your Kitchen */}
      <SectionCard
        title="Your Kitchen"
        subtitle="Business name, tagline, and experience"
        open={openSections.kitchen}
        onToggle={() => toggleSection("kitchen")}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label className="field-label">Business Name *</label>
            <input className="input" value={businessName} onChange={(e) => setBusinessName(e.target.value)} placeholder="Your kitchen name" />
            <div className="field-help">This is how customers will find you</div>
          </div>
          <div>
            <label className="field-label">Tagline</label>
            <input className="input" value={tagline} onChange={(e) => setTagline(e.target.value)} placeholder="e.g., Authentic Palestinian home cooking" maxLength={80} />
            <div className="field-help" style={{ display: "flex", justifyContent: "space-between" }}>
              <span>A short line that appears under your name</span>
              <span className="tnum">{tagline.length}/80</span>
            </div>
          </div>
          <div>
            <label className="field-label">Cooking Experience</label>
            <select className="select" value={experience} onChange={(e) => setExperience(e.target.value)}>
              <option value="1">Less than 1 year</option>
              <option value="3">1–3 years</option>
              <option value="5">3–5 years</option>
              <option value="8">5–10 years</option>
              <option value="10">10+ years</option>
            </select>
          </div>
        </div>
      </SectionCard>

      {/* Section: About You */}
      <SectionCard
        title="About You"
        subtitle="Bio, story, and what inspires your cooking"
        open={openSections.about}
        onToggle={() => toggleSection("about")}
      >
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <label className="field-label">Bio</label>
            <textarea className="textarea" value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short professional summary" rows={3} />
          </div>
          <div>
            <label className="field-label">Your Story</label>
            <textarea className="textarea" value={story} onChange={(e) => setStory(e.target.value)} placeholder="Share your culinary journey" rows={3} />
          </div>
          <div>
            <label className="field-label">What Inspires You</label>
            <textarea className="textarea" value={inspires} onChange={(e) => setInspires(e.target.value)} placeholder="What drives your passion for cooking" rows={2} />
          </div>
        </div>
      </SectionCard>

      {/* Section: Cuisines */}
      <SectionCard
        title="Cuisines & Specialties"
        subtitle="What types of food do you specialize in?"
        open={openSections.cuisines}
        onToggle={() => toggleSection("cuisines")}
      >
        <div>
          {/* Selected cuisines */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
            {cuisines.map((c) => (
              <span key={c} className="pill" style={{ gap: 4, paddingRight: 6 }}>
                {c}
                <button
                  onClick={() => removeCuisine(c)}
                  style={{ background: "none", border: "none", cursor: "pointer", padding: 0, display: "grid", placeItems: "center", color: "var(--color-brown-soft-2)" }}
                >
                  <X size={12} />
                </button>
              </span>
            ))}
          </div>
          {/* Add cuisine */}
          <div style={{ position: "relative" }} ref={cuisineRef}>
            <input
              className="input"
              value={cuisineSearch}
              onChange={(e) => { setCuisineSearch(e.target.value); setCuisineDropdownOpen(true); }}
              onFocus={() => setCuisineDropdownOpen(true)}
              placeholder="Search and add cuisines..."
            />
            {cuisineDropdownOpen && cuisineSearch && filteredCuisines.length > 0 && (
              <div className="card" style={{ position: "absolute", top: "100%", left: 0, right: 0, marginTop: 4, padding: 4, zIndex: 10 }}>
                {filteredCuisines.slice(0, 5).map((c) => (
                  <button
                    key={c}
                    onClick={() => { addCuisine(c); setCuisineDropdownOpen(false); }}
                    style={{
                      display: "block", width: "100%", textAlign: "left",
                      padding: "8px 12px", fontSize: 14, color: "var(--color-brown)",
                      background: "transparent", border: "none", borderRadius: 8,
                      cursor: "pointer",
                    }}
                    onMouseEnter={(e) => { e.currentTarget.style.background = "var(--color-cream-deep)"; }}
                    onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
                  >
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </SectionCard>

      {/* Section: Branding */}
      <SectionCard
        title="Branding"
        subtitle="Banner image for your storefront"
        open={openSections.branding}
        onToggle={() => toggleSection("branding")}
      >
        <div>
          <label className="field-label">Banner Image</label>
          <div
            style={{
              border: "2px dashed rgba(51,31,46,0.12)", borderRadius: 12,
              height: 160, display: "flex", flexDirection: "column",
              alignItems: "center", justifyContent: "center", gap: 8,
              cursor: "pointer", background: "var(--color-cream-deep)",
              transition: "border-color var(--t-fast)",
            }}
          >
            <Upload size={24} style={{ color: "var(--color-brown-soft-2)" }} />
            <span className="body-sm">Click to upload or drag and drop</span>
            <span className="caption">Recommended: 1920 × 600px</span>
          </div>
        </div>
      </SectionCard>


      {/* Bottom save */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, paddingBottom: 40 }}>
        <button className="btn btn-ghost" onClick={() => toast("Changes discarded", "info")}>Discard</button>
        <button className="btn btn-dark" onClick={() => toast("Profile saved")}>Save Changes</button>
      </div>
    </div>
  );
}

