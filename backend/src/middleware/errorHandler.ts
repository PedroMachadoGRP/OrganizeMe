import { Request, Response, NextFunction } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
    console.error({ message: err.message, stack: err.stack, url: req.url, method: req.method });

    const isDev = process.env.NODE_ENV === 'development';

    res.status(500).json({
        message: isDev ? err.message : 'Erro interno no servidor', ...(isDev && { stack: err.stack }),
    })

}