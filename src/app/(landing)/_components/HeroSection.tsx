"use client";

import { chakra, Heading, HTMLChakraProps, Span, Text } from "@chakra-ui/react";

interface Props extends HTMLChakraProps<"section"> {
}

export function HeroSection({ children, ...props }: Props) {
    return (
        <chakra.section
            w={"full"}
            p={["8", "16", "32", "64"]}
            {...props}
        >
            <Heading textAlign={"center"} size={["2xl", "3xl", "4xl", "5xl"]} >
                <Span
                    bgGradient={"to-r"}
                    gradientFrom={"primary.solid"}
                    gradientTo={"fg/25"}
                    bgClip={"text"}
                >
                    Make DeFi safer
                </Span>
                <br />
                with multi-hop tracing and alerts
            </Heading>
            <Text textAlign={"center"}>
                A large-scale tracing platform with rule-based alerts on <Span fontWeight={"semibold"}>Aptos</Span>, 
                helping users and protocols detect abnormal behaviors early 
                through fund flow and on-chain behavior analysis powered by flexible <Span fontStyle={"italic"} fontWeight={"medium"} color={"primary.fg"}>Rule Based Alert</Span>
            </Text>
        </chakra.section>
    );
}