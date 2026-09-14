import z from "zod"

export const updateUserSchema = z.object({
    body: z.object({
        name: z.string().min(1, "O nome deve ter pelo menos uma letra").max(50, "você atingiu o limite de letras").trim().optional(),
        email: z.string().email("Email inválido").optional(),
    }).refine(
        (data) => data.name !== undefined || data.email !== undefined, { message: "Você deve inserir pelo menos um campo para atualizar" }
    )
})