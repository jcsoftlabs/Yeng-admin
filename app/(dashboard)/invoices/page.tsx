'use client';

import { FileText } from 'lucide-react';

export default function InvoicesPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Factures</h1>
                <p className="text-gray-600 mt-1">Consultez toutes les factures</p>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">Aucune facture disponible</p>
                <p className="text-sm text-gray-500">Les factures sont générées automatiquement lors de l'enregistrement des colis</p>
            </div>
        </div>
    );
}
