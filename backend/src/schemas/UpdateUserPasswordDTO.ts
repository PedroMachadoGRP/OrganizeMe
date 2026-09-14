import z from "zod";
 
export const updateUserPasswordSchema = z.object({
    body: z.object({
        currentPassword: z.string().min(1, "Informe a senha atual"),
        newPassword: z.string().min(8, "Senha deve ter no mínimo 8 caracteres")
            .refine((v) => /[A-Z]/.test(v), { message: "A senha deve conter letra maiúscula" })
            .refine((v) => /[a-z]/.test(v), { message: "A senha deve conter letra minúscula" })
            .refine((v) => /\d/.test(v), { message: "A senha deve conter um número" })
            .refine((v) => /[^A-Za-z\d]/.test(v), { message: "A senha deve conter um símbolo com (!?#$%&*)" }),
    }).refine(
        (data) => data.currentPassword !== data.newPassword,
        { message: "A nova senha deve ser diferente da atual", path: ["newPassword"] }
    )
})
 