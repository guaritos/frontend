"use client";

import { Box, Text, Badge, VStack, HStack, Icon, Flex } from '@chakra-ui/react';
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
    <Box bg="white" border="1px" borderColor="gray.200" rounded="lg" p={4}>
      <Flex align="center" justify="space-between" mb={3}>
        <HStack>
          <Icon as={FiAlertTriangle} color="orange.500" />
          <Text fontSize="sm" fontWeight="semibold">Alert Information</Text>
        </HStack>
        <Badge colorScheme={getStatusColor(alertData.status)} variant="subtle">
          {alertData.status}
        </Badge>
      </Flex>

      <VStack align="stretch" gap={3}>
        <Box>
          <HStack mb={1}>
            <Icon as={FiHash} boxSize="12px" />
            <Text fontSize="xs" fontWeight="medium" color="gray.500">Alert ID</Text>
          </HStack>
          <Text fontSize="sm">{alertData.id}</Text>
        </Box>

        <Box>
          <HStack mb={1}>
            <Icon as={FiUser} boxSize="12px" />
            <Text fontSize="xs" fontWeight="medium" color="gray.500">Rule</Text>
          </HStack>
          <Text fontSize="sm">{alertData.rules?.name || 'Unknown Rule'}</Text>
        </Box>

        <Box>
          <HStack mb={1}>
            <Icon as={FiClock} boxSize="12px" />
            <Text fontSize="xs" fontWeight="medium" color="gray.500">Created At</Text>
          </HStack>
          <Text fontSize="sm">{new Date(alertData.created_at).toLocaleString()}</Text>
        </Box>

        <Box h="1px" bg="gray.200" my={2} />

        <Box>
          <Text fontSize="xs" fontWeight="medium" color="gray.500" mb={2}>Rule Conditions</Text>
          <VStack align="stretch" gap={1}>
            {alertData.result?.queryResult?.map((condition: any, index: number) => (
              <Box key={index} bg="gray.50" p={2} rounded="md">
                <Text fontSize="xs" fontFamily="mono">
                  {condition.field} {condition.operator} {JSON.stringify(condition.expected)}
                </Text>
                <Badge size="sm" colorScheme="green" mt={1}>
                  Matched: {condition.matched?.length || 0} items
                </Badge>
              </Box>
            ))}
          </VStack>
        </Box>

        {alertData.result?.aggregateResult && alertData.result.aggregateResult.length > 0 && (
          <Box>
            <Text fontSize="xs" fontWeight="medium" color="gray.500" mb={2}>Aggregate Results</Text>
            <VStack align="stretch" gap={1}>
              {alertData.result.aggregateResult.map((agg: any, index: number) => (
                <Box key={index} bg="blue.50" p={2} rounded="md">
                  <Text fontSize="xs" fontFamily="mono">
                    {agg.op}({agg.field}) {agg.operator} {agg.expected}
                  </Text>
                  <HStack justify="space-between" mt={1}>
                    <Badge size="sm" colorScheme="blue">
                      Expected: {agg.expected}
                    </Badge>
                    <Badge size="sm" colorScheme={agg.actual > agg.expected ? 'green' : 'red'}>
                      Actual: {agg.actual}
                    </Badge>
                  </HStack>
                </Box>
              ))}
            </VStack>
          </Box>
        )}

        <Box>
          <Text fontSize="xs" fontWeight="medium" color="gray.500" mb={1}>Message</Text>
          <Text fontSize="sm" bg="gray.50" p={2} rounded="md">
            {alertData.message}
          </Text>
        </Box>
      </VStack>
    </Box>
  );
};
