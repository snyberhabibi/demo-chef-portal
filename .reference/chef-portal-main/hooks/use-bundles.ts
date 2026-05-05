import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bundlesService,
  type BundlesQueryParams,
  type CreateBundlePayload,
} from "@/services/bundles.service";

export function useBundles(params?: BundlesQueryParams) {
  return useQuery({
    queryKey: ["bundles", params],
    queryFn: async () => {
      const response = await bundlesService.getBundles(params);
      return bundlesService.transformBundlesResponse(response.data);
    },
    staleTime: 30 * 1000,
  });
}

export function useBundle(id: string) {
  return useQuery({
    queryKey: ["bundles", id],
    queryFn: async () => {
      const response = await bundlesService.getBundleById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: CreateBundlePayload) => {
      const response = await bundlesService.createBundle(data);
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
    },
    onError: (error) => {
      console.error("Failed to create bundle:", error);
    },
  });
}

export function useUpdateBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      data,
    }: {
      id: string;
      data: Partial<CreateBundlePayload>;
    }) => {
      const response = await bundlesService.updateBundle(id, data);
      return { response, id };
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
      queryClient.invalidateQueries({ queryKey: ["bundles", id] });
    },
    onError: (error) => {
      console.error("Failed to update bundle:", error);
    },
  });
}

export function useDeleteBundle() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (id: string) => {
      const response = await bundlesService.deleteBundle(id);
      return { response, id };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["bundles"] });
    },
    onError: (error) => {
      console.error("Failed to delete bundle:", error);
    },
  });
}
