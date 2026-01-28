'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    LayoutDashboard,
    Package,
    Users,
    CreditCard,
    BarChart3,
    ScanLine,
    FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

const navigation = [
    { name: 'Dashboard', href: '/', icon: LayoutDashboard },
    { name: 'Colis', href: '/shipments', icon: Package },
    { name: 'Clients', href: '/customers', icon: Users },
    { name: 'Paiements', href: '/payments', icon: CreditCard },
    { name: 'Factures', href: '/invoices', icon: FileText },
    { name: 'Scan', href: '/scan', icon: ScanLine },
    { name: 'Rapports', href: '/reports', icon: BarChart3 },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
            {/* Logo */}
            <div className="h-16 flex items-center px-6 border-b border-gray-200">
                <div className="flex items-center space-x-3">
                    <img src="/logo.png" alt="Yeng Shipping" className="w-10 h-10 object-contain" />
                    <div>
                        <h1 className="text-lg font-bold text-gray-900">Yeng Shipping</h1>
                        <p className="text-xs text-gray-500">Admin</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
                {navigation.map((item) => {
                    const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
                    const Icon = item.icon;

                    return (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                                'flex items-center space-x-3 px-4 py-3 rounded-lg transition-all',
                                isActive
                                    ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white shadow-lg'
                                    : 'text-gray-700 hover:bg-gray-100'
                            )}
                        >
                            <Icon className="w-5 h-5" />
                            <span className="font-medium">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 text-center">
                    © 2026 Yeng Shipping
                </p>
            </div>
        </div>
    );
}
