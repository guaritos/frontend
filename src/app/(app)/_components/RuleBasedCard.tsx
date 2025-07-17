"use client";

import { Box, Button, DrawerRootProps, Heading, HStack, Icon, Span, StackProps, Text, VStack } from "@chakra-ui/react";
import { ruleSchema } from "@/zodScheme/ruleBased";
import z from "zod";
import { HiPlus } from "react-icons/hi";
import { DrawerActionTrigger, DrawerBody, DrawerContent, DrawerHeader, DrawerRoot, DrawerTrigger } from "@/components/ui/drawer";
import { Tag } from "@/components/ui/tag";
import { useGetOwnerBlacklist } from "@/hooks/useGetOwnerBlacklist";
import contracts from "@/constants/contracts";
import { useEffect } from "react";
import JsonView from "@uiw/react-json-view";
import { darkTheme } from "@uiw/react-json-view/dark";
import { Field } from "@/components/ui/field";
import { useRouter } from "next/navigation";

interface Props extends StackProps {
    rule: z.infer<typeof ruleSchema>;
}

export const RuleBasedCard = ({ rule, ...props }: Props) => {
    const router = useRouter();
    const { data, error } = useGetOwnerBlacklist({
        payload: {
            owner: contracts.GUARITOS_NFT_DAO_ADDRESS
        }
    });

    useEffect(() => {
        console.log("Blacklist data:", error);
    }, [error]);

    return (
        <VStack
            cursor={"pointer"}
            w={"full"}
            align={"start"}
            p={"4"}
            rounded={"2xl"}
            border={"1px solid"}
            borderColor={"border.emphasized"}
            bg={"#474747/25"}
            backdropFilter={"blur(64px)"}
            transition={"all 0.3s ease-in-out"}
            _hover={{
                borderColor: "primary.solid",
                scale: 1.02,
            }}
            onClick={() => {
                router.push(`/rule/${rule.id}`);
            }}
            {...props}
        >
            <VStack align={"start"} w={"full"} gap={"0"}>
                <HStack w={"full"} gap={"4"}>
                    <Text color={"fg.subtle"}>
                        #{rule.id}
                    </Text>
                    {
                        rule.isTemplate && (
                            <>
                                <Tag variant={"surface"} colorPalette={"yellow"}>
                                    Template
                                </Tag>
                            </>
                        )
                    }
                    {
                        rule.enabled && (
                            <Box display={"flex"} justifyContent={"flex-end"} w={"full"}>
                                <Tag variant={"surface"} colorPalette={rule.enabled ? "green" : "red"}>
                                    {rule.enabled ? "Active" : "Disabled"}
                                </Tag>
                            </Box>
                        )
                    }
                </HStack>
                <Heading as={"h6"} size="md" fontWeight={"semibold"}>
                    {rule.name}
                </Heading>
                <Text fontSize={"sm"} color={"fg.subtle"}>
                    {rule.description || "-"}
                </Text>
            </VStack>
            <HStack w={"full"} justify={"space-between"}>
                <Button variant={"plain"} rounded={"full"} colorPalette={"default"} size={"xs"}>
                    <Icon as={HiPlus} />
                    Edit
                </Button>
                <RuleBasedDetailDrawer rule={rule} />
            </HStack>
        </VStack>
    );
}

interface RuleBasedDetailDrawerProps extends Omit<DrawerRootProps, "children"> {
    rule: z.infer<typeof ruleSchema>;
}

const RuleBasedDetailDrawer = ({ rule, ...props }: RuleBasedDetailDrawerProps) => {
    return (
        <DrawerRoot size={"md"}>
            <DrawerTrigger asChild onClick={(e) => e.stopPropagation()}>
                <Button rounded={"full"} size={"xs"} _active={{
                    scale: 0.975
                }}>
                    Explore
                </Button>
            </DrawerTrigger>
            <DrawerContent>
                <DrawerHeader>
                    <VStack w={"full"} align={"start"}>
                        <Text color={"fg.subtle"}>
                            #{rule.id}
                        </Text>
                        <Heading as={"h6"} size="2xl" fontWeight={"semibold"}>
                            {rule.name}
                        </Heading>
                        <HStack w={"full"}>
                            <Tag variant={"solid"} colorPalette={"primary"}>
                                Created by {rule.user_id}
                            </Tag>
                        </HStack>
                    </VStack>
                </DrawerHeader>
                <DrawerBody>
                    <VStack w={"full"} align={"start"} gap={"4"}>
                        <Text fontSize={"sm"} color={"fg.subtle"}>
                            {rule.description || "No description provided."}
                        </Text>
                        <Field label="Rule Details" w={"full"}>
                            <JsonView
                                value={rule}
                                style={{
                                    ...darkTheme,
                                    padding: "16px",
                                    maxHeight: "75vh",
                                    overflowY: "auto",
                                    borderRadius: "16px"
                                }} />
                        </Field>
                    </VStack>
                </DrawerBody>
            </DrawerContent>
        </DrawerRoot>
    )
}