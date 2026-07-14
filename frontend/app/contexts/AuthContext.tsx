'use client';
import { createContext, useContext, useReducer } from 'react';
import { api } from '@/app/lib/api-client';
import type { User } from '@/app/lib/types';

interface State { user: User | null; loading: boolean }

const AuthContext = createContext<{
    state: State;
    login: (email: string, password: string) => Promise;
    logout: () => Promise;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer({
        user: null, loading: true
    });

    async function login(email: string, password: string) {
        const { user } = await api.post<{ user: User }>(
            '/auth/login', { email, password }
        );
        dispatch({ type: 'SET_USER', payload: user });
    }

    async function logout() {
        await api.post('/auth/logout', {});
        dispatch({ type: 'CLEAR_USER' });
        window.location.href = '/login';
    }

    return (
        <AuthContext.Provider value={{state,login,logout}}>
            {children}
        </AuthContext.Provider>

    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth fora do AuthProvider');
    return ctx;
};