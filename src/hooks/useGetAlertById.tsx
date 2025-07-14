"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";

type GetAlertByIdData = {
    id: number;
    rule_id: number;
    result: {
        queryResult: Array<{
            field: string;
            operator: string;
            expected: any;
            matched: any[];
        }>;
        aggregateResult: Array<{
            field: string;
            op: string;
            operator: string;
            expected: number;
            actual: number;
        }>;
    };
    data: {
        strategy_snap_shot_items: {
            source: string;
            alpha: number;
            beta: number;
            epsilon: number;
            r: Record<string, number>;
            p: Record<string, number>;
            weighted_edges: Array<{
                from: string;
                to: string;
                weight: number;
                symbol: string;
                hash: string;
                timestamp: number;
            }>;
        };
        rank_items: Record<string, number>;
    };
    created_at: string;
    updated_at: string | null;
    message: string;
    actions_fired: any[];
    status: string;
    rules: {
        id: number;
        name: string;
        tags: string;
        then: Array<{
            to: string[];
            body: string;
            type: string;
            subject: string;
        }>;
        when: {
            and: Array<{
                type: string;
                field: string;
                value: any;
                operator: string;
            }>;
        };
        source: string;
        enabled: boolean;
        user_id: string;
        interval: string;
        aggregate: Array<{
            op: string;
            type: string;
            field: string;
            value: number;
            operator: string;
        }>;
        created_at: string;
        deleted_at: string | null;
        description: string | null;
        is_template: boolean;
    };
};

interface GetAlertByIdPayload {
    id: string;
}

export const useGetAlertById = (props?: UseHookProps<GetAlertByIdPayload, Partial<UseQueryOptions<GetAlertByIdData, Error>>>) => {
    const { id } = props?.payload || {};

    if (!props?.payload) {
        throw new Error("Payload is required for useGetAlertById hook");
    }

    return useQuery<GetAlertByIdData, Error>({
        queryKey: ["getAlertById", id],
        queryFn: async (): Promise<GetAlertByIdData> => {
            const response = await serverAxios.get(`/alert-engine/alerts/${id}`);
            const alerts = response.data;
            
            // If response is an array, find the alert with matching ID
            if (Array.isArray(alerts)) {
                const alert = alerts.find((alert: any) => alert.id.toString() === id);
                if (!alert) {
                    throw new Error(`Alert with ID ${id} not found`);
                }
                return alert;
            }
            
            // If response is a single object, return it directly
            return alerts;
        },
        ...props?.options,
    });
};
