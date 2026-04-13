import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Save, Plus, Trash2, Tag, Smartphone, Bell, ShieldCheck, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

export function GlobalSettingsEditor() {
  const { globalSettings, fetchGlobalSettings, updateGlobalSettings } = useStore();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchGlobalSettings();
  }, []);

  useEffect(() => {
    if (globalSettings) setFormData(globalSettings);
  }, [globalSettings]);

  if (!formData) return <div className="p-8">Loading...</div>;

  const handleSave = async () => {
    try {
      await updateGlobalSettings(formData);
      toast.success('Settings saved successfully');
    } catch (e) {
      toast.error('Failed to save settings');
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto w-full space-y-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Global Settings</h2>
          <p className="text-[#666] text-sm">Configure app-wide behavior and metadata</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Changes
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Tags & Labels */}
        <section className="bg-white p-6 rounded-xl border border-[#E5E5E5] space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <Tag className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Tags & Labels</h3>
          </div>
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#999] uppercase">Best Seller Tag</label>
              <input 
                type="text" 
                value={formData.bestSellerTag || ''} 
                onChange={(e) => setFormData({ ...formData, bestSellerTag: e.target.value })}
                className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#999] uppercase">New Arrival Tag</label>
              <input 
                type="text" 
                value={formData.newArrivalTag || ''} 
                onChange={(e) => setFormData({ ...formData, newArrivalTag: e.target.value })}
                className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#999] uppercase">Selling Fast QTY</label>
              <input 
                type="number" 
                value={formData.sellingFastQTY || 0} 
                onChange={(e) => setFormData({ ...formData, sellingFastQTY: parseInt(e.target.value) })}
                className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>
          </div>
        </section>

        {/* App Versions */}
        <section className="bg-white p-6 rounded-xl border border-[#E5E5E5] space-y-6 shadow-sm">
          <div className="flex items-center gap-2 text-blue-600">
            <RefreshCw className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">App Versions</h3>
          </div>
          
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#999] uppercase">Android New Version</label>
                <input 
                  type="text" 
                  value={formData.androidNewVersion || ''} 
                  onChange={(e) => setFormData({ ...formData, androidNewVersion: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#999] uppercase">Android Force Update</label>
                <input 
                  type="text" 
                  value={formData.androidForceUpdateVersion || ''} 
                  onChange={(e) => setFormData({ ...formData, androidForceUpdateVersion: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#999] uppercase">iOS New Version</label>
                <input 
                  type="text" 
                  value={formData.iosNewVersion || ''} 
                  onChange={(e) => setFormData({ ...formData, iosNewVersion: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-[#999] uppercase">iOS Force Update</label>
                <input 
                  type="text" 
                  value={formData.iosForceUpdateVersion || ''} 
                  onChange={(e) => setFormData({ ...formData, iosForceUpdateVersion: e.target.value })}
                  className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Feature Toggles */}
        <section className="bg-white p-6 rounded-xl border border-[#E5E5E5] space-y-6 shadow-sm col-span-full">
          <div className="flex items-center gap-2 text-blue-600">
            <ShieldCheck className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Feature Toggles</h3>
          </div>
          
          <div className="flex items-center gap-8">
            <label className="flex items-center gap-3 cursor-pointer group">
              <div className={`w-12 h-6 rounded-full p-1 transition-colors ${formData.wishlist ? 'bg-blue-600' : 'bg-gray-200'}`}>
                <div className={`w-4 h-4 bg-white rounded-full transition-transform ${formData.wishlist ? 'translate-x-6' : 'translate-x-0'}`}></div>
              </div>
              <span className="text-sm font-medium">Enable Wishlist</span>
              <input 
                type="checkbox" 
                className="hidden" 
                checked={formData.wishlist} 
                onChange={(e) => setFormData({ ...formData, wishlist: e.target.checked })} 
              />
            </label>
          </div>
        </section>
      </div>
    </div>
  );
}
