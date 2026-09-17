'use client';
import { createContext, useContext, useEffect, useReducer } from 'react';
import { api } from '@/app/lib/api-client';
import type { User, UpdateUserInput, UpdateUserPasswordInput } from '@/app/lib/types';

interface State { user: User | null; loading: boolean }


type Action =
    | { type: 'SET_USER'; payload: User }
    | { type: 'CLEAR_USER' };

const initialState: State = {
    user: null,
    loading: true
}

function reducer(state: State, action: Action): State {
    switch (action.type) {
        case 'SET_USER':
            return {
                ...state,
                user: action.payload,
                loading: false
            };

        case 'CLEAR_USER':
            return {
                ...state,
                user: null,
                loading: false
            };

        default:
            return state
    }
}

const AuthContext = createContext<{
    state: State;
    login: (email: string, password: string) => Promise<void>;
    register: (name: string, email: string, password: string) => Promise<void>;
    logout: () => Promise<void>;
    updateUser: (data: UpdateUserInput) => Promise<void>;
    updateUserPassword: (data: UpdateUserPasswordInput) => Promise<void>;
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

    useEffect(() => {
        let active = true;

        api.get<{ user: User }>('/auth/me')
            .then((data) => {
                if (active) dispatch({ type: 'SET_USER', payload: data.user });
            })
            .catch(() => {
                if (active) dispatch({ type: 'CLEAR_USER' });
            });

        return () => { active = false };
    }, []);

    async function login(email: string, password: string) {
        const { user } = await api.post<{ user: User }>(
            '/auth/login', { email, password }
        );
        dispatch({ type: 'SET_USER', payload: user });
    }

    async function register(name: string, email: string, password: string) {
        const response = await api.post<{ user: User }>(
            "/auth/register",
            { name, email, password }
        );

        dispatch({
            type: "SET_USER",
            payload: response.user,
        });
    }

    async function logout() {
        await api.post('/auth/logout', {});
        dispatch({ type: 'CLEAR_USER' });
        window.location.href = '/login';
    }

    async function updateUser(data: UpdateUserInput) {
        const { user } = await api.put<{ user: User }>('/auth/me', data);
        dispatch({ type: 'SET_USER', payload: user });
    }

    async function updateUserPassword(data: UpdateUserPasswordInput) {
        await api.put('/auth/me/password', data);
    }

    return (
        <AuthContext.Provider value={{ state, login, register, logout, updateUser, updateUserPassword }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth fora do AuthProvider');
    return ctx;
};