"use client";

import { useState, useCallback } from 'react';
import { applyNodeChanges, applyEdgeChanges, addEdge, Node, Edge, NodeChange, EdgeChange, Connection } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useTracerData } from '@/hooks';
import { Box, Flex } from '@chakra-ui/react';
import { TracerFlow } from './TracerFlow';
import { TracerHeader } from './TracerHeader';
import { TracerDrawer } from './TracerDrawer';
import { TracerStatusIndicator } from './TracerStatusIndicator';
import { TracerNotification } from './TracerNotification';
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
    events,
    setNodes,
    setEdges,
    alertData,
    isLoading,
    error,
    refetch,
    processAlertData,
    resetData,
    stats,
    isConnected
  } = useTracerData(ruleId);

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
    <Box h="100vh" position="relative">
      {/* Main Flow Area - Full Width */}
      <Box h="full" display="flex" flexDirection="column">
        {/* Header */}
        {/* <TracerHeader
          isConnected={isConnected}
          isLoading={isLoading}
          hasData={!!alertData}
          stats={stats}
          onReset={resetData}
          onLoadData={startMonitoring}
          onRefresh={refetch}
        /> */}

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
          onRetry={refetch}
          onLoadData={startMonitoring}
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
        events={events}
        isConnected={isConnected}
      />

      {/* Event Notifications */}
      <TracerNotification events={events} />
    </Box>
  );
};


