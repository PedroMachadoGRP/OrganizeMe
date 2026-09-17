'use client'

import ProfileInfoField from "@/app/components/ui/ProfileInfoField";
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import PasswordInfoFiled from "@/app/components/ui/PasswordInfoField";
import { UpdateUserInput, UpdateUserPasswordInput } from "@/app/lib/types";

export default function Page() {
  const { enqueueSnackbar } = useSnackbar();
  const {
    state: { user, loading: authLoading },
    updateUser,
    updateUserPassword,
  } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      // router.replace('/login')
    }
  }, [authLoading, user, router]);

  async function handleUpdateUser(data: UpdateUserInput) {
    try {
      await updateUser(data);
      enqueueSnackbar("Dados atualizados com sucesso", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err?.message ?? "Não foi possível atualizar", { variant: "error" });
      throw err;
    }
  }

  async function handleUpdatePassword(data: UpdateUserPasswordInput) {
    try {
      await updateUserPassword(data);
      enqueueSnackbar("Senha atualizada com sucesso", { variant: "success" });
    } catch (err: any) {
      enqueueSnackbar(err?.message ?? "Não foi possível atualizar a senha", { variant: "error" });
      throw err;
    }
  }

  if (authLoading || !user) {
    return (
      <div className="
        bg-neutral-100 dark:bg-neutral-950
        flex justify-center items-center
        w-screen h-screen
        p-5
      ">
        <p className="
          text-neutral-600
          dark:text-neutral-400
        ">
          Carregando...
        </p>
      </div>
    );
  }

  return (

    <main className="
  flex justify-center
  bg-[#F7F9F7] dark:bg-black
  w-full min-h-screen
  p-6
">
      <section className="
    w-full max-w-4xl
    flex flex-col
    items-center
    bg-[#FDFDFC] dark:bg-neutral-900
    p-10
    rounded-2xl
  ">

        <div className="w-full max-w-3xl">

          <header className="
        flex
        flex-col
        items-center
        w-full
      ">
            <div className="w-full">
              <h1 className="
            text-2xl md:text-3xl
            font-semibold
            text-neutral-900 dark:text-white
          ">
                Seu perfil
              </h1>

              <p className="
            mt-1
            text-sm
            text-neutral-500 dark:text-neutral-400
          ">
                Gerencie suas informações pessoais e sua senha.
              </p>
            </div>
          </header>

          <div className="
        w-full
        mt-8
        flex flex-col
        items-center
        gap-4
      ">
            <ProfileInfoField
              inputName="Nome"
              fieldKey="name"
              currentInfo={user.name}
              onUpdate={handleUpdateUser}
            />

            <ProfileInfoField
              inputName="Email"
              fieldKey="email"
              currentInfo={user.email}
              onUpdate={handleUpdateUser}
            />

            <PasswordInfoFiled
              inputName="Senha"
              onUpdate={handleUpdatePassword}
            />
          </div>

        </div>

      </section>
    </main>


  );
}