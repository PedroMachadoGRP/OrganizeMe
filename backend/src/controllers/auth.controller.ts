import { Request, Response } from "express";
import { AuthRequest } from "../middleware/authenticate";
import { createUser, validateCredentials, generateTokens, revokeToken } from "../services/auth.service";

export async function register(req: Request, res: Response) {
    try {

        const { email, password } = req.body;
        const user = await createUser(email, password);
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
        maxAge: 15 * 60 * 1000
    });

    res.cookie('refresh-token', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/auth/refresh',
        maxAge: 7 * 24 * 60 * 60 * 1000,
    })

    return res.json({ user: { id: user.id, email: user.email, } })

}

export async function logout(req: AuthRequest, res: Response) {
    const token = req.cookies?.['accessToken']
    if (token) await revokeToken(token);

    res.clearCookie('accessToken');
    res.clearCookie('refresh-token');

    return res.json({ message: 'Logout realizado' });
}

export async function me(req: AuthRequest, res: Response) {
    return res.json({ user: req.user })
}