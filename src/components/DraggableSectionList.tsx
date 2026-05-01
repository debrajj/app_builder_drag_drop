import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Layers, Plus, GripVertical } from 'lucide-react';

interface CollectionGroup {
  id: string;
  name: string;
  style: string;
  order: number;
  collections: any[];
}

interface DraggableSectionListProps {
  groups: CollectionGroup[];
  selectedId: string | null;
  onSelectGroup: (id: string) => void;
  onAddCollection: (groupId: string) => void;
  onReorder: (groups: CollectionGroup[]) => void;
}

function SortableSection({ 
  group, 
  isSelected, 
  onSelect, 
  onAddCollection,
  getGroupIcon 
}: { 
  group: CollectionGroup;
  isSelected: boolean;
  onSelect: () => void;
  onAddCollection: (e: React.MouseEvent) => void;
  getGroupIcon: (style: string) => string;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: group.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
        isSelected ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-[#1A1A1A]'
      } ${isDragging ? 'shadow-lg z-50' : ''}`}
    >
      <div className="flex items-center gap-2 flex-1 truncate" onClick={onSelect}>
        <div
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 hover:bg-gray-200 rounded"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <span className="text-sm">{getGroupIcon(group.style)}</span>
        <Layers className="w-4 h-4 shrink-0" />
        <span className="text-sm font-medium truncate">{group.name}</span>
        <span className="text-xs text-gray-400">#{group.order}</span>
      </div>
      <button
        onClick={onAddCollection}
        className="p-1 hover:bg-blue-100 rounded"
      >
        <Plus className="w-3 h-3" />
      </button>
    </div>
  );
}

export function DraggableSectionList({
  groups,
  selectedId,
  onSelectGroup,
  onAddCollection,
  onReorder
}: DraggableSectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getGroupIcon = (style: string) => {
    if (style.includes('FOOTER')) return '📍';
    if (style.includes('VIDEO')) return '🎥';
    if (style.includes('BANNER')) return '🖼️';
    if (style.includes('GRID')) return '▦';
    if (style.includes('STORE')) return '🏪';
    if (style.includes('CATEGORY')) return '🏷️';
    return '📄';
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = groups.findIndex((g) => g.id === active.id);
      const newIndex = groups.findIndex((g) => g.id === over.id);

      const reorderedGroups = arrayMove(groups, oldIndex, newIndex).map((g, index) => ({
        ...g,
        order: index
      }));

      onReorder(reorderedGroups);
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={groups.map(g => g.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {groups.map((group) => (
            <SortableSection
              key={group.id}
              group={group}
              isSelected={selectedId === group.id}
              onSelect={() => onSelectGroup(group.id)}
              onAddCollection={(e) => {
                e.stopPropagation();
                onAddCollection(group.id);
              }}
              getGroupIcon={getGroupIcon}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
