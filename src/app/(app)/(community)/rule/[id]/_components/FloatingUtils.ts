import { Position, XYPosition, Node } from '@xyflow/react';

// Calculate actual node size based on rank level (matching CustomTracerNode logic)
const getNodeSize = (node: Node): number => {
  const rankLevel = (node.data as any)?.rankLevel;
  switch (rankLevel) {
    case 'very-high': return 60;
    case 'high': return 55;
    case 'medium': return 50;
    case 'low': return 45;
    default: return 40;
  }
};

// This helper function returns the intersection point for CIRCULAR nodes
// of the line between the center of the intersectionNode and the target node
function getNodeIntersection(intersectionNode: Node, targetNode: Node): XYPosition {
  // Get actual node sizes based on rank level
  const intersectionNodeSize = getNodeSize(intersectionNode);
  const targetNodeSize = getNodeSize(targetNode);
  
  const intersectionNodePosition = intersectionNode.position;
  const targetPosition = targetNode.position;

  // For circular nodes, radius is half the size
  const intersectionRadius = intersectionNodeSize / 2;
  const targetRadius = targetNodeSize / 2;

  // Center points of both nodes
  const sourceCenter = {
    x: intersectionNodePosition.x + intersectionRadius,
    y: intersectionNodePosition.y + intersectionRadius
  };
  
  const targetCenter = {
    x: targetPosition.x + targetRadius,
    y: targetPosition.y + targetRadius
  };

  // Calculate the direction vector from source center to target center
  const dx = targetCenter.x - sourceCenter.x;
  const dy = targetCenter.y - sourceCenter.y;
  
  // Calculate distance between centers
  const distance = Math.sqrt(dx * dx + dy * dy);
  
  // Avoid division by zero
  if (distance === 0) {
    return sourceCenter;
  }
  
  // Normalize the direction vector and multiply by radius to get intersection point on circle edge
  const normalizedX = dx / distance;
  const normalizedY = dy / distance;
  
  const intersectionPoint = {
    x: sourceCenter.x + normalizedX * intersectionRadius,
    y: sourceCenter.y + normalizedY * intersectionRadius
  };

  return intersectionPoint;
}

// Returns the position for CIRCULAR nodes based on the angle of connection
function getEdgePosition(node: Node, intersectionPoint: XYPosition): Position {
  const nodePosition = node.position;
  const nodeSize = getNodeSize(node);
  const radius = nodeSize / 2;
  
  // Center of the circular node
  const centerX = nodePosition.x + radius;
  const centerY = nodePosition.y + radius;
  
  // Calculate the angle from center to intersection point
  const dx = intersectionPoint.x - centerX;
  const dy = intersectionPoint.y - centerY;
  
  // Convert to angle in degrees (0 = right, 90 = bottom, 180 = left, 270 = top)
  let angle = Math.atan2(dy, dx) * (180 / Math.PI);
  if (angle < 0) angle += 360;
  
  // Determine position based on angle
  // Right: -45 to 45 degrees
  // Bottom: 45 to 135 degrees  
  // Left: 135 to 225 degrees
  // Top: 225 to 315 degrees
  if (angle >= 315 || angle < 45) {
    return Position.Right;
  } else if (angle >= 45 && angle < 135) {
    return Position.Bottom;
  } else if (angle >= 135 && angle < 225) {
    return Position.Left;
  } else {
    return Position.Top;
  }
}

// Returns the parameters (sx, sy, tx, ty, sourcePos, targetPos) you need to create an edge
export function getEdgeParams(source: Node, target: Node) {
  const sourceIntersectionPoint = getNodeIntersection(source, target);
  const targetIntersectionPoint = getNodeIntersection(target, source);

  const sourcePos = getEdgePosition(source, sourceIntersectionPoint);
  const targetPos = getEdgePosition(target, targetIntersectionPoint);

  return {
    sx: sourceIntersectionPoint.x,
    sy: sourceIntersectionPoint.y,
    tx: targetIntersectionPoint.x,
    ty: targetIntersectionPoint.y,
    sourcePos,
    targetPos,
  };
}
