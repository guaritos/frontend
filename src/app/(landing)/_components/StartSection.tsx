"use client";

import { Center, chakra, Heading, HTMLChakraProps } from "@chakra-ui/react";
import { StartNowButton } from "./StartNowButton";

interface Props extends HTMLChakraProps<"section"> {
}

export function StartSection({ children, ...props }: Props) {
    return (
        <chakra.section
            w={"full"}
            h={"full"}
            p={["8", "16"]}
            {...props}
        >
            <Center w={"full"} h={"full"} flexDirection={"column"} gap={"4"} alignContent={"end"}>
                <Heading as={"h2"} size={["md", "2xl"]}>
                    Trace threats & Stay secure
                </Heading>
                <StartNowButton />
            </Center>
        </chakra.section>
    );
}