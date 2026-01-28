'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, User, Mail, Phone, MapPin, Package, Calendar } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate, getStatusColor, getPaymentStatusColor } from '@/lib/utils';

export default function CustomerDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [customer, setCustomer] = useState<any>(null);
    const [parcels, setParcels] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadCustomer();
            loadParcels();
        }
    }, [params.id]);

    const loadCustomer = async () => {
        try {
            const data = await api.getCustomer(params.id as string);
            setCustomer(data);
        } catch (error) {
            console.error('Error loading customer:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadParcels = async () => {
        try {
            const data = await api.getParcels({ customerId: params.id as string });
            setParcels(data);
        } catch (error) {
            console.error('Error loading parcels:', error);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!customer) {
        return (
            <div className="text-center py-12">
                <User className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Client non trouvé</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={() => router.back()}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                        <ArrowLeft className="w-6 h-6 text-gray-600" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">
                            {customer.firstName} {customer.lastName}
                        </h1>
                        <p className="text-gray-600 mt-1">Détails du client</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-violet-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Informations personnelles</h2>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Prénom</p>
                                <p className="font-medium text-gray-900">{customer.firstName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Nom</p>
                                <p className="font-medium text-gray-900">{customer.lastName}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <div className="flex items-center space-x-2">
                                    <Mail className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium text-gray-900">{customer.email}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Téléphone</p>
                                <div className="flex items-center space-x-2">
                                    <Phone className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium text-gray-900">{customer.phone}</p>
                                </div>
                            </div>
                            <div className="col-span-2">
                                <p className="text-sm text-gray-600 mb-1">Date d'inscription</p>
                                <div className="flex items-center space-x-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    <p className="font-medium text-gray-900">{formatDate(customer.createdAt)}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipping Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <MapPin className="w-6 h-6 text-blue-600" />
                            </div>
                            <h2 className="text-xl font-semibold text-gray-900">Adresse d'expédition USA</h2>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Adresse personnalisée</p>
                                <p className="text-lg font-mono font-bold text-violet-600 bg-violet-50 px-4 py-3 rounded-lg">
                                    {customer.customAddress}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Adresse complète</p>
                                <div className="p-4 bg-gray-50 rounded-lg">
                                    <p className="font-medium text-gray-900 whitespace-pre-line">{customer.fullUSAAddress}</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Shipment History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-6">
                            <div className="flex items-center space-x-3">
                                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                    <Package className="w-6 h-6 text-green-600" />
                                </div>
                                <h2 className="text-xl font-semibold text-gray-900">Historique des colis</h2>
                            </div>
                            <Link
                                href={`/shipments/new?customerId=${customer.id}`}
                                className="text-violet-600 hover:text-violet-900 font-medium text-sm"
                            >
                                + Nouveau colis
                            </Link>
                        </div>

                        {parcels.length === 0 ? (
                            <div className="text-center py-8">
                                <Package className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                                <p className="text-gray-600">Aucun colis enregistré</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {parcels.map((parcel) => (
                                    <Link
                                        key={parcel.id}
                                        href={`/shipments/${parcel.id}`}
                                        className="block p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <div className="flex items-center justify-between mb-2">
                                            <span className="font-mono font-semibold text-gray-900">{parcel.trackingNumber}</span>
                                            <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(parcel.status)}`}>
                                                {parcel.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center justify-between text-sm">
                                            <span className="text-gray-600">{parcel.description}</span>
                                            <div className="flex items-center space-x-3">
                                                <span className="font-semibold text-gray-900">{formatCurrency(parcel.totalAmount)}</span>
                                                <span className={`px-2 py-1 text-xs font-semibold rounded-full ${getPaymentStatusColor(parcel.paymentStatus)}`}>
                                                    {parcel.paymentStatus}
                                                </span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Stats */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques</h3>

                        <div className="space-y-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Total colis</p>
                                <p className="text-2xl font-bold text-gray-900">{parcels.length}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Revenus totaux</p>
                                <p className="text-2xl font-bold text-violet-600">
                                    {formatCurrency(parcels.reduce((sum, p) => sum + p.totalAmount, 0))}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Colis en transit</p>
                                <p className="text-2xl font-bold text-blue-600">
                                    {parcels.filter(p => p.status.includes('TRANSIT')).length}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Colis livrés</p>
                                <p className="text-2xl font-bold text-green-600">
                                    {parcels.filter(p => p.status === 'DELIVERED').length}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Haiti Address */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Adresse Haïti</h3>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Adresse</p>
                                <p className="font-medium text-gray-900">{customer.haitiAddress}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Ville</p>
                                <p className="font-medium text-gray-900">{customer.haitiCity}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
