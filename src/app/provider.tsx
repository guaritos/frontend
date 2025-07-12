"use client";

import { Provider as UIProvider } from "@/components/ui/provider"
import aptos from "@/constants/aptos";
import { AptosWalletAdapterProvider } from "@aptos-labs/wallet-adapter-react";

export function Provider({ children }: { children: React.ReactNode }) {
    return (
        <UIProvider defaultTheme="dark">
            <AptosWalletAdapterProvider
                autoConnect={true}
                dappConfig={{
                    network: aptos.NETWORK,
                    aptosApiKeys: {
                        [aptos.NETWORK]: aptos.API_KEY,
                    }
                }}
                optInWallets={["Petra"]}
            >
                {children}
            </AptosWalletAdapterProvider>
        </UIProvider>
    )
}

