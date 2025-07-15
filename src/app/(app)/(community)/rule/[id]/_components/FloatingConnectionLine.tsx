"use client";

import { ConnectionLineComponentProps, getBezierPath, Position } from '@xyflow/react';

// Calculate actual node size based on rank level (matching CustomTracerNode logic)
const getNodeSize = (node: any): number => {
  const rankLevel = node.data?.rankLevel;
  switch (rankLevel) {
    case 'very-high': return 60;
    case 'high': return 55;
    case 'medium': return 50;
    case 'low': return 45;
    default: return 40;
  }
};

export default function FloatingConnectionLine({
  fromNode,
  fromHandle,
  fromX,
  fromY,
  toX,
  toY,
  connectionLineStyle,
}: ConnectionLineComponentProps) {
  if (!fromNode || !fromHandle) {
    return null;
  }

  // Use the actual handle position if available, otherwise use fromX/fromY
  const sourceX = fromX;
  const sourceY = fromY;
  
  // Determine source position based on handle position or calculate from node center
  let sourcePosition = fromHandle.position || Position.Bottom;
  
  // Calculate target position based on relative position for CIRCULAR nodes
  const nodeSize = getNodeSize(fromNode);
  const nodeRadius = nodeSize / 2;
  const nodeCenter = {
    x: fromNode.position.x + nodeRadius,
    y: fromNode.position.y + nodeRadius
  };
  
  // Calculate angle from node center to mouse position
  const dx = toX - nodeCenter.x;
  const dy = toY - nodeCenter.y;
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  
  // Determine target position based on angle (opposite of source)
  let targetPosition = Position.Top;
  if (angle >= 315 || angle < 45) {
    targetPosition = Position.Left;
  } else if (angle >= 45 && angle < 135) {
    targetPosition = Position.Top;
  } else if (angle >= 135 && angle < 225) {
    targetPosition = Position.Right;
  } else {
    targetPosition = Position.Bottom;
  }

  const [edgePath] = getBezierPath({
    sourceX: sourceX,
    sourceY: sourceY,
    sourcePosition: sourcePosition,
    targetX: toX,
    targetY: toY,
    targetPosition: targetPosition,
  });

  return (
    <g>
      <path
        d={edgePath}
        fill="none"
        stroke="#3b82f6"
        strokeWidth={2}
        strokeDasharray="5,5"
        style={connectionLineStyle}
        opacity={0.8}
      />
      {/* Add a small circle at the target position for better visual feedback */}
      <circle
        cx={toX}
        cy={toY}
        r={4}
        fill="#3b82f6"
        opacity={0.6}
      />
    </g>
  );
}
