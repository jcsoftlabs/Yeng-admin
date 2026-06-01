'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import NextImage from 'next/image';
import { useParams } from 'next/navigation';
import { ArrowLeft, ClipboardPenLine, Mail, MapPin, Package, User } from 'lucide-react';
import { api } from '@/lib/api';
import { formatDateTime } from '@/lib/utils';

interface PackageFormDetail {
    id: string;
    fullName: string;
    email: string;
    address: string;
    city: string;
    country: string;
    packageCount: number;
    trackingNumbers: string[];
    packageDescription?: string | null;
    notes?: string | null;
    signatureDataUrl: string;
    source: string;
    createdAt: string;
    customer?: {
        firstName: string;
        lastName: string;
        email: string;
        customAddress: string;
        fullUSAAddress?: string | null;
    } | null;
}

export default function PackageFormDetailPage() {
    const params = useParams();
    const [packageForm, setPackageForm] = useState<PackageFormDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!params.id) return;

        const loadPackageForm = async () => {
            try {
                const data = await api.getPackageForm(params.id as string);
                setPackageForm(data);
            } catch (error) {
                console.error('Error loading package form:', error);
            } finally {
                setLoading(false);
            }
        };

        loadPackageForm();
    }, [params.id]);

    if (loading) {
        return (
            <div className="flex h-full items-center justify-center">
                <div className="text-center">
                    <div className="mx-auto mb-4 h-16 w-16 animate-spin rounded-full border-4 border-violet-600 border-t-transparent"></div>
                    <p className="text-gray-600">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!packageForm) {
        return (
            <div className="py-12 text-center">
                <ClipboardPenLine className="mx-auto mb-4 h-16 w-16 text-gray-300" />
                <p className="text-gray-600">Bon client introuvable</p>
                <Link href="/package-forms" className="mt-4 inline-block font-medium text-violet-600 hover:text-violet-900">
                    Retour a la liste
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center space-x-4">
                <Link href="/package-forms" className="rounded-lg p-2 transition-colors hover:bg-gray-100">
                    <ArrowLeft className="h-6 w-6 text-gray-600" />
                </Link>
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Bon client</h1>
                    <p className="mt-1 text-gray-600">Previsualisation du formulaire soumis</p>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-6">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-600 to-purple-600">
                                <User className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Soumission</h3>
                        </div>
                        <div className="space-y-3 text-sm text-gray-700">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Nom complet</p>
                                <p className="font-medium text-gray-900">{packageForm.fullName}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Email</p>
                                <p>{packageForm.email}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Source</p>
                                <p>{packageForm.source === 'PUBLIC' ? 'Site public' : 'Portail client'}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Date</p>
                                <p>{formatDateTime(packageForm.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center gap-3">
                            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-600">
                                <MapPin className="h-5 w-5 text-white" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900">Adresse et contenu</h3>
                        </div>
                        <div className="space-y-3 text-sm text-gray-700">
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Adresse</p>
                                <p className="whitespace-pre-line">{packageForm.address}</p>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500">Ville</p>
                                    <p>{packageForm.city}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500">Pays</p>
                                    <p>{packageForm.country}</p>
                                </div>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Nombre de packages</p>
                                <p>{packageForm.packageCount}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Description</p>
                                <p>{packageForm.packageDescription || 'Aucune description fournie'}</p>
                            </div>
                            <div>
                                <p className="text-xs uppercase tracking-wider text-gray-500">Notes</p>
                                <p>{packageForm.notes || 'Aucune note fournie'}</p>
                            </div>
                        </div>
                    </div>

                    {packageForm.customer ? (
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <div className="mb-4 flex items-center gap-3">
                                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-green-600">
                                    <Mail className="h-5 w-5 text-white" />
                                </div>
                                <h3 className="text-lg font-semibold text-gray-900">Client associe</h3>
                            </div>
                            <div className="space-y-3 text-sm text-gray-700">
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500">Client</p>
                                    <p className="font-medium text-gray-900">{packageForm.customer.firstName} {packageForm.customer.lastName}</p>
                                </div>
                                <div>
                                    <p className="text-xs uppercase tracking-wider text-gray-500">Adresse personnalisee</p>
                                    <p className="rounded-lg bg-violet-50 px-3 py-2 font-mono text-violet-700">{packageForm.customer.customAddress}</p>
                                </div>
                            </div>
                        </div>
                    ) : null}
                </div>

                <div className="rounded-xl border border-gray-200 bg-white shadow-sm">
                    <div className="border-b border-gray-200 bg-gradient-to-r from-violet-600 to-purple-600 px-8 py-6 text-white">
                        <div className="flex items-center justify-between gap-6">
                            <div className="flex items-center gap-4">
                                <div className="rounded-2xl bg-white p-3">
                                    <NextImage src="/logo.png" alt="Yeng Shipping" width={84} height={84} className="h-16 w-auto" />
                                </div>
                                <div>
                                    <p className="text-sm uppercase tracking-[0.28em] text-violet-100">Yeng Shipping</p>
                                    <h2 className="mt-2 text-3xl font-bold">Bon de package client</h2>
                                </div>
                            </div>
                            <div className="rounded-2xl border border-white/20 bg-white/10 px-4 py-3 text-right">
                                <p className="text-xs uppercase tracking-[0.2em] text-violet-100">Soumis le</p>
                                <p className="mt-1 text-sm font-semibold">{formatDateTime(packageForm.createdAt)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-8 p-8">
                        <div className="grid gap-6 md:grid-cols-2">
                            <PreviewBlock label="Nom complet">{packageForm.fullName}</PreviewBlock>
                            <PreviewBlock label="Email">{packageForm.email}</PreviewBlock>
                            <PreviewBlock label="Adresse" fullWidth>{packageForm.address}</PreviewBlock>
                            <PreviewBlock label="Ville">{packageForm.city}</PreviewBlock>
                            <PreviewBlock label="Pays">{packageForm.country}</PreviewBlock>
                            <PreviewBlock label="Nombre de packages">{String(packageForm.packageCount)}</PreviewBlock>
                        </div>

                        <div className="rounded-3xl bg-violet-50 p-6">
                            <div className="mb-4 flex items-center gap-3">
                                <Package className="h-5 w-5 text-violet-600" />
                                <h3 className="text-lg font-semibold text-gray-900">Tracking numbers</h3>
                            </div>
                            <div className="grid gap-3 sm:grid-cols-2">
                                {packageForm.trackingNumbers.map((trackingNumber, index) => (
                                    <div key={`${trackingNumber}-${index}`} className="rounded-2xl border border-violet-100 bg-white px-4 py-3 text-sm font-semibold tracking-wide text-gray-700">
                                        {trackingNumber}
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="grid gap-6 md:grid-cols-2">
                            <PreviewBlock label="Description du package">{packageForm.packageDescription || 'Aucune description fournie'}</PreviewBlock>
                            <PreviewBlock label="Notes complementaires">{packageForm.notes || 'Aucune note fournie'}</PreviewBlock>
                        </div>

                        <div className="border-t border-gray-200 pt-6">
                            <h3 className="mb-4 text-lg font-semibold text-gray-900">Signature client</h3>
                            <div className="rounded-3xl border border-gray-200 bg-gray-50 p-4">
                                <NextImage
                                    src={packageForm.signatureDataUrl}
                                    alt="Signature client"
                                    width={960}
                                    height={220}
                                    className="h-[180px] w-full rounded-2xl object-contain"
                                    unoptimized
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

function PreviewBlock({
    label,
    children,
    fullWidth = false,
}: {
    label: string;
    children: string;
    fullWidth?: boolean;
}) {
    return (
        <div className={fullWidth ? 'md:col-span-2' : ''}>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">{label}</p>
            <div className="mt-2 min-h-16 whitespace-pre-line rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 text-sm leading-6 text-gray-700">
                {children}
            </div>
        </div>
    );
}
