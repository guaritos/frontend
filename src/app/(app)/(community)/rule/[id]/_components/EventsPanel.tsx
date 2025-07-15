import { useState, useMemo } from 'react';
import { 
  Box, 
  Flex, 
  Text, 
  Badge, 
  VStack, 
  Icon
} from '@chakra-ui/react';
import { 
  FiAlertTriangle,
  FiClock,
  FiFilter
} from 'react-icons/fi';

interface EventsPanelProps {
  events: any[];
}

export const EventsPanel: React.FC<EventsPanelProps> = ({ events }) => {
  const [eventFilter, setEventFilter] = useState<string>('all');

  // Filter events
  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return events;
    return events.filter(event => event.type === eventFilter);
  }, [events, eventFilter]);

  return (
    <Box flex={1} rounded="lg" minH="200px">
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
            <VStack py={8} color="fg">
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
                      colorPalette={
                        event.type === 'alert_triggered' ? 'red' :
                        event.type === 'user_notification' ? 'blue' :
                        event.type === 'tracer_update' ? 'green' : 'gray'
                      }
                    >
                      {event.type.replace('_', ' ')}
                    </Badge>
                    <Text fontSize="xs" color="fg">
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
  );
};
