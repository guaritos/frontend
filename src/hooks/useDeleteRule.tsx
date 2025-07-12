import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";

type DeleteRuleData = {
    message: string;
}

interface DeleteRulePayload {
    ruleId: string;
}

export const useDeleteRule = (props?: UseHookProps<DeleteRulePayload, Partial<UseMutationOptions<DeleteRuleData, Error, DeleteRulePayload>>>) => {
    return useMutation({
        mutationKey: ["deleteRule"],
        mutationFn: async (payload) => {
            const response = await serverAxios.delete(`/rule-engine/rule/${payload.ruleId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            toaster.success({
                title: "Rule deleted successfully",
                description: `Rule with ID ${variables.ruleId} has been deleted`,
            });
        },
        onError: (error) => {
            toaster.error({
                title: "Failed to delete rule",
                description: error.message,
            });
        },
        ...props?.options,
    });
};
