import { Node, Edge } from 'reactflow';

export type NodeCategory =
  | 'frontend' | 'backend' | 'api' | 'authentication' | 'database'
  | 'storage' | 'cloud' | 'queue' | 'messaging' | 'infrastructure'
  | 'monitoring' | 'security' | 'networking' | 'deployment' | 'utilities';

export interface NodeStyle {
  color: string;
  background: string;
  border: string;
  borderRadius: number;
  shadow: boolean;
  icon?: string;
}

export interface NodeMetadata {
  version?: string;
  port?: number;
  protocol?: string;
  region?: string;
  tags?: string[];
  notes?: string;
  url?: string;
  [key: string]: unknown;
}

export interface ArchNodeData {
  label: string;
  subtitle?: string;
  description?: string;
  category: NodeCategory;
  componentType: string;
  icon: string;
  style: NodeStyle;
  metadata: NodeMetadata;
  selected?: boolean;
}

export type ArchNode = Node<ArchNodeData>;

export type EdgeStyle = 'straight' | 'bezier' | 'smoothstep' | 'step';

export interface ArchEdgeData {
  label?: string;
  color: string;
  style: EdgeStyle;
  animated: boolean;
  strokeWidth: number;
}

export type ArchEdge = Edge<ArchEdgeData>;

export interface ComponentDefinition {
  id: string;
  name: string;
  category: NodeCategory;
  icon: string;
  description: string;
  defaultStyle: NodeStyle;
  defaultMetadata?: NodeMetadata;
}

export interface ArchTemplate {
  id: string;
  name: string;
  description: string;
  category: string;
  nodes: ArchNode[];
  edges: ArchEdge[];
  tags: string[];
}

export interface DiagramState {
  nodes: ArchNode[];
  edges: ArchEdge[];
  selectedNodeId: string | null;
  selectedEdgeId: string | null;
  history: { nodes: ArchNode[]; edges: ArchEdge[] }[];
  historyIndex: number;
  isDarkMode: boolean;
  zoom: number;
  sidebarTab: SidebarTab;
  searchQuery: string;
  favorites: string[];
  recentComponents: string[];
}

export type SidebarTab = 'components' | 'templates' | 'recent' | 'favorites';
export type AutoLayoutDirection = 'vertical' | 'horizontal' | 'grid' | 'tree';

export type FigmaMessageType =
  | 'EXPORT_TO_FIGMA' | 'EXPORT_PNG' | 'EXPORT_SVG'
  | 'SAVE_DATA' | 'LOAD_DATA' | 'DATA_LOADED' | 'EXPORT_COMPLETE' | 'ERROR';

export interface FigmaMessage {
  type: FigmaMessageType;
  payload?: unknown;
}
