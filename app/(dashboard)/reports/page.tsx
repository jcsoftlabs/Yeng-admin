'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { BarChart3, TrendingUp, Users, Package, DollarSign } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip, LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

export default function ReportsPage() {
    const [activeTab, setActiveTab] = useState('overview');
    const [statusData, setStatusData] = useState<any[]>([]);
    const [revenueData, setRevenueData] = useState<any>(null);
    const [customerGrowth, setCustomerGrowth] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadReports();
    }, []);

    const loadReports = async () => {
        try {
            const [status, revenue, growth] = await Promise.all([
                api.request('/reports/status-breakdown'),
                api.request('/reports/revenue'),
                api.request('/reports/customer-growth?months=6'),
            ]);
            setStatusData(status);
            setRevenueData(revenue);
            setCustomerGrowth(growth);
        } catch (error) {
            console.error('Error loading reports:', error);
        } finally {
            setLoading(false);
        }
    };

    const COLORS = ['#8b5cf6', '#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#ec4899', '#14b8a6'];

    const tabs = [
        { id: 'overview', name: 'Vue d\'ensemble', icon: BarChart3 },
        { id: 'revenue', name: 'Revenus', icon: DollarSign },
        { id: 'shipments', name: 'Expéditions', icon: Package },
        { id: 'customers', name: 'Clients', icon: Users },
    ];

    if (loading) {
        return (
            <div className="flex items-center justify-center h-full">
                <div className="text-center">
                    <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                    <p className="text-gray-600">Chargement des rapports...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Rapports et analyses</h1>
                <p className="text-gray-600 mt-1">Analysez vos performances</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-2">
                <div className="flex space-x-2">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex-1 flex items-center justify-center space-x-2 px-4 py-3 rounded-lg font-medium transition-all ${activeTab === tab.id
                                        ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                <Icon className="w-5 h-5" />
                                <span>{tab.name}</span>
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Overview Tab */}
            {activeTab === 'overview' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Répartition par statut</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={statusData}
                                    cx="50%"
                                    cy="50%"
                                    labelLine={false}
                                    label={(entry) => `${entry.status}: ${entry.count}`}
                                    outerRadius={80}
                                    fill="#8884d8"
                                    dataKey="count"
                                >
                                    {statusData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                    ))}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Croissance des clients</h3>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={customerGrowth}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="month" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={2} />
                            </LineChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            )}

            {/* Revenue Tab */}
            {activeTab === 'revenue' && revenueData && (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <p className="text-sm font-medium text-gray-600 mb-2">Revenus totaux</p>
                            <p className="text-3xl font-bold text-gray-900">{formatCurrency(revenueData.totalRevenue)}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <p className="text-sm font-medium text-gray-600 mb-2">Transactions</p>
                            <p className="text-3xl font-bold text-gray-900">{revenueData.transactionCount}</p>
                        </div>
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <p className="text-sm font-medium text-gray-600 mb-2">Montant moyen</p>
                            <p className="text-3xl font-bold text-gray-900">
                                {formatCurrency(revenueData.totalRevenue / revenueData.transactionCount || 0)}
                            </p>
                        </div>
                    </div>

                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Revenus par méthode de paiement</h3>
                        <div className="space-y-3">
                            {revenueData.byMethod.map((method: any) => (
                                <div key={method.method} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                                    <span className="font-medium text-gray-900">{method.method}</span>
                                    <span className="text-lg font-semibold text-violet-600">{formatCurrency(method.total)}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}

            {/* Shipments Tab */}
            {activeTab === 'shipments' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Statistiques d'expédition</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {statusData.map((status, index) => (
                            <div key={status.status} className="p-4 bg-gray-50 rounded-lg border-l-4" style={{ borderColor: COLORS[index % COLORS.length] }}>
                                <p className="text-sm text-gray-600 mb-1">{status.status}</p>
                                <p className="text-2xl font-bold text-gray-900">{status.count}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Customers Tab */}
            {activeTab === 'customers' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Croissance de la clientèle</h3>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={customerGrowth}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="count" stroke="#8b5cf6" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>
            )}
        </div>
    );
}
