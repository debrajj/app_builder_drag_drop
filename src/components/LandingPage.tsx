import React from 'react';
import { Smartphone, Zap, Shield, Users, ArrowRight, CheckCircle } from 'lucide-react';

interface LandingPageProps {
  onGetStarted: () => void;
}

export function LandingPage({ onGetStarted }: LandingPageProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-200 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Smartphone className="w-8 h-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">AppBuilder</h1>
          </div>
          <button
            onClick={onGetStarted}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2"
          >
            Get Started
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Build Mobile Apps Faster
          </div>
          
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Create Beautiful Mobile Apps
            <br />
            <span className="text-blue-600">Without Writing Code</span>
          </h2>
          
          <p className="text-xl text-gray-600 mb-10 max-w-2xl mx-auto">
            Design, customize, and deploy mobile app pages with our intuitive visual builder. 
            Perfect for stores, catalogs, and content-rich applications.
          </p>
          
          <div className="flex items-center justify-center gap-4">
            <button
              onClick={onGetStarted}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors flex items-center gap-2 shadow-lg shadow-blue-600/30"
            >
              Start Building Now
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Hero Image Placeholder */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl shadow-2xl p-8 max-w-5xl mx-auto">
              <div className="bg-white rounded-lg p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="bg-gray-100 rounded-lg h-32"></div>
                  <div className="bg-gray-100 rounded-lg h-32"></div>
                  <div className="bg-gray-100 rounded-lg h-32"></div>
                  <div className="bg-gray-100 rounded-lg h-24 col-span-2"></div>
                  <div className="bg-gray-100 rounded-lg h-24"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything You Need to Build Apps
            </h3>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Powerful features designed to help you create stunning mobile experiences
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Smartphone className="w-8 h-8 text-blue-600" />}
              title="Visual Page Builder"
              description="Drag and drop components to create beautiful mobile pages. No coding required."
            />
            <FeatureCard
              icon={<Zap className="w-8 h-8 text-purple-600" />}
              title="Real-time Preview"
              description="See your changes instantly with our mobile preview. What you see is what you get."
            />
            <FeatureCard
              icon={<Shield className="w-8 h-8 text-green-600" />}
              title="Secure & Isolated"
              description="Your data is protected with authentication and customer-specific isolation."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8 text-orange-600" />}
              title="Multi-Customer Support"
              description="Manage multiple customers with separate data and permissions."
            />
            <FeatureCard
              icon={<CheckCircle className="w-8 h-8 text-teal-600" />}
              title="Ready-to-Use Components"
              description="Choose from dozens of pre-built components for stores, products, and more."
            />
            <FeatureCard
              icon={<ArrowRight className="w-8 h-8 text-pink-600" />}
              title="Easy Deployment"
              description="Deploy your app with a single click. We handle the infrastructure."
            />
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6 bg-gradient-to-br from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h3 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to Build Your App?
          </h3>
          <p className="text-xl text-blue-100 mb-10">
            Join thousands of developers building amazing mobile experiences
          </p>
          <button
            onClick={onGetStarted}
            className="bg-white hover:bg-gray-100 text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-flex items-center gap-2 shadow-xl"
          >
            Get Started for Free
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 bg-gray-900 text-gray-400 text-center">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Smartphone className="w-6 h-6 text-blue-500" />
            <span className="text-lg font-bold text-white">AppBuilder</span>
          </div>
          <p className="text-sm">
            © 2024 AppBuilder. Build beautiful mobile apps without code.
          </p>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-6 hover:shadow-lg transition-shadow">
      <div className="mb-4">{icon}</div>
      <h4 className="text-xl font-bold text-gray-900 mb-2">{title}</h4>
      <p className="text-gray-600">{description}</p>
    </div>
  );
}
