import z from 'zod'

export const registerSchema=
        z.object({
            email:z.string().email(),
            password:z.string().min(3),
            username:z.string()
            .min(3,"Username must be atleast 3 characters")
            .max(63,"Username must be less than 63 characters")
            .regex(
                /^[a-z0-9][a-z0-9-]*[a-z0-9]$/,
                "Username can only contain lowercase letters numbers and hyphens.It must start and end with a letter or a number"
            )
            .refine(
                (val)=>!val.includes("--"),
                "Username cannot contain consecutive hyphens"
            )
            .transform((val)=>val.toLowerCase()),
        })

export const loginSchema=  z.object({
            email:z.string().email(),
            password:z.string(),
        })
