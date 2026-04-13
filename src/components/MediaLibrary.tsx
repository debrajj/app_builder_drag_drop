import { useEffect, useState } from 'react';
import { useStore } from '../store';
import { Upload, Search, Trash2, Image as ImageIcon, File, ExternalLink, Copy, Video, Play } from 'lucide-react';
import { toast } from 'sonner';

export function MediaLibrary() {
  const { media, fetchMedia, uploadMedia } = useStore();
  const [search, setSearch] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadUrl, setUploadUrl] = useState('');
  const [uploadName, setUploadName] = useState('');
  const [uploadType, setUploadType] = useState('image');

  useEffect(() => {
    fetchMedia();
  }, []);

  const filteredMedia = media.filter(m => m.name.toLowerCase().includes(search.toLowerCase()));

  const handleUpload = async () => {
    if (!uploadUrl || !uploadName) return;
    try {
      await uploadMedia({ url: uploadUrl, name: uploadName, type: uploadType });
      setUploadUrl('');
      setUploadName('');
      setUploadType('image');
      setIsUploading(false);
      toast.success('Media uploaded');
    } catch (e) {
      toast.error('Failed to upload media');
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    toast.success('URL copied to clipboard');
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full space-y-8 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Media Library</h2>
          <p className="text-[#666] text-sm">Manage your assets and images for the app</p>
        </div>
        <button 
          onClick={() => setIsUploading(true)}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
        >
          <Upload className="w-4 h-4" />
          Upload Media
        </button>
      </div>

      {isUploading && (
        <div className="bg-white p-6 rounded-xl border border-[#E5E5E5] space-y-4 shadow-sm animate-in slide-in-from-top-4">
          <div className="flex items-center gap-2 text-blue-600 mb-2">
            <Upload className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wider text-sm">Upload New Asset</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#999] uppercase">Asset Name</label>
              <input 
                type="text" 
                value={uploadName} 
                onChange={(e) => setUploadName(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Hero Banner"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#999] uppercase">Media URL</label>
              <input 
                type="text" 
                value={uploadUrl} 
                onChange={(e) => setUploadUrl(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://... (image or video URL)"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-[#999] uppercase">Media Type</label>
              <select 
                value={uploadType} 
                onChange={(e) => setUploadType(e.target.value)}
                className="w-full border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="image">Image</option>
                <option value="video">Video</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end gap-3">
            <button 
              onClick={() => setIsUploading(false)}
              className="text-[#666] px-4 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
            <button 
              onClick={handleUpload}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg text-sm font-medium"
            >
              Upload
            </button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E5E5E5] bg-gray-50 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#999]" />
          <input 
            type="text" 
            placeholder="Search media..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="p-6 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
          {filteredMedia.length > 0 ? (
            filteredMedia.map(item => {
              const isVideo = item.type === 'video' || item.url.includes('youtube.com') || item.url.includes('youtu.be') || item.url.includes('vimeo.com') || item.url.endsWith('.mp4') || item.url.endsWith('.webm');
              
              return (
                <div key={item.id} className="group space-y-2">
                  <div className="aspect-square bg-gray-50 rounded-xl border border-[#E5E5E5] overflow-hidden relative">
                    {!isVideo ? (
                      <img src={item.url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    ) : (
                      <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                        <Video className="w-8 h-8 text-white" />
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Play className="w-12 h-12 text-white/80" />
                        </div>
                        <span className="absolute bottom-2 right-2 text-xs text-white bg-black/50 px-2 py-1 rounded">VIDEO</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button 
                        onClick={() => copyToClipboard(item.url)}
                        className="p-2 bg-white rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
                        title="Copy URL"
                      >
                        <Copy className="w-4 h-4" />
                      </button>
                      <a 
                        href={item.url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="p-2 bg-white rounded-lg text-gray-900 hover:bg-gray-100 transition-colors"
                        title="Open Original"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                  <div className="px-1">
                    <h4 className="text-xs font-bold truncate text-[#1A1A1A]">{item.name}</h4>
                    <p className="text-[10px] text-[#999] uppercase font-bold mt-0.5 flex items-center gap-1">
                      {isVideo ? <Video className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                      {item.type || (isVideo ? 'video' : 'image')}
                    </p>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <ImageIcon className="w-8 h-8 text-[#CCC]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">No media found</h3>
              <p className="text-[#666] text-sm mt-1">Upload your first asset to start building your app.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
