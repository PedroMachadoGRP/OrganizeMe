import React from 'react'
import { Task, TaskStatus } from '../hooks/useTasks'
import { EllipsisVertical } from 'lucide-react'

type HistoryTaskCardProps = {
    tasks: Task[]
}

const STATUS_LABELS: Record<TaskStatus, string> = {
    IN_PROGRESS: 'Em progresso',
    COMPLETED: 'Concluída',
    CANCELLED: 'Cancelada',
    EXPIRED: 'Expirada',
}

const STATUS_STYLES: Record<TaskStatus, string> = {
    IN_PROGRESS: 'bg-blue-100 text-blue-700',
    COMPLETED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-neutral-200 text-neutral-600',
    EXPIRED: 'bg-red-100 text-red-700',
}

const ROW_GRID =
    'grid grid-cols-[1fr_2fr_1fr_1fr_1fr] items-center gap-30 px-4 py-3'

export default function HistoryTaskCard({ tasks }: HistoryTaskCardProps) {
    return (
        <div className="flex flex-col p-5 w-full divide-y divide-gray-50 text-black ">
            <header className={`${ROW_GRID} font-semibold  `}>
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
                    <main key={task.id} className={`${ROW_GRID} bg-[#f8f7f7]`} >
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
        </div>
    )
}