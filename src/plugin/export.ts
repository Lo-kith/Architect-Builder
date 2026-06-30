/// <reference types="@figma/plugin-typings" />
import { ArchNode, ArchEdge } from '../types';

// Helper: parse a hex color string to Figma RGB (0-1 range)
function hexToRgb(hex: string): { r: number; g: number; b: number } {
  let h = hex.replace('#', '');
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  if (h.length !== 6) h = '6366f1';
  return {
    r: parseInt(h.slice(0, 2), 16) / 255,
    g: parseInt(h.slice(2, 4), 16) / 255,
    b: parseInt(h.slice(4, 6), 16) / 255,
  };
}

// Try to load a font; fall back gracefully
async function loadFont(family: string, style: string): Promise<{ family: string; style: string }> {
  try {
    await figma.loadFontAsync({ family, style });
    return { family, style };
  } catch {
    // Roboto is always bundled in Figma — use as universal fallback
    await figma.loadFontAsync({ family: 'Roboto', style });
    return { family: 'Roboto', style };
  }
}

export async function exportToFigma(payload: { nodes: ArchNode[]; edges: ArchEdge[] }): Promise<void> {
  // Load fonts up front — fall back to Roboto if Inter is unavailable
  const boldFont  = await loadFont('Inter', 'Semi Bold');
  const regFont   = await loadFont('Inter', 'Regular');

  // ── Create the outer frame ────────────────────────────────────────────────
  const PADDING = 60;
  const NODE_W  = 180;
  const NODE_H  = 70;

  const frame = figma.createFrame();
  frame.name = 'Architecture Diagram';
  frame.resize(1400, 900);
  // White/light background so nodes are clearly visible
  frame.fills = [{ type: 'SOLID', color: { r: 0.96, g: 0.97, b: 0.98 } }];
  frame.cornerRadius = 16;

  const nodeMap: Record<string, FrameNode> = {};

  // ── Create node boxes ─────────────────────────────────────────────────────
  for (const node of payload.nodes) {
    const accentColor = hexToRgb(node.data?.style?.background || '#6366f1');
    const borderRadius = node.data?.style?.borderRadius ?? 12;
    const hasDesc = !!node.data?.description;
    const tags = Array.isArray(node.data?.metadata?.tags) ? node.data.metadata.tags as string[] : [];
    const hasTags = tags.length > 0;

    // Dynamic height
    let boxH = NODE_H;
    if (hasDesc) boxH += 22;
    if (hasTags) boxH += 20;

    // Main card — white background with colored left border accent
    const box = figma.createFrame();
    box.resize(NODE_W, boxH);
    box.x = node.position.x + PADDING;
    box.y = node.position.y + PADDING;
    box.cornerRadius = borderRadius;
    box.name = node.data?.label || 'Node';
    box.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }]; // white card
    box.strokes = [{ type: 'SOLID', color: { r: 0.9, g: 0.9, b: 0.92 } }];
    box.strokeWeight = 1;
    if (node.data?.style?.shadow) {
      box.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.1 },
        offset: { x: 0, y: 2 },
        radius: 8,
        visible: true,
        blendMode: 'NORMAL',
      }];
    }

    // Top accent bar (colored strip)
    const accentBar = figma.createRectangle();
    accentBar.resize(NODE_W, 4);
    accentBar.x = 0;
    accentBar.y = 0;
    accentBar.fills = [{ type: 'SOLID', color: accentColor }];
    accentBar.topLeftRadius = borderRadius;
    accentBar.topRightRadius = borderRadius;
    box.appendChild(accentBar);

    // Icon container (colored circle)
    const iconBg = figma.createEllipse();
    iconBg.resize(28, 28);
    iconBg.x = 12;
    iconBg.y = 12;
    iconBg.fills = [{ type: 'SOLID', color: accentColor, opacity: 0.15 }];
    box.appendChild(iconBg);

    // Accent dot inside icon
    const dot = figma.createEllipse();
    dot.resize(10, 10);
    dot.x = 21;
    dot.y = 21;
    dot.fills = [{ type: 'SOLID', color: accentColor }];
    box.appendChild(dot);

    // Label
    const labelText = figma.createText();
    labelText.fontName = boldFont;
    labelText.fontSize = 12;
    labelText.characters = node.data?.label || 'Node';
    labelText.fills = [{ type: 'SOLID', color: { r: 0.1, g: 0.11, b: 0.14 } }];
    labelText.x = 48;
    labelText.y = 11;
    box.appendChild(labelText);

    // Subtitle
    if (node.data?.subtitle) {
      const sub = figma.createText();
      sub.fontName = regFont;
      sub.fontSize = 9;
      sub.characters = node.data.subtitle;
      sub.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.52, b: 0.58 } }];
      sub.x = 48;
      sub.y = 27;
      box.appendChild(sub);
    }

    // Description
    if (hasDesc && node.data?.description) {
      const desc = figma.createText();
      desc.fontName = regFont;
      desc.fontSize = 9;
      desc.characters = node.data.description.slice(0, 60);
      desc.fills = [{ type: 'SOLID', color: { r: 0.55, g: 0.57, b: 0.62 } }];
      desc.x = 12;
      desc.y = NODE_H - 2;
      desc.resize(156, 14);
      box.appendChild(desc);
    }

    // Tags
    if (hasTags) {
      const tagY = hasDesc ? NODE_H + 20 : NODE_H - 2;
      let cx = 12;
      for (const tagText of tags.slice(0, 2)) {
        const tagFrame = figma.createFrame();
        tagFrame.cornerRadius = 4;
        tagFrame.fills = [{ type: 'SOLID', color: accentColor, opacity: 0.12 }];
        tagFrame.y = tagY;

        const txt = figma.createText();
        txt.fontName = regFont;
        txt.fontSize = 8;
        txt.characters = tagText;
        txt.fills = [{ type: 'SOLID', color: accentColor }];
        txt.x = 5;
        txt.y = 3;
        tagFrame.appendChild(txt);

        const tw = Math.max(tagText.length * 5 + 10, 24);
        tagFrame.resize(tw, 14);
        tagFrame.x = cx;
        box.appendChild(tagFrame);
        cx += tw + 6;
      }
    }

    frame.appendChild(box);
    nodeMap[node.id] = box;
  }

  // ── Create connectors ─────────────────────────────────────────────────────
  for (const edge of payload.edges ?? []) {
    const src = nodeMap[edge.source];
    const tgt = nodeMap[edge.target];
    if (!src || !tgt) continue;

    const connector = figma.createConnector();
    const edgeColor = hexToRgb((edge.data?.color) || '#94a3b8');
    connector.strokeWeight = edge.data?.strokeWidth ?? 2;
    connector.strokes = [{ type: 'SOLID', color: edgeColor }];
    connector.connectorStart = { endpointNodeId: src.id, magnet: 'AUTO' };
    connector.connectorEnd   = { endpointNodeId: tgt.id, magnet: 'AUTO' };

    // Set connector line style matching React Flow edge style
    const style = edge.data?.style || 'smoothstep';
    if (style === 'straight') {
      connector.connectorLineType = 'STRAIGHT';
    } else if (style === 'bezier') {
      connector.connectorLineType = 'CURVED';
    } else {
      connector.connectorLineType = 'ELBOWED';
    }

    // Set stroke caps to show the arrow head at the end
    connector.connectorStartStrokeCap = 'NONE';
    connector.connectorEndStrokeCap = 'ARROW_EQUILATERAL';

    // Add edge label as text if present
    if (edge.label && typeof edge.label === 'string' && edge.label.trim()) {
      const lbl = figma.createText();
      lbl.fontName = regFont;
      lbl.fontSize = 9;
      lbl.characters = edge.label;
      lbl.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.52, b: 0.58 } }];
      // Position label at the midpoint between source and target
      lbl.x = (src.x + tgt.x) / 2 + PADDING / 2;
      lbl.y = (src.y + tgt.y) / 2 + PADDING / 2;
      frame.appendChild(lbl);
    }

    frame.appendChild(connector);
  }

  figma.currentPage.appendChild(frame);
  figma.viewport.scrollAndZoomIntoView([frame]);
}
