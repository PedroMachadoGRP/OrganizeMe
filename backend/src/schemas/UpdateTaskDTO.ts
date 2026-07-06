import z from "zod";

export const updateSchema = z.object({
    params: z.object({ id: z.string().cuid }),
    body: z.object({
        title: z.string().min(1).max(255).trim().optional(),
        description: z.string().max(5000).trim().optional(),
        expiresAt: z.string().datetime().optional(),
    })
})

