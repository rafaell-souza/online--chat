import { Request, Response } from 'express';
import ChatCases from '../UseCases/chat';
import searchSchema from "../schemas/search";
import { BadRequest } from '../CustomErrors/exceptions';

export class SearchChat {
    static async execute(
        req: Request,
        res: Response
    ) {
        const { query, by } = req.query as { query: string, by: string }
        const userid = req.params.userid;

        const schema = {query, by}

        const { error } = searchSchema.safeParse(schema)

        if (error) throw new BadRequest(error.errors[0].message)

        const chatCases = new ChatCases(userid)
        const chat = await chatCases.searchChat(query, by)

        res.status(200).json({
            chat: chat ? chat : []
        })
    }
}