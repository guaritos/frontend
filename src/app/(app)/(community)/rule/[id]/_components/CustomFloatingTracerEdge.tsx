"use client";

import { memo, useState } from 'react';
import { EdgeProps, getBezierPath, EdgeLabelRenderer, BaseEdge, Edge, useStore } from '@xyflow/react';
import { Box, Text, Badge, VStack, HStack } from '@chakra-ui/react';
import { HoverCardContent, HoverCardRoot, HoverCardTrigger } from '@/components/ui/hover-card';
import { getEdgeParams } from './FloatingUtils';
import { TracerEdgeData } from './CustomTracerEdge';

const getEdgeStyle = (data: TracerEdgeData) => {
    const weight = data.weight || 0;
    const isHighRisk = data.isHighRisk || false;

    let strokeWidth = 2;
    let stroke = '#6b7280';
    let strokeDasharray = undefined;
    let opacity = 0.6;

    if (weight > 0.7) {
        strokeWidth = 4;
        stroke = '#ef4444';
        opacity = 0.9;
    } else if (weight > 0.5) {
        strokeWidth = 3;
        stroke = '#f97316';
        opacity = 0.8;
    } else if (weight > 0.3) {
        strokeWidth = 3;
        stroke = '#eab308';
        opacity = 0.7;
    } else if (weight > 0.1) {
        strokeWidth = 2;
        stroke = '#3b82f6';
        opacity = 0.6;
    }

    if (isHighRisk) {
        strokeWidth = Math.max(strokeWidth, 4);
        stroke = '#dc2626';
        strokeDasharray = '5,5';
        opacity = 1;
    }

    return { strokeWidth, stroke, strokeDasharray, opacity };
};

const getEdgeLabel = (data: TracerEdgeData) => {
    const weight = data.weight || 0;
    return weight > 0.01 ? weight.toFixed(3) : null;
};

const getEdgeLabelStyle = (data: TracerEdgeData) => {
    const weight = data.weight || 0;
    const isHighRisk = data.isHighRisk || false;

    if (isHighRisk || weight > 0.7) {
        return { background: '#fee2e2', color: '#dc2626', border: '1px solid #fca5a5' };
    } else if (weight > 0.5) {
        return { background: '#fed7aa', color: '#ea580c', border: '1px solid #fdba74' };
    } else if (weight > 0.3) {
        return { background: '#fef3c7', color: '#d97706', border: '1px solid #fde68a' };
    } else {
        return { background: '#dbeafe', color: '#2563eb', border: '1px solid #93c5fd' };
    }
};

const EDGE_TOOLTIP_FIELDS: {
    key: keyof TracerEdgeData;
    label: string;
    color?: string;
    valueColor?: string;
    format?: (value: any) => string;
}[] = [
    {
        key: 'weight',
        label: 'Weight:',
        color: 'primary.solid',
        format: (v: number) => v.toFixed(6),
    },
    {
        key: 'sourceRank',
        label: 'Source Rank:',
        format: (v: number) => v.toFixed(6),
    },
    {
        key: 'targetRank',
        label: 'Target Rank:',
        format: (v: number) => v.toFixed(6),
    },
    {
        key: 'timestamp',
        label: 'Timestamp:',
        format: (v: Date) => v.toLocaleTimeString(),
    },
];

const EdgeTooltip: React.FC<{ data: TracerEdgeData; children: React.ReactNode }> = ({ data, children }) => (
    <HoverCardRoot openDelay={100} closeDelay={100}>
        <HoverCardTrigger asChild>{children}</HoverCardTrigger>
        <HoverCardContent rounded={"2xl"}>
            <VStack align="stretch" gap={2} minW="200px">
                <Text fontSize="sm" fontWeight="bold" color="fg">Floating Edge Details</Text>
                <VStack align="stretch" gap={1}>
                    {EDGE_TOOLTIP_FIELDS.map(field => {
                        const value = data[field.key];
                        if (value === undefined || value === null) return null;
                        return (
                            <HStack justify="space-between" key={field.key as string}>
                                <Text fontSize="xs" color={"fg.subtle"}>{field.label}</Text>
                                <Text fontSize="xs" fontWeight={field.key === 'weight' ? 'semibold' : undefined} color={field.color || 'fg'}>
                                    {field.format ? field.format(value) : String(value)}
                                </Text>
                            </HStack>
                        );
                    })}
                </VStack>
                {data.isHighRisk && <Badge colorPalette="red" size="sm" textAlign="center">High Risk Connection</Badge>}
            </VStack>
        </HoverCardContent>
    </HoverCardRoot>
);

export const CustomFloatingTracerEdge: React.FC<EdgeProps<Edge<TracerEdgeData>>> = memo(({
    id, source, target, data = {}, markerEnd, selected
}) => {
    const edgeData = (data || {}) as TracerEdgeData;
    const edgeStyle = getEdgeStyle(edgeData);
    const label = getEdgeLabel(edgeData);
    const labelStyle = getEdgeLabelStyle(edgeData);
    const [isHovered, setIsHovered] = useState(false);

    // Get source and target nodes from store
    const { sourceNode, targetNode } = useStore((s) => {
        const sourceNode = s.nodeLookup.get(source);
        const targetNode = s.nodeLookup.get(target);
        return { sourceNode, targetNode };
    });

    if (!sourceNode || !targetNode) {
        return null;
    }

    // Calculate floating edge positions
    const { sx, sy, tx, ty, sourcePos, targetPos } = getEdgeParams(sourceNode, targetNode);

    const [edgePath, labelX, labelY] = getBezierPath({
        sourceX: sx,
        sourceY: sy,
        sourcePosition: sourcePos,
        targetX: tx,
        targetY: ty,
        targetPosition: targetPos,
    });

    // Enhanced style when hovered
    const getHoverStyle = () => {
        if (!isHovered && !selected) return edgeStyle;

        return {
            ...edgeStyle,
            strokeWidth: (edgeStyle.strokeWidth as number) + 2, // Increase width on hover
            opacity: Math.min((edgeStyle.opacity as number) + 0.3, 1), // Increase opacity
            filter: 'drop-shadow(0 0 12px rgba(59, 130, 246, 0.6)) brightness(1.2)',
            stroke: selected ? '#3b82f6' : edgeStyle.stroke, // Blue when selected
        };
    };

    // Calculate edge direction for proper animation
    const isHorizontal = Math.abs(sx - tx) > Math.abs(sy - ty);
    const animationDirection = isHorizontal ?
        (sx < tx ? 'left-to-right' : 'right-to-left') :
        (sy < ty ? 'top-to-bottom' : 'bottom-to-top');

    return (
        <>
            {/* SVG Gradient Definition */}
            <defs>
                <linearGradient id={`flowGradient-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="50%" stopColor="#3b82f6" stopOpacity="0.8" />
                    <stop offset="100%" stopColor="transparent" />
                </linearGradient>
            </defs>

            {/* Debug: Show connection points (remove in production) */}
            {isHovered && (
                <>
                    <circle
                        cx={sx}
                        cy={sy}
                        r={3}
                        fill="#00ff00"
                        opacity={0.7}
                    />
                    <circle
                        cx={tx}
                        cy={ty}
                        r={3}
                        fill="#ff0000"
                        opacity={0.7}
                    />
                </>
            )}

            {/* Main Edge */}
            <BaseEdge
                path={edgePath}
                markerEnd={markerEnd}
                style={{
                    ...getHoverStyle(),
                    transition: 'all 0.3s ease-in-out',
                    cursor: 'pointer'
                }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
            />

            {/* Animated flow indicator when hovered */}
            {isHovered && (
                <BaseEdge
                    path={edgePath}
                    style={{
                        strokeWidth: 3,
                        stroke: `url(#flowGradient-${id})`,
                        strokeDasharray: '10,5',
                        strokeDashoffset: '-15',
                        animation: 'flowAnimation 1.5s linear infinite',
                        opacity: 0.8,
                        pointerEvents: 'none'
                    }}
                />
            )}

            {/* CSS Animation Keyframes */}
            <style jsx>{`
                @keyframes flowAnimation {
                    0% { 
                        stroke-dashoffset: ${animationDirection.includes('right') || animationDirection.includes('bottom') ? '-15' : '15'}; 
                    }
                    100% { 
                        stroke-dashoffset: ${animationDirection.includes('right') || animationDirection.includes('bottom') ? '-30' : '30'}; 
                    }
                }
            `}</style>

            {label && (
                <EdgeLabelRenderer>
                    <Box
                        position="absolute"
                        transform={`translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`}
                        className="nodrag nopan"
                        pointerEvents="all"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <EdgeTooltip data={edgeData}>
                            <Badge
                                size="sm"
                                px={2}
                                py={1}
                                fontSize="xs"
                                fontWeight="semibold"
                                rounded="md"
                                style={{
                                    ...labelStyle,
                                    transform: isHovered ? 'scale(1.15)' : 'scale(1)',
                                    boxShadow: isHovered ? '0 4px 12px rgba(0,0,0,0.2)' : '0 2px 4px rgba(0,0,0,0.1)',
                                    transition: 'all 0.2s ease-in-out'
                                }}
                                cursor="pointer"
                            >
                                {label}
                            </Badge>
                        </EdgeTooltip>
                    </Box>
                </EdgeLabelRenderer>
            )}
            {edgeData.isHighRisk && (
                <EdgeLabelRenderer>
                    <Box
                        position="absolute"
                        transform={`translate(-50%, -50%) translate(${labelX + 20}px, ${labelY - 15}px)`}
                        className="nodrag nopan"
                    >
                        <Box
                            w={isHovered ? "12px" : "8px"}
                            h={isHovered ? "12px" : "8px"}
                            bg="red.500"
                            rounded="full"
                            animation={isHovered ? "pulse 1s infinite" : "pulse 2s infinite"}
                            border="1px solid white"
                            transition="all 0.3s ease-in-out"
                            boxShadow={isHovered ? "0 0 16px rgba(239, 68, 68, 0.8)" : "0 0 8px rgba(239, 68, 68, 0.5)"}
                        />
                    </Box>
                </EdgeLabelRenderer>
            )}
        </>
    );
});

CustomFloatingTracerEdge.displayName = 'CustomFloatingTracerEdge';
