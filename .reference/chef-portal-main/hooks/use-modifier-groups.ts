import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  modifierGroupsService,
  type CreateModifierGroupData,
  type UpdateModifierGroupData,
} from "@/services/modifier-groups.service";
import { useAnalytics } from "@/hooks/use-analytics";

export function useModifierGroups(chefUserId?: string) {
  return useQuery({
    queryKey: chefUserId
      ? ["modifier-groups", chefUserId]
      : ["modifier-groups"],
    queryFn: async () => {
      const response = await modifierGroupsService.getModifierGroups();
      return response.data;
    },
    staleTime: 30 * 1000, // 30 seconds
  });
}

export function useModifierGroup(id: string) {
  return useQuery({
    queryKey: ["modifier-groups", id],
    queryFn: async () => {
      const response = await modifierGroupsService.getModifierGroupById(id);
      return response.data;
    },
    enabled: !!id,
  });
}

export function useCreateModifierGroup() {
  const queryClient = useQueryClient();
  const { trackModifierGroupCreated } = useAnalytics();

  return useMutation({
    mutationFn: async (data: CreateModifierGroupData) => {
      const response = await modifierGroupsService.createModifierGroup(data);
      return { data: response.data, payload: data };
    },
    onSuccess: ({ data, payload }) => {
      trackModifierGroupCreated({
        groupId: data?.id,
        groupName: payload.name,
      });
      queryClient.invalidateQueries({ queryKey: ["modifier-groups"] });
    },
  });
}

export function useUpdateModifierGroup() {
  const queryClient = useQueryClient();
  const { trackModifierGroupUpdated } = useAnalytics();

  return useMutation({
    mutationFn: async ({
      id,
      ...data
    }: UpdateModifierGroupData & { id: string }) => {
      const response = await modifierGroupsService.updateModifierGroup(
        id,
        data
      );
      return { data: response.data, payload: data, id };
    },
    onSuccess: ({ payload, id }, variables) => {
      trackModifierGroupUpdated({
        groupId: id,
        groupName: payload.name,
      });
      queryClient.invalidateQueries({ queryKey: ["modifier-groups"] });
      queryClient.invalidateQueries({
        queryKey: ["modifier-groups", variables.id],
      });
    },
  });
}

export function useDeleteModifierGroup() {
  const queryClient = useQueryClient();
  const { trackModifierGroupDeleted } = useAnalytics();

  return useMutation({
    mutationFn: async (id: string) => {
      await modifierGroupsService.deleteModifierGroup(id);
      return id;
    },
    onSuccess: (id) => {
      trackModifierGroupDeleted({ groupId: id });
      queryClient.invalidateQueries({ queryKey: ["modifier-groups"] });
    },
  });
}
