import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, NodeChange, EdgeChange, Connection, Background, BackgroundVariant, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, Flex, Text, Icon, Spinner, Button } from '@chakra-ui/react';
import { FiAlertTriangle, FiWifiOff } from 'react-icons/fi';
import { CustomTracerNode } from './CustomTracerNode';
import { CustomFloatingTracerEdge } from './CustomFloatingTracerEdge';
import FloatingConnectionLine from './FloatingConnectionLine';
import { useColorMode } from '@/components/ui/color-mode';

// Node and Edge types configuration
const nodeTypes = {
    custom: CustomTracerNode,
};

const edgeTypes = {
    custom: CustomFloatingTracerEdge,
};

interface TracerFlowProps {
    nodes: Node[];
    edges: Edge[];
    onNodesChange: (changes: NodeChange[]) => void;
    onEdgesChange: (changes: EdgeChange[]) => void;
    onConnect: (connection: Connection) => void;
    onNodeClick: (event: React.MouseEvent, node: Node) => void;
    isLoading?: boolean;
    error?: any;
    hasData?: boolean;
    isRuleEnabled?: boolean;
    ruleStatus?: string;
}

export const TracerFlow: React.FC<TracerFlowProps> = ({
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    isLoading,
    error,
    hasData,
    isRuleEnabled,
    ruleStatus
}) => {
    return (
        <Box flex={1} position="relative">
            <ReactFlow
                nodes={nodes}
                edges={edges}
                edgeTypes={edgeTypes}
                nodeTypes={nodeTypes}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                fitView
                style={{ backgroundColor: 'transparent' }}
                colorMode={"dark"}
                connectionLineComponent={FloatingConnectionLine}
                connectionLineStyle={{ stroke: 'var(--colors-primary)', strokeWidth: 2 }}
            >

                {/* <Background variant={BackgroundVariant.Dots} /> */}
                <Controls />
                {/* Overlay for loading/error/status */}
                {(isLoading || error || !hasData) && (
                    <Flex
                        position="absolute"
                        inset={0}
                        align="center"
                        justify="center"
                    >
                        <Box p={6} rounded="lg" shadow="lg" textAlign="center">
                            {isLoading ? (
                                <>
                                    <Spinner size="xl" color="blue.500" mb={4} />
                                    <Text fontSize="lg" fontWeight="semibold" mb={2}>Loading Alert Data...</Text>
                                    <Text color="fg">Fetching tracer information</Text>
                                </>
                            ) : error ? (
                                <>
                                    <Icon as={FiAlertTriangle} boxSize="48px" mx="auto" mb={4} color="red.400" />
                                    <Text fontSize="lg" fontWeight="semibold" mb={2} color="red.600">Error Loading Data</Text>
                                    <Text color="fg" mb={4}>{error.message}</Text>
                                    <Text fontSize="sm" color="fg.muted">
                                        Please check the rule configuration or try again later
                                    </Text>
                                </>
                            ) : !isRuleEnabled ? (
                                <>
                                    <Icon as={FiWifiOff} boxSize="48px" mx="auto" mb={4} color="orange.400" />
                                    <Text fontSize="lg" fontWeight="semibold" mb={2} color="orange.600">Rule Disabled</Text>
                                    <Text color="fg" mb={4}>
                                        This rule is currently disabled. Enable it to start monitoring.
                                    </Text>
                                    <Text fontSize="sm" color="fg.muted">
                                        Status: {ruleStatus || 'Inactive'}
                                    </Text>
                                </>
                            ) : (
                                <>
                                    <Icon as={FiWifiOff} boxSize="48px" mx="auto" mb={4} color="gray.400" />
                                    <Text fontSize="lg" fontWeight="semibold" mb={2}>No Data Available</Text>
                                    <Text color="fg" mb={4}>
                                        Waiting for alert data to load automatically
                                    </Text>
                                    <Text fontSize="sm" color="fg.muted">
                                        Data will appear when rule triggers are detected
                                    </Text>
                                </>
                            )}
                        </Box>
                    </Flex>
                )}
            </ReactFlow >
        </Box>
    );
};