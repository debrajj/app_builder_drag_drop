import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { 
  ChevronLeft, 
  Save, 
  Eye, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Layers, 
  Box, 
  Type, 
  Navigation as NavIcon, 
  Filter, 
  Copy, 
  ArrowUp, 
  ArrowDown, 
  Smartphone,
  CheckCircle2,
  Circle,
  Settings,
  FileJson,
  Layout,
  Grid,
  Image as ImageIcon,
  Video,
  MessageSquare,
  Star,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';
import { MobilePreview } from './MobilePreview';
import { DraggableSectionList } from './DraggableSectionList';
import { SectionStyle, CollectionStyle, CollectionItemStyle, NavigationScreen, CollectionTypePreset } from '../types';

export function PageEditor({ pageId, onBack }: { pageId: string, onBack: () => void }) {
  const { currentPage, fetchPage, updatePage, addCollectionGroup, updateCollectionGroup, deleteCollectionGroup, reorderCollectionGroups, addCollection, updateCollection, deleteCollection, addCollectionItem, updateCollectionItem, deleteCollectionItem } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'group' | 'collection' | 'item' | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<'draft' | 'published'>('draft');
  const [pageName, setPageName] = useState('');
  const [pageSlug, setPageSlug] = useState('');
  const [pageLogo, setPageLogo] = useState('');

  useEffect(() => {
    if (currentPage) {
      setPageName(currentPage.name);
      setPageSlug(currentPage.slug);
      setPageLogo(currentPage.logo || '');
    }
  }, [currentPage?.id]);

  useEffect(() => {
    fetchPage(pageId);
  }, [pageId]);

  if (!currentPage) return <div className="flex-1 flex items-center justify-center">Loading...</div>;

  const handleAddGroup = () => {
    addCollectionGroup(pageId, 'New Section', SectionStyle.BANNER_SECTION);
    toast.success('Section added');
  };

  const handleAddCollection = (groupId: string) => {
    addCollection(groupId, 'New Block', CollectionStyle.BANNER_COLLECTION);
    toast.success('Block added');
  };

  const handleAddItem = (collectionId: string) => {
    // Find the collection to get its style
    const collection = currentPage.collectionGroups
      .flatMap(g => g.collections)
      .find(c => c.id === collectionId);
    
    if (collection) {
      // Map collection style to item style
      const getItemStyleFromCollectionStyle = (collectionStyle: string): string => {
        const styleMap: Record<string, string> = {
          'CIR_COLLECTION': 'CIR_COLLECTION_ITEM',
          'SLIDER_COLLECTION': 'SLIDER_COLLECTION_ITEM',
          'TAB_COLLECTION': 'TAB_COLLECTION_ITEM',
          'TI_COLLECTION': 'TI_COLLECTION_ITEM',
          'TI_COLLECTION_V2': 'TI_COLLECTION_ITEM_V2',
          'REC_COLLECTION': 'REC_COLLECTION_ITEM',
          'BANNER_COLLECTION': 'BANNER_COLLECTION_ITEM',
          'VIDEO_COLLECTION': 'VIDEO_COLLECTION_ITEM',
          'TAB_COLLECTION_NEW_ARRIVAL_NO_BACKGROUND': 'REC_COLLECTION_ITEM_NEW_ARRIVAL',
          'TAB_COLLECTION_NEW_ARRIVAL': 'REC_COLLECTION_ITEM_NEW_ARRIVAL',
          'STORE_COLLECTION': 'STORE_COLLECTION_ITEM',
          'FOOTER_COLLECTION': 'FOOTER_COLLECTION_ITEM',
          'VOC_COLLECTION': 'VOC_COLLECTION_ITEM',
          'GRID_COLLECTION': 'GRID_COLLECTION_ITEM',
          'RECENTLY_VIEWED_COLLECTION': 'RECENTLY_VIEWED_COLLECTION_ITEM',
          'LANDING_PAGE_BANNER_COLLECTION': 'LANDING_PAGE_BANNER_COLLECTION_ITEM',
          'IMAGE_WITH_TEXT_COLLECTION': 'IMAGE_WITH_TEXT_COLLECTION_ITEM',
          'CATEGORY_TABBING_COLLECTION': 'CATEGORY_TABBING_COLLECTION_ITEM',
          'CATEGORY_STYLE_COLLECTION': 'CATEGORY_STYLE_COLLECTION_ITEM',
          'IMAGE_WITH_TEXT_BREAKER_COLLECTION': 'IMAGE_WITH_TEXT_BREAKER_COLLECTION_ITEM',
          'BY_PRICE_COLLECTION': 'BY_PRICE_COLLECTION_ITEM',
          'SHOP_LOOK_COLLECTION': 'SHOP_LOOK_COLLECTION_ITEM',
          'BY_OCCASION_COLLECTION': 'BY_OCCASION_COLLECTION_ITEM',
          'TOP_PRODUCTS_LIST_COLLECTION': 'TOP_PRODUCTS_LIST_COLLECTION_ITEM',
          'COLLECTION_VIDEO_COLLECTION': 'COLLECTION_VIDEO_COLLECTION_ITEM',
          'CATEGORY_TAB_COLLECTION': 'CATEGORY_TAB_COLLECTION_ITEM',
          'PRODUCTS_WITH_TABS_COLLECTION': 'PRODUCTS_WITH_TABS_COLLECTION_ITEM',
          'PRODUCTS_WITHOUT_TABS_COLLECTION': 'PRODUCTS_WITHOUT_TABS_COLLECTION_ITEM',
          'CX_REVIEW_COLLECTION': 'CX_REVIEW_COLLECTION_ITEM',
        };
        
        return styleMap[collectionStyle] || 'BANNER_COLLECTION_ITEM';
      };
      
      const itemStyle = getItemStyleFromCollectionStyle(collection.style);
      addCollectionItem(collectionId, 'New Item', itemStyle);
    } else {
      addCollectionItem(collectionId, 'New Item', CollectionItemStyle.BANNER_COLLECTION_ITEM);
    }
    toast.success('Item added');
  };

  const handleSave = async () => {
    try {
      await updatePage(pageId, { name: currentPage.name, slug: currentPage.slug, status: currentPage.status });
      toast.success('Page saved successfully');
    } catch (e) {
      toast.error('Failed to save page');
    }
  };

  const handlePublish = async () => {
    try {
      await updatePage(pageId, { ...currentPage, status: 'published' });
      toast.success('Page published successfully');
    } catch (e) {
      toast.error('Failed to publish page');
    }
  };

  const getSelectedItem = () => {
    if (!selectedId || !selectedType) return null;
    if (selectedType === 'group') {
      return currentPage.collectionGroups.find(g => g.id === selectedId);
    }
    if (selectedType === 'collection') {
      for (const group of currentPage.collectionGroups) {
        const found = group.collections.find(c => c.id === selectedId);
        if (found) return found;
      }
    }
    if (selectedType === 'item') {
      for (const group of currentPage.collectionGroups) {
        for (const collection of group.collections) {
          const found = collection.items.find(i => i.id === selectedId);
          if (found) return found;
        }
      }
    }
    return null;
  };

  const selectedItem = getSelectedItem();

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden">
      {/* Header */}
      <header className="h-16 bg-white border-b border-[#E5E5E5] px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <ChevronLeft className="w-5 h-5" />
          </button>
          <div>
            <h2 className="font-bold text-lg">{currentPage.name}</h2>
            <p className="text-xs text-[#999]">Editing /{currentPage.slug}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="flex bg-gray-100 p-1 rounded-lg mr-4">
            <button 
              onClick={() => setPreviewMode('draft')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${previewMode === 'draft' ? 'bg-white shadow-sm text-blue-600' : 'text-[#666]'}`}
            >
              Draft
            </button>
            <button 
              onClick={() => setPreviewMode('published')}
              className={`px-3 py-1 text-xs font-medium rounded-md transition-colors ${previewMode === 'published' ? 'bg-white shadow-sm text-blue-600' : 'text-[#666]'}`}
            >
              Published
            </button>
          </div>
          
          <button onClick={() => setShowPreview(!showPreview)} className={`p-2 rounded-lg transition-colors ${showPreview ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-100 text-[#666]'}`}>
            <Eye className="w-5 h-5" />
          </button>
          <button onClick={handleSave} className="bg-white border border-[#E5E5E5] text-[#1A1A1A] px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors flex items-center gap-2">
            <Save className="w-4 h-4" />
            Save
          </button>
          <button onClick={handlePublish} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            Publish
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar: Tree */}
        <aside className="w-72 bg-white border-r border-[#E5E5E5] flex flex-col overflow-y-auto p-4 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-xs font-bold text-[#999] uppercase tracking-wider">Page Structure</h3>
            <button onClick={handleAddGroup} className="p-1 hover:bg-blue-50 text-blue-600 rounded transition-colors">
              <Plus className="w-4 h-4" />
            </button>
          </div>

          <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-xs text-blue-700 font-medium">
              <strong>Drag & Drop:</strong> Grab the grip icon to reorder sections
            </p>
          </div>

          <DraggableSectionList
            groups={currentPage.collectionGroups.sort((a, b) => a.order - b.order)}
            selectedId={selectedId}
            selectedType={selectedType}
            onSelectGroup={(id) => { setSelectedId(id); setSelectedType('group'); }}
            onSelectCollection={(id) => { setSelectedId(id); setSelectedType('collection'); }}
            onSelectItem={(id) => { setSelectedId(id); setSelectedType('item'); }}
            onAddCollection={handleAddCollection}
            onAddItem={handleAddItem}
            onReorder={(reorderedGroups) => {
              reorderCollectionGroups(reorderedGroups);
              toast.success('Sections reordered successfully');
            }}
          />
        </aside>

        {/* Center: Editor */}
        <div className="flex-1 bg-white overflow-y-auto p-8">
          {selectedItem ? (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-2xl font-bold">{selectedItem.name}</h3>
                  <p className="text-[#666] text-sm uppercase font-bold tracking-widest mt-1">{selectedType} Editor</p>
                </div>
                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => window.open('/COLLECTION_GUIDE.md', '_blank')}
                    className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors"
                    title="View Collection Guide"
                  >
                    <Settings className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this?')) {
                        if (selectedType === 'group') deleteCollectionGroup(selectedId!);
                        if (selectedType === 'collection') deleteCollection(selectedId!);
                        if (selectedType === 'item') deleteCollectionItem(selectedId!);
                        setSelectedId(null);
                        setSelectedType(null);
                      }
                    }}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#999] uppercase">Name</label>
                    <input 
                      type="text" 
                      value={selectedItem.name} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedType === 'group') updateCollectionGroup(selectedId!, { name: val });
                        if (selectedType === 'collection') updateCollection(selectedId!, { name: val });
                        if (selectedType === 'item') updateCollectionItem(selectedId!, { name: val });
                      }}
                      className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#999] uppercase">Style</label>
                    <select 
                      value={selectedItem.style} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedType === 'group') updateCollectionGroup(selectedId!, { style: val });
                        if (selectedType === 'collection') updateCollection(selectedId!, { style: val });
                        if (selectedType === 'item') updateCollectionItem(selectedId!, { style: val });
                      }}
                      className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      {selectedType === 'group' && Object.values(SectionStyle).map(s => <option key={s} value={s}>{s}</option>)}
                      
                      {selectedType === 'collection' && Object.values(CollectionStyle).map(s => <option key={s} value={s}>{s}</option>)}
                      
                      {selectedType === 'item' && Object.values(CollectionItemStyle).map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#999] uppercase">Status</label>
                    <select 
                      value={selectedItem.status || 'draft'} 
                      onChange={(e) => {
                        const val = e.target.value;
                        if (selectedType === 'group') updateCollectionGroup(selectedId!, { status: val });
                        if (selectedType === 'collection') updateCollection(selectedId!, { status: val });
                        if (selectedType === 'item') updateCollectionItem(selectedId!, { status: val });
                      }}
                      className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    >
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>
                </div>

                {/* Conditional Fields based on Type and Style */}
                {selectedType === 'group' && (
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#999] uppercase">Background Image</label>
                      <input 
                        type="text" 
                        value={(selectedItem as any).backgroundImage || ''} 
                        onChange={(e) => updateCollectionGroup(selectedId!, { backgroundImage: e.target.value })}
                        className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {selectedType === 'collection' && (
                  <div className="space-y-4">
                    <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                      <p className="text-xs text-blue-700">
                        💡 <strong>Auto-sync:</strong> When you change the Collection Style, all items inside will automatically update to match!
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#999] uppercase flex items-center gap-2">
                          Collection Type
                          <div className="group relative inline-block">
                            <button 
                              type="button"
                              className="w-4 h-4 bg-blue-100 text-blue-600 rounded-full text-xs flex items-center justify-center hover:bg-blue-200"
                              onClick={(e) => e.preventDefault()}
                            >?</button>
                            <div className="absolute left-0 top-6 w-64 bg-gray-900 text-white text-xs p-3 rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-50 pointer-events-none">
                              <div className="space-y-1">
                                <div><strong>SL:</strong> Slider Collection</div>
                                <div><strong>STORE:</strong> Store/Shop Collection</div>
                                <div><strong>FOOTER:</strong> Footer Navigation</div>
                                <div><strong>REC:</strong> Recommended Items</div>
                                <div><strong>VDO:</strong> Video Collection</div>
                                <div><strong>CIR:</strong> Circular Items</div>
                                <div><strong>TI:</strong> Tab Items</div>
                              </div>
                            </div>
                          </div>
                        </label>
                        <select 
                          value={(selectedItem as any).collectionType || ''} 
                          onChange={(e) => updateCollection(selectedId!, { collectionType: e.target.value })}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        >
                          <option value="">None</option>
                          {Object.values(CollectionTypePreset).map(p => <option key={p} value={p}>{p}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#999] uppercase">Link</label>
                        <input 
                          type="text" 
                          value={(selectedItem as any).link || ''} 
                          onChange={(e) => updateCollection(selectedId!, { link: e.target.value })}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="External link or deep link"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="flex items-center gap-4 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={(selectedItem as any).isScrollable} 
                            onChange={(e) => updateCollection(selectedId!, { isScrollable: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm">Scrollable</span>
                        </label>
                      </div>
                      <div className="flex items-center gap-4 pt-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input 
                            type="checkbox" 
                            checked={(selectedItem as any).horizontal} 
                            onChange={(e) => updateCollection(selectedId!, { horizontal: e.target.checked })}
                            className="w-4 h-4 text-blue-600 rounded"
                          />
                          <span className="text-sm">Horizontal</span>
                        </label>
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#999] uppercase">Columns</label>
                        <input 
                          type="number" 
                          min="1" 
                          max="4" 
                          value={(selectedItem as any).column || 1} 
                          onChange={(e) => updateCollection(selectedId!, { column: parseInt(e.target.value) })}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#999] uppercase">Collection Image</label>
                      <input 
                        type="text" 
                        value={(selectedItem as any).image || ''} 
                        onChange={(e) => updateCollection(selectedId!, { image: e.target.value })}
                        className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://..."
                      />
                    </div>
                  </div>
                )}

                {selectedType === 'item' && (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#999] uppercase">Text 1 (Title)</label>
                        <input 
                          type="text" 
                          value={(selectedItem as any).text1 || ''} 
                          onChange={(e) => updateCollectionItem(selectedId!, { text1: e.target.value })}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#999] uppercase">Text 2 (Subtitle)</label>
                        <input 
                          type="text" 
                          value={(selectedItem as any).text2 || ''} 
                          onChange={(e) => updateCollectionItem(selectedId!, { text2: e.target.value })}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#999] uppercase">Text 3 (Price/Extra)</label>
                        <input 
                          type="text" 
                          value={(selectedItem as any).text3 || ''} 
                          onChange={(e) => updateCollectionItem(selectedId!, { text3: e.target.value })}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="e.g. $99.99"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-xs font-bold text-[#999] uppercase">Link</label>
                        <input 
                          type="text" 
                          value={(selectedItem as any).link || ''} 
                          onChange={(e) => updateCollectionItem(selectedId!, { link: e.target.value })}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                          placeholder="External link"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-xs font-bold text-[#999] uppercase">Media URL (Image/Video)</label>
                      <input 
                        type="text" 
                        value={(selectedItem as any).media || ''} 
                        onChange={(e) => updateCollectionItem(selectedId!, { media: e.target.value })}
                        className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        placeholder="https://... (supports images and video URLs)"
                      />
                      {(selectedItem as any).media && (
                        <div className="text-xs text-gray-500 mt-1">
                          {((selectedItem as any).media.includes('youtube.com') || (selectedItem as any).media.includes('youtu.be') || (selectedItem as any).media.includes('vimeo.com') || (selectedItem as any).media.endsWith('.mp4') || (selectedItem as any).media.endsWith('.webm')) ? '📹 Video URL detected' : '🖼️ Image URL detected'}
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Navigation Editor */}
                {(selectedType === 'collection' || selectedType === 'item') && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-[#E5E5E5] space-y-4">
                    <div className="flex items-center gap-2 text-blue-600">
                      <NavIcon className="w-4 h-4" />
                      <h4 className="text-sm font-bold uppercase tracking-wider">Navigation</h4>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#999] uppercase">Screen Name</label>
                        <select 
                          value={(() => {
                            const nav = (selectedItem as any).navigation;
                            if (typeof nav === 'string') {
                              try {
                                return JSON.parse(nav)?.screenName || '';
                              } catch {
                                return '';
                              }
                            }
                            return nav?.screenName || '';
                          })()} 
                          onChange={(e) => {
                            const currentNav = (() => {
                              const nav = (selectedItem as any).navigation;
                              if (typeof nav === 'string') {
                                try {
                                  return JSON.parse(nav);
                                } catch {
                                  return {};
                                }
                              }
                              return nav || {};
                            })();
                            const newNav = { ...currentNav, screenName: e.target.value };
                            const navString = JSON.stringify(newNav);
                            if (selectedType === 'collection') updateCollection(selectedId!, { navigation: navString });
                            if (selectedType === 'item') updateCollectionItem(selectedId!, { navigation: navString });
                          }}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                          <option value="">None</option>
                          {Object.values(NavigationScreen).map(s => <option key={s} value={s}>{s}</option>)}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#999] uppercase">Search String / ID</label>
                        <input 
                          type="text" 
                          value={(() => {
                            const nav = (selectedItem as any).navigation;
                            if (typeof nav === 'string') {
                              try {
                                return JSON.parse(nav)?.searchString || '';
                              } catch {
                                return '';
                              }
                            }
                            return nav?.searchString || '';
                          })()} 
                          onChange={(e) => {
                            const currentNav = (() => {
                              const nav = (selectedItem as any).navigation;
                              if (typeof nav === 'string') {
                                try {
                                  return JSON.parse(nav);
                                } catch {
                                  return {};
                                }
                              }
                              return nav || {};
                            })();
                            const newNav = { ...currentNav, searchString: e.target.value };
                            const navString = JSON.stringify(newNav);
                            if (selectedType === 'collection') updateCollection(selectedId!, { navigation: navString });
                            if (selectedType === 'item') updateCollectionItem(selectedId!, { navigation: navString });
                          }}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                          placeholder="e.g. collection-handle or product-id"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Banner/Slider Settings */}
                {(selectedType === 'group' || selectedType === 'collection' || selectedType === 'item') && (
                  <div className="p-4 bg-gray-50 rounded-xl border border-[#E5E5E5] space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-blue-600">
                        <ImageIcon className="w-4 h-4" />
                        <h4 className="text-sm font-bold uppercase tracking-wider">Banner Settings</h4>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-[#999] uppercase">Banner Size (Aspect Ratio)</label>
                        <select 
                          value={(() => {
                            const data = selectedItem.additionalData;
                            if (typeof data === 'string') {
                              try {
                                return JSON.parse(data)?.aspectRatio || 'auto';
                              } catch {
                                return 'auto';
                              }
                            }
                            return data?.aspectRatio || 'auto';
                          })()} 
                          onChange={(e) => {
                            const currentData = (() => {
                              const data = selectedItem.additionalData;
                              if (typeof data === 'string') {
                                try {
                                  return JSON.parse(data);
                                } catch {
                                  return {};
                                }
                              }
                              return data || {};
                            })();
                            
                            const val = e.target.value;
                            let newData = { ...currentData };
                            if (val === 'auto') {
                              delete newData.aspectRatio;
                            } else {
                              newData.aspectRatio = val;
                              newData.autoAdopt = true; // Automatically add autoAdopt for explicit sizes
                            }
                            
                            const dataString = JSON.stringify(newData);
                            if (selectedType === 'group') updateCollectionGroup(selectedId!, { additionalData: dataString });
                            if (selectedType === 'collection') updateCollection(selectedId!, { additionalData: dataString });
                            if (selectedType === 'item') updateCollectionItem(selectedId!, { additionalData: dataString });
                          }}
                          className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                        >
                          <option value="auto">Auto (Default)</option>
                          <option value="portrait">Portrait (Tall - Mobile Optimized)</option>
                          <option value="landscape">Landscape (Wide)</option>
                          <option value="square">Square (1:1)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                )}

                {/* Additional Data JSON Editor */}
                <details className="space-y-2 bg-gray-50 border border-[#E5E5E5] rounded-xl overflow-hidden group">
                  <summary className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-100 transition-colors list-none">
                    <div className="flex items-center gap-2">
                      <FileJson className="w-4 h-4 text-[#999]" />
                      <span className="text-xs font-bold text-[#999] uppercase">Advanced: Raw JSON Data</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-[#999] group-open:rotate-90 transition-transform" />
                  </summary>
                  <div className="p-4 pt-0">
                    <textarea 
                      value={typeof selectedItem.additionalData === 'string' ? selectedItem.additionalData : JSON.stringify(selectedItem.additionalData || {}, null, 2)} 
                      onChange={(e) => {
                        try {
                          const val = e.target.value;
                          if (selectedType === 'group') updateCollectionGroup(selectedId!, { additionalData: val });
                          if (selectedType === 'collection') updateCollection(selectedId!, { additionalData: val });
                          if (selectedType === 'item') updateCollectionItem(selectedId!, { additionalData: val });
                        } catch (e) {}
                      }}
                      rows={6}
                      className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    />
                  </div>
                </details>
              </div>
            </div>
          ) : (
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
              <div>
                <h3 className="text-2xl font-bold">Page Settings</h3>
                <p className="text-[#666] text-sm uppercase font-bold tracking-widest mt-1">Configure global page properties</p>
              </div>

              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#999] uppercase">Page Name</label>
                  <input 
                    type="text" 
                    value={pageName} 
                    onChange={(e) => setPageName(e.target.value)}
                    onBlur={() => updatePage(pageId, { name: pageName })}
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#999] uppercase">Slug</label>
                  <input 
                    type="text" 
                    value={pageSlug} 
                    onChange={(e) => setPageSlug(e.target.value)}
                    onBlur={() => updatePage(pageId, { slug: pageSlug })}
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2 col-span-2">
                  <label className="text-xs font-bold text-[#999] uppercase">Site Logo URL</label>
                  <input 
                    type="text" 
                    value={pageLogo} 
                    onChange={(e) => setPageLogo(e.target.value)}
                    onBlur={() => updatePage(pageId, { logo: pageLogo })}
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="https://..."
                  />
                </div>
              </div>

              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-sm font-bold text-blue-800 mb-2">Quick Tips:</h4>
                <ul className="text-xs text-blue-700 space-y-1 text-left">
                  <li>• Set the Site Logo URL to brand your app</li>
                  <li>• Select a section on the left to edit its layout</li>
                  <li>• Use the Mobile Preview to see changes in real-time</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Mobile Preview */}
        {showPreview && (
          <aside className="w-[450px] bg-gray-100 border-l border-[#E5E5E5] flex flex-col items-center justify-center p-8 overflow-y-auto">
            <div className="sticky top-8">
              <MobilePreview 
                data={{ ...currentPage, name: pageName, slug: pageSlug, logo: pageLogo }} 
                mode={previewMode}
                selectedId={selectedId}
                selectedType={selectedType}
                onSelectItem={(id, type) => {
                  setSelectedId(id);
                  setSelectedType(type);
                }}
              />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
