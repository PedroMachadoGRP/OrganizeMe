"use client";

import * as React from "react";
import {
    Label,
    unstable_PasswordToggleField as PasswordToggleField,
} from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { UpdateUserPasswordInput } from "@/app/lib/types";

type PasswordInfoFieldProps = {
    inputName: string;
    onUpdate: (data: UpdateUserPasswordInput) => Promise<void>;
};

const FIELD_WRAPPER =
    "inline-flex h-9 w-100 appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-neutral-400 dark:text-neutral-500 shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white focus:shadow-[0_0_0_2px_black]";

const FIELD_INPUT =
    "all-[unset] box-border w-full text-[15px] leading-none text-inherit outline-none selection:bg-blackA6 selection:text-white";

export default function PasswordInfoField({
    inputName,
    onUpdate,
}: PasswordInfoFieldProps) {
    const [editing, setEditing] = useState(false);
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    function resetFields() {
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        setError(null);
    }

    function startEditing() {
        resetFields();
        setEditing(true);
    }

    function cancelEditing() {
        resetFields();
        setEditing(false);
    }

    async function handleSave() {
        if (!currentPassword || !newPassword) {
            setError("Preencha a senha atual e a nova senha");
            return;
        }

        if (newPassword !== confirmPassword) {
            setError("As senhas não coincidem");
            return;
        }

        try {
            setSaving(true);
            setError(null);
            await onUpdate({ currentPassword, newPassword });
            resetFields();
            setEditing(false);
        } catch (err: any) {
            setError(err?.message ?? "Não foi possível atualizar a senha");
        } finally {
            setSaving(false);
        }
    }

    if (!editing) {
        return (
            <div className="flex flex-wrap flex-col px-5">
                <Label.Root className="text-[15px] font-medium leading-8.75 text-neutral-400 dark:text-neutral-500">
                    {inputName}
                </Label.Root>

                <div className="flex items-center gap-5">
                    <input
                        className="inline-flex h-9 w-100 appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-neutral-400 dark:text-neutral-500 shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white focus:shadow-[0_0_0_2px_black]"
                        type="password"
                        value="********"
                        disabled
                        aria-hidden
                    />
                    <button
                        type="button"
                        onClick={startEditing}
                        className="border p-2 dark:text-neutral-500 hover:cursor-pointer rounded-md disabled:opacity-40 disabled:cursor-not-allowed"
                        aria-label={`Editar ${inputName}`}
                    >
                        <Pencil size={20} />
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-wrap flex-col gap-2 px-50">
            <Label.Root className="text-[15px] font-medium leading-8.75 text-neutral-400 dark:text-neutral-500">
                {inputName}
            </Label.Root>

            <PasswordToggleField.Root >
                <div className={FIELD_WRAPPER}>
                    <PasswordToggleField.Input
                        placeholder="Senha atual"
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        className={FIELD_INPUT}
                    />
                    <PasswordToggleField.Toggle className="all-[unset] flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded">
                        <PasswordToggleField.Icon visible={<EyeOpenIcon />} hidden={<EyeClosedIcon />} />
                    </PasswordToggleField.Toggle>
                </div>
            </PasswordToggleField.Root>

            <PasswordToggleField.Root>
                <div className={FIELD_WRAPPER}>
                    <PasswordToggleField.Input
                        placeholder="Nova senha"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        className={FIELD_INPUT}
                    />
                    <PasswordToggleField.Toggle className="all-[unset] flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded">
                        <PasswordToggleField.Icon visible={<EyeOpenIcon />} hidden={<EyeClosedIcon />} />
                    </PasswordToggleField.Toggle>
                </div>
            </PasswordToggleField.Root>

            <PasswordToggleField.Root>
                <div className={FIELD_WRAPPER}>
                    <PasswordToggleField.Input
                        placeholder="Confirmar nova senha"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className={FIELD_INPUT}
                    />
                    <PasswordToggleField.Toggle className="all-[unset] flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded">
                        <PasswordToggleField.Icon visible={<EyeOpenIcon />} hidden={<EyeClosedIcon />} />
                    </PasswordToggleField.Toggle>
                </div>
            </PasswordToggleField.Root>

            <div className="flex items-center gap-2 mt-1">
                <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="inline-flex h-8.75 items-center justify-center rounded bg-green4 px-3.75 text-sm font-medium leading-none text-green11 hover:cursor-pointer hover:bg-green5 duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {saving ? "Salvando..." : "Salvar"}
                </button>
                <button
                    type="button"
                    onClick={cancelEditing}
                    disabled={saving}
                    className="inline-flex h-8.75 items-center justify-center rounded px-3.75 text-sm hover:cursor-pointer hover:bg-neutral-700 duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    Cancelar
                </button>
            </div>

            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}