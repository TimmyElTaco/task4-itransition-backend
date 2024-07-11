import express, { Response } from "express"
import { PrismaClient } from '@prisma/client'
import bcrypt from "bcrypt"
import { generateJWT } from "../helpers/generateJWT";


interface LoginUserReq {
    email: string;
    password: string;
}

interface CreateUserReq {
    email: string;
    password: string;
    name: string;
}


const prisma = new PrismaClient();

export const login = async (req: express.Request<{}, {}, LoginUserReq>, res: Response) => {
    const { email, password } = req.body;

    if (!email) {
        return res.status(401).json({ msg: "Email is required" });
    }

    if (!password) {
        return res.status(401).json({ msg: "Password is required" });
    }

    try {
        const user = await prisma.user.findFirst({ where: { email } });

        if (!user) {
            return res.status(404).json({ msg: "The user don't exist" });
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ msg: "The password is incorrect" });
        }

        if(!user.status) {
            return res.status(401).json({msg: "The user is banned"});
        }

        await prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date()
            }
        })

        const token = generateJWT(user.id);

        res.status(200).json({ msg: "Logged succesfully", token, id: user.id });

    } catch (error) {
        console.log(error);

        res.status(500).json({ msg: "Failed in the process of login" })
    }

}

export const register = async (req: express.Request<{}, {}, CreateUserReq>, res: Response) => {
    const { email, name, password } = req.body;

    const regexEmail = /^\S+@\S+\.\S+$/;

    if (!regexEmail.test(email)) {
        return res.status(401).json({ msg: "Invalid email format" });
    }

    if (!name) {
        return res.status(401).json({ msg: "The name is required" });
    }

    if (!password) {
        return res.status(401).json({ msg: "Your password should have at least 1 character" });
    }

    try {
        const userExist = await prisma.user.findFirst({ where: { email } });

        if (userExist) {
            return res.status(400).json({ msg: "User already exist" });
        }

        const hashPassword = bcrypt.hashSync(password, 10);

        await prisma.user.create({
            data: {
                email,
                name,
                password: hashPassword,
            }
        })

        return res.json({ msg: "Account created succesfully" });
    } catch (error) {
        console.log(error);

        res.status(500).json({ msg: "Error creating the user" });
    }
}