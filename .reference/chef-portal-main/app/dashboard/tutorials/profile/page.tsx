"use client";

import { useRouter } from "next/navigation";
import type { DriveStep } from "driver.js";
import {
  PersonIcon,
  ImageIcon,
  ClockIcon,
  GlobeIcon,
} from "@shopify/polaris-icons";
import { TutorialPageWrapper } from "@/components/features/tutorials/tutorial-page-wrapper";
import { Badge, Label, HelpText } from "@/components/polaris";
import type { TutorialLanguage } from "@/lib/tutorial/tutorial-i18n";

const STORAGE_KEY = "yb-tutorial-completed-profile";

const STEPS: Record<TutorialLanguage, DriveStep[]> = {
  en: [
    {
      popover: {
        title: "Welcome to Your Chef Profile!",
        description:
          "Your profile is what customers see when they visit your page. This tutorial walks you through every section — from basic info to operations settings.",
      },
    },
    {
      element: "#tutorial-profile-wizard-nav",
      popover: {
        title: "Profile Wizard",
        description:
          "Your profile is organized into 5 steps. You can jump between them using the sidebar. A progress bar at the top tracks how complete your profile is.",
      },
    },
    {
      element: "#tutorial-profile-basic",
      popover: {
        title: "Step 1: Basic Info",
        description:
          "Enter your business name — this is the name customers see on the storefront. You can also add your years of cooking experience.",
      },
    },
    {
      element: "#tutorial-profile-about",
      popover: {
        title: "Step 2: About You",
        description:
          "Tell your story! Add a short bio, share your culinary journey, and what inspires your cooking. Customers love getting to know the chef behind the food.",
      },
    },
    {
      element: "#tutorial-profile-cuisines",
      popover: {
        title: "Step 3: Cuisines",
        description:
          "Select the types of cuisine you specialize in (e.g., Middle Eastern, Indian, Italian). This helps customers find you when browsing by cuisine type.",
      },
    },
    {
      element: "#tutorial-profile-branding",
      popover: {
        title: "Step 4: Branding",
        description:
          "Upload a banner image for your storefront page. Use a high-quality, wide image (recommended 1920x600px) that represents your brand and food style.",
      },
    },
    {
      element: "#tutorial-profile-operations",
      popover: {
        title: "Step 5: Operations",
        description:
          "Configure your operational settings — timezone, availability status, auto-accept orders, and whether you accept pickup orders.",
      },
    },
    {
      element: "#tutorial-profile-availability",
      popover: {
        title: "Availability Toggle",
        description:
          'When set to "Available", customers can place orders. Toggle off when you need a break, are on vacation, or can\'t accept new orders.',
      },
    },
    {
      element: "#tutorial-profile-schedule",
      popover: {
        title: "Delivery & Pickup Times",
        description:
          "Set your weekly availability schedule. Add time slots for each day you're available. Customers can only place orders within these windows.",
      },
    },
    {
      popover: {
        title: "You're All Set!",
        description:
          "Head to Profile to complete your setup. A strong profile with a great bio, banner image, and clear schedule builds trust and attracts more customers!",
      },
    },
  ],
  ar: [
    {
      popover: {
        title: "مرحبًا بك في ملف الشيف!",
        description:
          "ملفك الشخصي هو ما يراه العملاء عند زيارة صفحتك. هذا الشرح يرشدك خلال كل قسم — من المعلومات الأساسية إلى إعدادات العمليات.",
      },
    },
    {
      element: "#tutorial-profile-wizard-nav",
      popover: {
        title: "معالج الملف الشخصي",
        description:
          "ملفك الشخصي منظم في ٥ خطوات. يمكنك التنقل بينها عبر الشريط الجانبي. شريط التقدم في الأعلى يتابع اكتمال ملفك.",
      },
    },
    {
      element: "#tutorial-profile-basic",
      popover: {
        title: "الخطوة ١: المعلومات الأساسية",
        description:
          "أدخل اسم عملك — هذا هو الاسم الذي يراه العملاء في الواجهة. يمكنك أيضًا إضافة سنوات خبرتك في الطبخ.",
      },
    },
    {
      element: "#tutorial-profile-about",
      popover: {
        title: "الخطوة ٢: عنك",
        description:
          "احكِ قصتك! أضف نبذة قصيرة، شارك رحلتك في الطبخ، وما يلهمك. العملاء يحبون التعرف على الشيف خلف الطعام.",
      },
    },
    {
      element: "#tutorial-profile-cuisines",
      popover: {
        title: "الخطوة ٣: المطابخ",
        description:
          "اختر أنواع المطبخ التي تتخصص فيها (مثل: شرق أوسطي، هندي، إيطالي). هذا يساعد العملاء على إيجادك عند التصفح حسب نوع المطبخ.",
      },
    },
    {
      element: "#tutorial-profile-branding",
      popover: {
        title: "الخطوة ٤: العلامة التجارية",
        description:
          "ارفع صورة بانر لصفحتك. استخدم صورة عالية الجودة وعريضة (الموصى به ١٩٢٠×٦٠٠ بكسل) تمثل علامتك التجارية وأسلوب طعامك.",
      },
    },
    {
      element: "#tutorial-profile-operations",
      popover: {
        title: "الخطوة ٥: العمليات",
        description:
          "اضبط إعدادات العمل — المنطقة الزمنية، حالة التوفر، القبول التلقائي للطلبات، وما إذا كنت تقبل طلبات الاستلام.",
      },
    },
    {
      element: "#tutorial-profile-availability",
      popover: {
        title: "مفتاح التوفر",
        description:
          'عند ضبطه على "متاح"، يمكن للعملاء تقديم الطلبات. أوقفه عندما تحتاج استراحة أو في إجازة أو لا تستطيع قبول طلبات جديدة.',
      },
    },
    {
      element: "#tutorial-profile-schedule",
      popover: {
        title: "أوقات التوصيل والاستلام",
        description:
          "حدد جدول توفرك الأسبوعي. أضف فترات زمنية لكل يوم تكون فيه متاحًا. العملاء يمكنهم الطلب فقط ضمن هذه الأوقات.",
      },
    },
    {
      popover: {
        title: "أنت جاهز!",
        description:
          "توجه إلى الملف الشخصي لإكمال إعدادك. ملف قوي بنبذة رائعة وصورة بانر وجدول واضح يبني الثقة ويجذب المزيد من العملاء!",
      },
    },
  ],
  ur: [
    {
      popover: {
        title: "شیف پروفائل میں خوش آمدید!",
        description:
          "آپ کا پروفائل وہ ہے جو گاہک آپ کا صفحہ دیکھتے وقت نظر آتا ہے۔ یہ ٹیوٹوریل ہر سیکشن سے گزارتا ہے — بنیادی معلومات سے آپریشنز تک۔",
      },
    },
    {
      element: "#tutorial-profile-wizard-nav",
      popover: {
        title: "پروفائل وزرڈ",
        description:
          "آپ کا پروفائل ۵ مراحل میں ترتیب دیا گیا ہے۔ سائیڈبار سے کسی بھی مرحلے پر جا سکتے ہیں۔ اوپر پروگریس بار دکھاتا ہے کہ پروفائل کتنا مکمل ہے۔",
      },
    },
    {
      element: "#tutorial-profile-basic",
      popover: {
        title: "مرحلہ ۱: بنیادی معلومات",
        description:
          "اپنے کاروبار کا نام درج کریں — یہ وہ نام ہے جو گاہکوں کو اسٹور فرنٹ پر نظر آتا ہے۔ آپ کھانا پکانے کے تجربے کے سال بھی شامل کر سکتے ہیں۔",
      },
    },
    {
      element: "#tutorial-profile-about",
      popover: {
        title: "مرحلہ ۲: آپ کے بارے میں",
        description:
          "اپنی کہانی سنائیں! مختصر تعارف شامل کریں، اپنا کھانا پکانے کا سفر بتائیں، اور کیا چیز آپ کو متاثر کرتی ہے۔ گاہک کھانے کے پیچھے شیف کو جاننا پسند کرتے ہیں۔",
      },
    },
    {
      element: "#tutorial-profile-cuisines",
      popover: {
        title: "مرحلہ ۳: کھانے کی اقسام",
        description:
          "وہ کھانے کی اقسام منتخب کریں جن میں آپ ماہر ہیں (مثلاً: مشرق وسطی، ہندوستانی، اطالوی)۔ یہ گاہکوں کو کھانے کی قسم سے تلاش کرنے میں مدد کرتا ہے۔",
      },
    },
    {
      element: "#tutorial-profile-branding",
      popover: {
        title: "مرحلہ ۴: برانڈنگ",
        description:
          "اپنے اسٹور فرنٹ صفحے کے لیے بینر تصویر اپلوڈ کریں۔ اعلی معیار کی چوڑی تصویر استعمال کریں (تجویز کردہ ۱۹۲۰×۶۰۰ پکسل) جو آپ کے برانڈ کی نمائندگی کرے۔",
      },
    },
    {
      element: "#tutorial-profile-operations",
      popover: {
        title: "مرحلہ ۵: آپریشنز",
        description:
          "اپنی آپریشنل ترتیبات کنفیگر کریں — ٹائم زون، دستیابی کی حالت، آرڈرز خود بخود قبول کرنا، اور کیا آپ پک اپ آرڈرز قبول کرتے ہیں۔",
      },
    },
    {
      element: "#tutorial-profile-availability",
      popover: {
        title: "دستیابی ٹوگل",
        description:
          '"دستیاب" پر سیٹ ہونے پر، گاہک آرڈر دے سکتے ہیں۔ جب آپ کو وقفے کی ضرورت ہو، چھٹی پر ہوں، یا نئے آرڈر قبول نہ کر سکیں تو بند کریں۔',
      },
    },
    {
      element: "#tutorial-profile-schedule",
      popover: {
        title: "ڈیلیوری اور پک اپ اوقات",
        description:
          "اپنا ہفتہ وار دستیابی شیڈول سیٹ کریں۔ ہر دن کے لیے ٹائم سلاٹ شامل کریں جب آپ دستیاب ہوں۔ گاہک صرف انہی اوقات میں آرڈر دے سکتے ہیں۔",
      },
    },
    {
      popover: {
        title: "آپ تیار ہیں!",
        description:
          "پروفائل پر جائیں اپنی سیٹ اپ مکمل کرنے کے لیے۔ بہترین تعارف، بینر تصویر، اور واضح شیڈول والا مضبوط پروفائل اعتماد بناتا اور زیادہ گاہک کھینچتا ہے!",
      },
    },
  ],
};

export default function ProfileTutorialPage() {
  const router = useRouter();

  return (
    <TutorialPageWrapper
      title="Chef Profile"
      description="Set up your chef profile — business name, bio, cuisines, branding, and operations settings. All data here is fake, nothing is saved."
      icon={PersonIcon}
      storageKey={STORAGE_KEY}
      breadcrumbs={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Tutorials", onClick: () => router.push("/dashboard/tutorials") },
        { label: "Chef Profile" },
      ]}
      steps={STEPS}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--p-space-500)]">
        {/* Wizard sidebar */}
        <div className="lg:col-span-3">
          <div id="tutorial-profile-wizard-nav" className="space-y-[var(--p-space-100)]">
            {["Basic Info", "About You", "Cuisines", "Branding", "Operations"].map((label, i) => (
              <div
                key={label}
                className={`flex items-center gap-[var(--p-space-300)] px-[var(--p-space-300)] py-[var(--p-space-200)] rounded-[var(--p-border-radius-200)] text-[0.8125rem] ${
                  i === 0
                    ? "bg-[var(--p-color-bg-fill-secondary)] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]"
                    : "text-[var(--p-color-text-secondary)]"
                }`}
              >
                <span className={`flex items-center justify-center size-6 rounded-full text-[0.6875rem] font-[var(--p-font-weight-bold)] ${
                  i < 2 ? "bg-[var(--p-color-bg-fill-success)] text-white" : "bg-[var(--p-color-bg-fill-secondary)] text-[var(--p-color-text-secondary)]"
                }`}>
                  {i < 2 ? "\u2713" : i + 1}
                </span>
                {label}
              </div>
            ))}
          </div>
        </div>

        {/* Main content */}
        <div className="lg:col-span-9 space-y-[var(--p-space-600)]">
          {/* Basic Info */}
          <section id="tutorial-profile-basic" className="space-y-[var(--p-space-400)]">
            <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">Basic Info</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-[var(--p-space-400)]">
              <div>
                <Label>Business Name</Label>
                <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                  Chef Amira&apos;s Kitchen
                </div>
                <HelpText>Shown to customers on the storefront</HelpText>
              </div>
              <div>
                <Label>Years of Experience</Label>
                <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                  12
                </div>
              </div>
            </div>
          </section>

          <hr className="border-[var(--p-color-border-secondary)]" />

          {/* About You */}
          <section id="tutorial-profile-about" className="space-y-[var(--p-space-400)]">
            <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">About You</h2>
            <div>
              <Label>Bio</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
                Passionate home chef specializing in authentic Middle Eastern cuisine
              </div>
            </div>
            <div>
              <Label>Your Story</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] min-h-[80px]">
                I grew up in my grandmother&apos;s kitchen in Amman, where every meal was a celebration. After moving to the US, I realized how much I missed the authentic flavors of home...
              </div>
            </div>
            <div>
              <Label>What Inspires You</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] min-h-[60px]">
                Fresh, seasonal ingredients and the joy of sharing food that brings people together across cultures.
              </div>
            </div>
          </section>

          <hr className="border-[var(--p-color-border-secondary)]" />

          {/* Cuisines */}
          <section id="tutorial-profile-cuisines" className="space-y-[var(--p-space-400)]">
            <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">Cuisines</h2>
            <div className="flex flex-wrap gap-[var(--p-space-200)]">
              {[
                { flag: "\ud83c\uddf1\ud83c\udde7", name: "Middle Eastern" },
                { flag: "\ud83c\uddf1\ud83c\udde7", name: "Lebanese" },
                { flag: "\ud83c\uddee\ud83c\uddf3", name: "Indian" },
              ].map((c) => (
                <span
                  key={c.name}
                  className="flex items-center gap-[var(--p-space-150)] px-[var(--p-space-300)] py-[var(--p-space-100)] rounded-full border border-[var(--p-color-border)] bg-[var(--p-color-bg-surface)] text-[0.8125rem]"
                >
                  {c.flag} {c.name}
                  <span className="text-[var(--p-color-text-secondary)] ml-[var(--p-space-050)] cursor-pointer">&times;</span>
                </span>
              ))}
            </div>
            <HelpText>Search and add the cuisines you specialize in</HelpText>
          </section>

          <hr className="border-[var(--p-color-border-secondary)]" />

          {/* Branding */}
          <section id="tutorial-profile-branding" className="space-y-[var(--p-space-400)]">
            <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">Branding</h2>
            <div className="aspect-[3.2/1] rounded-[var(--p-border-radius-300)] border-2 border-dashed border-[var(--p-color-border)] bg-[var(--p-color-bg-fill-secondary)] flex flex-col items-center justify-center gap-[var(--p-space-200)]">
              <ImageIcon className="size-8 fill-[var(--p-color-icon-secondary)]" />
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Banner Image</p>
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">Recommended: 1920 x 600px &middot; Max 10MB</p>
            </div>
          </section>

          <hr className="border-[var(--p-color-border-secondary)]" />

          {/* Operations */}
          <section id="tutorial-profile-operations" className="space-y-[var(--p-space-400)]">
            <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">Operations</h2>

            <div>
              <Label>Timezone</Label>
              <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] flex items-center gap-[var(--p-space-200)]">
                <GlobeIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
                Eastern Time (ET)
              </div>
            </div>

            <div id="tutorial-profile-availability" className="space-y-[var(--p-space-300)]">
              <div className="flex items-center justify-between rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)]">
                <div>
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">Available</p>
                  <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">Accepting new orders</p>
                </div>
                <div className="w-10 h-[22px] rounded-full bg-[var(--p-color-bg-fill-success)] relative">
                  <span className="absolute right-0.5 top-0.5 size-[18px] rounded-full bg-white shadow-sm" />
                </div>
              </div>
              <div className="flex items-center justify-between rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-400)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)]">
                <div>
                  <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">Auto Accept Orders</p>
                  <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">Automatically accept without manual review</p>
                </div>
                <div className="w-10 h-[22px] rounded-full bg-[var(--p-color-bg-fill-secondary)] relative">
                  <span className="absolute left-0.5 top-0.5 size-[18px] rounded-full bg-white shadow-sm" />
                </div>
              </div>
            </div>

            <div id="tutorial-profile-schedule" className="space-y-[var(--p-space-200)]">
              <Label>Delivery &amp; Pickup Times</Label>
              {[
                { day: "Monday", start: "9:00 AM", end: "5:00 PM" },
                { day: "Wednesday", start: "10:00 AM", end: "6:00 PM" },
                { day: "Friday", start: "9:00 AM", end: "8:00 PM" },
              ].map((slot) => (
                <div key={slot.day} className="flex items-center gap-[var(--p-space-300)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-400)] py-[var(--p-space-200)] bg-[var(--p-color-bg-surface)] text-[0.8125rem]">
                  <span className="font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] min-w-[90px]">{slot.day}</span>
                  <span className="flex items-center gap-[var(--p-space-100)] text-[var(--p-color-text-secondary)]">
                    <ClockIcon className="size-3.5 fill-[var(--p-color-icon-secondary)]" />
                    {slot.start} — {slot.end}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </TutorialPageWrapper>
  );
}
