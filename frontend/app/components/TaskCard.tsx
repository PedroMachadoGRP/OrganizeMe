import React from 'react'

export default function TaskCard() {
    return (
        <div className='flex justify-center items-center '>
            <div className='flex flex-col border p-3 h-45 w-72 bg-neutral-900 border-zinc-300 rounded-2xl text-black shadow-sm'>
                
                <div className='flex justify-center mb-3'>
                    <h1 className='text-zinc-400 text-xl font-semibold'>
                        Tarefa
                    </h1>
                </div>

                <div className='flex flex-col gap-3'>
                    <p className='text-sm wrap-break-word text-zinc-400'>
                        Interface web moderna de Task Manager com design clean, cards grandes, título centralizado, descrição curta, status e data de expiração.
                    </p>

                    <div className='flex justify-between items-center mt-auto'>
                        <label className='bg-zinc-200 text-blue-400 px-2 py-1 rounded-md text-xs'>
                            Em andamento
                        </label>

                        <span className='text-xs text-zinc-400'>
                            12/05/2026
                        </span>
                    </div>
                </div>

            </div>
        </div>
    )
}