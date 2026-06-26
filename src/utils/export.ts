import { ArchNode, ArchEdge } from '../types';

export function exportToJSON(nodes: ArchNode[], edges: ArchEdge[], name = 'architecture'): void {
  const data = { version: '1.0', name, nodes, edges, exportedAt: new Date().toISOString() };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${name}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

export function importFromJSON(file: File): Promise<{ nodes: ArchNode[]; edges: ArchEdge[] }> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        resolve({ nodes: data.nodes ?? [], edges: data.edges ?? [] });
      } catch {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.readAsText(file);
  });
}

export function exportToPNG(elementId = 'react-flow-canvas'): void {
  // Use html2canvas or similar; since we can't add deps, we use the browser API
  const el = document.querySelector('.react-flow__renderer') as HTMLElement;
  if (!el) return;

  // Trigger browser print as fallback
  window.print();
}

export function triggerFileInput(accept: string, cb: (file: File) => void): void {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = accept;
  input.onchange = (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (file) cb(file);
  };
  input.click();
}
