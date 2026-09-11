import * as React from "react";
import { Label } from "radix-ui";

type infoFieldProps = {
  inputName:string;
  currentInfo:string | undefined ;
}

export default function ProfileInfoField({inputName,currentInfo}:infoFieldProps) {
  return (
    <div className="flex flex-wrap flex-col  gap-3.50 px-5">
      <Label.Root
        className="text-[15px] font-medium leading-8.75 text-neutral-400 dark:text-neutral-500"
        htmlFor="firstName"
      >
        {inputName}
      </Label.Root>
      <input
        className="inline-flex h-9 w-70 appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-neutral-400 dark:text-neutral-500 shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white focus:shadow-[0_0_0_2px_black]"
        type="text"
        id="firstName"
        defaultValue={currentInfo}
      />
    </div>
  );
}
