'use client'

import ProfileInfoField from "@/app/components/ui/ProfileInfoField";
import { useAuth } from '../../contexts/AuthContext'
import { useRouter } from "next/navigation";
import { useSnackbar } from "notistack";
import React, { useEffect } from "react";
import PasswordInfoFiled from "@/app/components/ui/PasswordInfoField";

export default function Page() {
  const { enqueueSnackbar } = useSnackbar();
  const { state: { user, loading: authLoading } } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!authLoading && !user) {
      // router.replace('/login')
    }
  }, [authLoading, user, router]);

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
        bg-[#FDFDFC] dark:bg-neutral-900
        p-10
        rounded-2xl
      ">



        <div className="w-full flex flex-col items-center">
          <ProfileInfoField
            inputName="Nome"
            currentInfo={user.name}
          />

          <ProfileInfoField
            inputName="Email"
            currentInfo={user.email}
          />

          <PasswordInfoFiled
            inputName="Senha"
          />
        </div>

      </section>
    </main>
  );
}
