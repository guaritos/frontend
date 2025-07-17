"use client";

import { useState, useCallback, useEffect, useMemo } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTracerData, useTracerEvent } from '@/hooks';
import { Box } from '@chakra-ui/react';
import { TracerFlow } from './TracerFlow';
import { TracerDrawer } from './TracerDrawer';
import { TracerStatusIndicator } from './TracerStatusIndicator';
import { TracerNodeData } from './CustomTracerNode';

interface TracerDashboardProps {
  ruleId: string;
  userId: string;
  alertId: string;
}

export const TracerDashboard: React.FC<TracerDashboardProps> = ({ ruleId, userId, alertId }) => {
  const [selectedNode, setSelectedNode] = useState<Node<TracerNodeData> | null>(null);

  // Use the tracer data hook
  const {
    nodes,
    edges,
    events: tracerEvents,
    setNodes,
    setEdges,
    alertData,
    isLoading,
    error,
    refetch,
    processAlertData,
    resetData,
    stats,
    isConnected: isDataConnected
  } = useTracerData(ruleId);

  // Use the tracer event hook for realtime events
  const {
    isConnected: isSocketConnected,
    events: realtimeEvents,
    connect: connectSocket,
    disconnect: disconnectSocket,
    clearEvents
  } = useTracerEvent();

  // Auto-connect when component mounts
  useEffect(() => {
    if (userId && !isSocketConnected) {
      connectSocket({ userId });
    }
  }, [userId, isSocketConnected, connectSocket]);

  // Auto-disconnect when component unmounts
  useEffect(() => {
    return () => {
      if (isSocketConnected) {
        disconnectSocket();
      }
    };
  }, [isSocketConnected, disconnectSocket]);

  // Memoized values
  const allEvents = useMemo(() => {
    return [...tracerEvents, ...realtimeEvents];
  }, [tracerEvents, realtimeEvents]);

  const isConnected = useMemo(() => {
    return isDataConnected && isSocketConnected;
  }, [isDataConnected, isSocketConnected]);

  // Process alert data when available
  const startMonitoring = useCallback(() => {
    if (alertData) {
      processAlertData(alertData);
    } else {
      refetch();
    }
  }, [alertData, processAlertData, refetch]);

  // ReactFlow handlers with proper typing
  const onNodesChange = useCallback(
    (changes: NodeChange[]) => {
      setNodes((nds) => applyNodeChanges(changes, nds as Node[]));
    },
    [setNodes]
  );

  const onEdgesChange = useCallback(
    (changes: EdgeChange[]) => {
      setEdges((eds) => applyEdgeChanges(changes, eds as Edge[]));
    },
    [setEdges]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge(connection, eds as Edge[]));
    },
    [setEdges]
  );

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node as Node<TracerNodeData>);
  }, []);

  return (
    <Box h="full" position="relative">
      {/* Main Flow Area - Full Width */}
      <Box h="full" display="flex" flexDirection="column">
        {/* Flow Canvas - Full Width */}
        <TracerFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          isLoading={isLoading}
          error={error}
          hasData={!!alertData}
        />
      </Box>

      {/* Status Indicator - Top Left */}
      <TracerStatusIndicator
        isConnected={isConnected}
        totalNodes={stats.totalNodes}
        totalEdges={stats.totalEdges}
        totalEvents={stats.totalEvents}
      />

      {/* Tracer Drawer - Top Right */}
      <TracerDrawer
        alertData={alertData}
        selectedNode={selectedNode}
        stats={stats}
        events={allEvents}
        isConnected={isConnected}
      />

    </Box>
  );
};


