import { PrismaClient } from "@prisma/client";
import express, { Response } from "express";

const prisma = new PrismaClient();

export const getUsers = async (req: any, res: Response) => {
    try {
        const allUsers = await prisma.user.findMany({
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
};

export const blockUsers = async (req: express.Request<{}, {}, string[]>, res: Response) => {
    const usersID = req.body;

    if(!usersID) {
        return res.status(404).json({msg: "No users to block"})
    }

    try {
        
        await prisma.user.updateMany({
            where: {
                id: {
                    in: usersID
                }
            },
            data: {
                status: false
            }
        });

        return res.status(200).json({ msg: "Users banned successfully" });

    } catch (error) {
        return res.status(500).json({msg: "Error banning the users"})
    }
}

export const deleteUsers = async (req: express.Request<{}, {}, string[]>, res: Response) => {
    const usersID = req.body;

    if(!usersID) {
        return res.status(404).json({msg: "No users to delete"})
    }

    try {
        
        await prisma.user.deleteMany({
            where: {
                id: {
                    in: usersID
                }
            }
        });

        return res.status(200).json({ msg: "Users deleted successfully" });

    } catch (error) {
        return res.status(500).json({msg: "Error deleting the users"})
    }
}

export const unblockUsers = async (req: express.Request<{}, {}, string[]>, res: Response) => {
    const usersID = req.body;

    if(!usersID) {
        return res.status(404).json({msg: "No users to unblock"})
    }

    try {
        
        await prisma.user.updateMany({
            where: {
                id: {
                    in: usersID
                }
            },
            data: {
                status: true
            }
        });

        return res.status(200).json({ msg: "Users unbanned successfully" });

    } catch (error) {
        return res.status(500).json({msg: "Error banning the users"})
    }
}

