'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ClipboardPenLine, Eye, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

interface PackageForm {
    id: string;
    fullName: string;
    email: string;
    city: string;
    country: string;
    packageCount: number;
    trackingNumbers: string[];
    source: string;
    createdAt: string;
    customer?: {
        customAddress: string;
    } | null;
}

export default function PackageFormsPage() {
    const [packageForms, setPackageForms] = useState<PackageForm[]>([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadPackageForms();
    }, []);

    const loadPackageForms = async (searchValue?: string) => {
        try {
            const data = await api.getPackageForms(searchValue || undefined);
            setPackageForms(data);
        } catch (error) {
            console.error('Error loading package forms:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Bons clients</h1>
                <p className="mt-1 text-gray-600">Consultez tous les bons de package soumis depuis le site public et le portail client.</p>
            </div>

            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="flex space-x-2">
                    <input
                        type="text"
                        value={search}
                        onChange={(event) => setSearch(event.target.value)}
                        onKeyDown={(event) => event.key === 'Enter' && loadPackageForms(search)}
                        placeholder="Rechercher par nom, email, ville..."
                        className="flex-1 rounded-lg border border-gray-300 px-4 py-2 focus:border-transparent focus:ring-2 focus:ring-violet-500"
                    />
                    <button
                        onClick={() => loadPackageForms(search)}
                        className="rounded-lg bg-violet-600 px-6 py-2 text-white transition-colors hover:bg-violet-700"
                    >
                        <Search className="h-5 w-5" />
                    </button>
                </div>
            </div>

            <div className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                        <p className="text-gray-600">Chargement...</p>
                    </div>
                ) : packageForms.length === 0 ? (
                    <div className="p-12 text-center">
                        <ClipboardPenLine className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                        <p className="text-gray-600">Aucun bon client trouvé</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="border-b border-gray-200 bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Client</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Contact</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Trackings</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Source</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {packageForms.map((packageForm) => (
                                    <tr key={packageForm.id} className="transition-colors hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900">{packageForm.fullName}</div>
                                            <div className="text-sm text-gray-500">{packageForm.customer?.customAddress || `${packageForm.city}, ${packageForm.country}`}</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">{packageForm.email}</td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            <div className="font-medium">{packageForm.trackingNumbers.length} tracking(s)</div>
                                            <div className="text-gray-500">{packageForm.trackingNumbers.slice(0, 2).join(', ')}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${packageForm.source === 'PUBLIC' ? 'bg-orange-100 text-orange-800' : 'bg-violet-100 text-violet-800'}`}>
                                                {packageForm.source === 'PUBLIC' ? 'Site public' : 'Portail client'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{formatDateTime(packageForm.createdAt)}</td>
                                        <td className="px-6 py-4 text-sm">
                                            <Link
                                                href={`/package-forms/${packageForm.id}`}
                                                className="inline-flex items-center gap-1 font-medium text-violet-600 hover:text-violet-900"
                                            >
                                                <Eye className="h-4 w-4" />
                                                <span>Previsualiser</span>
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
