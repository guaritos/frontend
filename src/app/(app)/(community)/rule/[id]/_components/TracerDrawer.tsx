"use client";

import { Button, DrawerRootProps, Heading, HStack, Icon, Span, StackProps, Text, VStack } from "@chakra-ui/react";
import { DrawerActionTrigger, DrawerBody, DrawerContent, DrawerHeader, DrawerRoot, DrawerTrigger } from "@/components/ui/drawer";
import { Tag } from "@/components/ui/tag";
import { Node } from '@xyflow/react';
import { TracerStats } from './TracerStats';
import { NodeDetails } from './NodeDetails';
import { AlertInfo } from './AlertInfo';
import { EventsPanel } from './EventsPanel';
import { RankLegend } from './RankLegend';
import { HiChartBar, HiInformationCircle, HiCog, HiDownload } from "react-icons/hi";

interface TracerDrawerProps extends Omit<DrawerRootProps, "children"> {
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

export const TracerDrawer = ({ 
  alertData, 
  selectedNode, 
  stats, 
  events, 
  isConnected,
  ...props 
}: TracerDrawerProps) => {
  // Extract max rank from alert data for legend
  const maxRank = alertData?.data?.rank_items ? 
    Math.max(...Object.values(alertData.data.rank_items) as number[]) : 
    undefined;

  return (
    <DrawerRoot size={"lg"} {...props}>
      <DrawerTrigger asChild>
        <Button 
          position="absolute"
          top={4}
          right={4}
          zIndex={1000}
          rounded={"full"} 
          size={"sm"}
          colorPalette={"primary"}
          transition={"all 0.3s ease-in-out"}
          _hover={{
            scale: 1.05,
          }}
          _active={{
            scale: 0.975
          }}
        >
          <Icon as={HiChartBar} mr={2} />
          Dashboard
        </Button>
      </DrawerTrigger>
      <DrawerContent>
        <DrawerHeader>
          <VStack w={"full"} align={"start"}>
            <HStack justify="space-between" w="full">
              <HStack>
                <Icon as={HiInformationCircle} color="primary.500" />
                <Text color={"fg.subtle"}>
                  Alert Analysis
                </Text>
              </HStack>
              <HStack>
                <Button variant={"plain"} rounded={"full"} size={"xs"}>
                  <Icon as={HiCog} />
                  Settings
                </Button>
                <Button variant={"outline"} rounded={"full"} size={"xs"}>
                  <Icon as={HiDownload} />
                  Export
                </Button>
              </HStack>
            </HStack>
            <Heading as={"h6"} size="2xl" fontWeight={"semibold"}>
              Tracer Dashboard
            </Heading>
            <HStack w={"full"} flexWrap="wrap" gap={2}>
              <Tag variant={"solid"} colorPalette={isConnected ? "green" : "red"}>
                <Span color={isConnected ? "green.900" : "red.900"}>
                  {isConnected ? "Connected" : "Disconnected"}
                </Span>
              </Tag>
              {alertData && (
                <Tag variant={"outline"} colorPalette={"primary"}>
                  <Span>Alert #{alertData.id}</Span>
                </Tag>
              )}
              <Tag variant={"subtle"} colorPalette={"gray"}>
                <Span>{stats.totalNodes} Nodes</Span>
              </Tag>
              <Tag variant={"subtle"} colorPalette={"blue"}>
                <Span>{stats.totalEdges} Connections</Span>
              </Tag>
            </HStack>
          </VStack>
        </DrawerHeader>
        <DrawerBody>
          <VStack align="stretch" gap={6} h="full">
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

            {/* Events Panel */}
            <EventsPanel events={events} />
          </VStack>
        </DrawerBody>
      </DrawerContent>
    </DrawerRoot>
  );
};
