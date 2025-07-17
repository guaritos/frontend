"use client";

import { Box, Flex, Text, Badge, VStack, HStack, Icon } from '@chakra-ui/react';
import { FiActivity, FiCheckCircle, FiClock, FiAlertTriangle } from 'react-icons/fi';

interface TracerStatsProps {
  totalNodes: number;
  activeNodes: number;
  totalEdges: number;
  totalEvents: number;
  isConnected: boolean;
}

export const TracerStats: React.FC<TracerStatsProps> = ({
  totalNodes,
  activeNodes,
  totalEdges,
  totalEvents,
  isConnected
}) => {
  return (
    <Box w={"full"} rounded="lg">
      <Flex align="center" justify="space-between" mb={3}>
        <Text fontSize="sm" fontWeight="semibold">System Stats</Text>
        <Badge colorPalette={isConnected ? "green" : "red"} variant="subtle">
          {isConnected ? 'Live' : 'Offline'}
        </Badge>
      </Flex>
      
      <VStack align="stretch" gap={2}>
        <Flex justify="space-between" align="center">
          <HStack>
            <Icon as={FiActivity} color="blue.500" />
            <Text fontSize="xs" color="fg.subtle">Total Nodes</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{totalNodes}</Text>
        </Flex>
        
        <Flex justify="space-between" align="center">
          <HStack>
            <Icon as={FiCheckCircle} color="green.500" />
            <Text fontSize="xs" color="fg.subtle">Active</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{activeNodes}</Text>
        </Flex>
        
        <Flex justify="space-between" align="center">
          <HStack>
            <Icon as={FiActivity} color="purple.500" />
            <Text fontSize="xs" color="fg.subtle">Connections</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{totalEdges}</Text>
        </Flex>
        
        <Flex justify="space-between" align="center">
          <HStack>
            <Icon as={FiClock} color="orange.500" />
            <Text fontSize="xs" color="fg.subtle">Events</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{totalEvents}</Text>
        </Flex>
      </VStack>
    </Box>
  );
};
