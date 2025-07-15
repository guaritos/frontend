import { VStack } from '@chakra-ui/react';
import { Node } from '@xyflow/react';
import { TracerStats } from './TracerStats';
import { NodeDetails } from './NodeDetails';
import { AlertInfo } from './AlertInfo';
import { EventsPanel } from './EventsPanel';
import { RankLegend } from './RankLegend';

interface TracerSidebarProps {
  alertData: any;
  selectedNode: Node | null;
  stats: {
    totalNodes: number;
    activeNodes: number;
    totalEdges: number;
    totalEvents: number;
  };
  events: any[];
  isConnected: boolean;
}

export const TracerSidebar: React.FC<TracerSidebarProps> = ({
  alertData,
  selectedNode,
  stats,
  events,
  isConnected
}) => {
  // Extract max rank from alert data for legend
  const maxRank = alertData?.data?.rank_items ? 
    Math.max(...Object.values(alertData.data.rank_items) as number[]) : 
    undefined;

  return (
    <VStack position={"absolute"} h="full" align="stretch" p={4} gap={4} overflowY="auto">
      {/* Alert Info */}
      {alertData && <AlertInfo alertData={alertData} />}

      {/* Rank Legend */}
      <RankLegend maxRank={maxRank} />

      {/* Stats */}
      <TracerStats
        totalNodes={stats.totalNodes}
        activeNodes={stats.activeNodes}
        totalEdges={stats.totalEdges}
        totalEvents={stats.totalEvents}
        isConnected={isConnected}
      />

      {/* Node Details */}
      <NodeDetails node={selectedNode as any} />

      {/* Events Panel */}
      <EventsPanel events={events} />
    </VStack>
  );
};
