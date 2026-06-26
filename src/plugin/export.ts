/// <reference types="@figma/plugin-typings" />
import { ArchNode, ArchEdge } from '../types';

export async function exportToFigma(payload: { nodes: ArchNode[]; edges: ArchEdge[] }): Promise<void> {
  const frame = figma.createFrame();
  frame.name = 'Architecture Diagram';
  frame.resize(1400, 900);
  frame.fills = [{ type: 'SOLID', color: { r: 0.08, g: 0.08, b: 0.1 } }];
  frame.cornerRadius = 16;

  const nodeMap: Record<string, FrameNode> = {};

  // Load fonts once before starting the loop for high performance
  await figma.loadFontAsync({ family: 'Inter', style: 'SemiBold' });
  await figma.loadFontAsync({ family: 'Inter', style: 'Regular' });

  for (const node of payload.nodes) {
    const borderRadius = node.data?.style?.borderRadius ?? 12;

    // Parse accent color
    const bgStr = node.data?.style?.background || '#6366f1';
    let hex = bgStr.replace('#', '');
    if (hex.length === 3) {
      hex = hex[0] + hex[0] + hex[1] + hex[1] + hex[2] + hex[2];
    }
    if (hex.length !== 6) {
      hex = '6366f1';
    }
    const r = (parseInt(hex.slice(0, 2), 16) || 0) / 255;
    const g = (parseInt(hex.slice(2, 4), 16) || 0) / 255;
    const b = (parseInt(hex.slice(4, 6), 16) || 0) / 255;

    // Parse border color
    const borderStr = node.data?.style?.border || '#2e303f';
    let borderHex = borderStr.replace('#', '');
    if (borderHex.length === 3) {
      borderHex = borderHex[0] + borderHex[0] + borderHex[1] + borderHex[1] + borderHex[2] + borderHex[2];
    }
    if (borderHex.length !== 6) {
      borderHex = '2e303f';
    }
    const br = (parseInt(borderHex.slice(0, 2), 16) || 0) / 255;
    const bg = (parseInt(borderHex.slice(2, 4), 16) || 0) / 255;
    const bb = (parseInt(borderHex.slice(4, 6), 16) || 0) / 255;

    // Calculate dynamic height based on content
    const hasDescription = !!node.data?.description;
    const hasTags = node.data?.metadata?.tags && Array.isArray(node.data.metadata.tags) && node.data.metadata.tags.length > 0;
    
    let boxHeight = 56;
    if (hasDescription) boxHeight += 22;
    if (hasTags) boxHeight += 18;

    // Create the main box frame
    const box = figma.createFrame();
    box.resize(180, boxHeight);
    box.x = node.position.x;
    box.y = node.position.y;
    box.cornerRadius = borderRadius;
    box.name = node.data?.label || 'Node';

    // Fills: Dark theme background matching React UI (#1a1b24)
    box.fills = [{ type: 'SOLID', color: { r: 26/255, g: 27/255, b: 36/255 } }];
    box.strokes = [{ type: 'SOLID', color: { r: br, g: bg, b: bb } }];
    box.strokeWeight = 1.5;

    // Add drop shadow if configured
    if (node.data?.style?.shadow) {
      box.effects = [{
        type: 'DROP_SHADOW',
        color: { r: 0, g: 0, b: 0, a: 0.25 },
        offset: { x: 0, y: 4 },
        radius: 12,
        visible: true,
        blendMode: 'NORMAL'
      }];
    }

    // Create the top accent bar
    const accentBar = figma.createRectangle();
    accentBar.resize(180, 4);
    accentBar.x = 0;
    accentBar.y = 0;
    accentBar.fills = [{ type: 'SOLID', color: { r, g, b } }];
    // Round top corners of the accent bar to match box
    accentBar.topLeftRadius = borderRadius;
    accentBar.topRightRadius = borderRadius;
    box.appendChild(accentBar);

    // Create the icon container
    const iconContainer = figma.createFrame();
    iconContainer.resize(32, 32);
    iconContainer.x = 12;
    iconContainer.y = 12;
    iconContainer.cornerRadius = 8;
    iconContainer.fills = [{ type: 'SOLID', color: { r, g, b }, opacity: 0.13 }];
    
    // Simple visual indicator inside the icon container
    const innerIcon = figma.createEllipse();
    innerIcon.resize(10, 10);
    innerIcon.x = 11;
    innerIcon.y = 11;
    innerIcon.fills = [{ type: 'SOLID', color: { r, g, b } }];
    iconContainer.appendChild(innerIcon);
    box.appendChild(iconContainer);

    // Create Title/Label
    const label = figma.createText();
    label.fontName = { family: 'Inter', style: 'SemiBold' };
    label.fontSize = 13;
    label.characters = node.data?.label || 'Node';
    label.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
    label.x = 52;
    label.y = 13;
    box.appendChild(label);

    // Create Subtitle (if present)
    if (node.data?.subtitle) {
      const sub = figma.createText();
      sub.fontName = { family: 'Inter', style: 'Regular' };
      sub.fontSize = 9.5;
      sub.characters = node.data.subtitle;
      sub.fills = [{ type: 'SOLID', color: { r: 0.6, g: 0.64, b: 0.7 } }];
      sub.x = 52;
      sub.y = 29;
      box.appendChild(sub);
    }

    // Create Description (if present)
    if (hasDescription && node.data?.description) {
      const desc = figma.createText();
      desc.fontName = { family: 'Inter', style: 'Regular' };
      desc.fontSize = 9;
      desc.characters = node.data.description;
      desc.fills = [{ type: 'SOLID', color: { r: 0.5, g: 0.53, b: 0.6 } }];
      desc.x = 12;
      desc.y = 50;
      desc.resize(156, 14);
      box.appendChild(desc);
    }

    // Create Tags (if present)
    if (hasTags && node.data?.metadata?.tags) {
      const tagY = hasDescription ? 70 : 50;
      let currentX = 12;
      // Limit to 2 tags
      const tagsList = node.data.metadata.tags.slice(0, 2);
      
      for (const tagText of tagsList) {
        const tagFrame = figma.createFrame();
        tagFrame.cornerRadius = 4;
        tagFrame.fills = [{ type: 'SOLID', color: { r, g, b }, opacity: 0.13 }];
        tagFrame.y = tagY;

        const txt = figma.createText();
        txt.fontName = { family: 'Inter', style: 'Regular' };
        txt.fontSize = 8;
        txt.characters = tagText;
        txt.fills = [{ type: 'SOLID', color: { r, g, b } }];
        txt.x = 5;
        txt.y = 3;

        tagFrame.appendChild(txt);
        
        // Set size dynamically based on characters
        const estimatedWidth = Math.max(tagText.length * 5 + 10, 20);
        tagFrame.resize(estimatedWidth, 14);
        tagFrame.x = currentX;

        box.appendChild(tagFrame);
        currentX += estimatedWidth + 6;
      }
    }

    frame.appendChild(box);
    nodeMap[node.id] = box;
  }

  // Create native Figma connectors for each connection
  if (payload.edges && Array.isArray(payload.edges)) {
    for (const edge of payload.edges) {
      const sourceNode = nodeMap[edge.source];
      const targetNode = nodeMap[edge.target];
      if (!sourceNode || !targetNode) continue;

      const connector = figma.createConnector();
      connector.strokeWeight = 2;
      connector.strokes = [{ type: 'SOLID', color: { r: 0.58, g: 0.64, b: 0.72 } }]; // #94a3b8

      connector.connectorStart = {
        endpointNodeId: sourceNode.id,
        magnet: 'AUTO',
      };
      connector.connectorEnd = {
        endpointNodeId: targetNode.id,
        magnet: 'AUTO',
      };

      frame.appendChild(connector);
    }
  }

  figma.currentPage.appendChild(frame);
  figma.viewport.scrollAndZoomIntoView([frame]);
}
