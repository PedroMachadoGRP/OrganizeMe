import React from 'react'
import TaskCard from '../components/TaskCard'

export default function page() {
    return (
        <div className='bg-white min-h-screen'>

            <header className='w-full bg-zinc-200 text-black'>
                <div className='max-w-7xl mx-auto px-6 py-4 text-2xl'>
                    Tasks
                </div>
            </header>

            <main className='bg-neutral-100 min-h-screen'>

                <div className='max-w-7xl mx-auto px-6 py-6 flex justify-between items-center'>

                    <h2 className='text-black text-xl font-semibold'>
                        Suas tarefas
                    </h2>

                    <div className='flex gap-2'>

                        <input
                            className='px-3 w-64 h-10 border bg-white text-neutral-800 border-black rounded-md outline-none'
                            type="text"
                            placeholder='Digite sua tarefa'
                        />

                        <button className='w-40 h-10 bg-black text-zinc-100 border border-black rounded-md hover:cursor-pointer'>
                            Criar tarefa
                        </button>

                    </div>

                </div>

                <div className='max-w-7xl mx-auto px-6 pb-6 grid grid-cols-4 gap-4'>
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                    <TaskCard />
                </div>

            </main>
        </div>
    )
}