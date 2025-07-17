"use client";

import { toaster } from "@/components/ui/toaster";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { Button, ButtonProps } from "@chakra-ui/react";
import { useRouter } from "next/navigation";

interface StartNowButtonProps extends ButtonProps {

}
export function StartNowButton({ children, ...props }: StartNowButtonProps) {
    const router = useRouter();
    const { connected } = useWallet();

    const handleClick = () => {
        if (!connected) {
            toaster.error({
                title: "Wallet not connected",
                description: "Please connect your wallet to start creating rules.",
            });
            return;
        }

        router.push("/dashboard");
    };

    return (
        <Button
            bgGradient={"to-b"}
            gradientFrom={"primary.solid"}
            gradientTo={"secondary.solid"}
            rounded={"full"}
            _active={{
                scale: 0.95,
                animationTimingFunction: "ease-in-out"
            }}
            onClick={handleClick}
            {...props}
        >
            Start Now
        </Button>
    );
}