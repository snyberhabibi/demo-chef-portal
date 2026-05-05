export type TutorialLanguage = "en" | "ar" | "ur";

export interface LanguageOption {
  code: TutorialLanguage;
  label: string;
  nativeLabel: string;
  dir: "ltr" | "rtl";
}

export const TUTORIAL_LANGUAGES: LanguageOption[] = [
  { code: "en", label: "English", nativeLabel: "English", dir: "ltr" },
  { code: "ar", label: "Arabic", nativeLabel: "العربية", dir: "rtl" },
  { code: "ur", label: "Urdu", nativeLabel: "اردو", dir: "rtl" },
];

const LANGUAGE_STORAGE_KEY = "yb-tutorial-language";

export function getSavedLanguage(): TutorialLanguage {
  try {
    const saved = localStorage.getItem(LANGUAGE_STORAGE_KEY);
    if (saved === "ar" || saved === "ur" || saved === "en") return saved;
  } catch {
    // ignore
  }
  return "en";
}

export function saveLanguage(lang: TutorialLanguage): void {
  try {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, lang);
  } catch {
    // ignore
  }
}

export function isRtl(lang: TutorialLanguage): boolean {
  return lang === "ar" || lang === "ur";
}

