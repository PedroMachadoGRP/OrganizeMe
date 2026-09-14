
import { validate } from "../middleware/validate";
import { Router } from "express";
import { registerSchema } from '../schemas/CreateUserDTO'
import { login, logout, me, refresh, register, updateMe, updatePassword } from "../controllers/auth.controller";
import { loginRateLimiter } from "../middleware/rateLimiter";
import { loginSchema } from "../schemas/LoginUserDTO";
import { authenticate } from "../middleware/authenticate";
import { updateSchema } from "@/schemas/UpdateTaskDTO";
import { updateUserSchema } from "@/schemas/UpdateUserDTO";
import { updateUserPasswordSchema } from "@/schemas/UpdateUserPasswordDTO";


const router = Router()


router.post('/register', validate(registerSchema), register)
router.post('/login', loginRateLimiter, validate(loginSchema), login)
router.post('/logout', authenticate, logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, me)
router.put('/me',authenticate,validate(updateUserSchema),updateMe)
router.put('/me/password',authenticate,validate(updateUserPasswordSchema),updatePassword)

export default router