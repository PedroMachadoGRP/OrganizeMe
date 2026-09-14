import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import { createUser, validateCredentials, generateTokens, revokeToken, rotateSession } from "../services/auth.service";
import { prisma } from "@/lib/prisma";

export async function register(req: Request, res: Response) {

    try {

        const { name,email, password } = req.body;
        const user = await createUser(name,email, password);
        return res.status(201).json({ user })

    } catch (err: any) {

        if (err.message === 'EMAIL_IN_USE') {
            return res.status(409).json({ message: 'Não foi possivel criar uma conta' })
        }

        throw err;
    }
}

export async function login(req: Request, res: Response) {

    const { email, password } = req.body;
    const user = await validateCredentials(email, password).catch(() => null);

    if (!user) {
        return res.status(401).json({ message: 'Email ou senha incorretos' })
    }

    const { accessToken, refreshToken } = await generateTokens(user.id, user.email);

    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ user: { id: user.id, email: user.email,name:user.name } })

}

export async function logout(req: AuthRequest, res: Response) {
    const token = req.cookies?.['accessToken']
    if (token) await revokeToken(token);

    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refresh-token', { path: '/auth/refresh' });
    res.clearCookie('csrf-token', { path: '/' });

    return res.json({ message: 'Logout realizado' });
}

export async function me(req: AuthRequest, res: Response) {
    const user = await prisma.user.findUnique({where:{id:req.user!.id}})
    return res.json({ user })
}

export async function refresh(req: Request, res: Response) {
    const token = req.cookies?.['refresh-token'];

    if (!token) {
        return res.status(401).json({ message: 'Sessão não encontrada' });
    }

    try {
        const { accessToken, refreshToken } = await rotateSession(token);

        res.cookie('accessToken', accessToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/',
            maxAge: 15 * 60 * 1000,
        });

        res.cookie('refresh-token', refreshToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            path: '/auth/refresh',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return res.json({ message: 'Sessão renovada' });
    } catch {
        res.clearCookie('accessToken', { path: '/' });
        res.clearCookie('refresh-token', { path: '/auth/refresh' });
        res.clearCookie('csrf-token', { path: '/' });
        return res.status(401).json({ message: 'Sessão expirada' });
    }
}