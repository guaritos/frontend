"use client";

import { Button, ButtonProps } from "@chakra-ui/react";

interface StartNowButtonProps extends ButtonProps {

}
export function StartNowButton({ children, ...props }: StartNowButtonProps) {

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
            {...props}
        >
            Start Now
        </Button>
    );
}