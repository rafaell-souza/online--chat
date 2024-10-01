import prisma from "../../prisma/prisma";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import IChatObject from "../interfaces/IChatObject";
import "dotenv/config";
import chatSchema from "../schemas/Chat";
import { BadRequest } from "../CustomErrors/exceptions";
import ChatCases from "../UseCases/chat";

export default class CreateChat {
    static async execute (
        req: Request,
        res: Response
    ) {
        const { name, description, capacity, language }: IChatObject = req.body;
        const token = req.headers!.authorization!.split(" ")[1];

        const user = jwt.decode(token) as { id: string };

        const chatData = { name, description, capacity, language };

        const { error } = chatSchema.safeParse(chatData);

        if (error) throw new BadRequest(error.errors[0].message);

        const chatId = await ChatCases.createChat(chatData, user.id);

        return res.status(201).json({ chatId });
    }
}