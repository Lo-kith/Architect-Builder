import { useEffect, useCallback } from 'react';
import { ReactFlowProvider } from 'reactflow';
import { useStore } from './store/diagramStore';
import Header from './components/toolbar/Header';
import Toolbar from './components/toolbar/Toolbar';
import Sidebar from './components/sidebar/Sidebar';
import Canvas from './components/canvas/Canvas';
import PropertiesPanel from './components/panels/PropertiesPanel';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import { exportToJSON, importFromJSON, triggerFileInput } from './utils/export';

function AppInner() {
  const { isDarkMode, nodes, edges, loadTemplate } = useStore();
  useKeyboardShortcuts();

  // Apply dark mode class to document
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // Load saved data from Figma on mount
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      const msg = event.data?.pluginMessage;
      if (!msg) return;
      if (msg.type === 'DATA_LOADED' && msg.payload) {
        loadTemplate(msg.payload.nodes ?? [], msg.payload.edges ?? []);
      }
    };
    window.addEventListener('message', handleMessage);
    // Request load
    parent.postMessage({ pluginMessage: { type: 'LOAD_DATA' } }, '*');
    return () => window.removeEventListener('message', handleMessage);
  }, [loadTemplate]);

  // Auto-save on change
  useEffect(() => {
    const save = () =>
      parent.postMessage({ pluginMessage: { type: 'SAVE_DATA', payload: { nodes, edges } } }, '*');
    const handler = () => save();
    window.addEventListener('architect:save', handler);
    return () => window.removeEventListener('architect:save', handler);
  }, [nodes, edges]);

  const handleExportFigma = useCallback(() => {
    parent.postMessage({ pluginMessage: { type: 'EXPORT_TO_FIGMA', payload: { nodes, edges } } }, '*');
  }, [nodes, edges]);

  const handleExportJSON = useCallback(() => {
    exportToJSON(nodes, edges);
  }, [nodes, edges]);

  const handleImportJSON = useCallback(() => {
    triggerFileInput('.json', async (file) => {
      const data = await importFromJSON(file);
      loadTemplate(data.nodes, data.edges);
    });
  }, [loadTemplate]);

  const bg = isDarkMode ? 'bg-[#0c0d12]' : 'bg-gray-50';

  return (
    <div className={`flex flex-col h-screen w-screen ${bg} overflow-hidden`}>
      <Header onExportFigma={handleExportFigma} />
      <ReactFlowProvider>
        <Toolbar
          onExportJSON={handleExportJSON}
          onImportJSON={handleImportJSON}
        />
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <Canvas />
          <PropertiesPanel />
        </div>
      </ReactFlowProvider>
    </div>
  );
}

export default function App() {
  return (
    <ReactFlowProvider>
      <AppInner />
    </ReactFlowProvider>
  );
}
