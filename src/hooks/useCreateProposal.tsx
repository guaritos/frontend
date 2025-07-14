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
        name: string;
        description: string;
        function_names: FunctionNames[];
        arg_names: string[][];
        arg_values: string[][];
        arg_types: string[][];
        start_time_sec: number;
        token_names: string[];
        property_versions: number[];
    };
}

export const useCreateProposal = (props?: UseHookProps<CreateProposalPayload, Partial<UseMutationOptions<CreateProposalData, Error, CreateProposalPayload>>>) => {
    const { account, signAndSubmitTransaction } = useWallet();

    return useMutation({
        mutationKey: ["createRule"],
        mutationFn: async (payload) => {
            const { data } = payload;

            if (!account) {
                throw new Error("Wallet account is not connected");
            }

            const tx = await signAndSubmitTransaction({
                data: {
                    function: `${contracts.GUARITOS_CONTRACT_ADDRESS}::nft_dao::create_proposal`,
                    functionArguments: [
                        contracts.GUARITOS_NFT_DAO_ADDRESS,
                        data.name,
                        data.description,
                        data.function_names,
                        data.arg_names,
                        data.arg_values,
                        data.arg_types,
                        data.start_time_sec,
                        data.token_names,
                        data.property_versions
                    ],
                },
            })

            const res = await aptosClient.waitForTransaction({
                transactionHash: tx.hash,
            })
            return res;
        },
        onSuccess: (data) => {
            toaster.success({
                title: "Rule created successfully",
            });
        },
        onError: (error) => {
            toaster.error({
                title: "Failed to create rule",
                description: error.message,
            });
        },
        ...props?.options,
    });
};