import { create } from 'zustand';
import axios from 'axios';
import { Page, GlobalSetting, GlobalStyle, Store, ProductColor, Media, CollectionGroup, Collection, CollectionItem, CollectionStyle, CollectionItemStyle } from './types';

// Helper function to map Collection Style to Item Style
const getItemStyleFromCollectionStyle = (collectionStyle: string): string => {
  const styleMap: Record<string, string> = {
    [CollectionStyle.CIR_COLLECTION]: CollectionItemStyle.CIR_COLLECTION_ITEM,
    [CollectionStyle.SLIDER_COLLECTION]: CollectionItemStyle.SLIDER_COLLECTION_ITEM,
    [CollectionStyle.TAB_COLLECTION]: CollectionItemStyle.TAB_COLLECTION_ITEM,
    [CollectionStyle.TI_COLLECTION]: CollectionItemStyle.TI_COLLECTION_ITEM,
    [CollectionStyle.TI_COLLECTION_V2]: CollectionItemStyle.TI_COLLECTION_ITEM_V2,
    [CollectionStyle.REC_COLLECTION]: CollectionItemStyle.REC_COLLECTION_ITEM,
    [CollectionStyle.BANNER_COLLECTION]: CollectionItemStyle.BANNER_COLLECTION_ITEM,
    [CollectionStyle.VIDEO_COLLECTION]: CollectionItemStyle.VIDEO_COLLECTION_ITEM,
    [CollectionStyle.TAB_COLLECTION_NEW_ARRIVAL_NO_BACKGROUND]: CollectionItemStyle.REC_COLLECTION_ITEM_NEW_ARRIVAL,
    [CollectionStyle.TAB_COLLECTION_NEW_ARRIVAL]: CollectionItemStyle.REC_COLLECTION_ITEM_NEW_ARRIVAL,
    [CollectionStyle.STORE_COLLECTION]: CollectionItemStyle.STORE_COLLECTION_ITEM,
    [CollectionStyle.FOOTER_COLLECTION]: CollectionItemStyle.FOOTER_COLLECTION_ITEM,
    [CollectionStyle.VOC_COLLECTION]: CollectionItemStyle.VOC_COLLECTION_ITEM,
    [CollectionStyle.GRID_COLLECTION]: CollectionItemStyle.GRID_COLLECTION_ITEM,
    [CollectionStyle.RECENTLY_VIEWED_COLLECTION]: CollectionItemStyle.RECENTLY_VIEWED_COLLECTION_ITEM,
    [CollectionStyle.LANDING_PAGE_BANNER_COLLECTION]: CollectionItemStyle.LANDING_PAGE_BANNER_COLLECTION_ITEM,
    [CollectionStyle.IMAGE_WITH_TEXT_COLLECTION]: CollectionItemStyle.IMAGE_WITH_TEXT_COLLECTION_ITEM,
    [CollectionStyle.CATEGORY_TABBING_COLLECTION]: CollectionItemStyle.CATEGORY_TABBING_COLLECTION_ITEM,
    [CollectionStyle.CATEGORY_STYLE_COLLECTION]: CollectionItemStyle.CATEGORY_STYLE_COLLECTION_ITEM,
    [CollectionStyle.IMAGE_WITH_TEXT_BREAKER_COLLECTION]: CollectionItemStyle.IMAGE_WITH_TEXT_BREAKER_COLLECTION_ITEM,
    [CollectionStyle.BY_PRICE_COLLECTION]: CollectionItemStyle.BY_PRICE_COLLECTION_ITEM,
    [CollectionStyle.SHOP_LOOK_COLLECTION]: CollectionItemStyle.SHOP_LOOK_COLLECTION_ITEM,
    [CollectionStyle.BY_OCCASION_COLLECTION]: CollectionItemStyle.BY_OCCASION_COLLECTION_ITEM,
    [CollectionStyle.TOP_PRODUCTS_LIST_COLLECTION]: CollectionItemStyle.TOP_PRODUCTS_LIST_COLLECTION_ITEM,
    [CollectionStyle.COLLECTION_VIDEO_COLLECTION]: CollectionItemStyle.COLLECTION_VIDEO_COLLECTION_ITEM,
    [CollectionStyle.CATEGORY_TAB_COLLECTION]: CollectionItemStyle.CATEGORY_TAB_COLLECTION_ITEM,
    [CollectionStyle.PRODUCTS_WITH_TABS_COLLECTION]: CollectionItemStyle.PRODUCTS_WITH_TABS_COLLECTION_ITEM,
    [CollectionStyle.PRODUCTS_WITHOUT_TABS_COLLECTION]: CollectionItemStyle.PRODUCTS_WITHOUT_TABS_COLLECTION_ITEM,
    [CollectionStyle.CX_REVIEW_COLLECTION]: CollectionItemStyle.CX_REVIEW_COLLECTION_ITEM,
  };
  
  return styleMap[collectionStyle] || CollectionItemStyle.BANNER_COLLECTION_ITEM;
};

interface AppState {
  pages: Page[];
  currentPage: Page | null;
  globalSettings: GlobalSetting | null;
  globalStyles: any | null;
  stores: Store[];
  productColors: ProductColor[];
  media: Media[];
  loading: boolean;
  
  fetchPages: () => Promise<void>;
  fetchPage: (id: string) => Promise<void>;
  createPage: (name: string) => Promise<void>;
  updatePage: (id: string, data: any) => Promise<void>;
  deletePage: (id: string) => Promise<void>;
  
  fetchGlobalSettings: () => Promise<void>;
  updateGlobalSettings: (data: any) => Promise<void>;
  
  fetchGlobalStyles: () => Promise<void>;
  updateGlobalStyles: (data: any) => Promise<void>;
  
  fetchStores: () => Promise<void>;
  createStore: (data: any) => Promise<void>;
  updateStore: (id: string, data: any) => Promise<void>;
  deleteStore: (id: string) => Promise<void>;
  
  fetchProductColors: () => Promise<void>;
  createProductColor: (data: any) => Promise<void>;
  updateProductColor: (id: string, data: any) => Promise<void>;
  deleteProductColor: (id: string) => Promise<void>;
  
  fetchMedia: () => Promise<void>;
  uploadMedia: (data: any) => Promise<void>;
  fetchMiddlewareData: () => Promise<void>;
  
  // Builder actions
  addCollectionGroup: (pageId: string, name: string, style: string) => Promise<void>;
  updateCollectionGroup: (id: string, data: any) => Promise<void>;
  deleteCollectionGroup: (id: string) => Promise<void>;
  
  addCollection: (groupId: string, name: string, style: string) => Promise<void>;
  updateCollection: (id: string, data: any) => Promise<void>;
  deleteCollection: (id: string) => Promise<void>;
  
  addCollectionItem: (collectionId: string, name: string, style: string) => Promise<void>;
  updateCollectionItem: (id: string, data: any) => Promise<void>;
  deleteCollectionItem: (id: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  pages: [],
  currentPage: null,
  globalSettings: null,
  globalStyles: null,
  stores: [],
  productColors: [],
  media: [],
  loading: false,

  fetchPages: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/api/pages');
      const data = res.data;
      set({ pages: Array.isArray(data) ? data : (data.pages || []), loading: false });
    } catch (error) {
      console.error('Failed to fetch pages:', error);
      set({ pages: [], loading: false });
    }
  },

  fetchPage: async (id: string) => {
    set({ loading: true });
    const res = await axios.get(`/api/pages/${id}`);
    set({ currentPage: res.data, loading: false });
  },

  createPage: async (name: string) => {
    await axios.post('/api/pages', { name });
    get().fetchPages();
  },

  updatePage: async (id: string, data: any) => {
    await axios.put(`/api/pages/${id}`, data);
    if (get().currentPage?.id === id) {
      get().fetchPage(id);
    }
    get().fetchPages();
  },

  deletePage: async (id: string) => {
    await axios.delete(`/api/pages/${id}`);
    get().fetchPages();
  },

  fetchGlobalSettings: async () => {
    const res = await axios.get('/api/global-settings');
    set({ globalSettings: res.data });
  },

  updateGlobalSettings: async (data: any) => {
    await axios.post('/api/global-settings', data);
    get().fetchGlobalSettings();
  },

  fetchGlobalStyles: async () => {
    const res = await axios.get('/api/global-styles');
    set({ globalStyles: res.data });
  },

  updateGlobalStyles: async (data: any) => {
    await axios.post('/api/global-styles', data);
    get().fetchGlobalStyles();
  },

  fetchStores: async () => {
    const res = await axios.get('/api/stores');
    set({ stores: res.data });
  },

  createStore: async (data: any) => {
    await axios.post('/api/stores', data);
    get().fetchStores();
  },

  updateStore: async (id: string, data: any) => {
    await axios.put(`/api/stores/${id}`, data);
    get().fetchStores();
  },

  deleteStore: async (id: string) => {
    await axios.delete(`/api/stores/${id}`);
    get().fetchStores();
  },

  fetchProductColors: async () => {
    const res = await axios.get('/api/product-colors');
    set({ productColors: res.data });
  },

  createProductColor: async (data: any) => {
    await axios.post('/api/product-colors', data);
    get().fetchProductColors();
  },

  updateProductColor: async (id: string, data: any) => {
    await axios.put(`/api/product-colors/${id}`, data);
    get().fetchProductColors();
  },

  deleteProductColor: async (id: string) => {
    await axios.delete(`/api/product-colors/${id}`);
    get().fetchProductColors();
  },

  fetchMedia: async () => {
    const res = await axios.get('/api/media');
    set({ media: res.data });
  },

  uploadMedia: async (data: any) => {
    await axios.post('/api/media', data);
    get().fetchMedia();
  },

  fetchMiddlewareData: async () => {
    set({ loading: true });
    try {
      const res = await axios.get('/api/middleware/home-page');
      console.log('Middleware Data:', res.data);
      // We could map this data to our internal structures if needed
      set({ loading: false });
    } catch (error) {
      set({ loading: false });
      throw error;
    }
  },

  addCollectionGroup: async (pageId: string, name: string, style: string) => {
    await axios.post('/api/collection-groups', { pageId, name, style });
    get().fetchPage(pageId);
  },

  updateCollectionGroup: async (id: string, data: any) => {
    await axios.put(`/api/collection-groups/${id}`, data);
    if (get().currentPage) {
      get().fetchPage(get().currentPage!.id);
    }
  },

  deleteCollectionGroup: async (id: string) => {
    await axios.delete(`/api/collection-groups/${id}`);
    if (get().currentPage) {
      get().fetchPage(get().currentPage!.id);
    }
  },

  addCollection: async (groupId: string, name: string, style: string) => {
    await axios.post('/api/collections', { groupId, name, style });
    if (get().currentPage) {
      get().fetchPage(get().currentPage!.id);
    }
  },

  updateCollection: async (id: string, data: any) => {
    // If style is being updated, also update all child items' styles
    if (data.style) {
      const currentPage = get().currentPage;
      if (currentPage) {
        // Find the collection and its items
        for (const group of currentPage.collectionGroups) {
          const collection = group.collections.find(c => c.id === id);
          if (collection && collection.items.length > 0) {
            // Get the matching item style
            const newItemStyle = getItemStyleFromCollectionStyle(data.style);
            
            // Update all items with the new style
            const updatePromises = collection.items.map(item => 
              axios.put(`/api/collection-items/${item.id}`, { style: newItemStyle })
            );
            
            await Promise.all(updatePromises);
            break;
          }
        }
      }
    }
    
    await axios.put(`/api/collections/${id}`, data);
    if (get().currentPage) {
      get().fetchPage(get().currentPage!.id);
    }
  },

  deleteCollection: async (id: string) => {
    await axios.delete(`/api/collections/${id}`);
    if (get().currentPage) {
      get().fetchPage(get().currentPage!.id);
    }
  },

  addCollectionItem: async (collectionId: string, name: string, style: string) => {
    await axios.post('/api/collection-items', { collectionId, name, style });
    if (get().currentPage) {
      get().fetchPage(get().currentPage!.id);
    }
  },

  updateCollectionItem: async (id: string, data: any) => {
    await axios.put(`/api/collection-items/${id}`, data);
    if (get().currentPage) {
      get().fetchPage(get().currentPage!.id);
    }
  },

  deleteCollectionItem: async (id: string) => {
    await axios.delete(`/api/collection-items/${id}`);
    if (get().currentPage) {
      get().fetchPage(get().currentPage!.id);
    }
  },
}));
