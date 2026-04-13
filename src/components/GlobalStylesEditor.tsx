import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Save, Palette, FileJson, Info } from 'lucide-react';
import { toast } from 'sonner';

export function GlobalStylesEditor() {
  const { globalStyles, fetchGlobalStyles, updateGlobalStyles } = useStore();
  const [formData, setFormData] = useState<any>(null);

  useEffect(() => {
    fetchGlobalStyles();
  }, []);

  useEffect(() => {
    if (globalStyles) setFormData(globalStyles);
  }, [globalStyles]);

  if (!formData) return <div className="p-8">Loading...</div>;

  const handleSave = async () => {
    try {
      await updateGlobalStyles(formData);
      toast.success('Styles saved successfully');
    } catch (e) {
      toast.error('Failed to save styles');
    }
  };

  return (
    <div className="p-8 max-w-5xl mx-auto w-full space-y-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Global Styles</h2>
          <p className="text-[#666] text-sm">Configure CSS styles and families for the mobile app</p>
        </div>
        <button 
          onClick={handleSave}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Save className="w-4 h-4" />
          Save Styles
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-blue-600">
                <FileJson className="w-5 h-5" />
                <h3 className="font-bold uppercase tracking-wider text-sm">Style List (JSON)</h3>
              </div>
              <div className="text-[10px] bg-blue-50 text-blue-600 px-2 py-1 rounded font-bold">CONFIG DRIVEN</div>
            </div>
            
            <textarea 
              value={typeof formData.styleList === 'string' ? formData.styleList : JSON.stringify(formData.styleList || {}, null, 2)} 
              onChange={(e) => setFormData({ ...formData, styleList: e.target.value })}
              rows={25}
              className="w-full border border-[#E5E5E5] rounded-lg px-4 py-3 text-xs font-mono focus:ring-2 focus:ring-blue-500 outline-none bg-gray-50 leading-relaxed"
              placeholder='{ "PAGE": { ... }, "CIR_SECTION": { ... } }'
            />
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-blue-50 p-6 rounded-xl border border-blue-100 space-y-4">
            <div className="flex items-center gap-2 text-blue-600">
              <Info className="w-5 h-5" />
              <h4 className="font-bold text-sm">Style Families</h4>
            </div>
            <p className="text-xs text-blue-700 leading-relaxed">
              The style list should contain configuration for each style family. 
              These styles are applied directly to the mobile app components.
            </p>
            <ul className="space-y-2 text-[10px] font-bold text-blue-600 uppercase tracking-tight">
              <li>• PAGE</li>
              <li>• CIR_SECTION</li>
              <li>• CIR_COLLECTION</li>
              <li>• CIR_COLLECTION_ITEM</li>
              <li>• SLIDE_SECTION</li>
              <li>• SLIDER_COLLECTION</li>
              <li>• SLIDER_COLLECTION_ITEM</li>
              <li>• BANNER_SECTION</li>
              <li>• BANNER_COLLECTION</li>
              <li>• BANNER_COLLECTION_ITEM</li>
              <li>• REC_SECTION</li>
              <li>• REC_COLLECTION</li>
              <li>• REC_COLLECTION_ITEM</li>
            </ul>
          </div>

          <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] space-y-4 shadow-sm">
            <div className="flex items-center gap-2 text-blue-600">
              <Palette className="w-5 h-5" />
              <h4 className="font-bold text-sm">Global Theme</h4>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-bold text-[#999] uppercase">Primary Color</label>
              <div className="flex gap-2">
                <input 
                  type="color" 
                  className="w-10 h-10 rounded cursor-pointer border-none"
                />
                <input 
                  type="text" 
                  className="flex-1 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="#000000"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
