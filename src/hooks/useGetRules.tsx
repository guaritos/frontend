import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

type GetRulesData = any[];

interface GetRulesPayload {
    userId?: string;
}

export const useGetRules = (props?: UseHookProps<GetRulesPayload, Partial<UseQueryOptions<GetRulesData, Error>>>) => {
    return useQuery<GetRulesData, Error>({
        queryKey: ["getRules"],
        queryFn: async (): Promise<GetRulesData> => {
            const response = await serverAxios.get("/rule-engine/rules");
            return response.data;
        },
        ...props?.options,
    });
};

export const useGetRulesByUserId = (props: UseHookProps<GetRulesPayload, Partial<UseQueryOptions<GetRulesData, Error>>>) => {
    return useQuery<GetRulesData, Error>({
        queryKey: ["getRulesByUserId", props.payload?.userId],
        queryFn: async (): Promise<GetRulesData> => {
            if (!props.payload?.userId) {
                throw new Error("User ID is required");
            }
            const response = await serverAxios.get(`/rule-engine/rules/${props.payload.userId}`);
            return response.data;
        },
        enabled: !!props.payload?.userId,
        ...props?.options,
    });
};
