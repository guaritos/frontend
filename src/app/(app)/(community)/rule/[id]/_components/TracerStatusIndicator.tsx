"use client";

import { Box, HStack, Icon, Text, VStack, Button } from "@chakra-ui/react";
import { HiWifi, HiUsers, HiLink, HiExclamation, HiRefresh } from "react-icons/hi";

interface TracerStatusIndicatorProps {
  isConnected: boolean;
  totalNodes: number;
  totalEdges: number;
  totalEvents: number;
  reconnectCount?: number;
  maxReconnectAttempts?: number;
  onManualReconnect?: () => void;
  isAutoConnecting?: boolean;
}

export const TracerStatusIndicator = ({
  isConnected,
  totalNodes,
  totalEdges,
  totalEvents,
  reconnectCount = 0,
  maxReconnectAttempts = 3,
  onManualReconnect,
  isAutoConnecting = false
}: TracerStatusIndicatorProps) => {
  const showReconnectButton = reconnectCount >= maxReconnectAttempts && !isConnected && !isAutoConnecting;
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
      <VStack align="start" gap={2}>
        <HStack justify="space-between" w="full">
          <HStack>
            <Icon 
              as={isConnected ? HiWifi : HiExclamation} 
              color={isConnected ? "green.500" : "red.500"} 
              boxSize="14px"
            />
            <Text fontSize="xs" fontWeight="semibold" color={isConnected ? "green.500" : "red.500"}>
              {isAutoConnecting ? "Connecting..." : isConnected ? "Live" : "Offline"}
            </Text>
          </HStack>
          
          {showReconnectButton && onManualReconnect && (
            <Button
              size="xs"
              variant="outline"
              colorPalette="red"
              onClick={onManualReconnect}
              px={2}
              py={1}
              h="auto"
            >
              <Icon as={HiRefresh} boxSize="10px" mr={1} />
              Reconnect
            </Button>
          )}
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
        
        {/* Connection attempts indicator */}
        {reconnectCount > 0 && (
          <Text fontSize="xs" color="orange.500">
            Attempts: {reconnectCount}/{maxReconnectAttempts}
          </Text>
        )}
      </VStack>
    </Box>
  );
};
