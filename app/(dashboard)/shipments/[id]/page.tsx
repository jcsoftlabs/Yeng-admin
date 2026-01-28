'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Package, User, MapPin, DollarSign, Calendar } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDateTime, getStatusColor, getPaymentStatusColor } from '@/lib/utils';

export default function ShipmentDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [parcel, setParcel] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadParcel();
        }
    }, [params.id]);

    const loadParcel = async () => {
        try {
            const data = await api.getParcel(params.id as string);
            setParcel(data);
        } catch (error) {
            console.error('Error loading parcel:', error);
        } finally {
            setLoading(false);
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

    if (!parcel) {
        return (
            <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Colis non trouvé</p>
                <Link href="/shipments" className="text-violet-600 hover:text-violet-900 font-medium mt-4 inline-block">
                    Retour à la liste
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/shipments" className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                    <ArrowLeft className="w-6 h-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">{parcel.trackingNumber}</h1>
                    <p className="text-gray-600 mt-1">Détails du colis</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Status */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Statut</h3>
                        <div className="flex items-center justify-between">
                            <span className={`px-4 py-2 inline-flex text-sm font-semibold rounded-full ${getStatusColor(parcel.status)}`}>
                                {parcel.status}
                            </span>
                            {parcel.currentLocation && (
                                <div className="flex items-center space-x-2 text-gray-600">
                                    <MapPin className="w-5 h-5" />
                                    <span>{parcel.currentLocation}</span>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Package Details */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Détails du colis</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Description</p>
                                <p className="font-medium text-gray-900">{parcel.description}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Poids</p>
                                <p className="font-medium text-gray-900">{parcel.weight} lbs</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Valeur déclarée</p>
                                <p className="font-medium text-gray-900">{formatCurrency(parcel.declaredValue)}</p>
                            </div>
                            {parcel.barcode && (
                                <div>
                                    <p className="text-sm text-gray-500">Code-barre</p>
                                    <p className="font-mono font-medium text-gray-900">{parcel.barcode}</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Sender Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Expéditeur (USA)</h3>
                        <div className="space-y-2">
                            <p className="font-medium text-gray-900">{parcel.senderName}</p>
                            <p className="text-gray-600">{parcel.senderAddress}</p>
                            <p className="text-gray-600">
                                {parcel.senderCity}, {parcel.senderState} {parcel.senderZipCode}
                            </p>
                        </div>
                    </div>

                    {/* Tracking History */}
                    {parcel.trackingEvents && parcel.trackingEvents.length > 0 && (
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique de suivi</h3>
                            <div className="space-y-4">
                                {parcel.trackingEvents.map((event: any, index: number) => (
                                    <div key={event.id} className="flex space-x-4">
                                        <div className="flex flex-col items-center">
                                            <div className="w-3 h-3 bg-violet-600 rounded-full"></div>
                                            {index < parcel.trackingEvents.length - 1 && (
                                                <div className="w-0.5 h-full bg-gray-300 mt-1"></div>
                                            )}
                                        </div>
                                        <div className="flex-1 pb-4">
                                            <p className="font-medium text-gray-900">{event.description}</p>
                                            <p className="text-sm text-gray-600">{event.location}</p>
                                            <p className="text-xs text-gray-500 mt-1">{formatDateTime(event.timestamp)}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Customer */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Client</h3>
                        </div>
                        <div className="space-y-2">
                            <p className="font-medium text-gray-900">
                                {parcel.customer.firstName} {parcel.customer.lastName}
                            </p>
                            <p className="text-sm text-gray-600">{parcel.customer.email}</p>
                            <div className="pt-3 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Adresse personnalisée</p>
                                <p className="text-sm font-mono font-medium text-violet-600 bg-violet-50 px-3 py-2 rounded-lg">
                                    {parcel.customer.customAddress}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Financial */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-emerald-600 rounded-full flex items-center justify-center">
                                <DollarSign className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Finances</h3>
                        </div>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Frais d'expédition</span>
                                <span className="font-medium">{formatCurrency(parcel.shippingFee)}</span>
                            </div>
                            {parcel.discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Réduction</span>
                                    <span className="font-medium text-red-600">-{formatCurrency(parcel.discount)}</span>
                                </div>
                            )}
                            <div className="flex justify-between">
                                <span className="text-gray-600">Taxes</span>
                                <span className="font-medium">{formatCurrency(parcel.taxAmount)}</span>
                            </div>
                            <div className="flex justify-between pt-3 border-t-2 border-gray-300">
                                <span className="font-semibold text-gray-900">Total</span>
                                <span className="font-bold text-violet-600">{formatCurrency(parcel.totalAmount)}</span>
                            </div>
                            <div className="pt-3 border-t border-gray-200">
                                <span className={`px-3 py-1 inline-flex text-xs font-semibold rounded-full ${getPaymentStatusColor(parcel.paymentStatus)}`}>
                                    {parcel.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Dates */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center">
                                <Calendar className="w-5 h-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Dates</h3>
                        </div>
                        <div className="space-y-2">
                            <div>
                                <p className="text-xs text-gray-500">Créé le</p>
                                <p className="text-sm font-medium text-gray-900">{formatDateTime(parcel.createdAt)}</p>
                            </div>
                            {parcel.estimatedArrival && (
                                <div>
                                    <p className="text-xs text-gray-500">Arrivée estimée</p>
                                    <p className="text-sm font-medium text-gray-900">{formatDateTime(parcel.estimatedArrival)}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
