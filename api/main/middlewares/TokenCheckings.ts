import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import prisma from '../../prisma/prisma';
import { Unauthorized } from '../CustomErrors/exceptions';

const TokenCheckings = async (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) throw new Unauthorized('Authorization header is missing');

        const token = authHeader.split(' ')[1];
        if (!token) throw new Unauthorized('Token not provided');

        const isTokenBlacklisted = await prisma.blackToken.findFirst({ where: { token } });
        if (isTokenBlacklisted) throw new Unauthorized('Token blacklisted');

        jwt.verify(token, process.env.JWT_SECRET!);

        next();

    } catch (error) {
        if (error instanceof jwt.JsonWebTokenError) {
            await prisma.blackToken.create({ data: { token: req.headers.authorization!.split(' ')[1] } });
            return next(new Unauthorized('Invalid or expired token'));
        }

        return next(error);
    }
};

export default TokenCheckings;
