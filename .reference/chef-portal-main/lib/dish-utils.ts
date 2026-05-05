import type { PortionSize } from "@/types/dishes.types";
import type { BundlePortionSize } from "@/types/bundles.types";

/**
 * Generates a human-readable label for a portion size
 *
 * Logic:
 * - If size is a number: uses singular/plural names based on count
 * - If size is a string: uses the size itself as the label (ignores singular/plural)
 *
 * @param portionSize - The portion size object containing size and portionLabel
 * @returns A formatted string like "250 grams" or "Small" or "2 pieces"
 */
export const HumanReadablePortionSizeLabel = (
  portionSize: PortionSize
): string => {
  const sizeStr = String(portionSize.size).trim();

  // Try to parse as a number
  const count = Number(sizeStr);

  // If size is a valid number, use singular/plural names
  if (!isNaN(count) && sizeStr !== "") {
    const displayName =
      Math.abs(count) === 1
        ? (portionSize.portionLabel.singularName?.trim() || portionSize.portionLabel.label)
        : (portionSize.portionLabel.pluralName?.trim() || portionSize.portionLabel.label);
    return `${sizeStr} ${displayName}`;
  }

  // If size starts with a digit (e.g. "5-10" range), append the label
  if (sizeStr !== "" && /^\d/.test(sizeStr)) {
    const displayName = portionSize.portionLabel.pluralName?.trim() || portionSize.portionLabel.label;
    return `${sizeStr} ${displayName}`;
  }

  // Pure text (e.g. "Large", "Serves 10") — prepend label if different from size
  const label = portionSize.portionLabel.label?.trim();
  if (label && label.toLowerCase() !== sizeStr.toLowerCase() && !sizeStr.toLowerCase().includes(label.toLowerCase())) {
    return `${label} · ${sizeStr}`;
  }
  return sizeStr;
};

/**
 * Generates a full display format for a portion size including label, size, and price
 *
 * Examples:
 * - "Serves 10 people · $49.99" (size is text — displayed as-is)
 * - "250 grams · $12.50" (size is number — uses singular/plural from label)
 * - "1 piece · $25.00" (size is number — uses singular form)
 *
 * @param portionSize - The portion size object containing size, portionLabel, and price
 * @returns A formatted string like "Serves 10 people · $49.99" or "250 grams · $12.50"
 */
export const HumanReadablePortionSizeDisplay = (
  portionSize: PortionSize
): string => {
  const sizeDisplay = HumanReadablePortionSizeLabel(portionSize);
  const price = portionSize.price.toFixed(2);

  return `${sizeDisplay} · $${price}`;
};

/**
 * Get portion size label for bundles which use regularPrice/salePrice instead of price.
 * Shows sale price when available (and different from regular), otherwise regular price.
 */
export const getBundlePortionSizeLabel = (
  portionSize: BundlePortionSize,
  showPrice = true
): string => {
  const sizeStr = String(portionSize.size).trim();
  const portionLabel =
    typeof portionSize.portionLabel === "string"
      ? portionSize.portionLabel
      : portionSize.portionLabel.label;

  const price =
    portionSize.salePrice != null &&
    portionSize.salePrice > 0 &&
    portionSize.salePrice < portionSize.regularPrice
      ? portionSize.salePrice
      : portionSize.regularPrice;

  // If size is numeric or a numeric range (e.g. "5-10"), append the label
  // If size is pure text (e.g. "Large", "Serves 10"), prepend label if different
  const isNumericLike = sizeStr !== "" && /^\d/.test(sizeStr);
  let sizeDisplay: string;
  if (isNumericLike) {
    sizeDisplay = `${sizeStr} ${portionLabel}`;
  } else if (portionLabel && portionLabel.toLowerCase() !== sizeStr.toLowerCase() && !sizeStr.toLowerCase().includes(portionLabel.toLowerCase())) {
    sizeDisplay = `${portionLabel} · ${sizeStr}`;
  } else {
    sizeDisplay = sizeStr;
  }

  return `${sizeDisplay}${showPrice ? ` · $${price.toFixed(2)}` : ""}`;
};
