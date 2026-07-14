'use client'

import { api } from '@/app/lib/api-client'
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode, } from 'react';

interface User {
    id: string;
    email: string;
}

interface AuthState {
    user: User | null;
    loading: boolean;
}

interface AuthContextValue extends AuthState {
    login: (email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    register: (email: string, password: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
    const [state, setState] = useState<AuthState>({ user: null, loading: true, });

    const fetchMe = useCallback(async () => {
        try {
            const data = await api.get<{ user: User }>('/auth/me');
            setState({ user: data.user, loading: false });
        } catch {
            setState({ user: null, loading: false })
        }
    }, []);

    useEffect(() => {
        fetchMe();
    }, [fetchMe])

    async function login(email: string, password: string) {
        const data = await api.post<{ user: User }>('/auth/login', { email, password });
        setState({ user: data.user, loading: false })
    }

    async function logout() {
        await api.post('/auth/logout', {});
        setState({ user: null, loading: false });
        window.location.href = 'login';
    };

    async function register(email: string, password: string) {
        await api.post('/auth/register', { email, password });
    }

    return (
        <AuthContext.Provider value={{ ...state, login, logout, register }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth deve ser usado dentro do AuthProvider');
    return ctx;
}