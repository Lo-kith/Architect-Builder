import { useEffect } from 'react';
import { useReactFlow } from 'reactflow';
import { useStore } from '../store/diagramStore';

export function useKeyboardShortcuts() {
  const { undo, redo, deleteNode, deleteEdge, selectedNodeId, selectedEdgeId, clearCanvas } = useStore();
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const ctrl = e.ctrlKey || e.metaKey;
      const target = e.target as HTMLElement;

      // Don't fire inside input/textarea
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) return;

      if (ctrl && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        undo();
      } else if (ctrl && (e.key === 'y' || (e.key === 'z' && e.shiftKey))) {
        e.preventDefault();
        redo();
      } else if (ctrl && e.key === 's') {
        e.preventDefault();
        // Trigger save via custom event
        window.dispatchEvent(new CustomEvent('architect:save'));
      } else if (ctrl && e.key === '0') {
        e.preventDefault();
        fitView({ padding: 0.1 });
      } else if (ctrl && e.key === '=') {
        e.preventDefault();
        zoomIn();
      } else if (ctrl && e.key === '-') {
        e.preventDefault();
        zoomOut();
      } else if ((e.key === 'Delete' || e.key === 'Backspace') && !ctrl) {
        if (selectedNodeId) deleteNode(selectedNodeId);
        if (selectedEdgeId) deleteEdge(selectedEdgeId);
      } else if (ctrl && e.key === 'a') {
        // Select all handled by ReactFlow
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, deleteNode, deleteEdge, selectedNodeId, selectedEdgeId, fitView, zoomIn, zoomOut]);
}
