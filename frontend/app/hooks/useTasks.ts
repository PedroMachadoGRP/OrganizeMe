'use client'

import { api } from '@/app/lib/api-client'
import { useCallback, useEffect, useState } from 'react';

export type TaskStatus = 'ACTIVE' | 'COMPLETED' | 'EXPIRED';

export interface Task {
    id: string;
    title: string;
    description: string;
    expiresAt: string;
    status: TaskStatus;
    createdAt: string;
    updatedAt: string;
}

type Filter = TaskStatus | 'ALL';

export function useTasks(filter: Filter = 'ALL') {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const fetchTasks = useCallback(async () => {
        try {
            setLoading(true);
            setError(null);
            const params = filter != 'ALL' ? `?filter=${filter}` : '';
            const data = await api.get<{ task: Task[] }>(`/tasks${params}`)
            setTasks(data.task);
        } catch {
            setError('Erro ao carreagar tarefas');
        } finally {
            setLoading(false);
        }
    }, [filter]);

    useEffect(() => {
        fetchTasks();
    }, [fetchTasks]);

    async function create(data: { title: string, description?: string, expiresAt: string }) {
        const res = await api.post<{ task: Task }>('/tasks', data);
        setTasks((prev) => [res.task, ...prev])
    }
    async function update(id: string, data: Partial<{ title: string; description: string; expiresAt: string }>) {
        const res = await api.put<{ task: Task }>(`/tasks/${id}`, data)
        setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)));
    }
    async function complete(id: string) {
        const res = await api.patch<{ task: Task }>(`/tasks/${id}/complete`, {});
        setTasks((prev) => prev.map((t) => (t.id === id ? res.task : t)))
    }
    async function remove(id: string) {
        await api.delete(`/tasks/${id}`);
        setTasks((prev) => prev.filter((t) => t.id !== id));
    }
    async function getById(id: string): Promise<Task> {
        const res = await api.get<{ task: Task }>(`/tasks/${id}`)
        return res.task
    }

    return {
        tasks, loading, error, create, update, complete, remove, getById, refresh: fetchTasks
    }

}