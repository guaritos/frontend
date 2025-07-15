"use client";

import { memo, useState } from 'react';
import { Handle, Position, NodeProps, Node } from '@xyflow/react';
import { Box, Text, Badge, VStack, HStack, Icon, Code } from '@chakra-ui/react';
import { FaUser } from "react-icons/fa";
import { FiDollarSign, FiActivity, FiAlertTriangle, FiShield } from 'react-icons/fi';
import { HoverCardContent, HoverCardRoot, HoverCardTrigger } from '@/components/ui/hover-card';
import { Field } from '@/components/ui/field';
import { NodeDetailsDrawer } from './NodeDetailsDrawer';

export interface TracerNodeData extends Record<string, unknown> {
  label: string;
  status: 'active' | 'inactive' | 'error' | 'success';
  timestamp?: Date;
  details?: any;
  address?: string;
  value?: number;
  type?: 'wallet' | 'transaction' | 'contract';
  rank?: number;
  rankLevel?: 'very-high' | 'high' | 'medium' | 'low' | 'very-low';
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'active': return 'green';
    case 'error': return 'red';
    case 'success': return 'blue';
    default: return 'gray';
  }
};

const getRankColor = (rankLevel?: string) => {
  switch (rankLevel) {
    case 'very-high': return 'red';
    case 'high': return 'orange';
    case 'medium': return 'green';
    case 'low': return 'blue';
    case 'very-low': return 'gray';
    default: return 'gray';
  }
};

const getRankIcon = (rankLevel?: string) => {
  switch (rankLevel) {
    case 'very-high': return FiAlertTriangle;
    case 'high': return FiAlertTriangle;
    case 'medium': return FiActivity;
    case 'low': return FiShield;
    case 'very-low': return FiShield;
    default: return FiActivity;
  }
};

const getNodeIcon = (type?: string) => {
  switch (type) {
    case 'wallet': return FaUser;
    case 'transaction': return FiDollarSign;
    case 'contract': return FiActivity;
    default: return FaUser;
  }
};

const getRankBorderStyle = (rankLevel?: string) => {
  switch (rankLevel) {
    case 'very-high':
      return {
        bg: 'red.solid',
      };
    case 'high':
      return {
        bg: 'orange.solid'
      };
    case 'medium':
      return {
        bg: 'green.solid'
      };
    case 'low':
      return {
        bg: 'blue.solid'
      };
    default:
      return {
        bg: 'bg.panel'
      };
  }
};

const NodeHoverCard: React.FC<{ data: TracerNodeData; children: React.ReactNode }> = ({ data, children }) => {
  const rankColor = getRankColor(data.rankLevel);
  const statusColor = getStatusColor(data.status);

  // Define fields to render in metrics section
  const metrics = [
    data.rank !== undefined && {
      label: "Rank Score:",
      value: data.rank?.toFixed(6),
      fontWeight: "semibold"
    },
    data.value !== undefined && {
      label: "Value:",
      value: data.value?.toFixed(4),
      color: "primary.solid",
      fontWeight: "medium"
    },
    data.timestamp && {
      label: "Timestamp:",
      value: data.timestamp?.toLocaleString(),
      fontWeight: "normal"
    }
  ].filter(Boolean) as Array<{ label: string; value: string; color: string; fontWeight: string }>;

  return (
    <HoverCardRoot
      openDelay={100}
      closeDelay={100}
    >
      <HoverCardTrigger asChild>
        {children}
      </HoverCardTrigger>
      <HoverCardContent bg={"bg.panel"} rounded={"3xl"}>
        <VStack align="stretch" gap={3} minW="280px">
          {/* Header */}
          <HStack justify="space-between" align="start">
            <VStack align="start" gap={1}>
              <HStack>
                <Icon as={getNodeIcon(data.type)} color={`${statusColor}.500`} />
                <Badge colorPalette={statusColor} size="sm" variant="solid">
                  {data.status}
                </Badge>
              </HStack>
            </VStack>
            {data.rankLevel && (
              <VStack align="end" gap={1}>
                <HStack>
                  <Icon as={getRankIcon(data.rankLevel)} color={`${rankColor}.500`} boxSize="14px" />
                  <Badge colorPalette={rankColor} size="sm">
                    {data.rankLevel.replace('-', ' ').toUpperCase()}
                  </Badge>
                </HStack>
              </VStack>
            )}
          </HStack>

          {/* Address */}
          {data.address && (
            <Box>
              <Text fontSize="xs" color="fg" mb={1}>Full Address</Text>
              <Text fontSize="sm" fontFamily="mono" color="fg" wordBreak="break-all">
                <Code colorPalette={"default"} variant={"solid"}>{data.address}</Code>
              </Text>
            </Box>
          )}

          {/* Metrics */}
          <VStack align="stretch" gap={2}>
            {metrics.map((item, idx) => (
              <HStack justify="space-between" key={idx}>
                <Text fontSize="sm" color="fg.subtle">{item.label}</Text>
                <Text fontSize="sm" fontWeight={item.fontWeight} color={item.color || "fg"}>
                  {item.value}
                </Text>
              </HStack>
            ))}
          </VStack>

          {/* Additional Details */}
          {data.details && (
            <Box bg={"bg.subtle"} w={"full"} h={"fit"} p={"4"} rounded={"2xl"} shadow={"md"}>
              <Field w={"full"} label="Details">
                <VStack w={"full"} align="stretch" gap={1}>
                  {Object.entries(data.details).map(([key, value]) => {
                    if (key === 'address') return null;
                    return (
                      <HStack key={key} justify="space-between">
                        <Text fontSize="xs" color="fg.subtle">{key}</Text>
                        <Text fontSize="xs" color="fg" maxW="150px" truncate>
                          {String(value)}
                        </Text>
                      </HStack>
                    );
                  })}
                </VStack>
              </Field>
            </Box>
          )}
        </VStack>
      </HoverCardContent>
    </HoverCardRoot >
  );
}

export const CustomTracerNode: React.FC<NodeProps<Node<TracerNodeData>>> = memo(({ data, selected }) => {
  const nodeData = data as TracerNodeData;
  const statusColor = getStatusColor(nodeData.status);
  const rankColor = getRankColor(nodeData.rankLevel);
  const borderStyle = getRankBorderStyle(nodeData.rankLevel);
  
  // State for drawer
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Calculate node size based on rank level
  const getNodeSize = (rankLevel?: string) => {
    switch (rankLevel) {
      case 'very-high': return '60px';
      case 'high': return '55px';
      case 'medium': return '50px';
      case 'low': return '45px';
      default: return '40px';
    }
  };

  const nodeSize = getNodeSize(nodeData.rankLevel);

  // Create node object for drawer
  const nodeForDrawer: Node<TracerNodeData> = {
    id: `node-${Date.now()}-${Math.random()}`, // Generate a unique ID
    position: { x: 0, y: 0 },
    data: nodeData,
    type: 'custom'
  };

  const handleNodeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsDrawerOpen(true);
  };

  return (
    <>
      <NodeHoverCard data={nodeData}>
        <Box position="relative">
          <Handle
            type="target"
            position={Position.Top}
          />

          <Box
            w={nodeSize}
            h={nodeSize}
            rounded="full"
            display="flex"
            alignItems="center"
            justifyContent="center"
            cursor="pointer"
            transition="all 0.3s ease"
            outline={selected ? `3px solid` : 'none'}
            outlineColor={selected ? 'primary.solid' : 'transparent'}
            onClick={handleNodeClick}
            _hover={{
              transform: 'scale(1.1)',
              shadow: 'xl'
            }}
            {...borderStyle}
          >
            <Icon
              as={FaUser}
              boxSize={nodeData.rankLevel === 'very-high' ? '28px' :
                nodeData.rankLevel === 'high' ? '24px' : '20px'}
              color={nodeData.rankLevel === 'very-high' ? 'red.contrast' :
                nodeData.rankLevel === 'high' ? 'orange.contrast' :
                  nodeData.rankLevel === 'medium' ? 'green.contrast' :
                    nodeData.rankLevel === 'low' ? 'blue.contrast' : 'fg'}
            />
          </Box>

          <Handle
            type="source"
            position={Position.Bottom}
          />

          {/* Risk indicator for very high risk */}
          {nodeData.rankLevel === 'very-high' && (
            <Box
              position="absolute"
              top="-3px"
              right="-3px"
              w="18px"
              h="18px"
              bg="red.500"
              rounded="full"
              display="flex"
              alignItems="center"
              justifyContent="center"
              animation="pulse 2s infinite"
              border="2px solid white"
            >
              <Icon as={FiAlertTriangle} color="white" boxSize="10px" />
            </Box>
          )}
        </Box>
      </NodeHoverCard>

      {/* Node Details Drawer */}
      <NodeDetailsDrawer
        node={nodeForDrawer}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
});

CustomTracerNode.displayName = 'CustomTracerNode';
