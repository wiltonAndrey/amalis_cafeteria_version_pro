import React, { useEffect, useMemo, useState } from 'react';
import type { MenuCategoryAdminItem } from '../../types';
import type {
  MenuCategoryCreateInput,
  MenuCategoryReorderItem,
  MenuCategoryUpdateInput,
} from '../../hooks/useMenuCategoriesAdmin';
import { useToast } from '../../context/ToastContext';

interface Props {
  categories: MenuCategoryAdminItem[];
  loading?: boolean;
  saving?: boolean;
  error?: string | null;
  createCategory: (input: MenuCategoryCreateInput) => Promise<MenuCategoryAdminItem>;
  updateCategory: (input: MenuCategoryUpdateInput) => Promise<MenuCategoryAdminItem>;
  reorderCategories: (items: MenuCategoryReorderItem[]) => Promise<MenuCategoryAdminItem[]>;
}

interface CategoryDraft {
  label: string;
  slug: string;
  sort_order: string;
  active: boolean;
  visible_in_menu: boolean;
}

const buildDraft = (item: MenuCategoryAdminItem): CategoryDraft => ({
  label: item.label ?? '',
  slug: String(item.slug ?? item.id ?? ''),
  sort_order: typeof item.sort_order === 'number' ? String(item.sort_order) : '',
  active: item.active !== false,
  visible_in_menu: item.visible_in_menu !== false,
});

const CategoryCRUD: React.FC<Props> = ({
  categories,
  loading = false,
  saving = false,
  error = null,
  createCategory,
  updateCategory,
  reorderCategories,
}) => {
  const { showToast } = useToast();
  const [drafts, setDrafts] = useState<Record<string, CategoryDraft>>({});
  const [newCategory, setNewCategory] = useState<CategoryDraft>({
    label: '',
    slug: '',
    sort_order: '',
    active: true,
    visible_in_menu: true,
  });

  useEffect(() => {
    const nextDrafts: Record<string, CategoryDraft> = {};
    categories.forEach((category) => {
      nextDrafts[String(category.id)] = buildDraft(category);
    });
    setDrafts(nextDrafts);
  }, [categories]);

  const orderedEditableCategories = useMemo(
    () => categories.slice(),
    [categories],
  );

  const updateDraft = (id: string, patch: Partial<CategoryDraft>) => {
    setDrafts((prev) => {
      const current = prev[id] ?? {
        label: '',
        slug: id,
        sort_order: '',
        active: true,
        visible_in_menu: true,
      };

      const next = { ...current, ...patch };
      if (patch.active === false) {
        next.visible_in_menu = false;
      }

      return { ...prev, [id]: next };
    });
  };

  const handleCreate = async (event: React.FormEvent) => {
    event.preventDefault();
    const label = newCategory.label.trim();
    if (!label) {
      showToast('error', 'El nombre de categoría es obligatorio.');
      return;
    }

    try {
      await createCategory({
        label,
        slug: newCategory.slug.trim() || undefined,
        sort_order: newCategory.sort_order.trim() === '' ? undefined : Number(newCategory.sort_order),
        active: newCategory.active,
        visible_in_menu: newCategory.visible_in_menu,
      });

      setNewCategory({
        label: '',
        slug: '',
        sort_order: '',
        active: true,
        visible_in_menu: true,
      });
      showToast('success', 'Categoría creada.');
    } catch (err: any) {
      showToast('error', 'No se pudo crear la categoría.');
    }
  };

  const handleSaveRow = async (item: MenuCategoryAdminItem) => {
    const draft = drafts[String(item.id)];
    if (!draft) return;

    try {
      await updateCategory({
        id: String(item.id),
        label: draft.label.trim(),
        slug: draft.slug.trim(),
        sort_order: draft.sort_order.trim() === '' ? undefined : Number(draft.sort_order),
        active: draft.active,
        visible_in_menu: draft.visible_in_menu,
      });
      showToast('success', 'Categoría actualizada.');
    } catch (_error) {
      showToast('error', 'No se pudo actualizar la categoría.');
    }
  };

  const moveCategory = async (categoryId: string, direction: -1 | 1) => {
    const movable = orderedEditableCategories.filter((item) => item.id !== 'all');
    const currentIndex = movable.findIndex((item) => item.id === categoryId);
    const swapIndex = currentIndex + direction;

    if (currentIndex < 0 || swapIndex < 0 || swapIndex >= movable.length) {
      return;
    }

    const current = movable[currentIndex];
    const target = movable[swapIndex];
    const currentSort = typeof current.sort_order === 'number' ? current.sort_order : currentIndex + 1;
    const targetSort = typeof target.sort_order === 'number' ? target.sort_order : swapIndex + 1;

    try {
      await reorderCategories([
        { id: String(current.id), sort_order: targetSort },
        { id: String(target.id), sort_order: currentSort },
      ]);
      showToast('success', 'Orden de categorías actualizado.');
    } catch (_error) {
      showToast('error', 'No se pudo actualizar el orden.');
    }
  };

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h3 className="text-2xl font-serif text-cream">Categorías</h3>
          <p className="text-sm text-cream/60">
            Crea, ordena y controla visibilidad/estado sin tocar código.
          </p>
        </div>
      </div>

      <form onSubmit={handleCreate} className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-4">
        <div className="grid gap-3 md:grid-cols-4">
          <label className="text-xs uppercase tracking-[0.2em] text-cream/70">
            Nombre
            <input
              value={newCategory.label}
              onChange={(event) => setNewCategory((prev) => ({ ...prev, label: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cream focus:border-caramel/60 focus:outline-none"
              placeholder="Bocadillos"
            />
          </label>
          <label className="text-xs uppercase tracking-[0.2em] text-cream/70">
            Slug
            <input
              value={newCategory.slug}
              onChange={(event) => setNewCategory((prev) => ({ ...prev, slug: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cream focus:border-caramel/60 focus:outline-none"
              placeholder="bocadillos"
            />
          </label>
          <label className="text-xs uppercase tracking-[0.2em] text-cream/70">
            Orden
            <input
              type="number"
              value={newCategory.sort_order}
              onChange={(event) => setNewCategory((prev) => ({ ...prev, sort_order: event.target.value }))}
              className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cream focus:border-caramel/60 focus:outline-none"
              placeholder="10"
            />
          </label>
          <div className="flex items-end gap-3">
            <label className="flex items-center gap-2 text-xs text-cream/70">
              <input
                type="checkbox"
                checked={newCategory.active}
                onChange={(event) => setNewCategory((prev) => ({
                  ...prev,
                  active: event.target.checked,
                  visible_in_menu: event.target.checked ? prev.visible_in_menu : false,
                }))}
                className="accent-caramel"
              />
              Activa
            </label>
            <label className="flex items-center gap-2 text-xs text-cream/70">
              <input
                type="checkbox"
                checked={newCategory.visible_in_menu}
                disabled={!newCategory.active}
                onChange={(event) => setNewCategory((prev) => ({ ...prev, visible_in_menu: event.target.checked }))}
                className="accent-caramel"
              />
              Visible
            </label>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-caramel px-5 py-2 text-xs uppercase tracking-[0.3em] text-brownie transition-all duration-200 hover:bg-honey disabled:opacity-60 cursor-pointer"
          >
            Crear categoría
          </button>
        </div>
      </form>

      {error && (
        <p className="text-sm text-rose-200">
          {error}
        </p>
      )}

      <div className="grid gap-4">
        {loading && (
          <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-cream/60">
            Cargando categorías...
          </div>
        )}

        {!loading && orderedEditableCategories.map((category, index) => {
          const id = String(category.id);
          const draft = drafts[id] ?? buildDraft(category);
          const isSystem = Boolean(category.is_system || category.id === 'all');
          const isBebidas = category.id === 'bebidas';

          return (
            <article key={id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <div className="grid gap-3 md:grid-cols-[1.1fr_1fr_120px_auto] md:items-end">
                <label className="text-xs uppercase tracking-[0.2em] text-cream/60">
                  Nombre
                  <input
                    value={draft.label}
                    disabled={isSystem || saving}
                    onChange={(event) => updateDraft(id, { label: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cream disabled:opacity-60"
                  />
                </label>

                <label className="text-xs uppercase tracking-[0.2em] text-cream/60">
                  Slug
                  <input
                    value={draft.slug}
                    disabled={isSystem || isBebidas || saving}
                    onChange={(event) => updateDraft(id, { slug: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cream disabled:opacity-60"
                  />
                </label>

                <label className="text-xs uppercase tracking-[0.2em] text-cream/60">
                  Orden
                  <input
                    type="number"
                    value={draft.sort_order}
                    disabled={isSystem || saving}
                    onChange={(event) => updateDraft(id, { sort_order: event.target.value })}
                    className="mt-2 w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-cream disabled:opacity-60"
                  />
                </label>

                <div className="flex flex-wrap items-center gap-2 md:justify-end">
                  <button
                    type="button"
                    disabled={isSystem || saving}
                    onClick={() => moveCategory(id, -1)}
                    className="rounded-full border border-white/20 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cream/80 disabled:opacity-40 cursor-pointer"
                  >
                    ↑
                  </button>
                  <button
                    type="button"
                    disabled={isSystem || saving}
                    onClick={() => moveCategory(id, 1)}
                    className="rounded-full border border-white/20 px-3 py-2 text-xs uppercase tracking-[0.2em] text-cream/80 disabled:opacity-40 cursor-pointer"
                  >
                    ↓
                  </button>
                  <button
                    type="button"
                    disabled={isSystem || saving}
                    onClick={() => void handleSaveRow(category)}
                    className="rounded-full border border-caramel/40 px-4 py-2 text-xs uppercase tracking-[0.2em] text-caramel disabled:opacity-40 cursor-pointer"
                  >
                    Guardar
                  </button>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-4 text-xs text-cream/70">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={draft.active}
                      disabled={isSystem || saving}
                      onChange={(event) => updateDraft(id, {
                        active: event.target.checked,
                        visible_in_menu: event.target.checked ? draft.visible_in_menu : false,
                      })}
                      className="accent-caramel"
                    />
                    Activa
                  </label>
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={draft.visible_in_menu}
                      disabled={isSystem || !draft.active || saving}
                      onChange={(event) => updateDraft(id, { visible_in_menu: event.target.checked })}
                      className="accent-caramel"
                    />
                    Visible en carta
                  </label>
                  {isSystem && <span className="rounded-full border border-white/15 px-2 py-1">Sistema</span>}
                  {isBebidas && <span className="rounded-full border border-caramel/30 px-2 py-1">Slug protegido</span>}
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs">
                  {typeof category.product_count_total === 'number' && (
                    <span className="rounded-full border border-white/10 px-2 py-1 text-cream/70">
                      Productos: {category.product_count_total}
                    </span>
                  )}
                  {typeof category.product_count_active === 'number' && (
                    <span className="rounded-full border border-white/10 px-2 py-1 text-cream/70">
                      Activos: {category.product_count_active}
                    </span>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};

export default CategoryCRUD;
