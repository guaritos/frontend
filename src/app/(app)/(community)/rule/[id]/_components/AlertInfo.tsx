"use client";

import { Field } from '@/components/ui/field';
import { Tag } from '@/components/ui/tag';
import { Box, Text, Badge, VStack, HStack, Icon, Flex, Code } from '@chakra-ui/react';
import { FiAlertTriangle, FiClock, FiUser, FiHash, FiCheckCircle } from 'react-icons/fi';

interface AlertInfoProps {
  alertData: any;
}

export const AlertInfo: React.FC<AlertInfoProps> = ({ alertData }) => {
  if (!alertData) return null;

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending': return 'yellow';
      case 'resolved': return 'green';
      case 'active': return 'blue';
      default: return 'gray';
    }
  };

  return (
    <Box rounded="lg" w={"full"}>
      <Flex align="center" justify="space-between" mb={3}>
        <HStack>
          <Icon as={FiAlertTriangle} color="orange.500" />
          <Text fontSize="sm" fontWeight="semibold">Alert Information</Text>
        </HStack>
        <Badge colorPalette={getStatusColor(alertData.status)} variant="subtle">
          {alertData.status}
        </Badge>
      </Flex>

      <VStack align="stretch" gap={3}>
        <Field label="Alert ID" w="full">
          <Text fontSize="sm">{alertData.id}</Text>
        </Field>

        <Field label="Rule" w="full">
          <Text fontSize="sm">{alertData.rules?.name || 'Unknown Rule'}</Text>
        </Field>

        <Field label="Created At" w="full">
          <Text fontSize="sm">{new Date(alertData.created_at).toLocaleString()}</Text>
        </Field>

        <Field label="Rule Conditions" w="full">
          <VStack align="stretch" gap={"2"}>
            {alertData.result?.queryResult?.map((condition: any, index: number) => (
              <Box key={index} bg="bg" p={"4"} rounded="2xl" w={"full"}>
                <Text fontSize="xs" fontFamily="mono" wordBreak={"break-word"} lineHeight={"taller"}>
                  <Code colorPalette={"default"} rounded={"md"}>{condition.field}</Code>{' '}
                  <Tag as="span" px={1} py={0.5} colorPalette={"yellow"} variant={"solid"} fontWeight="bold">
                    {condition.operator}
                  </Tag>{' '}
                  {JSON.stringify(condition.expected)}
                </Text>
                <Badge size="sm" colorPalette="green" mt={1}>
                  Matched {condition.matched?.length || 0} items
                </Badge>
              </Box>
            ))}
          </VStack>
        </Field>

        {alertData.result?.aggregateResult && alertData.result.aggregateResult.length > 0 && (
          <Field label="Aggregate Results" w="full">
            <VStack align="stretch" gap={1} w={"full"}>
              {alertData.result.aggregateResult.map((agg: any, index: number) => (
                <Box key={index} bg="bg" p={"4"} rounded="2xl" w={"full"}>
                  <Text fontSize="xs" wordBreak={"break-word"} lineHeight={"taller"}>
                    <Tag colorPalette={"primary"} variant={"solid"}>{agg.op}</Tag>{' '}
                    <Code colorPalette={"default"}>({agg.field})</Code>{' '}
                    <Tag as="span" px={1} py={0.5} colorPalette={"yellow"} variant={"solid"} fontWeight="bold">
                      {agg.operator}
                    </Tag>{' '}
                    {agg.expected}
                  </Text>
                  <HStack justify="space-between" mt={1}>
                    <Badge size="sm" colorPalette="blue">
                      Expected {agg.expected}
                    </Badge>
                    <Badge size="sm" colorPalette={agg.actual > agg.expected ? 'green' : 'red'}>
                      Actual {agg.actual}
                    </Badge>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Field>
        )}

        <Field label="Alert Message" w={"full"}>
          <Text fontSize="sm" p={"4"} bg={"primary.solid"} color={"primary.contrast"} rounded="2xl">
            {alertData.message}
          </Text>
        </Field>
      </VStack>
    </Box>
  );
};
