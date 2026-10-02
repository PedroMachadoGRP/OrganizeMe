import { Request, Response, NextFunction } from "express";
import { ZodObject, ZodError } from "zod";

export function validate(schema: ZodObject) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const parsed = await schema.parseAsync({ body: req.body, params: req.params, query: req.query });
      req.body = parsed.body;
      req.params = parsed.params as any;

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