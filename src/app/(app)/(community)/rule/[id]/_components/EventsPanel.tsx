"use client";

import { useState, useMemo } from 'react';
import {
  Box,
  Flex,
  Text,
  Badge,
  VStack,
  Icon,
  createListCollection,
  Button,
  SelectHiddenSelect,
  Code
} from '@chakra-ui/react';
import {
  FiAlertTriangle,
  FiClock,
  FiFilter
} from 'react-icons/fi';
import JsonView from '@uiw/react-json-view';
import { darkTheme } from '@uiw/react-json-view/dark';
import { SelectContent, SelectItem, SelectLabel, SelectRoot, SelectTrigger, SelectValueText } from '@/components/ui/select';

interface EventsPanelProps {
  events: any[];
}

const collection = createListCollection({
  items: [
    { value: 'all', label: 'All' },
    { value: 'alert_triggered', label: 'Alerts' },
    { value: 'user_notification', label: 'Notifications' },
    { value: 'tracer_update', label: 'Updates' }
  ]
})

export const EventsPanel: React.FC<EventsPanelProps> = ({ events }) => {
  const [eventFilter, setEventFilter] = useState<string>('all');

  // Filter events
  const filteredEvents = useMemo(() => {
    if (eventFilter === 'all') return events;
    return events.filter(event => event.type === eventFilter);
  }, [events, eventFilter]);

  return (
    <VStack w={"full"} h={"full"}  gap={"4"}>
      <VStack w={"full"} align="start">
        <Flex align="center" gap={2}>
          <Icon as={FiAlertTriangle} />
          <Text fontSize="sm" fontWeight="semibold">Events</Text>
        </Flex>
        <SelectRoot
          variant={"subtle"}
          collection={collection}
          onValueChange={(e) => setEventFilter(e.value[0])}
        >
          <SelectTrigger>
            <SelectValueText placeholder="Filter" />'
          </SelectTrigger>
          <SelectContent>
            {
              collection.items.map(item => (
                <SelectItem
                  key={item.value}
                  item={item}
                >
                  {item.label}
                </SelectItem>
              ))
            }
          </SelectContent>
        </SelectRoot>
      </VStack>
      {filteredEvents.length === 0 ? (
        <VStack py={8} color="fg">
          <Icon as={FiClock} boxSize="32px" mb={2} />
          <Text fontSize="sm">No events yet</Text>
        </VStack>
      ) : (
        <VStack gap={"4"} w={"full"} h={"full"} align={"start"} overflowY="hidden">
          {filteredEvents.slice(-10).map((event: any, index: number) => (
            <>
              <Flex align="center" justify="space-between" w={"full"}>
                <Badge
                  variant="solid"
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
              <Box overflowY="auto" w={"full"} h="full">
                <JsonView value={event.data} style={darkTheme} />
              </Box>
            </>
          ))}
        </VStack>
      )}
    </VStack>
  );
};
