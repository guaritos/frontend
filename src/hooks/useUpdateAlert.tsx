"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";

type UpdateAlertData = {
    id: string;
    ruleId: string;
    userId: string;
    message: string;
    severity: string;
    timestamp: string;
    status: string;
};

interface UpdateAlertPayload {
    id: string;
    data: {
        ruleId?: string;
        userId?: string;
        message?: string;
        severity?: string;
        status?: string;
    };
}

export const useUpdateAlert = (props?: UseHookProps<UpdateAlertPayload, Partial<UseMutationOptions<UpdateAlertData, Error, UpdateAlertPayload>>>) => {
    return useMutation({
        mutationKey: ["updateAlert"],
        mutationFn: async (payload) => {
            const { id, data } = payload;
            const response = await serverAxios.put(`/alert-engine/alerts/${id}`, data);
            return response.data;
        },
        onSuccess: (data) => {
            toaster.success({
                title: "Alert updated successfully",
            });
        },
        onError: (error) => {
            toaster.error({
                title: "Failed to update alert",
                description: error.message,
            });
        },
        ...props?.options,
    });
};
