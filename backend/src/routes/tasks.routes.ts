import { complete, create, list, remove, update } from "../controllers/tasks.controller";
import { authenticate } from "../middleware/authenticate";
import { validate } from "../middleware/validate";
import { taskSchama } from "../schemas/CreateTaskDTO";
import { updateSchema } from "../schemas/UpdateTaskDTO";
import { Router } from "express";
import z from "zod";


const idSchema = z.object({
    params: z.object({id: z.string().cuid()})
})

const router = Router()

router.get('/', authenticate,list)
router.post('/', authenticate,validate(taskSchama),create)
router.put('/:id' , authenticate,validate(updateSchema), update)
router.patch('/:id/complete', authenticate,validate(idSchema),complete)
router.delete('/:id', authenticate,validate(idSchema),remove)

export default router