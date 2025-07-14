"use client";

import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import { Box, Text, Badge, VStack, HStack, Icon } from '@chakra-ui/react';
import { FiUser, FiDollarSign, FiActivity } from 'react-icons/fi';

interface TracerNodeData {
  label: string;
  status: 'active' | 'inactive' | 'error' | 'success';
  timestamp?: Date;
  details?: any;
  address?: string;
  value?: number;
  type?: 'wallet' | 'transaction' | 'contract';
}

interface CustomTracerNodeProps {
  data: TracerNodeData;
  selected?: boolean;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'green';
    case 'error': return 'red';
    case 'success': return 'blue';
    default: return 'gray';
  }
};

const getNodeIcon = (type?: string) => {
  switch (type) {
    case 'wallet': return FiUser;
    case 'transaction': return FiDollarSign;
    case 'contract': return FiActivity;
    default: return FiActivity;
  }
};

export const CustomTracerNode: React.FC<CustomTracerNodeProps> = memo(({ data, selected }) => {
  const statusColor = getStatusColor(data.status);
  const NodeIcon = getNodeIcon(data.type);

  return (
    <Box
      bg="white"
      border="2px"
      borderColor={selected ? 'blue.500' : `${statusColor}.300`}
      rounded="lg"
      p={3}
      minW="200px"
      shadow="md"
      _hover={{ shadow: 'lg' }}
      transition="all 0.2s"
    >
      <Handle type="target" position={Position.Top} />
      <VStack align="stretch" gap={2}>
        <HStack justify="space-between">
          <HStack>
            <Icon as={NodeIcon} color={`${statusColor}.500`} />
            <Badge colorScheme={statusColor} size="sm">
              {data.status}
            </Badge>
          </HStack>
          {data.timestamp && (
            <Text fontSize="xs" color="gray.500">
              {data.timestamp.toLocaleTimeString()}
            </Text>
          )}
        </HStack>
        
        <Text fontSize="sm" fontWeight="medium" truncate>
          {data.label}
        </Text>
        
        {data.address && (
          <Text fontSize="xs" color="gray.600" fontFamily="mono" truncate>
            {data.address}
          </Text>
        )}
        
        {data.value && (
          <Text fontSize="xs" color="green.600">
            Value: {data.value.toFixed(4)}
          </Text>
        )}
      </VStack>
      <Handle type="source" position={Position.Bottom} />
    </Box>
  );
});

CustomTracerNode.displayName = 'CustomTracerNode';
