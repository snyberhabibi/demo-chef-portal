/**
 * Print Utilities
 * 
 * Provides utilities for printing HTML content using iframes to avoid popup blockers.
 */

export interface PrintOptions {
  /**
   * Callback function called when print dialog is successfully opened
   */
  onSuccess?: () => void;
  
  /**
   * Callback function called when print fails
   */
  onError?: (error: string) => void;
  
  /**
   * Timeout in milliseconds for cleanup fallback (default: 10000)
   */
  timeout?: number;
  
  /**
   * Delay in milliseconds before triggering print (default: 100)
   */
  printDelay?: number;
  
  /**
   * Delay in milliseconds before sending completion message (default: 500)
   */
  completionDelay?: number;
}

export interface PrintResult {
  /**
   * Function to manually cleanup the iframe and resources
   */
  cleanup: () => void;
}

/**
 * Prints HTML content using a hidden iframe to avoid popup blockers.
 * 
 * @param htmlContent - The HTML content to print
 * @param options - Optional configuration for print behavior
 * @returns An object with a cleanup function
 * 
 * @example
 * ```ts
 * const { cleanup } = printHTML('<html><body><h1>Hello</h1></body></html>', {
 *   onSuccess: () => console.log('Print dialog opened'),
 *   onError: (error) => console.error('Print failed:', error)
 * });
 * ```
 */
export function printHTML(
  htmlContent: string,
  options: PrintOptions = {}
): PrintResult {
  const {
    onSuccess,
    onError,
    timeout = 10000,
    printDelay = 100,
    completionDelay = 500,
  } = options;

  // Add auto-print script to HTML content
  const htmlWithAutoPrint = htmlContent.replace(
    "</body>",
    `<script>
      window.onload = function() {
        setTimeout(function() {
          window.print();
          // Notify parent window after print dialog is shown (or cancelled)
          setTimeout(function() {
            if (window.parent) {
              window.parent.postMessage('print-complete', '*');
            }
          }, ${completionDelay});
        }, ${printDelay});
      };
    </script>
    </body>`
  );

  // Create blob URL
  const blob = new Blob([htmlWithAutoPrint], { type: "text/html" });
  const blobUrl = URL.createObjectURL(blob);

  // Create iframe dynamically to avoid popup blockers
  const iframe = document.createElement("iframe");
  iframe.style.position = "fixed";
  iframe.style.right = "0";
  iframe.style.bottom = "0";
  iframe.style.width = "0";
  iframe.style.height = "0";
  iframe.style.border = "none";
  iframe.style.visibility = "hidden";

  let timeoutId: NodeJS.Timeout | null = null;
  let isCleanedUp = false;

  // Cleanup function to remove iframe and event listener
  const cleanup = () => {
    if (isCleanedUp) return;
    isCleanedUp = true;

    if (timeoutId) {
      clearTimeout(timeoutId);
      timeoutId = null;
    }

    if (document.body.contains(iframe)) {
      document.body.removeChild(iframe);
    }
    URL.revokeObjectURL(blobUrl);
    window.removeEventListener("message", handleMessage);
  };

  // Listen for print completion message from iframe
  const handleMessage = (event: MessageEvent) => {
    if (event.data === "print-complete") {
      cleanup();
      onSuccess?.();
    }
  };

  window.addEventListener("message", handleMessage);

  // Handle iframe load errors
  iframe.onerror = () => {
    cleanup();
    onError?.("Failed to load print content. Please try again.");
  };

  // Set iframe source and add to DOM
  iframe.src = blobUrl;
  document.body.appendChild(iframe);

  // Fallback cleanup in case message never arrives
  timeoutId = setTimeout(() => {
    cleanup();
  }, timeout);

  return { cleanup };
}
