import React, { useState, useEffect } from 'react';
import { usePhilosophy } from '../../../hooks/useCMS';
import { Button } from '../../ui/Button';

const PhilosophyEditor: React.FC = () => {
    const { data: philosophy, updatePhilosophy, loading } = usePhilosophy();
    const [formData, setFormData] = useState(philosophy);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setFormData(philosophy);
    }, [philosophy]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => prev ? ({ ...prev, [name]: value }) : null);
    };

    const handleSave = async () => {
        if (!formData) return;
        setSaving(true);
        await updatePhilosophy(formData);
        setSaving(false);
    };

    if (loading || !formData) return <div>Cargando editor...</div>;

    return (
        <div className="space-y-6">
            <h2 className="text-2xl font-serif text-cream mb-4">Editar Experiencia (Coffee Experience)</h2>
            <div className="grid gap-6">
                <div>
                    <label className="block text-sm font-medium text-cream/70 mb-1">Título Grande</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream focus:border-caramel focus:ring-1 focus:ring-caramel transition-colors"
                    />
                </div>
                <div>
                    <label className="block text-sm font-medium text-cream/70 mb-1">Contenido (HTML/Texto)</label>
                    <textarea
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        rows={6}
                        className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream focus:border-caramel focus:ring-1 focus:ring-caramel transition-colors font-mono text-sm"
                        placeholder="<p>Párrafo 1...</p>"
                    />
                    <p className="text-xs text-cream/40 mt-1">Soporta HTML básico para párrafos y negritas.</p>
                </div>
                <div>
                    <label className="block text-sm font-medium text-cream/70 mb-1">URL Imagen Principal</label>
                    <div className="flex gap-4 items-center">
                        <input
                            type="text"
                            name="image"
                            value={formData.image}
                            onChange={handleChange}
                            className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-cream focus:border-caramel focus:ring-1 focus:ring-caramel transition-colors"
                        />
                        <div className="w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                            <img src={formData.image} alt="Preview" className="w-full h-full object-cover" />
                        </div>
                    </div>
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

export default PhilosophyEditor;
