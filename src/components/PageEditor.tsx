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
import { SectionStyle, CollectionStyle, CollectionItemStyle, NavigationScreen, CollectionTypePreset } from '../types';

export function PageEditor({ pageId, onBack }: { pageId: string, onBack: () => void }) {
  const { currentPage, fetchPage, updatePage, addCollectionGroup, updateCollectionGroup, deleteCollectionGroup, addCollection, updateCollection, deleteCollection, addCollectionItem, updateCollectionItem, deleteCollectionItem } = useStore();
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'group' | 'collection' | 'item' | null>(null);
  const [showPreview, setShowPreview] = useState(true);
  const [previewMode, setPreviewMode] = useState<'draft' | 'published'>('draft');

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

          <div className="space-y-2">
            {currentPage.collectionGroups.map(group => {
              // Get icon based on style
              const getGroupIcon = (style: string) => {
                if (style.includes('FOOTER')) return '📍';
                if (style.includes('VIDEO')) return '🎥';
                if (style.includes('BANNER')) return '🖼️';
                if (style.includes('GRID')) return '▦';
                if (style.includes('STORE')) return '🏪';
                if (style.includes('CATEGORY')) return '🏷️';
                return '📄';
              };
              
              return (
                <div key={group.id} className="space-y-1">
                  <div 
                    onClick={() => { setSelectedId(group.id); setSelectedType('group'); }}
                    className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedId === group.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-[#1A1A1A]'}`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className="text-sm">{getGroupIcon(group.style)}</span>
                      <Layers className="w-4 h-4 shrink-0" />
                      <span className="text-sm font-medium truncate">{group.name}</span>
                    </div>
                    <button onClick={(e) => { e.stopPropagation(); handleAddCollection(group.id); }} className="p-1 hover:bg-blue-100 rounded">
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  
                  <div className="pl-4 space-y-1 border-l border-[#E5E5E5] ml-4">
                    {group.collections.map(collection => {
                      // Get icon based on collection style
                      const getCollectionIcon = (style: string) => {
                        if (style.includes('FOOTER')) return '📍';
                        if (style.includes('VIDEO')) return '🎥';
                        if (style.includes('BANNER')) return '🖼️';
                        if (style.includes('SLIDER')) return '📱';
                        if (style.includes('GRID')) return '▦';
                        if (style.includes('STORE')) return '🏪';
                        if (style.includes('CATEGORY')) return '🏷️';
                        if (style.includes('REVIEW') || style.includes('VOC')) return '💬';
                        if (style.includes('CIR')) return '⭕';
                        return '📦';
                      };
                      
                      return (
                        <div key={collection.id} className="space-y-1">
                          <div 
                            onClick={() => { setSelectedId(collection.id); setSelectedType('collection'); }}
                            className={`flex items-center justify-between p-2 rounded-lg cursor-pointer transition-colors ${selectedId === collection.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-[#666]'}`}
                          >
                            <div className="flex items-center gap-2 truncate">
                              <span className="text-xs">{getCollectionIcon(collection.style)}</span>
                              <Box className="w-4 h-4 shrink-0" />
                              <span className="text-sm truncate">{collection.name}</span>
                            </div>
                            <button onClick={(e) => { e.stopPropagation(); handleAddItem(collection.id); }} className="p-1 hover:bg-blue-100 rounded">
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          
                          <div className="pl-4 space-y-1 border-l border-[#E5E5E5] ml-4">
                            {collection.items.map(item => (
                              <div 
                                key={item.id}
                                onClick={() => { setSelectedId(item.id); setSelectedType('item'); }}
                                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-colors ${selectedId === item.id ? 'bg-blue-50 text-blue-600' : 'hover:bg-gray-50 text-[#999]'}`}
                              >
                                <Type className="w-3 h-3 shrink-0" />
                                <span className="text-xs truncate">{item.name}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
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
                      {selectedType === 'group' && Object.entries({
                        'BANNER_SECTION': '🖼️ Banner Section - Full width banners',
                        'SLIDE_SECTION': '📱 Slide Section - Horizontal scrolling',
                        'TAB_SECTION': '📑 Tab Section - Tabbed content',
                        'TI_SECTION': '⭐ Tab Items Section - Icon tabs',
                        'TI_SECTION_V2': '⭐ Tab Items V2 - Enhanced icon tabs',
                        'REC_SECTION': '🛍️ Recommended Section - Product recommendations',
                        'VOC_SECTION': '💬 Reviews Section - Customer testimonials',
                        'VIDEO_SECTION': '🎥 Video Section - Video content',
                        'STORE_SECTION': '🏪 Store Section - Shop categories',
                        'FOOTER_SECTION': '📍 Footer Section - Bottom navigation',
                        'GRID_SECTION': '▦ Grid Section - Grid layout',
                        'RECENTLY_VIEWED_SECTION': '👁️ Recently Viewed - User history',
                        'LANDING_PAGE_BANNER_SECTION': '🎯 Landing Banner - Hero section',
                        'IMAGE_WITH_TEXT_SECTION': '🖼️📝 Image + Text - Content blocks',
                        'CATEGORY_TABBING_SECTION': '🏷️ Category Tabs - Category navigation',
                        'CATEGORY_STYLE_SECTION': '🏷️ Category Style - Category cards',
                        'IMAGE_WITH_TEXT_BREAKER_SECTION': '🖼️📝 Image + Text Breaker - Section divider',
                        'BY_PRICE_SECTION': '💰 By Price - Price range filters',
                        'SHOP_LOOK_SECTION': '👗 Shop Look - Complete outfits',
                        'BY_OCCASION_SECTION': '🎉 By Occasion - Event-based shopping',
                        'TOP_PRODUCTS_LIST_SECTION': '📋 Top Products - List view',
                        'COLLECTION_VIDEO_SECTION': '🎬 Collection Video - Video gallery',
                        'CATEGORY_TAB_SECTION': '🏷️ Category Tab - Tab navigation',
                        'PRODUCTS_WITH_TABS_SECTION': '🛍️📑 Products with Tabs - Filtered products',
                        'PRODUCTS_WITHOUT_TABS_SECTION': '🛍️ Products - Simple product list',
                        'CX_REVIEW_SECTION': '⭐💬 Customer Reviews - Detailed reviews',
                        'CIR_SECTION': '⭕ Circular Section - Round icons',
                      }).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                      
                      {selectedType === 'collection' && Object.entries({
                        'BANNER_COLLECTION': '🖼️ Banner - Full width image banners',
                        'SLIDER_COLLECTION': '📱 Slider - Horizontal scrolling cards',
                        'TAB_COLLECTION': '📑 Tab - Tabbed content',
                        'TI_COLLECTION': '⭐ Tab Items - Icon-based tabs',
                        'TI_COLLECTION_V2': '⭐ Tab Items V2 - Enhanced tabs',
                        'REC_COLLECTION': '🛍️ Recommended - Product cards with ratings',
                        'VIDEO_COLLECTION': '🎥 Video - Video player',
                        'STORE_COLLECTION': '🏪 Store - Category/store cards',
                        'FOOTER_COLLECTION': '📍 Footer - Bottom navigation items',
                        'VOC_COLLECTION': '💬 Reviews - Customer testimonials',
                        'GRID_COLLECTION': '▦ Grid - 2-column grid layout',
                        'RECENTLY_VIEWED_COLLECTION': '👁️ Recently Viewed - User history',
                        'LANDING_PAGE_BANNER_COLLECTION': '🎯 Landing Banner - Hero banners',
                        'IMAGE_WITH_TEXT_COLLECTION': '🖼️📝 Image + Text - Image with description',
                        'CATEGORY_TABBING_COLLECTION': '🏷️ Category Tabs - Category navigation',
                        'CATEGORY_STYLE_COLLECTION': '🏷️ Category Style - Category cards',
                        'IMAGE_WITH_TEXT_BREAKER_COLLECTION': '🖼️📝 Image + Text Breaker - Content divider',
                        'BY_PRICE_COLLECTION': '💰 By Price - Price range cards',
                        'SHOP_LOOK_COLLECTION': '👗 Shop Look - Complete outfit cards',
                        'BY_OCCASION_COLLECTION': '🎉 By Occasion - Event shopping',
                        'TOP_PRODUCTS_LIST_COLLECTION': '📋 Top Products - Horizontal list',
                        'COLLECTION_VIDEO_COLLECTION': '🎬 Collection Video - Video items',
                        'CATEGORY_TAB_COLLECTION': '🏷️ Category Tab - Tab navigation',
                        'PRODUCTS_WITH_TABS_COLLECTION': '🛍️📑 Products with Tabs - Filtered view',
                        'PRODUCTS_WITHOUT_TABS_COLLECTION': '🛍️ Products - Simple list',
                        'CX_REVIEW_COLLECTION': '⭐💬 Customer Reviews - Review cards',
                        'CIR_COLLECTION': '⭕ Circular - Round icon items',
                        'TAB_COLLECTION_NEW_ARRIVAL_NO_BACKGROUND': '📑 Tab New Arrival (No BG)',
                        'TAB_COLLECTION_NEW_ARRIVAL': '📑 Tab New Arrival',
                      }).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
                      
                      {selectedType === 'item' && Object.entries({
                        'BANNER_COLLECTION_ITEM': '🖼️ Banner Item - Full width banner',
                        'SLIDER_COLLECTION_ITEM': '📱 Slider Item - Product card',
                        'REC_COLLECTION_ITEM': '🛍️ Product Card - With price & rating',
                        'CIR_COLLECTION_ITEM': '⭕ Circular Item - Round icon',
                        'TI_COLLECTION_ITEM': '⭐ Tab Item - Icon tab',
                        'TI_COLLECTION_ITEM_V2': '⭐ Tab Item V2 - Enhanced tab',
                        'VIDEO_COLLECTION_ITEM': '🎥 Video Item - Video player',
                        'STORE_COLLECTION_ITEM': '🏪 Store Item - Category card',
                        'FOOTER_COLLECTION_ITEM': '📍 Footer Item - Nav button',
                        'VOC_COLLECTION_ITEM': '💬 Review Item - Testimonial card',
                        'GRID_COLLECTION_ITEM': '▦ Grid Item - Grid card',
                        'TAB_COLLECTION_ITEM': '📑 Tab - Tab button',
                        'RECENTLY_VIEWED_COLLECTION_ITEM': '👁️ Recently Viewed - History item',
                        'LANDING_PAGE_BANNER_COLLECTION_ITEM': '🎯 Landing Banner - Hero item',
                        'IMAGE_WITH_TEXT_COLLECTION_ITEM': '🖼️📝 Image + Text - Content card',
                        'CATEGORY_TABBING_COLLECTION_ITEM': '🏷️ Category Tab - Category item',
                        'CATEGORY_STYLE_COLLECTION_ITEM': '🏷️ Category - Category card',
                        'IMAGE_WITH_TEXT_BREAKER_COLLECTION_ITEM': '🖼️📝 Image + Text Breaker',
                        'BY_PRICE_COLLECTION_ITEM': '💰 By Price - Price card',
                        'SHOP_LOOK_COLLECTION_ITEM': '👗 Shop Look - Outfit card',
                        'BY_OCCASION_COLLECTION_ITEM': '🎉 By Occasion - Event card',
                        'TOP_PRODUCTS_LIST_COLLECTION_ITEM': '📋 Top Product - List item',
                        'COLLECTION_VIDEO_COLLECTION_ITEM': '🎬 Video - Video item',
                        'CATEGORY_TAB_COLLECTION_ITEM': '🏷️ Category Tab Item',
                        'PRODUCTS_WITH_TABS_COLLECTION_ITEM': '🛍️📑 Product with Tabs',
                        'PRODUCTS_WITHOUT_TABS_COLLECTION_ITEM': '🛍️ Product Item',
                        'CX_REVIEW_COLLECTION_ITEM': '⭐💬 Customer Review',
                        'REC_COLLECTION_ITEM_NEW_ARRIVAL': '🛍️ New Arrival Product',
                      }).map(([key, label]) => <option key={key} value={key}>{label}</option>)}
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

                {/* Additional Data JSON Editor */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-[#999] uppercase">Additional Data (JSON)</label>
                    <FileJson className="w-4 h-4 text-[#999]" />
                  </div>
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
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50"
                  />
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center">
              <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mb-6">
                <Layout className="w-10 h-10 text-[#CCC]" />
              </div>
              <h3 className="text-xl font-bold text-[#1A1A1A]">Select an element to edit</h3>
              <p className="text-[#666] max-w-xs mt-2">Choose a section, block, or item from the left sidebar to start configuring its properties.</p>
              
              <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200 max-w-md">
                <h4 className="text-sm font-bold text-blue-800 mb-2">Quick Tips:</h4>
                <ul className="text-xs text-blue-700 space-y-1 text-left">
                  <li>• Use FOOTER_SECTION + FOOTER_COLLECTION for footer navigation</li>
                  <li>• Set Collection Type to STORE for shop categories</li>
                  <li>• Video URLs are automatically detected in Media fields</li>
                  <li>• Navigation requires Screen Name + Search String</li>
                </ul>
              </div>
            </div>
          )}
        </div>

        {/* Right Sidebar: Mobile Preview */}
        {showPreview && (
          <aside className="w-[450px] bg-gray-100 border-l border-[#E5E5E5] flex flex-col items-center justify-center p-8 overflow-y-auto">
            <div className="sticky top-8">
              <MobilePreview data={currentPage} mode={previewMode} />
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
