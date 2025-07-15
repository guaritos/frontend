"use client";

import { Box, HStack, Icon, Text, VStack } from "@chakra-ui/react";
import { HiWifi, HiUsers, HiLink, HiExclamation } from "react-icons/hi";

interface TracerStatusIndicatorProps {
  isConnected: boolean;
  totalNodes: number;
  totalEdges: number;
  totalEvents: number;
}

export const TracerStatusIndicator = ({
  isConnected,
  totalNodes,
  totalEdges,
  totalEvents
}: TracerStatusIndicatorProps) => {
  return (
    <Box
      position="absolute"
      top={4}
      left={4}
      zIndex={999}
      bg={"bg.panel"}
      rounded={"2xl"}
      p={"4"}
      transition={"all 0.3s ease-in-out"}
      _hover={{
        borderColor: isConnected ? "green.500" : "red.500",
        scale: 1.02,
      }}
    >
      <VStack align="start" gap={1}>
        <HStack>
          <Icon 
            as={isConnected ? HiWifi : HiExclamation} 
            color={isConnected ? "green.500" : "red.500"} 
            boxSize="14px"
          />
          <Text fontSize="xs" fontWeight="semibold" color={isConnected ? "green.500" : "red.500"}>
            {isConnected ? "Live" : "Offline"}
          </Text>
        </HStack>
        
        <HStack gap={3}>
          <HStack gap={1}>
            <Icon as={HiUsers} color="blue.400" boxSize="12px" />
            <Text fontSize="xs" color="fg.muted">{totalNodes}</Text>
          </HStack>
          
          <HStack gap={1}>
            <Icon as={HiLink} color="purple.400" boxSize="12px" />
            <Text fontSize="xs" color="fg.muted">{totalEdges}</Text>
          </HStack>
          
          <Text fontSize="xs" color="fg.subtle">
            {totalEvents} events
          </Text>
        </HStack>
      </VStack>
    </Box>
  );
};
