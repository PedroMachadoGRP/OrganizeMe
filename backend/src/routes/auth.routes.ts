
import { validate } from "../middleware/validate";
import { Router } from "express";
import { registerSchema } from '../schemas/CreateUserDTO'
import { login, logout, me, refresh, register } from "../controllers/auth.controller";
import { loginRateLimiter } from "../middleware/rateLimiter";
import { loginSchema } from "../schemas/LoginUserDTO";
import { authenticate } from "../middleware/authenticate";


const router = Router()


router.post('/register', validate(registerSchema), register)
router.post('/login', loginRateLimiter, validate(loginSchema), login)
router.post('/logout', authenticate, logout);
router.post('/refresh', refresh);
router.get('/me', authenticate, me)

export default router