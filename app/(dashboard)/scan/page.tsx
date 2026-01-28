'use client';

import { useState } from 'react';
import { ScanLine, Search } from 'lucide-react';

export default function ScanPage() {
    const [barcode, setBarcode] = useState('');

    const handleScan = () => {
        if (barcode) {
            // Redirect to parcel details
            window.location.href = `/shipments?search=${barcode}`;
        }
    };

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold text-gray-900">Scanner un code-barre</h1>
                <p className="text-gray-600 mt-1">Recherche rapide par code-barre</p>
            </div>

            <div className="max-w-2xl mx-auto">
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8">
                    <div className="text-center mb-8">
                        <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <ScanLine className="w-12 h-12 text-white" />
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-900 mb-2">Scanner ou entrer le code-barre</h2>
                        <p className="text-gray-600">Entrez le code-barre du colis pour le rechercher</p>
                    </div>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Code-barre
                            </label>
                            <input
                                type="text"
                                value={barcode}
                                onChange={(e) => setBarcode(e.target.value)}
                                onKeyPress={(e) => e.key === 'Enter' && handleScan()}
                                placeholder="Scannez ou entrez le code-barre..."
                                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
                                autoFocus
                            />
                        </div>

                        <button
                            onClick={handleScan}
                            disabled={!barcode}
                            className="w-full bg-gradient-to-r from-blue-600 to-cyan-600 text-white py-3 px-4 rounded-lg font-medium hover:from-blue-700 hover:to-cyan-700 transition-all shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            <div className="flex items-center justify-center space-x-2">
                                <Search className="w-5 h-5" />
                                <span>Rechercher</span>
                            </div>
                        </button>
                    </div>

                    <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
                        <p className="text-sm text-blue-800">
                            <strong>Astuce:</strong> Utilisez un lecteur de code-barre USB pour scanner automatiquement
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
