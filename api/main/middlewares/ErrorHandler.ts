import { CustomError } from "../CustomErrors/exceptions";
import { Request, Response, NextFunction } from "express";

export const errorHandler = (
    error: CustomError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const message = error.message || "Something went wrong";
    const status = error.status || 500;

    res.status(status).json({ message });
    next();
}