import React, { useMemo } from 'react'
import { Task } from '../hooks/useTasks'

type SummaryCardsGroupProps = {
    tasks: Task[]
}

function isToday(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()

    return (
        date.getFullYear() === now.getFullYear() &&
        date.getMonth() === now.getMonth() &&
        date.getDate() === now.getDate()
    )
}

export default function SummaryCardsGroup({ tasks }: SummaryCardsGroupProps) {
    const { total, inProgress, dueToday } = useMemo(() => {
        return {
            total: tasks.length,
            inProgress: tasks.filter((t) => t.status === 'IN_PROGRESS').length,
            dueToday: tasks.filter(
                (t) => t.status === 'IN_PROGRESS' && isToday(t.expiresAt)
            ).length,
        }
    }, [tasks])

    return (
        <div className="flex gap-5">
            <section className="flex-1 flex flex-col p-2 border-2 w-25 h-17 border-[#F0F2F3] dark:border-neutral-600 bg-[#F6F9F9] dark:bg-neutral-800  rounded-2xl">
                <h2 className="text-neutral-900 dark:text-neutral-300 text-lg font-semibold">
                    {String(total).padStart(2, '0')}
                </h2>
                <h3 className="text-neutral-700 dark:text-neutral-200 text-xs">Tarefas totais</h3>
            </section>

            <section className="flex-1 flex flex-col p-2 w-25 h-17 border-2 border-[#F0F2F3] dark:border-neutral-600 bg-[#F6F9F9] dark:bg-neutral-800 rounded-2xl">
                <h2 className="text-neutral-900 dark:text-neutral-300 text-lg font-semibold">
                    {String(inProgress).padStart(2, '0')}
                </h2>
                <h3 className="text-neutral-700 dark:text-neutral-200 text-xs">Em progresso</h3>
            </section>

            <section className="flex-1 flex flex-col p-2 w-25 h-17 border-2 border-[#F0F2F3] dark:border-neutral-600 bg-[#F6F9F9] dark:bg-neutral-800 rounded-2xl">
                <h2 className="text-neutral-900  dark:text-neutral-300 text-lg font-semibold">
                    {String(dueToday).padStart(2, '0')}
                </h2>
                <h3 className="text-neutral-700 dark:text-neutral-200 text-xs">Terminam hoje</h3>
            </section>
        </div>
    )
}