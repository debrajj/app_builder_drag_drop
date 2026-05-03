import React, { useEffect, useState, useRef } from 'react';
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
import { Layers, Plus, GripVertical, ChevronDown, ChevronRight, Box, Type, Video, Grid, Layout, MessageSquare, Circle, Smartphone } from 'lucide-react';
import { ImageIcon as StoreIcon } from 'lucide-react';
import { Image as ImageIcon } from 'lucide-react';

interface CollectionGroup {
  id: string;
  name: string;
  style: string;
  order: number;
  collections: Collection[];
}

interface Collection {
  id: string;
  name: string;
  style: string;
  items: CollectionItem[];
}

interface CollectionItem {
  id: string;
  name: string;
  style: string;
}

interface DraggableSectionListProps {
  groups: CollectionGroup[];
  selectedId: string | null;
  selectedType: 'group' | 'collection' | 'item' | null;
  onSelectGroup: (id: string) => void;
  onSelectCollection: (id: string) => void;
  onSelectItem: (id: string) => void;
  onAddCollection: (groupId: string) => void;
  onAddItem: (collectionId: string) => void;
  onReorder: (groups: CollectionGroup[]) => void;
}

function SortableSection({ 
  group, 
  isSelected, 
  selectedId,
  selectedType,
  onSelect, 
  onSelectCollection,
  onSelectItem,
  onAddCollection,
  onAddItem,
  getGroupIcon,
  getCollectionIcon
}: { 
  group: CollectionGroup;
  isSelected: boolean;
  selectedId: string | null;
  selectedType: 'group' | 'collection' | 'item' | null;
  onSelect: () => void;
  onSelectCollection: (id: string) => void;
  onSelectItem: (id: string) => void;
  onAddCollection: (e: React.MouseEvent) => void;
  onAddItem: (collectionId: string, e: React.MouseEvent) => void;
  getGroupIcon: (style: string) => string;
  getCollectionIcon: (style: string) => string;
}) {
  const [isExpanded, setIsExpanded] = useState(true);
  const elementRef = React.useRef<HTMLDivElement>(null);

  // Auto-expand if a child is selected
  React.useEffect(() => {
    if (selectedId) {
      const isChildSelected = 
        group.collections.some(c => 
          c.id === selectedId || c.items.some(i => i.id === selectedId)
        );
      
      if (isChildSelected || isSelected) {
        setIsExpanded(true);
        // Delay scroll to allow for expansion animation/rendering
        setTimeout(() => {
          elementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        }, 100);
      }
    }
  }, [selectedId, selectedType, group.id, isSelected]);
  
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
    <div ref={(node) => {
      setNodeRef(node);
      (elementRef as any).current = node;
    }} style={style} className="space-y-1">
      <div
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
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsExpanded(!isExpanded);
            }}
            className="p-1 hover:bg-gray-200 rounded"
          >
            {isExpanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </button>
          {getGroupIcon(group.style)}
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

      {/* Collections and Items */}
      {isExpanded && group.collections.length > 0 && (
        <div className="pl-8 space-y-1 border-l-2 border-gray-200 ml-4">
          {group.collections.map(collection => (
            <div key={collection.id} className="space-y-1">
              <div 
                onClick={() => onSelectCollection(collection.id)}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${
                  selectedId === collection.id && selectedType === 'collection' 
                    ? 'bg-blue-50 text-blue-600' 
                    : 'hover:bg-gray-50 text-[#666]'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  {getCollectionIcon(collection.style)}
                  <Box className="w-4 h-4 shrink-0" />
                  <span className="text-sm truncate">{collection.name}</span>
                </div>
                <button 
                  onClick={(e) => onAddItem(collection.id, e)} 
                  className="p-1 hover:bg-blue-100 rounded"
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
              
              {/* Items */}
              {collection.items.length > 0 && (
                <div className="pl-6 space-y-1 border-l border-gray-200 ml-4">
                  {collection.items.map(item => (
                    <div 
                      key={item.id}
                      onClick={() => onSelectItem(item.id)}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${
                        selectedId === item.id && selectedType === 'item'
                          ? 'bg-blue-50 text-blue-600' 
                          : 'hover:bg-gray-50 text-[#999]'
                      }`}
                    >
                      <Type className="w-3 h-3 shrink-0" />
                      <span className="text-xs truncate">{item.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function DraggableSectionList({
  groups,
  selectedId,
  selectedType,
  onSelectGroup,
  onSelectCollection,
  onSelectItem,
  onAddCollection,
  onAddItem,
  onReorder
}: DraggableSectionListProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const getGroupIcon = (style: string) => {
    if (style.includes('FOOTER')) return <Layers className="w-4 h-4 text-gray-600" />;
    if (style.includes('VIDEO')) return <Video className="w-4 h-4 text-gray-600" />;
    if (style.includes('BANNER')) return <ImageIcon className="w-4 h-4 text-gray-600" />;
    if (style.includes('GRID')) return <Grid className="w-4 h-4 text-gray-600" />;
    if (style.includes('STORE')) return <StoreIcon className="w-4 h-4 text-gray-600" />;
    if (style.includes('CATEGORY')) return <Layout className="w-4 h-4 text-gray-600" />;
    return <Layers className="w-4 h-4 text-gray-600" />;
  };

  const getCollectionIcon = (style: string) => {
    if (style.includes('FOOTER')) return <Layers className="w-4 h-4 text-gray-500" />;
    if (style.includes('VIDEO')) return <Video className="w-4 h-4 text-gray-500" />;
    if (style.includes('BANNER')) return <ImageIcon className="w-4 h-4 text-gray-500" />;
    if (style.includes('SLIDER')) return <Smartphone className="w-4 h-4 text-gray-500" />;
    if (style.includes('GRID')) return <Grid className="w-4 h-4 text-gray-500" />;
    if (style.includes('STORE')) return <StoreIcon className="w-4 h-4 text-gray-500" />;
    if (style.includes('CATEGORY')) return <Layout className="w-4 h-4 text-gray-500" />;
    if (style.includes('REVIEW') || style.includes('VOC')) return <MessageSquare className="w-4 h-4 text-gray-500" />;
    if (style.includes('CIR')) return <Circle className="w-4 h-4 text-gray-500" />;
    return <Box className="w-4 h-4 text-gray-500" />;
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
              isSelected={selectedId === group.id && selectedType === 'group'}
              selectedId={selectedId}
              selectedType={selectedType}
              onSelect={() => onSelectGroup(group.id)}
              onSelectCollection={onSelectCollection}
              onSelectItem={onSelectItem}
              onAddCollection={(e) => {
                e.stopPropagation();
                onAddCollection(group.id);
              }}
              onAddItem={(collectionId, e) => {
                e.stopPropagation();
                onAddItem(collectionId);
              }}
              getGroupIcon={getGroupIcon}
              getCollectionIcon={getCollectionIcon}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
