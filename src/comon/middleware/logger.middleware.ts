import { NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";

export class LoggerMiddleware implements NestMiddleware {
    use(req: Request, res: Response, next: NextFunction) {
        const { user, headers } = req as any;
        const userId = user?.sub;
        console.log(headers)
        console.log(req)
        next();
    }
}