'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { Package, ArrowLeft, Calculator } from 'lucide-react';
import Link from 'next/link';

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    customAddress: string;
}

export default function NewShipmentPage() {
    const router = useRouter();
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [searchResults, setSearchResults] = useState<Customer[]>([]);
    const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [loading, setLoading] = useState(false);
    const [pricingMode, setPricingMode] = useState<'auto' | 'manual'>('auto');

    const [formData, setFormData] = useState({
        customerId: '',
        barcode: '',
        senderName: '',
        senderAddress: '',
        senderCity: '',
        senderState: '',
        senderZipCode: '',
        description: '',
        weight: '',
        length: '',
        width: '',
        height: '',
        declaredValue: '',
        shippingFee: '',
        discount: '',
        taxAmount: '',
        notes: '',
    });

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await api.getCustomers();
            setCustomers(data);
        } catch (error) {
            console.error('Error loading customers:', error);
        }
    };

    const handleSearchCustomer = async (value: string) => {
        setSearchTerm(value);

        if (value.length < 2) {
            setSearchResults([]);
            setShowResults(false);
            return;
        }

        try {
            const results = await api.searchCustomersByCode(value);
            setSearchResults(results);
            setShowResults(true);
        } catch (error) {
            console.error('Error searching customers:', error);
            setSearchResults([]);
        }
    };

    const handleSelectCustomer = (customer: Customer) => {
        setSelectedCustomer(customer);
        setSearchTerm(`${customer.customAddress} - ${customer.firstName} ${customer.lastName}`);
        setFormData({
            ...formData,
            customerId: customer.id,
            // Auto-fill sender address with warehouse address
            senderName: customer.customAddress,
            senderAddress: '7829 NW 72nd Ave',
            senderCity: 'Miami',
            senderState: 'FL',
            senderZipCode: '33166',
        });
        setShowResults(false);
    };

    const calculateAutoPrice = () => {
        const weight = parseFloat(formData.weight) || 0;
        const declaredValue = parseFloat(formData.declaredValue) || 0;
        const shippingFee = (weight * 3) + (declaredValue * 0.02);
        const taxAmount = shippingFee * 0.10;
        return { shippingFee, discount: 0, taxAmount, total: shippingFee + taxAmount };
    };

    const calculateManualPrice = () => {
        const shippingFee = parseFloat(formData.shippingFee) || 0;
        const discount = parseFloat(formData.discount) || 0;
        const taxAmount = parseFloat(formData.taxAmount) || 0;
        return { shippingFee, discount, taxAmount, total: shippingFee - discount + taxAmount };
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const payload: any = {
                customerId: formData.customerId,
                barcode: formData.barcode || undefined,
                senderName: formData.senderName,
                senderAddress: formData.senderAddress,
                senderCity: formData.senderCity,
                senderState: formData.senderState,
                senderZipCode: formData.senderZipCode,
                description: formData.description,
                weight: parseFloat(formData.weight),
                length: formData.length ? parseFloat(formData.length) : undefined,
                width: formData.width ? parseFloat(formData.width) : undefined,
                height: formData.height ? parseFloat(formData.height) : undefined,
                declaredValue: parseFloat(formData.declaredValue),
                notes: formData.notes || undefined,
            };

            if (pricingMode === 'manual') {
                payload.shippingFee = parseFloat(formData.shippingFee);
                payload.discount = parseFloat(formData.discount) || 0;
                payload.taxAmount = parseFloat(formData.taxAmount) || 0;
            }

            await api.createParcel(payload);
            router.push('/shipments');
        } catch (error: any) {
            alert(error.message || 'Erreur lors de la création du colis');
        } finally {
            setLoading(false);
        }
    };

    const pricing = pricingMode === 'auto' ? calculateAutoPrice() : calculateManualPrice();

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/shipments" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Enregistrer un nouveau colis</h1>
                    <p className="text-gray-600 mt-1">Remplissez les informations du colis</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Customer Selection */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">1. Sélectionner le client</h3>
                    <div className="relative">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rechercher par code ou adresse *
                        </label>
                        <input
                            required
                            type="text"
                            value={searchTerm}
                            onChange={(e) => handleSearchCustomer(e.target.value)}
                            onFocus={() => searchTerm.length >= 2 && setShowResults(true)}
                            placeholder="Ex: 4582, PJean, YENGSHIPPING..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        />

                        {/* Autocomplete Results */}
                        {showResults && searchResults.length > 0 && (
                            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                                {searchResults.map((customer) => (
                                    <button
                                        key={customer.id}
                                        type="button"
                                        onClick={() => handleSelectCustomer(customer)}
                                        className="w-full px-4 py-3 text-left hover:bg-violet-50 transition-colors border-b border-gray-100 last:border-b-0"
                                    >
                                        <div className="font-medium text-gray-900">{customer.customAddress}</div>
                                        <div className="text-sm text-gray-600">{customer.firstName} {customer.lastName}</div>
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Selected Customer USA Address */}
                    {selectedCustomer && (
                        <div className="mt-4 p-4 bg-violet-50 border border-violet-200 rounded-lg">
                            <p className="text-sm font-semibold text-violet-900 mb-2">Adresse de livraison aux USA:</p>
                            <div className="font-mono text-sm text-violet-800 space-y-1">
                                <div className="font-bold">{selectedCustomer.customAddress}</div>
                                <div>7829 NW 72nd Ave</div>
                                <div>Miami, FL 33166</div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Sender Information */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">2. Informations de l'expéditeur (USA)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Nom complet *</label>
                            <input
                                required
                                type="text"
                                value={formData.senderName}
                                onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                            <input
                                required
                                type="text"
                                value={formData.senderAddress}
                                onChange={(e) => setFormData({ ...formData, senderAddress: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Ville *</label>
                            <input
                                required
                                type="text"
                                value={formData.senderCity}
                                onChange={(e) => setFormData({ ...formData, senderCity: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">État *</label>
                            <input
                                required
                                type="text"
                                value={formData.senderState}
                                onChange={(e) => setFormData({ ...formData, senderState: e.target.value })}
                                placeholder="FL"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Code postal *</label>
                            <input
                                required
                                type="text"
                                value={formData.senderZipCode}
                                onChange={(e) => setFormData({ ...formData, senderZipCode: e.target.value })}
                                placeholder="33101"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Package Details */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">3. Détails du colis</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                            <input
                                required
                                type="text"
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                placeholder="Vêtements, électronique, etc."
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Poids (lbs) *</label>
                            <input
                                required
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Valeur déclarée (USD) *</label>
                            <input
                                required
                                type="number"
                                step="0.01"
                                value={formData.declaredValue}
                                onChange={(e) => setFormData({ ...formData, declaredValue: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Code-barre (optionnel)</label>
                            <input
                                type="text"
                                value={formData.barcode}
                                onChange={(e) => setFormData({ ...formData, barcode: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                        </div>
                    </div>
                </div>

                {/* Pricing */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">4. Tarification</h3>

                    <div className="flex space-x-4 mb-6">
                        <button
                            type="button"
                            onClick={() => setPricingMode('auto')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${pricingMode === 'auto'
                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            <Calculator className="w-5 h-5 inline mr-2" />
                            Automatique
                        </button>
                        <button
                            type="button"
                            onClick={() => setPricingMode('manual')}
                            className={`flex-1 py-3 px-4 rounded-lg font-medium transition-all ${pricingMode === 'manual'
                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            Manuel
                        </button>
                    </div>

                    {pricingMode === 'manual' ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Frais d'expédition *</label>
                                <input
                                    required
                                    type="number"
                                    step="0.01"
                                    value={formData.shippingFee}
                                    onChange={(e) => setFormData({ ...formData, shippingFee: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Réduction</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.discount}
                                    onChange={(e) => setFormData({ ...formData, discount: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Taxes</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.taxAmount}
                                    onChange={(e) => setFormData({ ...formData, taxAmount: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                                />
                            </div>
                        </div>
                    ) : (
                        <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                            <p className="text-sm text-violet-800 mb-2">Calcul automatique basé sur:</p>
                            <p className="text-sm text-violet-700">• Poids: {formData.weight || 0} lbs × $3 = ${((parseFloat(formData.weight) || 0) * 3).toFixed(2)}</p>
                            <p className="text-sm text-violet-700">• Valeur: ${formData.declaredValue || 0} × 2% = ${((parseFloat(formData.declaredValue) || 0) * 0.02).toFixed(2)}</p>
                        </div>
                    )}

                    <div className="mt-6 p-6 bg-gray-50 rounded-lg border-2 border-gray-200">
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Frais d'expédition:</span>
                            <span className="font-semibold text-gray-900">${pricing.shippingFee.toFixed(2)}</span>
                        </div>
                        {pricingMode === 'manual' && pricing.discount > 0 && (
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-700">Réduction:</span>
                                <span className="font-semibold text-red-600">-${pricing.discount.toFixed(2)}</span>
                            </div>
                        )}
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-gray-700">Taxes:</span>
                            <span className="font-semibold text-gray-900">${pricing.taxAmount.toFixed(2)}</span>
                        </div>
                        <div className="flex justify-between items-center pt-3 border-t-2 border-gray-300">
                            <span className="text-lg font-semibold text-gray-900">Total:</span>
                            <span className="text-2xl font-bold text-violet-600">${pricing.total.toFixed(2)}</span>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="flex justify-end space-x-4">
                    <Link
                        href="/shipments"
                        className="px-6 py-3 border border-gray-300 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Annuler
                    </Link>
                    <button
                        type="submit"
                        disabled={loading}
                        className="px-6 py-3 bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? 'Enregistrement...' : 'Enregistrer le colis'}
                    </button>
                </div>
            </form>
        </div>
    );
}
