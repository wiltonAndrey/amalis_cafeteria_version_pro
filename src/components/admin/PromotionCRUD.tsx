import React, { useMemo, useState } from 'react';
import type { PromotionCard } from '../../types';
import { usePromotionAdmin } from '../../hooks/usePromotionAdmin';
import AdminPromotionModal from './AdminPromotionModal';

const PromotionCRUD: React.FC = () => {
  const { cards, loading, saving, error, updatePromotion } = usePromotionAdmin();
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selectedCard = useMemo(
    () => cards.find((card) => card.id === selectedId) ?? null,
    [cards, selectedId],
  );

  const handleSave = async (input: PromotionCard) => {
    await updatePromotion(input);
    setSelectedId(null);
  };

  return (
    <section className="space-y-6">
      <h3 className="text-2xl font-serif text-cream">Promociones</h3>

      {loading && <p className="text-cream/60 text-sm">Cargando promociones...</p>}
      {!loading && cards.length === 0 && <p className="text-cream/60 text-sm">No hay promociones disponibles.</p>}
      {error && <p className="text-red-300 text-sm">Error: {error}</p>}

      <div className="grid gap-4">
        {cards.map((card) => (
          <article key={card.id} className="p-4 rounded-2xl border border-white/10 bg-white/5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-cream font-semibold">{card.title}</p>
                <p className="text-cream/60 text-sm">{card.description}</p>
              </div>
              <button
                type="button"
                onClick={() => setSelectedId(card.id)}
                className="px-4 py-2 text-xs uppercase tracking-widest text-cream border border-caramel/40 rounded-full"
              >
                Editar promocion
              </button>
            </div>
          </article>
        ))}
      </div>

      <AdminPromotionModal
        open={selectedCard !== null}
        card={selectedCard}
        saving={saving}
        onClose={() => setSelectedId(null)}
        onSave={handleSave}
      />
    </section>
  );
};

export default PromotionCRUD;
