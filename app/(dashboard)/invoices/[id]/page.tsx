'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { api } from '@/lib/api';
import { ArrowLeft, Download, Mail, DollarSign, Package, User, FileText } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDateTime, getPaymentStatusColor } from '@/lib/utils';

export default function InvoiceDetailPage() {
    const params = useParams();
    const router = useRouter();
    const [invoice, setInvoice] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (params.id) {
            loadInvoice();
        }
    }, [params.id]);

    const loadInvoice = async () => {
        try {
            const data = await api.getInvoice(params.id as string);
            setInvoice(data);
        } catch (error) {
            console.error('Error loading invoice:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDownloadPDF = async () => {
        try {
            await api.downloadInvoicePDF(invoice.id, invoice.invoiceNumber);
        } catch (error: any) {
            alert(error.message || 'Erreur lors du téléchargement');
        }
    };

    const handleSendEmail = async () => {
        if (!confirm('Envoyer la facture par email au client?')) return;

        try {
            await api.sendInvoiceEmail(invoice.id);
            alert('Email envoyé avec succès!');
        } catch (error: any) {
            alert(error.message || 'Erreur lors de l\'envoi');
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

    if (!invoice) {
        return (
            <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600">Facture non trouvée</p>
            </div>
        );
    }

    const totalPaid = invoice.parcel.payments.reduce((sum: number, p: any) => sum + p.amount, 0);
    const balance = invoice.parcel.totalAmount - totalPaid;

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
                        <h1 className="text-3xl font-bold text-gray-900">Facture {invoice.invoiceNumber}</h1>
                        <p className="text-gray-600 mt-1">Détails de la facture</p>
                    </div>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={handleDownloadPDF}
                        className="inline-flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        <Download className="w-5 h-5" />
                        <span>Télécharger PDF</span>
                    </button>
                    <button
                        onClick={handleSendEmail}
                        className="inline-flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                        <Mail className="w-5 h-5" />
                        <span>Envoyer par email</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Invoice Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-violet-100 rounded-lg flex items-center justify-center">
                                <FileText className="w-6 h-6 text-violet-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Informations de la facture</h2>
                                <p className="text-sm text-gray-600">Numéro: {invoice.invoiceNumber}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Date de création</p>
                                <p className="font-medium text-gray-900">{formatDateTime(invoice.createdAt)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Statut de paiement</p>
                                <span className={`px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getPaymentStatusColor(invoice.parcel.paymentStatus)}`}>
                                    {invoice.parcel.paymentStatus}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Customer Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <User className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Informations client</h2>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Nom complet</p>
                                <p className="font-medium text-gray-900">
                                    {invoice.parcel.customer.firstName} {invoice.parcel.customer.lastName}
                                </p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Email</p>
                                <p className="font-medium text-gray-900">{invoice.parcel.customer.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Adresse personnalisée</p>
                                <p className="font-mono font-medium text-violet-600 bg-violet-50 px-3 py-2 rounded-lg inline-block">
                                    {invoice.parcel.customer.customAddress}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Parcel Info */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center space-x-3 mb-6">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <Package className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <h2 className="text-xl font-semibold text-gray-900">Détails du colis</h2>
                                <Link
                                    href={`/shipments/${invoice.parcel.id}`}
                                    className="text-sm text-violet-600 hover:text-violet-900"
                                >
                                    {invoice.parcel.trackingNumber}
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Description</p>
                                <p className="font-medium text-gray-900">{invoice.parcel.description}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Poids</p>
                                <p className="font-medium text-gray-900">{invoice.parcel.weight} lbs</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Valeur déclarée</p>
                                <p className="font-medium text-gray-900">{formatCurrency(invoice.parcel.declaredValue)}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-600 mb-1">Statut</p>
                                <p className="font-medium text-gray-900">{invoice.parcel.status}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    {/* Pricing Summary */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Résumé financier</h3>

                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Frais d'expédition</span>
                                <span className="font-medium text-gray-900">{formatCurrency(invoice.parcel.shippingFee)}</span>
                            </div>

                            {invoice.parcel.discount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Réduction</span>
                                    <span className="font-medium text-red-600">-{formatCurrency(invoice.parcel.discount)}</span>
                                </div>
                            )}

                            <div className="flex justify-between">
                                <span className="text-gray-600">Taxes</span>
                                <span className="font-medium text-gray-900">{formatCurrency(invoice.parcel.taxAmount)}</span>
                            </div>

                            <div className="border-t border-gray-200 pt-3">
                                <div className="flex justify-between items-center">
                                    <span className="text-lg font-semibold text-gray-900">Total</span>
                                    <span className="text-2xl font-bold text-gray-900">{formatCurrency(invoice.parcel.totalAmount)}</span>
                                </div>
                            </div>

                            <div className="border-t border-gray-200 pt-3 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Montant payé</span>
                                    <span className="font-medium text-green-600">{formatCurrency(totalPaid)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Solde restant</span>
                                    <span className={`font-bold ${balance > 0 ? 'text-red-600' : 'text-green-600'}`}>
                                        {formatCurrency(balance)}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {balance > 0 && (
                            <Link
                                href="/payments"
                                className="mt-4 w-full inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-green-600 to-emerald-600 text-white px-4 py-3 rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all"
                            >
                                <DollarSign className="w-5 h-5" />
                                <span>Enregistrer un paiement</span>
                            </Link>
                        )}
                    </div>

                    {/* Payment History */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4">Historique des paiements</h3>

                        {invoice.parcel.payments.length === 0 ? (
                            <p className="text-sm text-gray-500 text-center py-4">Aucun paiement enregistré</p>
                        ) : (
                            <div className="space-y-3">
                                {invoice.parcel.payments.map((payment: any) => (
                                    <div key={payment.id} className="p-3 bg-gray-50 rounded-lg">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="font-semibold text-green-600">{formatCurrency(payment.amount)}</span>
                                            <span className="text-xs text-gray-500">{formatDateTime(payment.createdAt)}</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            <p>Méthode: {payment.method}</p>
                                            {payment.reference && <p>Réf: {payment.reference}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
