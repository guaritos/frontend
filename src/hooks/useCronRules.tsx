import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery, UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";

type GetCronRulesData = any[];

// Hook for getting all scheduled cron rules
export const useGetCronRules = (props?: UseHookProps<undefined, Partial<UseQueryOptions<GetCronRulesData, Error>>>) => {
    return useQuery<GetCronRulesData, Error>({
        queryKey: ["getCronRules"],
        queryFn: async (): Promise<GetCronRulesData> => {
            const response = await serverAxios.get("/rule-engine/cron");
            return response.data;
        },
        ...props?.options,
    });
};

// Hook for removing a rule from scheduler
type RemoveRuleFromSchedulerData = {
    message: string;
}

interface RemoveRuleFromSchedulerPayload {
    ruleId: string;
}

export const useRemoveRuleFromScheduler = (props?: UseHookProps<RemoveRuleFromSchedulerPayload, Partial<UseMutationOptions<RemoveRuleFromSchedulerData, Error, RemoveRuleFromSchedulerPayload>>>) => {
    return useMutation({
        mutationKey: ["removeRuleFromScheduler"],
        mutationFn: async (payload) => {
            const response = await serverAxios.get(`/rule-engine/cron/${payload.ruleId}`);
            return response.data;
        },
        onSuccess: (data, variables) => {
            toaster.success({
                title: "Rule removed from scheduler",
                description: `Rule with ID ${variables.ruleId} has been removed from scheduler`,
            });
        },
        onError: (error) => {
            toaster.error({
                title: "Failed to remove rule from scheduler",
                description: error.message,
            });
        },
        ...props?.options,
    });
};
