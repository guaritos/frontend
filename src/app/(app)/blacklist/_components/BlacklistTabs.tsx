"use client";

import contracts from "@/constants/contracts";
import { useGetOwnerBlacklist } from "@/hooks";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { TabsContent, TabsList, TabsRoot, TabsRootProps, TabsTrigger, VStack } from "@chakra-ui/react";

interface Props extends TabsRootProps { }
export const BlacklistTabs: React.FC<Props> = ({ children, ...props }) => {
    return (
        <TabsRoot defaultValue={"owner-blacklist"} colorPalette={"primary"} w={"fit"}>
            <TabsList>
                <TabsTrigger value="owner-blacklist">
                    Owner
                </TabsTrigger>
                <TabsTrigger value="dao-blacklist">
                    DAO
                </TabsTrigger>
            </TabsList>
            <TabsContent value="owner-blacklist">
                <OwnerBlacklistTab />
            </TabsContent>
            <TabsContent value="dao-blacklist">
                <DaoBlacklistTab />
            </TabsContent>
        </TabsRoot>
    );
};

const OwnerBlacklistTab: React.FC<Props> = ({ children, ...props }) => {
    const { account } = useWallet();

    const { data: blacklist, isLoading } = useGetOwnerBlacklist({
        payload: {
            owner: account?.address.toString() as string
        }
    })

    return (
        <VStack>

        </VStack>
    );
}

const DaoBlacklistTab: React.FC<Props> = ({ children, ...props }) => {
    const { data: blacklist, isLoading } = useGetOwnerBlacklist({
        payload: {
            owner: `${contracts.GUARITOS_NFT_DAO_ADDRESS}`
        }
    })

    return (
        <VStack>

        </VStack>
    );
}
