import { useState, useCallback } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, ReactFlowProps } from '@xyflow/react';
import '@xyflow/react/dist/style.css';

interface Props extends ReactFlowProps {
    ruleId: string;
}

export const TracerFlow: React.FC<Props> = ({ nodes, edges, onNodesChange, onEdgesChange, onConnect }) => {

    return (
        <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            fitView
        />
    );
}