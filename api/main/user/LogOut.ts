import { Request, Response } from 'express';
import TokenCases from '../UseCases/token';

export default class LogOut {
    static async execute(req: Request, res: Response) {
        const token = req.headers.authorization!.split(' ')[1];
        await TokenCases.invalidateToken(token);
        return res.status(200).end();
    }
}