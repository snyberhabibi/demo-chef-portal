"use client";

import { useRouter } from "next/navigation";
import type { DriveStep } from "driver.js";
import { LocationFilledIcon, SearchIcon } from "@shopify/polaris-icons";
import { TutorialPageWrapper } from "@/components/features/tutorials/tutorial-page-wrapper";
import { Badge, Label, HelpText } from "@/components/polaris";
import type { TutorialLanguage } from "@/lib/tutorial/tutorial-i18n";

const STORAGE_KEY = "yb-tutorial-completed-addresses";

const STEPS: Record<TutorialLanguage, DriveStep[]> = {
  en: [
    {
      popover: {
        title: "Address Management",
        description:
          "Your pickup address tells customers and delivery drivers where to find you. This tutorial walks you through setting it up.",
      },
    },
    {
      element: "#tutorial-address-search",
      popover: {
        title: "Search Your Address",
        description:
          "Start typing your address and select from the Google autocomplete suggestions. This automatically fills in the street, city, state, ZIP code, and coordinates.",
      },
    },
    {
      element: "#tutorial-address-details",
      popover: {
        title: "Additional Details",
        description:
          "Add your apartment or suite number if applicable. You can also add pickup instructions — like \"Ring doorbell twice\" or \"Use the side entrance\" — to help drivers find you.",
      },
    },
    {
      element: "#tutorial-address-preview",
      popover: {
        title: "Address Preview",
        description:
          "After selecting an address, a preview card shows the full parsed address. Double-check that everything looks correct before saving.",
      },
    },
    {
      element: "#tutorial-address-primary",
      popover: {
        title: "Primary Address",
        description:
          "Check this to make it your primary pickup address. This is the address used for all order pickups. You can only have one primary address.",
      },
    },
    {
      popover: {
        title: "You're All Set!",
        description:
          "Head to Address Management to set up or update your pickup address. Make sure your address is accurate — it affects delivery routing and customer experience!",
      },
    },
  ],
  ar: [
    {
      popover: {
        title: "إدارة العنوان",
        description:
          "عنوان الاستلام يخبر العملاء وسائقي التوصيل أين يجدونك. هذا الشرح يرشدك لإعداده.",
      },
    },
    {
      element: "#tutorial-address-search",
      popover: {
        title: "ابحث عن عنوانك",
        description:
          "ابدأ بكتابة عنوانك واختر من اقتراحات الإكمال التلقائي من جوجل. هذا يملأ تلقائيًا الشارع والمدينة والولاية والرمز البريدي والإحداثيات.",
      },
    },
    {
      element: "#tutorial-address-details",
      popover: {
        title: "تفاصيل إضافية",
        description:
          'أضف رقم شقتك أو جناحك إن وجد. يمكنك أيضًا إضافة تعليمات الاستلام — مثل "اضغط الجرس مرتين" أو "استخدم المدخل الجانبي" — لمساعدة السائقين.',
      },
    },
    {
      element: "#tutorial-address-preview",
      popover: {
        title: "معاينة العنوان",
        description:
          "بعد اختيار العنوان، تظهر بطاقة معاينة تعرض العنوان الكامل. تحقق أن كل شيء صحيح قبل الحفظ.",
      },
    },
    {
      element: "#tutorial-address-primary",
      popover: {
        title: "العنوان الرئيسي",
        description:
          "حدد هذا لجعله عنوان الاستلام الرئيسي. هذا هو العنوان المستخدم لجميع عمليات استلام الطلبات. يمكنك الحصول على عنوان رئيسي واحد فقط.",
      },
    },
    {
      popover: {
        title: "أنت جاهز!",
        description:
          "توجه إلى إدارة العنوان لإعداد أو تحديث عنوان الاستلام. تأكد من دقة عنوانك — فهو يؤثر على مسار التوصيل وتجربة العملاء!",
      },
    },
  ],
  ur: [
    {
      popover: {
        title: "ایڈریس مینجمنٹ",
        description:
          "آپ کا پک اپ ایڈریس گاہکوں اور ڈرائیوروں کو بتاتا ہے کہ آپ کہاں ملیں گے۔ یہ ٹیوٹوریل اسے سیٹ اپ کرنے میں رہنمائی کرتا ہے۔",
      },
    },
    {
      element: "#tutorial-address-search",
      popover: {
        title: "اپنا ایڈریس تلاش کریں",
        description:
          "اپنا ایڈریس ٹائپ کرنا شروع کریں اور گوگل آٹو کمپلیٹ تجاویز سے منتخب کریں۔ یہ خود بخود گلی، شہر، ریاست، زپ کوڈ، اور کوآرڈینیٹس بھر دیتا ہے۔",
      },
    },
    {
      element: "#tutorial-address-details",
      popover: {
        title: "اضافی تفصیلات",
        description:
          'اپارٹمنٹ یا سوئٹ نمبر شامل کریں اگر لاگو ہو۔ آپ پک اپ ہدایات بھی شامل کر سکتے ہیں — جیسے "دروازے کی گھنٹی دو بار بجائیں" یا "سائیڈ داخلی راستہ استعمال کریں"۔',
      },
    },
    {
      element: "#tutorial-address-preview",
      popover: {
        title: "ایڈریس پیش نظارہ",
        description:
          "ایڈریس منتخب کرنے کے بعد، پیش نظارہ کارڈ مکمل ایڈریس دکھاتا ہے۔ محفوظ کرنے سے پہلے دوبارہ چیک کریں کہ سب کچھ درست ہے۔",
      },
    },
    {
      element: "#tutorial-address-primary",
      popover: {
        title: "بنیادی ایڈریس",
        description:
          "اسے اپنا بنیادی پک اپ ایڈریس بنانے کے لیے چیک کریں۔ یہ وہ ایڈریس ہے جو تمام آرڈر پک اپس کے لیے استعمال ہوتا ہے۔ آپ کے پاس صرف ایک بنیادی ایڈریس ہو سکتا ہے۔",
      },
    },
    {
      popover: {
        title: "آپ تیار ہیں!",
        description:
          "ایڈریس مینجمنٹ پر جائیں اپنا پک اپ ایڈریس سیٹ اپ یا اپ ڈیٹ کرنے کے لیے۔ یقینی بنائیں کہ آپ کا ایڈریس درست ہے — یہ ڈیلیوری روٹنگ اور گاہک کے تجربے پر اثر ڈالتا ہے!",
      },
    },
  ],
};

export default function AddressesTutorialPage() {
  const router = useRouter();

  return (
    <TutorialPageWrapper
      title="Address Management"
      description="Set up your pickup address so customers and drivers know where to find you. All data here is fake, nothing is saved."
      icon={LocationFilledIcon}
      storageKey={STORAGE_KEY}
      breadcrumbs={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Tutorials", onClick: () => router.push("/dashboard/tutorials") },
        { label: "Address Management" },
      ]}
      steps={STEPS}
    >
      <div className="max-w-2xl mx-auto space-y-[var(--p-space-600)]">
        {/* Search */}
        <section id="tutorial-address-search" className="space-y-[var(--p-space-400)]">
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            Pickup Address
          </h2>
          <div>
            <Label>Search Address</Label>
            <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] flex items-center gap-[var(--p-space-200)]">
              <SearchIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
              <span className="text-[var(--p-color-text)]">742 Evergreen Terrace, Springfield, IL</span>
            </div>
            <HelpText>Start typing to search with Google autocomplete</HelpText>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Additional details */}
        <section id="tutorial-address-details" className="space-y-[var(--p-space-400)]">
          <div>
            <Label>Apartment / Suite</Label>
            <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
              Unit 2B
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label>Pickup Instructions</Label>
              <span className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                42 / 350
              </span>
            </div>
            <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)] min-h-[80px]">
              Ring the doorbell twice. Use the side entrance if no answer. Food will be on the table by the door.
            </div>
            <HelpText>Instructions for drivers and customers picking up orders</HelpText>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Address preview */}
        <section id="tutorial-address-preview" className="space-y-[var(--p-space-400)]">
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
            Address Preview
          </h2>
          <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border)] bg-[var(--p-color-bg-surface)] p-[var(--p-space-400)]">
            <div className="flex items-start gap-[var(--p-space-300)]">
              <LocationFilledIcon className="size-5 fill-[var(--p-color-icon-brand)] shrink-0 mt-0.5" />
              <div className="space-y-[var(--p-space-050)] text-[0.8125rem]">
                <p className="font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                  742 Evergreen Terrace
                </p>
                <p className="text-[var(--p-color-text-secondary)]">Unit 2B</p>
                <p className="text-[var(--p-color-text-secondary)]">Springfield, IL 62704</p>
                <p className="text-[var(--p-color-text-secondary)]">United States</p>
              </div>
            </div>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Primary checkbox */}
        <section id="tutorial-address-primary">
          <div className="flex items-start gap-[var(--p-space-300)]">
            <span className="mt-0.5 size-4 rounded-[3px] border-2 border-[var(--p-color-border-brand)] bg-[var(--p-color-bg-fill-brand)] flex items-center justify-center">
              <span className="text-white text-[0.5rem] font-bold">{"\u2713"}</span>
            </span>
            <div>
              <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">
                Set as primary pickup address
              </p>
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                This address will be used for order pickups
              </p>
            </div>
          </div>
        </section>
      </div>
    </TutorialPageWrapper>
  );
}
