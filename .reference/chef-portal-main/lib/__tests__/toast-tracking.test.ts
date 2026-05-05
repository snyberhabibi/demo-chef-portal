import { describe, it, expect, vi, beforeEach } from "vitest";

const { mockCapture, mockCustom } = vi.hoisted(() => ({
  mockCapture: vi.fn(),
  mockCustom: vi.fn(),
}));

vi.mock("posthog-js", () => ({
  default: {
    __loaded: true,
    capture: (...args: unknown[]) => mockCapture(...args),
  },
}));

vi.mock("sonner", () => ({
  toast: {
    custom: mockCustom,
    dismiss: vi.fn(),
    message: vi.fn(),
    promise: vi.fn(),
  },
}));

vi.mock("@/components/ui/custom-toast", () => ({
  CustomToast: vi.fn(),
}));

// Stub window.location.pathname for the node test environment
vi.stubGlobal("window", { location: { pathname: "/dashboard/orders" } });

import { toast } from "@/components/ui/toast";
import posthog from "posthog-js";

describe("Toast PostHog Tracking", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (posthog as unknown as { __loaded: boolean }).__loaded = true;
  });

  describe("tracks toast events with correct properties", () => {
    it("tracks success toast", () => {
      toast.success("Order confirmed");

      expect(mockCapture).toHaveBeenCalledOnce();
      expect(mockCapture).toHaveBeenCalledWith("toast_displayed", {
        type: "success",
        title: "Order confirmed",
        description: undefined,
        page: "/dashboard/orders",
        portal: "chef",
      });
    });

    it("tracks error toast", () => {
      toast.error("Something went wrong");

      expect(mockCapture).toHaveBeenCalledOnce();
      expect(mockCapture).toHaveBeenCalledWith("toast_displayed", {
        type: "error",
        title: "Something went wrong",
        description: undefined,
        page: "/dashboard/orders",
        portal: "chef",
      });
    });

    it("tracks warning toast", () => {
      toast.warning("Low stock");

      expect(mockCapture).toHaveBeenCalledOnce();
      expect(mockCapture).toHaveBeenCalledWith("toast_displayed", {
        type: "warning",
        title: "Low stock",
        description: undefined,
        page: "/dashboard/orders",
        portal: "chef",
      });
    });

    it("tracks info toast", () => {
      toast.info("New feature available");

      expect(mockCapture).toHaveBeenCalledOnce();
      expect(mockCapture).toHaveBeenCalledWith("toast_displayed", {
        type: "info",
        title: "New feature available",
        description: undefined,
        page: "/dashboard/orders",
        portal: "chef",
      });
    });
  });

  describe("includes description when provided", () => {
    it("tracks success toast with description", () => {
      toast.success("Dish created", { description: "Your new dish is now live" });

      expect(mockCapture).toHaveBeenCalledWith("toast_displayed", {
        type: "success",
        title: "Dish created",
        description: "Your new dish is now live",
        page: "/dashboard/orders",
        portal: "chef",
      });
    });

    it("tracks error toast with description", () => {
      toast.error("Upload failed", { description: "File size exceeds 5MB limit" });

      expect(mockCapture).toHaveBeenCalledWith("toast_displayed", {
        type: "error",
        title: "Upload failed",
        description: "File size exceeds 5MB limit",
        page: "/dashboard/orders",
        portal: "chef",
      });
    });
  });

  describe("still renders the toast regardless of tracking", () => {
    it("calls sonner when tracking succeeds", () => {
      toast.success("Test toast");

      expect(mockCustom).toHaveBeenCalledOnce();
    });

    it("calls sonner when posthog is not loaded", () => {
      (posthog as unknown as { __loaded: boolean }).__loaded = false;

      toast.error("Error toast");

      expect(mockCapture).not.toHaveBeenCalled();
      expect(mockCustom).toHaveBeenCalledOnce();
    });

    it("calls sonner when posthog.capture throws", () => {
      mockCapture.mockImplementationOnce(() => {
        throw new Error("PostHog network error");
      });

      toast.warning("Warning toast");

      expect(mockCustom).toHaveBeenCalledOnce();
    });
  });

  describe("respects toast options", () => {
    it("passes custom duration to sonner", () => {
      toast.success("Quick toast", { duration: 1000 });

      expect(mockCustom).toHaveBeenCalledWith(expect.any(Function), {
        duration: 1000,
      });
    });

    it("uses default error duration of 4000ms", () => {
      toast.error("Error toast");

      expect(mockCustom).toHaveBeenCalledWith(expect.any(Function), {
        duration: 4000,
      });
    });

    it("uses default success duration of 3000ms", () => {
      toast.success("Success toast");

      expect(mockCustom).toHaveBeenCalledWith(expect.any(Function), {
        duration: 3000,
      });
    });
  });
});
