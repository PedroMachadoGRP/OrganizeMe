import z from "zod";


export const taskSchama = z.object({
    body: z.object({
        title: z.string().min(1).max(255).trim(),
        description: z.string().max(5000).trim().optional(),
        expiresAt: z.string().datetime().optional(),
    }).refine(
        (data) => !data.expiresAt || new Date(data.expiresAt).getTime() > Date.now(),
        {
            message: "A data de expiração deve ser posterior à data atual",
            path: ["expiresAt"],
        }
    )
})

