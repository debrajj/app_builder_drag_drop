import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Plus, Trash2, Store as StoreIcon, MapPin, Phone, Clock, Star, ChevronRight, ArrowLeft, Edit } from 'lucide-react';
import { toast } from 'sonner';

type ViewMode = 'overview' | 'city-detail' | 'store-edit';

export function StoreManager() {
  const { stores, fetchStores, createStore, updateStore, deleteStore } = useStore();
  const [viewMode, setViewMode] = useState<ViewMode>('overview');
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const [showBanner, setShowBanner] = useState(true);

  useEffect(() => {
    fetchStores();
  }, []);

  // Group stores by city
  const storesByCity = stores.reduce((acc, store) => {
    const city = store.city || 'Unknown';
    if (!acc[city]) {
      acc[city] = {
        city,
        state: store.state,
        isPopular: store.isPopular || false,
        stores: []
      };
    }
    acc[city].stores.push(store);
    return acc;
  }, {} as Record<string, { city: string; state?: string; isPopular: boolean; stores: typeof stores }>);

  const cityGroups = Object.values(storesByCity);
  const popularCities = cityGroups.filter(g => g.isPopular);
  const otherCities = cityGroups.filter(g => !g.isPopular);

  // Group other cities by state
  const citiesByState = otherCities.reduce((acc, cityGroup) => {
    const state = cityGroup.state || 'Unknown';
    if (!acc[state]) acc[state] = [];
    acc[state].push(cityGroup);
    return acc;
  }, {} as Record<string, typeof otherCities>);

  const selectedStore = stores.find(s => s.id === selectedStoreId);
  const cityStores = selectedCity ? storesByCity[selectedCity]?.stores || [] : [];

  const handleCreate = async () => {
    try {
      await createStore({ name: 'New Store', storePosition: stores.length });
      toast.success('Store created');
    } catch (e) {
      toast.error('Failed to create store');
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateStore(id, data);
      toast.success('Store updated');
    } catch (e) {
      toast.error('Failed to update store');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this store?')) {
      try {
        await deleteStore(id);
        setSelectedStoreId(null);
        setViewMode('overview');
        toast.success('Store deleted');
      } catch (e) {
        toast.error('Failed to delete store');
      }
    }
  };

  const handleCityClick = (city: string) => {
    setSelectedCity(city);
    setViewMode('city-detail');
  };

  const handleStoreClick = (storeId: string) => {
    setSelectedStoreId(storeId);
    setViewMode('store-edit');
  };

  const handleBack = () => {
    if (viewMode === 'store-edit') {
      setViewMode('city-detail');
      setSelectedStoreId(null);
    } else if (viewMode === 'city-detail') {
      setViewMode('overview');
      setSelectedCity(null);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden bg-gray-50">
      {/* Overview - City Grid */}
      {viewMode === 'overview' && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-6xl mx-auto space-y-8">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-3xl font-bold">Store Locations</h2>
                <p className="text-[#666] mt-1">Manage your physical store locations across India</p>
              </div>
              <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Add Store
              </button>
            </div>

            {/* Store Banner - Collapsible */}
            {showBanner ? (
              <div 
                onClick={() => setShowBanner(false)}
                className="relative bg-gradient-to-br from-purple-600 via-pink-500 to-red-500 rounded-3xl overflow-hidden cursor-pointer hover:shadow-2xl transition-all group"
              >
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute bottom-0 left-0 right-0 h-32 flex items-end justify-around px-8">
                    {[...Array(12)].map((_, i) => (
                      <div 
                        key={i}
                        className="bg-white rounded-t-lg"
                        style={{ 
                          width: `${20 + (i % 3) * 10}px`, 
                          height: `${40 + (i % 4) * 20}px` 
                        }}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative p-12 text-center text-white">
                  <div className="inline-flex items-center gap-3 mb-4">
                    <StoreIcon className="w-12 h-12" />
                  </div>
                  <h1 className="text-6xl font-bold mb-2">
                    {stores.length}+ STORES
                  </h1>
                  <p className="text-2xl font-medium opacity-90 mb-6">ACROSS INDIA</p>
                  <div className="flex items-center justify-center gap-2 text-sm opacity-75 group-hover:opacity-100 transition-opacity">
                    <span>Click to explore all locations</span>
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute top-8 right-8 w-24 h-24 bg-white/10 rounded-full blur-2xl" />
                <div className="absolute bottom-8 left-8 w-32 h-32 bg-white/10 rounded-full blur-3xl" />
              </div>
            ) : (
              <>
                {/* Collapsed Banner - Shows Store Count */}
                <div 
                  onClick={() => setShowBanner(true)}
                  className="bg-gradient-to-r from-purple-600 to-pink-500 rounded-2xl p-6 cursor-pointer hover:shadow-lg transition-all group"
                >
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                        <StoreIcon className="w-6 h-6" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold">{stores.length}+ Stores Across India</h3>
                        <p className="text-sm opacity-90">Click to collapse</p>
                      </div>
                    </div>
                    <ChevronRight className="w-6 h-6 transform rotate-90 group-hover:rotate-180 transition-transform" />
                  </div>
                </div>

                {/* Popular Cities */}
                {popularCities.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <Star className="w-5 h-5 text-yellow-500" />
                      Popular Cities
                    </h3>
                    <div className="grid grid-cols-3 gap-6">
                      {popularCities.map(cityGroup => (
                        <CityCard 
                          key={cityGroup.city}
                          city={cityGroup.city}
                          state={cityGroup.state}
                          storeCount={cityGroup.stores.length}
                          isPopular={true}
                          onClick={() => handleCityClick(cityGroup.city)}
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Other Cities by State */}
                {Object.keys(citiesByState).length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-blue-600" />
                      Other Cities
                    </h3>
                    {Object.entries(citiesByState).map(([state, cities]) => (
                      <div key={state} className="mb-6">
                        <h4 className="text-sm font-bold text-[#999] uppercase mb-3">{state}</h4>
                        <div className="grid grid-cols-4 gap-4">
                          {cities.map(cityGroup => (
                            <CityCard 
                              key={cityGroup.city}
                              city={cityGroup.city}
                              state={cityGroup.state}
                              storeCount={cityGroup.stores.length}
                              isPopular={false}
                              onClick={() => handleCityClick(cityGroup.city)}
                            />
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      )}

      {/* City Detail - Store List */}
      {viewMode === 'city-detail' && selectedCity && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-4xl mx-auto space-y-6">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-[#666] hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Cities
            </button>

            <div>
              <h2 className="text-3xl font-bold">{selectedCity}</h2>
              <p className="text-[#666] mt-1">{cityStores.length} store{cityStores.length !== 1 ? 's' : ''} in this city</p>
            </div>

            <div className="grid gap-4">
              {cityStores.map(store => (
                <StoreListCard 
                  key={store.id}
                  store={store}
                  onClick={() => handleStoreClick(store.id)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Store Edit */}
      {viewMode === 'store-edit' && selectedStore && (
        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-3xl mx-auto space-y-8">
            <button 
              onClick={handleBack}
              className="flex items-center gap-2 text-[#666] hover:text-[#1A1A1A] transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {selectedCity}
            </button>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-2xl font-bold">{selectedStore.name}</h3>
                <p className="text-[#666] text-sm uppercase font-bold tracking-widest mt-1">Store Details</p>
              </div>
              <button 
                onClick={() => handleDelete(selectedStore.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
              >
                <Trash2 className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#999] uppercase">Store Name</label>
                <input 
                  type="text" 
                  value={selectedStore.name} 
                  onChange={(e) => handleUpdate(selectedStore.id, { name: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#999] uppercase">City</label>
                <input 
                  type="text" 
                  value={selectedStore.city || ''} 
                  onChange={(e) => handleUpdate(selectedStore.id, { city: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#999] uppercase">State</label>
                <input 
                  type="text" 
                  value={selectedStore.state || ''} 
                  onChange={(e) => handleUpdate(selectedStore.id, { state: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g., Karnataka, Tamil Nadu"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#999] uppercase">Status</label>
                <select 
                  value={selectedStore.status || 'published'} 
                  onChange={(e) => handleUpdate(selectedStore.id, { status: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                >
                  <option value="published">Published</option>
                  <option value="draft">Draft</option>
                </select>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold text-[#999] uppercase flex items-center gap-2">
                  <input 
                    type="checkbox" 
                    checked={selectedStore.isPopular || false} 
                    onChange={(e) => handleUpdate(selectedStore.id, { isPopular: e.target.checked })}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  Popular City (Show in Popular Cities section)
                </label>
              </div>
              <div className="space-y-2 col-span-2">
                <label className="text-xs font-bold text-[#999] uppercase">Address</label>
                <textarea 
                  value={selectedStore.address || ''} 
                  onChange={(e) => handleUpdate(selectedStore.id, { address: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#999] uppercase">Contact Us</label>
                <input 
                  type="text" 
                  value={selectedStore.contactUs || ''} 
                  onChange={(e) => handleUpdate(selectedStore.id, { contactUs: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-[#999] uppercase">Direction Link</label>
                <input 
                  type="text" 
                  value={selectedStore.direction || ''} 
                  onChange={(e) => handleUpdate(selectedStore.id, { direction: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="grid grid-cols-2 gap-4 col-span-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#999] uppercase">Latitude</label>
                  <input 
                    type="number" 
                    value={selectedStore.latitude || 0} 
                    onChange={(e) => handleUpdate(selectedStore.id, { latitude: parseFloat(e.target.value) })}
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#999] uppercase">Longitude</label>
                  <input 
                    type="number" 
                    value={selectedStore.longitude || 0} 
                    onChange={(e) => handleUpdate(selectedStore.id, { longitude: parseFloat(e.target.value) })}
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4 col-span-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#999] uppercase">Opening Time</label>
                  <input 
                    type="time" 
                    value={selectedStore.openingTime || ''} 
                    onChange={(e) => handleUpdate(selectedStore.id, { openingTime: e.target.value })}
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#999] uppercase">Closing Time</label>
                  <input 
                    type="time" 
                    value={selectedStore.closingTime || ''} 
                    onChange={(e) => handleUpdate(selectedStore.id, { closingTime: e.target.value })}
                    className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function CityCard({ city, state, storeCount, isPopular, onClick }: { 
  city: string; 
  state?: string; 
  storeCount: number; 
  isPopular: boolean; 
  onClick: () => void;
}) {
  // City skyline gradients
  const gradients = [
    'from-pink-400 to-purple-500',
    'from-blue-400 to-indigo-500',
    'from-orange-400 to-red-500',
    'from-green-400 to-teal-500',
    'from-yellow-400 to-orange-500',
  ];
  
  const gradient = gradients[city.length % gradients.length];
  
  return (
    <div 
      onClick={onClick}
      className="group relative bg-white rounded-2xl border border-[#E5E5E5] overflow-hidden cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1"
    >
      {/* City Skyline Background */}
      <div className={`h-32 bg-gradient-to-br ${gradient} relative overflow-hidden`}>
        <div className="absolute bottom-0 left-0 right-0 h-16 flex items-end justify-center gap-1 px-4 opacity-30">
          <div className="w-8 h-12 bg-white rounded-t"></div>
          <div className="w-6 h-16 bg-white rounded-t"></div>
          <div className="w-10 h-20 bg-white rounded-t"></div>
          <div className="w-7 h-14 bg-white rounded-t"></div>
          <div className="w-9 h-18 bg-white rounded-t"></div>
          <div className="w-6 h-12 bg-white rounded-t"></div>
        </div>
        {isPopular && (
          <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm rounded-full p-1.5">
            <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
          </div>
        )}
      </div>
      
      {/* City Info */}
      <div className="p-4">
        <h3 className="font-bold text-lg">{city}</h3>
        {state && <p className="text-xs text-[#999] mt-0.5">{state}</p>}
        <p className="text-sm text-[#666] mt-2">{storeCount} store{storeCount !== 1 ? 's' : ''}</p>
      </div>
      
      {/* Hover Arrow */}
      <div className="absolute bottom-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
        <ChevronRight className="w-5 h-5 text-blue-600" />
      </div>
    </div>
  );
}

function StoreListCard({ store, onClick }: { store: any; onClick: () => void }) {
  return (
    <div 
      onClick={onClick}
      className="bg-white rounded-xl border border-[#E5E5E5] p-6 cursor-pointer hover:shadow-md hover:border-blue-200 transition-all group"
    >
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center text-white">
              <StoreIcon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold text-lg">{store.name}</h3>
              {store.isPopular && (
                <span className="inline-flex items-center gap-1 text-xs text-yellow-600 font-medium">
                  <Star className="w-3 h-3 fill-yellow-500" />
                  Popular
                </span>
              )}
            </div>
          </div>
          
          <div className="space-y-2 text-sm">
            {store.address && (
              <div className="flex items-start gap-2 text-[#666]">
                <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
                <span>{store.address}</span>
              </div>
            )}
            {store.contactUs && (
              <div className="flex items-center gap-2 text-[#666]">
                <Phone className="w-4 h-4 flex-shrink-0" />
                <span>{store.contactUs}</span>
              </div>
            )}
            {store.openingTime && store.closingTime && (
              <div className="flex items-center gap-2 text-[#666]">
                <Clock className="w-4 h-4 flex-shrink-0" />
                <span>{store.openingTime} - {store.closingTime}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <Edit className="w-5 h-5 text-blue-600" />
          </div>
          <ChevronRight className="w-5 h-5 text-[#999]" />
        </div>
      </div>
    </div>
  );
}
