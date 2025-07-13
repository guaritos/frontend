"use client";

import { siteConfig } from "@/configs/site";
import { Stack, StackProps, Image, Heading, HStack, Button, Icon, Link } from "@chakra-ui/react";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";
import NextImage from "next/image";
import { PiGraph } from "react-icons/pi";

import { ConnectWalletButton } from "./wallet";
import { HiPlus } from "react-icons/hi";

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

export function DashboardHeader({ children, ...props }: HeaderProps) {
    return (
        <chakra.header w={"full"} p={["2", "4"]} {...props}>
            <HStack justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                <Brand />
                <HStack>
                    <Link href={"/rule/create"}>
                        <Button variant={"outline"} colorPalette={"default"} rounded={"full"}>
                            <Icon as={HiPlus} />
                            Publish rule
                        </Button>
                    </Link>
                    <Link href={"/tracer/create"}>
                        <Button colorPalette={"default"} rounded={"full"}>
                            <Icon as={PiGraph} />
                            Create tracer
                        </Button>
                    </Link>
                </HStack>
            </HStack>
        </chakra.header>
    );
}

export function Sidebar({ children, ...props }: HeaderProps) {
    return (
        <chakra.aside w={"full"} p={["2", "4"]} {...props}>
            <HStack justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                <Brand />
                <ConnectWalletButton />
            </HStack>
        </chakra.aside>
    );
}