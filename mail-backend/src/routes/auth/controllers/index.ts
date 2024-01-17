import { db } from "../../../db";
import { Request, Response } from "express";
import * as jwt from "jsonwebtoken";
import * as bcrypt from "bcrypt";

export const createUser = async (req: Request, res: Response) => {
    console.log(req.body);
    const { email, password, firstName, lastName, imap_server, imap_port, smtp_server, smtp_port } = req.body;

    console.log({ body: req.body });

    if(!email ||!password ||!firstName ||!lastName ||!imap_server ||!imap_port) return res.status(400).json({ error: "Missing required fields" });

    const emailExists = await db.user.findFirst({ where: { email: email } });

    if(emailExists) return res.status(400).json({ error: "Email already exists" });

    const passwordHash = await bcrypt.hash(password, 10);

    const user = await db.user.create({
        data: {
            email: email,
            password: passwordHash,
            firstName: firstName,
            lastName: lastName,
            imap_server: imap_server,
            imap_port: imap_port,
            smtp_server: smtp_server,
            smtp_port: smtp_port
        }
    })

    console.log(user);

    return res.status(201).json({ user });
};


export const loginUser = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if(!email ||!password) return res.status(400).json({ error: "Missing required fields" });

    const user = await db.user.findFirst({ where: { email: email } });

    if(!user) return res.status(400).json({ error: "Invalid email or password" });

    if(user.password!== password) return res.status(400).json({ error: "Invalid email or password" });

    const token = await jwt.sign({ id: user.id }, process.env.JWT_SECRET!);
    

    return res.status(200).json({ user, token });
};


export default {
    createUser,
    loginUser
}