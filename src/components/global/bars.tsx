"use client";

import { siteConfig } from "@/configs/site";
import { Stack, StackProps, Image, Heading, HStack, Button, Icon, Link, VStack, Input, For, IconButton, Avatar, AvatarIcon, PopoverRootProps } from "@chakra-ui/react";
import { chakra, HTMLChakraProps, Text } from "@chakra-ui/react";
import NextImage from "next/image";
import { PiGraph } from "react-icons/pi";
import { TbLayoutDashboard } from "react-icons/tb";
import { TbWorld } from "react-icons/tb";
import { RxDividerHorizontal } from "react-icons/rx";

import { ConnectWalletButton } from "./wallet";
import { HiPlus } from "react-icons/hi";
import { usePathname } from "next/navigation";
import { Tooltip } from "../ui/tooltip";
import { FaBan } from "react-icons/fa";
import { PopoverBody, PopoverContent, PopoverRoot, PopoverTrigger } from "../ui/popover";
import { useWallet } from "@aptos-labs/wallet-adapter-react";

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
    const paths = [
        {
            label: "Home",
            href: "/",
        },
        {
            label: "Docs",
            href: "/docs",
        },
        {
            label: "Presentation",
            href: "https://wynnback.my.canva.site/guaritos",
        }
    ]
    return (
        <chakra.header w={"full"} p={["2", "4"]} {...props}>
            <HStack justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                <Brand />
                <HStack gap={"4"} justify={"end"}>
                    <For each={paths}>
                        {(path) => (
                            <Link key={path.href} href={path.href} color={"fg"} target="_blank">
                                {path.label}
                            </Link>
                        )}
                    </For>
                </HStack>
                <ConnectWalletButton />
            </HStack>
        </chakra.header>
    );
}

export function DashboardHeader({ children, ...props }: HeaderProps) {
    return (
        <chakra.header w={"full"} p={["2", "4"]} {...props}>
            <HStack justifyContent={"space-between"} alignItems={"center"} w={"full"}>
                <Input rounded={"lg"} size={"sm"} maxW={"md"} placeholder="Search here" />
                <HStack>
                    <Link href={"/rule/create"}>
                        <Button colorPalette={"default"} rounded={"full"}>
                            <Icon as={PiGraph} />
                            Publish tracer
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
            href: "/rule",
            label: "Templates",
            icon: TbWorld,
        },
        {
            href: "/blacklist",
            label: "Blacklist",
            icon: FaBan,
        }
    ];

    const isActive = (href: string) => pathname.includes(href);

    return (
        <chakra.aside
            h={"full"} w={"16"} p={["2", "4"]}
            borderRight={"1px solid"}
            borderColor={"border"}
            {...props}
        >
            <VStack justifyContent={"space-between"} alignItems={"center"} w={"full"} h={"full"}>
                <Image asChild>
                    <NextImage
                        src="/brands/logo-favicon.svg"
                        alt="Guaritos Favicon Logo"
                        width={48}
                        height={48}
                    />
                </Image>
                <Icon as={RxDividerHorizontal} color={"fg.muted"} />
                <VStack flex={1}>
                    <For each={links}>
                        {(link) => (
                            <Link href={link.href} key={link.href}>
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
                <WalletAvatar />
            </VStack>
        </chakra.aside>
    );
}

interface WalletAvatarProps extends Omit<PopoverRootProps, "children"> {

}
export const WalletAvatar = ({ ...props }: WalletAvatarProps) => {
    const { account } = useWallet();


    return (
        <PopoverRoot size={"lg"} {...props}>
            <PopoverTrigger asChild>
                <Avatar.Root variant={"solid"} colorPalette={"primary"}>
                    <Avatar.Icon />
                </Avatar.Root>
            </PopoverTrigger>
            <PopoverContent
                rounded={"2xl"}
                border={"1px solid"}
                borderColor={"border.emphasized"}
                bg={"#474747/25"}
                backdropFilter={"blur(64px)"}
                positionAnchor={"top"}
            >
                <PopoverBody>
                    {
                        account ? (
                            <VStack align={"start"} w={"full"}>
                                <Tooltip
                                    content={account.address.toString()}
                                    positioning={{
                                        placement: "right"
                                    }}
                                    contentProps={{
                                        colorPalette: "primary"
                                    }}
                                >
                                    <Text fontSize="sm" color={"primary.solid"}>
                                        {`${account.address.toString().slice(0, 6)}...${account.address.toString().slice(-3)}`}
                                    </Text>
                                </Tooltip>
                                <Text fontSize="xs" color="fg.muted">Connected</Text>
                            </VStack>
                        ) : (
                            <VStack>
                                <Text fontSize="sm" fontWeight="bold">Not Connected</Text>
                                <Text fontSize="xs" color="fg.muted">Please connect your wallet</Text>
                                <ConnectWalletButton />
                            </VStack>
                        )
                    }
                </PopoverBody>
            </PopoverContent>
        </PopoverRoot>
    )
}