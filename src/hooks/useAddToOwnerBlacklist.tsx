"use client";

import { serverAxios } from "@/utils/serverAxios";
import { UseHookProps } from "./useGetTracer";
import { UseMutationOptions, UseMutationResult, useMutation } from "@tanstack/react-query";
import { toaster } from "@/components/ui/toaster";
import { aptosClient } from "@/utils/aptosClient";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { buildTransaction, CommittedTransactionResponse } from "@aptos-labs/ts-sdk";
import contracts from "@/constants/contracts";

type FunctionNames = "no_op" | "transfer_fund" | "offer_nft" | "add_to_blacklist" | "remove_from_blacklist";

type CreateProposalData = CommittedTransactionResponse;

interface CreateProposalPayload {
    data: {
        address: string;
    };
}

export const useToAddOwnerBlacklist = (props?: UseHookProps<CreateProposalPayload, Partial<UseMutationOptions<CreateProposalData, Error, CreateProposalPayload>>>) => {
    const { account, signAndSubmitTransaction } = useWallet();

    return useMutation({
        mutationKey: ["addToOwnerBlacklist"],
        mutationFn: async (payload) => {
            const { data } = payload;

            if (!account) {
                throw new Error("Wallet account is not connected");
            }

            const tx = await signAndSubmitTransaction({
                data: {
                    function: `${contracts.GUARITOS_CONTRACT_ADDRESS}::nft_blacklist::add_to_blacklist`,
                    functionArguments: [
                        data.address,
                    ]
                },
            })

            const res = await aptosClient.waitForTransaction({
                transactionHash: tx.hash,
            })
            return res;
        },
        onSuccess: (data) => {
            toaster.success({
                title: "Successfully added to blacklist",
            });
        },
        onError: (error) => {
            toaster.error({
                title: "Failed to add to blacklist",
                description: error.message,
            });
        },
        ...props?.options,
    });
};