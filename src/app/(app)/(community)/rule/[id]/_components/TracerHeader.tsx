import { 
  Box, 
  Flex, 
  Text, 
  Badge, 
  Button, 
  Icon
} from '@chakra-ui/react';
import { 
  FiActivity, 
  FiWifi, 
  FiWifiOff, 
  FiPlay, 
  FiRotateCcw, 
  FiCheckCircle,
  FiClock,
  FiEye
} from 'react-icons/fi';

interface TracerHeaderProps {
  isConnected: boolean;
  isLoading: boolean;
  hasData: boolean;
  stats: {
    totalNodes: number;
    activeNodes: number;
    totalEdges: number;
    totalEvents: number;
  };
  onReset: () => void;
  onLoadData: () => void;
  onRefresh: () => void;
}

export const TracerHeader: React.FC<TracerHeaderProps> = ({
  isConnected,
  isLoading,
  hasData,
  stats,
  onReset,
  onLoadData,
  onRefresh
}) => {
  return (
    <Box borderBottomWidth={1} p={4}>
      <Flex align="center" justify="space-between">
        <Flex align="center" gap={3}>
          <Text fontSize="xl" fontWeight="semibold">Tracer Flow Monitor</Text>
          <Badge 
            colorPalette={isConnected ? "green" : "red"}
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
            onClick={hasData ? onReset : onLoadData}
            colorPalette={hasData ? "red" : "blue"}
            loading={isLoading}
          >
            <Icon as={hasData ? FiRotateCcw : FiPlay} mr={2} />
            {hasData ? 'Reset' : 'Load'} Data
          </Button>
          
          <Button onClick={onRefresh} variant="outline" loading={isLoading}>
            <Icon as={FiRotateCcw} mr={2} />
            Refresh
          </Button>
        </Flex>
      </Flex>

      {/* Stats */}
      <Flex gap={6} mt={3} fontSize="sm" color="fg">
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
  );
};
