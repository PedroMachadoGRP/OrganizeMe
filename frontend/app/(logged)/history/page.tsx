'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FilterOption } from '../tasks/page';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from '../../components/TaskCard';



export default function page() {
  const [filter, setFilter] = useState<FilterOption>("ALL")
  const [search, setSearch] = useState("");
  const { state: { user, loading: authLoading } } = useAuth();
  const router = useRouter()
  const { tasks, loading, error, create, complete, remove, refresh } = useTasks(filter)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [authLoading, user, router])
  const visibleTasks = useMemo(() => {
    const term = search.trim().toLowerCase()

    if (!term) {
      return tasks
    }

    return tasks.filter((task) =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term)
    )
  }, [tasks, search])
  return (
    <div>
      {visibleTasks.map((task) => (
        <TaskCard
          key={task.id}
          title={task.title}
          description={task.description}
          status={task.status}
          expiredDate={new Date(task.expiresAt).toLocaleDateString('pt-BR')}
          onComplete={() => complete(task.id)}
          onCancel={() => remove(task.id)}
        />
      ))}
    </div>
  )
}
