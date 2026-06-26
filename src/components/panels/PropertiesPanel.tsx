import { useState } from 'react';
import { X, Tag, FileText, Settings2, Palette } from 'lucide-react';
import { useStore } from '../../store/diagramStore';
import { CATEGORY_LABELS } from '../../nodes/componentDefs';

const PRESET_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#ef4444', '#f97316',
  '#f59e0b', '#22c55e', '#10b981', '#06b6d4', '#3b82f6',
  '#374151', '#1e293b', '#0f172a', '#636363', '#ffffff',
];

export default function PropertiesPanel() {
  const { isDarkMode, selectedNodeId, nodes, updateNode, deleteNode, selectedEdgeId, edges, updateEdge, deleteEdge } =
    useStore();
  const [activeTab, setActiveTab] = useState<'props' | 'style' | 'meta'>('props');

  const dark = isDarkMode;
  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedEdge = edges.find((e) => e.id === selectedEdgeId);

  if (!selectedNode && !selectedEdge) return null;

  const bg = dark ? 'bg-[#13141a]' : 'bg-white';
  const border = dark ? 'border-white/8' : 'border-gray-200';
  const text = dark ? 'text-gray-100' : 'text-gray-900';
  const subtext = dark ? 'text-gray-400' : 'text-gray-500';
  const inputCls = `w-full px-2.5 py-1.5 text-[12px] rounded-lg border outline-none transition-colors ${
    dark
      ? 'bg-white/5 border-white/10 text-gray-200 placeholder-gray-600 focus:border-blue-500/50'
      : 'bg-gray-50 border-gray-200 text-gray-800 placeholder-gray-400 focus:border-blue-400'
  }`;

  const Label = ({ children }: { children: React.ReactNode }) => (
    <label className={`block text-[10px] font-semibold uppercase tracking-wider mb-1 ${subtext}`}>
      {children}
    </label>
  );

  const Field = ({ children }: { children: React.ReactNode }) => (
    <div className="mb-3">{children}</div>
  );

  // ── Node Panel ────────────────────────────────────────────────────────────
  if (selectedNode) {
    const d = selectedNode.data;

    const update = (partial: Partial<typeof d>) => updateNode(selectedNode.id, partial);
    const updateStyle = (partial: Partial<typeof d.style>) =>
      update({ style: { ...d.style, ...partial } });
    const updateMeta = (partial: Partial<typeof d.metadata>) =>
      update({ metadata: { ...d.metadata, ...partial } });

    return (
      <div className={`w-64 flex-shrink-0 flex flex-col h-full border-l ${border} ${bg} overflow-hidden animate-fade-in`}>
        {/* Header */}
        <div className={`flex items-center justify-between px-3 py-2.5 border-b ${border}`}>
          <div>
            <div className={`text-[12px] font-semibold ${text}`}>Properties</div>
            <div className={`text-[10px] ${subtext}`}>{CATEGORY_LABELS[d.category] || d.category}</div>
          </div>
          <button onClick={() => useStore.getState().selectNode(null)} className={`${subtext} hover:text-gray-300 transition-colors`}>
            <X size={14} />
          </button>
        </div>

        {/* Tabs */}
        <div className={`flex border-b ${border} px-2 pt-1`}>
          {([['props', 'Props', Settings2], ['style', 'Style', Palette], ['meta', 'Meta', FileText]] as const).map(
            ([id, label, Icon]) => (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`
                  flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-t transition-colors
                  ${activeTab === id
                    ? dark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'
                    : subtext}
                `}
              >
                <Icon size={11} />
                {label}
              </button>
            )
          )}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-3">
          {/* Props */}
          {activeTab === 'props' && (
            <div>
              <Field>
                <Label>Title</Label>
                <input className={inputCls} value={d.label} onChange={(e) => update({ label: e.target.value })} placeholder="Component name" />
              </Field>
              <Field>
                <Label>Subtitle</Label>
                <input className={inputCls} value={d.subtitle || ''} onChange={(e) => update({ subtitle: e.target.value })} placeholder="e.g. REST API" />
              </Field>
              <Field>
                <Label>Description</Label>
                <textarea
                  className={inputCls + ' resize-none'}
                  rows={3}
                  value={d.description || ''}
                  onChange={(e) => update({ description: e.target.value })}
                  placeholder="Describe this component..."
                />
              </Field>
              <Field>
                <Label>Notes</Label>
                <textarea
                  className={inputCls + ' resize-none'}
                  rows={3}
                  value={(d.metadata?.notes as string) || ''}
                  onChange={(e) => updateMeta({ notes: e.target.value })}
                  placeholder="Internal notes..."
                />
              </Field>
              <Field>
                <Label>Tags (comma separated)</Label>
                <input
                  className={inputCls}
                  value={(d.metadata?.tags as string[] | undefined)?.join(', ') || ''}
                  onChange={(e) =>
                    updateMeta({ tags: e.target.value.split(',').map((t) => t.trim()).filter(Boolean) })
                  }
                  placeholder="api, auth, external"
                />
              </Field>
            </div>
          )}

          {/* Style */}
          {activeTab === 'style' && (
            <div>
              <Field>
                <Label>Accent Color</Label>
                <div className="flex flex-wrap gap-1.5 mt-1">
                  {PRESET_COLORS.map((c) => (
                    <button
                      key={c}
                      onClick={() => updateStyle({ background: c, border: c })}
                      className={`w-6 h-6 rounded-full border-2 transition-all ${d.style.background === c ? 'border-white scale-110' : 'border-transparent'}`}
                      style={{ background: c }}
                    />
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <input
                    type="color"
                    value={d.style.background}
                    onChange={(e) => updateStyle({ background: e.target.value, border: e.target.value })}
                    className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent"
                  />
                  <input
                    className={inputCls}
                    value={d.style.background}
                    onChange={(e) => updateStyle({ background: e.target.value })}
                    placeholder="#000000"
                  />
                </div>
              </Field>
              <Field>
                <Label>Border Radius: {d.style.borderRadius}px</Label>
                <input
                  type="range"
                  min={0}
                  max={24}
                  value={d.style.borderRadius}
                  onChange={(e) => updateStyle({ borderRadius: Number(e.target.value) })}
                  className="w-full accent-blue-500"
                />
              </Field>
              <Field>
                <Label>Shadow</Label>
                <button
                  onClick={() => updateStyle({ shadow: !d.style.shadow })}
                  className={`
                    relative w-9 h-5 rounded-full transition-colors
                    ${d.style.shadow ? 'bg-blue-500' : dark ? 'bg-white/15' : 'bg-gray-300'}
                  `}
                >
                  <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${d.style.shadow ? 'translate-x-4' : 'translate-x-0.5'}`} />
                </button>
              </Field>
            </div>
          )}

          {/* Meta */}
          {activeTab === 'meta' && (
            <div>
              <Field>
                <Label>Version</Label>
                <input className={inputCls} value={(d.metadata?.version as string) || ''} onChange={(e) => updateMeta({ version: e.target.value })} placeholder="v1.0.0" />
              </Field>
              <Field>
                <Label>Port</Label>
                <input className={inputCls} type="number" value={(d.metadata?.port as number) || ''} onChange={(e) => updateMeta({ port: Number(e.target.value) })} placeholder="3000" />
              </Field>
              <Field>
                <Label>Protocol</Label>
                <input className={inputCls} value={(d.metadata?.protocol as string) || ''} onChange={(e) => updateMeta({ protocol: e.target.value })} placeholder="HTTP, gRPC, WS..." />
              </Field>
              <Field>
                <Label>Region / Zone</Label>
                <input className={inputCls} value={(d.metadata?.region as string) || ''} onChange={(e) => updateMeta({ region: e.target.value })} placeholder="us-east-1" />
              </Field>
              <Field>
                <Label>URL / Endpoint</Label>
                <input className={inputCls} value={(d.metadata?.url as string) || ''} onChange={(e) => updateMeta({ url: e.target.value })} placeholder="https://api.example.com" />
              </Field>

              <div className={`text-[10px] ${subtext} mt-2`}>
                <span>Component ID: </span>
                <code className="font-mono opacity-70">{selectedNode.id}</code>
              </div>
            </div>
          )}
        </div>

        {/* Delete */}
        <div className={`p-3 border-t ${border}`}>
          <button
            onClick={() => deleteNode(selectedNode.id)}
            className="w-full py-1.5 text-[12px] font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
          >
            Delete Node
          </button>
        </div>
      </div>
    );
  }

  // ── Edge Panel ─────────────────────────────────────────────────────────────
  if (selectedEdge) {
    const d = selectedEdge.data ?? { color: '#94a3b8', style: 'smoothstep', animated: false, strokeWidth: 2 };

    const update = (partial: Partial<typeof d>) =>
      updateEdge(selectedEdge.id, partial);

    return (
      <div className={`w-64 flex-shrink-0 flex flex-col h-full border-l ${border} ${bg} overflow-hidden animate-fade-in`}>
        <div className={`flex items-center justify-between px-3 py-2.5 border-b ${border}`}>
          <div className={`text-[12px] font-semibold ${text}`}>Connection</div>
          <button onClick={() => useStore.getState().selectEdge(null)} className={`${subtext} hover:text-gray-300`}>
            <X size={14} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-3">
          <Field>
            <Label>Label</Label>
            <input className={inputCls} value={selectedEdge.label as string || ''} onChange={(e) => updateEdge(selectedEdge.id, { label: e.target.value } as any)} placeholder="e.g. HTTP/JSON" />
          </Field>
          <Field>
            <Label>Style</Label>
            <select
              className={inputCls}
              value={d.style}
              onChange={(e) => update({ style: e.target.value as any })}
            >
              <option value="straight">Straight</option>
              <option value="bezier">Bezier</option>
              <option value="smoothstep">Smooth</option>
              <option value="step">Step</option>
            </select>
          </Field>
          <Field>
            <Label>Color</Label>
            <div className="flex items-center gap-2">
              <input type="color" value={d.color} onChange={(e) => update({ color: e.target.value })} className="w-8 h-8 rounded cursor-pointer border-0 bg-transparent" />
              <input className={inputCls} value={d.color} onChange={(e) => update({ color: e.target.value })} />
            </div>
          </Field>
          <Field>
            <Label>Stroke Width: {d.strokeWidth}px</Label>
            <input type="range" min={1} max={6} value={d.strokeWidth} onChange={(e) => update({ strokeWidth: Number(e.target.value) })} className="w-full accent-blue-500" />
          </Field>
          <Field>
            <Label>Animated</Label>
            <button
              onClick={() => update({ animated: !d.animated })}
              className={`relative w-9 h-5 rounded-full transition-colors ${d.animated ? 'bg-blue-500' : dark ? 'bg-white/15' : 'bg-gray-300'}`}
            >
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${d.animated ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
          </Field>
        </div>

        <div className={`p-3 border-t ${border}`}>
          <button
            onClick={() => deleteEdge(selectedEdge.id)}
            className="w-full py-1.5 text-[12px] font-medium text-red-400 border border-red-400/30 rounded-lg hover:bg-red-400/10 transition-colors"
          >
            Delete Connection
          </button>
        </div>
      </div>
    );
  }

  return null;
}
