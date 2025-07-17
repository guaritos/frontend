"use client";

import { RuleBasedCard } from "@/app/(app)/_components/RuleBasedCard";
import { EmptyContent } from "@/components/global/misc";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetRules } from "@/hooks";
import { useGetRulesTemplate } from "@/hooks/useGetRulesTemplate";
import { For, StackProps, VStack, Text } from "@chakra-ui/react";

interface Props extends StackProps {

}
export function AllRuleBasedContainer({ children, ...props }: Props) {
    const { data: rules, isLoading } = useGetRulesTemplate({
        options: {
            staleTime: 1000 * 60 * 1, // 1 minute
        }
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

    if (!rules || rules.length === 0) {
        return (
            <VStack
                w={"full"}
                h={"full"}
                align={"center"}
                justifyContent={"center"}
            >
                <EmptyContent
                    title="No Rules Found"
                    description="There are currently no rules available."
                />
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
                each={rules}
                fallback={
                    <VStack w={"full"} h={"full"} align={"center"}>
                        No rules found.
                    </VStack>
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
}