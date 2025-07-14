"use client";

import { Box, Text, Badge, VStack, HStack, Icon, Flex } from '@chakra-ui/react';
import { FiActivity, FiUser, FiClock, FiHash } from 'react-icons/fi';

interface NodeDetailsProps {
  node: {
    id: string;
    data: {
      label: string;
      status: 'active' | 'inactive' | 'error' | 'success';
      timestamp?: Date;
      details?: any;
    };
  } | null;
}

export const NodeDetails: React.FC<NodeDetailsProps> = ({ node }) => {
  if (!node) {
    return (
      <Box p={4} textAlign="center" color="gray.500">
        <Icon as={FiActivity} boxSize="32px" mx="auto" mb={2} />
        <Text fontSize="sm">Select a node to view details</Text>
      </Box>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'green';
      case 'error': return 'red'; 
      case 'success': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Box bg="white" border="1px" borderColor="gray.200" rounded="lg" p={4}>
      <Flex align="center" justify="space-between" mb={3}>
        <HStack>
          <Icon as={FiUser} />
          <Text fontSize="sm" fontWeight="semibold">Node Details</Text>
        </HStack>
        <Badge colorScheme={getStatusColor(node.data.status)}>
          {node.data.status}
        </Badge>
      </Flex>

      <VStack align="stretch" gap={3}>
        <Box>
          <HStack mb={1}>
            <Icon as={FiHash} boxSize="12px" />
            <Text fontSize="xs" fontWeight="medium" color="gray.500">Address</Text>
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
            <Text fontSize="xs" fontWeight="medium" color="gray.500">Label</Text>
          </HStack>
          <Text fontSize="sm">{node.data.label}</Text>
        </Box>

        {node.data.timestamp && (
          <Box>
            <HStack mb={1}>
              <Icon as={FiClock} boxSize="12px" />
              <Text fontSize="xs" fontWeight="medium" color="gray.500">Last Update</Text>
            </HStack>
            <Text fontSize="sm">{node.data.timestamp.toLocaleString()}</Text>
          </Box>
        )}

        {node.data.details && (
          <Box>
            <Text fontSize="xs" fontWeight="medium" color="gray.500" mb={1}>Details</Text>
            <Box 
              as="pre" 
              fontSize="xs" 
              bg="gray.50" 
              p={2} 
              rounded="md" 
              overflow="auto"
              maxH="200px"
            >
              {JSON.stringify(node.data.details, null, 2)}
            </Box>
          </Box>
        )}
      </VStack>
    </Box>
  );
};
