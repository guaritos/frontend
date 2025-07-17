"use client";

import { useGetRulesByUserId } from "@/hooks";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { For, Skeleton, StackProps, VStack } from "@chakra-ui/react";
import { RuleBasedCard } from "../../_components/RuleBasedCard";
import { EmptyContent } from "@/components/global/misc";

interface Props extends StackProps {
}
export const AllOwnerRulesContainer: React.FC<Props> = ({ children, ...props }) => {
    const { account } = useWallet();
    const { data, isLoading, error } = useGetRulesByUserId({
        payload: {
            userId: account?.address.toString(),
        },
        options: {
            staleTime: 1000 * 60 * 1,
        },
    });

    if (isLoading) {
        return (
            <VStack
                w={"full"}
                h={"full"}
                align={"center"}
                justifyContent={"center"}
            >
                <Skeleton rounded={"2xl"} w={"full"} h={"full"} bg={"bg.emphasized/25"} border={"1px solid"} borderColor={"border"} />
            </VStack>
        );
    }
    return (
        <VStack
            w={"full"}
            h={"full"}
            maxW={"2xl"}
            {...props}
        >
            <For
                each={data}
                fallback={
                    <EmptyContent
                        title="No Rules Found"
                        description="You have not created any rules yet."
                    />
                }
            >
                {(rule) => (
                    <RuleBasedCard
                        key={rule.id}
                        rule={rule}
                    />
                )}
            </For>
        </VStack>
    );
};