import express, { Response } from "express"
import { PrismaClient, User } from '@prisma/client'
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken";


interface LoginUserReq {
    email: string;
    password: string;
}

interface CreateUserReq {
    email: string;
    password: string;
    name: string;
}

class AuthController {
    private prisma = new PrismaClient();
    
    async login(req: express.Request<{}, {}, LoginUserReq>, res: Response) {
        const { email, password } = req.body;
        const validationRequest = this.validateLoginRequest(email, password);
        if(!validationRequest.ok) {
            return res.status(401).json({ msg: validationRequest.msg })
        }
        try {
            const user = await this.prisma.user.findFirst({ where: { email } });
            const validationLogin = this.validateLogin(user, password);
            if(!validationLogin.ok) {
                return res.status(401).json({msg: validationLogin.msg});
            }
            await this.updateLastLogin(user);
            const token = this.generateJWT(user.id);
            res.status(200).json({ msg: "Logged succesfully", token, id: user.id });
        } catch (error) {
            console.log(error);
            res.status(500).json({ msg: "Failed in the process of login" })
        }
    
    }

    validateLoginRequest(email: string, password: string): {ok: boolean, msg?: string} {
        if (!email) {
            return { ok: false, msg: "Email is required" }
        }
        if (!password) {
            return { ok: false, msg: "Password is required" }
        }
        return { ok: true }
    }

    validateLogin(user: User, password: string): {ok: boolean, msg?: string} {
        if (!user) {
            return { ok: false, msg: "The user don't exist" }
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return { ok: false, msg: "The password is incorrect" }
        }
        if(!user.status) {
            return { ok: false, msg: "The user is banned" }
        }
        return { ok: true }
    }

    generateJWT(id: string): string {
        return jwt.sign({ id }, process.env.PRIVATE_KEY_JWT, {
          expiresIn: '7d'
        });
    }

    async updateLastLogin(user: User) {
        await this.prisma.user.update({
            where: { id: user.id },
            data: {
                lastLogin: new Date()
            }
        })
    }
    
    async register (req: express.Request<{}, {}, CreateUserReq>, res: Response) {
        const { email, name, password } = req.body;
        const validationRequest = this.validateRegisterRequest(email, name, password);
        if(!validationRequest.ok) {
            return res.status(401).json({msg: validationRequest.msg});
        }
        try {
            const validationExist = await this.checkUserExist(email);
            if(!validationExist.ok) {
                return res.status(401).json({ msg: validationExist.msg })
            }
            await this.saveUser(email, name, password);
            return res.json({ msg: "Account created succesfully" });
        } catch (error) {
            console.log(error);
    
            res.status(500).json({ msg: "Error creating the user" });
        }
    }

    validateRegisterRequest(email: string, name: string, password: string): {ok: boolean, msg?: string} {
        const regexEmail = /^\S+@\S+\.\S+$/;
        if (!regexEmail.test(email)) {
            return { ok: false, msg: "Invalid email format" }
        }
        if (!name) {
            return { ok: false, msg: "The name is required" }
        }
        if (!password) {
            return { ok: false, msg: "Your password should have at least 1 character" }
        }
        return { ok: true }
    }

    async checkUserExist(email: string) {
        const userExist = await this.prisma.user.findFirst({ where: { email } });
        if (userExist) {
            return { ok: false, msg: "User exist" }
        }
        return { ok: true }
    }

    async saveUser(email: string, name: string, password: string) {
        const hashPassword = bcrypt.hashSync(password, 10);
        await this.prisma.user.create({
            data: {
                email,
                name,
                password: hashPassword,
            }
        })
    }
}

export const authController = new AuthController();