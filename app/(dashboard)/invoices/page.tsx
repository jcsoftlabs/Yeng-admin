'use client';

import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import Link from 'next/link';
import { FileText, Search, Download, Mail, Eye } from 'lucide-react';
import { formatCurrency, formatDate, getPaymentStatusColor } from '@/lib/utils';

interface Invoice {
    id: string;
    invoiceNumber: string;
    createdAt: string;
    parcel: {
        trackingNumber: string;
        totalAmount: number;
        paymentStatus: string;
        customer: {
            firstName: string;
            lastName: string;
            customAddress: string;
        };
    };
}

export default function InvoicesPage() {
    const [invoices, setInvoices] = useState<Invoice[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [statusFilter, setStatusFilter] = useState('');

    useEffect(() => {
        loadInvoices();
    }, [statusFilter]);

    const loadInvoices = async () => {
        try {
            const data = await api.getInvoices({ status: statusFilter || undefined, search: search || undefined });
            setInvoices(data);
        } catch (error) {
            console.error('Error loading invoices:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = () => {
        loadInvoices();
    };

    const handleDownloadPDF = async (id: string, invoiceNumber: string) => {
        try {
            await api.downloadInvoicePDF(id, invoiceNumber);
        } catch (error: any) {
            alert(error.message || 'Erreur lors du téléchargement');
        }
    };

    const handleSendEmail = async (id: string) => {
        if (!confirm('Envoyer la facture par email au client?')) return;

        try {
            await api.sendInvoiceEmail(id);
            alert('Email envoyé avec succès!');
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l\'envoi');
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
                <p className="text-gray-600 mt-1">Gérez toutes les factures</p>
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
                                placeholder="Numéro de facture, tracking..."
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
                            Statut de paiement
                        </label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                        >
                            <option value="">Tous les statuts</option>
                            <option value="PENDING">En attente</option>
                            <option value="PARTIAL">Paiement partiel</option>
                            <option value="PAID">Payé</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Invoices Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                {loading ? (
                    <div className="p-12 text-center">
                        <div className="w-16 h-16 border-4 border-violet-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                        <p className="text-gray-600">Chargement...</p>
                    </div>
                ) : invoices.length === 0 ? (
                    <div className="p-12 text-center">
                        <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-600">Aucune facture trouvée</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50 border-b border-gray-200">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Facture
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Client
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Tracking
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Montant
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Statut
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
                                {invoices.map((invoice) => (
                                    <tr key={invoice.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="font-medium text-gray-900">{invoice.invoiceNumber}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-medium text-gray-900">
                                                {invoice.parcel.customer.firstName} {invoice.parcel.customer.lastName}
                                            </div>
                                            <div className="text-sm text-gray-500">{invoice.parcel.customer.customAddress}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {invoice.parcel.trackingNumber}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {formatCurrency(invoice.parcel.totalAmount)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(invoice.parcel.paymentStatus)}`}>
                                                {invoice.parcel.paymentStatus}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {formatDate(invoice.createdAt)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                                            <Link
                                                href={`/invoices/${invoice.id}`}
                                                className="text-violet-600 hover:text-violet-900 font-medium inline-flex items-center space-x-1"
                                            >
                                                <Eye className="w-4 h-4" />
                                                <span>Voir</span>
                                            </Link>
                                            <button
                                                onClick={() => handleDownloadPDF(invoice.id, invoice.invoiceNumber)}
                                                className="text-blue-600 hover:text-blue-900 font-medium inline-flex items-center space-x-1"
                                            >
                                                <Download className="w-4 h-4" />
                                                <span>PDF</span>
                                            </button>
                                            <button
                                                onClick={() => handleSendEmail(invoice.id)}
                                                className="text-green-600 hover:text-green-900 font-medium inline-flex items-center space-x-1"
                                            >
                                                <Mail className="w-4 h-4" />
                                                <span>Email</span>
                                            </button>
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
