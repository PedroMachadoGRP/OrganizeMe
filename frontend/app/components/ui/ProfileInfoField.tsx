import * as React from "react";
import { Label } from "radix-ui";
import { PencilLine } from "lucide-react";
import SaveUpdateDialog from "./SaveUpdateDialog";
import { UpdateUserInput } from "@/app/lib/types";
import { useEffect, useState } from "react";




type infoFieldProps = {
  inputName: string;
  fieldKey: "name" | "email"
  currentInfo: string | undefined;
  onUpdate: (data: UpdateUserInput) => Promise<void>;
}

export default function ProfileInfoField({ inputName, currentInfo, fieldKey, onUpdate }: infoFieldProps) {

  const [value, setValue] = useState(currentInfo ?? "");

  useEffect(() => {
    setValue(currentInfo ?? "");
  }, [currentInfo])

  function handleCancel() {
    setValue(currentInfo ?? "");
  }

  async function handleConfirm() {
    const trimmed = value.trim();
    if (!trimmed || trimmed === currentInfo) return
    await onUpdate({ [fieldKey]: trimmed })
  }

  const hasChanges = value.trim() !== "" && value.trim() !== (currentInfo ?? "").trim();

  return (
    <div className="flex flex-wrap flex-col gap-3.50 px-5">
      <Label.Root
        className="text-[15px] font-medium leading-8.75 text-neutral-400 dark:text-neutral-500"
        htmlFor="firstName"
      >
        {inputName}
      </Label.Root>
      <div className="flex flex-row gap-5">
        <input
          className="inline-flex h-9 w-100 appearance-none items-center justify-center rounded bg-blackA2 px-2.5 text-[15px] leading-none text-neutral-400 dark:text-neutral-500 shadow-[0_0_0_1px] shadow-blackA6 outline-none selection:bg-blackA6 selection:text-white focus:shadow-[0_0_0_2px_black]"
          type="text"
          id={fieldKey}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />

        <SaveUpdateDialog
          fieldLabel={inputName}
          value={value.trim()}
          disable={!hasChanges}
          onConfirm={handleConfirm}
          onCancel={handleCancel} />
      </div>

    </div>
  );
}
