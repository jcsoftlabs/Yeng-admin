'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { Users, Search, Plus, Eye, Mail, Phone } from 'lucide-react';

interface Customer {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    customAddress: string;
    createdAt: string;
}

export default function CustomersPage() {
    const [customers, setCustomers] = useState<Customer[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');

    useEffect(() => {
        loadCustomers();
    }, []);

    const loadCustomers = async () => {
        try {
            const data = await api.getCustomers(search || undefined);
            setCustomers(data);
        } catch (error) {
            console.error('Error loading customers:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Gestion des clients</h1>
                    <p className="text-gray-600 mt-1">Gérez vos clients</p>
                </div>
                <button className="inline-flex items-center space-x-2 bg-gradient-to-r from-violet-600 to-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:from-violet-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl">
                    <Plus className="w-5 h-5" />
                    <span>Nouveau client</span>
                </button>
            </div>

            {/* Search */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && loadCustomers()}
                        placeholder="Nom, email, adresse personnalisée..."
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                    />
                    <button
                        onClick={loadCustomers}
                        className="px-6 py-2 bg-violet-600 text-white rounded-lg hover:bg-violet-700 transition-colors"
                    >
                        <Search className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* Customers Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {loading ? (
                    <div className="col-span-full p-12 text-center">
                        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement...</p>
                    </div>
                ) : customers.length === 0 ? (
                    <div className="col-span-full p-12 text-center">
                        <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Aucun client trouvé</p>
                    </div>
                ) : (
                    customers.map((customer) => (
                        <div key={customer.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
                            <div className="flex items-start justify-between mb-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                                    <Users className="w-6 h-6 text-white" />
                                </div>
                                <Link
                                    href={`/customers/${customer.id}`}
                                    className="text-violet-600 hover:text-violet-900 font-medium text-sm"
                                >
                                    <Eye className="w-5 h-5" />
                                </Link>
                            </div>

                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                {customer.firstName} {customer.lastName}
                            </h3>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Mail className="w-4 h-4" />
                                    <span>{customer.email}</span>
                                </div>
                                <div className="flex items-center space-x-2 text-sm text-gray-600">
                                    <Phone className="w-4 h-4" />
                                    <span>{customer.phone}</span>
                                </div>
                            </div>

                            <div className="pt-4 border-t border-gray-200">
                                <p className="text-xs text-gray-500 mb-1">Adresse personnalisée</p>
                                <p className="text-sm font-mono font-medium text-violet-600 bg-violet-50 px-3 py-2 rounded-lg">
                                    {customer.customAddress}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
