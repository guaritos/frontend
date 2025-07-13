"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";

type UpdateRuleData = {
    id: string;
}

interface UpdateRulePayload {
    ruleId: string;
    data: UpdateRuleData;
}

export const useUpdateRule = (props?: UseHookProps<UpdateRulePayload, Partial<UseMutationOptions<UpdateRuleData, Error, UpdateRulePayload>>>) => {
    return useMutation({
        mutationKey: ["updateRule"],
        mutationFn: async (payload) => {
            const response = await serverAxios.put(`/rule-engine/rules/${payload.ruleId}`, payload.data);
            return response.data;
        },
        onSuccess: (data) => {
            toaster.success({
                title: "Rule updated successfully",
                description: `Rule ID: ${data.id}`,
            });
        },
        onError: (error) => {
            toaster.error({
                title: "Failed to update rule",
                description: error.message,
            });
        },
        ...props?.options,
    });
};
