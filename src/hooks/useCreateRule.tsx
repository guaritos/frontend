"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";

type CreateRuleData = {
    id: string;
}

interface CreateRulePayload {
    data: any;
}

export const useCreateRule = (props?: UseHookProps<CreateRulePayload, Partial<UseMutationOptions<CreateRuleData, Error, CreateRulePayload>>>) => {
    return useMutation({
        mutationKey: ["createRule"],
        mutationFn: async (payload) => {
            const response = await serverAxios.post("/rule-engine/rules", payload.data);
            return response.data;
        },
        onSuccess: (data) => {
            toaster.success({
                title: "Rule created successfully",
                description: `Rule ID: ${data.id}`,
            });
        },
        onError: (error) => {
            toaster.error({
                title: "Failed to create rule",
                description: error.message,
            });
        },
        ...props?.options,
    });
};