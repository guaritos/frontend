"use client";

import { useState, useEffect, useCallback, useMemo } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useGetAlertById } from '@/hooks/useGetAlertById';
import { 
  Box, 
  Flex, 
  Text, 
  Badge, 
  Button, 
  VStack, 
  HStack, 
  Icon,
  Spinner,
  Grid,
  GridItem,
  Stack
} from '@chakra-ui/react';
import { TracerStats } from './TracerStats';
import { NodeDetails } from './NodeDetails';
import { CustomTracerNode } from './CustomTracerNode';
import { AlertInfo } from './AlertInfo';
import { 
  FiActivity, 
  FiWifi, 
  FiWifiOff, 
  FiPlay, 
  FiPause, 
  FiRotateCcw, 
  FiAlertTriangle,
  FiCheckCircle,
  FiClock,
  FiEye,
  FiFilter
} from 'react-icons/fi';
import { useGetAlertByRuleId } from '@/hooks';

interface TracerDashboardProps {
  ruleId: string;
  userId: string;
  alertId: string; // Add alertId prop to fetch specific alert
}

interface TracerNode extends Node {
  data: {
    label: string;
    status: 'active' | 'inactive' | 'error' | 'success';
    timestamp?: Date;
    details?: any;
  };
}

interface TracerEdge extends Edge {
  data?: {
    weight?: number;
    timestamp?: Date;
    status?: 'active' | 'inactive';
  };
}

const getNodeStyle = (status: string) => {
  switch (status) {
    case 'active':
      return { 
        background: '#22c55e', 
        color: 'white',
        border: '2px solid #16a34a',
        boxShadow: '0 0 10px rgba(34, 197, 94, 0.3)'
      };
    case 'error':
      return { 
        background: '#ef4444', 
        color: 'white',
        border: '2px solid #dc2626',
        boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
      };
    case 'success':
      return { 
        background: '#3b82f6', 
        color: 'white',
        border: '2px solid #2563eb',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
      };
    default:
      return { 
        background: '#6b7280', 
        color: 'white',
        border: '2px solid #4b5563'
      };
  }
};

export const TracerDashboard: React.FC<TracerDashboardProps> = ({ ruleId, userId, alertId }) => {
  const [nodes, setNodes] = useState<TracerNode[]>([]);
  const [edges, setEdges] = useState<TracerEdge[]>([]);
  const [selectedNode, setSelectedNode] = useState<TracerNode | null>(null);
  const [eventFilter, setEventFilter] = useState<string>('all');

  // Use the alert hook to fetch data
  const { data: alertData, isLoading, error, refetch } = useGetAlertByRuleId({
    payload: {
        ruleId
    }
  })

  // Simulate events for now - in future this will come from socket
  const [events, setEvents] = useState<any[]>([]);
  const isConnected = !!alertData; // Consider connected if we have data

  // Initialize with alert data
  const startMonitoring = useCallback(() => {
    if (alertData) {
      // Create initial visualization from alert data
      processAlertData(alertData);
    } else {
      // Refetch if no data
      refetch();
    }
  }, [alertData, refetch]);

  const stopMonitoring = useCallback(() => {
    // For now, just clear the visualization
    setNodes([]);
    setEdges([]);
    setEvents([]);
  }, []);

  const resetDashboard = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setSelectedNode(null);
    setEvents([]);
  }, []);

  // Process alert data to create nodes and edges
  const processAlertData = useCallback((data: any) => {
    console.log('Processing alert data:', data);
    
    if (data?.data?.strategy_snap_shot_items?.weighted_edges) {
      const newNodes: TracerNode[] = [];
      const newEdges: TracerEdge[] = [];
      
      // Create nodes from unique addresses
      const addresses = new Set<string>();
      data.data.strategy_snap_shot_items.weighted_edges.forEach((edge: any) => {
        addresses.add(edge.from);
        addresses.add(edge.to);
      });

      Array.from(addresses).forEach((address, index) => {
        newNodes.push({
          id: address,
          position: { 
            x: (index % 5) * 250, 
            y: Math.floor(index / 5) * 180 
          },
          data: {
            label: `${address.slice(0, 8)}...${address.slice(-6)}`,
            status: 'active',
            timestamp: new Date(data.created_at),
            details: {
              address,
              rValue: data.data.strategy_snap_shot_items.r[address],
              pValue: data.data.strategy_snap_shot_items.p[address],
              rankValue: data.data.rank_items[address]
            }
          },
          style: getNodeStyle('active'),
          type: 'default'
        });
      });

      // Create edges
      data.data.strategy_snap_shot_items.weighted_edges.forEach((edge: any, index: number) => {
        newEdges.push({
          id: `edge-${index}`,
          source: edge.from,
          target: edge.to,
          data: {
            weight: edge.weight,
            timestamp: new Date(edge.timestamp),
            status: 'active'
          },
          style: { 
            stroke: edge.weight > 0.1 ? '#ef4444' : '#22c55e',
            strokeWidth: Math.max(2, Math.min(edge.weight * 50, 8))
          },
          label: `${edge.weight.toFixed(4)}`,
          labelStyle: { fontSize: '10px', fontWeight: 'bold' }
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);

      // Add an event for the alert
      const alertEvent = {
        type: 'alert_triggered',
        data: {
          message: data.message,
          rule: data.rules.name,
          status: data.status,
          matched_conditions: data.result.queryResult.length,
          aggregate_results: data.result.aggregateResult.length
        },
        timestamp: new Date(data.created_at)
      };
      setEvents([alertEvent]);
    }
  }, []);

  // Handle alert data changes
  useEffect(() => {
    if (alertData) {
      processAlertData(alertData);
    }
  }, [alertData, processAlertData]);

  // ReactFlow handlers with proper typing
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds as Node[]) as TracerNode[]);
    },
    []
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds as Edge[]) as TracerEdge[]);
    },
    []
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds as Edge[]) as TracerEdge[]);
    },
    []
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as TracerNode);
  }, []);

  // Filter events
  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return events;
    return events.filter(event => event.type === eventFilter);
  }, [events, eventFilter]);

  // Statistics
  const stats = useMemo(() => {
    return {
      totalNodes: nodes.length,
      activeNodes: nodes.filter(n => n.data.status === 'active').length,
      totalEdges: edges.length,
      totalEvents: events.length,
      recentEvents: events.slice(-5)
    };
  }, [nodes, edges, events]);

  return (
    <Box h="100vh" bg="gray.50">
      <Flex h="full">
        {/* Main Flow Area */}
        <Box flex={1} display="flex" flexDirection="column">
          {/* Header */}
          <Box bg="white" borderBottomWidth={1} p={4}>
            <Flex align="center" justify="space-between">
              <Flex align="center" gap={3}>
                <Text fontSize="xl" fontWeight="semibold">Tracer Flow Monitor</Text>
                <Badge 
                  colorScheme={isConnected ? "green" : "red"}
                  variant="subtle"
                  display="flex"
                  alignItems="center"
                  gap={1}
                >
                  <Icon as={isConnected ? FiWifi : FiWifiOff} />
                  {isConnected ? 'Connected' : 'Disconnected'}
                </Badge>
              </Flex>
              
              <Flex gap={2}>
                <Button
                  onClick={alertData ? resetDashboard : startMonitoring}
                  colorScheme={alertData ? "red" : "blue"}
                  loading={isLoading}
                >
                  <Icon as={alertData ? FiRotateCcw : FiPlay} mr={2} />
                  {alertData ? 'Reset' : 'Load'} Data
                </Button>
                
                <Button onClick={() => refetch()} variant="outline" loading={isLoading}>
                  <Icon as={FiRotateCcw} mr={2} />
                  Refresh
                </Button>
              </Flex>
            </Flex>

            {/* Stats */}
            <Flex gap={6} mt={3} fontSize="sm" color="gray.600">
              <Flex align="center" gap={1}>
                <Icon as={FiActivity} />
                <Text>{stats.totalNodes} Nodes</Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Icon as={FiCheckCircle} />
                <Text>{stats.activeNodes} Active</Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Icon as={FiEye} />
                <Text>{stats.totalEdges} Connections</Text>
              </Flex>
              <Flex align="center" gap={1}>
                <Icon as={FiClock} />
                <Text>{stats.totalEvents} Events</Text>
              </Flex>
            </Flex>
          </Box>

          {/* Flow Canvas */}
          <Box flex={1} position="relative">
            <ReactFlow
              nodes={nodes}
              edges={edges}
              onNodesChange={onNodesChange}
              onEdgesChange={onEdgesChange}
              onConnect={onConnect}
              onNodeClick={onNodeClick}
              fitView
              style={{ backgroundColor: '#f7fafc' }}
              connectionLineStyle={{ stroke: '#3182ce', strokeWidth: 2 }}
              defaultEdgeOptions={{ style: { stroke: '#3182ce', strokeWidth: 2 } }}
            />
            
            {/* Overlay for loading/error state */}
            {(isLoading || error || !alertData) && (
              <Flex
                position="absolute"
                inset={0}
                bg="blackAlpha.500"
                align="center"
                justify="center"
              >
                <Box bg="white" p={6} rounded="lg" shadow="lg" textAlign="center">
                  {isLoading ? (
                    <>
                      <Spinner size="xl" color="blue.500" mb={4} />
                      <Text fontSize="lg" fontWeight="semibold" mb={2}>Loading Alert Data...</Text>
                      <Text color="gray.600">Fetching tracer information</Text>
                    </>
                  ) : error ? (
                    <>
                      <Icon as={FiAlertTriangle} boxSize="48px" mx="auto" mb={4} color="red.400" />
                      <Text fontSize="lg" fontWeight="semibold" mb={2} color="red.600">Error Loading Data</Text>
                      <Text color="gray.600" mb={4}>{error.message}</Text>
                      <Button onClick={() => refetch()} colorScheme="red">
                        <Icon as={FiRotateCcw} mr={2} />
                        Retry
                      </Button>
                    </>
                  ) : (
                    <>
                      <Icon as={FiWifiOff} boxSize="48px" mx="auto" mb={4} color="gray.400" />
                      <Text fontSize="lg" fontWeight="semibold" mb={2}>No Data Available</Text>
                      <Text color="gray.600" mb={4}>Click "Load Data" to fetch alert information</Text>
                      <Button onClick={startMonitoring} colorScheme="blue">
                        <Icon as={FiPlay} mr={2} />
                        Load Data
                      </Button>
                    </>
                  )}
                </Box>
              </Flex>
            )}
          </Box>
        </Box>

        {/* Right Sidebar */}
        <Box w="360px" bg="white" borderLeftWidth={1}>
          <VStack h="full" align="stretch" p={4} gap={4} overflowY="auto">
            {/* Alert Info */}
            {alertData && <AlertInfo alertData={alertData} />}

            {/* Stats */}
            <TracerStats
              totalNodes={stats.totalNodes}
              activeNodes={stats.activeNodes}
              totalEdges={stats.totalEdges}
              totalEvents={stats.totalEvents}
              isConnected={isConnected}
            />

            {/* Node Details */}
            <NodeDetails node={selectedNode} />

            {/* Events Panel */}
            <Box flex={1} bg="white" border="1px" borderColor="gray.200" rounded="lg" minH="200px">
              <Box p={3} borderBottomWidth={1}>
                <Flex align="center" justify="space-between">
                  <Flex align="center" gap={2}>
                    <Icon as={FiAlertTriangle} />
                    <Text fontSize="sm" fontWeight="semibold">Events</Text>
                  </Flex>
                  <Flex align="center" gap={2}>
                    <Icon as={FiFilter} boxSize="12px" />
                    <select 
                      value={eventFilter} 
                      onChange={(e: any) => setEventFilter(e.target.value)}
                      style={{
                        fontSize: '12px',
                        border: '1px solid #e2e8f0',
                        borderRadius: '4px',
                        padding: '2px 4px'
                      }}
                    >
                      <option value="all">All</option>
                      <option value="alert_triggered">Alerts</option>
                      <option value="user_notification">Notifications</option>
                      <option value="tracer_update">Updates</option>
                    </select>
                  </Flex>
                </Flex>
              </Box>
              <Box>
                <Box h="200px" overflowY="auto" px={4}>
                  {filteredEvents.length === 0 ? (
                    <VStack py={8} color="gray.500">
                      <Icon as={FiClock} boxSize="32px" mb={2} />
                      <Text fontSize="sm">No events yet</Text>
                    </VStack>
                  ) : (
                    <VStack gap={2} pb={4} align="stretch">
                      {filteredEvents.slice(-10).map((event: any, index: number) => (
                        <Box key={index} border="1px" borderColor="gray.200" rounded="lg" p={3}>
                          <Flex align="center" justify="space-between" mb={2}>
                            <Badge 
                              variant="outline" 
                              fontSize="xs"
                              colorScheme={
                                event.type === 'alert_triggered' ? 'red' :
                                event.type === 'user_notification' ? 'blue' :
                                event.type === 'tracer_update' ? 'green' : 'gray'
                              }
                            >
                              {event.type.replace('_', ' ')}
                            </Badge>
                            <Text fontSize="xs" color="gray.500">
                              {event.timestamp.toLocaleTimeString()}
                            </Text>
                          </Flex>
                          <Box
                            as="pre"
                            fontSize="xs"
                            color="gray.700"
                            whiteSpace="pre-wrap"
                            wordBreak="break-words"
                            overflow="hidden"
                            textOverflow="ellipsis"
                            maxH="60px"
                          >
                            {typeof event.data === 'string' 
                              ? event.data 
                              : JSON.stringify(event.data, null, 2).slice(0, 100)
                            }
                            {JSON.stringify(event.data, null, 2).length > 100 && '...'}
                          </Box>
                        </Box>
                      ))}
                    </VStack>
                  )}
                </Box>
              </Box>
            </Box>
          </VStack>
        </Box>
      </Flex>
    </Box>
  );
};
