import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { Unauthorized } from '../CustomErrors/exceptions';
import TokenCases from '../UseCases/token';
import UserCases from '../UseCases/user';

const HttpAuthenticationMiddlewware = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) return next(new Unauthorized('unauthorized connection'));

        const token = authHeader.split(' ')[1];
        if (!token) return next(new Unauthorized('unauthorized connection'));

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const usercases = new UserCases();
        const user = await usercases.getUserById(decoded.id);

        if (!user) return next(new Unauthorized('unauthorized connection'));

        const isTokenBlacklisted = await TokenCases.isTokenBlacklisted(token);
        if (isTokenBlacklisted) return next(new Unauthorized('unauthorized connection'));

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            await TokenCases.invalidateToken(req.headers.authorization!.split(' ')[1]);
            return next(new Unauthorized('Invalid or expired token'));
        }

        return next(error);
    }
};

export default HttpAuthenticationMiddlewware;
