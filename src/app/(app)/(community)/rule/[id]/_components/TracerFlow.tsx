import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, NodeChange, EdgeChange, Connection, Background, BackgroundVariant, Controls } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Box, Flex, Text, Icon, Spinner, Button } from '@chakra-ui/react';
import { FiAlertTriangle, FiWifiOff, FiPlay, FiRotateCcw } from 'react-icons/fi';
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
    onRetry?: () => void;
    onLoadData?: () => void;
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
    onRetry,
    onLoadData
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
                {/* Overlay for loading/error state */}
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
                                    <Button onClick={onRetry} colorPalette="red">
                                        <Icon as={FiRotateCcw} mr={2} />
                                        Retry
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <Icon as={FiWifiOff} boxSize="48px" mx="auto" mb={4} color="gray.400" />
                                    <Text fontSize="lg" fontWeight="semibold" mb={2}>No Data Available</Text>
                                    <Text color="fg" mb={4}>Click "Load Data" to fetch alert information</Text>
                                    <Button onClick={onLoadData} colorPalette="blue">
                                        <Icon as={FiPlay} mr={2} />
                                        Load Data
                                    </Button>
                                </>
                            )}
                        </Box>
                    </Flex>
                )}
            </ReactFlow >
        </Box>
    );
};