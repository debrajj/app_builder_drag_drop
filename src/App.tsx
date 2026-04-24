/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useEffect, useState } from 'react';
import { useStore } from './store';
import { 
  LayoutDashboard, 
  Settings, 
  Palette, 
  Store as StoreIcon, 
  Image as ImageIcon, 
  Smartphone, 
  Plus, 
  Trash2, 
  ChevronRight, 
  Save, 
  Eye, 
  FileJson,
  Menu,
  X,
  Layers,
  Box,
  Type,
  Navigation as NavIcon,
  Filter,
  CheckCircle2,
  Circle,
  Copy,
  ArrowUp,
  ArrowDown,
  ExternalLink,
  Search,
  Upload,
  Palette as ColorIcon,
  LogOut
} from 'lucide-react';
import { Toaster, toast } from 'sonner';
import { PageEditor } from './components/PageEditor';
import { GlobalSettingsEditor } from './components/GlobalSettingsEditor';
import { GlobalStylesEditor } from './components/GlobalStylesEditor';
import { StoreManager } from './components/StoreManager';
import { ProductColorManager } from './components/ProductColorManager';
import { MediaLibrary } from './components/MediaLibrary';
import { Dashboard } from './components/Dashboard';
import { LoginPage } from './components/LoginPage';
import { LandingPage } from './components/LandingPage';

type Module = 'dashboard' | 'editor' | 'settings' | 'styles' | 'stores' | 'colors' | 'media';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [selectedPageId, setSelectedPageId] = useState<string | null>(null);
  const [showLogin, setShowLogin] = useState(false);
  const { 
    isAuthenticated, 
    user, 
    checkAuth, 
    logout,
    fetchPages, 
    fetchGlobalSettings, 
    fetchGlobalStyles, 
    fetchStores, 
    fetchProductColors, 
    fetchMedia 
  } = useStore();
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    checkAuth().finally(() => setAuthChecked(true));
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      fetchPages();
      fetchGlobalSettings();
      fetchGlobalStyles();
      fetchStores();
      fetchProductColors();
      fetchMedia();
    }
  }, [isAuthenticated]);

  const handleLogout = () => {
    logout();
    setShowLogin(false);
    toast.success('Logged out successfully');
  };

  if (!authChecked) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#181826]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  // Show landing page if not authenticated
  if (!isAuthenticated) {
    if (showLogin) {
      return <LoginPage onBack={() => setShowLogin(false)} />;
    }
    return <LandingPage onGetStarted={() => setShowLogin(true)} />;
  }
  
  // If authenticated but wants to see landing page, show logout option
  const handleBackToLanding = () => {
    if (window.confirm('Logout and return to landing page?')) {
      handleLogout();
    }
  };

  const navigateToEditor = (pageId: string) => {
    setSelectedPageId(pageId);
    setActiveModule('editor');
  };

  const renderModule = () => {
    switch (activeModule) {
      case 'dashboard':
        return <Dashboard onEditPage={navigateToEditor} />;
      case 'editor':
        return selectedPageId ? <PageEditor pageId={selectedPageId} onBack={() => setActiveModule('dashboard')} /> : <Dashboard onEditPage={navigateToEditor} />;
      case 'settings':
        return <GlobalSettingsEditor />;
      case 'styles':
        return <GlobalStylesEditor />;
      case 'stores':
        return <StoreManager />;
      case 'colors':
        return <ProductColorManager />;
      case 'media':
        return <MediaLibrary />;
      default:
        return <Dashboard onEditPage={navigateToEditor} />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F9F9F9] text-[#1A1A1A] font-sans overflow-hidden">
      <Toaster position="top-right" />
      
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-[#E5E5E5] flex flex-col shrink-0">
        <div className="p-6 border-bottom border-[#E5E5E5]">
          <h1 className="text-xl font-bold tracking-tight flex items-center gap-2 cursor-pointer hover:text-blue-600 transition-colors" onClick={handleBackToLanding} title="Back to Landing Page">
            <Smartphone className="w-6 h-6 text-blue-600" />
            AppBuilder
          </h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
          <SidebarItem 
            icon={<LayoutDashboard className="w-5 h-5" />} 
            label="Dashboard" 
            active={activeModule === 'dashboard'} 
            onClick={() => setActiveModule('dashboard')} 
          />
          <SidebarItem 
            icon={<Palette className="w-5 h-5" />} 
            label="Global Styles" 
            active={activeModule === 'styles'} 
            onClick={() => setActiveModule('styles')} 
          />
          <SidebarItem 
            icon={<Settings className="w-5 h-5" />} 
            label="Global Settings" 
            active={activeModule === 'settings'} 
            onClick={() => setActiveModule('settings')} 
          />
          <div className="pt-4 pb-2 px-3 text-[10px] font-bold text-[#999] uppercase tracking-wider">Management</div>
          <SidebarItem 
            icon={<StoreIcon className="w-5 h-5" />} 
            label="Store Manager" 
            active={activeModule === 'stores'} 
            onClick={() => setActiveModule('stores')} 
          />
          <SidebarItem 
            icon={<ColorIcon className="w-5 h-5" />} 
            label="Product Colors" 
            active={activeModule === 'colors'} 
            onClick={() => setActiveModule('colors')} 
          />
          <SidebarItem 
            icon={<ImageIcon className="w-5 h-5" />} 
            label="Media Library" 
            active={activeModule === 'media'} 
            onClick={() => setActiveModule('media')} 
          />
        </nav>
        
        <div className="p-4 border-t border-[#E5E5E5] space-y-4">
          <div className="text-xs text-[#999] flex items-center gap-2">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            Connected to Middleware
          </div>
          <div className="flex items-center justify-between">
            <div className="text-xs text-[#666]">
              <div className="font-medium">{user?.name}</div>
              <div className="text-[10px] text-[#999]">{user?.email}</div>
            </div>
            <button
              onClick={handleLogout}
              className="p-2 text-[#999] hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Logout"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden relative">
        {renderModule()}
      </main>
    </div>
  );
}

function SidebarItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active: boolean, onClick: () => void }) {
  return (
    <button 
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
        active 
          ? 'bg-blue-50 text-blue-600' 
          : 'text-[#666] hover:bg-gray-50 hover:text-[#1A1A1A]'
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
