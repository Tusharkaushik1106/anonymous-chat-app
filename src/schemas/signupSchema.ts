import z from "zod";

export const usernameValidation = z
    .string()
    .min(2, 'Username must be atleast 2 characters')
    .max(20,'Must be no more than 20 Characters')
    .regex(/^[a-zA-Z0-9_]+$/,"Username must not conatin special characters")

export const signupSchema = z.object({
    username: usernameValidation,
    email: z.string().email({message:"invalid email address"}),
    password : z.string().min(6,{message:"password must be atleast 6 characters"})


})