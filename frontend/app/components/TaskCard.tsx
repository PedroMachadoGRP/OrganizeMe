import React from 'react'
import { TaskStatus } from '../lib/types'

export default function TaskCard(props: {
    title: string
    description: string
    status: TaskStatus
    expiredDate: string
}) {
    return (
        <div className="flex flex-col h-50 w-full border border-zinc-300 rounded-2xl bg-neutral-100 p-3 shadow-sm">
            <h1 className="text-xl font-semibold text-zinc-800">
                {props.title}
            </h1>

            <p className="mt-3 text-sm text-zinc-500 line-clamp-2 wrap-break-word">
                {props.description}
            </p>

            <div className="mt-auto flex flex-col gap-2">
                <span className="w-fit rounded-md bg-zinc-200 px-2 py-1 text-xs text-blue-500">
                    {props.status}
                </span>

                <span className="w-fit rounded-md bg-zinc-200 px-2 py-1 text-xs text-blue-500">
                    {props.expiredDate}
                </span>
            </div>
        </div>
    )
}