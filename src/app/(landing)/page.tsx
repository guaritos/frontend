import Image from "next/image";
import { PageLayout } from "@/components/global/layout";
import { Center } from "@chakra-ui/react";
import { HeroSection } from "./_components/HeroSection";

export default function Home() {
  return (
    <PageLayout>
      <HeroSection />
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
