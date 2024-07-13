import { PrismaClient } from "@prisma/client";
import express, { NextFunction, Response } from "express";

class UserController {
    private prisma = new PrismaClient();

    async getUsers(req: any, res: Response) {
        try {
            const allUsers = await this.prisma.user.findMany({
                select: {
                    id: true,
                    name: true,
                    email: true,
                    lastLogin: true,
                    status: true,
                },
            });
            const user = req.user;
            return res.status(200).json({ msg: "Users loaded successfully", allUsers, user });
        } catch (error) {
            console.log(error);

            return res.status(500).json({ msg: "Failed loading the users" });
        }
    }

    async blockUsers (req: express.Request<{}, {}, string[]>, res: Response) {
        const usersID = req.body;
        try {
            await this.prisma.user.updateMany({
                where: { id: { in: usersID } },
                data: { status: false }
            });
            return res.status(200).json({ msg: "Users banned successfully" });
        } catch (error) {
            return res.status(500).json({ msg: "Error banning the users" })
        }
    }

    async deleteUsers (req: express.Request<{}, {}, string[]>, res: Response) {
        const usersID = req.body;
        
        try {
            await this.prisma.user.deleteMany({ 
                where: { id: { in: usersID } }
            });
            return res.status(200).json({ msg: "Users deleted successfully" });
        } catch (error) {
            return res.status(500).json({ msg: "Error deleting the users" })
        }
    }

    async unblockUsers (req: express.Request<{}, {}, string[]>, res: Response) {
        const usersID = req.body;

        try {
            await this.prisma.user.updateMany({
                where: { id: { in: usersID } },
                data: { status: true }
            });
            return res.status(200).json({ msg: "Users unbanned successfully" });

        } catch (error) {
            return res.status(500).json({ msg: "Error banning the users" })
        }
    }

    checkUsersID(req: express.Request<{}, {}, string[]>, res: Response, next: NextFunction) {
        const usersID = req.body;
        if (!usersID.length) {
            return res.status(404).json({ msg: "No users to unblock" })
        }
        next();
    }
}

export const userController = new UserController();