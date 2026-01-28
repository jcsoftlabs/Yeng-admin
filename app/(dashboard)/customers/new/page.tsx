'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, User, Mail, Phone, MapPin, Save } from 'lucide-react';

export default function NewCustomerPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        haitiAddress: '',
        haitiCity: '',
        haitiCountry: 'Haiti',
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const customer = await api.createCustomer(formData);
            alert(`Client créé avec succès!\nAdresse personnalisée: ${customer.customAddress}`);
            router.push(`/customers/${customer.id}`);
        } catch (error: any) {
            alert(error.message || 'Erreur lors de la création du client');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center space-x-4">
                <button
                    onClick={() => router.back()}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </button>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Nouveau client</h1>
                    <p className="text-gray-600 mt-1">Créer un nouveau compte client</p>
                </div>
            </div>

            {/* Form */}
            <div className="max-w-3xl">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-violet-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Prénom *
                                </label>
                                <input
                                    type="text"
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    placeholder="Jean"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Nom *
                                </label>
                                <input
                                    type="text"
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    placeholder="Pierre"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email *
                                </label>
                                <div className="relative">
                                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        placeholder="jean.pierre@example.com"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Téléphone *
                                </label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                                    <input
                                        type="tel"
                                        value={formData.phone}
                                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        required
                                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        placeholder="+509 1234 5678"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Haiti Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Adresse en Haïti</h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Adresse *
                                </label>
                                <input
                                    type="text"
                                    value={formData.haitiAddress}
                                    onChange={(e) => setFormData({ ...formData, haitiAddress: e.target.value })}
                                    required
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                    placeholder="123 Rue Example"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Ville *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.haitiCity}
                                        onChange={(e) => setFormData({ ...formData, haitiCity: e.target.value })}
                                        required
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                        placeholder="Port-au-Prince"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Pays
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.haitiCountry}
                                        disabled
                                        className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Info Box */}
                    <div className="bg-violet-50 border border-violet-200 rounded-lg p-4">
                        <p className="text-sm text-violet-800">
                            <strong>Note:</strong> Une adresse d'expédition personnalisée sera automatiquement générée pour ce client au format: <span className="font-mono">YENGSHIPPING + Initiale + Nom + Code</span>
                        </p>
                    </div>

                    {/* Actions */}
                    <div className="flex space-x-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50"
                        >
                            <Save className="w-5 h-5" />
                            <span>{loading ? 'Création...' : 'Créer le client'}</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Annuler
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
