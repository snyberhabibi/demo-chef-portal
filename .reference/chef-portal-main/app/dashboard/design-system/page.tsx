"use client";

import React, { useState } from "react";
import {
  Save, Plus, Trash2, ChevronRight, ChevronLeft,
  Clock, Info, AlertCircle, Check, X, Search,
  Settings, Bell, Star, Heart, Eye, EyeOff
} from "lucide-react";
import { Button } from "@/components/polaris/button";
import { Input, Textarea, Label, InlineError, HelpText } from "@/components/polaris/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/polaris/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, CardDivider } from "@/components/polaris/card";
import { Badge } from "@/components/polaris/badge";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogBody, DialogFooter, DialogTitle, DialogClose } from "@/components/polaris/dialog";
import { SearchableSelect } from "@/components/polaris/searchable-select";
import { Checkbox, CheckboxField } from "@/components/polaris/checkbox";
import { RadioGroup, RadioGroupItem, RadioField } from "@/components/polaris/radio-group";
import { Switch, SwitchField } from "@/components/polaris/switch";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/polaris/tabs";
import { Banner } from "@/components/polaris/banner";
import { Tooltip, TooltipTrigger, TooltipContent, ClickTooltip, ClickTooltipTrigger, ClickTooltipContent } from "@/components/polaris/tooltip";
import { Spinner } from "@/components/polaris/spinner";
import { Avatar } from "@/components/polaris/avatar";
import { Pagination } from "@/components/polaris/pagination";
import { FileUpload, ImageUpload, MultiImageUpload, type UploadedFile } from "@/components/polaris/file-upload";
import { PolarisDishCard } from "@/components/polaris/dish-card";
import { PolarisBundleCard } from "@/components/polaris/bundle-card";
import { IconTabs, type IconTab } from "@/components/polaris/icon-tabs";
import { FilterPills } from "@/components/polaris/filter-pills";
import { SkeletonText, SkeletonThumbnail, SkeletonCard } from "@/components/polaris/skeleton";
import { ProgressBar } from "@/components/polaris/progress-bar";
import { EmptyState } from "@/components/polaris/empty-state";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/polaris/popover";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetBody, SheetFooter } from "@/components/polaris/sheet";
import { BottomSheet, BottomSheetTrigger, BottomSheetContent, BottomSheetHeader, BottomSheetTitle, BottomSheetBody, BottomSheetFooter } from "@/components/polaris/bottom-sheet";
import { DataTable, type Column } from "@/components/polaris/data-table";
import { ToastProvider, useToast } from "@/components/polaris/toast";
import { Navigation, type NavSection } from "@/components/polaris/navigation";
import { TopBar } from "@/components/polaris/top-bar";
import { ActionList } from "@/components/polaris/action-list";
import { Tag } from "@/components/polaris/tag";
import { Collapsible, Accordion } from "@/components/polaris/collapsible";
import { Breadcrumb } from "@/components/polaris/breadcrumb";
import { StatsCard } from "@/components/polaris/stats-card";
import { Timeline } from "@/components/polaris/timeline";
import { Divider } from "@/components/polaris/divider";
import { DatePicker, TimePicker, DateTimePicker } from "@/components/polaris/date-picker";
import { Thumbnail } from "@/components/polaris/thumbnail";
import { ResourceItem } from "@/components/polaris/resource-item";
import { PageHeader } from "@/components/polaris/page-header";
import { SearchBar } from "@/components/polaris/search-bar";
import { NumberInput } from "@/components/polaris/number-input";
import { ToggleGroup } from "@/components/polaris/toggle-group";
import { ColorSwatch } from "@/components/polaris/color-swatch";
import { NotificationCenter } from "@/components/polaris/notification-center";
import { ConfirmDialog } from "@/components/polaris/confirm-dialog";
import { CopyButton } from "@/components/polaris/copy-button";
import { Kbd } from "@/components/polaris/kbd";
import { StatusDot } from "@/components/polaris/status-dot";
import { ExpandableText } from "@/components/polaris/expandable-text";
import { SortableList, type SortableItem as SortableItemType } from "@/components/polaris/sortable-list";
import { OrderFilledIcon, CashDollarFilledIcon, ProductFilledIcon } from "@shopify/polaris-icons";
import {
  EditIcon, GlobeIcon, ArchiveIcon, DeleteIcon,
  FoodIcon, StarIcon, HeartIcon, CategoriesIcon, PackageIcon,
  HomeIcon, OrderIcon, ProductIcon, SettingsIcon, PersonIcon,
  NotificationIcon, MenuVerticalIcon, CartIcon,
} from "@shopify/polaris-icons";

const cuisineOptions = [
  { value: "palestinian", label: "Palestinian" },
  { value: "lebanese", label: "Lebanese" },
  { value: "syrian", label: "Syrian" },
  { value: "egyptian", label: "Egyptian" },
  { value: "moroccan", label: "Moroccan" },
  { value: "turkish", label: "Turkish" },
  { value: "italian", label: "Italian" },
  { value: "mexican", label: "Mexican" },
  { value: "indian", label: "Indian" },
  { value: "thai", label: "Thai" },
  { value: "japanese", label: "Japanese" },
  { value: "chinese", label: "Chinese" },
];

function ToastDemo() {
  const { addToast } = useToast()
  const styles = [
    { name: "Badge", style: "badge" as const, desc: "Default — solid filled icon, modern" },
    { name: "Clean", style: "clean" as const, desc: "White card, colored icon" },
    { name: "Tinted", style: "tinted" as const, desc: "Colored surface background" },
    { name: "Minimal", style: "minimal" as const, desc: "No shadow, border lines only" },
    { name: "Pill", style: "pill" as const, desc: "Compact floating chip" },
    { name: "Slide Bar", style: "slidebar" as const, desc: "Wide bar with accent stripe" },
    { name: "Glass", style: "glass" as const, desc: "Frosted glass blur" },
    { name: "Dark", style: "dark" as const, desc: "Dark bg, sleek minimal" },
    { name: "Split", style: "split" as const, desc: "Colored icon panel + white content" },
  ]
  return (
    <div className="space-y-[var(--p-space-300)]">
      {styles.map((s) => (
        <div key={s.style}>
          <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-100)]">
            {s.name} <span className="normal-case font-[var(--p-font-weight-regular)]">— {s.desc}</span>
          </p>
          <div className="flex flex-wrap gap-[var(--p-space-150)]">
            <Button variant="secondary" size="sm" onClick={() => addToast({ title: "Saved", message: "Changes saved successfully", tone: "success", style: s.style })}>
              Success
            </Button>
            <Button variant="secondary" size="sm" onClick={() => addToast({ title: "Error", message: "Something went wrong", tone: "critical", style: s.style })}>
              Critical
            </Button>
            <Button variant="secondary" size="sm" onClick={() => addToast({ message: "New order received", tone: "info", style: s.style, action: { label: "View", onClick: () => {} } })}>
              Info
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export default function DesignSystemPage() {
  const [inputValue, setInputValue] = useState("");
  const [searchableValue, setSearchableValue] = useState("");
  const [paginationPage, setPaginationPage] = useState(3);
  const [activeIconTab, setActiveIconTab] = useState("all");
  const [activeFilter, setActiveFilter] = useState("all");
  const [activeFiltersMulti, setActiveFiltersMulti] = useState<string[]>(["mon", "wed"]);
  const [selectedTableRows, setSelectedTableRows] = useState<string[]>([]);
  const [navCollapsed, setNavCollapsed] = useState(false);
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [timeH, setTimeH] = useState(14);
  const [timeM, setTimeM] = useState(30);
  const [dateTimeValue, setDateTimeValue] = useState<Date | undefined>();
  const [searchValue, setSearchValue] = useState("");
  const [quantity, setQuantity] = useState(3);
  const [toggleValue, setToggleValue] = useState("grid");
  const [selectedColor, setSelectedColor] = useState("#303030");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [sortableItems, setSortableItems] = useState<SortableItemType[]>([
    { id: "1", content: <span className="text-[0.8125rem]">Traditional Shawarma Plate</span> },
    { id: "2", content: <span className="text-[0.8125rem]">Falafel Wrap</span> },
    { id: "3", content: <span className="text-[0.8125rem]">Kunafa</span> },
    { id: "4", content: <span className="text-[0.8125rem]">Hummus Bowl</span> },
  ]);
  const mockDishes = [
    { id: "1", name: "Traditional Shawarma Plate", category: "Main Meals", price: 18.99, image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=400&h=300&fit=crop", status: "published" as const, description: "", categoryId: "", createdAt: "" },
    { id: "2", name: "Falafel Wrap", category: "Wraps", price: 12.50, image: "https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=400&h=300&fit=crop", status: "draft" as const, description: "", categoryId: "", createdAt: "" },
    { id: "3", name: "Kunafa", category: "Desserts", price: 8.00, image: "https://images.unsplash.com/photo-1579888944880-d98341245702?w=400&h=300&fit=crop", status: "archived" as const, description: "", categoryId: "", createdAt: "" },
    { id: "4", name: "Hummus Bowl", category: "Appetizers", price: 9.99, image: "https://images.unsplash.com/photo-1577805947697-89340a0fb498?w=400&h=300&fit=crop", status: "published" as const, description: "", categoryId: "", createdAt: "" },
  ];

  const mockBundles = [
    { id: "1", name: "Family Feast", price: 49.99, image: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop", status: "published" as const, itemCount: 5, description: "", createdAt: "" },
    { id: "2", name: "Date Night Special", price: 34.99, image: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&h=300&fit=crop", status: "draft" as const, itemCount: 3, description: "", createdAt: "" },
    { id: "3", name: "Lunch Box", price: 15.99, image: "", status: "published" as const, itemCount: 2, description: "", createdAt: "" },
  ];

  const mockCardActions = [
    { label: "Edit", icon: EditIcon, description: "Modify dish details", onClick: () => {} },
    { label: "Publish", icon: GlobeIcon, description: "Make visible on menu", onClick: () => {} },
    { label: "Archive", icon: ArchiveIcon, description: "Hide from menu", onClick: () => {} },
    { label: "Delete", icon: DeleteIcon, description: "Permanently remove", onClick: () => {}, variant: "destructive" as const },
  ];

  const [sampleFiles] = useState<UploadedFile[]>([
    { id: "1", preview: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200&h=200&fit=crop", name: "dish-1.jpg", status: "complete" },
    { id: "2", preview: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=200&h=200&fit=crop", name: "dish-2.jpg", status: "complete" },
    { id: "3", preview: "https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=200&h=200&fit=crop", name: "dish-3.jpg", progress: 65, status: "uploading" },
  ]);

  return (
    <ToastProvider>
    <div className="space-y-[var(--p-space-800)] max-w-4xl">
      {/* Page Header */}
      <div>
        <h1 className="text-[var(--p-font-size-750)] leading-[var(--p-font-line-height-1000)] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)]">
          Design System
        </h1>
        <p className="text-[var(--p-font-size-350)] leading-[var(--p-font-line-height-500)] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)]">
          Polaris-styled components for Yalla Bites Chef Portal
        </p>
      </div>

      {/* ========================================
          COLORS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Colors</CardTitle>
          <CardDescription>Semantic color tokens from Polaris</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          {/* Backgrounds */}
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Backgrounds</p>
            <div className="grid grid-cols-4 gap-[var(--p-space-200)]">
              {[
                { label: "bg", css: "var(--p-color-bg)" },
                { label: "surface", css: "var(--p-color-bg-surface)" },
                { label: "surface-secondary", css: "var(--p-color-bg-surface-secondary)" },
                { label: "surface-tertiary", css: "var(--p-color-bg-surface-tertiary)" },
                { label: "fill-brand", css: "var(--p-color-bg-fill-brand)" },
                { label: "fill-secondary", css: "var(--p-color-bg-fill-secondary)" },
                { label: "fill-tertiary", css: "var(--p-color-bg-fill-tertiary)" },
                { label: "inverse", css: "var(--p-color-bg-inverse)" },
              ].map((c) => (
                <div key={c.label} className="text-center">
                  <div
                    className="h-12 rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border-secondary)] mb-[var(--p-space-100)]"
                    style={{ background: c.css }}
                  />
                  <p className="text-[11px] text-[var(--p-color-text-secondary)]">{c.label}</p>
                </div>
              ))}
            </div>
          </div>

          <CardDivider />

          {/* Semantic */}
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Semantic Surfaces</p>
            <div className="grid grid-cols-4 gap-[var(--p-space-200)]">
              {[
                { label: "info", bg: "var(--p-color-bg-surface-info)", text: "var(--p-color-text-info)" },
                { label: "success", bg: "var(--p-color-bg-surface-success)", text: "var(--p-color-text-success)" },
                { label: "caution", bg: "var(--p-color-bg-surface-caution)", text: "var(--p-color-text-caution)" },
                { label: "warning", bg: "var(--p-color-bg-surface-warning)", text: "var(--p-color-text-warning)" },
                { label: "critical", bg: "var(--p-color-bg-surface-critical)", text: "var(--p-color-text-critical)" },
                { label: "emphasis", bg: "var(--p-color-bg-surface-emphasis)", text: "var(--p-color-text-emphasis)" },
                { label: "magic", bg: "var(--p-color-bg-surface-magic)", text: "var(--p-color-text-magic)" },
                { label: "inverse", bg: "var(--p-color-bg-surface-inverse)", text: "var(--p-color-text-inverse)" },
              ].map((c) => (
                <div key={c.label} className="text-center">
                  <div
                    className="h-12 rounded-[var(--p-border-radius-200)] flex items-center justify-center"
                    style={{ background: c.bg, color: c.text }}
                  >
                    <span className="text-[11px] font-[var(--p-font-weight-medium)]">{c.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <CardDivider />

          {/* Text Colors */}
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Text Colors</p>
            <div className="space-y-[var(--p-space-100)]">
              <p className="text-[var(--p-color-text)]">Default text — rgba(48, 48, 48, 1)</p>
              <p className="text-[var(--p-color-text-secondary)]">Secondary text — rgba(97, 97, 97, 1)</p>
              <p className="text-[var(--p-color-text-disabled)]">Disabled text — rgba(181, 181, 181, 1)</p>
              <p className="text-[var(--p-color-text-link)]">Link text — rgba(0, 91, 211, 1)</p>
              <p className="text-[var(--p-color-text-critical)]">Critical text — rgba(142, 11, 33, 1)</p>
              <p className="text-[var(--p-color-text-success)]">Success text — rgba(1, 75, 64, 1)</p>
              <p className="text-[var(--p-color-text-warning)]">Warning text — rgba(94, 66, 0, 1)</p>
              <p className="text-[var(--p-color-text-emphasis)]">Emphasis text — rgba(0, 91, 211, 1)</p>
              <p className="text-[var(--p-color-text-magic)]">Magic text — rgba(87, 0, 209, 1)</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          TYPOGRAPHY
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Typography</CardTitle>
          <CardDescription>Font sizes, weights, and line heights</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div className="space-y-[var(--p-space-300)]">
            <div>
              <p className="text-[36px] leading-[48px] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-densest)]">Heading 3XL — 36/48</p>
              <p className="text-[11px] text-[var(--p-color-text-secondary)]">font-size-900 / line-height-1200 / bold / densest</p>
            </div>
            <div>
              <p className="text-[30px] leading-[40px] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-denser)]">Heading 2XL — 30/40</p>
              <p className="text-[11px] text-[var(--p-color-text-secondary)]">font-size-750 / line-height-1000 / bold / denser</p>
            </div>
            <div>
              <p className="text-[24px] leading-[32px] font-[var(--p-font-weight-bold)] tracking-[var(--p-font-letter-spacing-dense)]">Heading XL — 24/32</p>
              <p className="text-[11px] text-[var(--p-color-text-secondary)]">font-size-600 / line-height-800 / bold / dense</p>
            </div>
            <div>
              <p className="text-[20px] leading-[24px] font-[var(--p-font-weight-semibold)] tracking-[var(--p-font-letter-spacing-dense)]">Heading LG — 20/24</p>
              <p className="text-[11px] text-[var(--p-color-text-secondary)]">font-size-500 / line-height-600 / semibold / dense</p>
            </div>
            <div>
              <p className="text-[14px] leading-[20px] font-[var(--p-font-weight-semibold)]">Heading MD — 14/20</p>
              <p className="text-[11px] text-[var(--p-color-text-secondary)]">font-size-350 / line-height-500 / semibold</p>
            </div>
            <div>
              <p className="text-[13px] leading-[20px] font-[var(--p-font-weight-semibold)]">Heading SM — 13/20</p>
              <p className="text-[11px] text-[var(--p-color-text-secondary)]">font-size-325 / line-height-500 / semibold</p>
            </div>
            <div>
              <p className="text-[12px] leading-[16px] font-[var(--p-font-weight-semibold)]">Heading XS — 12/16</p>
              <p className="text-[11px] text-[var(--p-color-text-secondary)]">font-size-300 / line-height-400 / semibold</p>
            </div>
          </div>

          <CardDivider />

          <div className="space-y-[var(--p-space-200)]">
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-100)]">Body Text</p>
            <p className="text-[14px] leading-[20px] font-[var(--p-font-weight-regular)]">Body LG — 14px / 20px line-height / regular (450)</p>
            <p className="text-[13px] leading-[20px] font-[var(--p-font-weight-regular)]">Body MD — 13px / 20px line-height / regular (450)</p>
            <p className="text-[12px] leading-[16px] font-[var(--p-font-weight-regular)]">Body SM — 12px / 16px line-height / regular (450)</p>
            <p className="text-[11px] leading-[12px] font-[var(--p-font-weight-regular)]">Body XS — 11px / 12px line-height / regular (450)</p>
          </div>

          <CardDivider />

          <div className="space-y-[var(--p-space-200)]">
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-100)]">Font Weights</p>
            <p className="font-[var(--p-font-weight-regular)]">Regular — 450</p>
            <p className="font-[var(--p-font-weight-medium)]">Medium — 550</p>
            <p className="font-[var(--p-font-weight-semibold)]">Semibold — 650</p>
            <p className="font-[var(--p-font-weight-bold)]">Bold — 700</p>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          BUTTONS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Buttons</CardTitle>
          <CardDescription>All variants and sizes</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          {/* Variants */}
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Variants</p>
            <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
              <Button variant="default">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="tertiary">Tertiary</Button>
              <Button variant="plain">Plain link</Button>
              <Button variant="destructive">Destructive</Button>
              <Button variant="success">Success</Button>
            </div>
          </div>

          <CardDivider />

          {/* Sizes */}
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Sizes</p>
            <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
              <Button variant="default" size="micro">Micro</Button>
              <Button variant="default" size="sm">Small</Button>
              <Button variant="default" size="default">Default</Button>
              <Button variant="default" size="lg">Large</Button>
            </div>
          </div>

          <CardDivider />

          {/* With Icons */}
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">With Icons</p>
            <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
              <Button variant="default"><Save size={16} /> Save</Button>
              <Button variant="secondary"><Plus size={16} /> Add item</Button>
              <Button variant="destructive"><Trash2 size={16} /> Delete</Button>
              <Button variant="success"><Check size={16} /> Approve</Button>
            </div>
          </div>

          <CardDivider />

          {/* Icon Only */}
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Icon Only</p>
            <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
              <Button variant="secondary" size="icon"><Settings size={16} /></Button>
              <Button variant="secondary" size="icon"><Bell size={16} /></Button>
              <Button variant="secondary" size="icon"><Search size={16} /></Button>
              <Button variant="tertiary" size="icon"><X size={16} /></Button>
              <Button variant="tertiary" size="icon-micro"><Star size={14} /></Button>
            </div>
          </div>

          <CardDivider />

          {/* States */}
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Disabled</p>
            <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
              <Button variant="default" disabled>Primary</Button>
              <Button variant="secondary" disabled>Secondary</Button>
              <Button variant="tertiary" disabled>Tertiary</Button>
              <Button variant="destructive" disabled>Destructive</Button>
            </div>
          </div>

          <CardDivider />

          {/* Full Width */}
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Full Width</p>
            <Button variant="default" fullWidth>Full width primary</Button>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          INPUTS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Inputs</CardTitle>
          <CardDescription>Text fields, textareas, labels, and help text</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          {/* Default */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--p-space-400)]">
            <div>
              <Label>Default input</Label>
              <Input placeholder="Placeholder text" />
            </div>
            <div>
              <Label required>Required input</Label>
              <Input placeholder="This field is required" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--p-space-400)]">
            <div>
              <Label>With help text</Label>
              <Input placeholder="Enter value" />
              <HelpText>This is helper text below the input</HelpText>
            </div>
            <div>
              <Label>With error</Label>
              <Input placeholder="Invalid value" error />
              <InlineError>This field has an error</InlineError>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--p-space-400)]">
            <div>
              <Label>Number input</Label>
              <Input type="number" placeholder="0" />
            </div>
            <div>
              <Label disabled>Disabled input</Label>
              <Input placeholder="Cannot edit" disabled />
            </div>
          </div>

          <CardDivider />

          {/* Textarea */}
          <div>
            <Label>Textarea</Label>
            <Textarea rows={3} placeholder="Write a longer description..." />
            <HelpText>Markdown is supported</HelpText>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          SELECTS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Selects</CardTitle>
          <CardDescription>Dropdown selection controls</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-[var(--p-space-400)]">
            <div>
              <Label>Default</Label>
              <Select defaultValue="option1">
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="option1">Option One</SelectItem>
                  <SelectItem value="option2">Option Two</SelectItem>
                  <SelectItem value="option3">Option Three</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label>With placeholder</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="Choose an option..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="a">Alpha</SelectItem>
                  <SelectItem value="b">Beta</SelectItem>
                  <SelectItem value="c">Gamma</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label disabled>Disabled</Label>
              <Select disabled>
                <SelectTrigger>
                  <SelectValue placeholder="Cannot select" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="x">X</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          BADGES
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Badges</CardTitle>
          <CardDescription>Status indicators and labels</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Default Size</p>
            <div className="flex flex-wrap gap-[var(--p-space-200)]">
              <Badge tone="default">Default</Badge>
              <Badge tone="info">Info</Badge>
              <Badge tone="success">Success</Badge>
              <Badge tone="warning">Warning</Badge>
              <Badge tone="critical">Critical</Badge>
              <Badge tone="attention">Attention</Badge>
              <Badge tone="new">New</Badge>
              <Badge tone="magic">Magic</Badge>
              <Badge tone="emphasis">Emphasis</Badge>
              <Badge tone="read-only">Read-only</Badge>
              <Badge tone="enabled">Enabled</Badge>
            </div>
          </div>

          <CardDivider />

          <div>
            <p className="text-[12px] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Small Size</p>
            <div className="flex flex-wrap gap-[var(--p-space-200)]">
              <Badge tone="default" size="sm">Default</Badge>
              <Badge tone="info" size="sm">Info</Badge>
              <Badge tone="success" size="sm">Success</Badge>
              <Badge tone="warning" size="sm">Warning</Badge>
              <Badge tone="critical" size="sm">Critical</Badge>
              <Badge tone="attention" size="sm">Attention</Badge>
              <Badge tone="new" size="sm">New</Badge>
              <Badge tone="magic" size="sm">Magic</Badge>
              <Badge tone="emphasis" size="sm">Emphasis</Badge>
              <Badge tone="read-only" size="sm">Read-only</Badge>
              <Badge tone="enabled" size="sm">Enabled</Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          SEARCHABLE SELECT
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Searchable Select</CardTitle>
          <CardDescription>Combobox with search filtering</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--p-space-400)]">
            <div>
              <Label>Cuisine (searchable)</Label>
              <SearchableSelect
                options={cuisineOptions}
                value={searchableValue}
                onValueChange={setSearchableValue}
                placeholder="Search cuisines..."
                searchPlaceholder="Type to filter..."
              />
              <HelpText>Try typing &quot;pal&quot; or &quot;ita&quot;</HelpText>
            </div>
            <div>
              <Label>Disabled</Label>
              <SearchableSelect
                options={cuisineOptions}
                placeholder="Cannot search"
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          DIALOGS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Dialogs</CardTitle>
          <CardDescription>Modal dialogs for confirmations and forms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div className="flex flex-wrap gap-[var(--p-space-200)]">
            {/* Basic Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Basic Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Delete dish?</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p className="text-[var(--p-font-size-325)] leading-[var(--p-font-line-height-500)] text-[var(--p-color-text-secondary)]">
                    This will permanently delete &quot;Traditional Shawarma Plate&quot; and remove it from your menu. This action cannot be undone.
                  </p>
                </DialogBody>
                <DialogFooter>
                  <Button variant="tertiary">Cancel</Button>
                  <Button variant="destructive">Delete</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Form Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Form Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Add portion size</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p className="text-[var(--p-font-size-325)] leading-[var(--p-font-line-height-500)] text-[var(--p-color-text-secondary)] mb-[var(--p-space-400)]">
                    Create a new portion option for this dish.
                  </p>
                  <div className="space-y-[var(--p-space-400)]">
                    <div>
                      <Label required>Label</Label>
                      <Input placeholder="e.g. Family Size" />
                    </div>
                    <div className="grid grid-cols-2 gap-[var(--p-space-300)]">
                      <div>
                        <Label required>Size</Label>
                        <Input placeholder="e.g. 500g" />
                      </div>
                      <div>
                        <Label required>Price</Label>
                        <Input type="number" placeholder="0.00" />
                      </div>
                    </div>
                  </div>
                </DialogBody>
                <DialogFooter>
                  <Button variant="tertiary">Cancel</Button>
                  <Button variant="default">Add portion</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            {/* Success Dialog */}
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Success Dialog</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dish published!</DialogTitle>
                </DialogHeader>
                <DialogBody>
                  <p className="text-[var(--p-font-size-325)] leading-[var(--p-font-line-height-500)] text-[var(--p-color-text-secondary)]">
                    Your dish is now live on the marketplace and visible to customers.
                  </p>
                </DialogBody>
                <DialogFooter>
                  <Button variant="default">View on menu</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          CHECKBOXES
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Checkboxes</CardTitle>
          <CardDescription>Selection controls for forms</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">States</p>
            <div className="space-y-[var(--p-space-300)]">
              <CheckboxField label="Unchecked" />
              <CheckboxField label="Checked" defaultChecked />
              <CheckboxField label="Indeterminate" indeterminate />
              <CheckboxField label="Disabled unchecked" disabled />
              <CheckboxField label="Disabled checked" disabled defaultChecked />
              <CheckboxField label="With error" error />
            </div>
          </div>

          <CardDivider />

          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">With Help Text</p>
            <div className="space-y-[var(--p-space-300)]">
              <CheckboxField
                label="Free shipping"
                helpText="Offer free shipping on orders over $50"
              />
              <CheckboxField
                label="Collect tax"
                helpText="Charge taxes on this product"
                defaultChecked
              />
            </div>
          </div>

          <CardDivider />

          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Standalone</p>
            <div className="flex items-center gap-[var(--p-space-400)]">
              <Checkbox />
              <Checkbox defaultChecked />
              <Checkbox indeterminate />
              <Checkbox disabled />
              <Checkbox disabled defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          RADIO BUTTONS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Radio Buttons</CardTitle>
          <CardDescription>Single selection from a group</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <RadioGroup defaultValue="delivery">
            <RadioField value="delivery" label="Delivery" helpText="Standard home delivery" />
            <RadioField value="pickup" label="Chef Pickup" helpText="Pick up from chef's location" />
            <RadioField value="shipping" label="Shipping" helpText="Ship via courier service" />
            <RadioField value="disabled" label="Dine-in (coming soon)" disabled />
          </RadioGroup>
        </CardContent>
      </Card>

      {/* ========================================
          SWITCHES
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Switches</CardTitle>
          <CardDescription>Toggle controls for on/off states</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Standalone</p>
            <div className="flex items-center gap-[var(--p-space-400)]">
              <Switch />
              <Switch defaultChecked />
              <Switch disabled />
              <Switch disabled defaultChecked />
            </div>
          </div>
          <CardDivider />
          <div className="space-y-[var(--p-space-300)] max-w-md">
            <SwitchField label="Accept orders" helpText="When enabled, customers can place new orders" defaultChecked />
            <SwitchField label="Flash sale" helpText="Temporarily discount this dish" />
            <SwitchField label="Seasonal item" helpText="Mark as seasonal availability" disabled />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          TABS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Tabs</CardTitle>
          <CardDescription>Content switching with underline style</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="draft">Draft</TabsTrigger>
              <TabsTrigger value="archived">Archived</TabsTrigger>
            </TabsList>
            <TabsContent value="all">
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Showing all items in the list.</p>
            </TabsContent>
            <TabsContent value="active">
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Showing only active items.</p>
            </TabsContent>
            <TabsContent value="draft">
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Showing draft items.</p>
            </TabsContent>
            <TabsContent value="archived">
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Showing archived items.</p>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* ========================================
          ICON TABS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Icon Tabs</CardTitle>
          <CardDescription>Category navigation with icons</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Pill Variant</p>
            <IconTabs
              variant="pill"
              tabs={[
                { id: "all", label: "All", icon: StarIcon, count: 24 },
                { id: "mains", label: "Main Dishes", icon: FoodIcon, count: 8 },
                { id: "appetizers", label: "Appetizers", icon: HeartIcon, count: 5 },
                { id: "categories", label: "Categories", icon: CategoriesIcon, count: 6 },
                { id: "bundles", label: "Bundles", icon: PackageIcon, count: 5 },
              ]}
              activeTab={activeIconTab}
              onTabChange={setActiveIconTab}
            />
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Card Variant</p>
            <IconTabs
              variant="card"
              tabs={[
                { id: "all", label: "All", icon: StarIcon, count: 24 },
                { id: "mains", label: "Main Dishes", icon: FoodIcon, count: 8 },
                { id: "appetizers", label: "Appetizers", icon: HeartIcon, count: 5 },
                { id: "categories", label: "Categories", icon: CategoriesIcon, count: 6 },
                { id: "bundles", label: "Bundles", icon: PackageIcon, count: 5 },
              ]}
              activeTab={activeIconTab}
              onTabChange={setActiveIconTab}
            />
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Segmented with Icons</p>
            <IconTabs
              variant="segmented"
              tabs={[
                { id: "all", label: "All", icon: StarIcon, count: 24 },
                { id: "mains", label: "Main Dishes", icon: FoodIcon, count: 8 },
                { id: "appetizers", label: "Appetizers", icon: HeartIcon, count: 5 },
                { id: "categories", label: "Categories", icon: CategoriesIcon, count: 6 },
                { id: "bundles", label: "Bundles", icon: PackageIcon, count: 5 },
              ]}
              activeTab={activeIconTab}
              onTabChange={setActiveIconTab}
            />
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Segmented with Category Images</p>
            <IconTabs
              variant="segmented"
              tabs={[
                { id: "all", label: "All Categories" },
                { id: "mains", label: "Main Dishes", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=40&h=40&fit=crop" },
                { id: "wraps", label: "Wraps", image: "https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=40&h=40&fit=crop" },
                { id: "desserts", label: "Desserts", image: "https://images.unsplash.com/photo-1579888944880-d98341245702?w=40&h=40&fit=crop" },
                { id: "appetizers", label: "Appetizers", image: "https://images.unsplash.com/photo-1577805947697-89340a0fb498?w=40&h=40&fit=crop" },
              ]}
              activeTab={activeIconTab}
              onTabChange={setActiveIconTab}
            />
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Underline Variant</p>
            <IconTabs
              variant="underline"
              tabs={[
                { id: "all", label: "All Categories", icon: StarIcon },
                { id: "mains", label: "Main Dishes", icon: FoodIcon },
                { id: "appetizers", label: "Appetizers", icon: HeartIcon },
                { id: "categories", label: "Desserts", icon: CategoriesIcon },
                { id: "bundles", label: "Bundles", icon: PackageIcon },
              ]}
              activeTab={activeIconTab}
              onTabChange={setActiveIconTab}
            />
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Underline with Images (from API)</p>
            <IconTabs
              variant="underline"
              tabs={[
                { id: "all", label: "All Categories" },
                { id: "mains", label: "Main Dishes", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=40&h=40&fit=crop" },
                { id: "wraps", label: "Wraps", image: "https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=40&h=40&fit=crop" },
                { id: "desserts", label: "Desserts", image: "https://images.unsplash.com/photo-1579888944880-d98341245702?w=40&h=40&fit=crop" },
                { id: "appetizers", label: "Appetizers", image: "https://images.unsplash.com/photo-1577805947697-89340a0fb498?w=40&h=40&fit=crop" },
              ]}
              activeTab={activeIconTab}
              onTabChange={setActiveIconTab}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          FILTER PILLS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Filter Pills</CardTitle>
          <CardDescription>Toggleable filter chips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <FilterPills
            label="Status"
            pills={[
              { id: "all", label: "All", count: 24 },
              { id: "published", label: "Published", count: 18 },
              { id: "draft", label: "Draft", count: 4 },
              { id: "archived", label: "Archived", count: 2 },
            ]}
            selected={activeFilter}
            onSelect={(v) => setActiveFilter(v as string)}
          />
          <CardDivider />
          <FilterPills
            label="Available Days (multi-select)"
            pills={[
              { id: "mon", label: "Monday" },
              { id: "tue", label: "Tuesday" },
              { id: "wed", label: "Wednesday" },
              { id: "thu", label: "Thursday" },
              { id: "fri", label: "Friday" },
              { id: "sat", label: "Saturday" },
              { id: "sun", label: "Sunday" },
            ]}
            selected={activeFiltersMulti}
            onSelect={(v) => setActiveFiltersMulti(v as string[])}
            multiple
          />
        </CardContent>
      </Card>

      {/* ========================================
          SKELETON LOADING
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Skeleton Loading</CardTitle>
          <CardDescription>Placeholder content during loading</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Text Lines</p>
            <SkeletonText lines={3} />
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Thumbnails</p>
            <div className="flex gap-[var(--p-space-300)]">
              <SkeletonThumbnail size="small" />
              <SkeletonThumbnail size="medium" />
              <SkeletonThumbnail size="large" />
            </div>
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Card Skeletons</p>
            <div className="grid grid-cols-3 gap-[var(--p-space-300)]">
              <SkeletonCard />
              <SkeletonCard />
              <SkeletonCard />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          PROGRESS BAR
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Progress Bar</CardTitle>
          <CardDescription>Linear progress indicators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div className="space-y-[var(--p-space-300)]">
            <div>
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-100)]">Default — 40%</p>
              <ProgressBar progress={40} />
            </div>
            <div>
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-100)]">Success — 75%</p>
              <ProgressBar progress={75} tone="success" />
            </div>
            <div>
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-100)]">Critical — 90%</p>
              <ProgressBar progress={90} tone="critical" />
            </div>
            <div>
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-100)]">Small — 60%</p>
              <ProgressBar progress={60} size="small" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          POPOVER & SHEET
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Popover &amp; Sheet</CardTitle>
          <CardDescription>Floating and sliding panels</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-[var(--p-space-200)]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">Open Popover</Button>
              </PopoverTrigger>
              <PopoverContent>
                <p className="text-[0.8125rem] text-[var(--p-color-text)]">This is popover content. It floats next to the trigger.</p>
              </PopoverContent>
            </Popover>

            <BottomSheet>
              <BottomSheetTrigger asChild>
                <Button variant="secondary">Open Bottom Sheet</Button>
              </BottomSheetTrigger>
              <BottomSheetContent>
                <BottomSheetHeader>
                  <BottomSheetTitle>Filter Orders</BottomSheetTitle>
                </BottomSheetHeader>
                <BottomSheetBody>
                  <div className="space-y-[var(--p-space-400)]">
                    <div>
                      <Label>Status</Label>
                      <Select defaultValue="all">
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">All</SelectItem>
                          <SelectItem value="paid">Paid</SelectItem>
                          <SelectItem value="preparing">Preparing</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Date Range</Label>
                      <Input type="date" />
                    </div>
                  </div>
                </BottomSheetBody>
                <BottomSheetFooter>
                  <Button variant="tertiary">Clear</Button>
                  <Button variant="default">Apply Filters</Button>
                </BottomSheetFooter>
              </BottomSheetContent>
            </BottomSheet>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">Open Side Sheet</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Sheet Title</SheetTitle>
                </SheetHeader>
                <SheetBody>
                  <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
                    This is a slide-in panel from the right. Perfect for filters, forms, or detail views.
                  </p>
                </SheetBody>
                <SheetFooter>
                  <Button variant="tertiary">Cancel</Button>
                  <Button variant="default">Apply</Button>
                </SheetFooter>
              </SheetContent>
            </Sheet>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          EMPTY STATE
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Empty State</CardTitle>
          <CardDescription>No-data placeholders with actions</CardDescription>
        </CardHeader>
        <CardContent>
          <EmptyState
            heading="No dishes yet"
            description="Start by adding your first dish to the menu. Customers will be able to browse and order from your collection."
            icon={FoodIcon}
            primaryAction={{ label: "Add dish", onClick: () => {} }}
            secondaryAction={{ label: "Learn more", onClick: () => {} }}
          />
        </CardContent>
      </Card>

      {/* ========================================
          BANNERS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Banners</CardTitle>
          <CardDescription>Feedback messages and notifications</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-300)]">
          <Banner tone="info" title="Order update">
            <p>Your order #1234 has been confirmed and is being prepared.</p>
          </Banner>
          <Banner tone="success" title="Dish published">
            <p>Traditional Shawarma Plate is now live on your menu.</p>
          </Banner>
          <Banner tone="warning" title="Low stock">
            <p>You have fewer than 5 portions remaining for today.</p>
          </Banner>
          <Banner tone="critical" title="Payment failed">
            <p>Your last payout could not be processed. Please update your bank details.</p>
          </Banner>
          <Banner tone="info" onDismiss={() => {}}>
            <p>Dismissible banner without a title.</p>
          </Banner>
        </CardContent>
      </Card>

      {/* ========================================
          TOOLTIPS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Tooltips</CardTitle>
          <CardDescription>Hover info on interactive elements</CardDescription>
        </CardHeader>
        <CardContent>
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Hover</p>
            <div className="flex flex-wrap gap-[var(--p-space-400)]">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">Hover me</Button>
                </TooltipTrigger>
                <TooltipContent>This is a tooltip</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">Top tooltip</Button>
                </TooltipTrigger>
                <TooltipContent side="top">Appears above</TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="secondary">Long text</Button>
                </TooltipTrigger>
                <TooltipContent>This tooltip has a longer description that wraps to multiple lines</TooltipContent>
              </Tooltip>
            </div>
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Click</p>
            <div className="flex flex-wrap gap-[var(--p-space-400)]">
              <ClickTooltip>
                <ClickTooltipTrigger asChild>
                  <Button variant="secondary">Click me</Button>
                </ClickTooltipTrigger>
                <ClickTooltipContent>Stays open until you click away</ClickTooltipContent>
              </ClickTooltip>
              <ClickTooltip>
                <ClickTooltipTrigger asChild>
                  <Button variant="secondary">More info</Button>
                </ClickTooltipTrigger>
                <ClickTooltipContent>Click tooltips are useful for mobile or when you need to copy content</ClickTooltipContent>
              </ClickTooltip>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          SPINNERS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Spinners</CardTitle>
          <CardDescription>Loading indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-[var(--p-space-600)]">
            <div className="text-center">
              <Spinner size="small" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">Small</p>
            </div>
            <div className="text-center">
              <Spinner size="large" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">Large</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          AVATARS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Avatars</CardTitle>
          <CardDescription>User and entity representations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-[var(--p-space-400)]">
            <div className="text-center">
              <Avatar size="xs" name="Raja Abu Salameh" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">XS</p>
            </div>
            <div className="text-center">
              <Avatar size="sm" name="Raja Abu Salameh" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">SM</p>
            </div>
            <div className="text-center">
              <Avatar size="md" name="Raja Abu Salameh" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">MD</p>
            </div>
            <div className="text-center">
              <Avatar size="lg" name="Raja Abu Salameh" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">LG</p>
            </div>
            <div className="text-center">
              <Avatar size="xl" name="Raja Abu Salameh" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">XL</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          PAGINATION
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Pagination</CardTitle>
          <CardDescription>Page navigation controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Few Pages</p>
            <Pagination
              currentPage={paginationPage}
              totalPages={5}
              onPageChange={setPaginationPage}
            />
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Many Pages (with ellipsis)</p>
            <Pagination
              currentPage={paginationPage}
              totalPages={20}
              onPageChange={setPaginationPage}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          FILE UPLOAD
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>File Upload</CardTitle>
          <CardDescription>Drop zones and image uploaders</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Generic File Upload</p>
            <FileUpload label="Add file" hint="or drop files to upload" />
          </div>

          <CardDivider />

          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Single Image Upload</p>
            <ImageUpload label="Add dish photo" hint="Accepts .jpg, .png, .webp" />
          </div>

          <CardDivider />

          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Multi Image Upload (with thumbnails + progress)</p>
            <MultiImageUpload
              files={sampleFiles}
              label="Add more images"
              hint="Up to 10 images"
              maxFiles={10}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          DISH CARDS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Dish Cards</CardTitle>
          <CardDescription>Product cards for dish listings — hover for actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-[var(--p-space-400)]">
            {mockDishes.map((dish) => (
              <PolarisDishCard
                key={dish.id}
                dish={dish}
                actions={mockCardActions}
                onCardClick={() => {}}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          BUNDLE CARDS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Bundle Cards</CardTitle>
          <CardDescription>Product cards for bundle listings — hover for actions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[var(--p-space-400)]">
            {mockBundles.map((bundle) => (
              <PolarisBundleCard
                key={bundle.id}
                bundle={bundle}
                actions={mockCardActions}
                onCardClick={() => {}}
              />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          CARDS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Cards</CardTitle>
          <CardDescription>Content containers with Polaris shadow-bevel</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-[var(--p-space-400)]">
            <Card>
              <CardHeader>
                <CardTitle>Basic Card</CardTitle>
                <CardDescription>With header and content</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] text-[var(--p-color-text-secondary)]">Card content goes here. Cards use shadow-100 + bevel-100 for depth.</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Card with Footer</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-[13px] text-[var(--p-color-text-secondary)]">This card has a footer with actions.</p>
              </CardContent>
              <CardDivider />
              <CardFooter>
                <Button variant="default" size="sm">Save</Button>
                <Button variant="tertiary" size="sm">Cancel</Button>
              </CardFooter>
            </Card>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          DATA TABLE
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Data Table</CardTitle>
          <CardDescription>Sortable, selectable data display</CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={[
              { id: "image", header: "", cell: (row: { name: string; image: string; status: string; price: number; orders: number }) => (
                <img src={row.image} alt={row.name} className="size-[2.5rem] rounded-[var(--p-border-radius-200)] object-cover" />
              ), width: "3.5rem", hideOnMobile: true },
              { id: "name", header: "Name", cell: (row: { name: string; image: string; status: string; price: number; orders: number }) => (
                <div className="flex items-center gap-[var(--p-space-200)]">
                  <img src={row.image} alt={row.name} className="size-[2rem] rounded-[var(--p-border-radius-150)] object-cover tablet:hidden" />
                  <span className="font-[var(--p-font-weight-medium)]">{row.name}</span>
                </div>
              ), sortable: true, primary: true },
              { id: "status", header: "Status", cell: (row: { name: string; image: string; status: string; price: number; orders: number }) => <Badge tone={row.status === "Published" ? "success" : "default"}>{row.status}</Badge> },
              { id: "price", header: "Price", cell: (row: { name: string; image: string; status: string; price: number; orders: number }) => `$${row.price.toFixed(2)}`, align: "end", sortable: true },
              { id: "orders", header: "Orders", cell: (row: { name: string; image: string; status: string; price: number; orders: number }) => row.orders, align: "end", sortable: true },
            ]}
            data={[
              { name: "Traditional Shawarma", image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=100&h=100&fit=crop", status: "Published", price: 18.99, orders: 142 },
              { name: "Falafel Wrap", image: "https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=100&h=100&fit=crop", status: "Draft", price: 12.50, orders: 0 },
              { name: "Kunafa", image: "https://images.unsplash.com/photo-1579888944880-d98341245702?w=100&h=100&fit=crop", status: "Published", price: 8.00, orders: 89 },
              { name: "Hummus Bowl", image: "https://images.unsplash.com/photo-1577805947697-89340a0fb498?w=100&h=100&fit=crop", status: "Published", price: 9.99, orders: 56 },
              { name: "Mansaf", image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=100&h=100&fit=crop", status: "Draft", price: 45.00, orders: 0 },
            ]}
            getRowId={(row) => row.name}
            selectable
            selectedRows={selectedTableRows}
            onSelectionChange={setSelectedTableRows}
          />
        </CardContent>
      </Card>

      {/* ========================================
          TOAST
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Toast</CardTitle>
          <CardDescription>Notification messages</CardDescription>
        </CardHeader>
        <CardContent>
          <ToastDemo />
        </CardContent>
      </Card>

      {/* ========================================
          ACTION LIST
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Action List</CardTitle>
          <CardDescription>Dropdown menu of actions — used inside Popovers</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-[var(--p-space-200)]">
            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary">More actions</Button>
              </PopoverTrigger>
              <PopoverContent className="!p-0 w-[14rem]">
                <ActionList
                  items={[
                    { id: "edit", label: "Edit", icon: EditIcon },
                    { id: "publish", label: "Publish", icon: GlobeIcon },
                    { id: "archive", label: "Archive", icon: ArchiveIcon },
                    { id: "delete", label: "Delete", icon: DeleteIcon, destructive: true },
                  ]}
                />
              </PopoverContent>
            </Popover>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="secondary" size="icon">
                  <MenuVerticalIcon className="size-4 fill-current" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="!p-0 w-[16rem]">
                <ActionList
                  sections={[
                    {
                      title: "Actions",
                      items: [
                        { id: "edit", label: "Edit dish", icon: EditIcon, description: "Modify dish details" },
                        { id: "duplicate", label: "Duplicate", icon: ProductIcon },
                      ],
                    },
                    {
                      title: "Danger zone",
                      items: [
                        { id: "delete", label: "Delete dish", icon: DeleteIcon, destructive: true, description: "This cannot be undone" },
                      ],
                    },
                  ]}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          NAVIGATION
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Navigation</CardTitle>
          <CardDescription>App sidebar navigation</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex h-[26rem] rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border)] overflow-hidden">
            <Navigation
              collapsed={navCollapsed}
              onToggleCollapse={() => setNavCollapsed(!navCollapsed)}
              logo={
                <span className="text-[0.875rem] font-[var(--p-font-weight-bold)] text-[var(--p-color-text)]">
                  Yalla Bites
                </span>
              }
              logoCollapsed={
                <div className="size-[2rem] rounded-[var(--p-border-radius-200)] bg-[var(--p-color-bg-fill-brand)] flex items-center justify-center text-white text-[0.75rem] font-[var(--p-font-weight-bold)]">
                  YB
                </div>
              }
              sections={[
                {
                  items: [
                    { id: "home", label: "Home", icon: HomeIcon, active: true },
                    { id: "orders", label: "Orders", icon: OrderIcon, badge: <Badge tone="attention" size="sm">3</Badge> },
                    { id: "dishes", label: "Dishes", icon: FoodIcon },
                    { id: "customers", label: "Customers", icon: PersonIcon },
                  ],
                },
                {
                  title: "Settings",
                  items: [
                    { id: "settings", label: "Settings", icon: SettingsIcon },
                    { id: "account", label: "Account", icon: PersonIcon },
                  ],
                },
              ]}
            />
            {/* Demo content area */}
            <div className="flex-1 bg-[var(--p-color-bg)] p-[var(--p-space-400)] flex items-center justify-center">
              <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">
                Click &quot;Collapse&quot; to toggle sidebar
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          TOP BAR
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Top Bar</CardTitle>
          <CardDescription>App header with search and profile</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-[var(--p-border-radius-300)] border border-[var(--p-color-border)] overflow-hidden">
            <TopBar
              logo={<span className="text-[0.875rem] font-[var(--p-font-weight-bold)]">Yalla Bites</span>}
              search={<Input placeholder="Search..." />}
              actions={
                <Button variant="tertiary" size="icon">
                  <NotificationIcon className="size-5 fill-current" />
                </Button>
              }
              user={{ name: "Raja", avatar: undefined }}
              onUserClick={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          PAGE HEADER
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Page Header</CardTitle>
          <CardDescription>Page title with breadcrumbs and actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div className="rounded-[var(--p-border-radius-200)] border border-[var(--p-color-border)] p-[var(--p-space-400)]">
            <PageHeader
              title="Dishes"
              subtitle="Manage your menu items"
              breadcrumbs={[
                { label: "Home", onClick: () => {} },
                { label: "Dishes" },
              ]}
              primaryAction={<Button variant="default">Add dish</Button>}
              secondaryActions={<Button variant="secondary">Export</Button>}
              badge={<Badge tone="info">24 items</Badge>}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          BREADCRUMB
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Breadcrumb</CardTitle>
          <CardDescription>Navigation trail</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-300)]">
          <Breadcrumb items={[{ label: "Home", onClick: () => {} }, { label: "Dishes" }]} />
          <Breadcrumb items={[{ label: "Home", onClick: () => {} }, { label: "Dishes", onClick: () => {} }, { label: "Traditional Shawarma" }]} />
        </CardContent>
      </Card>

      {/* ========================================
          STATS CARDS
          ======================================== */}
      {/* Stats Cards on gray bg to show contrast */}
      <div className="rounded-[var(--p-border-radius-300)] bg-[var(--p-color-bg)] p-[var(--p-space-500)]">
        <p className="text-[0.8125rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text)] mb-[var(--p-space-300)]">Stats Cards</p>
        <p className="text-[0.75rem] text-[var(--p-color-text-secondary)] mb-[var(--p-space-400)]">Dashboard KPI metrics on page background</p>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[var(--p-space-400)]">
          <StatsCard label="Total Orders" value="1,284" trend={{ value: "12%", direction: "up" }} icon={OrderFilledIcon} helpText="Last 30 days" />
          <StatsCard label="Revenue" value="$24,500" trend={{ value: "8%", direction: "up" }} icon={CashDollarFilledIcon} helpText="Last 30 days" />
          <StatsCard label="Active Dishes" value="18" trend={{ value: "2", direction: "down" }} icon={ProductFilledIcon} helpText="Published on menu" />
        </div>
      </div>

      {/* ========================================
          TAGS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Tags</CardTitle>
          <CardDescription>Removable tags for allergens, ingredients</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Small</p>
            <div className="flex flex-wrap gap-[var(--p-space-150)]">
              <Tag size="sm">Gluten</Tag>
              <Tag size="sm">Dairy</Tag>
              <Tag size="sm" onRemove={() => {}}>Removable</Tag>
            </div>
          </div>
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Default</p>
            <div className="flex flex-wrap gap-[var(--p-space-200)]">
              <Tag>Gluten</Tag>
              <Tag>Dairy</Tag>
              <Tag>Nuts</Tag>
              <Tag onRemove={() => {}}>Removable</Tag>
              <Tag onRemove={() => {}}>Shellfish</Tag>
              <Tag disabled>Disabled</Tag>
            </div>
          </div>
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Large</p>
            <div className="flex flex-wrap gap-[var(--p-space-200)]">
              <Tag size="lg">Gluten Free</Tag>
              <Tag size="lg">Vegan</Tag>
              <Tag size="lg" onRemove={() => {}}>Organic</Tag>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          TIMELINE
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Timeline</CardTitle>
          <CardDescription>Order status history</CardDescription>
        </CardHeader>
        <CardContent>
          <Timeline
            items={[
              { id: "1", title: "Order placed", description: "Customer placed order #1234", timestamp: "Today, 2:30 PM", status: "completed" },
              { id: "2", title: "Payment confirmed", description: "Payment of $45.00 received", timestamp: "Today, 2:31 PM", status: "completed" },
              { id: "3", title: "Preparing", description: "Chef started preparing the order", timestamp: "Today, 2:45 PM", status: "active" },
              { id: "4", title: "Ready for delivery", timestamp: "Pending", status: "pending" },
              { id: "5", title: "Delivered", status: "pending" },
            ]}
          />
        </CardContent>
      </Card>

      {/* ========================================
          COLLAPSIBLE / ACCORDION
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Accordion</CardTitle>
          <CardDescription>Expandable sections</CardDescription>
        </CardHeader>
        <CardContent>
          <Accordion
            items={[
              { id: "1", trigger: <span className="text-[0.8125rem] font-[var(--p-font-weight-semibold)]">How do I add a new dish?</span>, content: <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Navigate to Dishes and click &quot;Add dish&quot;. Fill in the details, upload photos, and set your pricing.</p> },
              { id: "2", trigger: <span className="text-[0.8125rem] font-[var(--p-font-weight-semibold)]">How do I manage orders?</span>, content: <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Go to Orders to see all incoming orders. You can confirm, prepare, and mark them as ready.</p> },
              { id: "3", trigger: <span className="text-[0.8125rem] font-[var(--p-font-weight-semibold)]">How do payouts work?</span>, content: <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Payouts are processed weekly. Your earnings from delivered orders are deposited to your linked bank account.</p> },
            ]}
            defaultOpen={["1"]}
          />
        </CardContent>
      </Card>

      {/* ========================================
          THUMBNAILS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Thumbnails</CardTitle>
          <CardDescription>Small image previews</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-end gap-[var(--p-space-400)]">
            <div className="text-center">
              <Thumbnail source="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=100&h=100&fit=crop" size="small" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)]">Small</p>
            </div>
            <div className="text-center">
              <Thumbnail source="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=100&h=100&fit=crop" size="medium" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)]">Medium</p>
            </div>
            <div className="text-center">
              <Thumbnail source="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=100&h=100&fit=crop" size="large" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)]">Large</p>
            </div>
            <div className="text-center">
              <Thumbnail size="medium" />
              <p className="text-[0.6875rem] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)]">Fallback</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          RESOURCE ITEM
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Resource Item</CardTitle>
          <CardDescription>List rows with image, title, and meta</CardDescription>
        </CardHeader>
        <CardContent className="!p-0">
          <ResourceItem
            image="https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=100&h=100&fit=crop"
            title="Traditional Shawarma Plate"
            subtitle="Main Dishes • Published"
            meta="$18.99"
            onClick={() => {}}
          />
          <ResourceItem
            image="https://images.unsplash.com/photo-1593001872095-7d5b3868fb1d?w=100&h=100&fit=crop"
            title="Falafel Wrap"
            subtitle="Wraps • Draft"
            meta="$12.50"
            onClick={() => {}}
          />
          <ResourceItem
            image={null}
            title="Kunafa"
            subtitle="Desserts • Archived"
            meta="$8.00"
            onClick={() => {}}
          />
        </CardContent>
      </Card>

      {/* ========================================
          DATE PICKER & DIVIDER
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Date Picker &amp; Divider</CardTitle>
          <CardDescription>Date input and visual separators</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Date Only</p>
            <div className="grid grid-cols-2 gap-[var(--p-space-400)]">
              <DatePicker label="Start date" value={startDate} onChange={setStartDate} helpText="When to start the promotion" placeholder="Pick a start date" />
              <DatePicker label="End date" value={endDate} onChange={setEndDate} placeholder="Pick an end date" />
            </div>
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Time Only</p>
            <div className="grid grid-cols-2 gap-[var(--p-space-400)]">
              <TimePicker label="Opening time" hours={timeH} minutes={timeM} onChange={(h, m) => { setTimeH(h); setTimeM(m) }} helpText="When orders start" />
              <TimePicker label="Closing time" hours={22} minutes={0} />
            </div>
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Date + Time Combined</p>
            <div className="grid grid-cols-2 gap-[var(--p-space-400)]">
              <DateTimePicker label="Delivery date & time" value={dateTimeValue} onChange={setDateTimeValue} helpText="When the order should arrive" />
              <DateTimePicker label="Flash sale ends" placeholder="Pick date & time" />
            </div>
          </div>
          <Divider />
          <p className="text-[0.8125rem] text-[var(--p-color-text-secondary)]">Content after the divider</p>
        </CardContent>
      </Card>

      {/* ========================================
          SEARCH BAR
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Search Bar</CardTitle>
          <CardDescription>Global search input with clear button and keyboard shortcut</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-300)]">
          <SearchBar value={searchValue} onChange={setSearchValue} placeholder="Search dishes, orders, customers..." shortcutHint="⌘K" />
          <SearchBar placeholder="Without shortcut hint" />
          <SearchBar value="Shawarma" onChange={() => {}} />
        </CardContent>
      </Card>

      {/* ========================================
          NUMBER INPUT
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Number Input</CardTitle>
          <CardDescription>Stepper with increment/decrement buttons</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-[var(--p-space-400)]">
            <NumberInput label="Quantity" value={quantity} onChange={setQuantity} min={0} max={99} />
            <NumberInput label="Price" value={12.5} prefix="$" step={0.5} min={0} />
            <NumberInput label="Weight" value={250} suffix="g" step={50} min={0} max={1000} />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          TOGGLE GROUP
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Toggle Group</CardTitle>
          <CardDescription>Segmented button controls</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Single Select</p>
            <ToggleGroup
              options={[
                { id: "grid", label: "Grid" },
                { id: "list", label: "List" },
                { id: "table", label: "Table" },
              ]}
              value={toggleValue}
              onChange={(v) => setToggleValue(v as string)}
            />
          </div>
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Sizes</p>
            <div className="flex flex-col gap-[var(--p-space-200)]">
              <ToggleGroup size="sm" options={[{ id: "a", label: "Small" }, { id: "b", label: "Buttons" }]} value="a" onChange={() => {}} />
              <ToggleGroup size="default" options={[{ id: "a", label: "Default" }, { id: "b", label: "Buttons" }]} value="a" onChange={() => {}} />
              <ToggleGroup size="lg" options={[{ id: "a", label: "Large" }, { id: "b", label: "Buttons" }]} value="a" onChange={() => {}} />
            </div>
          </div>
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Full Width</p>
            <ToggleGroup
              fullWidth
              options={[
                { id: "all", label: "All Orders" },
                { id: "active", label: "Active" },
                { id: "completed", label: "Completed" },
              ]}
              value="all"
              onChange={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          COLOR SWATCH
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Color Swatch</CardTitle>
          <CardDescription>Color selection circles</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Default</p>
            <ColorSwatch
              colors={["#303030", "#C70A24", "#047B5D", "#005BD3", "#FFB800", "#8051FF", "#FD4B92"]}
              value={selectedColor}
              onChange={setSelectedColor}
            />
          </div>
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Large</p>
            <ColorSwatch
              size="lg"
              colors={["#FFFFFF", "#F7F7F7", "#E3E3E3", "#B5B5B5", "#616161", "#303030", "#000000"]}
              value="#303030"
              onChange={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          NOTIFICATION CENTER
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Notification Center</CardTitle>
          <CardDescription>Bell icon with dropdown notification list</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-[var(--p-space-400)]">
            <NotificationCenter
              notifications={[
                { id: "1", title: "New order #1234", message: "Customer placed a new order for Traditional Shawarma", timestamp: "2 min ago", icon: OrderIcon },
                { id: "2", title: "Payment received", message: "$45.00 payment confirmed for order #1233", timestamp: "15 min ago", read: true, icon: CashDollarFilledIcon },
                { id: "3", title: "Low stock alert", message: "Falafel Wrap has fewer than 5 portions remaining", timestamp: "1 hour ago", icon: ProductIcon },
              ]}
              onNotificationClick={() => {}}
              onMarkAllRead={() => {}}
            />
            <span className="text-[0.75rem] text-[var(--p-color-text-secondary)]">← Click the bell</span>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          CONFIRM DIALOG
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Confirm Dialog</CardTitle>
          <CardDescription>Pre-built confirmation pattern</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-[var(--p-space-200)]">
            <Button variant="secondary" onClick={() => setConfirmOpen(true)}>Delete dish</Button>
            <ConfirmDialog
              open={confirmOpen}
              onOpenChange={setConfirmOpen}
              title="Delete this dish?"
              message="This will permanently remove Traditional Shawarma Plate from your menu. This action cannot be undone."
              confirmLabel="Delete"
              destructive
              onConfirm={() => {}}
            />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          COPY BUTTON & KBD
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Copy Button &amp; Keyboard Shortcuts</CardTitle>
          <CardDescription>Utility components</CardDescription>
        </CardHeader>
        <CardContent className="space-y-[var(--p-space-400)]">
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Copy Button</p>
            <div className="flex flex-wrap items-center gap-[var(--p-space-200)]">
              <CopyButton text="https://yallabites.com/chef/raja" />
              <CopyButton text="ORDER-1234">Copy Order ID</CopyButton>
            </div>
          </div>
          <CardDivider />
          <div>
            <p className="text-[0.75rem] font-[var(--p-font-weight-semibold)] text-[var(--p-color-text-secondary)] uppercase tracking-wider mb-[var(--p-space-200)]">Keyboard Shortcuts</p>
            <div className="flex flex-wrap items-center gap-[var(--p-space-400)]">
              <span className="flex items-center gap-[var(--p-space-200)] text-[0.8125rem] text-[var(--p-color-text)]">
                Search <Kbd keys={["⌘", "K"]} />
              </span>
              <span className="flex items-center gap-[var(--p-space-200)] text-[0.8125rem] text-[var(--p-color-text)]">
                Save <Kbd keys={["⌘", "S"]} />
              </span>
              <span className="flex items-center gap-[var(--p-space-200)] text-[0.8125rem] text-[var(--p-color-text)]">
                Undo <Kbd keys={["⌘", "Z"]} />
              </span>
              <span className="flex items-center gap-[var(--p-space-200)] text-[0.8125rem] text-[var(--p-color-text)]">
                Escape <Kbd>Esc</Kbd>
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          STATUS DOT
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Status Dot</CardTitle>
          <CardDescription>Tiny colored indicators</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-[var(--p-space-600)]">
            <StatusDot tone="success" label="Online" />
            <StatusDot tone="critical" label="Offline" />
            <StatusDot tone="warning" label="Away" />
            <StatusDot tone="info" label="Busy" />
            <StatusDot tone="neutral" label="Unknown" />
            <StatusDot tone="success" pulse label="Live" />
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          EXPANDABLE TEXT
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Expandable Text</CardTitle>
          <CardDescription>Truncated text with show more/less</CardDescription>
        </CardHeader>
        <CardContent>
          <ExpandableText
            lines={2}
            text="Our Traditional Shawarma Plate is made with tender, slow-roasted chicken marinated in a blend of Middle Eastern spices. Served with fluffy rice, fresh salad, pickled turnips, garlic sauce, and warm pita bread. Each plate is carefully prepared to order using recipes passed down through generations. The meat is seasoned with cumin, turmeric, paprika, and our secret spice blend, then slowly cooked on a vertical rotisserie for hours until perfectly tender and juicy. This dish is a customer favorite and has been featured in numerous food blogs and local publications."
          />
        </CardContent>
      </Card>

      {/* ========================================
          SORTABLE LIST
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Sortable List</CardTitle>
          <CardDescription>Drag to reorder items</CardDescription>
        </CardHeader>
        <CardContent>
          <SortableList
            items={sortableItems}
            onReorder={setSortableItems}
            className="max-w-[20rem]"
          />
        </CardContent>
      </Card>

      {/* ========================================
          SPACING
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Spacing Scale</CardTitle>
          <CardDescription>4px base grid system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-[var(--p-space-200)]">
            {[
              { token: "space-025", value: "1px" },
              { token: "space-050", value: "2px" },
              { token: "space-100", value: "4px" },
              { token: "space-150", value: "6px" },
              { token: "space-200", value: "8px" },
              { token: "space-300", value: "12px" },
              { token: "space-400", value: "16px" },
              { token: "space-500", value: "20px" },
              { token: "space-600", value: "24px" },
              { token: "space-800", value: "32px" },
              { token: "space-1000", value: "40px" },
              { token: "space-1200", value: "48px" },
            ].map((s) => (
              <div key={s.token} className="flex items-center gap-[var(--p-space-300)]">
                <span className="text-[12px] text-[var(--p-color-text-secondary)] w-24 shrink-0">{s.token}</span>
                <div
                  className="h-3 bg-[var(--p-color-bg-fill-emphasis)] rounded-[2px]"
                  style={{ width: `var(--p-${s.token})` }}
                />
                <span className="text-[11px] text-[var(--p-color-text-disabled)]">{s.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          BORDER RADIUS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Border Radius</CardTitle>
          <CardDescription>Corner rounding tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-[var(--p-space-400)]">
            {[
              { token: "050", value: "2px" },
              { token: "100", value: "4px" },
              { token: "150", value: "6px" },
              { token: "200", value: "8px" },
              { token: "300", value: "12px" },
              { token: "400", value: "16px" },
              { token: "500", value: "20px" },
              { token: "full", value: "9999px" },
            ].map((r) => (
              <div key={r.token} className="text-center">
                <div
                  className="w-16 h-16 bg-[var(--p-color-bg-fill-secondary)] border border-[var(--p-color-border)]"
                  style={{ borderRadius: `var(--p-border-radius-${r.token})` }}
                />
                <p className="text-[11px] text-[var(--p-color-text-secondary)] mt-[var(--p-space-100)]">{r.token}</p>
                <p className="text-[10px] text-[var(--p-color-text-disabled)]">{r.value}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* ========================================
          SHADOWS
          ======================================== */}
      <Card>
        <CardHeader>
          <CardTitle>Shadows</CardTitle>
          <CardDescription>Elevation tokens</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-[var(--p-space-600)]">
            {[
              { token: "100", label: "shadow-100" },
              { token: "200", label: "shadow-200" },
              { token: "300", label: "shadow-300" },
              { token: "400", label: "shadow-400" },
              { token: "500", label: "shadow-500" },
              { token: "600", label: "shadow-600" },
            ].map((s) => (
              <div key={s.token} className="text-center">
                <div
                  className="w-20 h-20 bg-[var(--p-color-bg-surface)] rounded-[var(--p-border-radius-200)]"
                  style={{ boxShadow: `var(--p-shadow-${s.token})` }}
                />
                <p className="text-[11px] text-[var(--p-color-text-secondary)] mt-[var(--p-space-200)]">{s.label}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
    </ToastProvider>
  );
}
