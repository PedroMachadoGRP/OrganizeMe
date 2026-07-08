import express from "express"
import helmet from "helmet"
import cors from "cors"
import routes from "../src/routes/index"
import { csrfProtection, setCsrfToken } from "./middleware/csrf"
import { rateLimiter } from "./middleware/rateLimiter"
import { errorHandler } from "./middleware/errorHandler"
import cookieParser from "cookie-parser";


export const app = express()

app.use(cookieParser())

app.use(helmet({
    contentSecurityPolicy: {
        directives: {
            defaultSrc: ["'self'"],
            scriptSrc: ["'self'"],
            objectSrc: ["'none'"]
        },
    },
    hsts: { maxAge: 63972000, includeSubDomains: true, preload: true },
}));

app.use(cors({
    origin: process.env.ALLOWED_ORIGINS?.split(',') ?? [],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
}))



app.use(express.json({ limit: '10kb' }))
app.get('/auth/csrf-token', setCsrfToken);

app.use(csrfProtection);

app.use(rateLimiter)
app.use(routes)

app.use(errorHandler);



