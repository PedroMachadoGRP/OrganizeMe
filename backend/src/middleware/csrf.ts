import { Request, Response, NextFunction } from "express";
import crypto from 'crypto';

export function generateCsrfToken(): string {
    return crypto.randomBytes(32).toString('hex');
}

export function setCsrfToken(req: Request, res: Response) {
    const token = generateCsrfToken();

    res.cookie('csrf-token', token, {
        httpOnly: false,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 60 * 60 * 1000,
    });

    return res.json({csrfToken:token});
}

export function csrfProtection(req:Request, res:Response, next:NextFunction) {
    const safeMethods = ['GET','HEAD','OPTIONS'];

    if(safeMethods.includes(req.method)) return next();

    const fromCookie = req.cookies?.['csrf-token'];
    const fromHeader = req.headers['x-csrf-token'];

    if(!fromCookie || !fromHeader || fromCookie !== fromHeader){
        return res.status(403).json({message: 'Token CSRF inválido'})
    }

    next();
}