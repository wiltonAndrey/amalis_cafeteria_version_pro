import React, { useState, useEffect } from 'react';
import { useSettings } from '../../../hooks/useCMS';
import { Button } from '../../ui/Button';

const SettingsEditor: React.FC = () => {
    const { data: settings, updateSettings, loading } = useSettings();
    const [formData, setFormData] = useState(settings);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        setFormData(settings);
    }, [settings]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSocialChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleSave = async () => {
        setSaving(true);
        await updateSettings(formData);
        setSaving(false);
    };

    if (loading) return <div>Cargando editor...</div>;

    return (
        <div className="space-y-8">
            <h2 className="text-2xl font-serif text-cream mb-4">Configuración Global</h2>

            <div className="grid gap-6">
                {/* Identidad */}
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-caramel mb-4">Identidad del Sitio</h3>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-cream/70 mb-1">Nombre del Sitio</label>
                            <input
                                type="text"
                                name="siteName"
                                value={formData.siteName}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cream/70 mb-1">Texto del Footer</label>
                            <textarea
                                name="footerText"
                                value={formData.footerText}
                                onChange={handleChange}
                                rows={2}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cream/70 mb-1">Logo URL</label>
                            <div className="flex gap-4 items-center">
                                <input
                                    type="text"
                                    name="logoUrl"
                                    value={formData.logoUrl}
                                    onChange={handleChange}
                                    className="flex-1 bg-white/5 border border-white/10 rounded-xl p-3 text-cream"
                                />
                                <div className="w-12 h-12 bg-white/10 rounded flex items-center justify-center">
                                    <img src={formData.logoUrl} alt="Logo" className="w-8 h-8 object-contain" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contacto */}
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-caramel mb-4">Contacto y Horarios</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-cream/70 mb-1">Horarios (Lunes - Domingo · 00:00 - 00:00)</label>
                            <input
                                type="text"
                                name="openingHours"
                                value={formData.openingHours}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cream/70 mb-1">Dirección</label>
                            <input
                                type="text"
                                name="address"
                                value={formData.address || ''}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cream/70 mb-1">Teléfono</label>
                            <input
                                type="text"
                                name="phone"
                                value={formData.phone || ''}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cream/70 mb-1">Email</label>
                            <input
                                type="text"
                                name="email"
                                value={formData.email || ''}
                                onChange={handleChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream"
                            />
                        </div>
                    </div>
                </div>

                {/* Redes Sociales */}
                <div className="p-6 bg-white/5 rounded-2xl border border-white/10">
                    <h3 className="text-lg font-bold text-caramel mb-4">Redes Sociales</h3>
                    <div className="grid gap-4">
                        <div>
                            <label className="block text-sm font-medium text-cream/70 mb-1">Instagram URL</label>
                            <input
                                type="text"
                                name="instagram"
                                value={formData.socialLinks?.instagram || ''}
                                onChange={handleSocialChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cream/70 mb-1">Facebook URL</label>
                            <input
                                type="text"
                                name="facebook"
                                value={formData.socialLinks?.facebook || ''}
                                onChange={handleSocialChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-cream/70 mb-1">Twitter URL</label>
                            <input
                                type="text"
                                name="twitter"
                                value={formData.socialLinks?.twitter || ''}
                                onChange={handleSocialChange}
                                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-cream"
                            />
                        </div>
                    </div>
                </div>

                <div className="pt-4 pb-8">
                    <Button variant="honey" onClick={handleSave} disabled={saving}>
                        {saving ? 'Guardando...' : 'Guardar Configuración Global'}
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default SettingsEditor;
