'use client';
import { createContext, useContext, useReducer } from 'react';
import { api } from '@/app/lib/api-client';
import type { User } from '@/app/lib/types';

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
} | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [state, dispatch] = useReducer(reducer, initialState)

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

    return (
        <AuthContext.Provider value={{ state, login, register, logout }}>
            {children}
        </AuthContext.Provider>

    );
}

export const useAuth = () => {
    const ctx = useContext(AuthContext);
    if (!ctx) throw new Error('useAuth fora do AuthProvider');
    return ctx;
};