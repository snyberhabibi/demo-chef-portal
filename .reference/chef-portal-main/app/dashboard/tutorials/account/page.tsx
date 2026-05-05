"use client";

import { useRouter } from "next/navigation";
import type { DriveStep } from "driver.js";
import {
  SettingsIcon,
  ImageIcon,
  LockIcon,
  EmailIcon,
  PhoneIcon,
} from "@shopify/polaris-icons";
import { TutorialPageWrapper } from "@/components/features/tutorials/tutorial-page-wrapper";
import { Badge, Label, HelpText } from "@/components/polaris";
import type { TutorialLanguage } from "@/lib/tutorial/tutorial-i18n";

const STORAGE_KEY = "yb-tutorial-completed-account";

const STEPS: Record<TutorialLanguage, DriveStep[]> = {
  en: [
    {
      popover: {
        title: "Welcome to Account Settings!",
        description:
          "This is where you manage your personal account — avatar, name, contact info, and password. Each section saves independently.",
      },
    },
    {
      element: "#tutorial-account-profile",
      popover: {
        title: "Profile Card",
        description:
          "Upload your avatar photo and set your display name. Your avatar appears next to your orders and in your storefront profile.",
      },
    },
    {
      element: "#tutorial-account-avatar",
      popover: {
        title: "Avatar Upload",
        description:
          "Drag and drop or click to upload a profile photo. Recommended: 1500x1500px square image, max 5MB. JPG, PNG, or WebP formats.",
      },
    },
    {
      element: "#tutorial-account-contact",
      popover: {
        title: "Contact Information",
        description:
          "Your email is set during registration and cannot be changed. You can update your phone number — a verification code will be sent to confirm the new number.",
      },
    },
    {
      element: "#tutorial-account-phone",
      popover: {
        title: "Changing Your Phone",
        description:
          'Click the "Change" button to update your phone number. You\'ll enter the new number, then verify it with a 6-digit code sent via SMS.',
      },
    },
    {
      element: "#tutorial-account-security",
      popover: {
        title: "Security",
        description:
          "Change your password here. You'll need your current password and the new one must have at least 6 characters with a mix of uppercase, lowercase, and numbers.",
      },
    },
    {
      popover: {
        title: "You're All Set!",
        description:
          "Head to Account Settings anytime to update your profile photo, phone number, or password. Keep your contact info up to date so customers can reach you!",
      },
    },
  ],
  ar: [
    {
      popover: {
        title: "مرحبًا بك في إعدادات الحساب!",
        description:
          "هنا تدير حسابك الشخصي — الصورة الرمزية، الاسم، معلومات الاتصال، وكلمة المرور. كل قسم يُحفظ بشكل مستقل.",
      },
    },
    {
      element: "#tutorial-account-profile",
      popover: {
        title: "بطاقة الملف الشخصي",
        description:
          "ارفع صورتك الرمزية وحدد اسم العرض. صورتك تظهر بجانب طلباتك وفي ملفك على الواجهة.",
      },
    },
    {
      element: "#tutorial-account-avatar",
      popover: {
        title: "رفع الصورة الرمزية",
        description:
          "اسحب وأفلت أو انقر لرفع صورة ملف شخصي. الموصى به: صورة مربعة ١٥٠٠×١٥٠٠ بكسل، حد أقصى ٥ ميغابايت. صيغ JPG أو PNG أو WebP.",
      },
    },
    {
      element: "#tutorial-account-contact",
      popover: {
        title: "معلومات الاتصال",
        description:
          "بريدك الإلكتروني يُحدد عند التسجيل ولا يمكن تغييره. يمكنك تحديث رقم هاتفك — سيُرسل رمز تحقق لتأكيد الرقم الجديد.",
      },
    },
    {
      element: "#tutorial-account-phone",
      popover: {
        title: "تغيير رقم الهاتف",
        description:
          'انقر على زر "تغيير" لتحديث رقم هاتفك. ستُدخل الرقم الجديد، ثم تتحقق منه برمز من ٦ أرقام يُرسل عبر رسالة نصية.',
      },
    },
    {
      element: "#tutorial-account-security",
      popover: {
        title: "الأمان",
        description:
          "غيّر كلمة المرور هنا. ستحتاج كلمة المرور الحالية والجديدة يجب أن تكون ٦ أحرف على الأقل مع مزيج من الأحرف الكبيرة والصغيرة والأرقام.",
      },
    },
    {
      popover: {
        title: "أنت جاهز!",
        description:
          "توجه إلى إعدادات الحساب في أي وقت لتحديث صورتك أو رقم هاتفك أو كلمة المرور. حافظ على معلومات اتصالك محدثة!",
      },
    },
  ],
  ur: [
    {
      popover: {
        title: "اکاؤنٹ سیٹنگز میں خوش آمدید!",
        description:
          "یہاں آپ اپنا ذاتی اکاؤنٹ منظم کرتے ہیں — تصویر، نام، رابطے کی معلومات، اور پاس ورڈ۔ ہر سیکشن الگ سے محفوظ ہوتا ہے۔",
      },
    },
    {
      element: "#tutorial-account-profile",
      popover: {
        title: "پروفائل کارڈ",
        description:
          "اپنی تصویر اپلوڈ کریں اور ڈسپلے نام سیٹ کریں۔ آپ کی تصویر آرڈرز اور اسٹور فرنٹ پروفائل میں نظر آتی ہے۔",
      },
    },
    {
      element: "#tutorial-account-avatar",
      popover: {
        title: "تصویر اپلوڈ",
        description:
          "ڈریگ اینڈ ڈراپ کریں یا کلک کر کے پروفائل تصویر اپلوڈ کریں۔ تجویز: ۱۵۰۰×۱۵۰۰ مربع تصویر، زیادہ سے زیادہ ۵ ایم بی۔ JPG، PNG، یا WebP فارمیٹ۔",
      },
    },
    {
      element: "#tutorial-account-contact",
      popover: {
        title: "رابطے کی معلومات",
        description:
          "آپ کا ای میل رجسٹریشن کے وقت سیٹ ہوتا ہے اور تبدیل نہیں ہو سکتا۔ آپ فون نمبر اپ ڈیٹ کر سکتے ہیں — نئے نمبر کی تصدیق کے لیے کوڈ بھیجا جائے گا۔",
      },
    },
    {
      element: "#tutorial-account-phone",
      popover: {
        title: "فون نمبر تبدیل کرنا",
        description:
          'فون نمبر اپ ڈیٹ کرنے کے لیے "تبدیل" بٹن دبائیں۔ نیا نمبر درج کریں، پھر SMS سے بھیجے گئے ۶ ہندسوں کے کوڈ سے تصدیق کریں۔',
      },
    },
    {
      element: "#tutorial-account-security",
      popover: {
        title: "سیکیورٹی",
        description:
          "یہاں پاس ورڈ تبدیل کریں۔ موجودہ پاس ورڈ درکار ہوگا اور نئے میں کم از کم ۶ حروف ہونے چاہئیں جن میں بڑے، چھوٹے حروف اور نمبر شامل ہوں۔",
      },
    },
    {
      popover: {
        title: "آپ تیار ہیں!",
        description:
          "کسی بھی وقت اکاؤنٹ سیٹنگز پر جائیں اپنی تصویر، فون نمبر، یا پاس ورڈ اپ ڈیٹ کرنے کے لیے۔ رابطے کی معلومات اپ ڈیٹ رکھیں!",
      },
    },
  ],
};

export default function AccountTutorialPage() {
  const router = useRouter();

  return (
    <TutorialPageWrapper
      title="Account Settings"
      description="Manage your avatar, contact information, and security settings. All data here is fake, nothing is saved."
      icon={SettingsIcon}
      storageKey={STORAGE_KEY}
      breadcrumbs={[
        { label: "Dashboard", onClick: () => router.push("/dashboard") },
        { label: "Tutorials", onClick: () => router.push("/dashboard/tutorials") },
        { label: "Account Settings" },
      ]}
      steps={STEPS}
    >
      <div className="max-w-2xl mx-auto space-y-[var(--p-space-600)]">
        {/* Card 1: Profile */}
        <section id="tutorial-account-profile" className="space-y-[var(--p-space-400)]">
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">Profile</h2>

          <div id="tutorial-account-avatar" className="flex items-center gap-[var(--p-space-500)]">
            <div className="size-20 rounded-full border-2 border-dashed border-[var(--p-color-border)] bg-[var(--p-color-bg-fill-secondary)] flex items-center justify-center">
              <ImageIcon className="size-8 fill-[var(--p-color-icon-secondary)]" />
            </div>
            <div>
              <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">Avatar</p>
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">
                1500x1500px recommended &middot; Max 5MB &middot; JPG, PNG, WebP
              </p>
            </div>
          </div>

          <div>
            <Label>Name</Label>
            <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-surface)]">
              Amira Hassan
            </div>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Card 2: Contact */}
        <section id="tutorial-account-contact" className="space-y-[var(--p-space-400)]">
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">Contact Information</h2>

          <div>
            <Label>Email</Label>
            <div className="mt-[var(--p-space-100)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-fill-disabled)] text-[var(--p-color-text-secondary)] flex items-center gap-[var(--p-space-200)]">
              <EmailIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
              chef@example.com
            </div>
            <HelpText>Your email address cannot be changed</HelpText>
          </div>

          <div id="tutorial-account-phone">
            <Label>Phone</Label>
            <div className="mt-[var(--p-space-100)] flex items-center gap-[var(--p-space-200)]">
              <div className="flex-1 rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-300)] py-[var(--p-space-200)] text-[0.8125rem] bg-[var(--p-color-bg-fill-disabled)] text-[var(--p-color-text-secondary)] flex items-center gap-[var(--p-space-200)]">
                <PhoneIcon className="size-4 fill-[var(--p-color-icon-secondary)]" />
                +1 (555) 123-4567
              </div>
              <span className="px-[var(--p-space-300)] py-[var(--p-space-200)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] bg-[var(--p-color-bg-surface)]">
                Change
              </span>
            </div>
            <HelpText>A verification code will be sent to your new number</HelpText>
          </div>
        </section>

        <hr className="border-[var(--p-color-border-secondary)]" />

        {/* Card 3: Security */}
        <section id="tutorial-account-security" className="space-y-[var(--p-space-400)]">
          <h2 className="text-[1rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">Security</h2>

          <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] px-[var(--p-space-400)] py-[var(--p-space-400)] bg-[var(--p-color-bg-surface)] flex items-center justify-between">
            <div className="flex items-center gap-[var(--p-space-300)]">
              <LockIcon className="size-5 fill-[var(--p-color-icon-secondary)]" />
              <div>
                <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)]">Password</p>
                <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)]">Last changed 30 days ago</p>
              </div>
            </div>
            <span className="px-[var(--p-space-300)] py-[var(--p-space-200)] rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] bg-[var(--p-color-bg-surface)]">
              Change Password
            </span>
          </div>

          <div className="rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-secondary)] px-[var(--p-space-400)] py-[var(--p-space-300)]">
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] mb-[var(--p-space-200)]">Password Requirements</p>
            <div className="space-y-[var(--p-space-100)]">
              {["At least 6 characters", "One lowercase letter", "One uppercase letter", "One number"].map((req) => (
                <div key={req} className="flex items-center gap-[var(--p-space-200)] text-[0.75rem] text-[var(--p-color-text-secondary)]">
                  <span className="size-3.5 rounded-full border border-[var(--p-color-border)] flex items-center justify-center text-[0.5rem]" />
                  {req}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </TutorialPageWrapper>
  );
}
