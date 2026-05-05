"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { driver, type DriveStep } from "driver.js";
import "driver.js/dist/driver.css";
import {
  OrderHeader,
  OrderItemsList,
  OrderNote,
  OrderSummary,
  OrderActivityTimeline,
  OrderCustomerDetails,
  ChefOrderActions,
  PrintLabelButton,
  ShippingLabelButton,
  type ChefOrderAction,
} from "@/components/features/orders";
import {
  AlertCircleIcon,
  ArrowLeftIcon,
  PlayIcon,
  ResetIcon,
  CheckCircleIcon,
  ClockIcon,
  GlobeIcon,
} from "@shopify/polaris-icons";
import {
  Breadcrumb,
  Button,
  Card,
  Banner,
  OrderStatusBadge,
  OrderFulfillmentBadge,
} from "@/components/polaris";
import {
  FAKE_TUTORIAL_ORDER,
  TUTORIAL_STORAGE_KEY,
} from "@/lib/tutorial/fake-order-data";
import {
  TUTORIAL_LANGUAGES,
  getSavedLanguage,
  saveLanguage,
  isRtl,
  type TutorialLanguage,
} from "@/lib/tutorial/tutorial-i18n";
import type { Order, OrderStatus } from "@/types/orders.types";

/** Simulated order status progression for the tutorial */
const STATUS_FLOW: OrderStatus[] = [
  "confirmed",
  "preparing",
  "ready",
  "delivered",
];

/* ------------------------------------------------------------------ */
/*  Language Selector (same as TutorialPageWrapper)                    */
/* ------------------------------------------------------------------ */

function LanguageSelector({
  value,
  onChange,
}: {
  value: TutorialLanguage;
  onChange: (lang: TutorialLanguage) => void;
}) {
  return (
    <div className="flex items-center gap-[var(--p-space-200)]">
      <GlobeIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
      <div className="flex rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] overflow-hidden">
        {TUTORIAL_LANGUAGES.map((lang) => (
          <button
            key={lang.code}
            type="button"
            onClick={() => onChange(lang.code)}
            className={`px-[var(--p-space-300)] py-[var(--p-space-100)] text-[0.75rem] font-[var(--p-font-weight-semibold)] transition-colors ${
              value === lang.code
                ? "bg-[var(--p-color-bg-fill-brand)] text-white"
                : "bg-[var(--p-color-bg-surface)] text-[var(--p-color-text-secondary)] hover:bg-[var(--p-color-bg-fill-secondary)]"
            }`}
          >
            {lang.nativeLabel}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Initial tour steps per language (14 steps)                        */
/* ------------------------------------------------------------------ */

const INITIAL_STEPS: Record<TutorialLanguage, DriveStep[]> = {
  en: [
    { popover: { title: "Welcome to the Order Tutorial!", description: "This guided walkthrough will teach you how to manage orders in your Chef Portal. All data here is fake \u2014 no real orders are created. Let\u2019s get started!" } },
    { element: "#tutorial-banner", popover: { title: "Test Order Banner", description: "This banner reminds you that this is a simulated test order. You\u2019ll never see this on real orders." } },
    { element: "#tutorial-order-header", popover: { title: "Order Header", description: "Here you can see the order number, the fulfillment method badge, and the current status. The fulfillment method tells you how the customer will receive their order." } },
    { element: "#tutorial-order-header", popover: { title: "Fulfillment Methods", description: "Orders can be fulfilled in four ways:\n\n\u2022 Delivery \u2014 a driver picks up and delivers the food\n\u2022 Shipping \u2014 you ship the order via a carrier\n\u2022 Chef Pickup \u2014 the customer picks up from your kitchen\n\u2022 Yalla Spot \u2014 the customer picks up from a designated Yalla Spot location\n\nEach method affects what actions and dates you see on the order." } },
    { element: '[data-testid="order-header"]', popover: { title: "Order Dates", description: "This section shows when the order was placed and when it needs to be ready. For delivery orders, pay close attention to the \u201cHave it Ready By\u201d time." } },
    { element: '[data-testid="order-items-list"]', popover: { title: "Ordered Items", description: "Review all the items the customer ordered. Check quantities, portion sizes, spice levels, and any modifier requests (extras, removals). This is what you need to prepare!" } },
    { element: '[data-testid="order-note"]', popover: { title: "Special Instructions", description: "Customers can leave special notes for their order. Always read these carefully \u2014 they may include allergy info or specific packing requests." } },
    { element: '[data-testid="order-customer-details"]', popover: { title: "Customer Details", description: "View the customer\u2019s name and contact information. This is useful if you need to reach out about the order." } },
    { element: '[data-testid="order-activity-timeline"]', popover: { title: "Order Activity Timeline", description: "This timeline shows every status change the order has gone through, who made the change, and when. It\u2019s a complete history of the order." } },
    { element: '[data-testid="order-summary"]', popover: { title: "Order Summary", description: "The financial breakdown of the order. \u201cSubtotal\u201d is what the customer paid, and \u201cYour Payout\u201d is the amount you\u2019ll receive." } },
    { element: "#tutorial-print-label", popover: { title: "Print Order Label", description: "Use this button to print a label for the order. The label includes the customer name, order items, ingredients, and allergens \u2014 great for packing!" } },
    { element: "#tutorial-chef-actions", popover: { title: "Order Actions", description: "These are the actions you can take on the order. As you progress through statuses (Confirmed \u2192 Preparing \u2192 Ready \u2192 Delivered), different actions become available. Try clicking \u201cStart Preparing\u201d after this tour ends!" } },
    { popover: { title: "Pickup ETA Banner", description: "When the order reaches \u201cReady\u201d status, a dark banner will appear at the top showing the Pickup ETA \u2014 the time a driver or customer is expected to pick up the food. It includes a live countdown timer so you always know how much time is left." } },
    { popover: { title: "You\u2019re All Set!", description: "Now try progressing through the order yourself! Click the action button to move the order through each stage. When you reach \u201cReady\u201d you\u2019ll see the ETA banner appear. You can restart this tutorial anytime with the \u201cRestart Tutorial\u201d button." } },
  ],
  ar: [
    { popover: { title: "مرحب\u0627\u064b بك في شرح الطلبات!", description: "سيعلمك هذا الشرح التفاعلي كيفية إدارة الطلبات في بوابة الشيف. جميع البيانات هنا وهمية \u2014 لا يتم إنشاء طلبات حقيقية. هيا نبدأ!" } },
    { element: "#tutorial-banner", popover: { title: "بانر الطلب التجريبي", description: "هذا البانر يذكرك أن هذا طلب تجريبي محاكى. لن تراه أبد\u0627\u064b في الطلبات الحقيقية." } },
    { element: "#tutorial-order-header", popover: { title: "رأس الطلب", description: "هنا يمكنك رؤية رقم الطلب وشارة طريقة التنفيذ والحالة الحالية. طريقة التنفيذ تخبرك كيف سيستلم العميل طلبه." } },
    { element: "#tutorial-order-header", popover: { title: "طرق التنفيذ", description: "يمكن تنفيذ الطلبات بأربع طرق:\n\n\u2022 توصيل \u2014 سائق يستلم ويوصل الطعام\n\u2022 شحن \u2014 تشحن الطلب عبر شركة شحن\n\u2022 استلام من الشيف \u2014 العميل يستلم من مطبخك\n\u2022 يلا سبوت \u2014 العميل يستلم من موقع يلا سبوت محدد\n\nكل طريقة تؤثر على الإجراءات والتواريخ التي تراها." } },
    { element: '[data-testid="order-header"]', popover: { title: "تواريخ الطلب", description: "هذا القسم يعرض متى تم تقديم الطلب ومتى يجب أن يكون جاهز\u0627\u064b. لطلبات التوصيل، انتبه جيد\u0627\u064b لوقت \u201cجهزه بحلول\u201d." } },
    { element: '[data-testid="order-items-list"]', popover: { title: "العناصر المطلوبة", description: "راجع جميع العناصر التي طلبها العميل. تحقق من الكميات وأحجام الحصص ومستويات التوابل وأي طلبات تعديل (إضافات، إزالات). هذا ما تحتاج لتحضيره!" } },
    { element: '[data-testid="order-note"]', popover: { title: "تعليمات خاصة", description: "يمكن للعملاء ترك ملاحظات خاصة لطلبهم. اقرأها دائم\u0627\u064b بعناية \u2014 قد تتضمن معلومات عن الحساسية أو طلبات تغليف محددة." } },
    { element: '[data-testid="order-customer-details"]', popover: { title: "تفاصيل العميل", description: "اعرض اسم العميل ومعلومات الاتصال. هذا مفيد إذا احتجت للتواصل بخصوص الطلب." } },
    { element: '[data-testid="order-activity-timeline"]', popover: { title: "سجل نشاط الطلب", description: "يعرض هذا السجل كل تغيير حالة مر به الطلب، ومن قام بالتغيير، ومتى. إنه سجل كامل للطلب." } },
    { element: '[data-testid="order-summary"]', popover: { title: "ملخص الطلب", description: "التفصيل المالي للطلب. \u201cالمجموع الفرعي\u201d هو ما دفعه العميل، و\u201cمستحقاتك\u201d هو المبلغ الذي ستتلقاه." } },
    { element: "#tutorial-print-label", popover: { title: "طباعة ملصق الطلب", description: "استخدم هذا الزر لطباعة ملصق للطلب. يتضمن الملصق اسم العميل وعناصر الطلب والمكونات ومسببات الحساسية \u2014 ممتاز للتغليف!" } },
    { element: "#tutorial-chef-actions", popover: { title: "إجراءات الطلب", description: "هذه هي الإجراءات التي يمكنك اتخاذها. كلما تقدمت في الحالات (مؤكد \u2192 قيد التحضير \u2192 جاهز \u2192 تم التسليم)، تتوفر إجراءات مختلفة. جرب النقر على \u201cابدأ التحضير\u201d بعد انتهاء هذه الجولة!" } },
    { popover: { title: "بانر وقت الاستلام المتوقع", description: "عندما يصل الطلب إلى حالة \u201cجاهز\u201d، سيظهر بانر في الأعلى يعرض وقت الاستلام المتوقع \u2014 الوقت المتوقع لوصول السائق أو العميل لاستلام الطعام. يتضمن عد\u0627\u064b تنازلي\u0627\u064b مباشر\u0627\u064b." } },
    { popover: { title: "أنت جاهز!", description: "الآن جرب التقدم خلال الطلب بنفسك! انقر على زر الإجراء لنقل الطلب عبر كل مرحلة. عندما تصل إلى \u201cجاهز\u201d سترى بانر الوقت المتوقع يظهر. يمكنك إعادة هذا الشرح في أي وقت بزر \u201cإعادة الشرح\u201d." } },
  ],
  ur: [
    { popover: { title: "آرڈر ٹیوٹوریل میں خوش آمدید!", description: "یہ تفاعلی شرح آپ کو شیف پورٹل میں آرڈرز منظم کرنا سکھائے گی۔ یہاں کا تمام ڈیٹا فرضی ہے \u2014 کوئی حقیقی آرڈر نہیں بنایا جاتا۔ شروع کرتے ہیں!" } },
    { element: "#tutorial-banner", popover: { title: "ٹیسٹ آرڈر بینر", description: "یہ بینر آپ کو یاد دلاتا ہے کہ یہ ایک فرضی ٹیسٹ آرڈر ہے۔ آپ اسے حقیقی آرڈرز میں کبھی نہیں دیکھیں گے۔" } },
    { element: "#tutorial-order-header", popover: { title: "آرڈر ہیڈر", description: "یہاں آپ آرڈر نمبر، ترسیل کا طریقہ بیج، اور موجودہ حالت دیکھ سکتے ہیں۔ ترسیل کا طریقہ بتاتا ہے کہ گاہک اپنا آرڈر کیسے وصول کرے گا۔" } },
    { element: "#tutorial-order-header", popover: { title: "ترسیل کے طریقے", description: "آرڈرز چار طریقوں سے پورے کیے جا سکتے ہیں:\n\n\u2022 ڈیلیوری \u2014 ڈرائیور کھانا اٹھاتا اور پہنچاتا ہے\n\u2022 شپنگ \u2014 آپ کیریئر کے ذریعے آرڈر بھیجتے ہیں\n\u2022 شیف پک اپ \u2014 گاہک آپ کے کچن سے اٹھاتا ہے\n\u2022 یلا سپاٹ \u2014 گاہک مقررہ یلا سپاٹ مقام سے اٹھاتا ہے\n\nہر طریقہ آرڈر پر نظر آنے والے اقدامات اور تاریخوں کو متاثر کرتا ہے۔" } },
    { element: '[data-testid="order-header"]', popover: { title: "آرڈر کی تاریخیں", description: "یہ سیکشن دکھاتا ہے کہ آرڈر کب دیا گیا اور کب تک تیار ہونا چاہیے۔ ڈیلیوری آرڈرز کے لیے، \u201cاس وقت تک تیار کریں\u201d پر خاص توجہ دیں۔" } },
    { element: '[data-testid="order-items-list"]', popover: { title: "آرڈر کی اشیاء", description: "گاہک نے جو بھی آرڈر کیا اس کا جائزہ لیں۔ مقداریں، حصوں کے سائز، مسالے کی سطح، اور ترمیمی درخواستیں (اضافی، ہٹانا) چیک کریں۔ یہی آپ نے تیار کرنا ہے!" } },
    { element: '[data-testid="order-note"]', popover: { title: "خصوصی ہدایات", description: "گاہک اپنے آرڈر کے لیے خاص نوٹس چھوڑ سکتے ہیں۔ انہیں ہمیشہ غور سے پڑھیں \u2014 ان میں الرجی کی معلومات یا مخصوص پیکنگ کی درخواستیں ہو سکتی ہیں۔" } },
    { element: '[data-testid="order-customer-details"]', popover: { title: "گاہک کی تفصیلات", description: "گاہک کا نام اور رابطے کی معلومات دیکھیں۔ یہ مفید ہے اگر آپ کو آرڈر کے بارے میں رابطہ کرنا ہو۔" } },
    { element: '[data-testid="order-activity-timeline"]', popover: { title: "آرڈر سرگرمی ٹائم لائن", description: "یہ ٹائم لائن آرڈر میں ہونے والی ہر حالت کی تبدیلی، کس نے تبدیل کیا، اور کب کیا دکھاتی ہے۔ یہ آرڈر کی مکمل تاریخ ہے۔" } },
    { element: '[data-testid="order-summary"]', popover: { title: "آرڈر کا خلاصہ", description: "آرڈر کی مالی تفصیل۔ \u201cذیلی کل\u201d وہ ہے جو گاہک نے ادا کیا، اور \u201cآپ کی ادائیگی\u201d وہ رقم ہے جو آپ کو ملے گی۔" } },
    { element: "#tutorial-print-label", popover: { title: "آرڈر لیبل پرنٹ کریں", description: "آرڈر کا لیبل پرنٹ کرنے کے لیے یہ بٹن استعمال کریں۔ لیبل میں گاہک کا نام، آرڈر کی اشیاء، اجزاء، اور الرجی شامل ہیں \u2014 پیکنگ کے لیے بہترین!" } },
    { element: "#tutorial-chef-actions", popover: { title: "آرڈر کے اقدامات", description: "یہ وہ اقدامات ہیں جو آپ آرڈر پر لے سکتے ہیں۔ جیسے جیسے آپ حالتوں میں آگے بڑھتے ہیں (تصدیق شدہ \u2192 تیاری میں \u2192 تیار \u2192 ڈیلیور)، مختلف اقدامات دستیاب ہوتے ہیں۔ اس ٹور کے بعد \u201cتیاری شروع کریں\u201d پر کلک کریں!" } },
    { popover: { title: "پک اپ وقت کا بینر", description: "جب آرڈر \u201cتیار\u201d حالت پر پہنچتا ہے تو اوپر ایک بینر ظاہر ہوگا جو پک اپ کا متوقع وقت دکھاتا ہے \u2014 ڈرائیور یا گاہک کے کھانا اٹھانے کا متوقع وقت۔ اس میں براہ راست الٹی گنتی ٹائمر شامل ہے۔" } },
    { popover: { title: "آپ تیار ہیں!", description: "اب خود آرڈر میں آگے بڑھنے کی کوشش کریں! آرڈر کو ہر مرحلے سے گزارنے کے لیے ایکشن بٹن پر کلک کریں۔ جب آپ \u201cتیار\u201d پر پہنچیں گے تو وقت کا بینر نظر آئے گا۔ آپ \u201cدوبارہ شروع\u201d بٹن سے کسی بھی وقت یہ ٹیوٹوریل دوبارہ چلا سکتے ہیں۔" } },
  ],
};

/* ------------------------------------------------------------------ */
/*  Transition highlight steps per language                           */
/* ------------------------------------------------------------------ */

function getTransitionSteps(
  nextStatus: OrderStatus,
  lang: TutorialLanguage
): DriveStep[] {
  if (nextStatus === "preparing") {
    return {
      en: [
        { element: "#tutorial-order-header", popover: { title: "Status Changed: Preparing", description: "Great! You\u2019ve confirmed the order and started preparing. Notice the status badge changed to \u201cPreparing\u201d. The customer has been notified that you\u2019re working on their food." } },
        { element: '[data-testid="order-activity-timeline"]', popover: { title: "Timeline Updated", description: "The activity timeline now shows a new entry for the status change. Every action you take is logged here." } },
        { element: "#tutorial-chef-actions", popover: { title: "Next Action: Mark as Ready", description: "Once you\u2019ve finished cooking and packing the order, click \u201cMark as Ready\u201d to let the system know it\u2019s ready for pickup or delivery." } },
      ],
      ar: [
        { element: "#tutorial-order-header", popover: { title: "تغيرت الحالة: قيد التحضير", description: "رائع! لقد أكدت الطلب وبدأت التحضير. لاحظ أن شارة الحالة تغيرت إلى \u201cقيد التحضير\u201d. تم إخطار العميل أنك تعمل على طعامه." } },
        { element: '[data-testid="order-activity-timeline"]', popover: { title: "تم تحديث السجل", description: "يعرض سجل النشاط الآن إدخال\u0627\u064b جديد\u0627\u064b لتغيير الحالة. كل إجراء تقوم به يتم تسجيله هنا." } },
        { element: "#tutorial-chef-actions", popover: { title: "الإجراء التالي: وضع علامة جاهز", description: "بمجرد الانتهاء من الطبخ والتغليف، انقر على \u201cوضع علامة جاهز\u201d لإعلام النظام أنه جاهز للاستلام أو التوصيل." } },
      ],
      ur: [
        { element: "#tutorial-order-header", popover: { title: "حالت تبدیل: تیاری میں", description: "بہت اچھا! آپ نے آرڈر کی تصدیق کر دی اور تیاری شروع کر دی۔ دیکھیں حالت بیج \u201cتیاری میں\u201d میں بدل گیا۔ گاہک کو مطلع کر دیا گیا ہے کہ آپ ان کا کھانا بنا رہے ہیں۔" } },
        { element: '[data-testid="order-activity-timeline"]', popover: { title: "ٹائم لائن اپ ڈیٹ", description: "سرگرمی ٹائم لائن اب حالت کی تبدیلی کے لیے نیا اندراج دکھاتی ہے۔ آپ کا ہر اقدام یہاں ریکارڈ ہوتا ہے۔" } },
        { element: "#tutorial-chef-actions", popover: { title: "اگلا اقدام: تیار نشان زد کریں", description: "کھانا پکانے اور پیک کرنے کے بعد، \u201cتیار نشان زد کریں\u201d پر کلک کریں تاکہ سسٹم کو معلوم ہو کہ یہ پک اپ یا ڈیلیوری کے لیے تیار ہے۔" } },
      ],
    }[lang];
  }

  if (nextStatus === "ready") {
    return {
      en: [
        { element: "#tutorial-order-header", popover: { title: "Status Changed: Ready", description: "The order is now marked as \u201cReady\u201d. For delivery orders, this signals the system to dispatch a driver. For pickup orders, the customer gets notified." } },
        { element: "#tutorial-eta-banner", popover: { title: "Pickup ETA Banner", description: "This banner appears when the order is ready. It shows the estimated time a driver (or customer) will arrive to pick up the food, with a live countdown timer. Keep an eye on this!" } },
        { element: "#tutorial-print-label", popover: { title: "Print the Label Now", description: "This is a great time to print the order label. It includes the customer name, all items with ingredients, and allergen info. Attach it to the packed order." } },
        { element: "#tutorial-chef-actions", popover: { title: "Next Action: Complete Order", description: "When the driver or customer arrives and picks up the food, click \u201cComplete Order\u201d to mark it as delivered." } },
      ],
      ar: [
        { element: "#tutorial-order-header", popover: { title: "تغيرت الحالة: جاهز", description: "الطلب الآن مُعلّم كـ\u201cجاهز\u201d. لطلبات التوصيل، هذا يُشير للنظام لإرسال سائق. لطلبات الاستلام، يتم إخطار العميل." } },
        { element: "#tutorial-eta-banner", popover: { title: "بانر وقت الاستلام المتوقع", description: "يظهر هذا البانر عندما يكون الطلب جاهز\u0627\u064b. يعرض الوقت المتوقع لوصول السائق (أو العميل) لاستلام الطعام، مع عدّ تنازلي مباشر. راقب هذا!" } },
        { element: "#tutorial-print-label", popover: { title: "اطبع الملصق الآن", description: "هذا وقت ممتاز لطباعة ملصق الطلب. يتضمن اسم العميل وجميع العناصر مع المكونات ومعلومات الحساسية. ألصقه على الطلب المُغلّف." } },
        { element: "#tutorial-chef-actions", popover: { title: "الإجراء التالي: إكمال الطلب", description: "عندما يصل السائق أو العميل ويستلم الطعام، انقر على \u201cإكمال الطلب\u201d لوضع علامة تم التسليم." } },
      ],
      ur: [
        { element: "#tutorial-order-header", popover: { title: "حالت تبدیل: تیار", description: "آرڈر اب \u201cتیار\u201d نشان زد ہو گیا ہے۔ ڈیلیوری آرڈرز کے لیے، یہ سسٹم کو ڈرائیور بھیجنے کا اشارہ دیتا ہے۔ پک اپ آرڈرز کے لیے، گاہک کو مطلع کیا جاتا ہے۔" } },
        { element: "#tutorial-eta-banner", popover: { title: "پک اپ وقت کا بینر", description: "یہ بینر آرڈر تیار ہونے پر ظاہر ہوتا ہے۔ یہ ڈرائیور (یا گاہک) کے کھانا اٹھانے کا متوقع وقت دکھاتا ہے، براہ راست الٹی گنتی ٹائمر کے ساتھ۔ اس پر نظر رکھیں!" } },
        { element: "#tutorial-print-label", popover: { title: "ابھی لیبل پرنٹ کریں", description: "آرڈر لیبل پرنٹ کرنے کا بہترین وقت ہے۔ اس میں گاہک کا نام، تمام اشیاء اجزاء کے ساتھ، اور الرجی کی معلومات شامل ہیں۔ پیک شدہ آرڈر پر لگائیں۔" } },
        { element: "#tutorial-chef-actions", popover: { title: "اگلا اقدام: آرڈر مکمل کریں", description: "جب ڈرائیور یا گاہک آئے اور کھانا اٹھائے، \u201cآرڈر مکمل کریں\u201d پر کلک کریں تاکہ اسے ڈیلیور شدہ نشان زد کیا جائے۔" } },
      ],
    }[lang];
  }

  if (nextStatus === "delivered") {
    return {
      en: [{ popover: { title: "Order Complete!", description: "You\u2019ve successfully walked through the entire order lifecycle: Confirmed \u2192 Preparing \u2192 Ready \u2192 Delivered.\n\nIn real orders, you\u2019ll also be able to cancel, reject, or propose rescheduling at various stages. You can restart this tutorial anytime to practice again." } }],
      ar: [{ popover: { title: "تم إكمال الطلب!", description: "لقد مررت بنجاح بدورة حياة الطلب الكاملة: مؤكد \u2192 قيد التحضير \u2192 جاهز \u2192 تم التسليم.\n\nفي الطلبات الحقيقية، ستتمكن أيض\u0627\u064b من الإلغاء أو الرفض أو اقتراح إعادة الجدولة في مراحل مختلفة. يمكنك إعادة هذا الشرح في أي وقت للتدريب مجدد\u0627\u064b." } }],
      ur: [{ popover: { title: "آرڈر مکمل!", description: "آپ نے کامیابی سے آرڈر کی مکمل زندگی سے گزر لیا: تصدیق شدہ \u2192 تیاری میں \u2192 تیار \u2192 ڈیلیور شدہ۔\n\nحقیقی آرڈرز میں، آپ مختلف مراحل پر منسوخ، مسترد، یا دوبارہ شیڈول تجویز بھی کر سکیں گے۔ آپ دوبارہ مشق کے لیے کسی بھی وقت یہ ٹیوٹوریل دوبارہ شروع کر سکتے ہیں۔" } }],
    }[lang];
  }

  return [];
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                    */
/* ------------------------------------------------------------------ */

export default function OrderTutorialPage() {
  const router = useRouter();
  const [lang, setLang] = useState<TutorialLanguage>(getSavedLanguage);
  const [tutorialStarted, setTutorialStarted] = useState(false);
  const [tutorialCompleted, setTutorialCompleted] = useState(() => {
    try {
      return localStorage.getItem(TUTORIAL_STORAGE_KEY) === "true";
    } catch {
      return false;
    }
  });
  const [currentStatusIndex, setCurrentStatusIndex] = useState(0);
  const driverRef = useRef<ReturnType<typeof driver> | null>(null);

  const handleLanguageChange = useCallback(
    (newLang: TutorialLanguage) => {
      setLang(newLang);
      saveLanguage(newLang);
      if (driverRef.current) {
        driverRef.current.destroy();
        driverRef.current = null;
      }
    },
    []
  );

  // Build the simulated order with current status
  const currentStatus = STATUS_FLOW[currentStatusIndex];
  const simulatedOrder: Order = {
    ...FAKE_TUTORIAL_ORDER,
    status: currentStatus,
    statusHistory: buildStatusHistory(currentStatusIndex),
  };

  const markCompleted = useCallback(() => {
    setTutorialCompleted(true);
    try {
      localStorage.setItem(TUTORIAL_STORAGE_KEY, "true");
    } catch {
      // localStorage unavailable — ignore
    }
  }, []);

  const launchDriver = useCallback(
    (steps: DriveStep[], driverLang: TutorialLanguage, doneBtnText = "Start Exploring!") => {
      const rtlClass = isRtl(driverLang) ? " tutorial-popover-rtl" : "";
      const driverInstance = driver({
        showProgress: steps.length > 1,
        animate: true,
        allowClose: true,
        overlayColor: "black",
        overlayOpacity: 0.6,
        stagePadding: 8,
        stageRadius: 12,
        popoverClass: `tutorial-popover${rtlClass}`,
        nextBtnText: "Next \u2192",
        prevBtnText: "\u2190 Back",
        doneBtnText,
        progressText: "Step {{current}} of {{total}}",
        steps,
        onDestroyed: () => {
          driverRef.current = null;
        },
      });
      driverRef.current = driverInstance;
      driverInstance.drive();
    },
    []
  );

  const startTutorial = useCallback(() => {
    setTutorialStarted(true);
    setTutorialCompleted(false);
    setCurrentStatusIndex(0);
    setTimeout(() => {
      launchDriver(INITIAL_STEPS[lang], lang, "Start Exploring!");
    }, 300);
  }, [lang, launchDriver]);

  const restartTutorial = useCallback(() => {
    if (driverRef.current) {
      driverRef.current.destroy();
      driverRef.current = null;
    }
    setCurrentStatusIndex(0);
    setTutorialCompleted(false);
    try {
      localStorage.removeItem(TUTORIAL_STORAGE_KEY);
    } catch {
      // ignore
    }
    setTimeout(() => {
      launchDriver(INITIAL_STEPS[lang], lang, "Start Exploring!");
    }, 100);
  }, [lang, launchDriver]);

  const showTransitionHighlight = useCallback(
    (nextIndex: number) => {
      setTimeout(() => {
        if (driverRef.current) {
          driverRef.current.destroy();
          driverRef.current = null;
        }
        const nextStatus = STATUS_FLOW[nextIndex];
        const steps = getTransitionSteps(nextStatus, lang);
        if (steps.length > 0) {
          launchDriver(steps, lang, "Got it!");
        }
      }, 400);
    },
    [lang, launchDriver]
  );

  const advanceStatus = useCallback(() => {
    const nextIndex = currentStatusIndex + 1;
    if (nextIndex < STATUS_FLOW.length) {
      setCurrentStatusIndex(nextIndex);
      if (nextIndex === STATUS_FLOW.length - 1) {
        markCompleted();
      }
      showTransitionHighlight(nextIndex);
    }
  }, [currentStatusIndex, markCompleted, showTransitionHighlight]);

  // Landing state — tutorial not yet started
  if (!tutorialStarted) {
    return (
      <div className="space-y-[var(--p-space-500)]">
        <Breadcrumb items={[
          { label: "Dashboard", onClick: () => router.push("/dashboard") },
          { label: "Tutorials", onClick: () => router.push("/dashboard/tutorials") },
          { label: "Order Tutorial" },
        ]} />

        <Card>
          <div className="flex flex-col items-center justify-center py-[var(--p-space-800)] px-[var(--p-space-400)]">
            <div className="max-w-lg text-center space-y-[var(--p-space-500)]">
              {/* Language selector */}
              <div className="flex justify-center">
                <LanguageSelector value={lang} onChange={handleLanguageChange} />
              </div>

              <div className="mx-auto size-20 rounded-[var(--p-border-radius-400)] bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center">
                <PlayIcon className="size-10 fill-[var(--p-color-icon)]" />
              </div>
              <div>
                <h1 className="text-[1.875rem] leading-[2.25rem] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)] text-[var(--p-color-text)]">
                  Order Tutorial
                </h1>
                <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">
                  Learn how to manage orders step by step with an interactive
                  guided walkthrough. No real orders are created — everything here
                  is simulated.
                </p>
              </div>
              {tutorialCompleted && (
                <Banner tone="success">
                  <p className="flex items-center gap-[var(--p-space-200)]">
                    <CheckCircleIcon className="size-4 fill-current shrink-0" />
                    You&apos;ve completed this tutorial before. Feel free to run it again!
                  </p>
                </Banner>
              )}
              <Button
                size="lg"
                onClick={startTutorial}
                className="px-[var(--p-space-800)]"
              >
                <PlayIcon className="size-5 fill-current" />
                Start Tutorial
              </Button>
            </div>
          </div>
        </Card>
      </div>
    );
  }

  // Active tutorial — simulated order detail page
  return (
    <div>
      {/* Tutorial controls bar */}
      <div className="flex items-center justify-between gap-[var(--p-space-400)] px-[var(--p-space-500)] py-[var(--p-space-300)] bg-[var(--p-color-bg-surface)] border-b border-[var(--p-color-border-secondary)] sm:rounded-t-[var(--p-border-radius-400)]">
        <Button
          variant="tertiary"
          size="sm"
          onClick={() => {
            if (driverRef.current) {
              driverRef.current.destroy();
              driverRef.current = null;
            }
            setTutorialStarted(false);
          }}
        >
          <ArrowLeftIcon className="size-4 fill-current" />
          Exit Tutorial
        </Button>
        <div className="flex items-center gap-[var(--p-space-300)]">
          <LanguageSelector value={lang} onChange={handleLanguageChange} />
          <Button variant="secondary" size="sm" onClick={restartTutorial}>
            <ResetIcon className="size-3.5 fill-current" />
            Restart Tutorial
          </Button>
        </div>
      </div>

      {/* Content card — matches real order detail page */}
      <Card className="!rounded-t-none space-y-[var(--p-space-500)]">

        {/* Test order banner */}
        <div
          id="tutorial-banner"
          className="bg-[rgba(255,230,0,1)] rounded-[var(--p-border-radius-200)] p-[var(--p-space-400)] flex items-start gap-[var(--p-space-300)]"
        >
          <AlertCircleIcon className="size-5 fill-[rgba(51,46,0,1)] shrink-0 mt-0.5" />
          <div>
            <p className="text-[0.8125rem] font-[var(--p-font-weight-bold)] text-[rgba(51,46,0,1)]">
              This is a Test Order — Tutorial Mode
            </p>
            <p className="text-[0.8125rem] text-[rgba(51,46,0,0.8)] mt-[var(--p-space-050)]">
              All data below is fake. No real orders or charges are created. Use
              the action buttons to practice progressing through order statuses.
            </p>
          </div>
        </div>

        {/* Header */}
        <header
          id="tutorial-order-header"
          className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-[var(--p-space-300)]"
        >
          <div>
            <div className="flex items-center gap-[var(--p-space-300)] flex-wrap">
              <h1 className="text-[1.25rem] leading-[1.75rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)] font-[var(--p-font-family-mono)]">
                Order #{simulatedOrder.orderNumber}
              </h1>
              <OrderFulfillmentBadge method={simulatedOrder.fulfillmentMethod} />
              <OrderStatusBadge status={currentStatus} />
            </div>
          </div>
          <div className="flex items-center gap-[var(--p-space-200)]">
            <ShippingLabelButton order={simulatedOrder} />
            <span id="tutorial-print-label">
              <PrintLabelButton order={simulatedOrder} variant="default" size="default" />
            </span>
            {["confirmed", "preparing", "ready"].includes(currentStatus) && (
              <Button variant="destructive" disabled>
                Cancel
              </Button>
            )}
          </div>
        </header>

        {/* ETA Banner — visible when order is "ready" */}
        {currentStatus === "ready" && simulatedOrder.advertisedPickupEta && (
          <div
            id="tutorial-eta-banner"
            className="flex flex-col sm:flex-row sm:items-center justify-between gap-[var(--p-space-200)] bg-[rgba(255,230,0,1)] rounded-[var(--p-border-radius-200)] px-[var(--p-space-400)] py-[var(--p-space-300)]"
          >
            <div className="flex items-center gap-[var(--p-space-200)]">
              <ClockIcon className="size-5 fill-[rgba(51,46,0,1)] shrink-0" />
              <p className="text-[0.875rem] font-[var(--p-font-weight-semibold)] text-[rgba(51,46,0,1)]">
                Pickup ETA:{" "}
                <span className="font-[var(--p-font-weight-bold)]">
                  {new Date(simulatedOrder.advertisedPickupEta).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true,
                  })}
                </span>
              </p>
            </div>
            <span className="font-[var(--p-font-family-mono)] font-[var(--p-font-weight-bold)] text-[rgba(51,46,0,1)] text-[0.8125rem] bg-[rgba(51,46,0,0.08)] px-[var(--p-space-200)] py-[var(--p-space-050)] rounded-[var(--p-border-radius-200)]">
              90m : 00s
            </span>
          </div>
        )}

        {/* Completion banner */}
        {currentStatus === "delivered" && (
          <Banner tone="success" title="Order Delivered — Tutorial Complete!">
            <p>You&apos;ve successfully walked through the full order lifecycle. Great job!</p>
          </Banner>
        )}

        {/* Two-column layout — identical to real order detail page */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-[var(--p-space-500)]">
          {/* Left */}
          <div className="lg:col-span-7 space-y-[var(--p-space-500)]">
            <OrderHeader order={simulatedOrder} />
            <OrderItemsList items={simulatedOrder.items} />
            <OrderNote note={simulatedOrder.specialInstructions || ""} />
            <OrderCustomerDetails order={simulatedOrder} />
          </div>

          {/* Right */}
          <div className="lg:col-span-5 space-y-[var(--p-space-500)]">
            <OrderActivityTimeline order={simulatedOrder} />
            <OrderSummary order={simulatedOrder} />

            {/* Chef actions — uses the real component */}
            <div id="tutorial-chef-actions">
              <ChefOrderActions
                currentStatus={currentStatus}
                onActionClick={(action: ChefOrderAction) => {
                  if (action.action === "accept" || action.action === "start_preparing" || action.action === "mark_ready" || action.action === "complete") {
                    advanceStatus();
                  }
                }}
                isLoading={false}
                loadingAction={null}
                order={simulatedOrder}
              />
            </div>
          </div>
        </div>

      </Card>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Helpers                                                           */
/* ------------------------------------------------------------------ */

function buildStatusHistory(
  currentIndex: number
): Order["statusHistory"] {
  const entries: NonNullable<Order["statusHistory"]> = [];
  const now = Date.now();

  for (let i = 0; i <= currentIndex; i++) {
    entries.push({
      status: STATUS_FLOW[i],
      previousStatus: i > 0 ? STATUS_FLOW[i - 1] : "paid",
      changedAt: new Date(
        now - (currentIndex - i) * 5 * 60 * 1000
      ).toISOString(),
      reason: null,
      changedBy: {
        email: i === 0 ? "system@yallabites.com" : "chef@example.com",
        id: i === 0 ? "system" : "chef-1",
        name: i === 0 ? "System" : "You (Chef)",
        role: i === 0 ? "system" : "chef",
      },
    });
  }

  return entries;
}
