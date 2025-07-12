"use client";

import { siteConfig } from "@/configs/site";
import { Stack, StackProps, Image, Heading, HStack } from "@chakra-ui/react";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";
import NextImage from "next/image";
import { ConnectWalletButton } from "./wallet";

interface HeaderProps extends HTMLChakraProps<"header"> {
}
const Brand = (props: StackProps) => {
    return (
        <Stack flexDirection={"row"} align={"center"} {...props}>
            <Image asChild>
                <NextImage
                    src="/brands/logo-favicon.svg"
                    alt="Guaritos Favicon Logo"
                    width={48}
                    height={48}
                />
            </Image>
            <Heading as="h1" size="2xl" fontWeight={"bold"}>
                {siteConfig.name}
            </Heading>
        </Stack>
    )
}

export function Header({ children, ...props }: HeaderProps) {
    return (
        <chakra.header w={"full"} p={["2", "4"]} {...props}>
            <HStack justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                <Brand />
                <ConnectWalletButton />
            </HStack>
        </chakra.header>
    );
}
