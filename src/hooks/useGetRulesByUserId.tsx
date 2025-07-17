"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";
import z from "zod";
import { ruleSchema } from "@/zodScheme/ruleBased";

type GetRulesByUserIdData = z.infer<typeof ruleSchema>[];

interface GetAlertByRuleIdPayload {
    userId: string;
}

export const useGetRulesByUserId = (props?: UseHookProps<GetAlertByRuleIdPayload, Partial<UseQueryOptions<GetRulesByUserIdData, Error>>>) => {
    const { userId } = props?.payload || {};

    if (!props?.payload) {
        throw new Error("Payload is required for useGetAlertByRuleId hook");
    }

    return useQuery<GetRulesByUserIdData, Error>({
        queryKey: ["getRulesByUserId", userId],
        queryFn: async (): Promise<GetRulesByUserIdData> => {
            const response = await serverAxios.get(`/alert-engine/alerts/rules/user/${userId}`);
            return response.data[0];
        },
        ...props?.options,
    });
};