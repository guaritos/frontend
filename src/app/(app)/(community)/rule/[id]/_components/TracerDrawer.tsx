"use client";

import { Button, Box, Heading, HStack, Icon, IconButton, Span, Text, VStack, Tabs, TabsRoot, TabsList, TabsTrigger, TabsContent } from "@chakra-ui/react";
import { Tag } from "@/components/ui/tag";
import { Node } from '@xyflow/react';
import { TracerStats } from './TracerStats';
import { NodeDetails } from './NodeDetails';
import { AlertInfo } from './AlertInfo';
import { EventsPanel } from './EventsPanel';
import { RankLegend } from './RankLegend';
import { HiChartBar, HiInformationCircle, HiCog, HiDownload, HiX, HiViewGrid, HiClock, HiDatabase } from "react-icons/hi";
import { useState } from 'react';

interface TracerDrawerProps {
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
}: TracerDrawerProps) => {
  const [isOpen, setIsOpen] = useState(false);

  // Extract max rank from alert data for legend
  const maxRank = alertData?.data?.rank_items ?
    Math.max(...Object.values(alertData.data.rank_items) as number[]) :
    undefined;

  return (
    <>
      {/* Trigger Button */}
      <IconButton
        position="absolute"
        top={4}
        right={4}
        zIndex={1000}
        rounded={"full"}
        size={"sm"}
        colorPalette={"primary"}
        transition={"all 0.3s ease-in-out"}
        onClick={() => setIsOpen(!isOpen)}
        _hover={{
          scale: 1.05,
        }}
        _active={{
          scale: 0.975
        }}
      >
        <Icon as={isOpen ? HiX : HiChartBar} />
      </IconButton>

      {/* Panel */}
      {isOpen && (
        <VStack
          position="absolute"
          top={0}
          right={0}
          w="md"
          h="full"
          rounded={"3xl"}
          p={"4"}
          bg="bg.panel"
          shadow="2xl"
          zIndex={999}
          overflow="auto"
        >
          {/* Header */}
          <VStack w={"full"} align={"start"} gap={4}>
            <HStack justify="space-between" w="full">
              <HStack>
                <Icon as={HiInformationCircle} color="primary.500" />
                <Text color={"fg.subtle"}>
                  Alert Analysis
                </Text>
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

          {/* Body */}
          <TabsRoot defaultValue="overview" h="full" w={"full"}>
            <TabsList>
              <TabsTrigger value="overview">
                <Icon as={HiViewGrid} mr={2} />
                Overview
              </TabsTrigger>
              <Tabs.Trigger value="events">
                <Icon as={HiClock} mr={2} />
                Events
              </Tabs.Trigger>
              <TabsTrigger value="system">
                <Icon as={HiDatabase} mr={2} />
                System
              </TabsTrigger>
            </TabsList>
            <TabsContent value="overview">
              <VStack w={"full"} h={"full"} align="stretch" gap={6}>
                {/* Alert Info */}
                {alertData && <AlertInfo alertData={alertData} />}

                {/* Rank Legend */}
                <RankLegend maxRank={maxRank} />
              </VStack>
            </TabsContent>

            <TabsContent value="events">
              <EventsPanel events={events} />
            </TabsContent>

            <TabsContent value="system">
              <TracerStats
                totalNodes={stats.totalNodes}
                activeNodes={stats.activeNodes}
                totalEdges={stats.totalEdges}
                totalEvents={stats.totalEvents}
                isConnected={isConnected}
              />
            </TabsContent>
          </TabsRoot>
        </VStack>
      )}
    </>
  );
};
