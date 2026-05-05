import type { Order } from "@/types/orders.types";

/**
 * Hardcoded fake order for the interactive tutorial.
 * Clearly marked as test data — no production data is created.
 */
export const FAKE_TUTORIAL_ORDER: Order = {
  id: "tutorial-fake-order-001",
  orderNumber: "TEST-0001",
  customerName: "Jane Doe (Test Customer)",
  customerEmail: "test.customer@example.com",
  customerPhone: "+1 (555) 000-0000",
  status: "confirmed",
  fulfillmentMethod: "delivery",
  paymentMethod: "card",
  paymentStatus: "paid",
  createdAt: new Date().toISOString(),
  deliveryDate: new Date(Date.now() + 2 * 60 * 60 * 1000).toISOString(),
  advertisedPickupEta: new Date(
    Date.now() + 1.5 * 60 * 60 * 1000
  ).toISOString(),
  specialInstructions:
    "Please pack the salad dressing on the side. No plastic cutlery needed — thank you!",
  pricing: {
    subtotal: 45.97,
    chefPayout: 38.07,
  },
  total: 45.97,
  items: [
    {
      id: "item-1",
      dishId: "dish-tutorial-1",
      dishName: "Test Dish — Grilled Chicken Shawarma Plate",
      quantity: 2,
      price: 14.99,
      subtotal: 29.98,
      portionSize: "Regular",
      spiceLevel: "medium",
      ingredients: "Chicken thigh, tahini, pickles, garlic sauce, pita bread",
      allergens: ["Sesame", "Gluten"],
      customizations: [
        {
          groupName: "Extras",
          modifiers: [
            { name: "Extra Garlic Sauce", price: 1.5 },
            { name: "Add Hummus", price: 2.0 },
          ],
        },
      ],
    },
    {
      id: "item-2",
      dishId: "dish-tutorial-2",
      dishName: "Test Dish — Fattoush Salad",
      quantity: 1,
      price: 9.99,
      subtotal: 9.99,
      portionSize: "Large",
      spiceLevel: null,
      ingredients:
        "Romaine lettuce, tomato, cucumber, radish, sumac, pita chips",
      allergens: ["Gluten"],
      customizations: [
        {
          groupName: "Dressing",
          modifiers: [{ name: "Lemon Vinaigrette on the Side", price: 0 }],
        },
      ],
    },
    {
      id: "item-3",
      dishId: "dish-tutorial-3",
      dishName: "Test Dish — Baklava Bites (6 pcs)",
      quantity: 1,
      price: 5.99,
      subtotal: 5.99,
      portionSize: null,
      spiceLevel: null,
      ingredients: "Phyllo dough, pistachios, sugar syrup, butter",
      allergens: ["Nuts", "Dairy", "Gluten"],
    },
  ],
  statusHistory: [
    {
      status: "confirmed",
      previousStatus: "paid",
      changedAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
      reason: null,
      changedBy: {
        email: "chef@example.com",
        id: "chef-1",
        name: "You (Chef)",
        role: "chef",
      },
    },
    {
      status: "paid",
      previousStatus: "pending",
      changedAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
      reason: null,
      changedBy: {
        email: "system@yallabites.com",
        id: "system",
        name: "System",
        role: "system",
      },
    },
  ],
  deliveryAddress: {
    street: "123 Test Street",
    apartment: "Apt 4B",
    city: "San Francisco",
    state: "CA",
    zipCode: "94102",
    country: "US",
    instructions: "Ring the doorbell twice",
  },
};

/** localStorage key for tracking tutorial completion */
export const TUTORIAL_STORAGE_KEY = "yb-order-tutorial-completed";
