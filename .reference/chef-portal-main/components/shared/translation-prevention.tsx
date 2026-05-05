"use client";

import { useEffect } from "react";

/**
 * Component to prevent browser translation by adding meta tags
 * This helps prevent DOM manipulation issues when Chrome's translation feature is used
 */
export function TranslationPrevention() {
  useEffect(() => {
    // Add meta tag to prevent Google Translate
    const metaTag = document.createElement("meta");
    metaTag.name = "google";
    metaTag.content = "notranslate";
    
    // Check if meta tag already exists
    const existingMeta = document.querySelector('meta[name="google"][content="notranslate"]');
    if (!existingMeta) {
      document.head.appendChild(metaTag);
    }

    // Also set translate attribute on document element if not already set
    if (document.documentElement.getAttribute("translate") !== "no") {
      document.documentElement.setAttribute("translate", "no");
    }

    // Cleanup function
    return () => {
      // Don't remove the meta tag on cleanup as it should persist
    };
  }, []);

  return null;
}

