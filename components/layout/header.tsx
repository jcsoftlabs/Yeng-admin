'use client';

import { useAuth } from '@/hooks/use-auth';
import { useRouter } from 'next/navigation';
import { Bell, LogOut, User } from 'lucide-react';

export default function Header() {
    const user = useAuth((state) => state.user);
    const logout = useAuth((state) => state.logout);
    const router = useRouter();

    const handleLogout = () => {
        logout();
        router.push('/login');
    };

    return (
        <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
            <div>
                <h2 className="text-xl font-semibold text-gray-900">Tableau de bord</h2>
            </div>

            <div className="flex items-center space-x-4">
                {/* Notifications */}
                <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                </button>

                {/* User Menu */}
                <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                    <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">
                            {user?.firstName} {user?.lastName}
                        </p>
                        <p className="text-xs text-gray-500">{user?.role}</p>
                    </div>
                    <div className="w-10 h-10 bg-gradient-to-br from-violet-600 to-purple-600 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5 text-white" />
                    </div>
                    <button
                        onClick={handleLogout}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        title="Déconnexion"
                    >
                        <LogOut className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>
        </header>
    );
}
