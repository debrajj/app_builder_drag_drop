import React, { useState } from 'react';
import { useStore } from '../store';
import { Plus, Search, FileText, ChevronRight, Trash2, Globe } from 'lucide-react';
import { toast } from 'sonner';

export function Dashboard({ onEditPage }: { onEditPage: (id: string) => void }) {
  const { pages, createPage, deletePage, fetchMiddlewareData, loading } = useStore();
  const [search, setSearch] = useState('');
  const [isCreating, setIsCreating] = useState(false);
  const [newPageName, setNewPageName] = useState('');

  const filteredPages = (pages || []).filter(p => p.name.toLowerCase().includes(search.toLowerCase()));

  const handleSync = async () => {
    try {
      await fetchMiddlewareData();
      toast.success('Synced data from middleware successfully');
    } catch (e) {
      toast.error('Failed to sync data from middleware');
    }
  };

  const handleCreate = async () => {
    if (!newPageName) return;
    try {
      await createPage(newPageName);
      setNewPageName('');
      setIsCreating(false);
      toast.success('Page created successfully');
    } catch (e) {
      toast.error('Failed to create page');
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        await deletePage(id);
        toast.success('Page deleted');
      } catch (e) {
        toast.error('Failed to delete page');
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold">Pages</h2>
          <p className="text-[#666] text-sm">Manage your mobile app pages and layouts</p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSync}
            disabled={loading}
            className="bg-white border border-[#E5E5E5] text-[#1A1A1A] px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-gray-50 transition-colors disabled:opacity-50"
          >
            <Globe className="w-4 h-4" />
            Sync Middleware
          </button>
          <button 
            onClick={() => setIsCreating(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Create Page
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-[#E5E5E5] overflow-hidden shadow-sm">
        <div className="p-4 border-b border-[#E5E5E5] bg-gray-50 flex items-center gap-3">
          <Search className="w-4 h-4 text-[#999]" />
          <input 
            type="text" 
            placeholder="Search pages..." 
            className="bg-transparent border-none focus:ring-0 text-sm flex-1"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        {isCreating && (
          <div className="p-4 border-b border-[#E5E5E5] flex items-center gap-3 animate-in slide-in-from-top-2">
            <input 
              autoFocus
              type="text" 
              placeholder="Enter page name..." 
              className="flex-1 border border-[#E5E5E5] rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={newPageName}
              onChange={(e) => setNewPageName(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            />
            <button 
              onClick={handleCreate}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium"
            >
              Create
            </button>
            <button 
              onClick={() => setIsCreating(false)}
              className="text-[#666] px-3 py-2 text-sm font-medium hover:bg-gray-100 rounded-lg"
            >
              Cancel
            </button>
          </div>
        )}

        <div className="divide-y divide-[#E5E5E5]">
          {filteredPages.length > 0 ? (
            filteredPages.map(page => (
              <div 
                key={page.id} 
                onClick={() => onEditPage(page.id)}
                className="p-4 flex items-center justify-between hover:bg-gray-50 cursor-pointer transition-colors group"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center text-blue-600">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-[#1A1A1A]">{page.name}</h3>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs text-[#999]">/{page.slug}</span>
                      <span className={`text-[10px] uppercase font-bold px-1.5 py-0.5 rounded ${
                        page.status === 'published' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'
                      }`}>
                        {page.status}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button 
                    onClick={(e) => handleDelete(page.id, e)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                  <ChevronRight className="w-5 h-5 text-[#CCC]" />
                </div>
              </div>
            ))
          ) : (
            <div className="p-12 text-center">
              <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-8 h-8 text-[#CCC]" />
              </div>
              <h3 className="text-lg font-semibold text-[#1A1A1A]">No pages found</h3>
              <p className="text-[#666] text-sm mt-1">Create your first page to start building your mobile app.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
