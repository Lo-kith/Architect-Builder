import { useState, useMemo } from 'react';
import {
  Search, Star, Clock, Layout, Package, ChevronDown, ChevronRight,
  Heart, X
} from 'lucide-react';
import * as Icons from 'lucide-react';
import { useStore } from '../../store';
import { COMPONENTS, CATEGORY_LABELS, CATEGORY_COLORS } from '../../nodes';
import { TEMPLATES } from '../../templates';
import { ComponentDefinition, NodeCategory } from '../../types';

type IconName = keyof typeof Icons;
const DynamicIcon = ({ name, size = 14 }: { name: string; size?: number }) => {
  const IC = Icons[name as IconName] as React.ComponentType<{ size: number; strokeWidth: number }> | undefined;
  return IC ? <IC size={size} strokeWidth={2} /> : <Icons.Box size={size} strokeWidth={2} />;
};

const TABS = [
  { id: 'components', icon: Package, label: 'Components' },
  { id: 'templates', icon: Layout, label: 'Templates' },
  { id: 'recent', icon: Clock, label: 'Recent' },
  { id: 'favorites', icon: Star, label: 'Favorites' },
] as const;

export default function Sidebar() {
  const { isDarkMode, sidebarTab, setSidebarTab, searchQuery, setSearchQuery, favorites, toggleFavorite, recentComponents, addRecentComponent } = useStore();
  const addNode = useStore((s) => s.addNode);
  const loadTemplate = useStore((s) => s.loadTemplate);
  const [collapsedCategories, setCollapsedCategories] = useState<Set<string>>(new Set());

  const dark = isDarkMode;

  const toggleCategory = (cat: string) =>
    setCollapsedCategories((prev) => {
      const next = new Set(prev);
      next.has(cat) ? next.delete(cat) : next.add(cat);
      return next;
    });

  const filteredComponents = useMemo(() => {
    const q = searchQuery.toLowerCase();
    return q ? COMPONENTS.filter((c) => c.name.toLowerCase().includes(q) || c.category.toLowerCase().includes(q)) : COMPONENTS;
  }, [searchQuery]);

  const grouped = useMemo(() => {
    const g: Record<string, ComponentDefinition[]> = {};
    filteredComponents.forEach((c) => {
      if (!g[c.category]) g[c.category] = [];
      g[c.category].push(c);
    });
    return g;
  }, [filteredComponents]);

  const handleDragStart = (e: React.DragEvent, comp: ComponentDefinition) => {
    e.dataTransfer.setData('componentId', comp.id);
    e.dataTransfer.effectAllowed = 'copy';
    addRecentComponent(comp.id);
  };

  const handleAddNode = (comp: ComponentDefinition) => {
    addRecentComponent(comp.id);
    const id = `node-${Date.now()}`;
    addNode({
      id,
      type: 'archNode',
      position: { x: 250 + Math.random() * 200, y: 150 + Math.random() * 200 },
      data: {
        label: comp.name,
        subtitle: CATEGORY_LABELS[comp.category],
        description: comp.description,
        category: comp.category as NodeCategory,
        componentType: comp.id,
        icon: comp.icon,
        style: comp.defaultStyle,
        metadata: comp.defaultMetadata ?? {},
      },
    });
  };

  const bg = dark ? 'bg-[#13141a]' : 'bg-white';
  const border = dark ? 'border-white/8' : 'border-gray-200';
  const text = dark ? 'text-gray-100' : 'text-gray-900';
  const subtext = dark ? 'text-gray-400' : 'text-gray-500';
  const inputBg = dark ? 'bg-white/5 border-white/10 text-gray-200 placeholder-gray-500' : 'bg-gray-100 border-gray-200 text-gray-700 placeholder-gray-400';

  const ComponentCard = ({ comp }: { comp: ComponentDefinition }) => {
    const isFav = favorites.includes(comp.id);
    return (
      <div
        draggable
        onDragStart={(e) => handleDragStart(e, comp)}
        onClick={() => handleAddNode(comp)}
        className={`
          group flex items-center gap-2.5 px-3 py-2 rounded-lg cursor-grab active:cursor-grabbing
          transition-all duration-150 hover:scale-[1.01]
          ${dark ? 'hover:bg-white/6' : 'hover:bg-gray-50'}
        `}
      >
        <div
          className="w-7 h-7 rounded-lg flex-shrink-0 flex items-center justify-center"
          style={{ background: comp.defaultStyle.background + '22', color: comp.defaultStyle.background }}
        >
          <DynamicIcon name={comp.icon} size={13} />
        </div>
        <div className="min-w-0 flex-1">
          <div className={`text-[12px] font-medium leading-tight truncate ${text}`}>{comp.name}</div>
          <div className={`text-[10px] truncate ${subtext}`}>{comp.description}</div>
        </div>
        <button
          onClick={(e) => { e.stopPropagation(); toggleFavorite(comp.id); }}
          className={`opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0 ${isFav ? 'opacity-100 text-yellow-400' : subtext}`}
        >
          <Star size={11} fill={isFav ? 'currentColor' : 'none'} />
        </button>
      </div>
    );
  };

  return (
    <div className={`w-64 flex-shrink-0 flex flex-col h-full border-r ${border} ${bg} overflow-hidden`}>
      {/* Header */}
      <div className={`px-3 pt-3 pb-2 border-b ${border}`}>
        <div className="relative">
          <Search size={13} className={`absolute left-2.5 top-1/2 -translate-y-1/2 ${subtext}`} />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search components..."
            className={`w-full pl-7 pr-7 py-1.5 text-[12px] rounded-lg border outline-none ${inputBg}`}
          />
          {searchQuery && (
            <button onClick={() => setSearchQuery('')} className={`absolute right-2 top-1/2 -translate-y-1/2 ${subtext} hover:text-gray-300`}>
              <X size={12} />
            </button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className={`flex border-b ${border} px-2 pt-1`}>
        {TABS.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            onClick={() => setSidebarTab(id)}
            className={`
              flex items-center gap-1 px-2 py-1.5 text-[11px] font-medium rounded-t-md transition-colors
              ${sidebarTab === id
                ? dark ? 'text-blue-400 border-b-2 border-blue-400' : 'text-blue-600 border-b-2 border-blue-600'
                : subtext + ' hover:text-gray-300'}
            `}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto scrollbar-thin py-1">
        {/* Components Tab */}
        {sidebarTab === 'components' && (
          <div>
            {Object.entries(grouped).map(([cat, comps]) => (
              <div key={cat}>
                <button
                  onClick={() => toggleCategory(cat)}
                  className={`w-full flex items-center justify-between px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wider transition-colors ${subtext} hover:text-gray-300`}
                >
                  <div className="flex items-center gap-1.5">
                    <div className="w-2 h-2 rounded-full" style={{ background: CATEGORY_COLORS[cat] }} />
                    {CATEGORY_LABELS[cat] || cat}
                    <span className="opacity-50">({comps.length})</span>
                  </div>
                  {collapsedCategories.has(cat)
                    ? <ChevronRight size={11} />
                    : <ChevronDown size={11} />}
                </button>
                {!collapsedCategories.has(cat) && (
                  <div className="pb-1">
                    {comps.map((comp) => <ComponentCard key={comp.id} comp={comp} />)}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Templates Tab */}
        {sidebarTab === 'templates' && (
          <div className="p-2 space-y-2">
            {TEMPLATES.filter((t) =>
              searchQuery ? t.name.toLowerCase().includes(searchQuery.toLowerCase()) : true
            ).map((template) => (
              <button
                key={template.id}
                onClick={() => loadTemplate(template.nodes as any, template.edges as any)}
                className={`
                  w-full text-left p-3 rounded-xl border transition-all duration-150
                  ${dark
                    ? 'border-white/8 hover:border-white/20 hover:bg-white/4'
                    : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                `}
              >
                <div className={`text-[12px] font-semibold ${text}`}>{template.name}</div>
                <div className={`text-[10px] mt-0.5 ${subtext}`}>{template.description}</div>
                <div className="flex gap-1 mt-1.5 flex-wrap">
                  {template.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className={`text-[9px] px-1.5 py-0.5 rounded-full ${dark ? 'bg-white/8 text-gray-400' : 'bg-gray-100 text-gray-500'}`}>
                      {tag}
                    </span>
                  ))}
                </div>
              </button>
            ))}
          </div>
        )}

        {/* Recent Tab */}
        {sidebarTab === 'recent' && (
          <div className="py-1">
            {recentComponents.length === 0 ? (
              <div className={`text-center py-8 text-[11px] ${subtext}`}>
                <Clock size={20} className="mx-auto mb-2 opacity-40" />
                No recent components
              </div>
            ) : (
              recentComponents.map((id) => {
                const comp = COMPONENTS.find((c) => c.id === id);
                return comp ? <ComponentCard key={id} comp={comp} /> : null;
              })
            )}
          </div>
        )}

        {/* Favorites Tab */}
        {sidebarTab === 'favorites' && (
          <div className="py-1">
            {favorites.length === 0 ? (
              <div className={`text-center py-8 text-[11px] ${subtext}`}>
                <Heart size={20} className="mx-auto mb-2 opacity-40" />
                No favorites yet
              </div>
            ) : (
              favorites.map((id) => {
                const comp = COMPONENTS.find((c) => c.id === id);
                return comp ? <ComponentCard key={id} comp={comp} /> : null;
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
