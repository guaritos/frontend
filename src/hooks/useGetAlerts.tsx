"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

type GetAlertsData = {
    id: string;
    ruleId: string;
    userId: string;
    message: string;
    severity: string;
    timestamp: string;
    status: string;
}[];

export const useGetAlerts = (props?: UseHookProps<void, Partial<UseQueryOptions<GetAlertsData, Error>>>) => {
    return useQuery<GetAlertsData, Error>({
        queryKey: ["getAlerts"],
        queryFn: async (): Promise<GetAlertsData> => {
            const response = await serverAxios.get("/alert-engine/alerts");
            return response.data;
        },
        ...props?.options,
    });
};
