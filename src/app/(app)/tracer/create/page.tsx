import Image from "next/image";
import { PageLayout } from "@/components/global/layout";
import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { CreateTracerForm } from "./_components/CreateTracerForm";

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
                <VStack h={"full"} maxW={"2xl"}>
                    <VStack align={"start"}>
                        <Heading as={"h1"} size="2xl">
                            Create tracer
                        </Heading>
                        <Text color={"fg.subtle"}>
                            Protect yourself by create tracer with custom rule or use power template from community
                        </Text>
                    </VStack>
                    <CreateTracerForm />
                </VStack>
            </Center>
        </PageLayout>
    );
}