import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  dishesService,
  type DishesQueryParams,
  type CreateDishPayload,
} from "@/services/dishes.service";
import { useAnalytics } from "@/hooks/use-analytics";
export function useDishes(params?: DishesQueryParams) {
  return useQuery({
    queryKey: ["dishes", params],
    queryFn: async () => {
      const response = await dishesService.getDishes(params);
      return dishesService.transformDishesResponse(response.data);
    },
    staleTime: 30 * 1000,
  });
}

export function useDish(id: string) {
  return useQuery({
    queryKey: ["dishes", id],
    queryFn: async () => {
      const response = await dishesService.getDishById(id);
      return dishesService.transformDish(response.data);
    },
    enabled: !!id,
  });
}

export function useCreateDish() {
  const queryClient = useQueryClient();
  const { trackDishCreated } = useAnalytics();

  return useMutation({
    mutationFn: async (data: CreateDishPayload) => {
      // Use the actual API service
      // Backend returns minimal response: { id, name, slug, description, status, createdAt }
      const response = await dishesService.createDish(data);

      // Return response as-is since we just need the ID
      return { response, payload: data };
    },
    onSuccess: ({ response, payload }) => {
      // Track dish creation
      trackDishCreated({
        dishId: response.data?.id,
        dishName: payload.name,
        category: payload.category,
        status: payload.status || "draft",
        hasImages: (payload.images?.length ?? 0) > 0,
        portionCount: payload.portionSizes?.length ?? 0,
        hasModifiers: (payload.customizationGroups?.length ?? 0) > 0,
      });
      // Invalidate dishes queries to refetch
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
    onError: (error) => {
      // Error handling is done in the component via try/catch
      // but we can log it here for debugging
      console.error("Failed to create dish:", error);
    },
  });
}

export function useUpdateDish() {
  const queryClient = useQueryClient();
  const { trackDishUpdated, trackDishStatusChange } = useAnalytics();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateDishPayload>;
    }) => {
      // Use the actual API service
      const response = await dishesService.updateDish(id, data);
      return { response, id, payload: data };
    },
    onSuccess: ({ id, payload }) => {
      // Track dish update
      trackDishUpdated({
        dishId: id,
        dishName: payload.name,
        category: payload.category,
        status: payload.status,
        hasImages: payload.images !== undefined ? (payload.images?.length ?? 0) > 0 : undefined,
        portionCount: payload.portionSizes?.length,
        hasModifiers: payload.customizationGroups !== undefined ? (payload.customizationGroups?.length ?? 0) > 0 : undefined,
      });
      // Track status changes separately for better insights
      if (payload.status) {
        trackDishStatusChange(id, payload.name || "", payload.status);
      }
      // Invalidate dishes queries to refetch
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
      // Also invalidate the specific dish query used in edit page
      queryClient.invalidateQueries({ queryKey: ["dish", id, "edit"] });
      // Invalidate any other dish detail queries
      queryClient.invalidateQueries({ queryKey: ["dish", id] });
    },
    onError: (error) => {
      // Error handling is done in the component via try/catch
      // but we can log it here for debugging
      console.error("Failed to update dish:", error);
    },
  });
}

export function useDeleteDish() {
  const queryClient = useQueryClient();
  const { trackDishDeleted } = useAnalytics();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await dishesService.deleteDish(id);
      return { response, id };
    },
    onSuccess: ({ id }) => {
      // Track dish deletion
      trackDishDeleted({ dishId: id });
      // Invalidate dishes queries to refetch
      queryClient.invalidateQueries({ queryKey: ["dishes"] });
    },
    onError: (error) => {
      // Error handling is done in the component via try/catch
      console.error("Failed to delete dish:", error);
    },
  });
}

