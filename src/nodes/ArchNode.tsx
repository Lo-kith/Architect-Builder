import { memo, useState } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import * as Icons from 'lucide-react';
import { ArchNodeData } from '../types';
import { useStore } from '../store/diagramStore';

type IconName = keyof typeof Icons;

const DynamicIcon = ({ name, size = 16 }: { name: string; size?: number }) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const IconComp = (Icons as any)[name];
  if (!IconComp) return <Icons.Box size={size} strokeWidth={2} />;
  return <IconComp size={size} strokeWidth={2} />;
};

const ArchNodeComponent = ({ id, data }: NodeProps<ArchNodeData>) => {
  const [isHovered, setIsHovered] = useState(false);
  const selectNode = useStore((s) => s.selectNode);
  const selectedNodeId = useStore((s) => s.selectedNodeId);
  const isDarkMode = useStore((s) => s.isDarkMode);
  const selected = selectedNodeId === id;

  const handleClick = () => selectNode(id);

  const borderColor = selected
    ? '#2952ff'
    : isHovered
    ? data.style.border
    : 'transparent';

  const shadowClass = data.style.shadow
    ? selected
      ? 'shadow-[0_0_0_2px_#2952ff,0_8px_24px_rgba(0,0,0,0.35)]'
      : isHovered
      ? 'shadow-[0_8px_32px_rgba(0,0,0,0.3)]'
      : 'shadow-[0_4px_16px_rgba(0,0,0,0.2)]'
    : '';

  return (
    <div
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative min-w-[160px] max-w-[220px] cursor-pointer select-none transition-all duration-200 ease-out ${shadowClass}`}
      style={{
        borderRadius: data.style.borderRadius,
        border: `2px solid ${borderColor}`,
        background: isDarkMode ? 'rgba(26,27,36,0.97)' : 'rgba(255,255,255,0.97)',
      }}
    >
      {/* Color accent bar */}
      <div
        className="h-1 w-full"
        style={{
          background: data.style.background,
          borderRadius: `${data.style.borderRadius}px ${data.style.borderRadius}px 0 0`,
        }}
      />

      {/* Content */}
      <div className="px-3 py-2.5">
        <div className="flex items-center gap-2 mb-1">
          <div
            className="flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: data.style.background + '22', color: data.style.background }}
          >
            <DynamicIcon name={data.icon} size={16} />
          </div>
          <div className="min-w-0">
            <div className={`text-[13px] font-semibold leading-tight truncate ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {data.label}
            </div>
            {data.subtitle && (
              <div className={`text-[10px] leading-tight truncate mt-0.5 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                {data.subtitle}
              </div>
            )}
          </div>
        </div>

        {data.description && (
          <div className={`text-[10px] mt-1.5 leading-relaxed line-clamp-2 ${isDarkMode ? 'text-gray-500' : 'text-gray-400'}`}>
            {data.description}
          </div>
        )}

        {data.metadata?.tags && (data.metadata.tags as string[]).length > 0 && (
          <div className="flex flex-wrap gap-1 mt-1.5">
            {(data.metadata.tags as string[]).slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-[9px] px-1.5 py-0.5 rounded-full"
                style={{ background: data.style.background + '22', color: data.style.background }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Handles */}
      <Handle type="target" position={Position.Top}
        className="!w-2.5 !h-2.5 !border-2 !border-white/80 !-top-[6px] opacity-0 hover:opacity-100 transition-opacity"
        style={{ background: data.style.background }} />
      <Handle type="source" position={Position.Bottom}
        className="!w-2.5 !h-2.5 !border-2 !border-white/80 !-bottom-[6px] opacity-0 hover:opacity-100 transition-opacity"
        style={{ background: data.style.background }} />
      <Handle type="source" position={Position.Right} id="right"
        className="!w-2.5 !h-2.5 !border-2 !border-white/80 !-right-[6px] opacity-0 hover:opacity-100 transition-opacity"
        style={{ background: data.style.background }} />
      <Handle type="target" position={Position.Left} id="left"
        className="!w-2.5 !h-2.5 !border-2 !border-white/80 !-left-[6px] opacity-0 hover:opacity-100 transition-opacity"
        style={{ background: data.style.background }} />
    </div>
  );
};

export default memo(ArchNodeComponent);
