import { io } from "./http";
import prisma from "../prisma/prisma";
import IChatObject from "./interfaces/IChatObject";

io.on("connection", socket => {

    socket.on("create-room", async (data: IChatObject) => {
      
    })

})