import { Box, Flex, Text, VStack, HStack, Badge } from '@chakra-ui/react';

interface RankLegendProps {
  maxRank?: number;
}

export const RankLegend: React.FC<RankLegendProps> = ({ maxRank }) => {
  const legends = [
    {
      level: 'very-high',
      label: 'Very High Risk',
      color: '#dc2626',
      range: maxRank ? `> ${(maxRank * 0.7).toFixed(3)}` : '> 70%',
      description: 'Critical addresses requiring immediate attention'
    },
    {
      level: 'high',
      label: 'High Risk',
      color: '#f97316',
      range: maxRank ? `${(maxRank * 0.5).toFixed(3)} - ${(maxRank * 0.7).toFixed(3)}` : '50-70%',
      description: 'Addresses with significant suspicious activity'
    },
    {
      level: 'medium',
      label: 'Medium Risk',
      color: '#22c55e',
      range: maxRank ? `${(maxRank * 0.3).toFixed(3)} - ${(maxRank * 0.5).toFixed(3)}` : '30-50%',
      description: 'Addresses requiring monitoring'
    },
    {
      level: 'low',
      label: 'Low Risk',
      color: '#3b82f6',
      range: maxRank ? `${(maxRank * 0.1).toFixed(3)} - ${(maxRank * 0.3).toFixed(3)}` : '10-30%',
      description: 'Normal activity addresses'
    },
    {
      level: 'very-low',
      label: 'Minimal Risk',
      color: '#6b7280',
      range: maxRank ? `< ${(maxRank * 0.1).toFixed(3)}` : '< 10%',
      description: 'Low activity addresses'
    }
  ];

  return (
    <Box bg="bg" rounded="2xl" p={"4"}>
      <Text fontSize="sm" fontWeight="semibold" mb={3}>Risk Level Legend</Text>
      <VStack align="stretch" gap={2}>
        {legends.map((legend, index) => (
          <Flex key={index} align="center" justify="space-between" fontSize="xs">
            <HStack gap={2} flex={1}>
              <Box
                w="12px"
                h="12px"
                bg={legend.color}
                rounded="full"
                border="1px solid"
                borderColor="gray.300"
              />
              <VStack align="start" gap={0} flex={1}>
                <Text fontWeight="medium" color="fg">
                  {legend.label}
                </Text>
                <Text color="fg.subtle" fontSize="10px">
                  {legend.description}
                </Text>
              </VStack>
            </HStack>
            <Badge variant="outline" fontSize="9px" colorPalette="gray">
              {legend.range}
            </Badge>
          </Flex>
        ))}
      </VStack>
      
      {maxRank && (
        <Box mt={3} pt={2} borderTop="1px" borderColor="gray.100">
          <Text fontSize="10px" color="fg">
            Max Rank: <strong>{maxRank.toFixed(3)}</strong>
          </Text>
        </Box>
      )}
    </Box>
  );
};
