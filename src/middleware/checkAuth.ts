import { PrismaClient } from "@prisma/client";
import express, { Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();

interface AuthReq extends express.Request {
    user: {
        name: string;
        id: string;
    }
}

export const checkAuth = async (
    req: AuthReq,
    res: Response,
    next: NextFunction
) => {
    let token: string;

    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        try {
            token = req.headers.authorization.split(" ")[1];

            const { id } = jwt.verify(token, process.env.PRIVATE_KEY_JWT) as {
                id: string;
                iat: number;
                exp: number;
            };

            req.user = await prisma.user.findFirst({ 
                where: { id },
                select: {
                    name: true,
                    id: true,
                }
             });

            return next();
        } catch (error) {
            console.log(error);
            return res.status(401).json({ msg: "Invalid token" });
        }
    }

    if (!token) {
        return res.status(401).json({ msg: "Token no exist" });
    }

    next();
};
