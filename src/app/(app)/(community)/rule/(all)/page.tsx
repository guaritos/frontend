import Image from "next/image";
import { PageLayout } from "@/components/global/layout";
import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { RuleBasedCard } from "@/app/(app)/_components/RuleBasedCard";
import { AllRuleBasedContainer } from "./_components/AllRuleBasedContainer";

export default function Page() {
    return (
        <PageLayout alignContent={"center"}>
            <Center w={"full"} h="full" position="fixed" top={0} left={0} zIndex={-1}>
                <Image
                    src="/assets/bg_cover_primary-left-larger-variant.png"
                    alt="bg cover primary left variant"
                    fill
                />
            </Center>
            <Center w={"full"} h="full" flexDirection={"column"}>
                <VStack w={"full"} h={"full"} maxW={"2xl"}>
                    <VStack w={"full"} align={"start"}>
                        <Heading as={"h1"} size="2xl">
                            Rule-Based Templates
                        </Heading>
                        <Text color={"fg.subtle"}>
                            Explore community templates to enhance your rule-based system.
                        </Text>
                    </VStack>
                    <AllRuleBasedContainer />
                </VStack>
            </Center>
        </PageLayout>
    );
}