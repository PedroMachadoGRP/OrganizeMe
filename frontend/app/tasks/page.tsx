'use client'

import React, { useEffect, useMemo, useState } from 'react'
import TaskCard from '../components/TaskCard'
import CreateTaskModal from "../components/CreateTaskModal"
import { DialogModal } from '../components/ui/dialogModal'
import { User } from '../lib/types'
import { useSnackbar } from 'notistack'
import { useAuth } from '../contexts/AuthContext'
import { TaskStatus, useTasks } from '../hooks/useTasks'
import SummaryCardsGroup from '../components/SummaryCardsGroup'
import { useRouter } from 'next/navigation';

type FilterOption = TaskStatus | "ALL"


export default function page() {
    const [filter, setFilter] = useState<FilterOption>("ALL")
    const [search, setSearch] = useState("");
    const { enqueueSnackbar } = useSnackbar();
    const { state: { user, loading: authLoading } } = useAuth();
    const router = useRouter()
    const { tasks, loading, error, create, complete, remove, refresh } = useTasks(filter)

    useEffect(() => {
        if (!authLoading && !user) {
            router.replace('/login')
        }
    }, [authLoading, user, router])

    const visibleTasks = useMemo(() => {
        if (!search.trim()) return tasks
        const term = search.toLowerCase()
        return tasks.filter((t) => t.title.toLowerCase().includes(term))
    }, [tasks, search])

    async function handleCreateTask(data: { title: string, description: string, expireDate: Date | null }) {
        try {
            await create({
                title: data.title,
                description: data.description,
                expiresAt: data.expireDate ? data.expireDate.toISOString() : "",
            })
            enqueueSnackbar("Tarefa criada com sucesso",
                {
                    variant: "success",
                    anchorOrigin: {
                        vertical: "top",
                        horizontal: "right",
                    },
                })
        } catch (error) {
            enqueueSnackbar("Erro ao criar tarefa", {
                variant: "error",
                anchorOrigin: {
                    horizontal: 'right',
                    vertical: 'top'
                }
            })
        }
    }

    // if (authLoading || !user) {
    //     return (
    //         <div className='bg-neutral-100 flex justify-center items-center w-screen h-screen'>
    //             <p className='text-neutral-600'>Carregando...</p>
    //         </div>
    //     )
    // }

    return (
        <div>

            <main className='bg-[#F7F9F7] flex justify-center items-center w-screen  h-screen'>

                <section className='h-180 w-280 max-w-7xl mx-auto p-10 flex flex-col  bg-[#FDFDFC]'>

                    <div className='flex flex-row justify-between'>
                        <div className='flex flex-col'>
                            <h2 className='text-neutral-950 text-2xl font-semibold'>
                                Suas tarefas
                            </h2>

                            <h3 className='text-neutral-800 text-sm'>
                                Organiza suas tarefas com o Organiza-me
                            </h3>
                        </div>


                        < SummaryCardsGroup />
                    </div>



                    <div className='flex mt-10 gap-5 justify-start items-start'>

                        <input
                            className='px-3 w-100 h-10 border bg-white text-neutral-800 border-black rounded-md outline-none'
                            type="text"
                            placeholder='Digite sua tarefa'
                        />

                        <div className='w-40 h-10 border-black rounded-md hover:cursor-pointer'>
                            <DialogModal onCreate={handleCreateTask} />
                        </div>

                    </div>

                    <div className="grid grid-cols-3 gap-5 mt-10">
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

                </section>

            </main>
        </div>
    )
}