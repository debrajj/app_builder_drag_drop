import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Page, SectionStyle, CollectionStyle, CollectionItemStyle } from '../types';
import { Smartphone, ChevronRight, Star, ShoppingCart, Search, Menu, Heart, Video } from 'lucide-react';

export function MobilePreview({ data, mode, onSelectItem }: { data: Page, mode: 'draft' | 'published', onSelectItem?: (id: string, type: 'group' | 'collection' | 'item') => void }) {
  const { globalStyles } = useStore();
  const [bannerSlides, setBannerSlides] = useState<Map<string, number>>(new Map());
  const [selectedStore, setSelectedStore] = useState<any>(null);

  const getVideoEmbedUrl = (url: string) => {
    // Convert YouTube URLs to embed format
    if (url.includes('youtube.com/watch')) {
      const videoId = url.split('v=')[1]?.split('&')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    if (url.includes('youtu.be/')) {
      const videoId = url.split('youtu.be/')[1]?.split('?')[0];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : url;
    }
    // Convert Vimeo URLs to embed format
    if (url.includes('vimeo.com/')) {
      const videoId = url.split('vimeo.com/')[1]?.split('?')[0];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : url;
    }
    return url;
  };

  const renderItem = (item: any) => {
    // Handle video URLs
    const isVideo = item.media && (item.media.includes('youtube.com') || item.media.includes('youtu.be') || item.media.includes('vimeo.com') || item.media.endsWith('.mp4') || item.media.endsWith('.webm'));
    const isDirectVideo = item.media && (item.media.endsWith('.mp4') || item.media.endsWith('.webm'));
    const isEmbedVideo = isVideo && !isDirectVideo;
    
    const handleClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelectItem) {
        onSelectItem(item.id, 'item');
      }
    };
    
    switch (item.style) {
      case CollectionItemStyle.CIR_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="flex flex-col items-center gap-1 shrink-0 w-16 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-14 h-14 rounded-full bg-gray-200 overflow-hidden border border-gray-100">
              {item.media && !isVideo && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
              {isVideo && (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                  <Video className="w-6 h-6 text-white" />
                </div>
              )}
            </div>
            <span className="text-[10px] text-center truncate w-full font-medium">{item.name}</span>
          </div>
        );
      case CollectionItemStyle.BANNER_COLLECTION_ITEM:
      case CollectionItemStyle.VIDEO_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-full aspect-[16/9] bg-gray-200 rounded-xl overflow-hidden shrink-0 relative cursor-pointer hover:opacity-90 transition-opacity">
            {item.media && !isVideo && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
            {isDirectVideo && (
              <video 
                src={item.media} 
                controls 
                className="w-full h-full object-cover"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            )}
            {isEmbedVideo && (
              <iframe
                src={getVideoEmbedUrl(item.media)}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {!isVideo && (
              <div className="absolute bottom-4 left-4 text-white">
                <h4 className="text-sm font-bold drop-shadow-md">{item.text1}</h4>
                <p className="text-[10px] drop-shadow-md">{item.text2}</p>
              </div>
            )}
          </div>
        );
      case CollectionItemStyle.REC_COLLECTION_ITEM:
      case CollectionItemStyle.SLIDER_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-40 aspect-[3/4] bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="h-2/3 bg-gray-100 relative">
              {item.media && !isVideo && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
              {isDirectVideo && (
                <video 
                  src={item.media} 
                  controls 
                  className="w-full h-full object-cover"
                  playsInline
                >
                  Your browser does not support the video tag.
                </video>
              )}
              {isEmbedVideo && (
                <div className="w-full h-full bg-gray-800 flex items-center justify-center relative">
                  <Video className="w-6 h-6 text-white" />
                  <span className="absolute bottom-1 right-1 text-xs text-white bg-black/50 px-1 py-0.5 rounded text-[8px]">VIDEO</span>
                </div>
              )}
              {!isVideo && (
                <button className="absolute top-2 right-2 p-1.5 bg-white/80 backdrop-blur-sm rounded-full">
                  <Heart className="w-3 h-3 text-gray-600" />
                </button>
              )}
            </div>
            <div className="p-2 space-y-1">
              <h4 className="text-xs font-bold truncate">{item.text1 || item.name}</h4>
              <p className="text-[10px] text-gray-500 truncate">{item.text2}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-blue-600">{item.text3 || '$99'}</span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                  <span className="text-[8px] font-bold">4.5</span>
                </div>
              </div>
            </div>
          </div>
        );
      case CollectionItemStyle.TI_COLLECTION_ITEM:
      case CollectionItemStyle.TI_COLLECTION_ITEM_V2:
        return (
          <div key={item.id} onClick={handleClick} className="flex flex-col items-center gap-1 shrink-0 px-4 py-2 bg-white rounded-lg border border-gray-50 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-8 h-8 rounded-full bg-blue-50 flex items-center justify-center text-blue-600">
              {item.media && !isVideo ? <img src={item.media} alt={item.name} className="w-5 h-5 object-contain" /> : <Star className="w-4 h-4" />}
            </div>
            <span className="text-[9px] font-bold text-center uppercase tracking-tighter">{item.name}</span>
          </div>
        );
      case CollectionItemStyle.STORE_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-32 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
              {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-2 text-center">
              <h4 className="text-xs font-bold truncate">{item.text1 || item.name}</h4>
            </div>
          </div>
        );
      case CollectionItemStyle.GRID_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-[calc(50%-8px)] bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
              {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-2">
              <h4 className="text-xs font-bold truncate">{item.text1 || item.name}</h4>
              <p className="text-[10px] text-gray-500 truncate">{item.text2}</p>
            </div>
          </div>
        );
      case CollectionItemStyle.VOC_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-64 bg-white rounded-xl p-4 shrink-0 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-2 mb-2">
              {item.media && <img src={item.media} alt={item.name} className="w-8 h-8 rounded-full object-cover" />}
              <div>
                <h4 className="text-xs font-bold">{item.name}</h4>
                <div className="flex items-center gap-0.5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-2 h-2 text-yellow-400 fill-yellow-400" />)}
                </div>
              </div>
            </div>
            <p className="text-[10px] text-gray-600 line-clamp-3">{item.text1}</p>
          </div>
        );
      case CollectionItemStyle.TAB_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="px-4 py-2 bg-white rounded-lg border border-gray-200 shrink-0 cursor-pointer hover:bg-gray-50 transition-colors">
            <span className="text-xs font-bold">{item.name}</span>
          </div>
        );
      case CollectionItemStyle.LANDING_PAGE_BANNER_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-full aspect-[2/1] bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl overflow-hidden shrink-0 relative cursor-pointer hover:opacity-90 transition-opacity">
            {item.media && (
              <>
                <img src={item.media} alt={item.name} className="w-full h-full object-cover absolute inset-0" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
              </>
            )}
            <div className="absolute inset-0 flex flex-col justify-end p-4">
              <h4 className="text-base font-bold text-white mb-1">{item.text1 || item.name}</h4>
              <p className="text-xs text-white/90 mb-2">{item.text2}</p>
              {item.button && (
                <button className="bg-white text-gray-900 px-4 py-1.5 rounded-lg text-xs font-bold w-fit">
                  {item.button}
                </button>
              )}
            </div>
          </div>
        );
      case CollectionItemStyle.IMAGE_WITH_TEXT_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-full bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex gap-3 p-3 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1 flex flex-col justify-center">
              <h4 className="text-xs font-bold mb-1 line-clamp-2">{item.text1 || item.name}</h4>
              <p className="text-[10px] text-gray-600 line-clamp-2">{item.text2}</p>
              {item.text3 && <span className="text-xs font-bold text-blue-600 mt-1">{item.text3}</span>}
            </div>
          </div>
        );
      case CollectionItemStyle.IMAGE_WITH_TEXT_BREAKER_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-full bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl overflow-hidden border border-gray-200 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 p-4">
              <div className="w-20 h-20 bg-white rounded-lg overflow-hidden shrink-0 shadow-sm">
                {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
              </div>
              <div className="flex-1">
                <h4 className="text-sm font-bold mb-1 text-gray-900">{item.text1 || item.name}</h4>
                <p className="text-[10px] text-gray-700 line-clamp-2">{item.text2}</p>
              </div>
            </div>
          </div>
        );
      case CollectionItemStyle.CATEGORY_TABBING_COLLECTION_ITEM:
      case CollectionItemStyle.CATEGORY_STYLE_COLLECTION_ITEM:
      case CollectionItemStyle.CATEGORY_TAB_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="flex flex-col items-center gap-2 shrink-0 w-20 cursor-pointer hover:opacity-80 transition-opacity">
            <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 overflow-hidden border-2 border-white shadow-md">
              {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <span className="text-[10px] font-bold text-center truncate w-full">{item.name}</span>
          </div>
        );
      case CollectionItemStyle.BY_PRICE_COLLECTION_ITEM:
      case CollectionItemStyle.BY_OCCASION_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-40 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100 relative">
              {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-3">
                <h4 className="text-xs font-bold text-white">{item.text1 || item.name}</h4>
              </div>
            </div>
          </div>
        );
      case CollectionItemStyle.SHOP_LOOK_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-48 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-[3/4] bg-gray-100 relative">
              {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
              <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-full">
                <span className="text-[8px] font-bold text-blue-600">COMPLETE LOOK</span>
              </div>
            </div>
            <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50">
              <h4 className="text-xs font-bold mb-1">{item.text1 || item.name}</h4>
              <button className="text-[10px] text-blue-600 font-bold flex items-center gap-1">
                Shop This Look <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          </div>
        );
      case CollectionItemStyle.TOP_PRODUCTS_LIST_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-full bg-white rounded-lg p-3 border border-gray-100 flex gap-3 cursor-pointer hover:shadow-md transition-shadow">
            <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden shrink-0">
              {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="flex-1">
              <h4 className="text-xs font-bold truncate">{item.text1 || item.name}</h4>
              <p className="text-[10px] text-gray-500 truncate">{item.text2}</p>
              <div className="flex items-center justify-between mt-1">
                <span className="text-xs font-bold text-blue-600">{item.text3}</span>
                <div className="flex items-center gap-0.5">
                  <Star className="w-2 h-2 text-yellow-400 fill-yellow-400" />
                  <span className="text-[8px] font-bold">4.5</span>
                </div>
              </div>
            </div>
          </div>
        );
      case CollectionItemStyle.PRODUCTS_WITH_TABS_COLLECTION_ITEM:
      case CollectionItemStyle.PRODUCTS_WITHOUT_TABS_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-36 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100">
              {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-2">
              <h4 className="text-[10px] font-bold truncate">{item.text1 || item.name}</h4>
              <span className="text-xs font-bold text-blue-600">{item.text3}</span>
            </div>
          </div>
        );
      case CollectionItemStyle.CX_REVIEW_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-72 bg-white rounded-xl p-4 shrink-0 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="flex items-start gap-3">
              {item.media && <img src={item.media} alt={item.name} className="w-12 h-12 rounded-full object-cover" />}
              <div className="flex-1">
                <h4 className="text-xs font-bold">{item.name}</h4>
                <div className="flex items-center gap-0.5 my-1">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-2 h-2 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-[10px] text-gray-600 line-clamp-2">{item.text1}</p>
              </div>
            </div>
          </div>
        );
      case CollectionItemStyle.RECENTLY_VIEWED_COLLECTION_ITEM:
      case CollectionItemStyle.REC_COLLECTION_ITEM_NEW_ARRIVAL:
        return (
          <div key={item.id} onClick={handleClick} className="w-36 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow">
            <div className="aspect-square bg-gray-100">
              {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
            </div>
            <div className="p-2">
              <h4 className="text-[10px] font-bold truncate">{item.text1 || item.name}</h4>
              <p className="text-[9px] text-gray-500 truncate">{item.text2}</p>
              <span className="text-xs font-bold text-blue-600">{item.text3}</span>
            </div>
          </div>
        );
      case CollectionItemStyle.FOOTER_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="flex flex-col items-center gap-1 cursor-pointer hover:opacity-80 transition-opacity">
            {item.media ? (
              <img src={item.media} alt={item.name} className="w-5 h-5 object-contain" />
            ) : (
              <Star className="w-5 h-5" />
            )}
            <span className="text-[8px] font-bold truncate max-w-[60px]">{item.name}</span>
          </div>
        );
      case CollectionItemStyle.COLLECTION_VIDEO_COLLECTION_ITEM:
        return (
          <div key={item.id} onClick={handleClick} className="w-full aspect-video bg-gray-200 rounded-xl overflow-hidden shrink-0 relative cursor-pointer hover:opacity-90 transition-opacity">
            {isDirectVideo && (
              <video 
                src={item.media} 
                controls 
                className="w-full h-full object-cover"
                playsInline
              >
                Your browser does not support the video tag.
              </video>
            )}
            {isEmbedVideo && (
              <iframe
                src={getVideoEmbedUrl(item.media)}
                className="w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )}
            {!item.media && (
              <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                <Video className="w-12 h-12 text-white" />
              </div>
            )}
          </div>
        );
      default:
        return (
          <div key={item.id} onClick={handleClick} className="p-2 bg-gray-50 rounded border border-gray-100 text-[10px] cursor-pointer hover:bg-gray-100 transition-colors">
            {item.name}
          </div>
        );
    }
  };

  const renderCollection = (collection: any) => {
    const items = collection.items || [];
    const isBannerCollection = collection.style === 'BANNER_COLLECTION' && items.length > 1;
    const currentSlide = bannerSlides.get(collection.id) || 0;
    
    const handleCollectionClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelectItem) {
        onSelectItem(collection.id, 'collection');
      }
    };
    
    return (
      <div key={collection.id} className="space-y-3">
        {collection.name && (
          <div onClick={handleCollectionClick} className="flex items-center justify-between px-4 cursor-pointer hover:bg-gray-50 rounded-lg py-1 transition-colors">
            <h3 className="text-base font-bold text-gray-900">{collection.name}</h3>
            {collection.link && <button className="text-[10px] font-bold text-blue-600 flex items-center gap-0.5">View All <ChevronRight className="w-3 h-3" /></button>}
          </div>
        )}
        
        {isBannerCollection ? (
          <div className="relative px-4">
            <div className="overflow-hidden rounded-xl">
              <div 
                className="flex transition-transform duration-500 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {items.map((item: any) => (
                  <div key={item.id} className="w-full flex-shrink-0">
                    {renderItem(item)}
                  </div>
                ))}
              </div>
            </div>
            {/* Slide Indicators */}
            <div className="flex justify-center gap-1.5 mt-3">
              {items.map((_: any, index: number) => (
                <button
                  key={index}
                  onClick={() => {
                    setBannerSlides(prev => {
                      const newMap = new Map(prev);
                      newMap.set(collection.id, index);
                      return newMap;
                    });
                  }}
                  className={`h-1.5 rounded-full transition-all ${
                    index === currentSlide 
                      ? 'w-6 bg-blue-600' 
                      : 'w-1.5 bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        ) : (
          <div className={`flex gap-3 px-4 ${collection.horizontal ? 'overflow-x-auto no-scrollbar pb-2' : 'flex-wrap'}`}>
            {items.map(renderItem)}
          </div>
        )}
      </div>
    );
  };

  // Auto-slide effect for banner collections - moved to top level
  useEffect(() => {
    const intervals: NodeJS.Timeout[] = [];
    
    data.collectionGroups.forEach(group => {
      group.collections.forEach((collection: any) => {
        const items = collection.items || [];
        const isBannerCollection = collection.style === 'BANNER_COLLECTION' && items.length > 1;
        
        if (isBannerCollection) {
          const interval = setInterval(() => {
            setBannerSlides(prev => {
              const newMap = new Map(prev);
              const current = Number(newMap.get(collection.id) || 0);
              const next = (current + 1) % items.length;
              newMap.set(collection.id, next);
              return newMap;
            });
          }, 3000);
          intervals.push(interval);
        }
      });
    });

    return () => {
      intervals.forEach(interval => clearInterval(interval));
    };
  }, [data.collectionGroups]);

  const renderGroup = (group: any) => {
    if (mode === 'published' && group.status !== 'published') return null;
    
    // Render STORE_SECTION with special banner and layout
    if (group.style === SectionStyle.STORE_SECTION) {
      const storeCollection = group.collections[0];
      if (!storeCollection || (mode === 'published' && storeCollection.status !== 'published')) {
        return null;
      }

      const items = storeCollection.items || [];
      
      // Default view - just show store cards
      return (
        <section key={group.id} className="py-6 space-y-4">
          {/* Store Collection Title */}
          {storeCollection.name && (
            <div className="px-4">
              <h3 className="text-base font-bold text-gray-900">{storeCollection.name}</h3>
            </div>
          )}

          {/* Store Cards - Clickable */}
          <div className="flex gap-3 px-4 overflow-x-auto no-scrollbar pb-2">
            {items.map((item: any) => (
              <div 
                key={item.id} 
                onClick={(e) => {
                  e.stopPropagation();
                  setSelectedStore(item);
                }}
                className="w-32 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-100 shadow-sm cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="aspect-square bg-gray-100 relative">
                  {item.media && <img src={item.media} alt={item.name} className="w-full h-full object-cover" />}
                </div>
                <div className="p-2 text-center">
                  <h4 className="text-xs font-bold truncate">{item.text1 || item.name}</h4>
                  {item.text2 && <p className="text-[10px] text-gray-500 truncate">{item.text2}</p>}
                </div>
              </div>
            ))}
          </div>
        </section>
      );
    }
    
    // Render footer sections with special styling
    if (group.style === SectionStyle.FOOTER_SECTION) {
      const footerCollection = group.collections[0];
      if (!footerCollection || (mode === 'published' && footerCollection.status !== 'published')) {
        return null;
      }

      const items = footerCollection.items || [];
      
      return (
        <footer key={group.id} className="bg-[#1a1a1a] text-white">
          <div className="px-4 py-6 space-y-4">
            {/* Footer Items Grid */}
            <div className="grid grid-cols-2 gap-6">
              {items.slice(0, 2).map((item: any) => (
                <div key={item.id} className="space-y-2">
                  <h4 className="text-[10px] font-bold text-white mb-2">{item.name}</h4>
                  <div className="space-y-1.5">
                    {item.text1 && <div className="text-[9px] text-gray-400">{item.text1}</div>}
                    {item.text2 && <div className="text-[9px] text-gray-400">{item.text2}</div>}
                    {item.text3 && <div className="text-[9px] text-gray-400">{item.text3}</div>}
                  </div>
                </div>
              ))}
            </div>
            
            {/* Contact Info from 3rd item */}
            {items[2] && (
              <div className="pt-3 border-t border-gray-700 space-y-1">
                {items[2].text1 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-400">📞</span>
                    <span className="text-[9px] text-gray-400">{items[2].text1}</span>
                  </div>
                )}
                {items[2].text2 && (
                  <div className="flex items-center gap-1.5">
                    <span className="text-[9px] text-gray-400">✉️</span>
                    <span className="text-[9px] text-gray-400">{items[2].text2}</span>
                  </div>
                )}
              </div>
            )}
            
            {/* Copyright from 4th item */}
            {items[3] && (
              <div className="pt-2 border-t border-gray-700">
                {items[3].text1 && <p className="text-[8px] text-gray-500">{items[3].text1}</p>}
                {(items[3].text2 || items[3].text3) && (
                  <div className="flex gap-3 mt-1">
                    {items[3].text2 && <span className="text-[8px] text-gray-500">{items[3].text2}</span>}
                    {items[3].text3 && <span className="text-[8px] text-gray-500">{items[3].text3}</span>}
                  </div>
                )}
              </div>
            )}
          </div>
        </footer>
      );
    }
    
    const handleGroupClick = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (onSelectItem) {
        onSelectItem(group.id, 'group');
      }
    };
    
    return (
      <section key={group.id} onClick={handleGroupClick} className="py-6 space-y-6 border-b border-gray-50 last:border-0 cursor-pointer hover:bg-gray-50/50 transition-colors" style={{ backgroundImage: group.backgroundImage ? `url(${group.backgroundImage})` : undefined, backgroundSize: 'cover' }}>
        {group.collections.map(renderCollection)}
      </section>
    );
  };

  return (
    <div className="relative w-[320px] h-[640px] bg-white rounded-[40px] border-[8px] border-gray-900 shadow-2xl overflow-hidden flex flex-col">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-6 bg-gray-900 rounded-b-2xl z-20 flex items-center justify-center">
        <div className="w-12 h-1.5 bg-gray-800 rounded-full"></div>
      </div>

      {/* Status Bar */}
      <div className="h-8 bg-white flex items-center justify-between px-6 pt-2 shrink-0">
        <span className="text-[10px] font-bold">9:41</span>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 bg-gray-900 rounded-sm"></div>
          <div className="w-3 h-3 bg-gray-900 rounded-full"></div>
        </div>
      </div>

      {/* App Header */}
      <header className="h-14 bg-white border-b border-gray-50 flex items-center justify-between px-4 shrink-0">
        <Menu className="w-5 h-5 text-gray-900" />
        <div className="text-sm font-black tracking-tighter uppercase italic">TechnoBoost</div>
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-gray-900" />
          <div className="relative">
            <ShoppingCart className="w-5 h-5 text-gray-900" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 text-white text-[8px] font-bold rounded-full flex items-center justify-center">2</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar bg-white min-h-0 relative">
        {/* Regular Content */}
        {!selectedStore && data.collectionGroups.map(renderGroup)}

        {/* Selected Store Detail Overlay - Modal Box */}
        {selectedStore && (
          <>
            {/* Backdrop */}
            <div 
              className="absolute inset-0 bg-black/50 z-[50]"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedStore(null);
              }}
            />
            
            {/* Modal Box */}
            <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 bg-white rounded-2xl shadow-2xl z-[60] max-h-[80%] overflow-y-auto">
              {/* Store Image */}
              <div className="w-full aspect-video bg-gray-100 rounded-t-2xl overflow-hidden">
                {selectedStore.media && (
                  <img 
                    src={selectedStore.media} 
                    alt={selectedStore.name} 
                    className="w-full h-full object-cover" 
                  />
                )}
              </div>

              {/* Store Details */}
              <div className="p-4 space-y-3">
                <div>
                  <h3 className="text-base font-bold mb-1">{selectedStore.text1 || selectedStore.name}</h3>
                  <p className="text-xs text-gray-500">{selectedStore.text2}</p>
                </div>

                {/* Store Info */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-base">📍</div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold mb-0.5">Address</p>
                      <p className="text-[9px] text-gray-600">
                        Ground Floor, Astra Plaza, 5th Main Road, {selectedStore.text2}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-base">🕐</div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold mb-0.5">Store Hours</p>
                      <p className="text-[9px] text-gray-600">Mon - Sun: 10:00 AM - 9:30 PM</p>
                      <p className="text-[9px] text-green-600 font-bold mt-0.5">● Open Now</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2 p-2 bg-gray-50 rounded-lg">
                    <div className="text-base">⭐</div>
                    <div className="flex-1">
                      <p className="text-[10px] font-bold mb-0.5">Rating</p>
                      <div className="flex items-center gap-1">
                        <div className="flex items-center gap-0.5">
                          {[1,2,3,4,5].map(i => (
                            <Star key={i} className="w-2.5 h-2.5 text-yellow-400 fill-yellow-400" />
                          ))}
                        </div>
                        <span className="text-[9px] text-gray-600">4.5 (1,250 reviews)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button className="flex items-center justify-center gap-1 px-3 py-2 bg-blue-600 text-white rounded-lg text-[10px] font-bold">
                    📞 Call
                  </button>
                  <button className="flex items-center justify-center gap-1 px-3 py-2 bg-green-600 text-white rounded-lg text-[10px] font-bold">
                    🗺️ Direction
                  </button>
                </div>

                {/* Close Button */}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedStore(null);
                  }}
                  className="w-full py-2 text-xs font-bold text-gray-600 hover:text-gray-900"
                >
                  Close
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
