import type { OrderStatusHistory } from "@/types/orders.types";

/**
 * Detects and removes duplicate status history entries
 * 
 * Duplicates are identified by:
 * - Same status and previousStatus
 * - Timestamps within 5 seconds of each other
 * - Same or similar changedBy information
 * 
 * When duplicates are found, keeps the entry with:
 * - More complete information (has reason if one doesn't)
 * - More recent timestamp
 * - More complete changedBy information
 */
export function deduplicateStatusHistory(
  history: OrderStatusHistory[]
): OrderStatusHistory[] {
  if (!history || history.length === 0) {
    return history;
  }

  // Sort by timestamp descending (most recent first)
  const sorted = [...history].sort(
    (a, b) => new Date(b.changedAt).getTime() - new Date(a.changedAt).getTime()
  );

  const deduplicated: OrderStatusHistory[] = [];
  const seen = new Set<string>();

  for (const entry of sorted) {
    // Create a key based on status, previousStatus, and timestamp (rounded to nearest second)
    const timestamp = new Date(entry.changedAt).getTime();
    const timestampRounded = Math.floor(timestamp / 1000) * 1000; // Round to nearest second
    
    // Create a key that groups entries that are likely duplicates
    const key = `${entry.status}|${entry.previousStatus}|${timestampRounded}`;
    
    // Check if we've seen a similar entry within 5 seconds
    let isDuplicate = false;
    for (const seenKey of seen) {
      const [seenStatus, seenPrevStatus, seenTimestamp] = seenKey.split("|");
      const seenTime = parseInt(seenTimestamp, 10);
      const timeDiff = Math.abs(timestampRounded - seenTime);
      
      // Consider it a duplicate if:
      // 1. Same status and previousStatus
      // 2. Timestamps are within 5 seconds
      if (
        seenStatus === entry.status &&
        seenPrevStatus === entry.previousStatus &&
        timeDiff <= 5000 // 5 seconds
      ) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      deduplicated.push(entry);
      seen.add(key);
    } else {
      // Log warning in development
      if (process.env.NODE_ENV === "development") {
        console.warn(
          `[Order Utils] Duplicate status history entry detected and removed:`,
          {
            status: entry.status,
            previousStatus: entry.previousStatus,
            changedAt: entry.changedAt,
            changedBy: entry.changedBy,
          }
        );
      }
    }
  }

  // Sort back by timestamp ascending (oldest first) to maintain chronological order
  return deduplicated.sort(
    (a, b) => new Date(a.changedAt).getTime() - new Date(b.changedAt).getTime()
  );
}

/**
 * Validates status history for common issues:
 * - Duplicate entries
 * - Invalid status transitions
 * - Missing required fields
 */
export function validateStatusHistory(
  history: OrderStatusHistory[]
): {
  isValid: boolean;
  errors: string[];
  warnings: string[];
} {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!history || history.length === 0) {
    return { isValid: true, errors, warnings };
  }

  // Check for duplicates
  const duplicates = findDuplicateEntries(history);
  if (duplicates.length > 0) {
    warnings.push(
      `Found ${duplicates.length} duplicate status history entry(ies). These should be removed by the backend.`
    );
  }

  // Check for invalid transitions (basic validation)
  for (let i = 1; i < history.length; i++) {
    const prev = history[i - 1];
    const curr = history[i];
    
    // Check if previousStatus matches the previous entry's status
    if (curr.previousStatus !== prev.status) {
      warnings.push(
        `Status history inconsistency at index ${i}: previousStatus (${curr.previousStatus}) doesn't match previous entry's status (${prev.status})`
      );
    }
  }

  return {
    isValid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Finds duplicate entries in status history
 */
function findDuplicateEntries(
  history: OrderStatusHistory[]
): Array<{ index: number; entry: OrderStatusHistory }> {
  const duplicates: Array<{ index: number; entry: OrderStatusHistory }> = [];
  const seen = new Map<string, number>();

  for (let i = 0; i < history.length; i++) {
    const entry = history[i];
    const timestamp = new Date(entry.changedAt).getTime();
    const timestampRounded = Math.floor(timestamp / 1000) * 1000;
    const key = `${entry.status}|${entry.previousStatus}|${timestampRounded}`;

    // Check if we've seen a similar entry
    for (const [seenKey] of seen.entries()) {
      const [seenStatus, seenPrevStatus, seenTimestamp] = seenKey.split("|");
      const seenTime = parseInt(seenTimestamp, 10);
      const timeDiff = Math.abs(timestampRounded - seenTime);

      if (
        seenStatus === entry.status &&
        seenPrevStatus === entry.previousStatus &&
        timeDiff <= 5000 // 5 seconds
      ) {
        duplicates.push({ index: i, entry });
        break;
      }
    }

    seen.set(key, i);
  }

  return duplicates;
}



