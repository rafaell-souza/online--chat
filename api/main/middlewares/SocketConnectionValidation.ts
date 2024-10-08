import * as SocketIO from 'socket.io';
import jwt from 'jsonwebtoken';
import { Unauthorized } from '../CustomErrors/exceptions';
import TokenCases from '../UseCases/token';
import UserCases from '../UseCases/user';
import "dotenv/config";

export default async function SocketConnectionValidation(
    socket: SocketIO.Socket,
    next: (err?: Error) => void
) {
    const token = socket.handshake.auth.token as string;

    try {
        if (!socket.handshake.auth.token) return next(new Unauthorized('Unauthorized connection'));

        if (!token) return next(new Unauthorized('Unauthorized connection'));

        const isTokenBlacklisted = await TokenCases.isTokenBlacklisted(token);
        if (isTokenBlacklisted) return next(new Unauthorized('Unauthorized connection'));

        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

        const usercases = new UserCases();
        const user = await usercases.getUserById(decoded.id);

        if (!user) return next(new Unauthorized('Unauthorized connection'));

        return next();
    }
    catch (err: any) {
        if (err instanceof jwt.JsonWebTokenError) {
            await TokenCases.invalidateToken(token);
            return next(new Unauthorized('Unauthorized connection'));
        }

        return next(err);
    }
}