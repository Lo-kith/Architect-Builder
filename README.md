# Architect Builder

> **A powerful Figma plugin for designing software architecture diagrams — visually, inside Figma.**

![Architect Builder Banner](https://placehold.co/1200x400/1a1b24/6366f1?text=Architect+Builder)

Architect Builder lets developers, architects, students, DevOps engineers, and designers drag, drop, and connect 40+ pre-built infrastructure components onto an infinite canvas — then export the result directly to Figma frames.

---

## ✨ Features

- **40+ Component Library** — Frontend, Backend, Database, Cloud, Queue, Auth, Monitoring, and more
- **8 Built-in Templates** — MERN, Next.js, Microservices, Event-Driven, Serverless, Auth Flow, Chat App, E-Commerce
- **React Flow Canvas** — Drag & drop, zoom, pan, minimap, snap-to-grid
- **Smart Connections** — Bezier, smooth, straight edges with labels, colors, and animation
- **Property Panel** — Edit title, subtitle, color, border-radius, shadow, metadata, tags, notes
- **Auto Layout** — Vertical, Horizontal, Grid, Tree arrangement
- **Dark / Light Mode** — Full theme support
- **Import / Export** — JSON import/export, Export to Figma frames
- **Undo / Redo** — Full history stack (50 steps)
- **Keyboard Shortcuts** — `Ctrl+Z`, `Ctrl+Y`, `Ctrl+S`, `Del`, `Ctrl+0`, `Ctrl+±`
- **Favorites & Recent** — Quick access to your most-used components

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm 9+
- Figma Desktop (for plugin mode)

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/architect-builder.git
cd architect-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) to use the app in the browser.

### Build for Production

```bash
npm run build
```

The built files land in `dist/`.

---

## 🔌 Figma Plugin Setup

1. Open **Figma Desktop**
2. Go to **Plugins → Development → Import plugin from manifest**
3. Select the `manifest.json` from this repository
4. Run `npm run build` to compile
5. Launch the plugin from **Plugins → Development → Architect Builder**

> **Note:** The `Export to Figma` button in the toolbar sends your architecture diagram directly into the current Figma page as native frames and text layers.

---

## 📁 Project Structure

```
architect-builder/
├── manifest.json              # Figma plugin manifest
├── index.html                 # HTML entry point
├── vite.config.ts             # Vite bundler config
├── tailwind.config.ts         # Tailwind CSS config
├── tsconfig.json              # TypeScript config
│
└── src/
    ├── main.tsx               # React entry point
    ├── App.tsx                # Root application component
    │
    ├── types/
    │   └── index.ts           # All TypeScript interfaces & types
    │
    ├── store/
    │   └── diagramStore.ts    # Zustand global state store
    │
    ├── nodes/
    │   ├── ArchNode.tsx       # Custom React Flow node component
    │   └── componentDefs.ts   # 40+ component definitions & metadata
    │
    ├── templates/
    │   └── index.ts           # 8 pre-built architecture templates
    │
    ├── components/
    │   ├── sidebar/
    │   │   └── Sidebar.tsx    # Left panel: search, tabs, component list
    │   ├── canvas/
    │   │   └── Canvas.tsx     # React Flow infinite canvas
    │   ├── toolbar/
    │   │   ├── Header.tsx     # Top bar with logo and export button
    │   │   └── Toolbar.tsx    # Icon toolbar (save, layout, zoom, etc.)
    │   └── panels/
    │       └── PropertiesPanel.tsx  # Right panel: node/edge properties
    │
    ├── hooks/
    │   └── useKeyboardShortcuts.ts  # Global keyboard bindings
    │
    ├── utils/
    │   └── export.ts          # JSON import/export utilities
    │
    ├── plugin/
    │   └── controller.ts      # Figma plugin main thread controller
    │
    └── styles/
        └── globals.css        # Global CSS + Tailwind directives
```

---

## 🧩 Component Library

| Category | Components |
|----------|-----------|
| **Frontend** | Web App, Mobile App, Desktop App |
| **Backend** | REST API, GraphQL, Node.js, Express, Next.js, Microservice |
| **Database** | PostgreSQL, MongoDB, MySQL, Redis, ElasticSearch |
| **Queue / Messaging** | Kafka, RabbitMQ, Event Bus |
| **Infrastructure** | Nginx, Load Balancer, API Gateway |
| **Cloud** | CDN, Lambda, Cloud Function, Serverless |
| **Storage** | S3, Firebase, Supabase |
| **Authentication** | OAuth, JWT, Email |
| **Monitoring** | Monitoring, Logging, Analytics |
| **Networking** | Proxy, DNS |
| **Utilities** | Payment, Notification, Worker, Cron, Cache, Webhook, WebSocket |
| **Deployment** | Docker, Kubernetes |

---

## 📐 Templates

| Template | Description |
|----------|-------------|
| **MERN Stack** | MongoDB + Express + React + Node.js |
| **Next.js App** | Full-stack with API routes, PostgreSQL, Redis |
| **Microservices** | API Gateway, Auth, User, Order services with Kafka |
| **Event-Driven** | Producer → Kafka → multiple consumers |
| **Serverless** | CloudFront → API Gateway → Lambda functions |
| **Auth Flow** | OAuth + JWT + Redis sessions + email verification |
| **Chat Application** | WebSocket + Redis pub/sub + MongoDB |
| **E-Commerce** | Next.js → microservices + Stripe + PostgreSQL |

---

## ⌨️ Keyboard Shortcuts

| Shortcut | Action |
|----------|--------|
| `Ctrl + Z` | Undo |
| `Ctrl + Y` / `Ctrl + Shift + Z` | Redo |
| `Ctrl + S` | Save / Export JSON |
| `Ctrl + 0` | Fit view |
| `Ctrl + =` | Zoom in |
| `Ctrl + -` | Zoom out |
| `Delete` / `Backspace` | Delete selected node or edge |

---

## 🛠 Tech Stack

| Tool | Version | Purpose |
|------|---------|---------|
| React | 18 | UI framework |
| TypeScript | 5 | Type safety |
| Vite | 5 | Build tool |
| Tailwind CSS | 3 | Styling |
| React Flow | 11 | Canvas & node graph |
| Zustand | 5 | State management |
| Lucide React | 0.447 | Icons |
| Figma Plugin API | 1.0 | Figma integration |

---

## 🤝 Contributing

Contributions are welcome! Please open an issue or pull request.

1. Fork the repo
2. Create a feature branch: `git checkout -b feature/your-feature`
3. Commit: `git commit -m 'feat: add your feature'`
4. Push: `git push origin feature/your-feature`
5. Open a pull request

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

## 🖼 Screenshots

> _Add screenshots of your plugin UI here._

| Dark Mode Canvas | Component Sidebar | Properties Panel |
|:-:|:-:|:-:|
| ![Canvas](screenshots/canvas-dark.png) | ![Sidebar](screenshots/sidebar.png) | ![Panel](screenshots/properties.png) |

---

Made with ❤️ for the Figma Community
