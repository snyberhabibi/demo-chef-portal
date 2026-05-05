"use client";

import { useRouter } from "next/navigation";
import type { DriveStep } from "driver.js";
import { ImageIcon, ClockIcon } from "@shopify/polaris-icons";
import { DishIcon } from "@/components/icons/dish-icon";
import { TutorialPageWrapper } from "@/components/features/tutorials/tutorial-page-wrapper";
import { Badge, Label, HelpText } from "@/components/polaris";
import type { TutorialLanguage } from "@/lib/tutorial/tutorial-i18n";

const STORAGE_KEY = "yb-tutorial-completed-dishes";

/* ------------------------------------------------------------------ */
/*  driver.js steps per language                                      */
/* ------------------------------------------------------------------ */

const STEPS: Record<TutorialLanguage, DriveStep[]> = {
  en: [
    {
      popover: {
        title: "Welcome to Dish Creation!",
        description:
          "This tutorial walks you through every step of creating a dish on your Chef Portal. All data shown is fake — nothing is saved. Let's get started!",
      },
    },
    {
      element: "#tutorial-dish-wizard-nav",
      popover: {
        title: "The Wizard Navigation",
        description:
          "Dish creation uses a step-by-step wizard. You can click any step in the sidebar to jump to it, or use Next/Back buttons. The checkmarks show which steps are complete.",
      },
    },
    {
      element: "#tutorial-dish-details",
      popover: {
        title: "Step 1: Dish Details",
        description:
          "Start with the basics — give your dish a name and a mouth-watering description. Pick the cuisine (e.g., Middle Eastern, Indian) and category (e.g., Main Course, Appetizer).",
      },
    },
    {
      element: "#tutorial-dish-status",
      popover: {
        title: "Dish Status",
        description:
          'New dishes start as "Draft" so you can build them without customers seeing them. Set to "Published" when you\'re ready to go live. You can also "Archive" dishes you no longer sell.',
      },
    },
    {
      element: "#tutorial-dish-lead-time",
      popover: {
        title: "Lead Time",
        description:
          "How much advance notice do you need to prepare this dish? Set it in hours or days. Customers won't be able to order it with less lead time than this.",
      },
    },
    {
      element: "#tutorial-dish-media",
      popover: {
        title: "Step 2: Media / Photos",
        description:
          "Upload up to 4 photos of your dish. The first image becomes the primary photo shown to customers. Use well-lit, appetizing shots — they make a big difference in sales!",
      },
    },
    {
      element: "#tutorial-dish-specs",
      popover: {
        title: "Step 3: Specs & Portions",
        description:
          "Set spice levels (mild, medium, hot, etc.), portion sizes with pricing, and list your ingredients, allergens, and dietary labels. This information helps customers make informed choices.",
      },
    },
    {
      element: "#tutorial-dish-portions",
      popover: {
        title: "Portion Sizes & Pricing",
        description:
          'Each dish needs at least one portion size. You can offer multiple (e.g., "Regular" at $14.99 and "Family" at $39.99). Customers pick their preferred size when ordering.',
      },
    },
    {
      element: "#tutorial-dish-allergens",
      popover: {
        title: "Ingredients, Allergens & Dietary Labels",
        description:
          "List all ingredients and tag any allergens (nuts, dairy, gluten, etc.). Add dietary labels like Halal, Vegan, or Gluten-Free. These appear on your dish card and order labels.",
      },
    },
    {
      element: "#tutorial-dish-availability",
      popover: {
        title: "Step 4: Availability",
        description:
          "Control when and how much of this dish is available. Set a max quantity per day (or leave unlimited) and choose which days of the week the dish is offered.",
      },
    },
    {
      element: "#tutorial-dish-customizations",
      popover: {
        title: "Step 5: Customizations",
        description:
          'Add modifier groups to let customers customize their order — like "Choose your protein", "Extra toppings", or "Spice preference". Each group can be required or optional, with single or multiple selections.',
      },
    },
    {
      popover: {
        title: "You're Ready to Create Dishes!",
        description:
          'That covers the full dish creation flow. When you\'re ready, head to Dishes → Create Dish to make your first one. Start with "Draft" status so you can perfect it before publishing!',
      },
    },
  ],
  ar: [
    {
      popover: {
        title: "مرحبًا بك في إنشاء الأطباق!",
        description:
          "سيرشدك هذا الشرح خطوة بخطوة لإنشاء طبق في بوابة الشيف. جميع البيانات المعروضة وهمية — لن يتم حفظ أي شيء. هيا نبدأ!",
      },
    },
    {
      element: "#tutorial-dish-wizard-nav",
      popover: {
        title: "التنقل بين الخطوات",
        description:
          "إنشاء الطبق يستخدم معالجًا خطوة بخطوة. يمكنك النقر على أي خطوة في الشريط الجانبي للانتقال إليها. علامات الصح تُظهر الخطوات المكتملة.",
      },
    },
    {
      element: "#tutorial-dish-details",
      popover: {
        title: "الخطوة ١: تفاصيل الطبق",
        description:
          "ابدأ بالأساسيات — أعطِ طبقك اسمًا ووصفًا شهيًا. اختر نوع المطبخ (مثل: شرقي، هندي) والفئة (مثل: طبق رئيسي، مقبلات).",
      },
    },
    {
      element: "#tutorial-dish-status",
      popover: {
        title: "حالة الطبق",
        description:
          'الأطباق الجديدة تبدأ كـ "مسودة" لتتمكن من بنائها دون أن يراها العملاء. اضبطها على "منشور" عندما تكون جاهزًا. يمكنك أيضًا "أرشفة" الأطباق التي لم تعد تبيعها.',
      },
    },
    {
      element: "#tutorial-dish-lead-time",
      popover: {
        title: "وقت التحضير المسبق",
        description:
          "كم من الوقت تحتاج مسبقًا لتحضير هذا الطبق؟ حدده بالساعات أو الأيام. لن يتمكن العملاء من طلبه بوقت أقل من هذا.",
      },
    },
    {
      element: "#tutorial-dish-media",
      popover: {
        title: "الخطوة ٢: الصور",
        description:
          "ارفع حتى ٤ صور لطبقك. الصورة الأولى تصبح الصورة الرئيسية. استخدم صورًا بإضاءة جيدة وشهية — فهي تُحدث فرقًا كبيرًا في المبيعات!",
      },
    },
    {
      element: "#tutorial-dish-specs",
      popover: {
        title: "الخطوة ٣: المواصفات والحصص",
        description:
          "حدد مستويات التوابل (خفيف، متوسط، حار، إلخ)، وأحجام الحصص مع الأسعار، واذكر المكونات والمسببات للحساسية والملصقات الغذائية.",
      },
    },
    {
      element: "#tutorial-dish-portions",
      popover: {
        title: "أحجام الحصص والأسعار",
        description:
          'كل طبق يحتاج حصة واحدة على الأقل. يمكنك تقديم عدة أحجام (مثل: "عادي" بـ ١٤.٩٩$ و"عائلي" بـ ٣٩.٩٩$). العملاء يختارون الحجم المفضل عند الطلب.',
      },
    },
    {
      element: "#tutorial-dish-allergens",
      popover: {
        title: "المكونات والمسببات للحساسية",
        description:
          "اذكر جميع المكونات وحدد أي مسببات للحساسية (مكسرات، ألبان، جلوتين، إلخ). أضف ملصقات غذائية مثل حلال، نباتي، أو خالٍ من الجلوتين.",
      },
    },
    {
      element: "#tutorial-dish-availability",
      popover: {
        title: "الخطوة ٤: التوفر",
        description:
          "تحكم في متى وكمية هذا الطبق المتاحة. حدد أقصى كمية في اليوم (أو اتركها بلا حد) واختر أيام الأسبوع المتاحة.",
      },
    },
    {
      element: "#tutorial-dish-customizations",
      popover: {
        title: "الخطوة ٥: التخصيصات",
        description:
          'أضف مجموعات التعديل للسماح للعملاء بتخصيص طلبهم — مثل "اختر البروتين"، "إضافات إضافية"، أو "تفضيل التوابل". كل مجموعة يمكن أن تكون إلزامية أو اختيارية.',
      },
    },
    {
      popover: {
        title: "أنت جاهز لإنشاء الأطباق!",
        description:
          'هذا يغطي عملية إنشاء الطبق بالكامل. عندما تكون جاهزًا، توجه إلى الأطباق ← إنشاء طبق. ابدأ بحالة "مسودة" لتتمكن من إتقانه قبل النشر!',
      },
    },
  ],
  ur: [
    {
      popover: {
        title: "ڈش بنانے میں خوش آمدید!",
        description:
          "یہ ٹیوٹوریل آپ کو شیف پورٹل پر ڈش بنانے کے ہر مرحلے سے گزارے گا۔ دکھایا گیا تمام ڈیٹا فرضی ہے — کچھ بھی محفوظ نہیں ہوگا۔ شروع کرتے ہیں!",
      },
    },
    {
      element: "#tutorial-dish-wizard-nav",
      popover: {
        title: "وزرڈ نیویگیشن",
        description:
          "ڈش بنانا مرحلہ وار وزرڈ استعمال کرتا ہے۔ آپ سائیڈبار میں کسی بھی مرحلے پر کلک کر کے جا سکتے ہیں۔ چیک مارکس مکمل مراحل دکھاتے ہیں۔",
      },
    },
    {
      element: "#tutorial-dish-details",
      popover: {
        title: "مرحلہ ۱: ڈش کی تفصیلات",
        description:
          "بنیادی باتوں سے شروع کریں — اپنی ڈش کو نام اور لذیذ تفصیل دیں۔ کھانے کی قسم (مثلاً: مشرق وسطی، ہندوستانی) اور زمرہ (مثلاً: مین کورس، سٹارٹر) منتخب کریں۔",
      },
    },
    {
      element: "#tutorial-dish-status",
      popover: {
        title: "ڈش کی حالت",
        description:
          'نئی ڈشیں "ڈرافٹ" کے طور پر شروع ہوتی ہیں تاکہ آپ بغیر گاہکوں کو دکھائے بنا سکیں۔ جب تیار ہوں تو "شائع شدہ" پر سیٹ کریں۔ آپ پرانی ڈشیں "آرکائیو" بھی کر سکتے ہیں۔',
      },
    },
    {
      element: "#tutorial-dish-lead-time",
      popover: {
        title: "تیاری کا وقت",
        description:
          "اس ڈش کی تیاری کے لیے آپ کو کتنا پہلے سے وقت چاہیے؟ اسے گھنٹوں یا دنوں میں سیٹ کریں۔ گاہک اس سے کم وقت میں آرڈر نہیں کر سکیں گے۔",
      },
    },
    {
      element: "#tutorial-dish-media",
      popover: {
        title: "مرحلہ ۲: تصاویر",
        description:
          "اپنی ڈش کی ۴ تک تصاویر اپلوڈ کریں۔ پہلی تصویر مرکزی تصویر بنتی ہے۔ اچھی روشنی والی، بھوک لگانے والی تصاویر استعمال کریں — یہ فروخت میں بڑا فرق ڈالتی ہیں!",
      },
    },
    {
      element: "#tutorial-dish-specs",
      popover: {
        title: "مرحلہ ۳: تفصیلات اور حصے",
        description:
          "مسالے کی سطح (ہلکا، درمیانہ، تیز وغیرہ)، حصوں کے سائز قیمتوں کے ساتھ، اور اجزاء، الرجی اور غذائی لیبل درج کریں۔",
      },
    },
    {
      element: "#tutorial-dish-portions",
      popover: {
        title: "حصوں کے سائز اور قیمتیں",
        description:
          'ہر ڈش کو کم از کم ایک حصے کی ضرورت ہے۔ آپ متعدد سائز پیش کر سکتے ہیں (مثلاً: "ریگولر" $14.99 میں اور "فیملی" $39.99 میں)۔ گاہک آرڈر کرتے وقت پسندیدہ سائز چنتے ہیں۔',
      },
    },
    {
      element: "#tutorial-dish-allergens",
      popover: {
        title: "اجزاء، الرجی اور غذائی لیبل",
        description:
          "تمام اجزاء درج کریں اور الرجی والے مادے نشان زد کریں (گری دار میوے، دودھ، گلوٹین وغیرہ)۔ حلال، ویگن، یا گلوٹین فری جیسے غذائی لیبل شامل کریں۔",
      },
    },
    {
      element: "#tutorial-dish-availability",
      popover: {
        title: "مرحلہ ۴: دستیابی",
        description:
          "اس ڈش کی دستیابی کنٹرول کریں۔ یومیہ زیادہ سے زیادہ مقدار مقرر کریں (یا لامحدود رکھیں) اور ہفتے کے دن منتخب کریں۔",
      },
    },
    {
      element: "#tutorial-dish-customizations",
      popover: {
        title: "مرحلہ ۵: حسب ضرورت تبدیلیاں",
        description:
          'گاہکوں کو اپنا آرڈر حسب ضرورت بنانے کے لیے ترمیمی گروپ شامل کریں — جیسے "پروٹین منتخب کریں"، "اضافی ٹاپنگز"، یا "مسالے کی ترجیح"۔ ہر گروپ لازمی یا اختیاری ہو سکتا ہے۔',
      },
    },
    {
      popover: {
        title: "آپ ڈشیں بنانے کے لیے تیار ہیں!",
        description:
          'یہ ڈش بنانے کا مکمل عمل تھا۔ جب تیار ہوں تو ڈشیں ← ڈش بنائیں پر جائیں۔ "ڈرافٹ" حالت سے شروع کریں تاکہ شائع کرنے سے پہلے مکمل کر سکیں!',
      },
    },
  ],
};

/* ------------------------------------------------------------------ */
/*  Visual demo content per language                                  */
/* ------------------------------------------------------------------ */

const CONTENT = {
  en: {
    dishDetails: "Dish Details",
    dishName: "Dish Name",
    dishNameValue: "Grilled Chicken Shawarma Plate",
    description: "Description",
    descriptionValue:
      "Tender marinated chicken thigh, slow-grilled and served with tahini, fresh pickles, garlic sauce, and warm pita bread.",
    cuisine: "Cuisine",
    cuisineValue: "\ud83c\uddf1\ud83c\udde7 Middle Eastern",
    category: "Category",
    categoryValue: "Main Course",
    status: "Status",
    leadTime: "Lead Time",
    leadTimeValue: "24 hours",
    leadTimeHelp: "Advance notice needed to prepare",
    statusHelp: "Start as Draft, publish when ready",
    media: "Media",
    primaryPhoto: "Primary Photo",
    specsTitle: "Specs & Portions",
    spiceLevels: "Spice Levels",
    spiceLabels: ["None", "Mild", "Medium", "Hot", "Extra Hot"],
    portionSizes: "Portion Sizes",
    portions: [
      { label: "Regular", size: "1 serving", price: "$14.99" },
      { label: "Family", size: "4 servings", price: "$39.99" },
    ],
    allergensTitle: "Allergens & Dietary Labels",
    allergens: ["Sesame", "Gluten"],
    dietaryLabels: ["Halal"],
    availability: "Availability",
    maxQty: "Max Quantity Per Day",
    maxQtyValue: "20 servings",
    maxQtyHelp: "Leave empty for unlimited",
    availableDays: "Available Days",
    days: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    customizations: "Customizations",
    modGroup1: "Choose Your Protein",
    modGroup1Sub: "Single selection \u00b7 Required",
    modGroup1Options: [
      { name: "Chicken", price: "Included" },
      { name: "Lamb", price: "+$3.00" },
      { name: "Falafel (Vegan)", price: "+$1.00" },
    ],
    modGroup2: "Extras",
    modGroup2Sub: "Multiple selection \u00b7 Optional",
    modGroup2Options: [
      { name: "Extra Garlic Sauce", price: "+$1.50" },
      { name: "Add Hummus", price: "+$2.00" },
      { name: "Extra Pita Bread", price: "+$1.00" },
      { name: "Side of Fries", price: "+$3.50" },
    ],
    wizardSteps: [
      "Dish Details",
      "Media",
      "Specs & Portions",
      "Availability",
      "Customizations",
    ],
  },
  ar: {
    dishDetails: "تفاصيل الطبق",
    dishName: "اسم الطبق",
    dishNameValue: "طبق شاورما الدجاج المشوي",
    description: "الوصف",
    descriptionValue:
      "فخذ دجاج متبل وطري، مشوي ببطء ويُقدم مع الطحينة والمخللات الطازجة وصلصة الثوم وخبز البيتا الدافئ.",
    cuisine: "نوع المطبخ",
    cuisineValue: "\ud83c\uddf1\ud83c\udde7 شرق أوسطي",
    category: "الفئة",
    categoryValue: "طبق رئيسي",
    status: "الحالة",
    leadTime: "وقت التحضير",
    leadTimeValue: "٢٤ ساعة",
    leadTimeHelp: "الوقت المسبق المطلوب للتحضير",
    statusHelp: "ابدأ كمسودة، انشر عندما تكون جاهزًا",
    media: "الصور",
    primaryPhoto: "الصورة الرئيسية",
    specsTitle: "المواصفات والحصص",
    spiceLevels: "مستويات التوابل",
    spiceLabels: ["بدون", "خفيف", "متوسط", "حار", "حار جدًا"],
    portionSizes: "أحجام الحصص",
    portions: [
      { label: "عادي", size: "حصة واحدة", price: "١٤.٩٩$" },
      { label: "عائلي", size: "٤ حصص", price: "٣٩.٩٩$" },
    ],
    allergensTitle: "المسببات للحساسية والملصقات الغذائية",
    allergens: ["سمسم", "جلوتين"],
    dietaryLabels: ["حلال"],
    availability: "التوفر",
    maxQty: "أقصى كمية في اليوم",
    maxQtyValue: "٢٠ حصة",
    maxQtyHelp: "اتركه فارغًا للكمية غير المحدودة",
    availableDays: "الأيام المتاحة",
    days: ["إثنين", "ثلاثاء", "أربعاء", "خميس", "جمعة", "سبت", "أحد"],
    customizations: "التخصيصات",
    modGroup1: "اختر البروتين",
    modGroup1Sub: "اختيار واحد · إلزامي",
    modGroup1Options: [
      { name: "دجاج", price: "مشمول" },
      { name: "لحم غنم", price: "+٣.٠٠$" },
      { name: "فلافل (نباتي)", price: "+١.٠٠$" },
    ],
    modGroup2: "إضافات",
    modGroup2Sub: "اختيار متعدد · اختياري",
    modGroup2Options: [
      { name: "صلصة ثوم إضافية", price: "+١.٥٠$" },
      { name: "إضافة حمص", price: "+٢.٠٠$" },
      { name: "خبز بيتا إضافي", price: "+١.٠٠$" },
      { name: "بطاطس مقلية", price: "+٣.٥٠$" },
    ],
    wizardSteps: [
      "تفاصيل الطبق",
      "الصور",
      "المواصفات والحصص",
      "التوفر",
      "التخصيصات",
    ],
  },
  ur: {
    dishDetails: "ڈش کی تفصیلات",
    dishName: "ڈش کا نام",
    dishNameValue: "گرلڈ چکن شاورما پلیٹ",
    description: "تفصیل",
    descriptionValue:
      "نرم میرینیٹ شدہ چکن، آہستہ آہستہ گرل کیا ہوا، طحینی، تازہ اچار، لہسن کی چٹنی، اور گرم پیٹا بریڈ کے ساتھ پیش کیا جاتا ہے۔",
    cuisine: "کھانے کی قسم",
    cuisineValue: "\ud83c\uddf1\ud83c\udde7 مشرق وسطی",
    category: "زمرہ",
    categoryValue: "مین کورس",
    status: "حالت",
    leadTime: "تیاری کا وقت",
    leadTimeValue: "۲۴ گھنٹے",
    leadTimeHelp: "تیاری کے لیے پیشگی وقت درکار",
    statusHelp: "ڈرافٹ سے شروع کریں، تیار ہونے پر شائع کریں",
    media: "تصاویر",
    primaryPhoto: "مرکزی تصویر",
    specsTitle: "تفصیلات اور حصے",
    spiceLevels: "مسالے کی سطح",
    spiceLabels: ["بغیر", "ہلکا", "درمیانہ", "تیز", "بہت تیز"],
    portionSizes: "حصوں کے سائز",
    portions: [
      { label: "ریگولر", size: "۱ سرونگ", price: "$۱۴.۹۹" },
      { label: "فیملی", size: "۴ سرونگ", price: "$۳۹.۹۹" },
    ],
    allergensTitle: "الرجی اور غذائی لیبل",
    allergens: ["تل", "گلوٹین"],
    dietaryLabels: ["حلال"],
    availability: "دستیابی",
    maxQty: "یومیہ زیادہ سے زیادہ مقدار",
    maxQtyValue: "۲۰ سرونگ",
    maxQtyHelp: "لامحدود کے لیے خالی چھوڑیں",
    availableDays: "دستیاب دن",
    days: ["پیر", "منگل", "بدھ", "جمعرات", "جمعہ", "ہفتہ", "اتوار"],
    customizations: "حسب ضرورت تبدیلیاں",
    modGroup1: "پروٹین منتخب کریں",
    modGroup1Sub: "ایک انتخاب · لازمی",
    modGroup1Options: [
      { name: "چکن", price: "شامل" },
      { name: "بھیڑ کا گوشت", price: "+$۳.۰۰" },
      { name: "فلافل (ویگن)", price: "+$۱.۰۰" },
    ],
    modGroup2: "اضافی",
    modGroup2Sub: "متعدد انتخاب · اختیاری",
    modGroup2Options: [
      { name: "اضافی لہسن کی چٹنی", price: "+$۱.۵۰" },
      { name: "حمص شامل کریں", price: "+$۲.۰۰" },
      { name: "اضافی پیٹا بریڈ", price: "+$۱.۰۰" },
      { name: "فرائز", price: "+$۳.۵۰" },
    ],
    wizardSteps: [
      "ڈش کی تفصیلات",
      "تصاویر",
      "تفصیلات اور حصے",
      "دستیابی",
      "حسب ضرورت تبدیلیاں",
    ],
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Demo content component                                            */
/* ------------------------------------------------------------------ */

function DishTutorialContent() {
  const t = CONTENT.en;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--p-space-500)]">
      {/* Wizard sidebar */}
      <div className="lg:col-span-3">
        <div
          id="tutorial-dish-wizard-nav"
          className="space-y-[var(--p-space-100)]"
        >
          {t.wizardSteps.map((label, i) => {
            const complete = i < 2;
            const active = i === 0;
            return (
              <div
                key={label}
                className={`flex items-center gap-[var(--p-space-300)] px-[var(--p-space-300)] py-[var(--p-space-200)] rounded-[var(--p-border-radius-200)] text-[0.8125rem] ${
                  active
                    ? "bg-[var(--p-color-bg-fill-secondary)] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]"
                    : "text-[var(--p-color-text-secondary)]"
                }`}
              >
                <span
                  className={`flex items-center justify-center size-6 rounded-full text-[0.6875rem] font-[var(--p-font-weight-bold)] ${
                    complete
                      ? "bg-[var(--p-color-bg-fill-success)] text-white"
                      : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)]"
                  }`}
                >
                  {complete ? "\u2713" : i + 1}
                </span>
                {label}
              </div>
            );
          })}
        </div>
      </div>

      {/* Main form content */}
      <div className="lg:col-span-9 space-y-[var(--p-space-600)]">
        {/* Step 1: Dish Details */}
        <section
          id="tutorial-dish-details"
          className="space-y-[var(--p-space-400)]"
        >
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.dishDetails}
          </h2>
          <div className="space-y-[var(--p-space-400)]">
            <div>
              <Label>{t.dishName}</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                {t.dishNameValue}
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
                <Label>{t.cuisine}</Label>
                <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                  {t.cuisineValue}
                </div>
              </div>
              <div>
                <Label>{t.category}</Label>
                <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                  {t.categoryValue}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Status + Lead Time */}
        <section id="tutorial-dish-status">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--p-space-400)]">
            <div>
              <Label>{t.status}</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                <Badge tone="warning" size="sm">
                  Draft
                </Badge>
              </div>
              <HelpText>{t.statusHelp}</HelpText>
            </div>
            <div id="tutorial-dish-lead-time">
              <Label>{t.leadTime}</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] flex items-center gap-[var(--p-space-200)]">
                <ClockIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
                {t.leadTimeValue}
              </div>
              <HelpText>{t.leadTimeHelp}</HelpText>
            </div>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Step 2: Media */}
        <section
          id="tutorial-dish-media"
          className="space-y-[var(--p-space-400)]"
        >
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.media}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-[var(--p-space-300)]">
            {[t.primaryPhoto, "Photo 2", "Photo 3", "Photo 4"].map(
              (label, i) => (
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
                  <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                    {label}
                  </span>
                  {i === 0 && (
                    <Badge tone="info" size="sm">
                      Primary
                    </Badge>
                  )}
                </div>
              )
            )}
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Step 3: Specs & Portions */}
        <section
          id="tutorial-dish-specs"
          className="space-y-[var(--p-space-400)]"
        >
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.specsTitle}
          </h2>
          <div>
            <Label>{t.spiceLevels}</Label>
            <div className="mt-[var(--p-space-200)] flex flex-wrap gap-[var(--p-space-200)]">
              {t.spiceLabels.map((level, i) => (
                <span
                  key={i}
                  className={`px-[var(--p-space-300)] py-[var(--p-space-100)] rounded-full text-[0.75rem] font-[var(--p-font-weight-semibold)] ${
                    i >= 1 && i <= 3
                      ? "bg-[var(--p-color-bg-fill-brand-selected)] text-[var(--p-color-text-brand)]"
                      : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)]"
                  }`}
                >
                  {level}
                </span>
              ))}
            </div>
          </div>
          <div id="tutorial-dish-portions">
            <Label>{t.portionSizes}</Label>
            <div className="mt-[var(--p-space-200)] space-y-[var(--p-space-200)]">
              {t.portions.map((portion) => (
                <div
                  key={portion.label}
                  className="flex items-center gap-[var(--p-space-400)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)]"
                >
                  <span className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] min-w-[80px]">
                    {portion.label}
                  </span>
                  <span className="text-[0.8125rem] text-[var(--p-color-text-secondary)] flex-1">
                    {portion.size}
                  </span>
                  <span className="text-[0.8125rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
                    {portion.price}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div id="tutorial-dish-allergens">
            <Label>{t.allergensTitle}</Label>
            <div className="mt-[var(--p-space-200)] flex flex-wrap gap-[var(--p-space-200)]">
              {t.allergens.map((a) => (
                <Badge key={a} tone="critical" size="sm">
                  {a}
                </Badge>
              ))}
              {t.dietaryLabels.map((d) => (
                <Badge key={d} tone="success" size="sm">
                  {d}
                </Badge>
              ))}
            </div>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Step 4: Availability */}
        <section
          id="tutorial-dish-availability"
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
              <HelpText>{t.maxQtyHelp}</HelpText>
            </div>
            <div>
              <Label>{t.availableDays}</Label>
              <div className="mt-[var(--p-space-200)] flex flex-wrap gap-[var(--p-space-100)]">
                {t.days.map((day, i) => (
                  <span
                    key={i}
                    className={`px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-150)] text-[0.6875rem] font-[var(--p-font-weight-semibold)] ${
                      i < 5
                        ? "bg-[var(--p-color-bg-fill-brand-selected)] text-[var(--p-color-text-brand)]"
                        : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)]"
                    }`}
                  >
                    {day}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Step 5: Customizations */}
        <section
          id="tutorial-dish-customizations"
          className="space-y-[var(--p-space-400)]"
        >
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            {t.customizations}
          </h2>
          {/* Group 1 */}
          <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border)] overflow-hidden">
            <div className="px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-fill-secondary)] border-b border-[var(--p-color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                    {t.modGroup1}
                  </p>
                  <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                    {t.modGroup1Sub}
                  </p>
                </div>
                <Badge tone="info" size="sm">
                  {t.modGroup1Options.length}
                </Badge>
              </div>
            </div>
            <div className="divide-y divide-[var(--p-color-border-secondary)]">
              {t.modGroup1Options.map((mod) => (
                <div
                  key={mod.name}
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
          {/* Group 2 */}
          <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border)] overflow-hidden">
            <div className="px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-fill-secondary)] border-b border-[var(--p-color-border)]">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                    {t.modGroup2}
                  </p>
                  <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                    {t.modGroup2Sub}
                  </p>
                </div>
                <Badge tone="info" size="sm">
                  {t.modGroup2Options.length}
                </Badge>
              </div>
            </div>
            <div className="divide-y divide-[var(--p-color-border-secondary)]">
              {t.modGroup2Options.map((mod) => (
                <div
                  key={mod.name}
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

export default function DishesTutorialPage() {
  const router = useRouter();

  return (
    <TutorialPageWrapper
      title="Creating Dishes"
      description="Walk through every step of the dish creation wizard — from details to customizations. All data here is fake, nothing is saved."
      icon={DishIcon}
      storageKey={STORAGE_KEY}
      breadcrumbs={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Tutorials", onClick: () => router.push("/dashboard/tutorials") },
        { label: "Creating Dishes" },
      ]}
      steps={STEPS}
    >
      <DishTutorialContent />
    </TutorialPageWrapper>
  );
}
