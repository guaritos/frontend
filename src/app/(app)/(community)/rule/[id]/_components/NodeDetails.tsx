"use client";

import { Box, Text, Badge, VStack, HStack, Icon, Flex } from '@chakra-ui/react';
import { FiActivity, FiUser, FiClock, FiHash } from 'react-icons/fi';
import { Node } from '@xyflow/react';
import { TracerNodeData } from './CustomTracerNode';

interface NodeDetailsProps {
  node: Node<TracerNodeData> | null;
}

export const NodeDetails: React.FC<NodeDetailsProps> = ({ node }) => {
  if (!node) {
    return (
      <Box p={4} textAlign="center">
        <Icon as={FiActivity} boxSize="32px" mx="auto" mb={2} />
        <Text fontSize="sm">Select a node to view details</Text>
      </Box>
    );
  }

  // Safely access node data
  const status = (node.data?.status as string) || 'inactive';
  const label = (node.data?.label as string) || node.id;
  const timestamp = node.data?.timestamp as Date;
  const details = node.data?.details;
  const rank = node.data?.rank as number;
  const rankLevel = node.data?.rankLevel as string;

  const getRankLevelColor = (level: string) => {
    switch (level) {
      case 'very-high': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'green';
      case 'low': return 'blue';
      default: return 'gray';
    }
  };

  const getRankLevelLabel = (level: string) => {
    switch (level) {
      case 'very-high': return 'Very High Risk';
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      case 'very-low': return 'Minimal Risk';
      default: return 'Unknown';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'error': return 'red'; 
      case 'success': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Box rounded="lg">
      <Flex align="center" justify="space-between" mb={3}>
        <HStack>
          <Icon as={FiUser} />
          <Text fontSize="sm" fontWeight="semibold">Node Details</Text>
        </HStack>
        <Badge colorPalette={getStatusColor(status)}>
          {status}
        </Badge>
      </Flex>

      <VStack align="stretch" gap={3}>
        <Box>
          <HStack mb={1}>
            <Icon as={FiHash} boxSize="12px" />
            <Text fontSize="xs" fontWeight="medium" color="fg">Address</Text>
          </HStack>
          <Text 
            fontSize="xs" 
            fontFamily="mono" 
            bg="gray.50" 
            p={2} 
            rounded="md"
            wordBreak="break-all"
          >
            {node.id}
          </Text>
        </Box>

        <Box>
          <HStack mb={1}>
            <Icon as={FiActivity} boxSize="12px" />
            <Text fontSize="xs" fontWeight="medium" color="fg">Label</Text>
          </HStack>
          <Text fontSize="sm">{label}</Text>
        </Box>

        {rank !== undefined && (
          <Box>
            <HStack mb={1}>
              <Icon as={FiActivity} boxSize="12px" />
              <Text fontSize="xs" fontWeight="medium" color="fg">Risk Level</Text>
            </HStack>
            <HStack>
              <Badge colorPalette={getRankLevelColor(rankLevel)} variant="solid">
                {getRankLevelLabel(rankLevel)}
              </Badge>
              <Text fontSize="xs" color="gray.600">
                Rank: {rank.toFixed(6)}
              </Text>
            </HStack>
          </Box>
        )}

        {timestamp && (
          <Box>
            <HStack mb={1}>
              <Icon as={FiClock} boxSize="12px" />
              <Text fontSize="xs" fontWeight="medium" color="fg">Last Update</Text>
            </HStack>
            <Text fontSize="sm">{timestamp.toLocaleString()}</Text>
          </Box>
        )}

        {details !== undefined && (
          <Box>
            <Text fontSize="xs" fontWeight="medium" color="fg" mb={1}>Details</Text>
            <Box 
              as="pre" 
              fontSize="xs" 
              bg="gray.50" 
              p={2} 
              rounded="md" 
              overflow="auto"
              maxH="200px"
            >
              {JSON.stringify(details, null, 2)}
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
