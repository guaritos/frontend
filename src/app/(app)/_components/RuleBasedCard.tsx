"use client";

import { Button, DrawerRootProps, Heading, HStack, Icon, Span, StackProps, Text, VStack } from "@chakra-ui/react";
import { ruleSchema } from "@/zodScheme/ruleBased";
import z from "zod";
import { HiPlus } from "react-icons/hi";
import { DrawerActionTrigger, DrawerBody, DrawerContent, DrawerHeader, DrawerRoot, DrawerTrigger } from "@/components/ui/drawer";
import { Tag } from "@/components/ui/tag";

interface Props extends StackProps {
    rule: z.infer<typeof ruleSchema>;
}

export const RuleBasedCard = ({ rule, children, ...props }: Props) => {
    return (
        <VStack align={"start"} p={"4"} rounded={"2xl"} border={"1px solid"} borderColor={"border.emphasized"} bg={"#474747/25"} backdropFilter={"auto"} backdropBlur={"64px"} {...props}>
            <VStack align={"start"} w={"full"} gap={"0"}>
                <Text color={"fg.subtle"}>
                    #{rule.id}
                </Text>
                <Heading as={"h6"} size="md" fontWeight={"semibold"}>
                    {rule.name}
                </Heading>
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
            <DrawerTrigger asChild>
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
                                <Span color={"primary.900"}>Created by</Span> 0x123
                            </Tag>
                        </HStack>
                    </VStack>
                </DrawerHeader>
                <DrawerBody>

                </DrawerBody>
            </DrawerContent>
        </DrawerRoot>
    )
}