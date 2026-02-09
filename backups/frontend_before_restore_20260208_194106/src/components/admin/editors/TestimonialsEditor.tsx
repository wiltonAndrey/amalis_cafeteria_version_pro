import React, { useState, useEffect } from 'react';
import { useTestimonials } from '../../../hooks/useCMS';
import { Button } from '../../ui/Button';
import { Testimonial } from '../../../types';

const TestimonialsEditor: React.FC = () => {
    const { data: testimonials, updateTestimonials, loading } = useTestimonials();
    const [formData, setFormData] = useState<Testimonial[]>([]);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setFormData(testimonials);
    }, [testimonials]);

    const handleChange = (index: number, field: keyof Testimonial, value: string) => {
        const newData = [...formData];
        newData[index] = { ...newData[index], [field]: value };
        setFormData(newData);
    };

    const handleDelete = (index: number) => {
        const newData = formData.filter((_, i) => i !== index);
        setFormData(newData);
    };

    const handleAdd = () => {
        const newTestimonial: Testimonial = {
            id: `temp-${Date.now()}`,
            name: 'Nuevo Cliente',
            role: 'Cliente Habitual',
            content: 'Escribe aquí el testimonio...',
            avatarUrl: '/images/testimonials/default.webp'
        };
        setFormData([...formData, newTestimonial]);
    };

    const handleSave = async () => {
        setSaving(true);
        await updateTestimonials(formData);
        setSaving(false);
    };

    if (loading) return <div>Cargando editor...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-serif text-cream">Editar Testimonios</h2>
                <Button variant="honey" size="sm" onClick={handleAdd}>
                    + Añadir Testimonio
                </Button>
            </div>

            <div className="space-y-4">
                {formData.map((t, index) => (
                    <div key={t.id} className="p-6 bg-white/5 rounded-2xl border border-white/10 relative group">
                        <button
                            onClick={() => handleDelete(index)}
                            className="absolute top-4 right-4 text-red-400 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity p-2 text-sm"
                        >
                            Eliminar
                        </button>

                        <div className="grid md:grid-cols-4 gap-4 items-start">
                            <div className="md:col-span-1 flex flex-col items-center gap-2">
                                <div className="w-20 h-20 rounded-full overflow-hidden border border-white/10">
                                    <img src={t.avatarUrl} alt={t.name} className="w-full h-full object-cover" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="URL Avatar"
                                    value={t.avatarUrl}
                                    onChange={(e) => handleChange(index, 'avatarUrl', e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-cream text-xs text-center"
                                />
                            </div>
                            <div className="md:col-span-3 space-y-3">
                                <div className="grid grid-cols-2 gap-4">
                                    <input
                                        type="text"
                                        placeholder="Nombre"
                                        value={t.name}
                                        onChange={(e) => handleChange(index, 'name', e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg p-2 text-cream font-bold"
                                    />
                                    <input
                                        type="text"
                                        placeholder="Rol (ej. Cliente)"
                                        value={t.role}
                                        onChange={(e) => handleChange(index, 'role', e.target.value)}
                                        className="bg-white/5 border border-white/10 rounded-lg p-2 text-cream"
                                    />
                                </div>
                                <textarea
                                    placeholder="Testimonio"
                                    value={t.content}
                                    onChange={(e) => handleChange(index, 'content', e.target.value)}
                                    rows={3}
                                    className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-cream resize-none italic"
                                />
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {formData.length > 0 && (
                <div className="pt-4 border-t border-white/10 sticky bottom-0 bg-[var(--color-espresso)]/95 backdrop-blur-sm p-4 -mx-4 rounded-b-xl border-t-0 shadow-lg z-10 flex justify-end">
                    <Button variant="honey" onClick={handleSave} disabled={saving}>
                        {saving ? 'Guardando...' : `Guardar (${formData.length}) Testimonios`}
                    </Button>
                </div>
            )}
        </div>
    );
};

export default TestimonialsEditor;
