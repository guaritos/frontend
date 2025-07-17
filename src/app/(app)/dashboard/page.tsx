import Image from "next/image";
import { PageLayout } from "@/components/global/layout";
import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { AllOwnerRulesContainer } from "./_components/AllOwnerRulesContainer";

export default function Page() {
    return (
        <PageLayout alignContent={"center"}>
            <Center w={"full"} h="full" position="fixed" top={0} left={0} zIndex={-1}>
                <Image
                    src="/assets/bg_cover_primary-left-variant.png"
                    alt="bg cover primary left variant"
                    fill
                />
            </Center>
            <Center w={"full"} h="full">
                <VStack w={"full"} h={"full"} maxW={"2xl"}>
                    <VStack w={"full"} align={"start"}>
                        <Heading as={"h1"} size="2xl">
                            Dashboard
                        </Heading>
                        <Text color={"fg.subtle"}>
                            Explore your rules as well as tracers.
                        </Text>
                    </VStack>
                    <AllOwnerRulesContainer />
                </VStack>
            </Center>
        </PageLayout>
    );
}