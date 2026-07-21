import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export function validate(schema: ZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await schema.parseAsync({
        body: req.body,
        params: req.params,
        query: req.query,
      });

      next()

    } catch (error) {

      if (error instanceof ZodError) {


        return res.status(422).json({
          message: "Dados Inválidos",
          errors: error.issues.map(issue => ({
            field: issue.path.slice(1).join("."),
            message: issue.message,
          })),
        });
      }

      next(error);
    }
  };
}