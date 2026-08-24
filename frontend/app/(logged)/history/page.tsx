'use client'
import React, { useEffect, useMemo, useState } from 'react'
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { FilterOption } from '../tasks/page';
import { useTasks } from '../../hooks/useTasks';
import HistoryTaskCard from '@/app/components/HistoryTaskCard';

const PAGE_SIZE = 10

export default function page() {
  const [filter, setFilter] = useState<FilterOption>("ALL")
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const { state: { user, loading: authLoading } } = useAuth();
  const router = useRouter()
  const { tasks, loading, error, create, complete, remove, refresh,update } = useTasks(filter)

  useEffect(() => {
    if (!authLoading && !user) {
      router.replace('/login')
    }
  }, [authLoading, user, router])

  const sortedTasks = useMemo(() => {
    const term = search.trim().toLowerCase()

    const filtered = term
      ? tasks.filter((task) =>
        task.title.toLowerCase().includes(term) ||
        task.description.toLowerCase().includes(term)
      )
      : tasks

    return [...filtered].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
  }, [tasks, search])

  const totalPages = Math.max(1, Math.ceil(sortedTasks.length / PAGE_SIZE))

  useEffect(() => {
    setPage((current) => Math.min(current, totalPages))
  }, [totalPages])

  const visibleTasks = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return sortedTasks.slice(start, start + PAGE_SIZE)
  }, [sortedTasks, page])

  return (

    <div>
      <section className='bg-[#F7F9F7] dark:bg-black flex justify-center items-start w-full min-h-screen p-6'>
        <div className='bg-white'>
          <HistoryTaskCard
            tasks={visibleTasks}
            page={page}
            totalPages={totalPages}
            onPreviousPage={() => setPage((current) => Math.max(1, current - 1))}
            onNextPage={() => setPage((current) => Math.min(totalPages, current + 1))}
            onUpdate={update}
          />
        </div>
      </section>

      <div>
      </div>
    </div>


  )
}