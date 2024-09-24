import prisma from "../../prisma/prisma";
import INewUser from "../interfaces/INewUser";
import { v4 as uuidv4 } from "uuid";

export default class UserCases {
    async createUser(data: INewUser) {
        return prisma.user.create({
            data: {
                id: uuidv4(),
                email: data.email,
                name: data.name,
                password: data.password,
            },
        });
    }

    async checkEmail(email: string) {
        return prisma.user.findUnique({
            where: {
                email: email,
            },
        });
    }
}