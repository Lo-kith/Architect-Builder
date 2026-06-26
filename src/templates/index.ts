import { ArchTemplate, ArchNode, ArchEdge, NodeCategory, EdgeStyle } from '../types';
import { MarkerType } from 'reactflow';

const makeNode = (
  id: string, label: string, subtitle: string,
  category: NodeCategory, componentType: string, icon: string,
  bg: string, border: string, x: number, y: number
): ArchNode => ({
  id,
  type: 'archNode',
  position: { x, y },
  data: {
    label, subtitle, category, componentType, icon,
    description: '',
    style: { color: '#fff', background: bg, border, borderRadius: 12, shadow: true },
    metadata: {},
  },
});

const makeEdge = (id: string, source: string, target: string, label?: string, color = '#94a3b8'): ArchEdge => ({
  id, source, target,
  label: label ?? '',
  type: 'smoothstep',
  data: { color, style: 'smoothstep' as EdgeStyle, animated: false, strokeWidth: 2 },
  style: { stroke: color, strokeWidth: 2 },
  markerEnd: { type: MarkerType.ArrowClosed, color },
});

export const TEMPLATES: ArchTemplate[] = [
  {
    id: 'mern', name: 'MERN Stack',
    description: 'MongoDB + Express + React + Node.js full-stack application',
    category: 'Full Stack', tags: ['mern', 'react', 'node', 'mongodb'],
    nodes: [
      makeNode('n1', 'React App', 'Web Frontend', 'frontend', 'web-app', 'Globe', '#6366f1', '#4f46e5', 300, 50),
      makeNode('n2', 'Express API', 'REST Backend', 'backend', 'express', 'Zap', '#374151', '#1f2937', 300, 220),
      makeNode('n3', 'MongoDB', 'Database', 'database', 'mongodb', 'Leaf', '#4db33d', '#3d9030', 300, 390),
      makeNode('n4', 'Node.js', 'Runtime', 'backend', 'nodejs', 'Server', '#22c55e', '#16a34a', 550, 220),
    ],
    edges: [
      makeEdge('e1', 'n1', 'n2', 'HTTP/JSON'),
      makeEdge('e2', 'n2', 'n3', 'Mongoose ODM'),
      makeEdge('e3', 'n4', 'n2', 'hosts'),
    ],
  },
  {
    id: 'nextjs', name: 'Next.js App',
    description: 'Full-stack Next.js application with API routes and database',
    category: 'Full Stack', tags: ['nextjs', 'react', 'fullstack'],
    nodes: [
      makeNode('n1', 'Next.js', 'Full-stack App', 'frontend', 'nextjs', 'Triangle', '#171717', '#000', 300, 50),
      makeNode('n2', 'API Routes', 'Serverless', 'api', 'rest-api', 'Network', '#0ea5e9', '#0284c7', 550, 50),
      makeNode('n3', 'PostgreSQL', 'Primary DB', 'database', 'postgresql', 'Database', '#336791', '#2a5475', 300, 250),
      makeNode('n4', 'Redis', 'Cache', 'database', 'redis', 'Layers', '#d82c20', '#b52319', 550, 250),
      makeNode('n5', 'CDN', 'Edge Network', 'cloud', 'cdn', 'Globe2', '#f97316', '#ea580c', 50, 50),
    ],
    edges: [
      makeEdge('e1', 'n5', 'n1', 'serves'),
      makeEdge('e2', 'n1', 'n2', 'calls'),
      makeEdge('e3', 'n2', 'n3', 'Prisma ORM'),
      makeEdge('e4', 'n2', 'n4', 'cache'),
    ],
  },
  {
    id: 'microservices', name: 'Microservices',
    description: 'Distributed microservices architecture with API gateway',
    category: 'Architecture', tags: ['microservices', 'distributed', 'kubernetes'],
    nodes: [
      makeNode('n1', 'Web App', 'Client', 'frontend', 'web-app', 'Globe', '#6366f1', '#4f46e5', 300, 20),
      makeNode('n2', 'API Gateway', 'Entry point', 'api', 'api-gateway', 'GitFork', '#ef4444', '#dc2626', 300, 150),
      makeNode('n3', 'Auth Service', 'JWT/OAuth', 'authentication', 'oauth', 'Key', '#10b981', '#059669', 50, 300),
      makeNode('n4', 'User Service', 'User mgmt', 'backend', 'microservice', 'Package', '#7e22ce', '#6b21a8', 250, 300),
      makeNode('n5', 'Order Service', 'Orders', 'backend', 'microservice', 'Package', '#7e22ce', '#6b21a8', 450, 300),
      makeNode('n6', 'Notification', 'Alerts', 'utilities', 'notification', 'Bell', '#f59e0b', '#d97706', 650, 300),
      makeNode('n7', 'Kafka', 'Event Bus', 'queue', 'kafka', 'Activity', '#231f20', '#000', 350, 450),
      makeNode('n8', 'PostgreSQL', 'User DB', 'database', 'postgresql', 'Database', '#336791', '#2a5475', 150, 580),
      makeNode('n9', 'MongoDB', 'Order DB', 'database', 'mongodb', 'Leaf', '#4db33d', '#3d9030', 450, 580),
    ],
    edges: [
      makeEdge('e1', 'n1', 'n2'), makeEdge('e2', 'n2', 'n3'), makeEdge('e3', 'n2', 'n4'),
      makeEdge('e4', 'n2', 'n5'), makeEdge('e5', 'n5', 'n7', 'events'),
      makeEdge('e6', 'n7', 'n6'), makeEdge('e7', 'n4', 'n8'), makeEdge('e8', 'n5', 'n9'),
    ],
  },
  {
    id: 'event-driven', name: 'Event-Driven',
    description: 'Event-driven architecture with message queue',
    category: 'Architecture', tags: ['events', 'kafka', 'rabbitmq', 'async'],
    nodes: [
      makeNode('n1', 'Producer', 'Event source', 'backend', 'rest-api', 'Network', '#0ea5e9', '#0284c7', 50, 200),
      makeNode('n2', 'Kafka', 'Event Stream', 'queue', 'kafka', 'Activity', '#231f20', '#000', 300, 200),
      makeNode('n3', 'Consumer A', 'Order svc', 'backend', 'microservice', 'Package', '#7e22ce', '#6b21a8', 550, 100),
      makeNode('n4', 'Consumer B', 'Email svc', 'backend', 'microservice', 'Package', '#7e22ce', '#6b21a8', 550, 220),
      makeNode('n5', 'Consumer C', 'Analytics', 'monitoring', 'analytics', 'TrendingUp', '#3b82f6', '#2563eb', 550, 340),
      makeNode('n6', 'Dead Letter', 'Failed msgs', 'utilities', 'worker', 'Settings', '#64748b', '#475569', 300, 380),
    ],
    edges: [
      makeEdge('e1', 'n1', 'n2', 'publish'), makeEdge('e2', 'n2', 'n3', 'consume'),
      makeEdge('e3', 'n2', 'n4', 'consume'), makeEdge('e4', 'n2', 'n5', 'consume'),
      makeEdge('e5', 'n2', 'n6', 'DLQ'),
    ],
  },
  {
    id: 'serverless', name: 'Serverless',
    description: 'AWS serverless architecture with Lambda and API Gateway',
    category: 'Cloud', tags: ['serverless', 'lambda', 'aws', 'cloud'],
    nodes: [
      makeNode('n1', 'Web App', 'Frontend', 'frontend', 'web-app', 'Globe', '#6366f1', '#4f46e5', 300, 30),
      makeNode('n2', 'CloudFront', 'CDN', 'cloud', 'cdn', 'Globe2', '#f97316', '#ea580c', 300, 170),
      makeNode('n3', 'API Gateway', 'AWS APIGW', 'api', 'api-gateway', 'GitFork', '#ef4444', '#dc2626', 300, 310),
      makeNode('n4', 'Lambda A', 'User fn', 'cloud', 'lambda', 'Cpu', '#ff9900', '#e68900', 100, 450),
      makeNode('n5', 'Lambda B', 'Order fn', 'cloud', 'lambda', 'Cpu', '#ff9900', '#e68900', 300, 450),
      makeNode('n6', 'Lambda C', 'Email fn', 'cloud', 'lambda', 'Cpu', '#ff9900', '#e68900', 500, 450),
      makeNode('n7', 'DynamoDB', 'NoSQL', 'database', 'mongodb', 'Leaf', '#4db33d', '#3d9030', 200, 590),
      makeNode('n8', 'S3', 'File Store', 'storage', 's3', 'HardDrive', '#e8a117', '#c78a13', 500, 590),
    ],
    edges: [
      makeEdge('e1', 'n1', 'n2'), makeEdge('e2', 'n2', 'n3'), makeEdge('e3', 'n3', 'n4'),
      makeEdge('e4', 'n3', 'n5'), makeEdge('e5', 'n3', 'n6'), makeEdge('e6', 'n4', 'n7'),
      makeEdge('e7', 'n5', 'n7'), makeEdge('e8', 'n6', 'n8'),
    ],
  },
  {
    id: 'auth-flow', name: 'Authentication Flow',
    description: 'Complete authentication and authorization flow with OAuth',
    category: 'Security', tags: ['auth', 'oauth', 'jwt', 'security'],
    nodes: [
      makeNode('n1', 'Web App', 'Client', 'frontend', 'web-app', 'Globe', '#6366f1', '#4f46e5', 50, 200),
      makeNode('n2', 'Auth Service', 'Auth API', 'authentication', 'oauth', 'Key', '#10b981', '#059669', 300, 200),
      makeNode('n3', 'OAuth Provider', 'Google/GitHub', 'authentication', 'oauth', 'Key', '#f59e0b', '#d97706', 550, 100),
      makeNode('n4', 'JWT Service', 'Token mgmt', 'authentication', 'jwt', 'Lock', '#f43f5e', '#e11d48', 550, 300),
      makeNode('n5', 'User DB', 'Profiles', 'database', 'postgresql', 'Database', '#336791', '#2a5475', 300, 380),
      makeNode('n6', 'Redis', 'Sessions', 'database', 'redis', 'Layers', '#d82c20', '#b52319', 550, 450),
      makeNode('n7', 'Email', 'Verification', 'authentication', 'email-service', 'Mail', '#6366f1', '#4f46e5', 50, 380),
    ],
    edges: [
      makeEdge('e1', 'n1', 'n2', 'login'), makeEdge('e2', 'n2', 'n3', 'OAuth'),
      makeEdge('e3', 'n2', 'n4', 'issue token'), makeEdge('e4', 'n4', 'n1', 'JWT'),
      makeEdge('e5', 'n2', 'n5', 'lookup'), makeEdge('e6', 'n4', 'n6', 'store'),
      makeEdge('e7', 'n2', 'n7', 'verify email'),
    ],
  },
  {
    id: 'chat-app', name: 'Chat Application',
    description: 'Real-time chat application with WebSocket support',
    category: 'Full Stack', tags: ['chat', 'websocket', 'realtime'],
    nodes: [
      makeNode('n1', 'React App', 'Chat UI', 'frontend', 'web-app', 'Globe', '#6366f1', '#4f46e5', 300, 30),
      makeNode('n2', 'Mobile App', 'iOS/Android', 'frontend', 'mobile-app', 'Smartphone', '#8b5cf6', '#7c3aed', 550, 30),
      makeNode('n3', 'Load Balancer', 'Traffic', 'infrastructure', 'load-balancer', 'BarChart2', '#f59e0b', '#d97706', 300, 180),
      makeNode('n4', 'WS Server', 'Socket.io', 'utilities', 'socket', 'Wifi', '#059669', '#047857', 150, 320),
      makeNode('n5', 'REST API', 'HTTP API', 'backend', 'rest-api', 'Network', '#0ea5e9', '#0284c7', 450, 320),
      makeNode('n6', 'Redis', 'Pub/Sub', 'database', 'redis', 'Layers', '#d82c20', '#b52319', 150, 470),
      makeNode('n7', 'MongoDB', 'Messages', 'database', 'mongodb', 'Leaf', '#4db33d', '#3d9030', 450, 470),
    ],
    edges: [
      makeEdge('e1', 'n1', 'n3', 'WS + HTTP'), makeEdge('e2', 'n2', 'n3', 'WS + HTTP'),
      makeEdge('e3', 'n3', 'n4', 'WS'), makeEdge('e4', 'n3', 'n5', 'HTTP'),
      makeEdge('e5', 'n4', 'n6', 'pub/sub'), makeEdge('e6', 'n5', 'n7', 'store'),
    ],
  },
  {
    id: 'ecommerce', name: 'E-Commerce Platform',
    description: 'Full e-commerce platform with payment processing',
    category: 'Full Stack', tags: ['ecommerce', 'payment', 'stripe'],
    nodes: [
      makeNode('n1', 'Next.js Store', 'Storefront', 'frontend', 'nextjs', 'Triangle', '#171717', '#000', 300, 30),
      makeNode('n2', 'API Gateway', 'Entry', 'api', 'api-gateway', 'GitFork', '#ef4444', '#dc2626', 300, 180),
      makeNode('n3', 'Product Svc', 'Catalog', 'backend', 'microservice', 'Package', '#7e22ce', '#6b21a8', 50, 330),
      makeNode('n4', 'Order Svc', 'Orders', 'backend', 'microservice', 'Package', '#7e22ce', '#6b21a8', 250, 330),
      makeNode('n5', 'Payment Svc', 'Stripe', 'utilities', 'payment', 'CreditCard', '#635bff', '#4d47e0', 450, 330),
      makeNode('n6', 'PostgreSQL', 'Orders DB', 'database', 'postgresql', 'Database', '#336791', '#2a5475', 250, 490),
      makeNode('n7', 'Redis', 'Cart Cache', 'database', 'redis', 'Layers', '#d82c20', '#b52319', 50, 490),
      makeNode('n8', 'S3', 'Media', 'storage', 's3', 'HardDrive', '#e8a117', '#c78a13', 450, 490),
    ],
    edges: [
      makeEdge('e1', 'n1', 'n2', 'API calls'), makeEdge('e2', 'n2', 'n3'),
      makeEdge('e3', 'n2', 'n4'), makeEdge('e4', 'n4', 'n5', 'charge'),
      makeEdge('e5', 'n4', 'n6'), makeEdge('e6', 'n3', 'n7'), makeEdge('e7', 'n3', 'n8'),
    ],
  },
];

export const TEMPLATE_CATEGORIES = [...new Set(TEMPLATES.map((t) => t.category))];
