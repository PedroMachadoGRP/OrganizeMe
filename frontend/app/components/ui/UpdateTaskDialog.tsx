"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { Dialog } from "radix-ui";
import { Cross2Icon } from "@radix-ui/react-icons";
import { EllipsisVertical } from "lucide-react";
import { Task } from "../../hooks/useTasks";

type UpdateTaskDialogProps = {
  task: Task;
  onUpdate: (
    id: string,
    data: { title: string; description: string; expiresAt: string }
  ) => Promise<void>;
};

function toDateInputValue(isoDate: string) {
  return isoDate ? new Date(isoDate).toISOString().split("T")[0] : "";
}

export default function UpdateTaskDialog({ task, onUpdate }: UpdateTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [expireDate, setExpireDate] = useState(toDateInputValue(task.expiresAt));
  const [dateError, setDateError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setTitle(task.title);
      setDescription(task.description);
      setExpireDate(toDateInputValue(task.expiresAt));
      setDateError(null);
    }
  }, [open, task]);

  async function handleSubmit() {
    if (!title.trim() || !expireDate) return;

    const parsedDate = new Date(expireDate);
    if (parsedDate.getTime() <= Date.now()) {
      setDateError("A data limite deve ser posterior à data atual");
      return;
    }
    setDateError(null);

    try {
      setSubmitting(true);
      await onUpdate(task.id, {
        title,
        description,
        expiresAt: parsedDate.toISOString(),
      });
      setOpen(false);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger asChild>
        <button className="rounded-md p-1 hover:cursor-pointer  hover:bg-neutral-700 duration-150">
          <EllipsisVertical strokeWidth={0.5} />
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 bg-black/40 backdrop-blur-sm" />

        <Dialog.Content className="flex flex-col fixed z-50 bottom-0 left-0 right-0 w-full max-h-[85vh] rounded-t-2xl p-4 md:top-1/2 md:left-1/2 md:bottom-auto md:right-auto md:w-[90vw] md:max-w-lg md:max-h-[90vh] md:-translate-x-1/2 md:-translate-y-1/2 md:rounded-xl md:p-6 overflow-y-auto bg-neutral-50 dark:bg-[#141414] text-neutral-700 dark:text-neutral-100 shadow-xl">
          <div className="mx-auto mb-3 h-1.5 w-12 rounded-full bg-gray-300 md:hidden" />

          <Dialog.Title className="text-base md:text-lg font-semibold mb-4">
            Editar tarefa
          </Dialog.Title>
          <div className="flex flex-col gap-4">
            <div>
              <label className="text-sm md:text-base">Nome da atividade</label>

              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm md:text-base outline-none focus:border-blue-500"
              />
            </div>

            <div>
              <label className="text-sm md:text-base">
                Decrição da atividade
              </label>

              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows={7}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm md:text-base outline-none focus:border-blue-500 resize-none"
              />
            </div>

            <div>
              <label className="text-sm md:text-base">
                Data limite da atividade
              </label>

              <input
                type="date"
                value={expireDate}
                min={new Date().toISOString().split("T")[0]}
                onChange={(e) => {
                  setExpireDate(e.target.value);
                  if (dateError) setDateError(null);
                }}
                className="w-full mt-1 border rounded-md px-3 py-2 text-sm md:text-base outline-none focus:border-blue-500"
              />

              {dateError && (
                <p className="mt-1 text-xs text-red-500">{dateError}</p>
              )}
            </div>
          </div>
          <div className="mt-6.25 flex justify-end">
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex duration-150 hover:bg-cyan-950 hover:cursor-pointer h-8.75 items-center justify-center rounded bg-green4 px-3.75 font-medium leading-none text-green11 outline-none outline-offset-1 hover:bg-green5 focus-visible:outline-2 focus-visible:outline-green6 select-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Salvando..." : "Salvar alterações"}
            </button>
          </div>
          <Dialog.Close asChild>
            <button
              className="absolute right-2.5 top-2.5 inline-flex size-6.25 appearance-none items-center justify-center rounded-full text-violet11 bg-gray3 hover:bg-violet4 focus:shadow-[0_0_0_2px] focus:shadow-violet7 focus:outline-none"
              aria-label="Close"
            >
              <Cross2Icon  className="hover:cursor-pointer hover:bg-neutral-800 rounded-4xl"/>
            </button>
          </Dialog.Close>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}