import { create } from 'zustand';
import { addEdge as rfAddEdge, applyNodeChanges, applyEdgeChanges, Connection, NodeChange, EdgeChange, MarkerType } from 'reactflow';
import { ArchNode, ArchEdge, DiagramState, SidebarTab, AutoLayoutDirection, EdgeStyle, ArchEdgeData } from '../types';

interface DiagramActions {
  setNodes: (nodes: ArchNode[]) => void;
  addNode: (node: ArchNode) => void;
  updateNode: (id: string, data: Partial<ArchNode['data']>) => void;
  deleteNode: (id: string) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  setEdges: (edges: ArchEdge[]) => void;
  addEdge: (connection: Connection) => void;
  updateEdge: (id: string, updates: Partial<ArchEdge['data']> | Record<string, unknown>) => void;
  deleteEdge: (id: string) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  selectNode: (id: string | null) => void;
  selectEdge: (id: string | null) => void;
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
  toggleDarkMode: () => void;
  setZoom: (zoom: number) => void;
  setSidebarTab: (tab: SidebarTab) => void;
  setSearchQuery: (query: string) => void;
  toggleFavorite: (id: string) => void;
  addRecentComponent: (id: string) => void;
  loadTemplate: (nodes: ArchNode[], edges: ArchEdge[]) => void;
  clearCanvas: () => void;
  autoLayout: (direction: AutoLayoutDirection) => void;
}

type Store = DiagramState & DiagramActions;

const MAX_HISTORY = 50;

const initialState: DiagramState = {
  nodes: [],
  edges: [],
  selectedNodeId: null,
  selectedEdgeId: null,
  history: [],
  historyIndex: -1,
  isDarkMode: true,
  zoom: 1,
  sidebarTab: 'components',
  searchQuery: '',
  favorites: [],
  recentComponents: [],
};

export const useStore = create<Store>((set, get) => ({
  ...initialState,

  setNodes: (nodes) => set({ nodes }),

  addNode: (node) => {
    get().pushHistory();
    set((s) => ({ nodes: [...s.nodes, node] }));
  },

  updateNode: (id, data) =>
    set((s) => ({
      nodes: s.nodes.map((n) => n.id === id ? { ...n, data: { ...n.data, ...data } } : n),
    })),

  deleteNode: (id) => {
    get().pushHistory();
    set((s) => ({
      nodes: s.nodes.filter((n) => n.id !== id),
      edges: s.edges.filter((e) => e.source !== id && e.target !== id),
      selectedNodeId: s.selectedNodeId === id ? null : s.selectedNodeId,
    }));
  },

  onNodesChange: (changes) =>
    set((s) => ({ nodes: applyNodeChanges(changes, s.nodes) as ArchNode[] })),

  setEdges: (edges) => set({ edges }),

  addEdge: (connection) => {
    get().pushHistory();
    const newEdge: ArchEdge = {
      ...connection,
      id: `e-${Date.now()}`,
      source: connection.source ?? '',
      target: connection.target ?? '',
      type: 'smoothstep',
      label: '',
      data: { color: '#94a3b8', style: 'smoothstep' as EdgeStyle, animated: false, strokeWidth: 2 },
      style: { stroke: '#94a3b8', strokeWidth: 2 },
      markerEnd: { type: MarkerType.ArrowClosed, color: '#94a3b8' },
    };
    set((s) => ({ edges: rfAddEdge(newEdge, s.edges) as ArchEdge[] }));
  },

  updateEdge: (id, updates) =>
    set((s) => ({
      edges: s.edges.map((e) => {
        if (e.id !== id || !updates) return e;
        const base: ArchEdgeData = e.data ?? {
          color: '#94a3b8', style: 'smoothstep' as EdgeStyle, animated: false, strokeWidth: 2,
        };
        const newData: ArchEdgeData = { ...base, ...(updates as Partial<ArchEdgeData>) };
        return {
          ...e,
          data: newData,
          label: 'label' in updates ? (updates as Record<string, unknown>).label as string : e.label,
          type: newData.style === 'bezier' ? 'default' : newData.style,
          animated: newData.animated,
          style: { stroke: newData.color, strokeWidth: newData.strokeWidth },
          markerEnd: { type: MarkerType.ArrowClosed, color: newData.color },
        };
      }),
    })),

  deleteEdge: (id) => {
    get().pushHistory();
    set((s) => ({
      edges: s.edges.filter((e) => e.id !== id),
      selectedEdgeId: s.selectedEdgeId === id ? null : s.selectedEdgeId,
    }));
  },

  onEdgesChange: (changes) =>
    set((s) => ({ edges: applyEdgeChanges(changes, s.edges) as ArchEdge[] })),

  selectNode: (id) => set({ selectedNodeId: id, selectedEdgeId: null }),
  selectEdge: (id) => set({ selectedEdgeId: id, selectedNodeId: null }),

  pushHistory: () => {
    const { nodes, edges, history, historyIndex } = get();
    const newHistory = history.slice(0, historyIndex + 1);
    newHistory.push({ nodes: [...nodes], edges: [...edges] });
    if (newHistory.length > MAX_HISTORY) newHistory.shift();
    set({ history: newHistory, historyIndex: newHistory.length - 1 });
  },

  undo: () => {
    const { history, historyIndex } = get();
    if (historyIndex <= 0) return;
    const prev = history[historyIndex - 1];
    set({ nodes: prev.nodes, edges: prev.edges, historyIndex: historyIndex - 1 });
  },

  redo: () => {
    const { history, historyIndex } = get();
    if (historyIndex >= history.length - 1) return;
    const next = history[historyIndex + 1];
    set({ nodes: next.nodes, edges: next.edges, historyIndex: historyIndex + 1 });
  },

  toggleDarkMode: () => set((s) => ({ isDarkMode: !s.isDarkMode })),
  setZoom: (zoom) => set({ zoom }),
  setSidebarTab: (sidebarTab) => set({ sidebarTab }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),

  toggleFavorite: (id) =>
    set((s) => ({
      favorites: s.favorites.includes(id)
        ? s.favorites.filter((f) => f !== id)
        : [...s.favorites, id],
    })),

  addRecentComponent: (id) =>
    set((s) => ({
      recentComponents: [id, ...s.recentComponents.filter((r) => r !== id)].slice(0, 10),
    })),

  loadTemplate: (nodes, edges) => {
    get().pushHistory();
    set({ nodes, edges, selectedNodeId: null, selectedEdgeId: null });
  },

  clearCanvas: () => {
    get().pushHistory();
    set({ nodes: [], edges: [], selectedNodeId: null, selectedEdgeId: null });
  },

  autoLayout: (direction) => {
    const { nodes } = get();
    if (nodes.length === 0) return;
    get().pushHistory();
    const SPACING_X = 220;
    const SPACING_Y = 160;
    const COLS = Math.ceil(Math.sqrt(nodes.length));
    const positioned = nodes.map((node, i) => {
      let x = 0, y = 0;
      switch (direction) {
        case 'vertical': x = 300; y = i * SPACING_Y + 50; break;
        case 'horizontal': x = i * SPACING_X + 50; y = 200; break;
        case 'grid':
        case 'tree':
          x = (i % COLS) * SPACING_X + 50;
          y = Math.floor(i / COLS) * SPACING_Y + 50;
          break;
      }
      return { ...node, position: { x, y } };
    });
    set({ nodes: positioned });
  },
}));
