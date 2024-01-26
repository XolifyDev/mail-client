import { axios } from "..";
import { z } from "zod";

const registerUserSchema = z.object({
    firstName: z.string(),
    lastName: z.string(),
    email: z.string().email(),
    password: z.string(),
    imap_server: z.string(),
    imap_port: z.string().or(z.number()),
    smtp_server: z.string(),
    smtp_port: z.string().or(z.number())
}) 

export const registerUser = async (data: z.infer<typeof registerUserSchema>) => {
    if(!registerUserSchema.safeParse(data).success) return {
        error: registerUserSchema.safeParse(data).error
    } 
    const response = await axios.post('/auth/register', data).catch(err => {
        console.log(err);
    });
    return {
        data: response.data
    };
}

const loginUserSchema = z.object({
    email: z.string().email(),
    password: z.string()
});

export const loginUser = async (data: z.infer<typeof loginUserSchema>) => {
    if(!loginUserSchema.safeParse(data).success) return {
        error: loginUserSchema.safeParse(data).error
    } 
    const response = await axios.post('/auth/login', data).catch(err => {
        console.log(err);
    });
    return {
        data: response.data
    };
}