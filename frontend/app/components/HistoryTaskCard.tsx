import React from 'react'
import { Task, TaskStatus } from '../hooks/useTasks'
import { ChevronLeft, ChevronRight, EllipsisVertical } from 'lucide-react'

type HistoryTaskCardProps = {
    tasks: Task[]
    page: number
    totalPages: number
    onPreviousPage: () => void
    onNextPage: () => void
}

const STATUS_LABELS: Record<TaskStatus, string> = {
    IN_PROGRESS: 'Em Andamento',
    COMPLETED: 'Concluída',
    CANCELLED: 'Cancelada',
    EXPIRED: 'Expirada',
}

const STATUS_STYLES: Record<TaskStatus, string> = {
    EXPIRED: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
    IN_PROGRESS: "bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100",
    COMPLETED: "bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100",
    CANCELLED: "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100",
}

const ROW_GRID =
    'grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center gap-30 px-4 py-3'

export default function HistoryTaskCard({
    tasks,
    page,
    totalPages,
    onPreviousPage,
    onNextPage,
}: HistoryTaskCardProps) {
    const isFirstPage = page <= 1
    const isLastPage = page >= totalPages

    return (
        <div className="flex flex-col p-5 w-full divide-y divide-gray-50 dark:divide-neutral-800 text-black dark:bg-neutral-900  ">
            <header className={`${ROW_GRID} font-semibold dark:text-neutral-100 dark:bg-neutral-900 `}>
                <section className="min-w-0">Nome da tarefa</section>
                <section className="min-w-0">Descrição da tarefa</section>
                <section className="min-w-0">Prazo</section>
                <section className="min-w-0">Status</section>
                <section className="min-w-0 flex justify-center">Opções</section>
            </header>

            {tasks.length === 0 ? (
                <p className="px-4 py-6 text-center text-neutral-500">
                    Nenhuma tarefa registrada
                </p>
            ) : (
                tasks.map((task) => (
                    <main key={task.id} className={`${ROW_GRID} bg-[#f8f7f7] dark:bg-neutral-900 dark:text-neutral-100`} >
                        <section className="min-w-0 truncate" title={task.title}>
                            {task.title}
                        </section>
                        <section className="min-w-0 truncate" title={task.description}>
                            {task.description}
                        </section>
                        <section className="min-w-0 truncate">
                            {new Date(task.expiresAt).toLocaleDateString('pt-BR')}
                        </section>
                        <section className="min-w-0">
                            <span
                                className={`inline-block truncate rounded-2xl px-2 py-0.5 text-xs font-medium ${STATUS_STYLES[task.status]}`}
                            >
                                {STATUS_LABELS[task.status]}
                            </span>
                        </section>

                        <section className="min-w-0 flex justify-center">
                            <button className="rounded-md p-1 hover:cursor-pointer ">
                                <EllipsisVertical strokeWidth={0.5} />
                            </button>
                        </section>
                    </main>
                ))
            )}

            <section className='flex flex-row items-center self-center gap-5 p-0.5 dark:text-neutral-100'>
                <button
                    onClick={onPreviousPage}
                    disabled={isFirstPage}
                    className='hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30'
                >
                    <ChevronLeft />
                </button>
                <h2>Página {page}</h2>
                <button
                    onClick={onNextPage}
                    disabled={isLastPage}
                    className='hover:cursor-pointer disabled:cursor-not-allowed disabled:opacity-30'
                >
                    <ChevronRight />
                </button>
            </section>
        </div>
    )
}