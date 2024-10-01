import "dotenv/config";
import { Request, Response } from "express";
import { BadRequest } from "../CustomErrors/exceptions";
import INewUser from "../interfaces/INewUser";
import UserCases from "../UseCases/user"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import loginUserSchema from "../schemas/LoginUser"

export default class LoginUser {
    static async execute (
        req: Request,
        res: Response
    ) {
        const { email, password }: INewUser = req.body;
        const data = { email, password };

        const { error } = loginUserSchema.safeParse(data);

        if (error) throw new BadRequest(error.errors[0].message);

        const isUserRegistered = await new UserCases().checkEmail(email.toLowerCase());

        if (!isUserRegistered || !(await bcrypt.compare(data.password, isUserRegistered.password))) {
            throw new BadRequest("Email or password is incorrect.");
        }

        const secret = process.env.JWT_SECRET!

        const token = jwt.sign({ id: isUserRegistered.id }, secret, {
            expiresIn: "1d",
        });

        return res.status(200).json({ token });
    }
}