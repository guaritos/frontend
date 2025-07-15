import { useState, useCallback, useMemo, useEffect } from 'react';
import { Node, Edge } from '@xyflow/react';
import { useGetAlertByRuleId } from '@/hooks';

const getNodeStyle = (status: string, rank?: number, maxRank?: number) => {
  // Calculate rank-based intensity (higher rank = more intense)
  let intensity = 1;
  let rankLevel = 'low';
  
  if (rank && maxRank) {
    const normalizedRank = rank / maxRank;
    if (normalizedRank > 0.7) {
      intensity = 1;
      rankLevel = 'very-high';
    } else if (normalizedRank > 0.5) {
      intensity = 0.8;
      rankLevel = 'high';
    } else if (normalizedRank > 0.3) {
      intensity = 0.6;
      rankLevel = 'medium';
    } else if (normalizedRank > 0.1) {
      intensity = 0.4;
      rankLevel = 'low';
    } else {
      intensity = 0.2;
      rankLevel = 'very-low';
    }
  }

  const getRankBasedColor = (baseColor: string, intensity: number) => {
    const alpha = Math.max(0.3, intensity);
    return baseColor.replace(')', `, ${alpha})`).replace('rgb', 'rgba');
  };

  const getRankShadow = (rankLevel: string) => {
    switch (rankLevel) {
      case 'very-high':
        return '0 0 20px rgba(239, 68, 68, 0.8), 0 0 40px rgba(239, 68, 68, 0.4)';
      case 'high':
        return '0 0 15px rgba(249, 115, 22, 0.6), 0 0 30px rgba(249, 115, 22, 0.3)';
      case 'medium':
        return '0 0 10px rgba(34, 197, 94, 0.4), 0 0 20px rgba(34, 197, 94, 0.2)';
      case 'low':
        return '0 0 5px rgba(59, 130, 246, 0.3)';
      default:
        return '0 0 3px rgba(107, 114, 128, 0.2)';
    }
  };

  const getBorderWidth = (rankLevel: string) => {
    switch (rankLevel) {
      case 'very-high': return '4px';
      case 'high': return '3px';
      case 'medium': return '2px';
      default: return '1px';
    }
  };

  switch (status) {
    case 'active':
      return { 
        background: rankLevel === 'very-high' ? '#dc2626' : 
                   rankLevel === 'high' ? '#f97316' :
                   rankLevel === 'medium' ? '#22c55e' : '#3b82f6',
        color: 'white',
        border: `${getBorderWidth(rankLevel)} solid ${
          rankLevel === 'very-high' ? '#b91c1c' : 
          rankLevel === 'high' ? '#ea580c' :
          rankLevel === 'medium' ? '#16a34a' : '#2563eb'
        }`,
        boxShadow: getRankShadow(rankLevel),
        fontSize: rankLevel === 'very-high' ? '14px' : 
                 rankLevel === 'high' ? '13px' : '12px',
        fontWeight: rankLevel === 'very-high' || rankLevel === 'high' ? 'bold' : 'normal'
      };
    case 'error':
      return { 
        background: '#ef4444', 
        color: 'white',
        border: '2px solid #dc2626',
        boxShadow: '0 0 10px rgba(239, 68, 68, 0.3)'
      };
    case 'success':
      return { 
        background: '#3b82f6', 
        color: 'white',
        border: '2px solid #2563eb',
        boxShadow: '0 0 10px rgba(59, 130, 246, 0.3)'
      };
    default:
      return { 
        background: '#6b7280', 
        color: 'white',
        border: '1px solid #4b5563'
      };
  }
};

export const useTracerData = (ruleId: string) => {
  const [nodes, setNodes] = useState<Node[]>([]);
  const [edges, setEdges] = useState<Edge[]>([]);
  const [events, setEvents] = useState<any[]>([]);

  // Use the existing hook for data fetching
  const {
    data: alertData,
    isLoading,
    error,
    refetch
  } = useGetAlertByRuleId({
    payload: { ruleId }
  });

  // Process alert data to create nodes and edges
  const processAlertData = useCallback((data: any) => {
    if (data?.data?.strategy_snap_shot_items?.weighted_edges) {
      const newNodes: Node[] = [];
      const newEdges: Edge[] = [];
      
      // Get rank data and find max rank for normalization
      const rankItems = data.data.rank_items || {};
      const ranks = Object.values(rankItems) as number[];
      const maxRank = Math.max(...ranks);
      
      // Create nodes from unique addresses
      const addresses = new Set<string>();
      data.data.strategy_snap_shot_items.weighted_edges.forEach((edge: any) => {
        addresses.add(edge.from);
        addresses.add(edge.to);
      });

      // Sort addresses by rank (highest first) for better positioning
      const sortedAddresses = Array.from(addresses).sort((a, b) => {
        const rankA = rankItems[a] || 0;
        const rankB = rankItems[b] || 0;
        return rankB - rankA;
      });

      sortedAddresses.forEach((address, index) => {
        const rank = rankItems[address] || 0;
        const isHighRank = rank > maxRank * 0.5;
        
        newNodes.push({
          id: address,
          type: 'custom', // Use custom node type
          position: { 
            // Place high-rank nodes more prominently (center area)
            x: isHighRank ? 
                (index % 3) * 300 + 150 : // Center high-rank nodes
                (index % 5) * 250,        // Spread others normally
            y: isHighRank ?
                Math.floor(index / 3) * 200 + 50 :  // Higher position for important nodes
                Math.floor(index / 5) * 180 + 150
          },
          data: {
            label: `${address.slice(0, 8)}...${address.slice(-6)}`,
            status: 'active',
            timestamp: new Date(data.created_at),
            address: address,
            type: 'wallet',
            rank: rank,
            rankLevel: rank > maxRank * 0.7 ? 'very-high' :
                      rank > maxRank * 0.5 ? 'high' :
                      rank > maxRank * 0.3 ? 'medium' :
                      rank > maxRank * 0.1 ? 'low' : 'very-low',
            value: data.data.strategy_snap_shot_items.r[address] || 0,
            details: {
              address,
              rank: rank,
              normalizedRank: maxRank > 0 ? (rank / maxRank).toFixed(3) : '0',
              rValue: data.data.strategy_snap_shot_items.r[address],
              pValue: data.data.strategy_snap_shot_items.p[address],
              rankValue: rank
            }
          }
        });
      });

      // Create edges with enhanced styling based on weight and source rank
      data.data.strategy_snap_shot_items.weighted_edges.forEach((edge: any, index: number) => {
        const sourceRank = rankItems[edge.from] || 0;
        const targetRank = rankItems[edge.to] || 0;
        const avgRank = (sourceRank + targetRank) / 2;
        const isHighRiskEdge = edge.weight > 0.1 && avgRank > maxRank * 0.3;
        
        newEdges.push({
          id: `edge-${index}`,
          type: 'custom', // Use custom edge type
          source: edge.from,
          target: edge.to,
          data: {
            weight: edge.weight,
            timestamp: new Date(edge.timestamp),
            sourceRank,
            targetRank,
            isHighRisk: isHighRiskEdge,
            label: edge.weight > 0.01 ? edge.weight.toFixed(3) : undefined
          },
          animated: isHighRiskEdge, // Animate high-risk edges
        });
      });

      setNodes(newNodes);
      setEdges(newEdges);

      // Add enhanced event with rank information
      const alertEvent = {
        type: 'alert_triggered',
        data: {
          message: data.message,
          rule: data.rules.name,
          status: data.status,
          matched_conditions: data.result.queryResult.length,
          aggregate_results: data.result.aggregateResult.length,
          high_rank_addresses: sortedAddresses.slice(0, 3).map(addr => ({
            address: addr,
            rank: rankItems[addr],
            shortAddress: `${addr.slice(0, 8)}...${addr.slice(-6)}`
          })),
          total_addresses: addresses.size,
          max_rank: maxRank
        },
        timestamp: new Date(data.created_at)
      };
      setEvents([alertEvent]);
    }
  }, []);

  // Handle alert data changes
  useEffect(() => {
    if (alertData) {
      processAlertData(alertData);
    }
  }, [alertData, processAlertData]);

  // Reset data
  const resetData = useCallback(() => {
    setNodes([]);
    setEdges([]);
    setEvents([]);
  }, []);

  // Statistics
  const stats = useMemo(() => {
    return {
      totalNodes: nodes.length,
      activeNodes: nodes.filter(n => n.data?.status === 'active').length,
      totalEdges: edges.length,
      totalEvents: events.length,
      recentEvents: events.slice(-5)
    };
  }, [nodes, edges, events]);

  return {
    nodes,
    edges,
    events,
    setNodes,
    setEdges,
    alertData,
    isLoading,
    error,
    refetch,
    processAlertData,
    resetData,
    stats,
    isConnected: !!alertData
  };
};
