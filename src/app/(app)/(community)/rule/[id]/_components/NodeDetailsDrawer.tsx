"use client";

import { Button, DrawerRootProps, Heading, HStack, Icon, Span, Text, VStack, Box, Badge, Code } from "@chakra-ui/react";
import { DrawerActionTrigger, DrawerBody, DrawerContent, DrawerHeader, DrawerRoot, DrawerTrigger } from "@/components/ui/drawer";
import { Tag } from "@/components/ui/tag";
import { Node } from '@xyflow/react';
import { TracerNodeData } from './CustomTracerNode';
import { FiActivity, FiUser, FiClock, FiHash, FiCopy, FiExternalLink, FiShield, FiAlertTriangle } from 'react-icons/fi';
import { FaUser } from "react-icons/fa";
import { useState } from 'react';

interface NodeDetailsDrawerProps extends Omit<DrawerRootProps, "children"> {
  node: Node<TracerNodeData> | null;
  isOpen: boolean;
  onClose: () => void;
}

export const NodeDetailsDrawer = ({ 
  node, 
  isOpen,
  onClose,
  ...props 
}: NodeDetailsDrawerProps) => {
  if (!node) return null;

  const nodeData = node.data as TracerNodeData;
  const [copied, setCopied] = useState(false);

  const handleCopyAddress = async () => {
    if (nodeData.address) {
      await navigator.clipboard.writeText(nodeData.address);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
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

  const getRankLabel = (rankLevel?: string) => {
    switch (rankLevel) {
      case 'very-high': return 'Very High Risk';
      case 'high': return 'High Risk';
      case 'medium': return 'Medium Risk';
      case 'low': return 'Low Risk';
      case 'very-low': return 'Minimal Risk';
      default: return 'Unknown';
    }
  };

  const getNodeIcon = (type?: string) => {
    switch (type) {
      case 'wallet': return FaUser;
      case 'transaction': return FiActivity;
      case 'contract': return FiActivity;
      default: return FaUser;
    }
  };

  return (
    <DrawerRoot 
      size={"lg"} 
      open={isOpen} 
      onOpenChange={(details) => !details.open && onClose()}
      {...props}
    >
      <DrawerContent>
        <DrawerHeader>
          <VStack w={"full"} align={"start"}>
            <HStack justify="space-between" w="full">
              <HStack>
                <Icon as={FiUser} color="primary.500" />
                <Text color={"fg.subtle"}>
                  Node Analysis
                </Text>
              </HStack>
              <HStack>
                <Button variant={"plain"} rounded={"full"} size={"xs"} onClick={handleCopyAddress}>
                  <Icon as={copied ? FiCopy : FiCopy} />
                  {copied ? 'Copied!' : 'Copy'}
                </Button>
                <Button variant={"outline"} rounded={"full"} size={"xs"}>
                  <Icon as={FiExternalLink} />
                  Explorer
                </Button>
              </HStack>
            </HStack>
            
            <Heading as={"h6"} size="2xl" fontWeight={"semibold"}>
              {nodeData.label || node.id.slice(0, 8) + '...'}
            </Heading>
            
            <HStack w={"full"} flexWrap="wrap" gap={2}>
              <Tag variant={"solid"} colorPalette={getStatusColor(nodeData.status)}>
                <Icon as={getNodeIcon(nodeData.type)} mr={1} />
                <Span color={`${getStatusColor(nodeData.status)}.contrast`}>
                  {nodeData.status}
                </Span>
              </Tag>
              
              {nodeData.rankLevel && (
                <Tag variant={"solid"} colorPalette={getRankColor(nodeData.rankLevel)}>
                  <Icon as={getRankIcon(nodeData.rankLevel)} mr={1} />
                  <Span color={`${getRankColor(nodeData.rankLevel)}.contrast`}>
                    {getRankLabel(nodeData.rankLevel)}
                  </Span>
                </Tag>
              )}
              
              {nodeData.type && (
                <Tag variant={"subtle"} colorPalette={"gray"}>
                  <Span>{nodeData.type}</Span>
                </Tag>
              )}
            </HStack>
          </VStack>
        </DrawerHeader>
        
        <DrawerBody>
          <VStack align="stretch" gap={6} h="full">
            {/* Address Section */}
            <Box>
              <HStack mb={3}>
                <Icon as={FiHash} color="primary.500" />
                <Heading size="md" color="fg.emphasized">
                  Address Information
                </Heading>
              </HStack>
              <VStack align="stretch" gap={2}>
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="fg.subtle" mb={1}>
                    Full Address
                  </Text>
                  <Code 
                    variant="solid" 
                    colorPalette="default" 
                    p={3} 
                    rounded="lg"
                    fontSize="sm"
                    wordBreak="break-all"
                    w="full"
                  >
                    {nodeData.address || node.id}
                  </Code>
                </Box>
                
                <Box>
                  <Text fontSize="sm" fontWeight="medium" color="fg.subtle" mb={1}>
                    Short ID
                  </Text>
                  <Text fontSize="sm" fontFamily="mono" color="fg">
                    {node.id.slice(0, 8)}...{node.id.slice(-8)}
                  </Text>
                </Box>
              </VStack>
            </Box>

            {/* Risk Assessment */}
            {nodeData.rank !== undefined && (
              <Box>
                <HStack mb={3}>
                  <Icon as={getRankIcon(nodeData.rankLevel)} color={`${getRankColor(nodeData.rankLevel)}.500`} />
                  <Heading size="md" color="fg.emphasized">
                    Risk Assessment
                  </Heading>
                </HStack>
                <VStack align="stretch" gap={2}>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.subtle">Risk Score:</Text>
                    <Text fontSize="sm" fontWeight="semibold" color={`${getRankColor(nodeData.rankLevel)}.500`}>
                      {nodeData.rank.toFixed(6)}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm" color="fg.subtle">Risk Level:</Text>
                    <Badge colorPalette={getRankColor(nodeData.rankLevel)} variant="solid">
                      {getRankLabel(nodeData.rankLevel)}
                    </Badge>
                  </HStack>
                </VStack>
              </Box>
            )}

            {/* Transaction Value */}
            {nodeData.value !== undefined && (
              <Box>
                <HStack mb={3}>
                  <Icon as={FiActivity} color="green.500" />
                  <Heading size="md" color="fg.emphasized">
                    Transaction Value
                  </Heading>
                </HStack>
                <Text fontSize="lg" fontWeight="bold" color="green.500">
                  {nodeData.value.toFixed(4)} APT
                </Text>
              </Box>
            )}

            {/* Timestamp */}
            {nodeData.timestamp && (
              <Box>
                <HStack mb={3}>
                  <Icon as={FiClock} color="blue.500" />
                  <Heading size="md" color="fg.emphasized">
                    Timestamp
                  </Heading>
                </HStack>
                <Text fontSize="sm" color="fg">
                  {nodeData.timestamp.toLocaleString()}
                </Text>
              </Box>
            )}

            {/* Additional Details */}
            {nodeData.details && (
              <Box>
                <HStack mb={3}>
                  <Icon as={FiActivity} color="purple.500" />
                  <Heading size="md" color="fg.emphasized">
                    Additional Details
                  </Heading>
                </HStack>
                <Box 
                  bg="bg.subtle" 
                  p={4} 
                  rounded="lg" 
                  border="1px solid" 
                  borderColor="border.emphasized"
                >
                  <VStack align="stretch" gap={2}>
                    {Object.entries(nodeData.details).map(([key, value]) => {
                      if (key === 'address') return null;
                      return (
                        <HStack key={key} justify="space-between">
                          <Text fontSize="sm" color="fg.subtle" textTransform="capitalize">
                            {key.replace('_', ' ')}:
                          </Text>
                          <Text fontSize="sm" color="fg" fontFamily="mono" wordBreak="break-word" maxW="60%">
                            {String(value)}
                          </Text>
                        </HStack>
                      );
                    })}
                  </VStack>
                </Box>
              </Box>
            )}
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};
