import { Ratelimit } from "@upstash/ratelimit";
import { Request, Response, NextFunction } from "express";
import { Redis } from "@upstash/redis";

const redis = Redis.fromEnv();

export const globalLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, '1 m') });

export const loginLimiter = new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '15 m') });

export async function rateLimiter(req: Request, res: Response, next: NextFunction) {
    const ip = req.ip ?? '127.0.0.1';

    const { success, reset } = await globalLimiter.limit(ip);

    if (!success) {
        const retryAfter = Math.ceil((reset - Date.now()) / 1000);
        res.setHeader('Retry-after', retryAfter);
        return res.status(429).json({ message: 'Você excedeu o limite requisições' })
    }

    next();
}

export async function loginRateLimiter(req: Request, res: Response, next: NextFunction) {
    const email = req.body?.email ?? req.ip;

    const {success} = await loginLimiter.limit(email);

    if(!success) {
        return res.status(429).json({message: 'Você excedeu o limite de tentativas de login. Tente em 15 minutos'})
    }

    next();
}