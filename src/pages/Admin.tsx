import React from 'react';
import { Navigate } from 'react-router-dom';
import ProductCRUD from '../components/admin/ProductCRUD';
import PromotionCRUD from '../components/admin/PromotionCRUD';
import { useAdminAuth } from '../hooks/useAdminAuth';
import { useProducts } from '../hooks/useProducts';

const Admin: React.FC = () => {
  const initialProducts = React.useMemo(() => [], []);
  const { loading, isAuthenticated } = useAdminAuth(true);
  const { items, loading: productsLoading } = useProducts(initialProducts, { autoRefresh: true });

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-espresso)] text-[var(--color-cream)] flex items-center justify-center">
        <p className="text-sm uppercase tracking-[0.3em] text-caramel">Verificando sesion...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />;
  }

  return (
    <div className="min-h-screen bg-[var(--color-espresso)] text-[var(--color-cream)] px-6 py-20">
      <div className="max-w-6xl mx-auto space-y-8">
        <header>
          <h1 className="text-4xl md:text-5xl font-serif font-bold">Panel de Administracion</h1>
          <p className="text-cream/60 mt-2">Gestiona la carta de productos en tiempo real.</p>
        </header>
        <ProductCRUD products={items} loading={productsLoading} />
        <PromotionCRUD />
      </div>
    </div>
  );
};

export default Admin;
