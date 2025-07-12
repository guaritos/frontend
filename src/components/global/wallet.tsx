"use client";

import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button, ButtonProps } from "@chakra-ui/react";

interface ConnecWalletProps extends ButtonProps {

}
export function ConnectWalletButton({ children, ...props }: ConnecWalletProps) {
    const { connect, disconnect, isLoading, connected } = useWallet();

    return (
        <Button
            rounded={"full"}
            colorPalette={connected ? "red" : "default"}
            loading={isLoading}
            loadingText="Connecting"
            onClick={connected ? disconnect : () => connect("Petra")}
            {...props}
        >
            {connected ? "Disconnect" : "Connect"}
        </Button>
    );
}