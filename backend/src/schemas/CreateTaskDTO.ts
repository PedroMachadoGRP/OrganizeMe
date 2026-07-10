import z from "zod";


export const taskSchama = z.object({
    body: z.object({
        title: z.string().min(1).max(255).trim(),
        description: z.string().max(5000).trim().optional(),
        expiresAt: z.string().datetime().optional(),
    })
})

