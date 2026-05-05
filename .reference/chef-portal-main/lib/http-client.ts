import posthog from "posthog-js";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestConfig extends Omit<RequestInit, "body"> {
  params?: Record<string, string | number | boolean>;
  timeout?: number;
  body?: unknown; // Allow any type - http-client will handle serialization
}

interface ApiResponse<T = unknown> {
  data: T;
  message?: string;
  status: number;
}

/**
 * Recursively extracts validation error messages from nested backend error details.
 * Handles structures like: { properties: { field: { errors: [...], items: [{ properties: { ... } }] } } }
 */
function extractNestedValidationErrors(
  details: unknown,
  path: string = ""
): string[] {
  if (!details || typeof details !== "object") return [];

  const obj = details as Record<string, unknown>;
  const messages: string[] = [];

  // Collect errors at this level
  if (Array.isArray(obj.errors) && obj.errors.length > 0) {
    for (const err of obj.errors) {
      if (typeof err === "string") {
        messages.push(path ? `${path}: ${err}` : err);
      }
    }
  }

  // Recurse into properties
  if (obj.properties && typeof obj.properties === "object") {
    const props = obj.properties as Record<string, unknown>;
    for (const [field, value] of Object.entries(props)) {
      const fieldPath = path ? `${path}.${field}` : field;
      messages.push(...extractNestedValidationErrors(value, fieldPath));
    }
  }

  // Recurse into items (array validation)
  if (Array.isArray(obj.items)) {
    obj.items.forEach((item, index) => {
      const itemPath = path ? `${path}[${index}]` : `[${index}]`;
      messages.push(...extractNestedValidationErrors(item, itemPath));
    });
  }

  return messages;
}

/**
 * Gets a user-friendly default error message based on HTTP status code
 */
function getDefaultErrorMessage(status: number): string {
  const statusMessages: Record<number, string> = {
    400: "Invalid request. Please check your input and try again.",
    401: "Invalid email or password. Please try again.",
    403: "You don't have permission to perform this action.",
    404: "The requested resource was not found.",
    409: "A conflict occurred. This resource may already exist.",
    422: "Please check your input and try again.",
    429: "Too many requests. Please try again later.",
    500: "Server error. Please try again later.",
    502: "Bad gateway. Please try again later.",
    503: "Service unavailable. Please try again later.",
  };

  return (
    statusMessages[status] || `An error occurred (${status}). Please try again.`
  );
}

/**
 * Tracks API requests to PostHog for debugging and observability.
 */
function trackApiRequest(properties: {
  request_url: string;
  request_method: HttpMethod;
  request_endpoint: string;
  request_payload_size?: number;
  response_status: number;
  response_time_ms: number;
  success: boolean;
  error_message?: string;
  error_category?: string;
  validation_errors?: string[];
  missing_fields?: string[];
}) {
  try {
    if (typeof window !== "undefined" && posthog.__loaded) {
      posthog.capture("chef_api_request", {
        ...properties,
        page: window.location.pathname,
        portal: "chef",
      });
    }
  } catch {
    // Silently fail — API tracking must never block requests
  }
}

/**
 * Estimates payload size in bytes without serializing large bodies twice.
 */
function estimatePayloadSize(body: unknown): number | undefined {
  if (!body) return undefined;
  if (body instanceof FormData) return undefined; // Can't cheaply estimate FormData
  if (typeof body === "string") return body.length;
  try {
    return JSON.stringify(body).length;
  } catch {
    return undefined;
  }
}

/**
 * Categorizes an HTTP status code for PostHog grouping.
 */
function categorizeStatus(status: number): string {
  if (status === 0) return "network";
  if (status === 401) return "authentication";
  if (status === 403) return "authorization";
  if (status === 404) return "not_found";
  if (status === 409) return "conflict";
  if (status === 422 || status === 400) return "validation";
  if (status === 429) return "rate_limit";
  if (status >= 500) return "server";
  return "unknown";
}

class HttpClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private timeout: number;

  constructor(baseURL: string = "/api") {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
    };
    this.timeout = 30000;
  }

  private buildURL(
    endpoint: string,
    params?: Record<string, string | number | boolean>
  ): string {
    const url =
      endpoint.startsWith("http") || endpoint.startsWith("/")
        ? endpoint
        : `${this.baseURL}${endpoint}`;

    if (!params || Object.keys(params).length === 0) {
      return url;
    }

    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });

    const queryString = searchParams.toString();
    return queryString ? `${url}?${queryString}` : url;
  }

  private async fetchWithTimeout(
    url: string,
    config: RequestInit,
    timeout: number
  ): Promise<Response> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(url, {
        ...config,
        signal: controller.signal,
        credentials: "include",
      });
      clearTimeout(timeoutId);
      return response;
    } catch (error) {
      clearTimeout(timeoutId);
      if (error instanceof Error && error.name === "AbortError") {
        throw new Error("Request timeout");
      }
      throw error;
    }
  }

  private async handleResponse<T>(response: Response): Promise<ApiResponse<T>> {
    const contentType = response.headers.get("content-type");
    const isJson = contentType?.includes("application/json");

    let data: T;
    try {
      data = isJson
        ? await response.json()
        : ((await response.text()) as unknown as T);
    } catch {
      data = {} as T;
    }

    if (!response.ok) {
      const errorData = data as {
        message?: string;
        error?: string;
        errors?: Record<string, string[]> | string[];
        missingFields?: string[];
        detail?: string;
        details?: unknown;
      };

      let errorMessage =
        errorData?.message ||
        errorData?.error ||
        errorData?.detail ||
        getDefaultErrorMessage(response.status);

      if (
        errorMessage.includes("Supabase") ||
        errorMessage.includes("AuthRetryableFetchError") ||
        errorMessage.includes("fetch failed")
      ) {
        if (errorMessage.includes("fetch failed")) {
          errorMessage =
            "Unable to connect to authentication service. The backend server may not be able to reach Supabase. Please check backend configuration and network connectivity.";
        } else {
          errorMessage =
            "Authentication service error. Please contact support if this issue persists.";
        }
      }

      // Extract validation errors from details
      // Backend formats:
      //   - Array of strings: { error: "Validation failed", details: ["leadTime is required"] }
      //   - Nested object: { error: "Validation error", details: { properties: { field: { errors: [...] } } } }
      let extractedValidationErrors: string[] = [];

      if (errorData?.details) {
        if (Array.isArray(errorData.details)) {
          // details is a string array — use directly
          extractedValidationErrors = errorData.details.filter(
            (d): d is string => typeof d === "string"
          );
        } else if (typeof errorData.details === "object") {
          extractedValidationErrors = extractNestedValidationErrors(errorData.details);
        }
      }

      if (errorData?.missingFields && Array.isArray(errorData.missingFields)) {
        errorMessage =
          errorData.message ||
          `Missing required fields: ${errorData.missingFields.join(", ")}`;
      } else if (extractedValidationErrors.length > 0) {
        errorMessage = extractedValidationErrors.join(" · ");
      } else if (errorData?.errors) {
        if (Array.isArray(errorData.errors)) {
          errorMessage = errorData.errors.join(", ");
        } else if (typeof errorData.errors === "object") {
          const messages = Object.entries(errorData.errors).flatMap(
            ([field, messages]) =>
              Array.isArray(messages)
                ? messages.map((msg) => `${field}: ${msg}`)
                : [`${field}: ${messages}`]
          );
          errorMessage = messages.join(", ") || errorMessage;
        }
      }

      const error = new Error(errorMessage) as Error & {
        status: number;
        data: T;
        missingFields?: string[];
        validationErrors?: string[];
      };
      error.status = response.status;
      error.data = data;

      if (errorData?.missingFields) {
        error.missingFields = errorData.missingFields;
      }
      if (extractedValidationErrors.length > 0) {
        error.validationErrors = extractedValidationErrors;
      } else if (Array.isArray(errorData?.errors)) {
        error.validationErrors = errorData.errors;
      }

      throw error;
    }

    const responseData = data as { message?: string };
    return {
      data,
      status: response.status,
      message: responseData?.message,
    };
  }

  private async request<T>(
    endpoint: string,
    method: HttpMethod,
    config: RequestConfig = {}
  ): Promise<ApiResponse<T>> {
    const {
      params,
      timeout = this.timeout,
      headers = {},
      body,
      ...restConfig
    } = config;

    const url = this.buildURL(endpoint, params);
    const startTime = Date.now();
    const payloadSize = estimatePayloadSize(body);

    const isFormData = body instanceof FormData;

    const requestHeaders: HeadersInit = {
      ...(isFormData ? {} : this.defaultHeaders),
      ...headers,
    };

    const requestConfig: RequestInit = {
      method,
      headers: requestHeaders,
      ...restConfig,
    };

    if (body && method !== "GET") {
      if (isFormData) {
        requestConfig.body = body;
      } else if (
        typeof body === "string" ||
        body instanceof Blob ||
        body instanceof ArrayBuffer ||
        body instanceof URLSearchParams
      ) {
        requestConfig.body = body;
      } else {
        requestConfig.body = JSON.stringify(body);
      }
    }

    try {
      const response = await this.fetchWithTimeout(url, requestConfig, timeout);
      const result = await this.handleResponse<T>(response);

      // Track successful request
      trackApiRequest({
        request_url: url,
        request_method: method,
        request_endpoint: endpoint,
        request_payload_size: payloadSize,
        response_status: response.status,
        response_time_ms: Date.now() - startTime,
        success: true,
      });

      return result;
    } catch (error) {
      // 401 retry: attempt session refresh and retry once
      if (
        error instanceof Error &&
        "status" in error &&
        (error as Error & { status: number }).status === 401
      ) {
        try {
          const { refreshSessionAction } = await import("@/actions/auth");
          const result = await refreshSessionAction();
          if (result.success) {
            // Retry the original request with fresh cookies
            const retryResponse = await this.fetchWithTimeout(url, requestConfig, timeout);
            const retryResult = await this.handleResponse<T>(retryResponse);

            trackApiRequest({
              request_url: url,
              request_method: method,
              request_endpoint: endpoint,
              request_payload_size: payloadSize,
              response_status: retryResponse.status,
              response_time_ms: Date.now() - startTime,
              success: true,
            });

            return retryResult;
          }
        } catch {
          // Refresh failed — fall through to original error
        }
      }

      // Extract error details for tracking
      const apiError = error as Error & {
        status?: number;
        validationErrors?: string[];
        missingFields?: string[];
      };
      const status = apiError.status || 0;

      if (error instanceof Error) {
        if (
          error.message.includes("fetch failed") ||
          error.message.includes("Failed to fetch") ||
          error.name === "TypeError" ||
          error.name === "NetworkError" ||
          error.name === "AbortError"
        ) {
          const isLocalhost = url.includes("localhost") || url.includes("127.0.0.1");
          const networkError = isLocalhost && error.message.includes("fetch failed")
            ? new Error(
                "Unable to connect to the server. Please make sure the backend server is running on http://localhost:3000"
              )
            : new Error(
                "Network error. Please check your internet connection and ensure the server is accessible."
              );

          trackApiRequest({
            request_url: url,
            request_method: method,
            request_endpoint: endpoint,
            request_payload_size: payloadSize,
            response_status: 0,
            response_time_ms: Date.now() - startTime,
            success: false,
            error_message: networkError.message,
            error_category: "network",
          });

          throw networkError;
        }

        // Track API/validation errors
        trackApiRequest({
          request_url: url,
          request_method: method,
          request_endpoint: endpoint,
          request_payload_size: payloadSize,
          response_status: status,
          response_time_ms: Date.now() - startTime,
          success: false,
          error_message: error.message,
          error_category: categorizeStatus(status),
          validation_errors: apiError.validationErrors,
          missing_fields: apiError.missingFields,
        });

        throw error;
      }
      throw new Error("An unexpected error occurred");
    }
  }

  async get<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "GET", config);
  }

  async post<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "POST", { ...config, body });
  }

  async put<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PUT", { ...config, body });
  }

  async patch<T>(
    endpoint: string,
    body?: unknown,
    config?: Omit<RequestConfig, "body">
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "PATCH", { ...config, body });
  }

  async delete<T>(
    endpoint: string,
    config?: RequestConfig
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, "DELETE", config);
  }

}

export const http = new HttpClient();

export type { ApiResponse, RequestConfig };
export { HttpClient };
