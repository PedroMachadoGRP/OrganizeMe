import React from 'react'
import { TaskStatus } from '../lib/types'
import { CheckIcon, Cross2Icon } from "@radix-ui/react-icons"
import { Badge } from '@radix-ui/themes'
import CompleteDialog from './ui/CompleteDialog'
import CancelDialog from './ui/CancelDialog'


type TaskCardProps = {
    title: string
    description: string
    status: TaskStatus
    expiredDate: string
    onComplete: (data: { taskId: string }) => Promise<void>
    onCancel: (data: { taskId: string }) => Promise<void>
}

export default function TaskCard({
    title,
    description,
    status,
    expiredDate,
    onComplete,
    onCancel,
}: TaskCardProps) {

    const statusColors: Record<
        TaskStatus,
        "bg-red-100 text-red-800" |
        "bg-blue-100 text-blue-800" |
        "bg-green-100 text-green-800"
    > = {
        EXPIRED: "bg-red-100 text-red-800",
        IN_PROGRESS: "bg-blue-100 text-blue-800",
        COMPLETED: "bg-green-100 text-green-800",
        CANCELLED: "bg-red-100 text-red-800",
    }

    return (
        <div className="flex items-start flex-col h-55 w-full border border-zinc-300 rounded-2xl bg-[#FFFEFF] p-3 shadow-sm">

            <section className='flex flex-col '>
                <h1 className="text-xl font-semibold text-zinc-800">
                    {title}
                </h1>

                <p className="text-sm text-zinc-500 line-clamp-2 wrap-break-word">
                    {description}
                </p>
            </section>


            <section className="flex flex-row justify-evenly gap-2 ">

                <div className='p-2 min-w-35 min-h-20 rounded-md bg-[#F7F8F7]  text-sm '>
                    <h2 className='text-neutral-400'>
                        PRAZO
                    </h2>
                    <span className='text-black'>
                        {expiredDate}
                    </span>
                </div>

                <div className='p-2 min-w-35 min-h-20 rounded-md bg-[#F7F8F7]  text-sm '>
                    <h2 className='text-neutral-400'>
                        STATUS
                    </h2>
                    <span className={`rounded-md px-2 py-1 text-xs ${statusColors[status]}`}>
                        {status}
                    </span>
                </div>
            </section>


            <section className="mt-auto flex justify-end gap-2 ">
                <div>
                    <CompleteDialog />
                </div>

                <div>
                    <CancelDialog />
                </div>
            </section>



        </div>
    )
}