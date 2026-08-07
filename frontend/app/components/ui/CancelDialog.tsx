import * as React from "react";
import { AlertDialog } from "radix-ui";
import { CheckIcon } from "lucide-react";
import { Cross2Icon } from "@radix-ui/react-icons";

const CompleteDialog = () => (
    <AlertDialog.Root>
        <AlertDialog.Trigger asChild>
            <button className='hover:cursor-pointer bg-[#F7F8F7] p-2 rounded-lg hover:bg-red-300 duration-200'>
                <Cross2Icon className="w-6 h-4 text-neutral-800" />
            </button>
        </AlertDialog.Trigger>
        <AlertDialog.Portal>
   <AlertDialog.Overlay className=" fixed inset-0 bg-black/40 backdrop-blur-sm" />
            <AlertDialog.Content className="bg-[#FFFEFE] text-neutral-700 fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-125 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-6.25 shadow-(--shadow-6) focus:outline-none data-[state=open]:animate-contentShow">
                <AlertDialog.Title className="m-0 text-[17px] font-medium text-mauve12">
                    Você tem certeza que quer cancelar essa tarefa?
                </AlertDialog.Title>
                <AlertDialog.Description className="mb-5 mt-[15px] text-[15px] leading-normal text-mauve11">
                    Essa ação não podera ser revertida.Isso ira colocar a tarefa como cancelada e a enviar para seu histórico
                </AlertDialog.Description>
                <div className="flex justify-end gap-[25px]">
                    <AlertDialog.Cancel asChild>
                        <button className="hover:cursor-pointer inline-flex h-[35px] items-center justify-center rounded bg-mauve4 px-[15px] font-medium leading-none text-mauve11 outline-none outline-offset-1 hover:bg-mauve5 focus-visible:outline-2 focus-visible:outline-mauve7 select-none">
                            Sair
                        </button>
                    </AlertDialog.Cancel>
                    <AlertDialog.Action asChild>
                        <button className="inline-flex h-8.75 items-center justify-center rounded bg-red4 px-3.75 font-medium leading-none text-red11 outline-none outline-offset-1 hover:cursor-pointer hover:bg-red-500 hover:text-neutral-50 duration-300 focus-visible:outline-2 focus-visible:outline-red7 select-none">
                            Cancelar
                        </button>
                    </AlertDialog.Action>
                </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
    </AlertDialog.Root>
);

export default CompleteDialog;