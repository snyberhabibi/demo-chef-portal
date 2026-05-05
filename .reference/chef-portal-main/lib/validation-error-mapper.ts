/**
 * Validation Error Mapper
 *
 * Maps backend validation errors and Zod field paths to chef-friendly messages,
 * and converts server error responses into field-level errors that can be
 * displayed inline on form fields with red borders.
 */

// ----- Field Label Map -----
// Maps internal field paths (from Zod or backend) to human-readable labels.
const FIELD_LABELS: Record<string, string> = {
  // Common fields
  name: "Name",
  description: "Description",
  cuisineId: "Cuisine",
  cuisine: "Cuisine",
  categoryId: "Category",
  category: "Category",
  status: "Status",
  leadTime: "Lead time",
  chefUserId: "Chef account",

  // Media
  imageIds: "Images",
  images: "Images",

  // Specs
  spiceLevels: "Spice levels",
  portionSizes: "Portion sizes",
  ingredientIds: "Ingredients",
  ingredients: "Ingredients",
  allergenIds: "Allergens",
  allergens: "Allergens",
  dietaryLabelIds: "Dietary labels",
  dietaryLabels: "Dietary labels",

  // Portion size nested fields
  portionLabelId: "Portion label",
  portionLabel: "Portion label",
  size: "Size",
  price: "Price",

  // Availability
  maxQuantityPerDay: "Max quantity per day",
  availability: "Availability days",

  // Customizations
  customizationGroups: "Customizations",
  modifierGroupId: "Modifier group",
  modifierGroup: "Modifier group",
  required: "Required setting",
  selectionType: "Selection type",
  modifiers: "Modifiers",
  priceAdjustment: "Price adjustment",

  // Shipping
  shipping: "Shipping",
  "shipping.shippable": "Shipping enabled",
  "shipping.weight": "Package weight",
  "shipping.dimensions": "Package dimensions",
  "shipping.dimensions.length": "Package length",
  "shipping.dimensions.width": "Package width",
  "shipping.dimensions.height": "Package height",
  "shipping.dryIce": "Dry ice",
  "shipping.dryIce.required": "Dry ice required",
  "shipping.dryIce.weight": "Dry ice weight",
};

// Backend field names → frontend field names (for mapping server errors to form fields)
const BACKEND_TO_FRONTEND_FIELD: Record<string, string> = {
  cuisine: "cuisineId",
  category: "categoryId",
  portionLabel: "portionLabelId",
  ingredients: "ingredientIds",
  allergens: "allergenIds",
  dietaryLabels: "dietaryLabelIds",
  modifierGroup: "modifierGroupId",
  images: "imageIds",
};

/**
 * Gets a human-readable label for a field path.
 * Handles nested paths like "portionSizes.0.price" → "Portion sizes: Price"
 */
function getFieldLabel(fieldPath: string): string {
  // Direct match
  if (FIELD_LABELS[fieldPath]) {
    return FIELD_LABELS[fieldPath];
  }

  // Handle nested paths like "portionSizes.0.price" or "customizationGroups.1.modifiers.0.name"
  const parts = fieldPath.split(".");
  const segments: string[] = [];

  for (const part of parts) {
    // Skip array indices
    if (/^\d+$/.test(part)) continue;
    const label = FIELD_LABELS[part];
    if (label) segments.push(label);
  }

  if (segments.length > 0) {
    return segments.join(" → ");
  }

  // Fallback: capitalize the last segment
  const lastPart = parts[parts.length - 1];
  if (/^\d+$/.test(lastPart) && parts.length > 1) {
    return parts[parts.length - 2].replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
  }
  return lastPart.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase());
}

/**
 * Maps a backend field name to the frontend form field name.
 */
function mapBackendField(backendField: string): string {
  // Direct map
  if (BACKEND_TO_FRONTEND_FIELD[backendField]) {
    return BACKEND_TO_FRONTEND_FIELD[backendField];
  }

  // Handle nested paths: map each segment
  const parts = backendField.split(".");
  const mapped = parts.map((part) => BACKEND_TO_FRONTEND_FIELD[part] || part);
  return mapped.join(".");
}

// ----- Types -----

interface ServerError extends Error {
  status?: number;
  data?: {
    error?: string;
    message?: string;
    details?: unknown;
    errors?: Record<string, string[]> | string[];
    missingFields?: string[];
  };
  validationErrors?: string[];
  missingFields?: string[];
}

export interface MappedValidationErrors {
  /** Field path → error message, for setting on form fields */
  fieldErrors: Record<string, string>;
  /** Chef-friendly summary messages for toasts */
  toastMessages: string[];
  /** Whether this was a validation error (vs. a generic server error) */
  isValidationError: boolean;
}

// ----- Main Mapper -----

/**
 * Maps a server error into field-level errors and toast messages.
 * Handles multiple backend error formats:
 * - `validationErrors` array (from http-client extractNestedValidationErrors)
 * - `errors` object { field: ["msg1", "msg2"] }
 * - `errors` array ["msg1", "msg2"]
 * - `missingFields` array
 * - `details` nested object
 */
export function mapServerError(error: unknown): MappedValidationErrors {
  const result: MappedValidationErrors = {
    fieldErrors: {},
    toastMessages: [],
    isValidationError: false,
  };

  if (!(error instanceof Error)) {
    result.toastMessages.push("Something went wrong. Please try again.");
    return result;
  }

  const serverError = error as ServerError;
  const status = serverError.status;
  const data = serverError.data as ServerError["data"];

  // Check if this is a validation-type error
  const isValidation =
    status === 400 ||
    status === 422 ||
    serverError.validationErrors?.length ||
    serverError.missingFields?.length ||
    serverError.message?.toLowerCase().includes("validation");

  if (!isValidation) {
    // Not a validation error - return the message as-is for the toast
    result.toastMessages.push(serverError.message || "Something went wrong. Please try again.");
    return result;
  }

  result.isValidationError = true;

  // 1. Handle validationErrors array (most common from http-client)
  // Format: ["field: message", "field.nested: message"]
  if (serverError.validationErrors && serverError.validationErrors.length > 0) {
    for (const validationError of serverError.validationErrors) {
      const colonIndex = validationError.indexOf(": ");
      if (colonIndex > 0) {
        const backendField = validationError.substring(0, colonIndex).trim();
        const message = validationError.substring(colonIndex + 2).trim();
        const frontendField = mapBackendField(backendField);
        const label = getFieldLabel(frontendField);

        result.fieldErrors[frontendField] = message;
        result.toastMessages.push(`${label}: ${message}`);
      } else {
        // No field prefix - general validation error
        result.toastMessages.push(validationError);
      }
    }
    return result;
  }

  // 2. Handle missingFields array
  if (serverError.missingFields && serverError.missingFields.length > 0) {
    for (const field of serverError.missingFields) {
      const frontendField = mapBackendField(field);
      const label = getFieldLabel(frontendField);
      const message = `${label} is required`;

      result.fieldErrors[frontendField] = `${label} is required`;
      result.toastMessages.push(message);
    }
    return result;
  }

  // 3. Handle errors object { field: ["msg1"] }
  if (data?.errors && typeof data.errors === "object" && !Array.isArray(data.errors)) {
    for (const [field, messages] of Object.entries(data.errors)) {
      const frontendField = mapBackendField(field);
      const label = getFieldLabel(frontendField);
      const msg = Array.isArray(messages) ? messages[0] : String(messages);

      result.fieldErrors[frontendField] = msg;
      result.toastMessages.push(`${label}: ${msg}`);
    }
    return result;
  }

  // 4. Handle errors array ["msg1", "msg2"]
  if (data?.errors && Array.isArray(data.errors)) {
    for (const msg of data.errors) {
      result.toastMessages.push(msg);
    }
    return result;
  }

  // 5. Fallback: use the error message itself
  if (serverError.message) {
    // Try to parse "field: message" patterns from the combined message
    const parts = serverError.message.split(" · ");
    if (parts.length > 1) {
      for (const part of parts) {
        const colonIndex = part.indexOf(": ");
        if (colonIndex > 0) {
          const backendField = part.substring(0, colonIndex).trim();
          const message = part.substring(colonIndex + 2).trim();
          const frontendField = mapBackendField(backendField);
          const label = getFieldLabel(frontendField);

          result.fieldErrors[frontendField] = message;
          result.toastMessages.push(`${label}: ${message}`);
        } else {
          result.toastMessages.push(part);
        }
      }
    } else {
      result.toastMessages.push(serverError.message);
    }
  }

  return result;
}

/**
 * Formats toast messages for display.
 * If there are multiple errors, shows a summary with the first few specifics.
 */
export function formatValidationToast(mapped: MappedValidationErrors): {
  title: string;
  description?: string;
} {
  const { toastMessages } = mapped;

  if (toastMessages.length === 0) {
    return { title: "Please check your form and try again." };
  }

  if (toastMessages.length === 1) {
    return { title: toastMessages[0] };
  }

  // Multiple errors: show count as title, first 3 as description
  const shown = toastMessages.slice(0, 3);
  const remaining = toastMessages.length - shown.length;
  const description =
    shown.join("\n") + (remaining > 0 ? `\n...and ${remaining} more` : "");

  return {
    title: `Please fix ${toastMessages.length} errors`,
    description,
  };
}

// ----- Zod Client-Side Validation -----

export interface FormattedZodErrors {
  /** Field path → error message, for setting on form fields */
  fieldErrors: Record<string, string>;
  /** Friendly messages for display */
  messages: string[];
}

/**
 * Formats Zod validation issues into field errors and a toast message.
 * Reuses FIELD_LABELS for human-readable labels. Pages can pass extra
 * labels to override or extend the defaults.
 *
 * Usage (Zod safeParse pages like dishes/bundles):
 *   const { fieldErrors, messages } = formatZodErrors(result.error.issues);
 *   setFieldErrors(fieldErrors);
 *   showValidationToast(messages);
 *
 * Usage (react-hook-form onInvalid):
 *   const onInvalid = (rhfErrors) => {
 *     const { messages } = formatRHFErrors(rhfErrors);
 *     showValidationToast(messages);
 *   };
 */
export function formatZodErrors(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  issues: readonly any[],
  extraLabels?: Record<string, string>
): FormattedZodErrors {
  const labels = extraLabels ? { ...FIELD_LABELS, ...extraLabels } : FIELD_LABELS;
  const fieldErrors: Record<string, string> = {};
  const messages: string[] = [];
  const seen = new Set<string>();

  for (const issue of issues) {
    const fieldPath = issue.path.map(String).join(".");
    fieldErrors[fieldPath] = issue.message;

    // Pick the most specific label available
    const rootField = issue.path.length > 0 ? String(issue.path[0]) : "";
    const leafField = issue.path.length > 0 ? String(issue.path[issue.path.length - 1]) : "";
    const label = labels[leafField] || labels[rootField] || getFieldLabel(fieldPath);

    // Avoid duplicate prefix when the message already contains the field context
    const msg = issue.message.toLowerCase().includes(label.toLowerCase())
      ? issue.message
      : `${label}: ${issue.message}`;

    if (!seen.has(msg)) {
      seen.add(msg);
      messages.push(msg);
    }
  }

  return { fieldErrors, messages };
}

/**
 * Formats react-hook-form error object into friendly messages.
 * Works with the errors object from onInvalid callback.
 */
export function formatRHFErrors(
  errors: Record<string, { message?: string }>,
  extraLabels?: Record<string, string>
): { messages: string[] } {
  const labels = extraLabels ? { ...FIELD_LABELS, ...extraLabels } : FIELD_LABELS;
  const messages: string[] = [];
  const seen = new Set<string>();

  for (const [field, error] of Object.entries(errors)) {
    if (!error?.message) continue;
    const label = labels[field] || getFieldLabel(field);
    const msg = error.message.toLowerCase().includes(label.toLowerCase())
      ? error.message
      : `${label}: ${error.message}`;

    if (!seen.has(msg)) {
      seen.add(msg);
      messages.push(msg);
    }
  }

  return { messages };
}

/**
 * Shows a validation toast with consistent formatting.
 * Single error: shows the message directly.
 * 2-3 errors: joins with " · ".
 * 4+ errors: shows first 2 and "and N more".
 */
export function showValidationToast(
  messages: string[],
  toastFn: { error: (msg: string, opts?: { duration?: number; description?: string }) => void }
) {
  if (messages.length === 0) return;

  if (messages.length === 1) {
    toastFn.error(messages[0]);
  } else if (messages.length <= 3) {
    toastFn.error(messages.join(" · "), { duration: 5000 });
  } else {
    toastFn.error(
      `${messages.slice(0, 2).join(" · ")} and ${messages.length - 2} more`,
      { duration: 5000 }
    );
  }
}

/**
 * Maps a field path from the backend to the section ID it belongs to.
 * Used for scrolling to the first error section.
 */
export function getFieldSection(fieldPath: string): string {
  const firstPart = fieldPath.split(".")[0];

  const sectionMap: Record<string, string> = {
    name: "details",
    description: "details",
    cuisineId: "details",
    cuisine: "details",
    categoryId: "details",
    category: "details",
    leadTime: "details",
    chefUserId: "details",
    status: "details",
    imageIds: "media",
    images: "media",
    portionSizes: "specs",
    spiceLevels: "specs",
    ingredientIds: "specs",
    ingredients: "specs",
    allergenIds: "specs",
    allergens: "specs",
    dietaryLabelIds: "specs",
    dietaryLabels: "specs",
    maxQuantityPerDay: "availability",
    availability: "availability",
    customizationGroups: "customizations",
    shipping: "shipping",
  };

  return sectionMap[firstPart] || (firstPart.startsWith("shipping") ? "shipping" : "details");
}
