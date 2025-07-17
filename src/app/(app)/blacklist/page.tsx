import { PageLayout } from "@/components/global/layout";
import { Center, Heading, Text, VStack } from "@chakra-ui/react";
import { BlacklistTabs } from "./_components/BlacklistTabs";
import Image from "next/image";

export default function Page() {
    return (
        <PageLayout>
            <Center w={"full"} h="full" position="fixed" top={0} left={0} zIndex={-1}>
                <Image
                    src="/assets/bg_cover_primary-left-variant.png"
                    alt="bg cover primary left variant"
                    fill
                />
            </Center>
            <VStack w={"full"} align={"start"}>
                <Heading as={"h1"} size="lg">
                    Blacklist
                </Heading>
                <Text color={"fg.subtle"}>
                    Manage owner or dao blacklists.
                </Text>
            </VStack>
            <BlacklistTabs />
        </PageLayout>
    );
}