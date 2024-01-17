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
        message: registerUserSchema.safeParse(data).error
    } 
    console.log(data);
    // return data;
    const response = await axios.post('/auth/register?test=' + data.email, data).catch(err => {
        console.log(err);
    });
    return {
        data: response.data
    };
}