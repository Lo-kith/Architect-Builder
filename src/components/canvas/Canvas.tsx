import { useCallback, useRef } from 'react';
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  BackgroundVariant,
  Connection,
  NodeTypes,
  MarkerType,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { useStore } from '../../store';
import { ArchNode as ArchNodeComponent, COMPONENTS } from '../../nodes';
import { ArchNode, NodeCategory } from '../../types';

const nodeTypes: NodeTypes = {
  archNode: ArchNodeComponent,
};

export default function Canvas() {
  const {
    nodes, edges, onNodesChange, onEdgesChange,
    addEdge: storeAddEdge, isDarkMode, selectNode, selectEdge,
  } = useStore();

  // Sync all visual edge props from data on every render so Properties Panel changes show live
  const visualEdges = edges.map((e) => {
    const d = e.data ?? { color: '#94a3b8', style: 'smoothstep', animated: false, strokeWidth: 2 };
    return {
      ...e,
      type: d.style === 'bezier' ? 'default' : d.style,
      animated: d.animated,
      style: { stroke: d.color, strokeWidth: d.strokeWidth },
      markerEnd: { type: MarkerType.ArrowClosed, color: d.color },
      labelStyle: { fill: '#cbd5e1', fontSize: 10, fontWeight: 500 },
      labelBgStyle: { fill: isDarkMode ? '#1e2030' : '#f1f5f9', fillOpacity: 0.92 },
      labelBgPadding: [5, 3] as [number, number],
      labelBgBorderRadius: 4,
    };
  });

  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const dark = isDarkMode;

  const onConnect = useCallback(
    (connection: Connection) => storeAddEdge(connection),
    [storeAddEdge]
  );

  const onDrop = useCallback(
    (event: React.DragEvent<HTMLDivElement>) => {
      event.preventDefault();
      const componentId = event.dataTransfer.getData('componentId');
      if (!componentId) return;

      const comp = COMPONENTS.find((c) => c.id === componentId);
      if (!comp || !reactFlowWrapper.current) return;

      const rect = reactFlowWrapper.current.getBoundingClientRect();
      const position = {
        x: event.clientX - rect.left - 90,
        y: event.clientY - rect.top - 40,
      };

      const newNode: ArchNode = {
        id: `node-${Date.now()}`,
        type: 'archNode',
        position,
        data: {
          label: comp.name,
          subtitle: comp.category,
          description: comp.description,
          category: comp.category as NodeCategory,
          componentType: comp.id,
          icon: comp.icon,
          style: comp.defaultStyle,
          metadata: comp.defaultMetadata ?? {},
        },
      };

      useStore.getState().addNode(newNode);
    },
    []
  );

  const onDragOver = useCallback((event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.dataTransfer.dropEffect = 'copy';
  }, []);

  const onEdgeClick = useCallback(
    (_: React.MouseEvent, edge: Edge) => selectEdge(edge.id),
    [selectEdge]
  );

  const onPaneClick = useCallback(() => {
    selectNode(null);
    selectEdge(null);
  }, [selectNode, selectEdge]);

  const defaultEdgeOptions = {
    type: 'smoothstep',
    style: { stroke: '#475569', strokeWidth: 2 },
    markerEnd: { type: MarkerType.ArrowClosed, color: '#475569' },
  };

  return (
    <div ref={reactFlowWrapper} className="flex-1 h-full relative">
      <ReactFlow
        nodes={nodes}
        edges={visualEdges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onEdgeClick={onEdgeClick}
        onPaneClick={onPaneClick}
        onDrop={onDrop}
        onDragOver={onDragOver}
        nodeTypes={nodeTypes}
        defaultEdgeOptions={defaultEdgeOptions}
        snapToGrid
        snapGrid={[16, 16]}
        fitView
        fitViewOptions={{ padding: 0.15 }}
        minZoom={0.1}
        maxZoom={4}
        deleteKeyCode={['Backspace', 'Delete']}
        multiSelectionKeyCode="Shift"
        selectionKeyCode="Shift"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={20}
          size={1}
          color={dark ? '#2a2b36' : '#e2e8f0'}
        />
        <Controls
          className={`!border !rounded-xl !shadow-xl !overflow-hidden ${dark ? '!bg-[#1a1b24] !border-white/10' : '!bg-white !border-gray-200'}`}
          showInteractive={false}
        />
        <MiniMap
          className={`!rounded-xl !border !shadow-xl ${dark ? '!bg-[#1a1b24] !border-white/10' : '!bg-white !border-gray-200'}`}
          nodeColor={(node) => (node.data as ArchNode['data'])?.style?.background ?? '#475569'}
          maskColor={dark ? 'rgba(0,0,0,0.5)' : 'rgba(255,255,255,0.5)'}
          zoomable
          pannable
        />

        {/* Empty state */}
        {nodes.length === 0 && (
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <div className={`text-center ${dark ? 'text-gray-600' : 'text-gray-300'}`}>
              <div className="text-4xl mb-3">⬡</div>
              <div className="text-[14px] font-semibold mb-1">Start Building</div>
              <div className="text-[12px] opacity-70">
                Drag components from the sidebar or pick a template
              </div>
            </div>
          </div>
        )}
      </ReactFlow>
    </div>
  );
}
