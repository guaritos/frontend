"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useGetOwnerBlacklist } from "@/hooks";
import { useToAddOwnerBlacklist } from "@/hooks/useAddToOwnerBlacklist";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Badge, Button, Center, For, HStack, Icon, Input, StackProps, Text, VStack } from "@chakra-ui/react";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { HiPlus } from "react-icons/hi";

interface Props extends StackProps { }
export const OwnerBlacklistTab: React.FC<Props> = ({ children, ...props }) => {
    const { account } = useWallet();

    const { data: blacklist, isLoading } = useGetOwnerBlacklist({
        payload: {
            owner: account?.address.toString() as string
        },
        options: {
            queryKey: ["ownerBlacklist", account?.address],
            staleTime: 1000 * 60 * 5, // 5 minutes
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

    return (
        <Center w={"full"} h={"full"} gap={"8"} {...props}>
            <VStack maxW={"2xl"} w={"full"} gap={"4"}>
                <AddToBlacklist blacklist={blacklist} />
                <VStack w={"full"} gap={"4"}>
                    <For each={blacklist?.addresses} fallback={<Text>No blacklisted addresses</Text>}>
                        {(address) => <BlacklistedAddressCard key={address} address={address} />}
                    </For>
                </VStack>
            </VStack>
        </Center>
    );
};

interface AddToBlacklistProps extends StackProps {
    blacklist?: {
        addresses: string[];
    };
}

const AddToBlacklist = ({ children, blacklist, ...props }: AddToBlacklistProps) => {
    const queryClient = useQueryClient();
    const { account } = useWallet();
    const { mutate: addToBlacklist, isPending } = useToAddOwnerBlacklist({
        options: {
            onSuccess: () => {
                queryClient.invalidateQueries({
                    queryKey: ["ownerBlacklist", account?.address],
                });
            },
        }
    });
    const [address, setAddress] = useState("");

    return (
        <HStack
            align={"center"}
            justify={"space-between"}
            w={"full"}
            h={"full"}
            {...props}
        >
            <Button
                colorPalette={"primary"}
                rounded={"full"}
                loading={isPending}
                loadingText="Adding..."
                onClick={() => {
                    if (address) {
                        addToBlacklist({ data: { address } });
                        setAddress("");
                    }
                }}
            >
                Add to Blacklist
            </Button>
            <Badge rounded={"full"}>
                {blacklist?.addresses.length} addresses
            </Badge>
            <Input
                rounded={"lg"}
                size={"sm"}
                maxW={"md"}
                placeholder="Enter address to blacklist"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
            />
        </HStack>
    );
}

interface BlacklistProps extends StackProps {
    address: string;
}

const BlacklistedAddressCard: React.FC<{ address: string }> = ({ address }: BlacklistProps) => {
    return (
        <HStack
            cursor={"pointer"}
            w={"full"}
            align={"start"}
            p={"4"}
            rounded={"2xl"}
            border={"1px solid"}
            borderColor={"border.emphasized"}
            bg={"#474747/25"}
            backdropFilter={"auto"}
            backdropBlur={"64px"}
            transition={"all 0.3s ease-in-out"}
            alignItems={"center"}
            _hover={{
                borderColor: "primary.solid",
                scale: 1.02,
            }}
        >
            <Text color={"fg"} fontSize={"md"} w={"full"} textOverflow={"ellipsis"} overflow={"hidden"}>
                {address}
            </Text>
            <Button rounded={"full"} colorPalette={"red"}>
                Remove
            </Button>
        </HStack>
    );
}