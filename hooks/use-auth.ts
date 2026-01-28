'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { api } from '@/lib/api';

interface User {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    role: string;
}

interface AuthState {
    user: User | null;
    token: string | null;
    isAuthenticated: boolean;
    login: (email: string, password: string) => Promise<void>;
    logout: () => void;
    setUser: (user: User, token: string) => void;
}

export const useAuth = create<AuthState>()(
    persist(
        (set) => ({
            user: null,
            token: null,
            isAuthenticated: false,

            login: async (email: string, password: string) => {
                const data = await api.login(email, password);
                set({
                    user: data.user,
                    token: data.access_token,
                    isAuthenticated: true,
                });
            },

            logout: () => {
                api.clearToken();
                set({
                    user: null,
                    token: null,
                    isAuthenticated: false,
                });
            },

            setUser: (user: User, token: string) => {
                set({
                    user,
                    token,
                    isAuthenticated: true,
                });
            },
        }),
        {
            name: 'auth-storage',
        }
    )
);
