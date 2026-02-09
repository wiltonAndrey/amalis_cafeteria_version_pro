import React, { useState } from 'react';
import { useProducts } from '../hooks/useProducts';
import ProductCRUD from '../components/admin/ProductCRUD';
import HomeEditor from '../components/admin/editors/HomeEditor';
import FeaturesEditor from '../components/admin/editors/FeaturesEditor';
import PhilosophyEditor from '../components/admin/editors/PhilosophyEditor';
import TestimonialsEditor from '../components/admin/editors/TestimonialsEditor';
import SettingsEditor from '../components/admin/editors/SettingsEditor';

const Admin: React.FC = () => {
  const [activeTab, setActiveTab] = useState('home');
  const { items: products, loading: productsLoading } = useProducts([], { autoRefresh: true });

  const tabs = [
    { id: 'home', label: '🏠 Portada' },
    { id: 'features', label: '🏛️ Pilares' },
    { id: 'philosophy', label: '💡 Filosofía' },
    { id: 'testimonials', label: '💬 Clientes' },
    { id: 'products', label: '☕ Carta' },
    { id: 'settings', label: '⚙️ Global' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-espresso)] text-cream flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-black/20 border-r border-white/5 flex-shrink-0">
        <div className="p-6 border-b border-white/5">
          <h1 className="text-xl font-serif font-bold text-white">Panel de Control</h1>
          <p className="text-xs text-cream/50 mt-1">Amalis Cafetería</p>
        </div>

        <nav className="p-4 space-y-1">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full text-left px-4 py-3 rounded-xl transition-all duration-200 ${activeTab === tab.id
                  ? 'bg-caramel text-white shadow-lg shadow-caramel/20 font-bold'
                  : 'text-cream/60 hover:bg-white/5 hover:text-cream'
                }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 overflow-y-auto h-screen">
        <div className="max-w-5xl mx-auto pb-20">
          <div className="mb-8 flex items-center justify-between">
            <h2 className="text-3xl font-serif font-bold text-white">
              {tabs.find(t => t.id === activeTab)?.label.substring(3)}
            </h2>
            <div className="text-sm text-cream/40 px-3 py-1 bg-white/5 rounded-full">
              Modo Editor
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/5 rounded-3xl p-6 md:p-8 shadow-2xl">
            {activeTab === 'home' && <HomeEditor />}
            {activeTab === 'features' && <FeaturesEditor />}
            {activeTab === 'philosophy' && <PhilosophyEditor />}
            {activeTab === 'testimonials' && <TestimonialsEditor />}
            {activeTab === 'products' && <ProductCRUD products={products} loading={productsLoading} />}
            {activeTab === 'settings' && <SettingsEditor />}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Admin;
