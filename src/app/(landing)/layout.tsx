import { Center } from "@chakra-ui/react";
import { Header } from "@/components/global/bars";


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <Center w={"full"} h={"100vh"} display={"flex"} flexDirection="column">
      <Header />
      {children}
    </Center>
  );
}
