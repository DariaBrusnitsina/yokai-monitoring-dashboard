"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { yokaiApi } from "@/shared/api";
import { Yokai } from "@/shared/model";

export const useYokaiList = () => {
  return useQuery({
    queryKey: ["yokai", "list"],
    queryFn: () => yokaiApi.getAll(),
    staleTime: 0,
    gcTime: 0,
    refetchOnMount: true,
    refetchOnWindowFocus: false,
  });
};

export const useCaptureYokai = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => yokaiApi.capture(id),
    onMutate: async (id) => {
      await queryClient.cancelQueries({ queryKey: ["yokai", "list"] });

      const previousYokai = queryClient.getQueryData<Yokai[]>([
        "yokai",
        "list",
      ]);

      queryClient.setQueryData<Yokai[]>(["yokai", "list"], (old) => {
        if (!old) return old;
        return old.map((yokai) =>
          yokai.id === id
            ? { ...yokai, status: "Captured" as const }
            : { ...yokai }
        );
      });

      return { previousYokai };
    },
    onSuccess: (data, id) => {
      queryClient.setQueryData<Yokai[]>(["yokai", "list"], (old) => {
        if (!old) return old;
        return old.map((yokai) =>
          yokai.id === id ? { ...data } : { ...yokai }
        );
      });
    },
    onError: (err, id, context) => {
      if (context?.previousYokai) {
        queryClient.setQueryData(["yokai", "list"], context.previousYokai);
      }
    },
  });
};

export const useResetYokai = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => yokaiApi.reset(),
    onSuccess: (data) => {
      // Update cache with reset data
      queryClient.setQueryData(["yokai", "list"], data);
    },
  });
};
