import React from 'react';
import { useCMS } from '../hooks/useCMS';
import ProductCRUD from '../components/admin/ProductCRUD';

const Admin: React.FC = () => {
  const { menuProducts, settings } = useCMS();

  return (
    <div className="min-h-screen bg-[var(--color-espresso)] text-[var(--color-cream)] px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-10">
        <header>
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Panel de Administración</h1>
          <p className="text-cream/60 mt-2">Gestiona carta, SEO y datos de contacto.</p>
        </header>

        <ProductCRUD products={menuProducts} />

        <section className="space-y-4">
          <h3 className="text-2xl font-serif text-cream">SEO y Hero</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.seo.title} />
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.seo.description} />
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.hero.title} />
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.hero.subtitle} />
          </div>
        </section>

        <section className="space-y-4">
          <h3 className="text-2xl font-serif text-cream">Contacto</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.contact.address} />
            <input className="bg-white/5 border border-white/10 rounded-xl p-3" defaultValue={settings.contact.hours} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default Admin;
