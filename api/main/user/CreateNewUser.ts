import "dotenv/config";
import { Request, Response } from "express";
import { BadRequest, Conflict } from "../CustomErrors/exceptions";
import INewUser from "../interfaces/INewUser";
import UserCases from "../UseCases/user"
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import NewUserSchema from "../schemas/NewUser"

export default class CreateNewUser {
    static async execute (
        req: Request,
        res: Response
    ) {
        const { name, email, password, confirmPassword }: INewUser = req.body;
        const data = { name, email, password, confirmPassword };

        const { error } = NewUserSchema.safeParse(data);

        if (error) throw new BadRequest(error.errors[0].message);

        const isUserRegistered = await new UserCases().checkEmail(email.toLowerCase());
        
        if (isUserRegistered) throw new Conflict("User already registered");

        data.password = await bcrypt.hash(password, 10);
        data.email = email.toLowerCase()

        const newUser = await new UserCases().createUser(data);

        const secret = process.env.JWT_SECRET!

        const token = jwt.sign({ id: newUser.id }, secret, {
            expiresIn: "2h",
        });

        return res.status(201).json({ token });
    }
}