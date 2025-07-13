"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseQueryOptions, UseQueryResult, useQuery } from "@tanstack/react-query";
import contracts from "@/constants/contracts";
import { aptosClient } from "@/utils/aptosClient";

type GetDaoBlacklistData = any;

interface GetDaoBlacklistPayload {
}

export const useGetDaoBlacklist = (props?: UseHookProps<GetDaoBlacklistPayload, Partial<UseQueryOptions<GetDaoBlacklistData, Error>>>) => {
    return useQuery<GetDaoBlacklistData, Error>({
        queryKey: ["getDaoBlacklist", contracts.GUARITOS_DAO_BLACKLIST_ADDRESS],
        queryFn: async (): Promise<GetDaoBlacklistData> => {
            
            const res = await aptosClient.getAccountResource({
                accountAddress: contracts.GUARITOS_CONTRACT_ADDRESS,
                resourceType: `${contracts.GUARITOS_DAO_BLACKLIST_ADDRESS}::nft_blacklist::Blacklist`,
            })

            console.log("DaoBlacklist res:", res);

            return res.object_address;
        },
        ...props?.options,
    });
};
