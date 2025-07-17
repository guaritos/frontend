import { PageLayout } from "@/components/global/layout"
import { TracerDashboard } from './_components/TracerDashboard';
import { Box } from '@chakra-ui/react';

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ alertId?: string }>
}) {
  const { id } = await params
  const { alertId } = await searchParams
  
  // Mock user ID - in real app this would come from auth
  const userId = "user123";
  
  // Use alertId from query params or default to a demo ID
  const currentAlertId = alertId || "77"; // Using the ID from your example data

  return (
    <PageLayout>
      <Box w="full" h="full">
        <TracerDashboard 
          ruleId={id} 
          userId={userId} 
          alertId={currentAlertId}
        />
      </Box>
    </PageLayout>
  )
}