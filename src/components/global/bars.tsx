"use client";

import { siteConfig } from "@/configs/site";
import { Stack, StackProps, Image, Heading, HStack, Button, Icon, Link, VStack, Input, For, IconButton } from "@chakra-ui/react";
import { chakra, HTMLChakraProps } from "@chakra-ui/react";
import NextImage from "next/image";
import { PiGraph } from "react-icons/pi";
import { TbLayoutDashboard } from "react-icons/tb";
import { TbWorld } from "react-icons/tb";
import { RxDividerHorizontal } from "react-icons/rx";

import { ConnectWalletButton } from "./wallet";
import { HiPlus } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { Tooltip } from "../ui/tooltip";

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
                <Input />
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

interface DashboardSidebarProps extends HTMLChakraProps<"aside"> {
}
export function DashboardSidebar({ children, ...props }: DashboardSidebarProps) {
    const pathname = usePathname();

    const links = [
        {
            href: "/dashboard",
            label: "Dashboard",
            icon: TbLayoutDashboard,
        },
        {
            href: "/tracer/all",
            label: "Tracers",
            icon: PiGraph,
        },
        {
            href: "rule",
            label: "Templates",
            icon: TbWorld,
        },
    ];

    const isActive = (href: string) => pathname.includes(href);

    return (
        <chakra.aside
            h={"full"} w={"16"} p={["2", "4"]}
            borderRight={"1px solid"}
            borderColor={"border"}
            {...props}
        >
            <VStack justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                <Image asChild>
                    <NextImage
                        src="/brands/logo-favicon.svg"
                        alt="Guaritos Favicon Logo"
                        width={48}
                        height={48}
                    />
                </Image>
                <Icon as={RxDividerHorizontal} color={"fg.muted"} />
                <VStack>
                    <For each={links}>
                        {(link) => (
                            <Link asChild href={link.href} key={link.href}>
                                <Tooltip content={link.label}
                                    openDelay={100}
                                    closeDelay={100}
                                    contentProps={{
                                        transition: "all 0.3s ease-in-out",
                                    }}
                                    positioning={{
                                        placement: "right",
                                    }}
                                >
                                    <IconButton
                                        colorPalette={"default"}
                                        variant={"plain"}
                                        transition={"all 0.3s ease-in-out"}
                                        color={isActive(link.href) ? "fg" : "fg.muted"}
                                        _hover={{
                                            color: "fg"
                                        }}
                                    >
                                        <Icon size={"md"} as={link.icon} />
                                    </IconButton>
                                </Tooltip>
                            </Link>
                        )}
                    </For>
                </VStack>
            </VStack>
        </chakra.aside>
    );
}