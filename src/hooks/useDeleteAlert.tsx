"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";

type DeleteAlertData = {
    success: boolean;
    message: string;
};

interface DeleteAlertPayload {
    id: string;
}

export const useDeleteAlert = (props?: UseHookProps<DeleteAlertPayload, Partial<UseMutationOptions<DeleteAlertData, Error, DeleteAlertPayload>>>) => {
    return useMutation({
        mutationKey: ["deleteAlert"],
        mutationFn: async (payload) => {
            const { id } = payload;
            const response = await serverAxios.delete(`/alert-engine/alerts/${id}`);
            return response.data;
        },
        onSuccess: (data) => {
            toaster.success({
                title: "Alert deleted successfully",
            });
        },
        onError: (error) => {
            toaster.error({
                title: "Failed to delete alert",
                description: error.message,
            });
        },
        ...props?.options,
    });
};
