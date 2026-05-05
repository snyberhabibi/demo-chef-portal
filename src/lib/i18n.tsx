"use client";
import { createContext, useContext, useState, ReactNode } from "react";

type Locale = "en" | "ar" | "ur" | "es";

const translations: Record<Locale, Record<string, string>> = {
  en: {
    "nav.dashboard": "Dashboard",
    "nav.orders": "Orders",
    "nav.reviews": "Reviews",
    "nav.dishes": "Dishes",
    "nav.bundles": "Bundles",
    "nav.sections": "Menu Sections",
    "nav.operations": "Operations & Hours",
    "nav.pickup": "Pickup Address",
    "nav.payments": "Payments",
    "nav.integrations": "Integrations",
    "nav.profile": "Profile",
    "nav.settings": "Settings",
    "nav.help": "Help Center",
    "dashboard.greeting": "Good evening",
    "dashboard.onboarding": "Onboarding",
    "dashboard.dashboard": "Dashboard",
    "dashboard.orders_month": "Orders This Month",
    "dashboard.revenue_month": "Revenue This Month",
    "dashboard.active_dishes": "Active Dishes",
    "dashboard.avg_rating": "Avg Rating",
    "dashboard.recent_orders": "Recent Orders",
    "dashboard.view_all": "View all",
    "dashboard.create_dish": "Create Dish",
    "dashboard.view_store": "View My Store",
    "dashboard.manage_hours": "Manage Hours",
    "orders.confirm": "Confirm",
    "orders.prep": "Prep",
    "orders.ready": "Ready",
    "orders.hand_off": "Hand Off",
    "orders.delivery": "Delivery",
    "orders.pickup": "Pickup",
    "common.save": "Save",
    "common.discard": "Discard",
    "common.continue": "Continue",
    "common.back": "Back",
    "common.cancel": "Cancel",
    "common.search": "Search",
    "common.coming_soon": "Coming soon",
    "store.live": "Live",
    "store.view_store": "View My Store",
  },
  ar: {
    "nav.dashboard": "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645",
    "nav.orders": "\u0627\u0644\u0637\u0644\u0628\u0627\u062a",
    "nav.reviews": "\u0627\u0644\u062a\u0642\u064a\u064a\u0645\u0627\u062a",
    "nav.dishes": "\u0627\u0644\u0623\u0637\u0628\u0627\u0642",
    "nav.bundles": "\u0627\u0644\u0628\u0627\u0642\u0627\u062a",
    "nav.sections": "\u0623\u0642\u0633\u0627\u0645 \u0627\u0644\u0642\u0627\u0626\u0645\u0629",
    "nav.operations": "\u0633\u0627\u0639\u0627\u062a \u0627\u0644\u0639\u0645\u0644",
    "nav.pickup": "\u0639\u0646\u0648\u0627\u0646 \u0627\u0644\u0627\u0633\u062a\u0644\u0627\u0645",
    "nav.payments": "\u0627\u0644\u0645\u062f\u0641\u0648\u0639\u0627\u062a",
    "nav.integrations": "\u0627\u0644\u062a\u0643\u0627\u0645\u0644\u0627\u062a",
    "nav.profile": "\u0627\u0644\u0645\u0644\u0641 \u0627\u0644\u0634\u062e\u0635\u064a",
    "nav.settings": "\u0627\u0644\u0625\u0639\u062f\u0627\u062f\u0627\u062a",
    "nav.help": "\u0645\u0631\u0643\u0632 \u0627\u0644\u0645\u0633\u0627\u0639\u062f\u0629",
    "dashboard.greeting": "\u0645\u0633\u0627\u0621 \u0627\u0644\u062e\u064a\u0631",
    "dashboard.onboarding": "\u0627\u0644\u0628\u062f\u0627\u064a\u0629",
    "dashboard.dashboard": "\u0644\u0648\u062d\u0629 \u0627\u0644\u062a\u062d\u0643\u0645",
    "dashboard.orders_month": "\u0637\u0644\u0628\u0627\u062a \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
    "dashboard.revenue_month": "\u0625\u064a\u0631\u0627\u062f\u0627\u062a \u0647\u0630\u0627 \u0627\u0644\u0634\u0647\u0631",
    "dashboard.active_dishes": "\u0627\u0644\u0623\u0637\u0628\u0627\u0642 \u0627\u0644\u0646\u0634\u0637\u0629",
    "dashboard.avg_rating": "\u0645\u062a\u0648\u0633\u0637 \u0627\u0644\u062a\u0642\u064a\u064a\u0645",
    "dashboard.recent_orders": "\u0623\u062d\u062f\u062b \u0627\u0644\u0637\u0644\u0628\u0627\u062a",
    "dashboard.view_all": "\u0639\u0631\u0636 \u0627\u0644\u0643\u0644",
    "dashboard.create_dish": "\u0625\u0646\u0634\u0627\u0621 \u0637\u0628\u0642",
    "dashboard.view_store": "\u0639\u0631\u0636 \u0645\u062a\u062c\u0631\u064a",
    "dashboard.manage_hours": "\u0625\u062f\u0627\u0631\u0629 \u0627\u0644\u0633\u0627\u0639\u0627\u062a",
    "orders.confirm": "\u062a\u0623\u0643\u064a\u062f",
    "orders.prep": "\u062a\u062d\u0636\u064a\u0631",
    "orders.ready": "\u062c\u0627\u0647\u0632",
    "orders.hand_off": "\u062a\u0633\u0644\u064a\u0645",
    "orders.delivery": "\u062a\u0648\u0635\u064a\u0644",
    "orders.pickup": "\u0627\u0633\u062a\u0644\u0627\u0645",
    "common.save": "\u062d\u0641\u0638",
    "common.discard": "\u062a\u062c\u0627\u0647\u0644",
    "common.continue": "\u0645\u062a\u0627\u0628\u0639\u0629",
    "common.back": "\u0631\u062c\u0648\u0639",
    "common.cancel": "\u0625\u0644\u063a\u0627\u0621",
    "common.search": "\u0628\u062d\u062b",
    "common.coming_soon": "\u0642\u0631\u064a\u0628\u0627\u064b",
    "store.live": "\u0645\u0628\u0627\u0634\u0631",
    "store.view_store": "\u0639\u0631\u0636 \u0645\u062a\u062c\u0631\u064a",
  },
  ur: {
    "nav.dashboard": "\u0688\u06cc\u0634 \u0628\u0648\u0631\u0688",
    "nav.orders": "\u0622\u0631\u0688\u0631\u0632",
    "nav.reviews": "\u062c\u0627\u0626\u0632\u06d2",
    "nav.dishes": "\u067e\u06a9\u0648\u0627\u0646",
    "nav.bundles": "\u0628\u0646\u0688\u0644\u0632",
    "nav.sections": "\u0645\u06cc\u0646\u0648 \u0633\u06cc\u06a9\u0634\u0646\u0632",
    "nav.operations": "\u0627\u0648\u0642\u0627\u062a \u06a9\u0627\u0631",
    "nav.pickup": "\u067e\u06a9 \u0627\u067e \u0627\u06cc\u0688\u0631\u06cc\u0633",
    "nav.payments": "\u0627\u062f\u0627\u0626\u06cc\u06af\u06cc\u0627\u06ba",
    "nav.integrations": "\u0627\u0646\u0679\u06cc\u06af\u0631\u06cc\u0634\u0646\u0632",
    "nav.profile": "\u067e\u0631\u0648\u0641\u0627\u0626\u0644",
    "nav.settings": "\u0633\u06cc\u0679\u0646\u06af\u0632",
    "nav.help": "\u0645\u062f\u062f \u0645\u0631\u06a9\u0632",
    "dashboard.greeting": "\u0627\u0644\u0633\u0644\u0627\u0645 \u0639\u0644\u06cc\u06a9\u0645",
    "dashboard.onboarding": "\u0622\u063a\u0627\u0632",
    "dashboard.dashboard": "\u0688\u06cc\u0634 \u0628\u0648\u0631\u0688",
    "dashboard.orders_month": "\u0627\u0633 \u0645\u0627\u06c1 \u06a9\u06d2 \u0622\u0631\u0688\u0631\u0632",
    "dashboard.revenue_month": "\u0627\u0633 \u0645\u0627\u06c1 \u06a9\u06cc \u0622\u0645\u062f\u0646\u06cc",
    "dashboard.active_dishes": "\u0641\u0639\u0627\u0644 \u067e\u06a9\u0648\u0627\u0646",
    "dashboard.avg_rating": "\u0627\u0648\u0633\u0637 \u0631\u06cc\u0679\u0646\u06af",
    "dashboard.recent_orders": "\u062d\u0627\u0644\u06cc\u06c1 \u0622\u0631\u0688\u0631\u0632",
    "dashboard.view_all": "\u0633\u0628 \u062f\u06cc\u06a9\u06be\u06cc\u06ba",
    "dashboard.create_dish": "\u067e\u06a9\u0648\u0627\u0646 \u0628\u0646\u0627\u0626\u06cc\u06ba",
    "dashboard.view_store": "\u0627\u067e\u0646\u0627 \u0627\u0633\u0679\u0648\u0631 \u062f\u06cc\u06a9\u06be\u06cc\u06ba",
    "dashboard.manage_hours": "\u0627\u0648\u0642\u0627\u062a \u06a9\u0627 \u0627\u0646\u062a\u0638\u0627\u0645",
    "orders.confirm": "\u062a\u0635\u062f\u06cc\u0642",
    "orders.prep": "\u062a\u06cc\u0627\u0631\u06cc",
    "orders.ready": "\u062a\u06cc\u0627\u0631",
    "orders.hand_off": "\u062d\u0648\u0627\u0644\u06d2",
    "orders.delivery": "\u0688\u0644\u06cc\u0648\u0631\u06cc",
    "orders.pickup": "\u067e\u06a9 \u0627\u067e",
    "common.save": "\u0645\u062d\u0641\u0648\u0638",
    "common.discard": "\u0645\u0646\u0633\u0648\u062e",
    "common.continue": "\u062c\u0627\u0631\u06cc \u0631\u06a9\u06be\u06cc\u06ba",
    "common.back": "\u0648\u0627\u067e\u0633",
    "common.cancel": "\u0645\u0646\u0633\u0648\u062e",
    "common.search": "\u062a\u0644\u0627\u0634",
    "common.coming_soon": "\u062c\u0644\u062f \u0622\u0631\u06c1\u0627 \u06c1\u06d2",
    "store.live": "\u0644\u0627\u0626\u06cc\u0648",
    "store.view_store": "\u0627\u067e\u0646\u0627 \u0627\u0633\u0679\u0648\u0631 \u062f\u06cc\u06a9\u06be\u06cc\u06ba",
  },
  es: {
    "nav.dashboard": "Panel",
    "nav.orders": "Pedidos",
    "nav.reviews": "Rese\u00f1as",
    "nav.dishes": "Platillos",
    "nav.bundles": "Paquetes",
    "nav.sections": "Secciones del Men\u00fa",
    "nav.operations": "Horarios",
    "nav.pickup": "Direcci\u00f3n de Recogida",
    "nav.payments": "Pagos",
    "nav.integrations": "Integraciones",
    "nav.profile": "Perfil",
    "nav.settings": "Configuraci\u00f3n",
    "nav.help": "Centro de Ayuda",
    "dashboard.greeting": "Buenas tardes",
    "dashboard.onboarding": "Inicio",
    "dashboard.dashboard": "Panel",
    "dashboard.orders_month": "Pedidos este mes",
    "dashboard.revenue_month": "Ingresos este mes",
    "dashboard.active_dishes": "Platillos activos",
    "dashboard.avg_rating": "Calificaci\u00f3n",
    "dashboard.recent_orders": "Pedidos recientes",
    "dashboard.view_all": "Ver todo",
    "dashboard.create_dish": "Crear Platillo",
    "dashboard.view_store": "Ver Mi Tienda",
    "dashboard.manage_hours": "Gestionar Horarios",
    "orders.confirm": "Confirmar",
    "orders.prep": "Preparar",
    "orders.ready": "Listo",
    "orders.hand_off": "Entregar",
    "orders.delivery": "Entrega",
    "orders.pickup": "Recogida",
    "common.save": "Guardar",
    "common.discard": "Descartar",
    "common.continue": "Continuar",
    "common.back": "Atr\u00e1s",
    "common.cancel": "Cancelar",
    "common.search": "Buscar",
    "common.coming_soon": "Pr\u00f3ximamente",
    "store.live": "En vivo",
    "store.view_store": "Ver Mi Tienda",
  },
};

interface I18nContextValue {
  locale: Locale;
  setLocale: (l: Locale) => void;
  t: (key: string) => string;
  dir: "ltr" | "rtl";
}

const I18nContext = createContext<I18nContextValue | null>(null);

export function I18nProvider({ children }: { children: ReactNode }) {
  const [locale, setLocale] = useState<Locale>("en");
  const dir = locale === "ar" || locale === "ur" ? "rtl" : "ltr";
  const t = (key: string) => translations[locale]?.[key] ?? translations.en[key] ?? key;
  return (
    <I18nContext.Provider value={{ locale, setLocale, t, dir }}>
      <div dir={dir}>{children}</div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

export function LanguageSwitcher() {
  const { locale, setLocale } = useI18n();
  const locales: { code: Locale; label: string; flag: string }[] = [
    { code: "en", label: "English", flag: "\ud83c\uddfa\ud83c\uddf8" },
    { code: "ar", label: "\u0627\u0644\u0639\u0631\u0628\u064a\u0629", flag: "\ud83c\uddf8\ud83c\udde6" },
    { code: "ur", label: "\u0627\u0631\u062f\u0648", flag: "\ud83c\uddf5\ud83c\uddf0" },
    { code: "es", label: "Espa\u00f1ol", flag: "\ud83c\uddf2\ud83c\uddfd" },
  ];
  return (
    <div style={{ display: "flex", gap: 4 }}>
      {locales.map((l) => (
        <button
          key={l.code}
          onClick={() => setLocale(l.code)}
          className="btn-sm"
          style={{
            padding: "4px 8px",
            borderRadius: 8,
            fontSize: 13,
            background: locale === l.code ? "var(--color-brown)" : "transparent",
            color: locale === l.code ? "var(--color-cream)" : "var(--color-brown-soft-2)",
            border: "1px solid transparent",
            borderColor: locale === l.code ? "transparent" : "rgba(51,31,46,0.08)",
            minHeight: 32,
            cursor: "pointer",
            fontFamily: "inherit",
          }}
          title={l.label}
        >
          {l.flag}
        </button>
      ))}
    </div>
  );
}
