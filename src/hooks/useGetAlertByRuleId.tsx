"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

type GetAlertByRuleIdData = {
    id: string;
    ruleId: string;
    userId: string;
    message: string;
    severity: string;
    timestamp: string;
    status: string;
}[];

interface GetAlertByRuleIdPayload {
    ruleId: string;
}

export const useGetAlertByRuleId = (props?: UseHookProps<GetAlertByRuleIdPayload, Partial<UseQueryOptions<GetAlertByRuleIdData, Error>>>) => {
    const { ruleId } = props?.payload || {};

    if (!props?.payload) {
        throw new Error("Payload is required for useGetAlertByRuleId hook");
    }

    return useQuery<GetAlertByRuleIdData, Error>({
        queryKey: ["getAlertByRuleId", ruleId],
        queryFn: async (): Promise<GetAlertByRuleIdData> => {
            const response = await serverAxios.get(`/alert-engine/alerts/rule/${ruleId}`);
            return response.data[0];
        },
        ...props?.options,
    });
};