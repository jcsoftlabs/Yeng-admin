'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Package, Search, Filter, Plus, Eye } from 'lucide-react';
import { formatCurrency, formatDate, getStatusColor } from '@/lib/utils';

interface Parcel {
    id: string;
    trackingNumber: string;
    status: string;
    customer: {
        firstName: string;
        lastName: string;
        customAddress: string;
    };
    totalAmount: number;
    paymentStatus: string;
    createdAt: string;
}

export default function ShipmentsPage() {
    const [parcels, setParcels] = useState<Parcel[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        loadParcels();
    }, [statusFilter]);

    const loadParcels = async () => {
        try {
            const data = await api.getParcels({ status: statusFilter || undefined, search: search || undefined });
            setParcels(data);
        } catch (error) {
            console.error('Error loading parcels:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadParcels();
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des colis</h1>
                    <p className="text-gray-600 mt-1">Gérez tous vos envois</p>
                </div>
                <Link
                    href="/shipments/new"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nouveau colis</span>
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rechercher
                        </label>
                        <div className="flex space-x-2">
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                                placeholder="Numéro de tracking, code client (ex: 4582, PJean), nom..."
                                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleSearch}
                                className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                            >
                                <Search className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Statut
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="PENDING">En attente</option>
                            <option value="IN_TRANSIT_USA">En transit USA</option>
                            <option value="DEPARTED_USA">Parti USA</option>
                            <option value="IN_TRANSIT_HAITI">En transit Haïti</option>
                            <option value="ARRIVED_HAITI">Arrivé Haïti</option>
                            <option value="READY_FOR_PICKUP">Prêt pour récupération</option>
                            <option value="PICKED_UP">Récupéré</option>
                            <option value="CANCELLED">Annulé</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Parcels Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement...</p>
                    </div>
                ) : parcels.length === 0 ? (
                    <div className="p-12 text-center">
                        <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun colis trouvé</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tracking
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Paiement
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Montant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {parcels.map((parcel) => (
                                    <tr key={parcel.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{parcel.trackingNumber}</div>
                                            <div className="text-sm text-gray-500">{parcel.customer.customAddress}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {parcel.customer.firstName} {parcel.customer.lastName}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(parcel.status)}`}>
                                                {parcel.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(parcel.paymentStatus)}`}>
                                                {parcel.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(parcel.totalAmount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(parcel.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                                            <Link
                                                href={`/shipments/${parcel.id}`}
                                                className="text-violet-600 hover:text-violet-900 font-medium inline-flex items-center space-x-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Voir</span>
                                            </Link>
                                        </td>
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
