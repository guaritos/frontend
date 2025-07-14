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
    <Box bg="white" border="1px" borderColor="gray.200" rounded="lg" p={4} mb={4}>
      <Flex align="center" justify="space-between" mb={3}>
        <Text fontSize="sm" fontWeight="semibold">System Stats</Text>
        <Badge colorScheme={isConnected ? "green" : "red"} variant="subtle">
          {isConnected ? 'Live' : 'Offline'}
        </Badge>
      </Flex>
      
      <VStack align="stretch" gap={2}>
        <Flex justify="space-between" align="center">
          <HStack>
            <Icon as={FiActivity} color="blue.500" />
            <Text fontSize="xs" color="gray.600">Total Nodes</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{totalNodes}</Text>
        </Flex>
        
        <Flex justify="space-between" align="center">
          <HStack>
            <Icon as={FiCheckCircle} color="green.500" />
            <Text fontSize="xs" color="gray.600">Active</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{activeNodes}</Text>
        </Flex>
        
        <Flex justify="space-between" align="center">
          <HStack>
            <Icon as={FiActivity} color="purple.500" />
            <Text fontSize="xs" color="gray.600">Connections</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{totalEdges}</Text>
        </Flex>
        
        <Flex justify="space-between" align="center">
          <HStack>
            <Icon as={FiClock} color="orange.500" />
            <Text fontSize="xs" color="gray.600">Events</Text>
          </HStack>
          <Text fontSize="sm" fontWeight="medium">{totalEvents}</Text>
        </Flex>
      </VStack>
    </Box>
  );
};
