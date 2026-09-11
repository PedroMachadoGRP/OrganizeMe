import * as React from "react";
import {
    Label,
    unstable_PasswordToggleField as PasswordToggleField,
} from "radix-ui";
import { EyeClosedIcon, EyeOpenIcon } from "@radix-ui/react-icons";
import { useState } from "react";

type PasswordInfoFieldProps = {
    inputName: string;
};

export default function PasswordInfoField({
    inputName,
}: PasswordInfoFieldProps) {

    const [password, setPassword] = useState<string>("");

    function handleFocus() {
        setPassword("");
    }


    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setPassword(e.target.value);
    }

    return (
        <PasswordToggleField.Root>
            <div className="flex flex-wrap flex-col px-5">
                <Label.Root
                    className="text-[15px] font-medium leading-8.75 text-neutral-400 dark:text-neutral-500"
                    htmlFor="password"
                >
                    {inputName}
                </Label.Root>

                <div className="inline-flex h-9 w-70 items-center justify-between rounded bg-blackA2 px-2.5 text-[15px] leading-none text-neutral-400 shadow-[0_0_0_1px] shadow-blackA6">
                    <PasswordToggleField.Input
                        id="password"
                        value={password}
                        onFocus={handleFocus}
                        onChange={handleChange}
                        className="all-[unset] box-border w-full text-[15px] leading-none text-inherit outline-none selection:bg-blackA6 selection:text-white"
                    />

                    <PasswordToggleField.Toggle className="all-[unset] flex h-5 w-5 shrink-0 cursor-pointer items-center justify-center rounded">
                        <PasswordToggleField.Icon
                            visible={<EyeOpenIcon />}
                            hidden={<EyeClosedIcon />}
                        />
                    </PasswordToggleField.Toggle>
                </div>
            </div>
        </PasswordToggleField.Root>
    );
}