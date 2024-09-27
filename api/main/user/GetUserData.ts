import "dotenv/config";
import { Request, Response } from "express";
import { BadRequest } from "../CustomErrors/exceptions";
import UserCases from "../UseCases/user"
import jwt from "jsonwebtoken";

export default class GetUserData {
    static async execute (
        req: Request,
        res: Response 
    ) {
        const token = req.headers!.authorization!.split(" ")[1];
        const userId = jwt.decode(token) as { id: string };

        const userCases = new UserCases();
        const user = await userCases.getUserById(userId.id);

        if (!user) throw new BadRequest("User not found");

        res.status(200).json(user);
    }
}