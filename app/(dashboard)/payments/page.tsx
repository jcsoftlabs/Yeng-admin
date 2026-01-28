'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { CreditCard, DollarSign, Search, Package } from 'lucide-react';
import { formatCurrency, formatDateTime } from '@/lib/utils';

interface Parcel {
    id: string;
    trackingNumber: string;
    totalAmount: number;
    paymentStatus: string;
    customer: {
        firstName: string;
        lastName: string;
        customAddress: string;
    };
}

interface Payment {
    id: string;
    amount: number;
    method: string;
    reference: string;
    receivedBy: string;
    createdAt: string;
    parcel: {
        trackingNumber: string;
        customer: {
            firstName: string;
            lastName: string;
        };
    };
}

export default function PaymentsPage() {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
    const [payments, setPayments] = useState<Payment[]>([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        amount: '',
        method: 'CASH',
        reference: '',
        notes: '',
    });

    useEffect(() => {
        loadRecentPayments();
    }, []);

    const loadRecentPayments = async () => {
        try {
            const data = await api.getPayments();
            setPayments(data);
        } catch (error) {
            console.error('Error loading payments:', error);
        }
    };

    const searchParcel = async () => {
        if (!searchTerm.trim()) return;

        setLoading(true);
        try {
            const data = await api.getParcelByTracking(searchTerm);
            setSelectedParcel(data);
        } catch (error: any) {
            alert(error.message || 'Colis non trouvé');
            setSelectedParcel(null);
        } finally {
            setLoading(false);
        }
    };

    const calculateBalance = () => {
        if (!selectedParcel) return 0;
        // This would ideally come from the API with payments included
        return selectedParcel.totalAmount;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedParcel) {
            alert('Veuillez sélectionner un colis');
            return;
        }

        if (!formData.amount || parseFloat(formData.amount) <= 0) {
            alert('Veuillez entrer un montant valide');
            return;
        }

        try {
            const payment = await api.createPayment({
                parcelId: selectedParcel.id,
                amount: parseFloat(formData.amount),
                method: formData.method,
                reference: formData.reference,
                receivedBy: 'Admin', // Would come from auth context
                notes: formData.notes,
            });

            // Show receipt option for cash payments
            if (formData.method === 'CASH') {
                const printReceipt = confirm('Paiement enregistré avec succès!\n\nVoulez-vous imprimer le reçu thermique?');
                if (printReceipt) {
                    // Download and print receipt
                    const link = document.createElement('a');
                    link.href = `${api.baseURL}/payments/${payment.id}/receipt`;
                    link.download = `receipt-${payment.id.substring(0, 8)}.pdf`;
                    link.click();
                }
            } else {
                alert('Paiement enregistré avec succès!');
            }

            setFormData({ amount: '', method: 'CASH', reference: '', notes: '' });
            setSelectedParcel(null);
            setSearchTerm('');
            loadRecentPayments();
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l\'enregistrement du paiement');
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des paiements</h1>
                    <p className="text-gray-600 mt-1">Enregistrez et consultez les paiements</p>
                </div>
            </div>

            {/* Payment Form Card */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Enregistrer un paiement</h3>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Parcel Search */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rechercher un colis
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), searchParcel())}
                                placeholder="Numéro de tracking ou code client..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                            <button
                                type="button"
                                onClick={searchParcel}
                                disabled={loading}
                                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors disabled:opacity-50"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Selected Parcel Info */}
                    {selectedParcel && (
                        <div className="p-4 bg-violet-50 rounded-lg border border-violet-200">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center space-x-3">
                                    <Package className="w-8 h-8 text-violet-600" />
                                    <div>
                                        <p className="font-semibold text-gray-900">{selectedParcel.trackingNumber}</p>
                                        <p className="text-sm text-gray-600">
                                            {selectedParcel.customer.firstName} {selectedParcel.customer.lastName}
                                        </p>
                                        <p className="text-xs text-gray-500">{selectedParcel.customer.customAddress}</p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <p className="text-sm text-gray-600">Montant total</p>
                                    <p className="text-xl font-bold text-gray-900">{formatCurrency(selectedParcel.totalAmount)}</p>
                                    <span className={`text-xs px-2 py-1 rounded-full ${selectedParcel.paymentStatus === 'PAID' ? 'bg-green-100 text-green-800' : selectedParcel.paymentStatus === 'PARTIAL' ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'}`}>
                                        {selectedParcel.paymentStatus}
                                    </span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Montant *
                            </label>
                            <input
                                type="number"
                                step="0.01"
                                value={formData.amount}
                                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                                placeholder="0.00"
                                required
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Méthode de paiement *
                            </label>
                            <select
                                value={formData.method}
                                onChange={(e) => setFormData({ ...formData, method: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                            >
                                <option value="CASH">Cash</option>
                                <option value="MONCASH">MonCash</option>
                                <option value="CARD">Carte</option>
                                <option value="BANK_TRANSFER">Virement bancaire</option>
                            </select>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Référence (optionnel)
                        </label>
                        <input
                            type="text"
                            value={formData.reference}
                            onChange={(e) => setFormData({ ...formData, reference: e.target.value })}
                            placeholder="Numéro de transaction"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Notes (optionnel)
                        </label>
                        <textarea
                            rows={3}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            placeholder="Notes additionnelles..."
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={!selectedParcel}
                        className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-emerald-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <div className="flex items-center justify-center space-x-2">
                            <DollarSign className="w-5 h-5" />
                            <span>Enregistrer le paiement</span>
                        </div>
                    </button>
                </form>
            </div>

            {/* Recent Payments */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Paiements récents</h3>
                {payments.length === 0 ? (
                    <div className="text-center py-12">
                        <CreditCard className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun paiement récent</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tracking</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Client</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Montant</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Méthode</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Référence</th>
                                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {payments.map((payment) => (
                                    <tr key={payment.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{payment.parcel.trackingNumber}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">
                                            {payment.parcel.customer.firstName} {payment.parcel.customer.lastName}
                                        </td>
                                        <td className="px-4 py-3 text-sm font-semibold text-green-600">{formatCurrency(payment.amount)}</td>
                                        <td className="px-4 py-3 text-sm text-gray-600">{payment.method}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{payment.reference || '-'}</td>
                                        <td className="px-4 py-3 text-sm text-gray-500">{formatDateTime(payment.createdAt)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}
