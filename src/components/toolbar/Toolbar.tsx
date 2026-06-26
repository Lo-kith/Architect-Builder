import { useCallback } from 'react';
import {
  Save, Download, Upload, ZoomIn, ZoomOut, Maximize2, Trash2,
  Moon, Sun, RotateCcw, RotateCw, LayoutGrid, AlignHorizontalJustifyCenter,
  AlignVerticalJustifyCenter, TreePine, Share2,
} from 'lucide-react';
import { useStore } from '../../store';
import { useReactFlow } from 'reactflow';
import { AutoLayoutDirection } from '../../types';

interface ToolbarProps {
  onExportPNG?: () => void;
  onExportJSON?: () => void;
  onImportJSON?: () => void;
}

interface BtnProps {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
  danger?: boolean;
  active?: boolean;
}

export default function Toolbar({ onExportPNG, onExportJSON, onImportJSON }: ToolbarProps) {
  const { isDarkMode, toggleDarkMode, undo, redo, clearCanvas, autoLayout, historyIndex, history } = useStore();
  const { fitView, zoomIn, zoomOut } = useReactFlow();

  const dark = isDarkMode;
  const bg = dark ? 'bg-[#1a1b24] border-white/8' : 'bg-white border-gray-200';
  const btn = dark
    ? 'text-gray-400 hover:text-gray-100 hover:bg-white/8'
    : 'text-gray-500 hover:text-gray-800 hover:bg-gray-100';
  const dividerCls = dark ? 'bg-white/8' : 'bg-gray-200';

  const canUndo = historyIndex > 0;
  const canRedo = historyIndex < history.length - 1;

  const Btn = ({ icon, label, onClick, disabled = false, danger = false, active = false }: BtnProps) => (
    <button
      title={label}
      onClick={onClick}
      disabled={disabled}
      className={`
        flex items-center justify-center w-7 h-7 rounded-lg transition-all duration-150
        ${disabled ? 'opacity-30 cursor-not-allowed' : danger ? 'text-red-400 hover:bg-red-400/10' : active ? (dark ? 'text-blue-400 bg-blue-400/10' : 'text-blue-600 bg-blue-100') : btn}
      `}
    >
      {icon}
    </button>
  );

  const Div = () => <div className={`w-px h-5 mx-0.5 ${dividerCls}`} />;

  return (
    <div className={`flex items-center gap-0.5 px-3 py-2 border-b ${bg} flex-wrap`}>
      <Btn icon={<Save size={15} strokeWidth={2} />} label="Save (Ctrl+S)" onClick={() => onExportJSON?.()} />
      <Btn icon={<Download size={15} strokeWidth={2} />} label="Export JSON" onClick={() => onExportJSON?.()} />
      <Btn icon={<Share2 size={15} strokeWidth={2} />} label="Export PNG" onClick={() => onExportPNG?.()} />
      <Btn icon={<Upload size={15} strokeWidth={2} />} label="Import JSON" onClick={() => onImportJSON?.()} />
      <Div />
      <Btn icon={<RotateCcw size={15} strokeWidth={2} />} label="Undo (Ctrl+Z)" onClick={undo} disabled={!canUndo} />
      <Btn icon={<RotateCw size={15} strokeWidth={2} />} label="Redo (Ctrl+Y)" onClick={redo} disabled={!canRedo} />
      <Div />
      <Btn icon={<ZoomIn size={15} strokeWidth={2} />} label="Zoom In" onClick={() => zoomIn()} />
      <Btn icon={<ZoomOut size={15} strokeWidth={2} />} label="Zoom Out" onClick={() => zoomOut()} />
      <Btn icon={<Maximize2 size={15} strokeWidth={2} />} label="Fit View" onClick={() => fitView({ padding: 0.1 })} />
      <Div />
      <Btn icon={<AlignVerticalJustifyCenter size={15} strokeWidth={2} />} label="Vertical Layout" onClick={() => autoLayout('vertical')} />
      <Btn icon={<AlignHorizontalJustifyCenter size={15} strokeWidth={2} />} label="Horizontal Layout" onClick={() => autoLayout('horizontal')} />
      <Btn icon={<LayoutGrid size={15} strokeWidth={2} />} label="Grid Layout" onClick={() => autoLayout('grid')} />
      <Btn icon={<TreePine size={15} strokeWidth={2} />} label="Tree Layout" onClick={() => autoLayout('tree')} />
      <Div />
      <Btn icon={<Trash2 size={15} strokeWidth={2} />} label="Clear Canvas" onClick={clearCanvas} danger />
      <div className="ml-auto">
        <Btn
          icon={dark ? <Sun size={15} strokeWidth={2} /> : <Moon size={15} strokeWidth={2} />}
          label="Toggle Dark Mode"
          onClick={toggleDarkMode}
        />
      </div>
    </div>
  );
}
