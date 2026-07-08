import { Router } from "express";
import authRoutes from './auth.routes'
import tasksRoutes from './tasks.routes'

const router  = Router()

router.use('/auth',authRoutes)
router.use('/tasks', tasksRoutes)


export default router