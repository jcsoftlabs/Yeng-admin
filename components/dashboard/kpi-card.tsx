'use client';

import { LucideIcon, TrendingUp, TrendingDown } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { cn } from '@/lib/utils';

interface KPICardProps {
    title: string;
    value: number;
    growth?: number;
    subtitle?: string;
    icon: LucideIcon;
    color: 'violet' | 'green' | 'blue' | 'orange';
    isCurrency?: boolean;
}

const colorClasses = {
    violet: 'from-violet-600 to-purple-600',
    green: 'from-green-600 to-emerald-600',
    blue: 'from-blue-600 to-cyan-600',
    orange: 'from-orange-600 to-amber-600',
};

export default function KPICard({
    title,
    value,
    growth,
    subtitle,
    icon: Icon,
    color,
    isCurrency = false,
}: KPICardProps) {
    const displayValue = isCurrency ? formatCurrency(value) : value.toLocaleString();
    const hasGrowth = growth !== undefined;
    const isPositive = growth && growth > 0;

    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-4">
                <p className="text-sm font-medium text-gray-600">{title}</p>
                <div className={cn('w-12 h-12 rounded-lg flex items-center justify-center bg-gradient-to-br', colorClasses[color])}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>

            <div className="space-y-2">
                <p className="text-3xl font-bold text-gray-900">{displayValue}</p>

                {hasGrowth && (
                    <div className="flex items-center space-x-2">
                        {isPositive ? (
                            <TrendingUp className="w-4 h-4 text-green-600" />
                        ) : (
                            <TrendingDown className="w-4 h-4 text-red-600" />
                        )}
                        <span className={cn('text-sm font-medium', isPositive ? 'text-green-600' : 'text-red-600')}>
                            {Math.abs(growth).toFixed(1)}%
                        </span>
                        <span className="text-sm text-gray-500">vs mois dernier</span>
                    </div>
                )}

                {subtitle && (
                    <p className="text-sm text-gray-600">{subtitle}</p>
                )}
            </div>
        </div>
    );
}
