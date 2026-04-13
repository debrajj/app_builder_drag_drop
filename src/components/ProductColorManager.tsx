import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Save, Plus, Trash2, Palette, Image as ImageIcon, Search } from 'lucide-react';
import { toast } from 'sonner';

export function ProductColorManager() {
  const { productColors, fetchProductColors, createProductColor, updateProductColor, deleteProductColor } = useStore();
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchProductColors();
  }, []);

  const filteredColors = productColors.filter(c => c.colorName.toLowerCase().includes(search.toLowerCase()));

  const handleCreate = async () => {
    try {
      await createProductColor({ colorName: 'New Color', colorCode: '#000000', colorType: 'Color' });
      toast.success('Color added');
    } catch (e) {
      toast.error('Failed to add color');
    }
  };

  const handleUpdate = async (id: string, data: any) => {
    try {
      await updateProductColor(id, data);
      toast.success('Color updated');
    } catch (e) {
      toast.error('Failed to update color');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this color?')) {
      try {
        await deleteProductColor(id);
        toast.success('Color deleted');
      } catch (e) {
        toast.error('Failed to delete color');
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full space-y-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Product Colors</h2>
          <p className="text-[#666] text-sm">Manage color swatches and image-based variants</p>
        </div>
        <button 
          onClick={handleCreate}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Color
        </button>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E5E5E5] bg-gray-50 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#999]" />
          <input 
            type="text" 
            placeholder="Search colors..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="divide-y divide-[#E5E5E5]">
          {filteredColors.length > 0 ? (
            filteredColors.map(color => (
              <div key={color.id} className="p-4 grid grid-cols-12 gap-4 items-center hover:bg-gray-50 transition-colors">
                <div className="col-span-3 flex items-center gap-4">
                  <div 
                    className="w-12 h-12 rounded-lg border border-[#E5E5E5] shrink-0 overflow-hidden"
                    style={{ backgroundColor: color.colorType === 'Color' ? color.colorCode || '#FFF' : undefined }}
                  >
                    {color.colorType === 'Image' && color.imageUrl && <img src={color.imageUrl} className="w-full h-full object-cover" />}
                  </div>
                  <input 
                    type="text" 
                    value={color.colorName} 
                    onChange={(e) => handleUpdate(color.id, { colorName: e.target.value })}
                    className="bg-transparent border-none focus:ring-0 text-sm font-bold w-full"
                  />
                </div>
                
                <div className="col-span-2">
                  <select 
                    value={color.colorType} 
                    onChange={(e) => handleUpdate(color.id, { colorType: e.target.value })}
                    className="w-full border border-[#E5E5E5] rounded-lg px-2 py-1.5 text-xs focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="Color">Color</option>
                    <option value="Image">Image</option>
                  </select>
                </div>

                <div className="col-span-3">
                  {color.colorType === 'Color' ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="color" 
                        value={color.colorCode || '#000000'} 
                        onChange={(e) => handleUpdate(color.id, { colorCode: e.target.value })}
                        className="w-8 h-8 rounded cursor-pointer border-none p-0"
                      />
                      <input 
                        type="text" 
                        value={color.colorCode || ''} 
                        onChange={(e) => handleUpdate(color.id, { colorCode: e.target.value })}
                        className="flex-1 border border-[#E5E5E5] rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      />
                    </div>
                  ) : (
                    <input 
                      type="text" 
                      value={color.imageUrl || ''} 
                      onChange={(e) => handleUpdate(color.id, { imageUrl: e.target.value })}
                      className="w-full border border-[#E5E5E5] rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="Image URL"
                    />
                  )}
                </div>

                <div className="col-span-3">
                  <input 
                    type="text" 
                    value={color.imageName || ''} 
                    onChange={(e) => handleUpdate(color.id, { imageName: e.target.value })}
                    className="w-full border border-[#E5E5E5] rounded-lg px-2 py-1 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="Image Name / SKU"
                  />
                </div>

                <div className="col-span-1 flex justify-end">
                  <button 
                    onClick={() => handleDelete(color.id)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center text-[#999]">No colors found</div>
          )}
        </div>
      </div>
    </div>
  );
}
