import React from 'react'



export default function SummaryCardsGrou() {


    return (
        <div className="flex gap-5">
            <section className="flex-1 flex flex-col p-2 border-2 w-25 h-17 border-[#F0F2F3] bg-[#F6F9F9] rounded-2xl">
                <h2 className="text-neutral-900 text-lg font-semibold">09</h2>
                <h3 className="text-neutral-700 text-xs">Tarefas totais</h3>
            </section>

            <section className="flex-1 flex flex-col p-2 w-25 h-17 border-2 border-[#F0F2F3] bg-[#F6F9F9] rounded-2xl">
                <h2 className="text-neutral-900 text-lg font-semibold">09</h2>
                <h3 className="text-neutral-700 text-xs">Em progresso</h3>
            </section>

            <section className="flex-1 flex flex-col p-2 w-25 h-17 border-2 border-[#F0F2F3] bg-[#F6F9F9] rounded-2xl">
                <h2 className="text-neutral-900 text-lg font-semibold">09</h2>
                <h3 className="text-neutral-700 text-xs">Terminam hoje</h3>
            </section>
        </div>
    )
}
