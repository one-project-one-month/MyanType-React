import * as z from "zod";

export const registerFormSchema = z.object({
  username: z
    .string()
    .min(2, { message: "Name must be at least 2 characters." }),
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters." }),
});

export const loginFormSchema = z.object({
  email: z.string().email({ message: "Invalid email address." }),
  password: z
    .string()
    .min(5, { message: "Password must be at least 5 characters." }),
});
