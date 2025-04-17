"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/shadcn/ui/form"
import { Input } from "@/shadcn/ui/input"
import { useEffect, useState } from "react"
import Submit from "../submit"
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { useUser } from "@/hooks/use-user"
import User from "@/models/user-model"

const SignUpSchema = z.object({
    name: z.string().min(1, { message: "Name must be at least 1 character" }),
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string()
        .min(8, { message: "Password must be at least 8 characters." })
        .regex(/[0-9]/, { message: "Password must contain at least one number." })
        .regex(/[!@#$%^&*(),.?":{}|<>]/, { message: "Password must contain at least one special character." }),
    confirmPassword: z.string(),
}).superRefine((data, ctx) => {
    if (data.password !== data.confirmPassword) {
        ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Passwords do not match.",
            path: ["confirmPassword"],
        });
    }
})

const LogInSchema = z.object({
    email: z.string().email({ message: "Invalid email address." }),
    password: z.string().min(8, { message: "Password must be at least 8 characters." }),

})

export enum AuthFormType {
    SignUp = 0,
    LogIn = 1,
}

export function AuthForm({ type }: { type: AuthFormType }) {
    const FormSchema = type === AuthFormType.SignUp ? SignUpSchema : LogInSchema
    const [showPassword, setShowPassword] = useState<boolean>(false)
    const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
    const setUser = useUser((state) => state.setUser);
    const router = useRouter();

    useEffect(() => { }, [isSubmitting])

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: type === AuthFormType.SignUp ? {
            name: "",
            email: "",
            password: "",
            confirmPassword: "",
        } : {
            email: "",
            password: "",
        },
    })

    function onSubmit(data: z.infer<typeof FormSchema>) {
        setIsSubmitting(true)

        if (type === AuthFormType.SignUp && "name" in data)
            fetch("/api/user", {
                method: "PUT",
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                    name: data.name,
                    registered: false,
                }),
                headers: {
                    "Content-Type": "application/json",
                }
            }).then((response => {
                    if (response.ok) {
                    toast.success("Success", {
                        richColors: true,
                        description: "Signing up...",
                        position: "top-center",
                    })
                    fetch("/api/user/verify", {
                        method: "POST",
                        body: JSON.stringify({
                            email: data.email,
                            password: data.password,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        },
                    }).then((response) => {
                        if (response.ok) {
                            setTimeout(() => { router.push("/dashboard?newuser=true") }, 0);
                        } else {
                            toast.error("Failure: Failed to login. Try again.", {
                                description: "Unknown error occurred.",
                                richColors: true,
                                position: "top-center",
                            })
                            setIsSubmitting(false)
                        }
                    }
                    )

                } else {
                    toast.error("Failure: Failed to signup. Try again.", {
                        description: "Invalid email or password.",
                        richColors: true,
                        position: "top-center",
                    })
                    setIsSubmitting(false)
                }
            }
            ));

        else
            fetch("/api/user", {
                method: "POST",
                credentials: "include",
                body: JSON.stringify({
                    email: data.email,
                    password: data.password,
                }),
                headers: {
                    "Content-Type": "application/json",
                },
            }).then(async (response) => {
                if (response.ok) {
                    toast.success("Success", {
                        richColors: true,
                        description: "Logging in...",
                        position: "top-center",
                    });
                    const newUser = await response.json();
                    setUser({...newUser, email: data.email });
                    setTimeout(() => { router.push("/dashboard") }, 2000);
                    
                } else {
                    toast.error("Failure: Failed to login. Try again.", {
                        description: "Invalid email or password.",
                        richColors: true,
                        position: "top-center",
                    })
                    setIsSubmitting(false)
                }
            })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="w-2/3 space-y-6">
                {type === AuthFormType.SignUp && (
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="ex. John Doe" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Enter your name.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )}
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="ex. me@stocksensai.com" {...field} />
                            </FormControl>
                            <FormDescription>
                                Enter your email.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Password</FormLabel>
                            <div className="flex flex-row items-center gap-2 justify-apart">
                                <FormControl>
                                    <Input placeholder="8 Characters including Special and Numbers" {...field} type={showPassword ? "text" : "password"} />
                                </FormControl>
                                <p className="underlined cursor-pointer select-none" onClick={() => setShowPassword(!showPassword)}>{!showPassword ? "Show" : "Hide"}</p>
                            </div>
                            <FormDescription>
                                {type === AuthFormType.SignUp ? "Create a strong password." : "Enter your password."}
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                {type === AuthFormType.SignUp && (
                    <FormField
                        control={form.control}
                        name="confirmPassword"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Confirm Password</FormLabel>
                                <FormControl>
                                    <Input placeholder="********" {...field} type="password" />
                                </FormControl>
                                <FormDescription>
                                    Reenter your password.
                                </FormDescription>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                )
                }
                <Submit isSubmitting={isSubmitting} />
            </form>
        </Form>
    )
}

