import z from "zod";

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email('Email inválido'),
        password: z.string().min(8, "Senha deve ter no mínimo 6 caracteres")
            .refine((v) => /[A-Z]/.test(v), { message: "A senha deve conter letra maiúscula", })
            .refine((v) => /[a-z]/.test(v), { message: "A senha deve conter letra minúscula", })
            .refine((v) => /\d/.test(v), { message: "A senha deve conter um número", })
            .refine((v) => /[^A-Za-z\d]/.test(v), { message: "A senha deve conter um símbolo com (!?#$%&*)" })
    })
})

