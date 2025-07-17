"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

type GetRulesData = any[];

interface GetRulesPayload {
}

export const useGetRulesTemplate = (props?: UseHookProps<GetRulesPayload, Partial<UseQueryOptions<GetRulesData, Error>>>) => {
    return useQuery<GetRulesData, Error>({
        queryKey: ["getRules"],
        queryFn: async (): Promise<GetRulesData> => {
            const response = await serverAxios.get("/rule-engine/rules/template");
            return response.data;
        },
        ...props?.options,
    });
};