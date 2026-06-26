/// <reference types="@figma/plugin-typings" />
import { ArchNode, ArchEdge } from '../types';
import { exportToFigma } from './export';

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
          nodes: ArchNode[];
          edges: ArchEdge[];
        };
        await exportToFigma(payload);
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
