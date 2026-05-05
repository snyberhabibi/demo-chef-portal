import type { Order } from "@/types/orders.types";
import type { DishApiResponse } from "@/types/dishes.types";

export interface OrderLabelBundleSubItem {
  name: string;
  quantity: number;
  ingredients: string;
  allergens: string[];
}

export interface OrderLabelItem {
  name: string;
  quantity?: number;
  ingredients: string;
  allergens: string[];
  isBundle?: boolean;
  bundleItems?: OrderLabelBundleSubItem[];
}

export interface OrderLabelData {
  customerName: string;
  orderNumber: string;
  logoUrl?: string;
  packedTime: string;
  items: OrderLabelItem[];
  chefName?: string;
}

/**
 * Interface for dish data with ingredients and allergens
 */
export interface DishLabelData {
  id: string;
  name: string;
  ingredients: string;
  allergens: string[];
}

/**
 * Formats allergen list for display
 */
function formatAllergens(allergens: string[]): string {
  if (allergens.length === 0) {
    return "NO MAJOR ALLERGENS";
  }
  return `CONTAINS: ${allergens.join(", ").toUpperCase()}`;
}

/**
 * Escapes HTML special characters
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

/**
 * Generates HTML for a single bundle sub-item (dish within a bundle)
 */
function generateBundleSubItemHTML(subItem: OrderLabelBundleSubItem): string {
  const name = escapeHtml(subItem.name);
  const qty = subItem.quantity > 1 ? ` (x${subItem.quantity})` : "";
  const ingredients = escapeHtml(subItem.ingredients);
  const allergens = formatAllergens(subItem.allergens);

  return `
                <div class="bundle-sub-item">
                    <div class="bundle-sub-item-name">${name}${qty}</div>
                    <div class="bundle-sub-item-ingredients">${ingredients}</div>
                    <div class="bundle-sub-item-allergens">${escapeHtml(allergens)}</div>
                </div>`;
}

/**
 * Generates HTML for a single order item
 */
function generateItemHTML(item: OrderLabelItem, index: number): string {
  const itemName = escapeHtml(item.name);
  const quantity =
    item.quantity && item.quantity > 1 ? ` (x${item.quantity})` : "";

  // Bundle item: show bundle name then list each dish underneath
  if (item.isBundle && item.bundleItems && item.bundleItems.length > 0) {
    const subItemsHTML = item.bundleItems
      .map((subItem) => generateBundleSubItemHTML(subItem))
      .join("\n");

    return `
            <div class="item-row bundle-row">
                <div class="item-name">${index + 1}. ${itemName}${quantity} <span class="bundle-badge">Bundle</span></div>
                <div class="bundle-items-list">
${subItemsHTML}
                </div>
            </div>`;
  }

  // Regular dish item
  const ingredients = escapeHtml(item.ingredients);
  const allergens = formatAllergens(item.allergens);

  return `
            <div class="item-row">
                <div class="item-name">${
                  index + 1
                }. ${itemName}${quantity}</div>
                <div class="item-ingredients">${ingredients}</div>
                <div class="item-allergens">${escapeHtml(allergens)}</div>
            </div>`;
}

/**
 * Splits items into chunks of maxItemsPerPage
 */
function chunkItems<T>(items: T[], maxItemsPerPage: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += maxItemsPerPage) {
    chunks.push(items.slice(i, i + maxItemsPerPage));
  }
  return chunks;
}

/**
 * Generates HTML for a single label page
 */
function generateSingleLabelPageHTML(
  pageItems: OrderLabelItem[],
  baseData: Omit<OrderLabelData, "items">,
  pageNumber: number,
  totalPages: number
): string {
  const customerName = escapeHtml(baseData.customerName);
  const orderNumber = escapeHtml(baseData.orderNumber);
  const packedTime = escapeHtml(baseData.packedTime);
  const logoUrl =
    baseData.logoUrl ||
    "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAAC+AQAAAACn3w8kAAABamlDQ1BJQ0MgUHJvZmlsZQAAeJx1kL1Lw1AUxU+rUtA6iA4dHDKJQ9TSCnZxaCsURTBUBatTmn4JbXwkKVJxE1cp+B9YwVlwsIhUcHFwEEQHEd2cOim4aHjel1TaIt7H5f04nHO5XMAbUBkr9gIo6ZaRTMSktdS65HuDh55TqmayqKIsCv79u+vz0fXeT4hZTbt2ENlPXJfOLpd2ngJTf/1d1Z/Jmhr939RBjRkW4JGJlW2LCd4lHjFoKeKq4LzLx4LTLp87npVknPiWWNIKaoa4SSynO/R8B5eKZa21g9jen9VXl8Uc6lHMYRMmGIpQUYEEBeF//NOOP44tcldgUC6PAizKREkRE7LE89ChYRIycQhB6pC4c+t+D637yW1t7xWYbXDOL9raQgM4naGT1dvaeAQYGgBu6kw1VEfqofbmcsD7CTCYAobvKLNh5sIhd3t/DOh74fxjDPAdAnaV868jzu0ahZ+BK/0HFylqvLiAv9gAAAOlSURBVHic7Ze9rqQ2FIA/M0iDlGIop4g0PECK9FlpkPIi+yCR4i5dtG26+ybxlVJsueWW3O524V7dglkxPimMwQbDbhmtcDF4zMf5MefHKOEbxkv2LRTs2I7t2I7t2PeB1QAWgGe4r2DyD/ByAOCvmrcyjak78Em5lU/wtmZbPSgGupTWAWsQP+0BvYK1gwNQW8CsYNCTu0myJWbeoC5cbVawnpZiWNLQrirdHgNmaSiHJVOsYrPRzRdGzFABj1V096WYY265jv7evR0TpomRDdtUBcGmPQa+iIgIyoJ0wMVw6TiKiFhwE5E2lPYMMPnwulQqFsUD0f63uHCZMB38juMh4UJPFoRGP38qsO1LLCwKKI915OMbcoFnl1jNcvRLDFqKNsa6JVZBImQT0hpKMwoOLyFWJgQ0S6zAUOnVJzyWj/8nww1Mu+KwA5orXGMRl0lvFjyKMcOqE1Kdp0dcQFnoUdJwbDn1KBGB391ERNoQO0jLseVkB0zsiI15qpzHwVALT5n5uwDHGpIlwZS0jVtj4ZrvcL0pzUfZLSl5qm7D9aPbY4mxSNYrSKxzwspJ4QfklYYwa8aCD1hn/V3DB+LUGqVVzkSCxqDtHDOQIboJBGhMP8fcPj0EhlfQPM8xDcAT0XiqprmLFBBn8cFH+dUEt4dA+uo3mbdNzetWXS0x650gj2NpjDgREek5iBiAo98EaYFZkPcwbHAxiilCm/w1n+V7Fkeyw7pRkGfzOOq9tGJY8v6d41RzWEs5TOsMlIb3boNGQ0REpOEqIhoQCxfDQZzn18FTp7yhBmo4oKB54kfgZ4IjhIiIGOUqhTqJ6ONQMnr4VaIa0g697CQizVU619H0QTym9i/x/yMmNbzevorRwL+Ldr3EWmiGmvPl8zrWDexjyR8/rWM+UesuqAOrngq9BEkos2EPIk13lB7V+wNXfOIaxwXokaDVrSrtoJ/yL4EVfHQTzft17H6j55a3R81JbynVFiznOlhKYQ8CUIWnjbQLmqwBbpuetu5igpNfCuuAnEedTxV+bd8KQE/VPYF1Pa4cZVNFWmIqB44GVHAQWWLZVL3NeIjbSJnc960trOLsLFzBfEv+oQkWE9Ks17mJiUuG8o3gtJqKtxxuGfcy+ABadaHgLUjqFFYAWY6VqTctMAUlOWSInc5dKWlVBbmC37ZevaYuM9xbH9/q8phYK31TnH2MrGG//MkR8zcn4N1o8d6MdmzHdmzHduz7wv4DwI6vd++jPSMAAAAASUVORK5CYII=";
  const chefName = baseData.chefName ? escapeHtml(baseData.chefName) : "Chef";

  // Calculate starting item number for this page
  const itemsPerPage = 6;
  const startItemNumber = (pageNumber - 1) * itemsPerPage + 1;

  const itemsHTML = pageItems
    .map((item, index) => generateItemHTML(item, startItemNumber + index - 1))
    .join("\n");

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>order-${orderNumber}</title>
    <style>
        @page {
            size: 4in 6in;
            margin: 0;
        }

        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        html, body {
            margin: 0;
            padding: 0;
            background: #fff;
            font-family: 'Arial', 'Helvetica', sans-serif;
            font-size: 7pt;
            line-height: 1.2;
            color: #000;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
            width: 100%;
            height: 100%;
        }

        .label-container {
            width: 101.6mm; /* 4 inches */
            height: 152.4mm; /* 6 inches */
            padding: 2.5mm;
            background: #fff;
            display: flex;
            flex-direction: column;
            overflow: hidden;
            position: relative;
        }

        /* Header Section */
        .header {
            border-bottom: 1.5px solid #000;
            padding-bottom: 1.5mm;
            margin-bottom: 1.5mm;
            display: flex;
            justify-content: space-between;
            align-items: center;
            flex-shrink: 0;
            min-height: 12mm;
        }

        .customer-info {
            flex: 1;
            font-weight: bold;
            font-size: 11.5pt;
        }

        .customer-name {
            display: block;
            margin-bottom: 0.5mm;
        }

        .order-number {
            font-size: 7pt;
            font-weight: normal;
        }

        .logo-container {
            flex: 0 0 auto;
            padding: 0 3mm;
            text-align: center;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .logo-img {
            max-width: 30mm;
            max-height: 10mm;
            height: auto;
            width: auto;
            object-fit: contain;
            display: block;
        }

        .meta-info {
            flex: 1;
            text-align: right;
            font-size: 7pt;
        }

        .packed-time {
            font-weight: bold;
        }

        /* Items Container */
        .items-container {
            flex: 1 1 auto;
            display: flex;
            flex-direction: column;
            gap: 0.8mm;
            overflow: hidden;
            margin-bottom: 1.5mm;
            min-height: 0;
        }

        .item-row {
            border-bottom: 1px dotted #666;
            padding-bottom: 0.8mm;
            margin-bottom: 0.5mm;
            display: flex;
            flex-direction: column;
            gap: 0.4mm;
        }

        .item-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
        }

        .item-name {
            font-weight: bold;
            font-size: 8pt;
            text-transform: uppercase;
            line-height: 1.3;
            margin-bottom: 0.2mm;
        }

        .item-ingredients {
            font-size: 6.5pt;
            color: #333;
            line-height: 1.2;
            margin-bottom: 0.2mm;
        }

        .item-allergens {
            font-size: 6pt;
            font-weight: bold;
            border: 1px solid #000;
            padding: 0.5mm 1mm;
            display: inline-block;
            width: fit-content;
            line-height: 1.2;
        }

        /* Bundle styles */
        .bundle-badge {
            font-size: 5.5pt;
            font-weight: bold;
            background: #000;
            color: #fff;
            padding: 0.2mm 1mm;
            border-radius: 1mm;
            text-transform: uppercase;
            vertical-align: middle;
            margin-left: 1mm;
        }

        .bundle-items-list {
            padding-left: 2.5mm;
            margin-top: 0.5mm;
            display: flex;
            flex-direction: column;
            gap: 0.6mm;
        }

        .bundle-sub-item {
            border-left: 1.5px solid #000;
            padding-left: 1.5mm;
            margin-bottom: 0.4mm;
        }

        .bundle-sub-item-name {
            font-weight: bold;
            font-size: 7pt;
            line-height: 1.3;
        }

        .bundle-sub-item-ingredients {
            font-size: 6pt;
            color: #333;
            line-height: 1.2;
            margin-bottom: 0.2mm;
        }

        .bundle-sub-item-allergens {
            font-size: 5.5pt;
            font-weight: bold;
            border: 1px solid #000;
            padding: 0.3mm 0.8mm;
            display: inline-block;
            width: fit-content;
            line-height: 1.2;
        }

        /* Footer Section */
        .footer-section {
            flex-shrink: 0;
            flex-grow: 0;
            margin-top: auto;
            position: relative;
        }

        .chef-info {
            font-style: italic;
            font-size: 7pt;
            border-top: 1px solid #000;
            padding-top: 1mm;
            margin-bottom: 1mm;
        }

        .compliance-footer {
            font-size: 5.5pt;
            text-align: center;
            border-top: 1px solid #000;
            padding-top: 0.8mm;
            text-transform: uppercase;
            font-weight: bold;
            line-height: 1.2;
        }

        /* Print Styles - fills entire page for label printers */
        @media print {
            * {
                -webkit-print-color-adjust: exact !important;
                print-color-adjust: exact !important;
            }

            html, body {
                background: #fff;
                margin: 0 !important;
                padding: 0 !important;
                width: 100% !important;
                height: 100% !important;
            }

            .label-container {
                width: 100% !important;
                height: 100% !important;
                max-width: 100%;
                max-height: 100%;
                padding: 2mm;
                page-break-inside: avoid;
                page-break-after: always;
                break-inside: avoid;
                break-after: page;
                box-shadow: none;
                display: flex !important;
                flex-direction: column !important;
                position: relative;
                overflow: hidden;
                margin: 0;
            }

            .header {
                flex-shrink: 0;
            }

            .items-container {
                flex: 1 1 auto !important;
                overflow: visible;
                min-height: 0;
            }

            .footer-section {
                flex-shrink: 0 !important;
                flex-grow: 0 !important;
                margin-top: auto !important;
            }
        }
    </style>
</head>
<body>
    <div class="label-container">
        <!-- Header -->
        <div class="header">
            <div class="customer-info">
                <span class="customer-name">For: ${customerName}</span>
                <span class="order-number">Order #${orderNumber}</span>
            </div>
            
            <div class="logo-container">
                <img src="${logoUrl}" class="logo-img" alt="YallaBites">
            </div>

            <div class="meta-info">
                <div class="packed-time">Packed On:</div>
                <div>${packedTime}</div>
            </div>
        </div>

        <!-- Order Items -->
        <div class="items-container">
${itemsHTML}
        </div>

        <!-- Footer -->
        <div class="footer-section">
            <div class="chef-info">
                Prepared by: ${chefName}
            </div>

            <div class="compliance-footer">
                THIS PRODUCT WAS PRODUCED IN A PRIVATE RESIDENCE THAT IS NOT SUBJECT TO GOVERNMENTAL LICENSING OR INSPECTION.
            </div>
${
  totalPages > 1
    ? `            <div style="text-align: center; font-size: 6pt; margin-top: 1mm; font-weight: bold;">
                Page ${pageNumber} of ${totalPages}
            </div>`
    : ""
}
        </div>
    </div>
</body>
</html>`;
}

/**
 * Generates the complete order label HTML (may contain multiple pages)
 */
export function generateOrderLabelHTML(data: OrderLabelData): string {
  const MAX_ITEMS_PER_PAGE = 6;

  // Split items into chunks of 6
  const itemChunks = chunkItems(data.items, MAX_ITEMS_PER_PAGE);
  const totalPages = itemChunks.length;

  // If only one page, return single page HTML
  if (totalPages === 1) {
    return generateSingleLabelPageHTML(
      data.items,
      {
        customerName: data.customerName,
        orderNumber: data.orderNumber,
        logoUrl: data.logoUrl,
        packedTime: data.packedTime,
        chefName: data.chefName,
      },
      1,
      1
    );
  }

  // Generate multiple pages - create a single HTML document with multiple label containers
  // First, get the HTML structure from the first page
  const firstPageHTML = generateSingleLabelPageHTML(
    itemChunks[0],
    {
      customerName: data.customerName,
      orderNumber: data.orderNumber,
      logoUrl: data.logoUrl,
      packedTime: data.packedTime,
      chefName: data.chefName,
    },
    1,
    totalPages
  );

  // Extract the head section and opening body tag
  const headMatch = firstPageHTML.match(/([\s\S]*?<body[^>]*>)/i);
  const headSection = headMatch
    ? headMatch[1]
    : firstPageHTML.split("<body")[0] + "<body>";

  // Extract the label-container from first page
  // Find the opening tag and match to the closing tag
  const firstContainerStart = firstPageHTML.indexOf(
    '<div class="label-container"'
  );
  if (firstContainerStart === -1) {
    return firstPageHTML; // Fallback to single page if extraction fails
  }

  // Find the matching closing tag by counting divs
  let divCount = 0;
  let firstContainerEnd = firstContainerStart;
  let inContainer = false;

  for (let i = firstContainerStart; i < firstPageHTML.length; i++) {
    if (firstPageHTML.substring(i, i + 4) === "<div") {
      divCount++;
      if (i === firstContainerStart) inContainer = true;
    } else if (firstPageHTML.substring(i, i + 6) === "</div>") {
      divCount--;
      if (inContainer && divCount === 0) {
        firstContainerEnd = i + 6;
        break;
      }
    }
  }

  const firstContainer = firstPageHTML.substring(
    firstContainerStart,
    firstContainerEnd
  );

  // Generate containers for subsequent pages
  const subsequentContainers = itemChunks.slice(1).map((chunk, index) => {
    const pageNumber = index + 2; // Start from page 2
    const pageHTML = generateSingleLabelPageHTML(
      chunk,
      {
        customerName: data.customerName,
        orderNumber: data.orderNumber,
        logoUrl: data.logoUrl,
        packedTime: data.packedTime,
        chefName: data.chefName,
      },
      pageNumber,
      totalPages
    );

    // Extract the label-container using the same method
    const containerStart = pageHTML.indexOf('<div class="label-container"');
    if (containerStart === -1) return "";

    // Find matching closing tag
    let divCount = 0;
    let containerEnd = containerStart;
    let inContainer = false;

    for (let i = containerStart; i < pageHTML.length; i++) {
      if (pageHTML.substring(i, i + 4) === "<div") {
        divCount++;
        if (i === containerStart) inContainer = true;
      } else if (pageHTML.substring(i, i + 6) === "</div>") {
        divCount--;
        if (inContainer && divCount === 0) {
          containerEnd = i + 6;
          break;
        }
      }
    }

    if (containerEnd > containerStart) {
      const containerContent = pageHTML.substring(containerStart, containerEnd);
      // Add page break before this container
      return containerContent.replace(
        '<div class="label-container"',
        '<div class="label-container" style="page-break-before: always; break-before: page;"'
      );
    }
    return "";
  });

  // Combine everything into a single HTML document
  return `${headSection}
${firstContainer}
${subsequentContainers.join("\n")}
</body>
</html>`;
}

/**
 * Formats a date/time string for display on the label
 */
export function formatPackedTime(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  const hours = String(d.getHours()).padStart(2, "0");
  const minutes = String(d.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day} ${hours}:${minutes}`;
}

/**
 * Extracts ingredients string from dish API response
 */
function extractIngredients(dish: DishApiResponse): string {
  if (!dish.ingredients || !Array.isArray(dish.ingredients)) {
    return dish.description || "Ingredients not specified.";
  }

  // Handle different possible structures
  const ingredients = dish.ingredients.map((ing) => {
    if (typeof ing === "string") {
      return ing;
    }
    if (typeof ing === "object" && ing !== null && "name" in ing) {
      return (ing as { name: string }).name;
    }
    return String(ing);
  });

  return (
    ingredients.join(", ") || dish.description || "Ingredients not specified."
  );
}

/**
 * Extracts allergens array from dish API response
 */
function extractAllergens(dish: DishApiResponse): string[] {
  if (!dish.allergens || !Array.isArray(dish.allergens)) {
    return [];
  }

  return dish.allergens.map((allergen) => {
    if (typeof allergen === "string") {
      return allergen;
    }
    if (
      typeof allergen === "object" &&
      allergen !== null &&
      "name" in allergen
    ) {
      return (allergen as { name: string }).name;
    }
    return String(allergen);
  });
}

/**
 * Converts an Order to OrderLabelData
 * Uses dish snapshot data from order items if available, otherwise falls back to fetching dish data
 */
export function orderToLabelData(
  order: Order,
  options?: {
    chefName?: string;
    logoUrl?: string;
    dishDataMap?: Map<string, DishApiResponse>;
  }
): OrderLabelData {
  const dishDataMap = options?.dishDataMap || new Map();

  const items: OrderLabelItem[] = order.items.map((item) => {
    // Handle bundle items - ingredients/allergens are included per dish in bundleItems
    if (item.type === "bundle" && item.bundleItems && item.bundleItems.length > 0) {
      const bundleSubItems: OrderLabelBundleSubItem[] = item.bundleItems.map((bi) => ({
        name: bi.dishName,
        quantity: bi.quantity,
        ingredients: bi.ingredients || "Ingredients not specified.",
        allergens: bi.allergens || [],
      }));

      return {
        name: item.dishName,
        quantity: item.quantity,
        ingredients: "",
        allergens: [],
        isBundle: true,
        bundleItems: bundleSubItems,
      };
    }

    // Regular dish item - existing logic
    const hasIngredients = !!item.ingredients;
    const hasAllergens =
      item.allergens !== undefined && item.allergens !== null;

    // Use snapshot data if available
    let ingredients = item.ingredients || "Ingredients not specified.";
    let allergens: string[] = hasAllergens ? item.allergens ?? [] : [];

    // Fallback to fetched dish data only if snapshot data is missing
    const needsIngredients = !hasIngredients;
    const needsAllergens = !hasAllergens;

    if (needsIngredients || needsAllergens) {
      const dishData = dishDataMap.get(item.dishId);
      if (dishData) {
        if (needsIngredients) {
          ingredients = extractIngredients(dishData);
        }
        if (needsAllergens) {
          allergens = extractAllergens(dishData);
        }
      } else if (needsIngredients) {
        ingredients = "Please check dish details for ingredients.";
      }
    }

    return {
      name: item.dishName,
      quantity: item.quantity,
      ingredients,
      allergens,
    };
  });

  return {
    customerName: order.customerName,
    orderNumber: order.orderNumber,
    logoUrl: options?.logoUrl,
    packedTime: formatPackedTime(new Date()),
    items,
    chefName: options?.chefName,
  };
}
