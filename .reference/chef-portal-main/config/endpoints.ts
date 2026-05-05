const buildApiPath = (path: string): string => {
  const cleanPath = path.startsWith("/") ? path.slice(1) : path;
  return `/api/v1/${cleanPath}`;
};

export const endpoints = {
  auth: {
    me: buildApiPath("auth/me"),
  },

  userAccount: {
    base: buildApiPath("chef-portal/user"),
    get: buildApiPath("chef-portal/user"),
    update: buildApiPath("chef-portal/user"),
    changePassword: buildApiPath("user/account/change-password"),
    forceUnlock: buildApiPath("user/account/force-unlock"),
  },

  // Dishes endpoints
  dishes: {
    base: buildApiPath("dishes/me"),
    getById: (id: string) => buildApiPath(`chef-portal/dishes/${id}`),
    create: buildApiPath("chef-portal/dishes"),
    update: (id: string) => buildApiPath(`chef-portal/dishes/${id}`),
    delete: (id: string) => buildApiPath(`chef-portal/dishes/${id}`),
  },

  // Media endpoints
  media: {
    base: buildApiPath("chef-portal/media"),
    getPresignedUrl: buildApiPath("upload/presigned-url"),
    createDishMedia: "/api/dish-media",
    deleteDishMedia: (id: string) => `/api/dish-media/${id}`,
    createChefMedia: "/api/chef-media",
    deleteChefMedia: (id: string) => `/api/chef-media/${id}`,
    createTargetMedia: buildApiPath("chef-portal/target-media"),
    deleteTargetMedia: (id: string) =>
      buildApiPath(`chef-portal/target-media/${id}`),
  },

  categories: {
    base: buildApiPath("chef-portal/categories"),
  },

  cuisines: {
    base: buildApiPath("chef-portal/cuisines"),
  },

  dishTemplates: {
    base: buildApiPath("chef-portal/dish-templates"),
    getById: (id: string) => buildApiPath(`chef-portal/dish-templates/${id}`),
  },

  chefProfile: {
    base: buildApiPath("chefs/me"),
    get: buildApiPath("chefs/me"),
    update: buildApiPath("chefs/me"),
  },

  addresses: {
    base: buildApiPath("chef-portal/addresses"),
    create: buildApiPath("chef-portal/addresses"),
    update: (id: string) => buildApiPath(`chef-portal/addresses/${id}`),
  },

  orders: {
    base: buildApiPath("chef-portal/orders"),
    list: buildApiPath("chef-portal/orders"),
    get: (id: string) => buildApiPath(`chef-portal/orders/${id}`),
    updateStatus: (id: string) =>
      buildApiPath(`chef-portal/orders/${id}/status`),
    action: (id: string) => buildApiPath(`chef-portal/orders/${id}/action`),
    cancel: (id: string) => buildApiPath(`orders/${id}/cancel`),
    reschedule: (id: string) => buildApiPath(`orders/${id}/reschedule`),
    delete: (id: string) => buildApiPath(`chef-portal/orders/${id}`),
    shippingRates: (id: string) =>
      buildApiPath(`orders/${id}/shipping-rates`),
    selectRate: (id: string) => buildApiPath(`orders/${id}/select-rate`),
    purchaseLabel: (id: string) =>
      buildApiPath(`orders/${id}/purchase-label`),
    pickedUp: (id: string) => buildApiPath(`orders/${id}/picked-up`),
  },

  reviews: {
    list: buildApiPath("reviews"),
  },

  customMenuSections: {
    base: buildApiPath("chef-portal/custom-sections"),
    list: buildApiPath("chef-portal/custom-sections"),
    get: (id: string) => buildApiPath(`chef-portal/custom-sections/${id}`),
    create: buildApiPath("chef-portal/custom-sections"),
    update: (id: string) => buildApiPath(`chef-portal/custom-sections/${id}`),
    delete: (id: string) => buildApiPath(`chef-portal/custom-sections/${id}`),
  },

  bundles: {
    base: buildApiPath("bundles"),
    list: buildApiPath("bundles/me"),
    get: (id: string) => buildApiPath(`bundles/${id}/me`),
    getById: (id: string) => buildApiPath(`bundles/${id}/me`),
    create: buildApiPath("bundles"),
    update: (id: string) => buildApiPath(`bundles/${id}`),
    delete: (id: string) => buildApiPath(`bundles/${id}`),
  },

  modifierGroups: {
    base: buildApiPath("chef-portal/modifier-groups"),
    list: buildApiPath("chef-portal/modifier-groups"),
    get: (id: string) => buildApiPath(`chef-portal/modifier-groups/${id}`),
    create: buildApiPath("chef-portal/modifier-groups"),
    update: (id: string) => buildApiPath(`chef-portal/modifier-groups/${id}`),
    delete: (id: string) => buildApiPath(`chef-portal/modifier-groups/${id}`),
  },

  stripeConnect: {
    dashboard: buildApiPath("chef-portal/stripe-connect/dashboard"),
    onboard: buildApiPath("chef-portal/stripe-connect/onboard"),
    profile: buildApiPath("chef-portal/profile"), // For Stripe Connect status fields
  },

  addressAutocomplete: buildApiPath("address/autocomplete"),
} as const;

export const ENDPOINTS = endpoints;
