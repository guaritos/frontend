"use client";

import { Box, HStack, Icon, Text } from "@chakra-ui/react";
import { HiCheckCircle, HiExclamationCircle, HiInformationCircle } from "react-icons/hi";
import { useEffect, useState } from "react";

interface TracerNotificationProps {
  events: any[];
}

export const TracerNotification = ({ events }: TracerNotificationProps) => {
  const [latestEvent, setLatestEvent] = useState<any>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (events.length > 0) {
      const newest = events[events.length - 1];
      if (newest !== latestEvent) {
        setLatestEvent(newest);
        setVisible(true);
        
        // Auto hide after 3 seconds
        const timer = setTimeout(() => {
          setVisible(false);
        }, 3000);
        
        return () => clearTimeout(timer);
      }
    }
  }, [events, latestEvent]);

  if (!visible || !latestEvent) return null;

  const getEventIcon = (type: string) => {
    switch (type) {
      case 'success': return HiCheckCircle;
      case 'warning': return HiExclamationCircle;
      default: return HiInformationCircle;
    }
  };

  const getEventColor = (type: string) => {
    switch (type) {
      case 'success': return 'green.500';
      case 'warning': return 'orange.500';
      default: return 'blue.500';
    }
  };

  return (
    <Box
      position="absolute"
      top={4}
      right={4}
      zIndex={1001}
      bg={"bg.panel"}
      rounded={"xl"}
      p={3}
      maxW="300px"
      opacity={visible ? 1 : 0}
      transform={visible ? "translateY(0)" : "translateY(-20px)"}
      transition={"all 0.3s ease-in-out"}
      onClick={() => setVisible(false)}
      cursor="pointer"
    >
      <HStack gap={2}>
        <Icon 
          as={getEventIcon(latestEvent.type)} 
          color={getEventColor(latestEvent.type)} 
          boxSize="16px"
          flexShrink={0}
        />
        <Box>
          <Text fontSize="sm" fontWeight="semibold" color="fg.emphasized">
            {latestEvent.title || 'New Event'}
          </Text>
          <Text fontSize="xs" color="fg.muted" lineClamp={2}>
            {latestEvent.description || 'A new tracer event has occurred'}
          </Text>
        </Box>
      </HStack>
    </Box>
  );
};
