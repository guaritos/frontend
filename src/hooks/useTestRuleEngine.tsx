import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

type TestRuleEngineData = any[];

export const useTestRuleEngine = (props?: UseHookProps<undefined, Partial<UseQueryOptions<TestRuleEngineData, Error>>>) => {
    return useQuery<TestRuleEngineData, Error>({
        queryKey: ["testRuleEngine"],
        queryFn: async (): Promise<TestRuleEngineData> => {
            const response = await serverAxios.get("/rule-engine/test");
            return response.data;
        },
        enabled: false, // Manual trigger only
        ...props?.options,
    });
};
