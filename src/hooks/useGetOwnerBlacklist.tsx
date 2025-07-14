"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";
import contracts from "@/constants/contracts";
import { aptosClient } from "@/utils/aptosClient";

type GetDaoBlacklistData = {
    owner: string;
    addresses: string[];
    token_address: string;
};

interface GetDaoBlacklistPayload {
    owner: string;
}

export const useGetOwnerBlacklist = (props?: UseHookProps<GetDaoBlacklistPayload, Partial<UseQueryOptions<GetDaoBlacklistData, Error>>>) => {
    const { owner } = props?.payload || {};

    if (!props?.payload) {
        throw new Error("Payload is required for useGetOwnerBlacklist hook");
    }

    return useQuery<GetDaoBlacklistData, Error>({
        queryKey: ["getDaoBlacklist", owner],
        queryFn: async (): Promise<GetDaoBlacklistData> => {
            const res = await aptosClient.view({
                payload: {
                    function: `${contracts.GUARITOS_CONTRACT_ADDRESS}::nft_blacklist::get_blacklist_details`,
                    functionArguments: [owner],
                },
            })

            console.log("DaoBlacklist res:", {
                owner: res[0] as string,
                addresses: res[1] as string[],
                token_address: res[2] as string,
            });

            return {
                owner: res[0] as string,
                addresses: res[1] as string[],
                token_address: res[2] as string,
            };
        },
        ...props?.options,
    });
};
