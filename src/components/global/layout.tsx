"use client";

import { chakra, HTMLChakraProps } from "@chakra-ui/react";

interface PageLayoutProps extends HTMLChakraProps<"div"> {
}

export function PageLayout({ children, ...props }: PageLayoutProps) {
    return (
        <chakra.div p={"4"} w={"full"} h={"full"} {...props}>
            {children}
        </chakra.div>
    );
}