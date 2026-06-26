import { Hexagon, ChevronDown } from 'lucide-react';
import { useStore } from '../../store';

interface HeaderProps {
  onExportFigma?: () => void;
}

export default function Header({ onExportFigma }: HeaderProps) {
  const { isDarkMode, nodes, edges } = useStore();
  const dark = isDarkMode;

  const bg = dark ? 'bg-[#0f1016] border-white/8' : 'bg-white border-gray-200';
  const text = dark ? 'text-gray-100' : 'text-gray-900';
  const sub = dark ? 'text-gray-500' : 'text-gray-400';

  return (
    <div className={`flex items-center justify-between px-4 py-2 border-b ${bg} flex-shrink-0`}>
      {/* Logo */}
      <div className="flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center">
          <Hexagon size={14} strokeWidth={2.5} className="text-white" />
        </div>
        <div>
          <div className={`text-[13px] font-bold tracking-tight ${text}`}>Architect Builder</div>
          <div className={`text-[9px] uppercase tracking-widest ${sub}`}>by Loki</div>
        </div>
      </div>

      {/* Stats */}
      <div className={`flex items-center gap-4 text-[11px] ${sub}`}>
        <span>{nodes.length} nodes</span>
        <span>{edges.length} connections</span>
      </div>

      {/* Export to Figma */}
      <button
        onClick={onExportFigma}
        className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500 to-violet-600 text-white text-[12px] font-semibold rounded-lg hover:opacity-90 transition-opacity"
      >
        Export to Figma
        <ChevronDown size={12} />
      </button>
    </div>
  );
}
