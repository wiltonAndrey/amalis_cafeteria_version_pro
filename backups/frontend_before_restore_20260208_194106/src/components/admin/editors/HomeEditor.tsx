import React, { useState, useEffect } from 'react';
import { useHero } from '../../../hooks/useCMS';
import { Button } from '../../ui/Button';

const HomeEditor: React.FC = () => {
    const { data: hero, updateHero, loading } = useHero();
    const [formData, setFormData] = useState(hero);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setFormData(hero);
    }, [hero]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        setSaving(true);
        await updateHero(formData);
        setSaving(false);
    };

    if (loading) return <div>Cargando editor...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-cream mb-4">Editar Portada (Hero)</h2>
            <div className="grid gap-6">
                <div>
                    <label className="block text-sm font-medium text-cream/70 mb-1">Título Principal</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream focus:border-caramel focus:ring-1 focus:ring-caramel transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-cream/70 mb-1">Subtítulo</label>
                    <input
                        type="text"
                        name="subtitle"
                        value={formData.subtitle}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream focus:border-caramel focus:ring-1 focus:ring-caramel transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-cream/70 mb-1">Cita / Frase Destacada</label>
                    <input
                        type="text"
                        name="quote"
                        value={formData.quote || ''}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream focus:border-caramel focus:ring-1 focus:ring-caramel transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-cream/70 mb-1">URL Imagen de Fondo</label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            name="backgroundImage"
                            value={formData.backgroundImage}
                            onChange={handleChange}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-cream focus:border-caramel focus:ring-1 focus:ring-caramel transition-colors"
                        />
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                            <img src={formData.backgroundImage} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    </div>
                    <p className="text-xs text-cream/40 mt-1">Recomendado: 1920x1080px (WebP)</p>
                </div>

                <div className="pt-4">
                    <Button variant="honey" onClick={handleSave} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Cambios'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default HomeEditor;
