/* ================================================================== */
/*  Centralized Mock Data — Single Source of Truth                     */
/*  Change a price here and it updates across every page.             */
/* ================================================================== */

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

export type DishStatus = "published" | "draft" | "archived";

export interface Dish {
  id: string;
  name: string;
  price: number;
  description: string;
  image: string;
  category: string;
  cuisine: string;
  status: DishStatus;
  rating: number;
}

export type OrderStatus =
  | "paid"
  | "confirmed"
  | "preparing"
  | "ready"
  | "readyForPickup"
  | "outForDelivery"
  | "delivered"
  | "pickedUp"
  | "rescheduling"
  | "cancelled"
  | "rejected";

export type Urgency = "overdue" | "due-soon" | null;

export interface OrderItem {
  qty: number;
  name: string;
}

export interface Order {
  hash: string;
  /** Numeric order ID (e.g. 1042). Used by order detail page. */
  orderId: number;
  customer: string;
  items: OrderItem[];
  method: "delivery" | "pickup";
  date: string;
  time?: string;
  price: string;
  payout: string;
  status: OrderStatus;
  cancelNote?: string;
  readyBy?: string;
  urgency?: Urgency;
}

export interface Review {
  id: number;
  initials: string;
  name: string;
  rating: number;
  date: string;
  text: string;
  dishName?: string;
  reply: { name: string; text: string; time: string } | null;
}

export interface DishReviewGroup {
  dishId: string;
  name: string;
  rating: number;
  count: number;
  reviews: { initials: string; name: string; rating: number; text: string; date: string }[];
}

export interface BundleReviewGroup {
  name: string;
  rating: number;
  count: number;
  reviews: { initials: string; name: string; rating: number; text: string; date: string }[];
}

export interface ChefProfile {
  name: string;
  businessName: string;
  tagline: string;
  bio: string;
  story: string;
  inspires: string;
  experience: string;
  cuisines: string[];
  avatar: string;
  banner: string;
}

export type SaleStatus = "live" | "upcoming" | "draft" | "past";

export interface FlashSale {
  id: string;
  name: string;
  status: SaleStatus;
  items: string[];
  orderCount?: number;
  revenue?: number;
  orderOpen?: string;
  orderClose?: string;
  fulfillmentLabel?: string;
  pickupWindow?: string;
  deliveryWindow?: string;
  countdown?: string;
  soldOutNote?: string;
}

export interface Transaction {
  date: string;
  desc: string;
  amount: string;
  type: "order" | "payout" | "fee";
}

export interface Bundle {
  id: number;
  name: string;
  image: string;
  items: number;
  price: number;
  status: "published" | "draft" | "archived";
}

export interface MenuSection {
  id: number;
  name: string;
  dishCount: number;
  active: boolean;
}

/* ------------------------------------------------------------------ */
/*  Dishes — canonical source (11 items)                               */
/*  Menu page is the authority for prices and details.                 */
/* ------------------------------------------------------------------ */
export const dishes: Dish[] = [
  {
    id: "mansaf",
    name: "Homemade Mansaf",
    price: 28,
    description: "Traditional Jordanian lamb cooked in fermented dried yogurt (jameed) and served on a bed of rice.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
    category: "Main Dishes",
    cuisine: "Jordanian",
    status: "published",
    rating: 5.0,
  },
  {
    id: "knafeh",
    name: "Pistachio Knafeh",
    price: 18,
    description: "Crispy shredded phyllo filled with sweet cheese, soaked in orange blossom syrup and topped with pistachios.",
    image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&h=450&fit=crop",
    category: "Desserts",
    cuisine: "Palestinian",
    status: "published",
    rating: 4.8,
  },
  {
    id: "baklava",
    name: "Walnut Baklava",
    price: 14,
    description: "Layers of flaky phyllo dough filled with chopped walnuts and sweetened with syrup.",
    image: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop",
    category: "Desserts",
    cuisine: "Turkish",
    status: "published",
    rating: 4.2,
  },
  {
    id: "shawarma",
    name: "Chicken Shawarma",
    price: 16,
    description: "Marinated chicken shaved from a rotating spit, served with garlic sauce and pickled turnips.",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop",
    category: "Main Dishes",
    cuisine: "Lebanese",
    status: "published",
    rating: 4.9,
  },
  {
    id: "hummus",
    name: "Smoky Hummus",
    price: 10,
    description: "Fire-roasted chickpea dip with smoky charred garlic, tahini, and a drizzle of olive oil.",
    image: "https://images.unsplash.com/photo-1577805947697-89e18249d767?w=600&h=450&fit=crop",
    category: "Appetizers",
    cuisine: "Middle Eastern",
    status: "draft",
    rating: 4.6,
  },
  {
    id: "falafel",
    name: "Crispy Falafel",
    price: 12,
    description: "Herb-packed chickpea fritters fried until golden and served with tahini sauce.",
    image: "https://images.unsplash.com/photo-1593001874117-c99c800e3eb7?w=600&h=450&fit=crop",
    category: "Appetizers",
    cuisine: "Egyptian",
    status: "published",
    rating: 4.7,
  },
  {
    id: "tabouleh",
    name: "Tabouleh Salad",
    price: 11,
    description: "Fresh parsley and bulgur wheat salad with tomatoes, mint, lemon, and olive oil.",
    image: "https://images.unsplash.com/photo-1505253716362-afaea1d3d1af?w=600&h=450&fit=crop",
    category: "Salads",
    cuisine: "Lebanese",
    status: "draft",
    rating: 4.5,
  },
  {
    id: "mandi",
    name: "Chicken Mandi",
    price: 22,
    description: "Yemeni-style smoked chicken and rice cooked in a tandoor oven with aromatic spices.",
    image: "https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=600&h=450&fit=crop",
    category: "Main Dishes",
    cuisine: "Yemeni",
    status: "archived",
    rating: 4.4,
  },
  {
    id: "fattoush",
    name: "Garden Fattoush",
    price: 10,
    description: "Levantine salad with crispy pita chips, mixed greens, and tangy sumac dressing.",
    image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop",
    category: "Salads",
    cuisine: "Lebanese",
    status: "published",
    rating: 4.6,
  },
  {
    id: "kibbeh",
    name: "Lamb Kibbeh",
    price: 16,
    description: "Crispy bulgur shells stuffed with spiced lamb, pine nuts, and caramelized onions.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
    category: "Appetizers",
    cuisine: "Syrian",
    status: "published",
    rating: 4.8,
  },
  {
    id: "manaqish",
    name: "Manaqish",
    price: 8,
    description: "Lebanese flatbread topped with za'atar and olive oil, baked in a wood-fired oven.",
    image: "https://images.unsplash.com/photo-1529006557810-274b9b2fc783?w=600&h=450&fit=crop",
    category: "Bakery",
    cuisine: "Lebanese",
    status: "draft",
    rating: 4.3,
  },
];

/* Helper to look up a dish by ID */
export function getDish(id: string): Dish | undefined {
  return dishes.find((d) => d.id === id);
}

/* ------------------------------------------------------------------ */
/*  Orders — 12 items, canonical hash IDs from orders page             */
/*  orderId maps to the detail page's numeric IDs (1040-1042)          */
/* ------------------------------------------------------------------ */
export const orders: Order[] = [
  {
    hash: "#a8f2c1",
    orderId: 1042,
    customer: "Sarah K.",
    items: [
      { qty: 2, name: "Mansaf" },
      { qty: 1, name: "Baklava" },
    ],
    method: "delivery",
    date: "Today",
    time: "2:30 PM",
    price: "$49.00",
    payout: "$45.20",
    status: "paid",
    readyBy: "6:30 PM",
    urgency: "due-soon",
  },
  {
    hash: "#b3d4e7",
    orderId: 1041,
    customer: "Marcus T.",
    items: [
      { qty: 1, name: "Falafel Wrap" },
      { qty: 1, name: "Hummus" },
    ],
    method: "delivery",
    date: "Today",
    time: "3:15 PM",
    price: "$26.50",
    payout: "$22.10",
    status: "confirmed",
    readyBy: "7:00 PM",
  },
  {
    hash: "#c9e1f3",
    orderId: 1040,
    customer: "Priya R.",
    items: [{ qty: 1, name: "Knafeh" }],
    method: "pickup",
    date: "Today",
    time: "1:55 PM",
    price: "$18.00",
    payout: "$16.50",
    status: "preparing",
    readyBy: "5:15 PM",
    urgency: "overdue",
  },
  {
    hash: "#d2f4a8",
    orderId: 1039,
    customer: "Jordan L.",
    items: [{ qty: 3, name: "Shawarma" }],
    method: "pickup",
    date: "Today",
    time: "3:02 PM",
    price: "$48.00",
    payout: "$44.10",
    status: "ready",
  },
  {
    hash: "#e5g7b9",
    orderId: 1038,
    customer: "Layla M.",
    items: [
      { qty: 1, name: "Mandi" },
      { qty: 1, name: "Tabouleh" },
    ],
    method: "delivery",
    date: "Yesterday",
    price: "$33.00",
    payout: "",
    status: "cancelled",
    cancelNote: "by customer",
  },
  {
    hash: "#f8h2c4",
    orderId: 1037,
    customer: "Daniel B.",
    items: [{ qty: 1, name: "Family Dinner Bundle" }],
    method: "pickup",
    date: "Yesterday",
    price: "$65.00",
    payout: "$59.80",
    status: "delivered",
  },
  {
    hash: "#g1j3d5",
    orderId: 1036,
    customer: "Amina H.",
    items: [
      { qty: 2, name: "Baklava" },
      { qty: 1, name: "Hummus" },
    ],
    method: "delivery",
    date: "May 2",
    price: "$28.00",
    payout: "$25.40",
    status: "pickedUp",
  },
  {
    hash: "#h4k6e7",
    orderId: 1035,
    customer: "Omar S.",
    items: [{ qty: 1, name: "Mansaf (Full Tray)" }],
    method: "delivery",
    date: "May 2",
    price: "$100.00",
    payout: "$92.00",
    status: "paid",
    readyBy: "8:00 AM",
  },
  {
    hash: "#i7l9f8",
    orderId: 1034,
    customer: "Nadia K.",
    items: [{ qty: 4, name: "Falafel" }],
    method: "pickup",
    date: "May 1",
    price: "$36.00",
    payout: "$33.20",
    status: "delivered",
  },
  {
    hash: "#j2m4g1",
    orderId: 1033,
    customer: "Rami A.",
    items: [
      { qty: 1, name: "Mansaf" },
      { qty: 2, name: "Knafeh" },
    ],
    method: "delivery",
    date: "May 1",
    price: "$64.00",
    payout: "$58.80",
    status: "delivered",
  },
  {
    hash: "#k5n7h3",
    orderId: 1032,
    customer: "Fatima Z.",
    items: [{ qty: 1, name: "Bundle: Weekly Prep" }],
    method: "delivery",
    date: "Apr 30",
    price: "$75.00",
    payout: "$69.00",
    status: "rejected",
  },
  {
    hash: "#l8p2i5",
    orderId: 1031,
    customer: "Hassan W.",
    items: [
      { qty: 2, name: "Shawarma" },
      { qty: 1, name: "Tabouleh" },
    ],
    method: "pickup",
    date: "Apr 30",
    price: "$43.00",
    payout: "$39.50",
    status: "delivered",
  },
];

/** Look up an order by its numeric ID (e.g. 1042) */
export function getOrderByNumericId(id: number): Order | undefined {
  return orders.find((o) => o.orderId === id);
}

/** Look up an order by its hash (e.g. "#a8f2c1") */
export function getOrderByHash(hash: string): Order | undefined {
  return orders.find((o) => o.hash === hash || o.hash === `#${hash}`);
}

/* ------------------------------------------------------------------ */
/*  Reviews — mixed ratings for meaningful distribution                */
/*  Avg ~4.8 to match dashboard and store-preview                     */
/* ------------------------------------------------------------------ */
export const reviews: Review[] = [
  {
    id: 1,
    initials: "SK",
    name: "Sarah K.",
    rating: 5,
    date: "3 days ago",
    text: "Amira's mansaf is the best I've had outside of Jordan. The jameed sauce is perfectly tangy and the lamb falls right off the bone. Already planning my next order!",
    dishName: "Homemade Mansaf",
    reply: null,
  },
  {
    id: 2,
    initials: "MT",
    name: "Marcus T.",
    rating: 5,
    date: "1 week ago",
    text: "First time trying knafeh and now I'm hooked. The cheese pull was incredible, and that syrup was just the right amount of sweet. Outstanding.",
    dishName: "Pistachio Knafeh",
    reply: null,
  },
  {
    id: 3,
    initials: "PR",
    name: "Priya R.",
    rating: 4,
    date: "2 weeks ago",
    text: "Loved everything but baklava was a bit dry compared to last time. Still delicious overall. Will keep ordering!",
    dishName: "Walnut Baklava",
    reply: null,
  },
  {
    id: 4,
    initials: "JL",
    name: "Jordan L.",
    rating: 5,
    date: "3 weeks ago",
    text: "Picked up for family dinner, everyone went back for seconds. The hummus and shawarma were a huge hit. Thank you Amira!",
    dishName: "Chicken Shawarma",
    reply: {
      name: "Yalla Kitchen by Amira",
      text: "So glad your family enjoyed it!",
      time: "2 weeks ago",
    },
  },
  {
    id: 5,
    initials: "AW",
    name: "Alex W.",
    rating: 5,
    date: "1 month ago",
    text: "Incredible lamb and the rice was perfectly spiced. Best home-cooked meal delivery I've ever had.",
    dishName: "Homemade Mansaf",
    reply: null,
  },
  {
    id: 6,
    initials: "LM",
    name: "Lisa M.",
    rating: 5,
    date: "1 month ago",
    text: "Perfect portion for two. Romantic dinner sorted! The falafel was crispy on the outside and fluffy inside.",
    dishName: "Crispy Falafel",
    reply: null,
  },
];

/* Derived: average rating from reviews */
export const averageRating = +(
  reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
).toFixed(1);

/* Derived: rating breakdown for the bar chart */
export const ratingBreakdown = [5, 4, 3, 2, 1].map((stars) => {
  const count = reviews.filter((r) => r.rating === stars).length;
  const pct = reviews.length > 0 ? Math.round((count / reviews.length) * 100) : 0;
  return { stars, count, pct };
});

/* Dish-level review aggregations */
export const dishReviews: DishReviewGroup[] = [
  {
    dishId: "mansaf",
    name: "Homemade Mansaf",
    rating: 5.0,
    count: 8,
    reviews: [
      { initials: "SK", name: "Sarah K.", rating: 5, text: "Best mansaf I've had outside of Jordan.", date: "3 days ago" },
      { initials: "AW", name: "Alex W.", rating: 5, text: "Incredible lamb and the rice was perfectly spiced.", date: "1 month ago" },
    ],
  },
  {
    dishId: "knafeh",
    name: "Pistachio Knafeh",
    rating: 4.8,
    count: 5,
    reviews: [
      { initials: "MT", name: "Marcus T.", rating: 5, text: "The cheese pull was incredible.", date: "1 week ago" },
    ],
  },
  {
    dishId: "baklava",
    name: "Walnut Baklava",
    rating: 4.2,
    count: 4,
    reviews: [
      { initials: "PR", name: "Priya R.", rating: 4, text: "Loved everything but a bit dry this time.", date: "2 weeks ago" },
    ],
  },
];

/* Bundle-level review aggregations */
export const bundleReviews: BundleReviewGroup[] = [
  {
    name: "Family Feast Bundle",
    rating: 4.9,
    count: 6,
    reviews: [
      { initials: "JL", name: "Jordan L.", rating: 5, text: "Everyone went back for seconds.", date: "3 weeks ago" },
    ],
  },
  {
    name: "Date Night Bundle",
    rating: 4.7,
    count: 3,
    reviews: [
      { initials: "LM", name: "Lisa M.", rating: 5, text: "Perfect portion for two. Romantic dinner sorted!", date: "1 week ago" },
    ],
  },
];

/* ------------------------------------------------------------------ */
/*  Chef Profile                                                       */
/* ------------------------------------------------------------------ */
export const chefProfile: ChefProfile = {
  name: "Amira",
  businessName: "Yalla Kitchen",
  tagline: "Authentic Palestinian home cooking",
  bio: "Every dish is made fresh to order with love, using recipes passed down through generations.",
  story: "I grew up watching my mother and grandmother cook for our family. Their recipes tell the story of our heritage.",
  inspires: "The joy on people's faces when they taste food that reminds them of home.",
  experience: "5",
  cuisines: ["Palestinian", "Lebanese", "Jordanian", "Iraqi"],
  avatar: "https://images.unsplash.com/photo-1607631568010-a87245c0daf8?w=200&h=200&fit=crop",
  banner: "https://images.unsplash.com/photo-1466637574441-749b8f19452f?w=1600&h=600&fit=crop",
};

/* ------------------------------------------------------------------ */
/*  Flash Sales                                                        */
/* ------------------------------------------------------------------ */
export const flashSales: FlashSale[] = [
  {
    id: "fs-1",
    name: "Weekend Special",
    status: "live",
    items: ["Mansaf", "Knafeh", "Shawarma"],
    orderCount: 23,
    revenue: 847,
    orderClose: "Sat 8 PM",
    pickupWindow: "Sat 12-4 PM",
    deliveryWindow: "Sat 5-8 PM",
    countdown: "6h 32m",
  },
  {
    id: "fs-2",
    name: "Meal Prep Monday",
    status: "upcoming",
    items: ["7-Meal Weekly Bundle", "Family Dinner"],
    orderOpen: "Sun 6 PM",
    orderClose: "Mon 11 PM",
    fulfillmentLabel: "Wed 10 AM - 2 PM",
    countdown: "2d 4h",
  },
  {
    id: "fs-3",
    name: "Eid Special Menu",
    status: "draft",
    items: ["Lamb Ouzi", "Kunafa Rolls", "Date Truffles"],
  },
  {
    id: "fs-4",
    name: "Last Weekend",
    status: "past",
    items: ["Shawarma", "Falafel", "Hummus", "Knafeh"],
    orderCount: 45,
    revenue: 1650,
    soldOutNote: "Sold out in 3 hours",
  },
  {
    id: "fs-5",
    name: "Mother's Day Special",
    status: "past",
    items: ["Mansaf", "Baklava", "Rose Lemonade"],
    orderCount: 32,
    revenue: 1200,
  },
];

/* Available dishes for flash sale creation — derived from dishes array */
export const flashSaleAvailableDishes = [
  ...dishes
    .filter((d) => d.status === "published")
    .map((d) => ({ id: d.id, name: d.name, basePrice: d.price })),
  { id: "bundle-weekly", name: "7-Meal Weekly Bundle", basePrice: 89 },
  { id: "bundle-family", name: "Family Dinner Bundle", basePrice: 65 },
];

/* ------------------------------------------------------------------ */
/*  Bundles                                                            */
/* ------------------------------------------------------------------ */
export const bundles: Bundle[] = [
  { id: 1, name: "Family Dinner for 4", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop", items: 5, price: 65, status: "published" },
  { id: 2, name: "Weekly Meal Prep", image: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop", items: 7, price: 75, status: "published" },
  { id: 3, name: "Mezze Tasting Plate", image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop", items: 4, price: 42, status: "draft" },
  { id: 4, name: "Sweet Tooth Box", image: "https://images.unsplash.com/photo-1598110750624-207050c4f28c?w=600&h=450&fit=crop", items: 3, price: 32, status: "published" },
];

/* ------------------------------------------------------------------ */
/*  Menu Sections                                                      */
/* ------------------------------------------------------------------ */
export const menuSections: MenuSection[] = [
  { id: 1, name: "Ramadan Specials", dishCount: 5, active: true },
  { id: 2, name: "Weekly Specials", dishCount: 3, active: true },
  { id: 3, name: "Catering Menu", dishCount: 8, active: true },
  { id: 4, name: "Limited Time", dishCount: 2, active: false },
];

/* ------------------------------------------------------------------ */
/*  Menu categories                                                    */
/* ------------------------------------------------------------------ */
export const menuCategories = [
  { label: "All", emoji: "" },
  { label: "Appetizers", emoji: "\u{1F951}" },
  { label: "Main Dishes", emoji: "\u{1F356}" },
  { label: "Soups", emoji: "\u{1F372}" },
  { label: "Salads", emoji: "\u{1F957}" },
  { label: "Bakery", emoji: "\u{1F35E}" },
  { label: "Pastries", emoji: "\u{1F353}" },
  { label: "Desserts", emoji: "\u{1F370}" },
  { label: "Coffee", emoji: "\u2615" },
  { label: "Drinks", emoji: "\u{1F37A}" },
];

/* ------------------------------------------------------------------ */
/*  Transactions — derived from orders for the payments page           */
/* ------------------------------------------------------------------ */
export const transactions: Transaction[] = [
  { date: "May 2, 2026", desc: `Order #${orders[0].orderId} - ${orders[0].customer}`, amount: "+$48.00", type: "order" },
  { date: "May 1, 2026", desc: `Order #${orders[1].orderId} - ${orders[1].customer}`, amount: "+$36.00", type: "order" },
  { date: "Apr 30, 2026", desc: "Weekly payout", amount: "-$342.00", type: "payout" },
  { date: "Apr 29, 2026", desc: "Platform fee - Week of Apr 21", amount: "-$18.40", type: "fee" },
  { date: "Apr 28, 2026", desc: `Order #${orders[4].orderId} - ${orders[4].customer}`, amount: "+$64.00", type: "order" },
];

/* ------------------------------------------------------------------ */
/*  Dashboard derived data                                             */
/* ------------------------------------------------------------------ */
export const dashboardStats = [
  {
    label: "Orders This Month",
    value: "47",
    delta: "\u219112% vs last month",
    positive: true,
  },
  {
    label: "Revenue This Month",
    value: "$2,184",
    delta: "\u21918% vs last month",
    positive: true,
  },
  {
    label: "Active Dishes",
    value: String(dishes.filter((d) => d.status === "published").length),
    delta: `${dishes.filter((d) => d.status === "draft").length} drafts`,
    positive: null as boolean | null,
  },
  {
    label: "Avg Rating",
    value: String(averageRating),
    delta: `from ${reviews.length} reviews`,
    positive: null as boolean | null,
  },
];

/** The 3 most recent orders, used on the dashboard */
export const recentOrders = orders.slice(0, 3);

/* ------------------------------------------------------------------ */
/*  Order detail data (used by /orders/[id])                           */
/*  Keyed by numeric orderId for direct lookup.                        */
/* ------------------------------------------------------------------ */
export interface OrderDetailData {
  orderHash: string;
  orderId?: number;
  orderStatus: "paid" | "confirmed" | "preparing" | "ready";
  orderMethod: "delivery" | "pickup";
  items: {
    name: string;
    qty: number;
    portion: string;
    customizations: { label: string; value: string }[];
    price: string;
    image: string;
  }[];
  customer: {
    name: string;
    avatar: string;
    phone: string;
    email: string;
    address: string;
    mapsQuery: string;
  };
  timeline: { time: string; label: string; done: boolean }[];
  readyBy: string;
  readyIn: string;
  subtotal: string;
  platformFee: string;
  delivery: string;
  total: string;
  payout: string;
}

export const orderDetails: Record<string, OrderDetailData> = {
  "1042": {
    orderHash: "#a8f2c1",
    orderId: 1042,
    orderStatus: "paid",
    orderMethod: "delivery",
    items: [
      {
        name: "Lamb Kibbeh",
        qty: 2,
        portion: "Regular",
        customizations: [
          { label: "SPICE", value: "Medium" },
          { label: "EXTRAS", value: "Extra tahini" },
        ],
        price: "$32.00",
        image: "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=450&fit=crop",
      },
      {
        name: "Garden Fattoush",
        qty: 1,
        portion: "Large",
        customizations: [],
        price: "$12.00",
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&h=450&fit=crop",
      },
    ],
    customer: {
      name: "Sarah Khan",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
      phone: "+14695550142",
      email: "sarah.khan@email.com",
      address: "742 Evergreen Terrace, Springfield",
      mapsQuery: "742+Evergreen+Terrace+Springfield",
    },
    timeline: [
      { time: "2:14 PM", label: "Order placed by Sarah Khan", done: true },
      { time: "\u2014", label: "Awaiting confirmation", done: false },
    ],
    readyBy: "Today 6:30 PM",
    readyIn: "In 3h 45m",
    subtotal: "$44.00",
    platformFee: "$4.40",
    delivery: "$4.99",
    total: "$53.39",
    payout: "$43.60",
  },
  "1041": {
    orderHash: "#b3d4e7",
    orderId: 1041,
    orderStatus: "preparing",
    orderMethod: "pickup",
    items: [
      {
        name: "Chicken Shawarma",
        qty: 1,
        portion: "Plate",
        customizations: [
          { label: "SPICE", value: "Hot" },
          { label: "EXTRAS", value: "Extra garlic sauce" },
        ],
        price: `$${getDish("shawarma")!.price}.00`,
        image: getDish("shawarma")!.image,
      },
      {
        name: "Smoky Hummus",
        qty: 1,
        portion: "Regular",
        customizations: [],
        price: `$${getDish("hummus")!.price}.00`,
        image: getDish("hummus")!.image,
      },
    ],
    customer: {
      name: "Marcus Thompson",
      avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      phone: "+14695550199",
      email: "marcus.t@email.com",
      address: "1200 Main St, Dallas",
      mapsQuery: "1200+Main+St+Dallas",
    },
    timeline: [
      { time: "1:30 PM", label: "Order placed by Marcus Thompson", done: true },
      { time: "1:32 PM", label: "Order confirmed", done: true },
      { time: "1:45 PM", label: "Preparing started", done: true },
      { time: "\u2014", label: "Next step pending", done: false },
    ],
    readyBy: "Today 2:30 PM",
    readyIn: "In 45m",
    subtotal: "$26.00",
    platformFee: "$2.60",
    delivery: "$0.00",
    total: "$28.60",
    payout: "$23.40",
  },
  "1040": {
    orderHash: "#c9e1f3",
    orderId: 1040,
    orderStatus: "ready",
    orderMethod: "pickup",
    items: [
      {
        name: "Pistachio Knafeh",
        qty: 1,
        portion: "Whole",
        customizations: [{ label: "EXTRAS", value: "Extra syrup on side" }],
        price: `$${getDish("knafeh")!.price}.00`,
        image: getDish("knafeh")!.image,
      },
    ],
    customer: {
      name: "Priya Ramirez",
      avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop",
      phone: "+14695550177",
      email: "priya.r@email.com",
      address: "890 Oak Lane, Plano",
      mapsQuery: "890+Oak+Lane+Plano",
    },
    timeline: [
      { time: "11:00 AM", label: "Order placed by Priya Ramirez", done: true },
      { time: "11:02 AM", label: "Order confirmed", done: true },
      { time: "11:30 AM", label: "Preparing started", done: true },
      { time: "12:15 PM", label: "Marked ready for pickup", done: true },
    ],
    readyBy: "Ready now",
    readyIn: "Awaiting pickup",
    subtotal: "$18.00",
    platformFee: "$1.80",
    delivery: "$0.00",
    total: "$19.80",
    payout: "$16.20",
  },
};

/* Default fallback order data — used when navigating via hash ID */
export const defaultOrderDetail: OrderDetailData = {
  orderHash: "#a8f2c1",
  orderId: 1042,
  orderStatus: "paid",
  orderMethod: "delivery",
  items: [
    {
      name: "Homemade Mansaf",
      qty: 2,
      portion: "Family Size",
      customizations: [
        { label: "SPICE", value: "Medium" },
        { label: "EXTRAS", value: "Extra pine nuts" },
      ],
      price: `$${getDish("mansaf")!.price}.00`,
      image: getDish("mansaf")!.image,
    },
    {
      name: "Walnut Baklava",
      qty: 1,
      portion: "Box of 12",
      customizations: [{ label: "EXTRAS", value: "Extra syrup" }],
      price: `$${getDish("baklava")!.price}.00`,
      image: getDish("baklava")!.image,
    },
  ],
  customer: {
    name: "Sarah Khan",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
    phone: "+14695550142",
    email: "sarah.khan@email.com",
    address: "742 Evergreen Terrace, Springfield",
    mapsQuery: "742+Evergreen+Terrace+Springfield",
  },
  timeline: [
    { time: "2:30 PM", label: "Order placed by Sarah Khan", done: true },
    { time: "2:32 PM", label: "Order confirmed", done: true },
    { time: "2:45 PM", label: "Preparing started", done: true },
    { time: "\u2014", label: "Next step pending", done: false },
  ],
  readyBy: "Today 6:30 PM",
  readyIn: "In 3h 45m",
  subtotal: "$46.00",
  platformFee: "$4.60",
  delivery: "$4.99",
  total: "$55.59",
  payout: "$45.20",
};

/** Look up order detail by either numeric ID or hash prefix */
export function getOrderDetail(idOrHash: string): OrderDetailData {
  // Try numeric ID first
  if (orderDetails[idOrHash]) return orderDetails[idOrHash];

  // Try to find by matching an order's hash prefix
  const matchedOrder = orders.find(
    (o) => o.hash.replace("#", "").startsWith(idOrHash)
  );
  if (matchedOrder && orderDetails[String(matchedOrder.orderId)]) {
    return orderDetails[String(matchedOrder.orderId)];
  }

  return defaultOrderDetail;
}

/* ------------------------------------------------------------------ */
/*  All available cuisines (for profile page dropdown)                 */
/* ------------------------------------------------------------------ */
export const allCuisines = [
  "Palestinian", "Lebanese", "Jordanian", "Iraqi", "Syrian", "Egyptian",
  "Moroccan", "Turkish", "Persian", "Indian", "Mexican", "Italian",
];
