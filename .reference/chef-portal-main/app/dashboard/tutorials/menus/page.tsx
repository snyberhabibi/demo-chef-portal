"use client";

import { useRouter } from "next/navigation";
import type { DriveStep } from "driver.js";
import { ListBulletedIcon } from "@shopify/polaris-icons";
import { DishIcon } from "@/components/icons/dish-icon";
import { TutorialPageWrapper } from "@/components/features/tutorials/tutorial-page-wrapper";
import { Badge, Label, HelpText } from "@/components/polaris";
import type { TutorialLanguage } from "@/lib/tutorial/tutorial-i18n";

const STORAGE_KEY = "yb-tutorial-completed-menus";

/* ------------------------------------------------------------------ */
/*  Steps                                                             */
/* ------------------------------------------------------------------ */

const STEPS: Record<TutorialLanguage, DriveStep[]> = {
  en: [
    {
      popover: {
        title: "What Are Custom Menu Sections?",
        description:
          'Menu sections help you organize your dishes into browsable groups. Instead of one long list, customers see sections like "Weekend Specials", "Family Meals", or "Popular Dishes".',
      },
    },
    {
      element: "#tutorial-menu-form",
      popover: {
        title: "Creating a Section",
        description:
          "Each section has a title, sort order, description, and a publish toggle. The form is a single page — no wizard needed.",
      },
    },
    {
      element: "#tutorial-menu-title",
      popover: {
        title: "Section Title",
        description:
          'This is what customers see as the section heading. Make it clear and appetizing. Examples: "Chef\'s Picks", "Weekend Specials", "Healthy Options".',
      },
    },
    {
      element: "#tutorial-menu-sort",
      popover: {
        title: "Sort Order",
        description:
          "Controls the position of this section on your menu. Lower numbers appear first. Use decimals (e.g., 1.5) to insert between existing sections.",
      },
    },
    {
      element: "#tutorial-menu-publish",
      popover: {
        title: "Publish Toggle",
        description:
          "When turned off, the section is hidden from customers but stays saved. Use this to prepare seasonal sections in advance.",
      },
    },
    {
      element: "#tutorial-menu-dishes",
      popover: {
        title: "Select Dishes",
        description:
          "Browse your published dishes and click to add them. A dish can appear in multiple sections.",
      },
    },
    {
      popover: {
        title: "You're Ready!",
        description:
          "Head to Custom Menu Sections \u2192 Create Section to organize your menu. Tip: Start with 3-5 well-organized sections.",
      },
    },
  ],
  ar: [
    {
      popover: {
        title: "ما هي أقسام القائمة المخصصة؟",
        description:
          'أقسام القائمة تساعدك على تنظيم أطباقك في مجموعات قابلة للتصفح. بدلاً من قائمة طويلة، يرى العملاء أقسامًا مثل "عروض نهاية الأسبوع"، "وجبات عائلية"، أو "الأطباق الشائعة".',
      },
    },
    {
      element: "#tutorial-menu-form",
      popover: {
        title: "إنشاء قسم",
        description:
          "كل قسم يحتوي على عنوان، ترتيب، وصف، ومفتاح نشر. النموذج صفحة واحدة — لا حاجة لمعالج.",
      },
    },
    {
      element: "#tutorial-menu-title",
      popover: {
        title: "عنوان القسم",
        description:
          'هذا ما يراه العملاء كعنوان للقسم. اجعله واضحًا وجذابًا. أمثلة: "اختيارات الشيف"، "عروض نهاية الأسبوع"، "خيارات صحية".',
      },
    },
    {
      element: "#tutorial-menu-sort",
      popover: {
        title: "ترتيب العرض",
        description:
          "يتحكم في موضع هذا القسم في القائمة. الأرقام الأصغر تظهر أولاً. استخدم الكسور (مثل ١.٥) للإدراج بين الأقسام الموجودة.",
      },
    },
    {
      element: "#tutorial-menu-publish",
      popover: {
        title: "مفتاح النشر",
        description:
          "عند الإيقاف، يكون القسم مخفيًا عن العملاء لكنه يبقى محفوظًا. استخدم هذا لتحضير أقسام موسمية مسبقًا.",
      },
    },
    {
      element: "#tutorial-menu-dishes",
      popover: {
        title: "اختيار الأطباق",
        description:
          "تصفح أطباقك المنشورة وانقر لإضافتها. يمكن أن يظهر الطبق في عدة أقسام.",
      },
    },
    {
      popover: {
        title: "أنت جاهز!",
        description:
          "توجه إلى أقسام القائمة المخصصة ← إنشاء قسم لتنظيم قائمتك. نصيحة: ابدأ بـ ٣-٥ أقسام منظمة جيدًا.",
      },
    },
  ],
  ur: [
    {
      popover: {
        title: "حسب ضرورت مینیو سیکشنز کیا ہیں؟",
        description:
          'مینیو سیکشنز آپ کی ڈشوں کو قابل تلاش گروپوں میں ترتیب دینے میں مدد کرتے ہیں۔ ایک لمبی فہرست کی بجائے، گاہک سیکشنز دیکھتے ہیں جیسے "ہفتے کے اختتام کی خاص پیشکشیں"، "فیملی کھانے"، یا "مقبول ڈشیں"۔',
      },
    },
    {
      element: "#tutorial-menu-form",
      popover: {
        title: "سیکشن بنانا",
        description:
          "ہر سیکشن میں عنوان، ترتیب، تفصیل، اور شائع ٹوگل ہوتا ہے۔ فارم ایک صفحے کا ہے — کسی وزرڈ کی ضرورت نہیں۔",
      },
    },
    {
      element: "#tutorial-menu-title",
      popover: {
        title: "سیکشن کا عنوان",
        description:
          'یہ گاہکوں کو سیکشن کی سرخی کے طور پر نظر آتا ہے۔ اسے واضح اور دلکش بنائیں۔ مثالیں: "شیف کی پسند"، "ہفتے کے آخر کی خاص"، "صحت مند اختیارات"۔',
      },
    },
    {
      element: "#tutorial-menu-sort",
      popover: {
        title: "ترتیب",
        description:
          "مینیو پر اس سیکشن کی پوزیشن کنٹرول کرتا ہے۔ چھوٹے نمبر پہلے ظاہر ہوتے ہیں۔ موجودہ سیکشنز کے درمیان داخل کرنے کے لیے اعشاریہ استعمال کریں (مثلاً ۱.۵)۔",
      },
    },
    {
      element: "#tutorial-menu-publish",
      popover: {
        title: "شائع ٹوگل",
        description:
          "بند ہونے پر، سیکشن گاہکوں سے چھپا رہتا ہے لیکن محفوظ رہتا ہے۔ موسمی سیکشنز پہلے سے تیار کرنے کے لیے استعمال کریں۔",
      },
    },
    {
      element: "#tutorial-menu-dishes",
      popover: {
        title: "ڈشیں منتخب کریں",
        description:
          "اپنی شائع شدہ ڈشیں دیکھیں اور شامل کرنے کے لیے کلک کریں۔ ایک ڈش متعدد سیکشنز میں ظاہر ہو سکتی ہے۔",
      },
    },
    {
      popover: {
        title: "آپ تیار ہیں!",
        description:
          "حسب ضرورت مینیو سیکشنز ← سیکشن بنائیں پر جائیں۔ مشورہ: ۳-۵ اچھی طرح ترتیب شدہ سیکشنز سے شروع کریں۔",
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Content                                                           */
/* ------------------------------------------------------------------ */

const CONTENT = {
  en: {
    sectionDetails: "Section Details",
    title: "Section Title",
    titleValue: "Weekend Specials",
    sortOrder: "Sort Order",
    sortOrderValue: "2.00",
    sortHelp: "Lower number = appears first on menu",
    publish: "Publish Section",
    publishValue: "Published",
    publishHelp: "Visible to customers when published",
    descLabel: "Description",
    descValue:
      "Special dishes available Friday through Sunday. Order ahead — these sell out fast!",
    charCount: "58 / 350",
    selectDishes: "Select Dishes",
    searchPlaceholder: "Search dishes...",
    dishes: [
      { name: "Lamb Mansaf", selected: true },
      { name: "Grilled Chicken Shawarma", selected: true },
      { name: "Seafood Sayadeya", selected: true },
      { name: "Classic Hummus", selected: false },
      { name: "Fattoush Salad", selected: false },
      { name: "Baklava Bites", selected: false },
    ],
    dishStatus: "Published",
    previewTitle: "How It Looks to Customers",
    previewSubtitle:
      "Sections appear on your storefront in the order you set:",
    previewSections: [
      { title: "Chef's Picks", order: 1, count: 5 },
      { title: "Weekend Specials", order: 2, count: 3 },
      { title: "Main Courses", order: 3, count: 8 },
      { title: "Sides & Salads", order: 4, count: 6 },
    ],
    dishesCount: "dishes",
  },
  ar: {
    sectionDetails: "تفاصيل القسم",
    title: "عنوان القسم",
    titleValue: "عروض نهاية الأسبوع",
    sortOrder: "ترتيب العرض",
    sortOrderValue: "٢.٠٠",
    sortHelp: "رقم أصغر = يظهر أولاً في القائمة",
    publish: "نشر القسم",
    publishValue: "منشور",
    publishHelp: "مرئي للعملاء عند النشر",
    descLabel: "الوصف",
    descValue:
      "أطباق خاصة متاحة من الجمعة إلى الأحد. اطلب مسبقًا — تنفد بسرعة!",
    charCount: "٥٨ / ٣٥٠",
    selectDishes: "اختيار الأطباق",
    searchPlaceholder: "ابحث عن أطباق...",
    dishes: [
      { name: "منسف لحم", selected: true },
      { name: "شاورما دجاج مشوي", selected: true },
      { name: "صيادية بحرية", selected: true },
      { name: "حمص كلاسيكي", selected: false },
      { name: "سلطة فتوش", selected: false },
      { name: "بقلاوة", selected: false },
    ],
    dishStatus: "منشور",
    previewTitle: "كيف تظهر للعملاء",
    previewSubtitle: "الأقسام تظهر في واجهتك بالترتيب الذي حددته:",
    previewSections: [
      { title: "اختيارات الشيف", order: 1, count: 5 },
      { title: "عروض نهاية الأسبوع", order: 2, count: 3 },
      { title: "الأطباق الرئيسية", order: 3, count: 8 },
      { title: "المقبلات والسلطات", order: 4, count: 6 },
    ],
    dishesCount: "أطباق",
  },
  ur: {
    sectionDetails: "سیکشن کی تفصیلات",
    title: "سیکشن کا عنوان",
    titleValue: "ہفتے کے آخر کی خاص پیشکشیں",
    sortOrder: "ترتیب",
    sortOrderValue: "۲.۰۰",
    sortHelp: "چھوٹا نمبر = مینیو پر پہلے ظاہر ہوتا ہے",
    publish: "سیکشن شائع کریں",
    publishValue: "شائع شدہ",
    publishHelp: "شائع ہونے پر گاہکوں کو نظر آتا ہے",
    descLabel: "تفصیل",
    descValue:
      "جمعہ سے اتوار تک دستیاب خاص ڈشیں۔ پہلے آرڈر کریں — یہ جلدی ختم ہو جاتی ہیں!",
    charCount: "۵۸ / ۳۵۰",
    selectDishes: "ڈشیں منتخب کریں",
    searchPlaceholder: "ڈشیں تلاش کریں...",
    dishes: [
      { name: "لیمب منسف", selected: true },
      { name: "گرلڈ چکن شاورما", selected: true },
      { name: "سی فوڈ صیادیہ", selected: true },
      { name: "کلاسک حمص", selected: false },
      { name: "فتوش سلاد", selected: false },
      { name: "بقلاوہ", selected: false },
    ],
    dishStatus: "شائع شدہ",
    previewTitle: "گاہکوں کو کیسا نظر آتا ہے",
    previewSubtitle:
      "سیکشنز آپ کے اسٹور فرنٹ پر مقرر کردہ ترتیب میں ظاہر ہوتے ہیں:",
    previewSections: [
      { title: "شیف کی پسند", order: 1, count: 5 },
      { title: "ہفتے کے آخر کی خاص", order: 2, count: 3 },
      { title: "مین کورسز", order: 3, count: 8 },
      { title: "سائیڈز اور سلاد", order: 4, count: 6 },
    ],
    dishesCount: "ڈشیں",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Demo component                                                    */
/* ------------------------------------------------------------------ */

function MenusTutorialContent() {
  const t = CONTENT.en;

  return (
    <div className="max-w-3xl mx-auto space-y-[var(--p-space-600)]">
      {/* Section details form */}
      <section id="tutorial-menu-form" className="space-y-[var(--p-space-500)]">
        <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
          {t.sectionDetails}
        </h2>
        <div className="space-y-[var(--p-space-400)]">
          <div id="tutorial-menu-title">
            <Label>{t.title}</Label>
            <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
              {t.titleValue}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--p-space-400)]">
            <div id="tutorial-menu-sort">
              <Label>{t.sortOrder}</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                {t.sortOrderValue}
              </div>
              <HelpText>{t.sortHelp}</HelpText>
            </div>
            <div id="tutorial-menu-publish">
              <Label>{t.publish}</Label>
              <div className="mt-[var(--p-space-100)] flex items-center gap-[var(--p-space-300)]">
                <div className="w-10 h-[22px] rounded-full bg-[var(--p-color-bg-fill-brand)] relative">
                  <span className="absolute end-0.5 top-0.5 size-[18px] rounded-full bg-white shadow-sm" />
                </div>
                <span className="text-[0.8125rem] text-[var(--p-color-text)]">
                  {t.publishValue}
                </span>
              </div>
              <HelpText>{t.publishHelp}</HelpText>
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <Label>{t.descLabel}</Label>
              <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                {t.charCount}
              </span>
            </div>
            <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] min-h-[60px]">
              {t.descValue}
            </div>
          </div>
        </div>
      </section>

      <hr className="border-[var(--p-color-border-secondary)]" />

      {/* Select dishes */}
      <section
        id="tutorial-menu-dishes"
        className="space-y-[var(--p-space-400)]"
      >
        <div className="flex items-center justify-between">
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.selectDishes}
          </h2>
          <Badge tone="info" size="sm">
            {t.dishes.filter((d) => d.selected).length}
          </Badge>
        </div>
        <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] text-[var(--p-color-text-secondary)] bg-[var(--p-color-bg-surface)]">
          {t.searchPlaceholder}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-[var(--p-space-300)]">
          {t.dishes.map((dish, i) => (
            <div
              key={i}
              className={`rounded-[var(--p-border-radius-300)] border-2 p-[var(--p-space-400)] ${
                dish.selected
                  ? "border-[var(--p-color-border-brand)] bg-[var(--p-color-bg-fill-brand-selected)]"
                  : "border-[var(--p-color-border)] bg-[var(--p-color-bg-surface)]"
              }`}
            >
              <div className="flex items-start gap-[var(--p-space-300)]">
                <div className="size-10 rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center shrink-0">
                  <DishIcon className="size-5 fill-[var(--p-color-icon-secondary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
                    {dish.name}
                  </p>
                  <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                    {t.dishStatus}
                  </p>
                </div>
                {dish.selected && (
                  <span className="size-5 rounded-full bg-[var(--p-color-bg-fill-brand)] flex items-center justify-center shrink-0">
                    <span className="text-white text-[0.5rem] font-bold">
                      {"\u2713"}
                    </span>
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      <hr className="border-[var(--p-color-border-secondary)]" />

      {/* Storefront preview — tabs */}
      <section className="space-y-[var(--p-space-400)]">
        <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
          {t.previewTitle}
        </h2>
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
          {t.previewSubtitle}
        </p>
        <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border)] overflow-hidden">
          {/* Tab bar */}
          <div className="flex border-b border-[var(--p-color-border)]">
            {t.previewSections.map((section, i) => (
              <button
                key={i}
                type="button"
                className={`flex-1 px-[var(--p-space-300)] py-[var(--p-space-300)] text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-center transition-colors ${
                  i === 1
                    ? "text-[var(--p-color-text-brand)] border-b-2 border-[var(--p-color-border-brand)] bg-[var(--p-color-bg-surface)]"
                    : "text-[var(--p-color-text-secondary)] hover:text-[var(--p-color-text)] bg-[var(--p-color-bg-fill-secondary)]"
                }`}
              >
                {section.title}
              </button>
            ))}
          </div>
          {/* Tab content — showing "Weekend Specials" as active */}
          <div className="p-[var(--p-space-400)] bg-[var(--p-color-bg-surface)]">
            <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-300)]">
              Showing {t.previewSections[1].count} {t.dishesCount} in &ldquo;{t.previewSections[1].title}&rdquo;
            </p>
            <div className="grid grid-cols-3 gap-[var(--p-space-300)]">
              {["Lamb Mansaf", "Grilled Chicken Shawarma", "Seafood Sayadeya"].map((name) => (
                <div
                  key={name}
                  className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] p-[var(--p-space-300)] text-center"
                >
                  <div className="size-10 mx-auto rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center mb-[var(--p-space-200)]">
                    <DishIcon className="size-5 fill-[var(--p-color-icon-secondary)]" />
                  </div>
                  <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
                    {name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function MenusTutorialPage() {
  const router = useRouter();

  return (
    <TutorialPageWrapper
      title="Custom Menu Sections"
      description="Learn how to organize your dishes into custom sections for a better browsing experience. All data here is fake, nothing is saved."
      icon={ListBulletedIcon}
      storageKey={STORAGE_KEY}
      breadcrumbs={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Tutorials", onClick: () => router.push("/dashboard/tutorials") },
        { label: "Custom Menu Sections" },
      ]}
      steps={STEPS}
    >
      <MenusTutorialContent />
    </TutorialPageWrapper>
  );
}
