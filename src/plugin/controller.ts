/// <reference types="@figma/plugin-typings" />

figma.showUI(__html__, { width: 1200, height: 720, themeColors: true });

figma.ui.onmessage = async (msg: { type: string; payload?: unknown }) => {
  switch (msg.type) {
    case 'LOAD_DATA': {
      const data = figma.root.getPluginData('architectDiagram');
      figma.ui.postMessage({ type: 'DATA_LOADED', payload: data ? JSON.parse(data) : null });
      break;
    }

    case 'SAVE_DATA': {
      figma.root.setPluginData('architectDiagram', JSON.stringify(msg.payload));
      break;
    }

    case 'EXPORT_TO_FIGMA': {
      try {
        const payload = msg.payload as {
          nodes: Array<{
            id: string;
            data: {
              label: string;
              subtitle?: string;
              style: { background: string; borderRadius: number };
            };
            position: { x: number; y: number };
          }>;
          edges: Array<{
            source: string;
            target: string;
            label?: string;
          }>;
        };

        const frame = figma.createFrame();
        frame.name = 'Architecture Diagram';
        frame.resize(1400, 900);
        frame.fills = [{ type: 'SOLID', color: { r: 0.08, g: 0.08, b: 0.1 } }];
        frame.cornerRadius = 16;

        const nodeMap: Record<string, FrameNode> = {};

        for (const node of payload.nodes) {
          const box = figma.createFrame();
          box.resize(160, 70);
          box.x = node.position.x;
          box.y = node.position.y;
          box.cornerRadius = node.data.style.borderRadius;

          const hex = node.data.style.background.replace('#', '');
          const r = parseInt(hex.slice(0, 2), 16) / 255;
          const g = parseInt(hex.slice(2, 4), 16) / 255;
          const b = parseInt(hex.slice(4, 6), 16) / 255;
          box.fills = [{ type: 'SOLID', color: { r, g, b }, opacity: 0.15 }];
          box.strokes = [{ type: 'SOLID', color: { r, g, b } }];
          box.strokeWeight = 1.5;
          box.name = node.data.label;

          await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
          await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

          const label = figma.createText();
          label.fontName = { family: 'Inter', style: 'SemiBold' };
          label.fontSize = 13;
          label.characters = node.data.label;
          label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
          label.x = 12;
          label.y = 16;

          if (node.data.subtitle) {
            const sub = figma.createText();
            sub.fontName = { family: 'Inter', style: 'Regular' };
            sub.fontSize = 10;
            sub.characters = node.data.subtitle;
            sub.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.6, b: 0.7 } }];
            sub.x = 12;
            sub.y = 34;
            box.appendChild(sub);
          }

          box.appendChild(label);
          frame.appendChild(box);
          nodeMap[node.id] = box;
        }

        figma.currentPage.appendChild(frame);
        figma.viewport.scrollAndZoomIntoView([frame]);
        figma.ui.postMessage({ type: 'EXPORT_COMPLETE' });
      } catch (err) {
        figma.ui.postMessage({ type: 'ERROR', payload: String(err) });
      }
      break;
    }

    case 'RESIZE': {
      const { width, height } = msg.payload as { width: number; height: number };
      figma.ui.resize(width, height);
      break;
    }

    default:
      break;
  }
};
