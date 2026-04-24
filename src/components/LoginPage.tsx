import React, { useState } from 'react';
import { useStore } from '../store';
import { Eye, EyeOff, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

interface LoginPageProps {
  onBack?: () => void;
}

export function LoginPage({ onBack }: LoginPageProps) {
  const { login } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }
    
    setLoading(true);
    try {
      await login(email, password);
      toast.success('Logged in successfully');
    } catch (error: any) {
      toast.error(error.response?.data?.error || 'Invalid credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#181826] flex flex-col items-center justify-center p-4">
      {onBack && (
        <button
          onClick={onBack}
          className="absolute top-6 left-6 text-[#A5A5BA] hover:text-white transition-colors flex items-center gap-2"
        >
          <ArrowLeft size={20} />
          <span>Back to Home</span>
        </button>
      )}
      
      <div className="w-full max-w-[480px] bg-[#212134] rounded-lg shadow-2xl overflow-hidden p-10">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-white px-6 py-3 rounded mb-6">
            <h1 className="text-[#B51F24] text-4xl font-black italic tracking-tighter">Kushal's</h1>
          </div>
          <h2 className="text-white text-3xl font-bold mb-2">Welcome to Strapi!</h2>
          <p className="text-[#A5A5BA] text-sm">Log in to your Strapi account</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-white text-xs font-bold flex items-center gap-1">
              Email<span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-[#32324D] border border-[#4A4A6A] rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4945FF] transition-colors"
              required
            />
          </div>

          <div className="space-y-2">
            <label className="text-white text-xs font-bold flex items-center gap-1">
              Password<span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-[#32324D] border border-[#4A4A6A] rounded-md px-4 py-3 text-white text-sm focus:outline-none focus:border-[#4945FF] transition-colors pr-12"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-[#A5A5BA] hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <label className="flex items-center gap-2 cursor-pointer group">
              <div className={`w-4 h-4 rounded border flex items-center justify-center transition-colors ${rememberMe ? 'bg-[#4945FF] border-[#4945FF]' : 'bg-[#32324D] border-[#4A4A6A] group-hover:border-[#4945FF]'}`}>
                {rememberMe && (
                  <svg width="10" height="8" viewBox="0 0 10 8" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M1 4L3.5 6.5L9 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                )}
              </div>
              <input
                type="checkbox"
                className="hidden"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <span className="text-[#A5A5BA] text-sm">Remember me</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4945FF] hover:bg-[#5E5ADB] disabled:opacity-50 text-white font-bold py-3 rounded-md transition-colors text-sm"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>
      </div>
      
      <button className="mt-8 text-[#4945FF] hover:text-[#5E5ADB] text-sm font-bold transition-colors">
        Forgot your password?
      </button>
    </div>
  );
}
