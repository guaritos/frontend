import { PageLayout } from "@/components/global/layout";
import { Heading, Text, VStack } from "@chakra-ui/react";
import { BlacklistTabs } from "./_components/BlacklistTabs";

export default function Page() {
    return (
        <PageLayout>
            <VStack w={"full"} align={"start"}>
                <Heading as={"h1"} size="2xl">
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