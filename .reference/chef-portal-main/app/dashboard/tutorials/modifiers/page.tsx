"use client";

import { useRouter } from "next/navigation";
import type { DriveStep } from "driver.js";
import { CollectionFilledIcon } from "@shopify/polaris-icons";
import { TutorialPageWrapper } from "@/components/features/tutorials/tutorial-page-wrapper";
import { Badge, Label, HelpText } from "@/components/polaris";
import type { TutorialLanguage } from "@/lib/tutorial/tutorial-i18n";

const STORAGE_KEY = "yb-tutorial-completed-modifiers";

/* ------------------------------------------------------------------ */
/*  Steps                                                             */
/* ------------------------------------------------------------------ */

const STEPS: Record<TutorialLanguage, DriveStep[]> = {
  en: [
    {
      popover: {
        title: "What Are Modifier Groups?",
        description:
          'Modifier groups let customers customize their order. Think "Choose your protein", "Pick your toppings", or "Select spice level". This tutorial explains how to create and use them.',
      },
    },
    {
      element: "#tutorial-mod-form",
      popover: {
        title: "Creating a Modifier Group",
        description:
          "Modifier groups are simple — just a name and an optional description. The name appears to customers when they're customizing their order.",
      },
    },
    {
      element: "#tutorial-mod-name",
      popover: {
        title: "Group Name",
        description:
          'Give it a clear, descriptive name that customers will understand. Examples: "Choose Your Protein", "Extra Toppings", "Sauce Options".',
      },
    },
    {
      element: "#tutorial-mod-description",
      popover: {
        title: "Description (Optional)",
        description:
          "Add a short description if the name isn't self-explanatory. This helps customers understand what the group is for.",
      },
    },
    {
      element: "#tutorial-mod-usage",
      popover: {
        title: "How Modifiers Are Used",
        description:
          "After creating a modifier group, you attach it to dishes or bundles in their Customizations step. There you define:\n\n\u2022 The individual options\n\u2022 Price adjustments\n\u2022 Required or optional\n\u2022 Single or multiple selection",
      },
    },
    {
      popover: {
        title: "You're Ready!",
        description:
          "Modifier groups are building blocks — create them first, then attach them to your dishes and bundles. Common groups: protein choices, spice levels, extras, and sauce options.",
      },
    },
  ],
  ar: [
    {
      popover: {
        title: "ما هي مجموعات التعديل؟",
        description:
          'مجموعات التعديل تتيح للعملاء تخصيص طلبهم. مثل "اختر البروتين"، "اختر الإضافات"، أو "حدد مستوى التوابل". هذا الشرح يوضح كيفية إنشائها واستخدامها.',
      },
    },
    {
      element: "#tutorial-mod-form",
      popover: {
        title: "إنشاء مجموعة تعديل",
        description:
          "مجموعات التعديل بسيطة — مجرد اسم ووصف اختياري. الاسم يظهر للعملاء عند تخصيص طلبهم.",
      },
    },
    {
      element: "#tutorial-mod-name",
      popover: {
        title: "اسم المجموعة",
        description:
          'أعطها اسمًا واضحًا ومفهومًا للعملاء. أمثلة: "اختر البروتين"، "إضافات إضافية"، "خيارات الصلصة".',
      },
    },
    {
      element: "#tutorial-mod-description",
      popover: {
        title: "الوصف (اختياري)",
        description:
          "أضف وصفًا قصيرًا إذا لم يكن الاسم واضحًا بذاته. هذا يساعد العملاء على فهم الغرض من المجموعة.",
      },
    },
    {
      element: "#tutorial-mod-usage",
      popover: {
        title: "كيف تُستخدم التعديلات",
        description:
          "بعد إنشاء مجموعة التعديل، تُرفقها بالأطباق أو الباقات في خطوة التخصيصات. هناك تحدد:\n\n\u2022 الخيارات الفردية\n\u2022 تعديلات الأسعار\n\u2022 إلزامي أو اختياري\n\u2022 اختيار واحد أو متعدد",
      },
    },
    {
      popover: {
        title: "أنت جاهز!",
        description:
          "مجموعات التعديل هي لبنات البناء — أنشئها أولاً، ثم أرفقها بأطباقك وباقاتك. المجموعات الشائعة: خيارات البروتين، مستويات التوابل، الإضافات، وخيارات الصلصة.",
      },
    },
  ],
  ur: [
    {
      popover: {
        title: "ترمیمی گروپ کیا ہیں؟",
        description:
          'ترمیمی گروپ گاہکوں کو اپنا آرڈر حسب ضرورت بنانے دیتے ہیں۔ جیسے "پروٹین منتخب کریں"، "ٹاپنگز چنیں"، یا "مسالے کی سطح منتخب کریں"۔ یہ ٹیوٹوریل بتاتا ہے کہ انہیں کیسے بنائیں اور استعمال کریں۔',
      },
    },
    {
      element: "#tutorial-mod-form",
      popover: {
        title: "ترمیمی گروپ بنانا",
        description:
          "ترمیمی گروپ آسان ہیں — صرف ایک نام اور اختیاری تفصیل۔ نام گاہکوں کو اپنا آرڈر حسب ضرورت بناتے وقت نظر آتا ہے۔",
      },
    },
    {
      element: "#tutorial-mod-name",
      popover: {
        title: "گروپ کا نام",
        description:
          'اسے واضح، بیانیہ نام دیں جو گاہک سمجھ سکیں۔ مثالیں: "پروٹین منتخب کریں"، "اضافی ٹاپنگز"، "چٹنی کے اختیارات"۔',
      },
    },
    {
      element: "#tutorial-mod-description",
      popover: {
        title: "تفصیل (اختیاری)",
        description:
          "اگر نام خود وضاحتی نہ ہو تو مختصر تفصیل شامل کریں۔ یہ گاہکوں کو گروپ کا مقصد سمجھنے میں مدد کرتی ہے۔",
      },
    },
    {
      element: "#tutorial-mod-usage",
      popover: {
        title: "ترامیم کیسے استعمال ہوتی ہیں",
        description:
          "ترمیمی گروپ بنانے کے بعد، آپ اسے ڈشوں یا بنڈلز کے حسب ضرورت تبدیلیاں مرحلے میں منسلک کرتے ہیں۔ وہاں آپ مقرر کرتے ہیں:\n\n\u2022 انفرادی اختیارات\n\u2022 قیمت کی تبدیلیاں\n\u2022 لازمی یا اختیاری\n\u2022 ایک یا متعدد انتخاب",
      },
    },
    {
      popover: {
        title: "آپ تیار ہیں!",
        description:
          "ترمیمی گروپ بنیادی اکائیاں ہیں — پہلے انہیں بنائیں، پھر اپنی ڈشوں اور بنڈلز سے منسلک کریں۔ عام گروپ: پروٹین کے انتخاب، مسالے کی سطح، اضافی، اور چٹنی کے اختیارات۔",
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Content                                                           */
/* ------------------------------------------------------------------ */

const CONTENT = {
  en: {
    formTitle: "Create Modifier Group",
    name: "Name",
    nameValue: "Choose Your Protein",
    descLabel: "Description",
    descValue:
      "Select your preferred protein for this dish. All proteins are freshly prepared daily.",
    charCount: "42 / 350",
    descHelp: "Optional — helps customers understand this group",
    usageTitle: "How It Looks on a Dish",
    usageSubtitle:
      "Once attached to a dish, modifier groups appear like this to customers:",
    group1Name: "Choose Your Protein",
    group1Desc: "Select your preferred protein for this dish",
    group1Options: [
      { name: "Chicken", price: "Included", selected: true },
      { name: "Lamb", price: "+$3.00", selected: false },
      { name: "Beef Kofta", price: "+$2.50", selected: false },
      { name: "Falafel (Vegan)", price: "+$1.00", selected: false },
    ],
    group2Name: "Extra Toppings",
    group2Options: [
      { name: "Extra Garlic Sauce", price: "+$1.50", checked: true },
      { name: "Add Hummus", price: "+$2.00", checked: true },
      { name: "Pickled Turnips", price: "+$1.00", checked: false },
      { name: "Extra Pita Bread", price: "+$1.00", checked: false },
    ],
    required: "Required",
    optional: "Optional",
    single: "Single",
    multiple: "Multiple",
  },
  ar: {
    formTitle: "إنشاء مجموعة تعديل",
    name: "الاسم",
    nameValue: "اختر البروتين",
    descLabel: "الوصف",
    descValue:
      "اختر البروتين المفضل لهذا الطبق. جميع البروتينات يتم تحضيرها طازجة يوميًا.",
    charCount: "٤٢ / ٣٥٠",
    descHelp: "اختياري — يساعد العملاء على فهم هذه المجموعة",
    usageTitle: "كيف تظهر على الطبق",
    usageSubtitle:
      "بعد إرفاقها بطبق، تظهر مجموعات التعديل هكذا للعملاء:",
    group1Name: "اختر البروتين",
    group1Desc: "اختر البروتين المفضل لهذا الطبق",
    group1Options: [
      { name: "دجاج", price: "مشمول", selected: true },
      { name: "لحم غنم", price: "+٣.٠٠$", selected: false },
      { name: "كفتة لحم", price: "+٢.٥٠$", selected: false },
      { name: "فلافل (نباتي)", price: "+١.٠٠$", selected: false },
    ],
    group2Name: "إضافات إضافية",
    group2Options: [
      { name: "صلصة ثوم إضافية", price: "+١.٥٠$", checked: true },
      { name: "إضافة حمص", price: "+٢.٠٠$", checked: true },
      { name: "لفت مخلل", price: "+١.٠٠$", checked: false },
      { name: "خبز بيتا إضافي", price: "+١.٠٠$", checked: false },
    ],
    required: "إلزامي",
    optional: "اختياري",
    single: "واحد",
    multiple: "متعدد",
  },
  ur: {
    formTitle: "ترمیمی گروپ بنائیں",
    name: "نام",
    nameValue: "پروٹین منتخب کریں",
    descLabel: "تفصیل",
    descValue:
      "اس ڈش کے لیے اپنا پسندیدہ پروٹین منتخب کریں۔ تمام پروٹین روزانہ تازہ تیار کیے جاتے ہیں۔",
    charCount: "۴۲ / ۳۵۰",
    descHelp: "اختیاری — گاہکوں کو اس گروپ کو سمجھنے میں مدد کرتا ہے",
    usageTitle: "ڈش پر کیسا نظر آتا ہے",
    usageSubtitle:
      "ڈش سے منسلک ہونے کے بعد، ترمیمی گروپ گاہکوں کو اس طرح نظر آتے ہیں:",
    group1Name: "پروٹین منتخب کریں",
    group1Desc: "اس ڈش کے لیے اپنا پسندیدہ پروٹین منتخب کریں",
    group1Options: [
      { name: "چکن", price: "شامل", selected: true },
      { name: "بھیڑ کا گوشت", price: "+$۳.۰۰", selected: false },
      { name: "بیف کوفتہ", price: "+$۲.۵۰", selected: false },
      { name: "فلافل (ویگن)", price: "+$۱.۰۰", selected: false },
    ],
    group2Name: "اضافی ٹاپنگز",
    group2Options: [
      { name: "اضافی لہسن کی چٹنی", price: "+$۱.۵۰", checked: true },
      { name: "حمص شامل کریں", price: "+$۲.۰۰", checked: true },
      { name: "اچار والی شلجم", price: "+$۱.۰۰", checked: false },
      { name: "اضافی پیٹا بریڈ", price: "+$۱.۰۰", checked: false },
    ],
    required: "لازمی",
    optional: "اختیاری",
    single: "ایک",
    multiple: "متعدد",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Demo component                                                    */
/* ------------------------------------------------------------------ */

function ModifiersTutorialContent() {
  const t = CONTENT.en;

  return (
    <div className="max-w-2xl mx-auto space-y-[var(--p-space-600)]">
      {/* The creation form */}
      <section id="tutorial-mod-form" className="space-y-[var(--p-space-500)]">
        <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
          {t.formTitle}
        </h2>
        <div id="tutorial-mod-name">
          <Label>{t.name}</Label>
          <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
            {t.nameValue}
          </div>
        </div>
        <div id="tutorial-mod-description">
          <div className="flex items-center justify-between">
            <Label>{t.descLabel}</Label>
            <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
              {t.charCount}
            </span>
          </div>
          <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] min-h-[80px]">
            {t.descValue}
          </div>
          <HelpText>{t.descHelp}</HelpText>
        </div>
      </section>

      <hr className="border-[var(--p-color-border-secondary)]" />

      {/* Usage examples */}
      <section id="tutorial-mod-usage" className="space-y-[var(--p-space-400)]">
        <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
          {t.usageTitle}
        </h2>
        <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
          {t.usageSubtitle}
        </p>

        {/* Required single-select */}
        <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border)] overflow-hidden">
          <div className="px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-fill-secondary)] border-b border-[var(--p-color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                  {t.group1Name}
                </p>
                <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                  {t.group1Desc}
                </p>
              </div>
              <div className="flex gap-[var(--p-space-200)]">
                <Badge tone="critical" size="sm">
                  {t.required}
                </Badge>
                <Badge size="sm">{t.single}</Badge>
              </div>
            </div>
          </div>
          <div className="divide-y divide-[var(--p-color-border-secondary)]">
            {t.group1Options.map((opt, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-[var(--p-space-400)] py-[var(--p-space-300)] ${
                  opt.selected
                    ? "bg-[var(--p-color-bg-fill-brand-selected)]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-[var(--p-space-300)]">
                  <span
                    className={`size-4 rounded-full border-2 flex items-center justify-center ${
                      opt.selected
                        ? "border-[var(--p-color-border-brand)] bg-[var(--p-color-bg-fill-brand)]"
                        : "border-[var(--p-color-border)]"
                    }`}
                  >
                    {opt.selected && (
                      <span className="size-1.5 rounded-full bg-white" />
                    )}
                  </span>
                  <span className="text-[0.8125rem] text-[var(--p-color-text)]">
                    {opt.name}
                  </span>
                </div>
                <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                  {opt.price}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Optional multi-select */}
        <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border)] overflow-hidden">
          <div className="px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-fill-secondary)] border-b border-[var(--p-color-border)]">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                  {t.group2Name}
                </p>
              </div>
              <div className="flex gap-[var(--p-space-200)]">
                <Badge tone="info" size="sm">
                  {t.optional}
                </Badge>
                <Badge size="sm">{t.multiple}</Badge>
              </div>
            </div>
          </div>
          <div className="divide-y divide-[var(--p-color-border-secondary)]">
            {t.group2Options.map((opt, i) => (
              <div
                key={i}
                className={`flex items-center justify-between px-[var(--p-space-400)] py-[var(--p-space-300)] ${
                  opt.checked
                    ? "bg-[var(--p-color-bg-fill-brand-selected)]"
                    : ""
                }`}
              >
                <div className="flex items-center gap-[var(--p-space-300)]">
                  <span
                    className={`size-4 rounded-[3px] border-2 flex items-center justify-center ${
                      opt.checked
                        ? "border-[var(--p-color-border-brand)] bg-[var(--p-color-bg-fill-brand)]"
                        : "border-[var(--p-color-border)]"
                    }`}
                  >
                    {opt.checked && (
                      <span className="text-white text-[0.5rem] font-bold">
                        \u2713
                      </span>
                    )}
                  </span>
                  <span className="text-[0.8125rem] text-[var(--p-color-text)]">
                    {opt.name}
                  </span>
                </div>
                <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                  {opt.price}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function ModifiersTutorialPage() {
  const router = useRouter();

  return (
    <TutorialPageWrapper
      title="Modifier Groups"
      description="Understand how to create modifier groups that let customers customize their orders. All data here is fake, nothing is saved."
      icon={CollectionFilledIcon}
      storageKey={STORAGE_KEY}
      breadcrumbs={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Tutorials", onClick: () => router.push("/dashboard/tutorials") },
        { label: "Modifier Groups" },
      ]}
      steps={STEPS}
    >
      <ModifiersTutorialContent />
    </TutorialPageWrapper>
  );
}
