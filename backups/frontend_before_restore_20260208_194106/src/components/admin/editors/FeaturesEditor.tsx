import React, { useState, useEffect } from 'react';
import { useFeatures } from '../../../hooks/useCMS';
import { Button } from '../../ui/Button';
import { Feature } from '../../../types';

const FeaturesEditor: React.FC = () => {
    const { data: features, updateFeatures, loading } = useFeatures();
    const [formData, setFormData] = useState<Feature[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setFormData(features);
    }, [features]);

    const handleChange = (index: number, field: keyof Feature, value: string | number) => {
        const newFeatures = [...formData];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData(newFeatures);
    };

    const handleSave = async () => {
        setSaving(true);
        await updateFeatures(formData);
        setSaving(false);
    };

    if (loading) return <div>Cargando editor...</div>;

    // Ensure we have 4 features, sort them for display
    const sortedFeatures = [...formData].sort((a, b) => a.sortOrder - b.sortOrder);

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-serif text-cream mb-4">Editar Pilares (Filosofía)</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {sortedFeatures.map((feature, index) => (
                    <div key={feature.id || index} className="p-6 bg-white/5 rounded-2xl border border-white/10">
                        <h3 className="text-lg font-bold text-caramel mb-4">Pilar {feature.sortOrder}</h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-cream/70 mb-1">Título</label>
                                <input
                                    type="text"
                                    value={feature.title}
                                    onChange={(e) => handleChange(index, 'title', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-cream"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-cream/70 mb-1">Descripción</label>
                                <textarea
                                    value={feature.description}
                                    onChange={(e) => handleChange(index, 'description', e.target.value)}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl p-2 text-cream resize-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-cream/70 mb-1">URL Icono/Imagen</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={feature.icon}
                                        onChange={(e) => handleChange(index, 'icon', e.target.value)}
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl p-2 text-cream text-xs"
                                    />
                                    <div className="w-10 h-10 rounded overflow-hidden border border-white/10 bg-black/20">
                                        <img src={feature.icon} alt="icon" className="w-full h-full object-cover" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="pt-4 border-t border-white/10">
                <Button variant="honey" onClick={handleSave} disabled={saving}>
                    {saving ? 'Guardando...' : 'Guardar Todos los Pilares'}
                </Button>
            </div>
        </div>
    );
};

export default FeaturesEditor;
