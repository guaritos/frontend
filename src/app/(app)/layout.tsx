import { Center } from "@chakra-ui/react";
import { DashboardHeader, Header } from "@/components/global/bars";


export default function Layout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Center w={"full"} h={"100vh"} display={"flex"} flexDirection="column">
      <DashboardHeader />
      {children}
    </Center>
  );
}
