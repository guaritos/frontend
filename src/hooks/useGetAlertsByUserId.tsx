"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

type GetAlertsByUserIdData = {
    id: string;
    ruleId: string;
    userId: string;
    message: string;
    severity: string;
    timestamp: string;
    status: string;
}[];

interface GetAlertsByUserIdPayload {
    userId: string;
}

export const useGetAlertsByUserId = (props?: UseHookProps<GetAlertsByUserIdPayload, Partial<UseQueryOptions<GetAlertsByUserIdData, Error>>>) => {
    const { userId } = props?.payload || {};

    if (!props?.payload) {
        throw new Error("Payload is required for useGetAlertsByUserId hook");
    }

    return useQuery<GetAlertsByUserIdData, Error>({
        queryKey: ["getAlertsByUserId", userId],
        queryFn: async (): Promise<GetAlertsByUserIdData> => {
            const response = await serverAxios.get(`/alert-engine/alerts/user/${userId}`);
            return response.data;
        },
        ...props?.options,
    });
};
