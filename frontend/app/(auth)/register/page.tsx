"use client"
import React from 'react'
export default function Page() {
    return (
        <main className='flex justify-center items-center w-screen h-screen bg-[#18171ec9] '>
  
            <div className='flex flex-col justify-center items-center bg-[linear-gradient(43deg,#17191e_0%,#23262d_46%,#2f3440_100%)] h-180 w-280 p-2 gap-2 rounded-[15]'>
                <h2 className='text-4xl text-zinc-50'>Seja bem vindo</h2>

                <div className='flex flex-col p-5 gap-2'>
                    <input className='h-10 w-80 p-2 rounded-[10] tracking-wide outline-none focus:outline-none border bg-[#17191e] text-zinc-100 border-gray-500' type="email"  name="" id="" placeholder='Nome' />
                    <input className='h-10 w-80 p-2 rounded-[10] tracking-wide outline-none focus:outline-none border bg-[#17191e] text-zinc-100 border-gray-500' type="text"  name="" id="" placeholder='Email' />
                    <input className='h-10 w-80 p-2 rounded-[10] tracking-wide outline-none focus:outline-none border bg-[#17191e] text-zinc-100 border-gray-500' type="password" name="" id="" placeholder='Password' />
                </div>

                <button className='border border-[#101118] h-10 w-80 rounded-[10] hover:bg-black transition duration-200 hover:cursor-pointer'>Entar</button>

                <div>
                    <h2>Já tem uma conta? <a className='hover:text-blue-300 transition duration-200' href="/login">Clique aqui </a></h2>
                </div>

            </div>
        </main>
    )
}

