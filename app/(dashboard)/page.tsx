'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import KPICard from '@/components/dashboard/kpi-card';
import ShippingVolumeChart from '@/components/dashboard/shipping-volume-chart';
import { Package, DollarSign, Truck, AlertCircle, Plus } from 'lucide-react';
import Link from 'next/link';

interface DashboardStats {
    totalShipments: { value: number; growth: number };
    revenue: { value: number; growth: number };
    activeDeliveries: { value: number; readyForPickup: number };
    pendingTasks: { value: number; urgentIssues: number };
}

export default function DashboardPage() {
    const [stats, setStats] = useState<DashboardStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadDashboardStats();
    }, []);

    const loadDashboardStats = async () => {
        try {
            const data = await api.request('/reports/dashboard');
            setStats(data);
        } catch (error) {
            console.error('Error loading dashboard stats:', error);
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

    return (
        <div className="space-y-6">
            {/* Page Header */}
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Tableau de bord</h1>
                    <p className="text-gray-600 mt-1">Vue d'ensemble de vos expéditions</p>
                </div>
                <Link
                    href="/shipments/new"
                    className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl"
                >
                    <Plus className="w-5 h-5" />
                    <span>Nouveau colis</span>
                </Link>
            </div>

            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <KPICard
                    title="Total Colis"
                    value={stats?.totalShipments.value || 0}
                    growth={stats?.totalShipments.growth || 0}
                    icon={Package}
                    color="violet"
                />
                <KPICard
                    title="Revenus"
                    value={stats?.revenue.value || 0}
                    growth={stats?.revenue.growth || 0}
                    icon={DollarSign}
                    color="green"
                    isCurrency
                />
                <KPICard
                    title="En livraison"
                    value={stats?.activeDeliveries.value || 0}
                    subtitle={`${stats?.activeDeliveries.readyForPickup || 0} prêts`}
                    icon={Truck}
                    color="blue"
                />
                <KPICard
                    title="Tâches en attente"
                    value={stats?.pendingTasks.value || 0}
                    subtitle={`${stats?.pendingTasks.urgentIssues || 0} urgents`}
                    icon={AlertCircle}
                    color="orange"
                />
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <ShippingVolumeChart />

                {/* Quick Actions Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Actions rapides</h3>
                    <div className="space-y-3">
                        <Link
                            href="/shipments/new"
                            className="block p-4 bg-violet-50 hover:bg-violet-100 rounded-lg transition-colors border border-violet-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-violet-600 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Enregistrer un colis</p>
                                    <p className="text-sm text-gray-600">Ajouter un nouveau colis au système</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/scan"
                            className="block p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors border border-blue-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                                    <Package className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Scanner un code-barre</p>
                                    <p className="text-sm text-gray-600">Recherche rapide par code-barre</p>
                                </div>
                            </div>
                        </Link>

                        <Link
                            href="/payments"
                            className="block p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors border border-green-200"
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
                                    <DollarSign className="w-5 h-5 text-white" />
                                </div>
                                <div>
                                    <p className="font-medium text-gray-900">Enregistrer un paiement</p>
                                    <p className="text-sm text-gray-600">Enregistrer un paiement client</p>
                                </div>
                            </div>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
