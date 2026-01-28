import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(amount);
}

export function formatDate(date: Date | string): string {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    }).format(new Date(date));
}

export function formatDateTime(date: Date | string): string {
    return new Intl.DateTimeFormat('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    }).format(new Date(date));
}

export function formatWeight(lbs: number): string {
    return `${lbs.toFixed(1)} lbs`;
}

export function getStatusColor(status: string): string {
    const colors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        IN_TRANSIT_USA: 'bg-blue-100 text-blue-800',
        DEPARTED_USA: 'bg-indigo-100 text-indigo-800',
        IN_TRANSIT_HAITI: 'bg-purple-100 text-purple-800',
        ARRIVED_HAITI: 'bg-green-100 text-green-800',
        READY_FOR_PICKUP: 'bg-emerald-100 text-emerald-800',
        PICKED_UP: 'bg-gray-100 text-gray-800',
        CANCELLED: 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}

export function getPaymentStatusColor(status: string): string {
    const colors: Record<string, string> = {
        PENDING: 'bg-yellow-100 text-yellow-800',
        PARTIAL: 'bg-orange-100 text-orange-800',
        PAID: 'bg-green-100 text-green-800',
        REFUNDED: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
}
