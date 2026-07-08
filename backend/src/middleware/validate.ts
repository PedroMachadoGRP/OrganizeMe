import { Request, Response, NextFunction } from "express";
import { AnyZodObject, ZodError } from "zod/v3";
import { z, ZodObject } from 'zod';

export function validate(schema: ZodObject) {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({ body: req.body, params: req.params, query: req.query, });
            next()
        } catch (error) {

            if (error instanceof ZodError) {
                return res.status(422).json({
                    message: 'Dados Inválidos',
                    errors: error.errors.map(e => ({
                        field: e.path.slice(1).join('.'),
                        message: e.message,
                    })),
                })
            }
            next(error)
        }
    }
}

