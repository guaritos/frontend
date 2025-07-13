"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

type GetRuleData = any;

interface GetRulePayload {
    ruleId: string;
}

export const useGetRule = (props: UseHookProps<GetRulePayload, Partial<UseQueryOptions<GetRuleData, Error>>>) => {
    return useQuery<GetRuleData, Error>({
        queryKey: ["getRule", props.payload?.ruleId],
        queryFn: async (): Promise<GetRuleData> => {
            if (!props.payload?.ruleId) {
                throw new Error("Rule ID is required");
            }
            const response = await serverAxios.get(`/rule-engine/rules/${props.payload.ruleId}`);
            return response.data;
        },
        enabled: !!props.payload?.ruleId,
        ...props?.options,
    });
};
