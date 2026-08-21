'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FilterOption } from '../tasks/page';
import { useTasks } from '../../hooks/useTasks';
import TaskCard from '../../components/TaskCard';
import HistoryTaskCard from '@/app/components/HistoryTaskCard';



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

    const filtered = term
      ? tasks.filter((task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      )
      : tasks

    return [...filtered]
      .sort(
        (a, b) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      .slice(0, 10)
  }, [tasks, search])
  return (

    <div>
      <section className='bg-[#F7F9F7] dark:bg-black flex justify-center items-start w-full min-h-screen p-10'>
        <div className='bg-white'>
          <HistoryTaskCard tasks={visibleTasks} />
        </div>
      </section>

      <div>
      </div>
    </div>


  )
}
