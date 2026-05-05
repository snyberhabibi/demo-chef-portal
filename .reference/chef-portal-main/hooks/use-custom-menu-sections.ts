import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  customMenuSectionsService,
  type CreateCustomMenuSectionData,
  type UpdateCustomMenuSectionData,
} from "@/services/custom-menu-sections.service";
import { useAnalytics } from "@/hooks/use-analytics";

export function useCustomMenuSections() {
  return useQuery({
    queryKey: ["custom-menu-sections"],
    queryFn: async () => {
      const response = await customMenuSectionsService.getCustomMenuSections();
      // response.data is { data: [...], total: number }
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useCustomMenuSection(id: string) {
  return useQuery({
    queryKey: ["custom-menu-sections", id],
    queryFn: async () => {
      const response = await customMenuSectionsService.getCustomMenuSectionById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateCustomMenuSection() {
  const queryClient = useQueryClient();
  const { trackMenuSectionCreated } = useAnalytics();

  return useMutation({
    mutationFn: async (data: CreateCustomMenuSectionData) => {
      const response = await customMenuSectionsService.createCustomMenuSection(data);
      return { data: response.data, payload: data };
    },
    onSuccess: ({ data, payload }) => {
      trackMenuSectionCreated({
        sectionId: data?.id,
        sectionName: payload.name,
        isActive: payload.isActive,
        dishCount: payload.dishes?.length ?? 0,
      });
      queryClient.invalidateQueries({ queryKey: ["custom-menu-sections"] });
    },
  });
}

export function useUpdateCustomMenuSection() {
  const queryClient = useQueryClient();
  const { trackMenuSectionUpdated } = useAnalytics();

  return useMutation({
    mutationFn: async (data: UpdateCustomMenuSectionData & { id: string }) => {
      const response = await customMenuSectionsService.updateCustomMenuSection(data);
      return { data: response.data, payload: data };
    },
    onSuccess: ({ payload }, variables) => {
      trackMenuSectionUpdated({
        sectionId: variables.id,
        sectionName: payload.name,
        isActive: payload.isActive,
      });
      queryClient.invalidateQueries({ queryKey: ["custom-menu-sections"] });
      queryClient.invalidateQueries({ queryKey: ["custom-menu-sections", variables.id] });
    },
  });
}

export function useDeleteCustomMenuSection() {
  const queryClient = useQueryClient();
  const { trackMenuSectionDeleted } = useAnalytics();

  return useMutation({
    mutationFn: async (id: string) => {
      await customMenuSectionsService.deleteCustomMenuSection(id);
      return id;
    },
    onSuccess: (id) => {
      trackMenuSectionDeleted({ sectionId: id });
      queryClient.invalidateQueries({ queryKey: ["custom-menu-sections"] });
    },
  });
}

export function useToggleCustomMenuSectionStatus() {
  const queryClient = useQueryClient();
  const { trackMenuSectionToggled } = useAnalytics();

  return useMutation({
    mutationFn: async ({
      id,
      isActive,
    }: {
      id: string;
      isActive: boolean;
    }) => {
      const response =
        await customMenuSectionsService.updateCustomMenuSection({
          id,
          isActive,
        });
      return response.data;
    },
    onSuccess: (_, variables) => {
      trackMenuSectionToggled({
        sectionId: variables.id,
        isActive: variables.isActive,
      });
      queryClient.invalidateQueries({ queryKey: ["custom-menu-sections"] });
      queryClient.invalidateQueries({
        queryKey: ["custom-menu-sections", variables.id],
      });
    },
  });
}

