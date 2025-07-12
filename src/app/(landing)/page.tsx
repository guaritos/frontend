import Image from "next/image";
import { PageLayout } from "@/components/global/layout";
import { Center } from "@chakra-ui/react";
import { HeroSection } from "./_components/HeroSection";
import { StartSection } from "./_components/StartSection";

export default function Home() {
  return (
    <PageLayout display={"flex"} flexDirection="column" position="relative">
      <HeroSection flex={1} />
      <StartSection flex={1} />
      <Center w={"full"} h="full" position="fixed" top={0} left={0} zIndex={-1}>
        <Image
          src="/assets/bg_cover_primary-right-variant.png"
          alt="bg cover primary right variant"
          fill
        />
      </Center>
    </PageLayout>
  );
}
