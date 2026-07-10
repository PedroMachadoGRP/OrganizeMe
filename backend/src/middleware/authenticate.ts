import { Request, Response, NextFunction } from "express";
import { jwtVerify, importSPKI } from 'jose'
import { redis } from "../lib/redis";
import {ParamsDictionary} from 'express-serve-static-core'

export interface AuthRequest<P = ParamsDictionary> extends Request<P> {
  user?: {
    id: string;
    email: string;
  };
}
export async function authenticate(req: AuthRequest, res: Response, next: NextFunction) {
    try {
        const token = req.cookies?.['accessToken'] ?? req.headers.authorization?.replace('Bearer', '');

        if (!token) {
            return res.status(401).json({ message: "Usuário não autenticado" });
        }

        const isRevoked = await redis.get(`blacklist:${token}`);

        if (isRevoked) {
            return res.status(401).json({ message: 'token revogado' })
        }

        const publicKey = await importSPKI(process.env.JWT_PUBLIC_KEY!.replace(/\n/g, '\n'), 'RS256');

        const { payload } = await jwtVerify(token, publicKey);

        req.user = { id: payload.sub as string, email: payload.email as string };

        next();

    } catch(err) {
        console.error(err);
        
        return res.status(401).json({ message: 'Token inválido' });
    }
}

