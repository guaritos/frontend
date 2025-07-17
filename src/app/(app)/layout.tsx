import { HStack, VStack } from "@chakra-ui/react";
import { DashboardHeader, DashboardSidebar } from "@/components/global/bars";
import { Providers } from "./providers";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Providers>
      <HStack w={"full"} h={"100vh"} gap={0} align={"stretch"}>
        <DashboardSidebar />
        <VStack flex={1} gap={0} align={"stretch"}>
          <DashboardHeader />
          {children}
        </VStack>
      </HStack>
    </Providers>
  );
}
