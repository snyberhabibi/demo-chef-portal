"use client";

import { useRouter } from "next/navigation";
import type { DriveStep } from "driver.js";
import {
  PackageFilledIcon,
  ImageIcon,
  ClockIcon,
} from "@shopify/polaris-icons";
import { DishIcon } from "@/components/icons/dish-icon";
import { TutorialPageWrapper } from "@/components/features/tutorials/tutorial-page-wrapper";
import { Badge, Label, HelpText } from "@/components/polaris";
import type { TutorialLanguage } from "@/lib/tutorial/tutorial-i18n";

const STORAGE_KEY = "yb-tutorial-completed-bundles";

/* ------------------------------------------------------------------ */
/*  driver.js steps                                                   */
/* ------------------------------------------------------------------ */

const STEPS: Record<TutorialLanguage, DriveStep[]> = {
  en: [
    {
      popover: {
        title: "Welcome to Bundle Creation!",
        description:
          "Bundles let you group multiple dishes together at a special price. This tutorial covers the full bundle creation process. All data here is fake — nothing is saved.",
      },
    },
    {
      element: "#tutorial-bundle-wizard-nav",
      popover: {
        title: "Bundle Wizard Steps",
        description:
          "Bundle creation has 6 steps — similar to dishes but with an extra 'Bundle Items' step where you select which dishes to include.",
      },
    },
    {
      element: "#tutorial-bundle-details",
      popover: {
        title: "Step 1: Bundle Details",
        description:
          "Give your bundle a catchy name and description. Set the status (Draft or Published) and the lead time.",
      },
    },
    {
      element: "#tutorial-bundle-media",
      popover: {
        title: "Step 2: Media",
        description:
          "Upload photos of the complete bundle. If you skip this, the bundle will use photos from the included dishes. Up to 4 images, with the first as the primary.",
      },
    },
    {
      element: "#tutorial-bundle-items",
      popover: {
        title: "Step 3: Bundle Items",
        description:
          "This is what makes bundles special! Search and select dishes to include. You need at least 2 dishes. Set the quantity for each.",
      },
    },
    {
      element: "#tutorial-bundle-dish-card",
      popover: {
        title: "Selected Dish",
        description:
          "Each selected dish shows its name, current price, and a quantity adjuster. The bundle price can be lower than the sum of individual prices — that's the bundle discount!",
      },
    },
    {
      element: "#tutorial-bundle-pricing",
      popover: {
        title: "Step 4: Pricing",
        description:
          'Set the Regular Price for the bundle. You can also set a Sale Price for promotions. The "You save" percentage is calculated automatically.',
      },
    },
    {
      element: "#tutorial-bundle-availability",
      popover: {
        title: "Step 5: Availability",
        description:
          "Same as dishes — set a max quantity per day and choose which days the bundle is available.",
      },
    },
    {
      element: "#tutorial-bundle-customizations",
      popover: {
        title: "Step 6: Customizations",
        description:
          "Add modifier groups to the bundle itself (separate from individual dish modifiers). For example, a family bundle might let customers choose their drink flavor.",
      },
    },
    {
      popover: {
        title: "You're Ready to Create Bundles!",
        description:
          'Head to Bundles → Create Bundle to build your first one. Popular bundles include "Family Meals", "Combo Deals", and "Party Platters"!',
      },
    },
  ],
  ar: [
    {
      popover: {
        title: "مرحبًا بك في إنشاء الباقات!",
        description:
          "الباقات تتيح لك تجميع عدة أطباق معًا بسعر خاص. هذا الشرح يغطي عملية إنشاء الباقة بالكامل. جميع البيانات وهمية — لن يتم حفظ أي شيء.",
      },
    },
    {
      element: "#tutorial-bundle-wizard-nav",
      popover: {
        title: "خطوات معالج الباقة",
        description:
          "إنشاء الباقة يتكون من ٦ خطوات — مشابه للأطباق لكن مع خطوة إضافية لاختيار الأطباق المضمنة في الباقة.",
      },
    },
    {
      element: "#tutorial-bundle-details",
      popover: {
        title: "الخطوة ١: تفاصيل الباقة",
        description:
          "أعطِ باقتك اسمًا جذابًا ووصفًا. حدد الحالة (مسودة أو منشور) ووقت التحضير المسبق.",
      },
    },
    {
      element: "#tutorial-bundle-media",
      popover: {
        title: "الخطوة ٢: الصور",
        description:
          "ارفع صور الباقة الكاملة. إذا تخطيت هذا، ستستخدم الباقة صور الأطباق المضمنة. حتى ٤ صور، الأولى هي الرئيسية.",
      },
    },
    {
      element: "#tutorial-bundle-items",
      popover: {
        title: "الخطوة ٣: أطباق الباقة",
        description:
          "هذا ما يجعل الباقات مميزة! ابحث واختر الأطباق المراد تضمينها. تحتاج طبقين على الأقل. حدد الكمية لكل طبق.",
      },
    },
    {
      element: "#tutorial-bundle-dish-card",
      popover: {
        title: "الطبق المحدد",
        description:
          "كل طبق محدد يعرض اسمه وسعره الحالي ومتحكم بالكمية. سعر الباقة يمكن أن يكون أقل من مجموع الأسعار الفردية — وهذا هو خصم الباقة!",
      },
    },
    {
      element: "#tutorial-bundle-pricing",
      popover: {
        title: "الخطوة ٤: التسعير",
        description:
          'حدد السعر العادي للباقة. يمكنك أيضًا تحديد سعر تخفيض للعروض. نسبة "التوفير" تُحسب تلقائيًا.',
      },
    },
    {
      element: "#tutorial-bundle-availability",
      popover: {
        title: "الخطوة ٥: التوفر",
        description:
          "مثل الأطباق — حدد أقصى كمية في اليوم واختر أيام توفر الباقة.",
      },
    },
    {
      element: "#tutorial-bundle-customizations",
      popover: {
        title: "الخطوة ٦: التخصيصات",
        description:
          "أضف مجموعات تعديل للباقة نفسها (منفصلة عن تعديلات الأطباق الفردية). مثلاً، باقة عائلية قد تتيح للعملاء اختيار نكهة المشروب.",
      },
    },
    {
      popover: {
        title: "أنت جاهز لإنشاء الباقات!",
        description:
          'توجه إلى الباقات ← إنشاء باقة لبناء أول باقة. الباقات الشائعة تشمل "وجبات عائلية" و"عروض كومبو" و"أطباق الحفلات"!',
      },
    },
  ],
  ur: [
    {
      popover: {
        title: "بنڈل بنانے میں خوش آمدید!",
        description:
          "بنڈل آپ کو متعدد ڈشیں خاص قیمت پر ایک ساتھ گروپ کرنے دیتے ہیں۔ یہ ٹیوٹوریل مکمل بنڈل بنانے کا عمل بتاتا ہے۔ تمام ڈیٹا فرضی ہے — کچھ محفوظ نہیں ہوگا۔",
      },
    },
    {
      element: "#tutorial-bundle-wizard-nav",
      popover: {
        title: "بنڈل وزرڈ کے مراحل",
        description:
          "بنڈل بنانے میں ۶ مراحل ہیں — ڈشوں جیسا ہی لیکن ایک اضافی 'بنڈل آئٹمز' مرحلے کے ساتھ جہاں آپ شامل کرنے کی ڈشیں منتخب کرتے ہیں۔",
      },
    },
    {
      element: "#tutorial-bundle-details",
      popover: {
        title: "مرحلہ ۱: بنڈل کی تفصیلات",
        description:
          "اپنے بنڈل کو دلکش نام اور تفصیل دیں۔ حالت (ڈرافٹ یا شائع) اور تیاری کا وقت مقرر کریں۔",
      },
    },
    {
      element: "#tutorial-bundle-media",
      popover: {
        title: "مرحلہ ۲: تصاویر",
        description:
          "مکمل بنڈل کی تصاویر اپلوڈ کریں۔ اگر آپ یہ چھوڑ دیں تو بنڈل شامل ڈشوں کی تصاویر استعمال کرے گا۔ ۴ تک تصاویر، پہلی مرکزی ہوگی۔",
      },
    },
    {
      element: "#tutorial-bundle-items",
      popover: {
        title: "مرحلہ ۳: بنڈل آئٹمز",
        description:
          "یہی بنڈلز کو خاص بناتا ہے! ڈشیں تلاش کریں اور منتخب کریں۔ کم از کم ۲ ڈشیں درکار ہیں۔ ہر ایک کی مقدار مقرر کریں۔",
      },
    },
    {
      element: "#tutorial-bundle-dish-card",
      popover: {
        title: "منتخب ڈش",
        description:
          "ہر منتخب ڈش اس کا نام، موجودہ قیمت، اور مقدار ایڈجسٹر دکھاتی ہے۔ بنڈل کی قیمت انفرادی قیمتوں کے مجموعے سے کم ہو سکتی ہے — یہی بنڈل ڈسکاؤنٹ ہے!",
      },
    },
    {
      element: "#tutorial-bundle-pricing",
      popover: {
        title: "مرحلہ ۴: قیمت",
        description:
          'بنڈل کی باقاعدہ قیمت مقرر کریں۔ آپ پروموشنز کے لیے سیل قیمت بھی سیٹ کر سکتے ہیں۔ "بچت" کا فیصد خود بخود حساب ہوتا ہے۔',
      },
    },
    {
      element: "#tutorial-bundle-availability",
      popover: {
        title: "مرحلہ ۵: دستیابی",
        description:
          "ڈشوں کی طرح — یومیہ زیادہ سے زیادہ مقدار مقرر کریں اور بنڈل کے دستیاب دن منتخب کریں۔",
      },
    },
    {
      element: "#tutorial-bundle-customizations",
      popover: {
        title: "مرحلہ ۶: حسب ضرورت تبدیلیاں",
        description:
          "بنڈل میں ترمیمی گروپ شامل کریں (انفرادی ڈش کی ترامیم سے الگ)۔ مثلاً، فیملی بنڈل گاہکوں کو مشروب کا ذائقہ چننے دے سکتا ہے۔",
      },
    },
    {
      popover: {
        title: "آپ بنڈل بنانے کے لیے تیار ہیں!",
        description:
          'بنڈلز ← بنڈل بنائیں پر جائیں۔ مقبول بنڈلز میں "فیملی میلز"، "کومبو ڈیلز"، اور "پارٹی پلیٹرز" شامل ہیں!',
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Content                                                           */
/* ------------------------------------------------------------------ */

const CONTENT = {
  en: {
    details: "Bundle Details",
    bundleName: "Bundle Name",
    bundleNameValue: "Family Shawarma Feast",
    description: "Description",
    descriptionValue:
      "Feed the whole family! Includes 4 shawarma plates, 2 large salads, hummus, and a dessert tray.",
    status: "Status",
    leadTime: "Lead Time",
    leadTimeValue: "48 hours",
    media: "Media",
    bundleItems: "Bundle Items",
    dishes: [
      { name: "Grilled Chicken Shawarma Plate", price: "$14.99", qty: 4 },
      { name: "Fattoush Salad", price: "$9.99", qty: 2 },
      { name: "Classic Hummus", price: "$7.99", qty: 1 },
      { name: "Baklava Bites (6 pcs)", price: "$5.99", qty: 1 },
    ],
    pricing: "Specs & Pricing",
    portionSizes: "Portion Sizes",
    portionLabel: "Family",
    portionSize: "Feeds 4-6",
    portionPrice: "$54.99",
    portionOriginal: "$73.90",
    pricingHelp:
      "Individual total: $73.90 \u00b7 Bundle price: $54.99 \u00b7 Customers save 26%",
    availability: "Availability",
    maxQty: "Max Quantity Per Day",
    maxQtyValue: "10 bundles",
    availableDays: "Available Days",
    availableDaysHelp: "All days selected = available every day",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    customizations: "Customizations",
    modGroup: "Choose Your Drink",
    modGroupSub: "Single selection \u00b7 Optional",
    modOptions: [
      { name: "Fresh Lemonade", price: "+$3.00" },
      { name: "Mint Tea", price: "+$2.50" },
      { name: "Ayran", price: "+$2.00" },
    ],
    wizardSteps: [
      "Bundle Details",
      "Media",
      "Bundle Items",
      "Specs & Pricing",
      "Availability",
      "Customizations",
    ],
  },
  ar: {
    details: "تفاصيل الباقة",
    bundleName: "اسم الباقة",
    bundleNameValue: "وليمة شاورما عائلية",
    description: "الوصف",
    descriptionValue:
      "أطعم العائلة بأكملها! تشمل ٤ أطباق شاورما، ٢ سلطة كبيرة، حمص، وصينية حلويات.",
    status: "الحالة",
    leadTime: "وقت التحضير",
    leadTimeValue: "٤٨ ساعة",
    media: "الصور",
    bundleItems: "أطباق الباقة",
    dishes: [
      { name: "طبق شاورما الدجاج المشوي", price: "١٤.٩٩$", qty: 4 },
      { name: "سلطة فتوش", price: "٩.٩٩$", qty: 2 },
      { name: "حمص كلاسيكي", price: "٧.٩٩$", qty: 1 },
      { name: "بقلاوة (٦ قطع)", price: "٥.٩٩$", qty: 1 },
    ],
    pricing: "المواصفات والتسعير",
    portionSizes: "أحجام الحصص",
    portionLabel: "عائلي",
    portionSize: "يكفي ٤-٦ أشخاص",
    portionPrice: "٥٤.٩٩$",
    portionOriginal: "٧٣.٩٠$",
    pricingHelp:
      "المجموع الفردي: ٧٣.٩٠$ · سعر الباقة: ٥٤.٩٩$ · يوفر العملاء ٢٦٪",
    availability: "التوفر",
    maxQty: "أقصى كمية في اليوم",
    maxQtyValue: "١٠ باقات",
    availableDays: "الأيام المتاحة",
    availableDaysHelp: "جميع الأيام محددة = متاح كل يوم",
    days: ["إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"],
    customizations: "التخصيصات",
    modGroup: "اختر مشروبك",
    modGroupSub: "اختيار واحد · اختياري",
    modOptions: [
      { name: "عصير ليمون طازج", price: "+٣.٠٠$" },
      { name: "شاي بالنعناع", price: "+٢.٥٠$" },
      { name: "عيران", price: "+٢.٠٠$" },
    ],
    wizardSteps: [
      "تفاصيل الباقة",
      "الصور",
      "أطباق الباقة",
      "المواصفات والتسعير",
      "التوفر",
      "التخصيصات",
    ],
  },
  ur: {
    details: "بنڈل کی تفصیلات",
    bundleName: "بنڈل کا نام",
    bundleNameValue: "فیملی شاورما دعوت",
    description: "تفصیل",
    descriptionValue:
      "پوری فیملی کو کھلائیں! ۴ شاورما پلیٹیں، ۲ بڑے سلاد، حمص، اور میٹھائی کی ٹرے شامل ہے۔",
    status: "حالت",
    leadTime: "تیاری کا وقت",
    leadTimeValue: "۴۸ گھنٹے",
    media: "تصاویر",
    bundleItems: "بنڈل آئٹمز",
    dishes: [
      { name: "گرلڈ چکن شاورما پلیٹ", price: "$۱۴.۹۹", qty: 4 },
      { name: "فتوش سلاد", price: "$۹.۹۹", qty: 2 },
      { name: "کلاسک حمص", price: "$۷.۹۹", qty: 1 },
      { name: "بقلاوہ (۶ پیس)", price: "$۵.۹۹", qty: 1 },
    ],
    pricing: "تفصیلات اور قیمت",
    portionSizes: "حصوں کے سائز",
    portionLabel: "فیملی",
    portionSize: "۴-۶ لوگوں کے لیے",
    portionPrice: "$۵۴.۹۹",
    portionOriginal: "$۷۳.۹۰",
    pricingHelp:
      "انفرادی کل: $۷۳.۹۰ · بنڈل قیمت: $۵۴.۹۹ · گاہک ۲۶٪ بچاتے ہیں",
    availability: "دستیابی",
    maxQty: "یومیہ زیادہ سے زیادہ مقدار",
    maxQtyValue: "۱۰ بنڈل",
    availableDays: "دستیاب دن",
    availableDaysHelp: "تمام دن منتخب = ہر روز دستیاب",
    days: ["پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ", "اتوار"],
    customizations: "حسب ضرورت تبدیلیاں",
    modGroup: "مشروب منتخب کریں",
    modGroupSub: "ایک انتخاب · اختیاری",
    modOptions: [
      { name: "تازہ لیمونیڈ", price: "+$۳.۰۰" },
      { name: "پودینے کی چائے", price: "+$۲.۵۰" },
      { name: "ایران", price: "+$۲.۰۰" },
    ],
    wizardSteps: [
      "بنڈل کی تفصیلات",
      "تصاویر",
      "بنڈل آئٹمز",
      "تفصیلات اور قیمت",
      "دستیابی",
      "حسب ضرورت تبدیلیاں",
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Demo component                                                    */
/* ------------------------------------------------------------------ */

function BundleTutorialContent() {
  const t = CONTENT.en;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--p-space-500)]">
      {/* Wizard sidebar */}
      <div className="lg:col-span-3">
        <div
          id="tutorial-bundle-wizard-nav"
          className="space-y-[var(--p-space-100)]"
        >
          {t.wizardSteps.map((label, i) => (
            <div
              key={i}
              className={`flex items-center gap-[var(--p-space-300)] px-[var(--p-space-300)] py-[var(--p-space-200)] rounded-[var(--p-border-radius-200)] text-[0.8125rem] ${
                i === 0
                  ? "bg-[var(--p-color-bg-fill-secondary)] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]"
                  : "text-[var(--p-color-text-secondary)]"
              }`}
            >
              <span
                className={`flex items-center justify-center size-6 rounded-full text-[0.6875rem] font-[var(--p-font-weight-bold)] ${
                  i < 3
                    ? "bg-[var(--p-color-bg-fill-success)] text-white"
                    : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)]"
                }`}
              >
                {i < 3 ? "\u2713" : i + 1}
              </span>
              {label}
            </div>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="lg:col-span-9 space-y-[var(--p-space-600)]">
        {/* Details */}
        <section
          id="tutorial-bundle-details"
          className="space-y-[var(--p-space-400)]"
        >
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.details}
          </h2>
          <div className="space-y-[var(--p-space-400)]">
            <div>
              <Label>{t.bundleName}</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                {t.bundleNameValue}
              </div>
            </div>
            <div>
              <Label>{t.description}</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] min-h-[60px]">
                {t.descriptionValue}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--p-space-400)]">
              <div>
                <Label>{t.status}</Label>
                <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                  <Badge tone="warning" size="sm">
                    Draft
                  </Badge>
                </div>
              </div>
              <div>
                <Label>{t.leadTime}</Label>
                <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] flex items-center gap-[var(--p-space-200)]">
                  <ClockIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
                  {t.leadTimeValue}
                </div>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Media */}
        <section
          id="tutorial-bundle-media"
          className="space-y-[var(--p-space-400)]"
        >
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.media}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--p-space-300)]">
            {[0, 1, 2, 3].map((i) => (
              <div
                key={i}
                className={`aspect-square rounded-[var(--p-border-radius-300)] border-2 ${
                  i === 0
                    ? "border-[var(--p-color-border-brand)] bg-[var(--p-color-bg-fill-brand-selected)]"
                    : "border-dashed border-[var(--p-color-border)] bg-[var(--p-color-bg-fill-secondary)]"
                } flex flex-col items-center justify-center gap-[var(--p-space-100)]`}
              >
                <ImageIcon
                  className={`size-6 ${
                    i === 0
                      ? "fill-[var(--p-color-icon-brand)]"
                      : "fill-[var(--p-color-icon-secondary)]"
                  }`}
                />
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Bundle Items */}
        <section
          id="tutorial-bundle-items"
          className="space-y-[var(--p-space-400)]"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
              {t.bundleItems}
            </h2>
            <Badge tone="info" size="sm">
              {t.dishes.length}
            </Badge>
          </div>
          <div className="space-y-[var(--p-space-200)]">
            {t.dishes.map((dish, i) => (
              <div
                key={i}
                id={i === 0 ? "tutorial-bundle-dish-card" : undefined}
                className="flex items-center gap-[var(--p-space-400)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)]"
              >
                <div className="size-10 rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center shrink-0">
                  <DishIcon className="size-5 fill-[var(--p-color-icon-secondary)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] truncate">
                    {dish.name}
                  </p>
                  <p className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                    {dish.price}
                  </p>
                </div>
                <div className="flex items-center gap-[var(--p-space-200)] shrink-0">
                  <span className="size-7 rounded-[var(--p-border-radius-150)] bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center text-[0.75rem] text-[var(--p-color-text-secondary)]">
                    −
                  </span>
                  <span className="text-[0.875rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)] w-6 text-center">
                    {dish.qty}
                  </span>
                  <span className="size-7 rounded-[var(--p-border-radius-150)] bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center text-[0.75rem] text-[var(--p-color-text-secondary)]">
                    +
                  </span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Pricing */}
        <section
          id="tutorial-bundle-pricing"
          className="space-y-[var(--p-space-400)]"
        >
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.pricing}
          </h2>
          <div>
            <Label>{t.portionSizes}</Label>
            <div className="mt-[var(--p-space-200)]">
              <div className="flex items-center gap-[var(--p-space-400)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)]">
                <span className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] min-w-[80px]">
                  {t.portionLabel}
                </span>
                <span className="text-[0.8125rem] text-[var(--p-color-text-secondary)] flex-1">
                  {t.portionSize}
                </span>
                <div className="text-end">
                  <span className="text-[0.8125rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
                    {t.portionPrice}
                  </span>
                  <span className="text-[0.75rem] text-[var(--p-color-text-secondary)] line-through ms-[var(--p-space-200)]">
                    {t.portionOriginal}
                  </span>
                </div>
              </div>
            </div>
            <HelpText>{t.pricingHelp}</HelpText>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Availability */}
        <section
          id="tutorial-bundle-availability"
          className="space-y-[var(--p-space-400)]"
        >
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.availability}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--p-space-400)]">
            <div>
              <Label>{t.maxQty}</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                {t.maxQtyValue}
              </div>
            </div>
            <div>
              <Label>{t.availableDays}</Label>
              <div className="mt-[var(--p-space-200)] flex flex-wrap gap-[var(--p-space-100)]">
                {t.days.map((day, i) => (
                  <span
                    key={i}
                    className="px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-150)] text-[0.6875rem] font-[var(--p-font-weight-semibold)] bg-[var(--p-color-bg-fill-brand-selected)] text-[var(--p-color-text-brand)]"
                  >
                    {day}
                  </span>
                ))}
              </div>
              <HelpText>{t.availableDaysHelp}</HelpText>
            </div>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Customizations */}
        <section
          id="tutorial-bundle-customizations"
          className="space-y-[var(--p-space-400)]"
        >
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.customizations}
          </h2>
          <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border)] overflow-hidden">
            <div className="px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-fill-secondary)] border-b border-[var(--p-color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                    {t.modGroup}
                  </p>
                  <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                    {t.modGroupSub}
                  </p>
                </div>
                <Badge tone="info" size="sm">
                  {t.modOptions.length}
                </Badge>
              </div>
            </div>
            <div className="divide-y divide-[var(--p-color-border-secondary)]">
              {t.modOptions.map((mod, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between px-[var(--p-space-400)] py-[var(--p-space-200)]"
                >
                  <span className="text-[0.8125rem] text-[var(--p-color-text)]">
                    {mod.name}
                  </span>
                  <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">
                    {mod.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                              */
/* ------------------------------------------------------------------ */

export default function BundlesTutorialPage() {
  const router = useRouter();

  return (
    <TutorialPageWrapper
      title="Creating Bundles"
      description="Learn how to combine dishes into bundles with special pricing. All data here is fake, nothing is saved."
      icon={PackageFilledIcon}
      storageKey={STORAGE_KEY}
      breadcrumbs={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Tutorials", onClick: () => router.push("/dashboard/tutorials") },
        { label: "Creating Bundles" },
      ]}
      steps={STEPS}
    >
      <BundleTutorialContent />
    </TutorialPageWrapper>
  );
}
