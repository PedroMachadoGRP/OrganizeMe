import * as React from "react";
import { AlertDialog } from "radix-ui";
import { CheckIcon, PencilLine } from "lucide-react";
import { useState } from "react";

type SaveUpdateDialog = {
    fieldLabel: string;
    value: string;
    disable?: boolean;
    onConfirm: () => Promise<void>
    onCancel?: () => void
}


const SaveUpdateDialog = ({ fieldLabel, onConfirm, value, disable, onCancel }: SaveUpdateDialog) => {
    const [open, setOpen] = useState(false);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null)

    async function handleConfirm(event: React.MouseEvent<HTMLButtonElement>) {
        event.preventDefault();

        try {
            setSaving(true);
            setError(null);
            await onConfirm();
            setOpen(false);
        } catch (err: any) {
            setError(err?.message ?? "Não foi possível atualizar");
        } finally {
            setSaving(false);
        }
    }

    function handleCancel() {
        setError(null);
        onCancel?.();
    }

    return (
        <AlertDialog.Root open={open} onOpenChange={(next) => {
            if (!saving) setOpen(next)
        }}>
            <AlertDialog.Trigger asChild>
                <button className="border p-2 dark:text-neutral-500 hover:cursor-pointer rounded-md disabled:opacity-40 disabled:cursor-not-allowed" type="button" disabled={disable}><PencilLine size={20} /></button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
                <AlertDialog.Overlay className=" fixed inset-0 bg-black/40 backdrop-blur-sm" />
                <AlertDialog.Content className="bg-[#FFFEFE] dark:bg-neutral-900 text-neutral-700 dark:text-neutral-300 fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] max-w-125 -translate-x-1/2 -translate-y-1/2 rounded-md bg-gray1 p-6.25 shadow-(--shadow-6) focus:outline-none data-[state=open]:animate-contentShow">
                    <AlertDialog.Title className="m-0 text-[17px] font-medium text-mauve12">
                        Você tem certeza que quer atualizar {fieldLabel.toLowerCase()}?
                    </AlertDialog.Title>
                    <AlertDialog.Description className="mb-5 mt-3.75 text-[15px] leading-normal text-mauve11">
                        Essa ação não podera ser revertida.Isso ira atualizar a informação de perfil permanentemente

                        {value && (
                            <>
                                {" "}para: <span className="font-medium text-neutral-700 dark:text-neutral-200">{value}</span>
                            </>
                        )}
                    </AlertDialog.Description>

                    {error && (
                        <p className="mb-3.75 -mt-2 text-[13px] text-red-500">{error}</p>
                    )}
                    <div className="flex justify-end gap-6.25">
                        <AlertDialog.Cancel asChild>
                            <button type="button" disabled={saving} onClick={handleCancel} className="inline-flex h-8.75 items-center justify-center rounded bg-mauve4 px-3.75 font-medium leading-none text-mauve11 outline-none outline-offset-1 hover:cursor-pointer hover:bg-mauve5 focus-visible:outline-2 focus-visible:outline-mauve7 select-none">
                                Sair
                            </button>
                        </AlertDialog.Cancel>
                        <AlertDialog.Action asChild>
                            <button
                                type="button"
                                disabled={saving}
                                onClick={handleConfirm}
                                className="...disabled:opacity-50 disabled:cursor-not-allowed">
                                {saving ? "Salvando..." : "Salvar"}
                            </button>
                        </AlertDialog.Action>
                    </div>
                </AlertDialog.Content>
            </AlertDialog.Portal>
        </AlertDialog.Root>
    )

}




export default SaveUpdateDialog;