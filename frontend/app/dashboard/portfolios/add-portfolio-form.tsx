"use client";
import { usePortfoliosStore } from "@/hooks/use-portfolios";
import { useUser } from "@/hooks/use-user";
import { Button } from "@/shadcn/ui/button";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel } from "@/shadcn/ui/form";
import { Input } from "@/shadcn/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Name is required",
    }),
    description: z.string().min(1, {
        message: "Description is required",
    }),
})

function AddPortfolioForm() {
    const user = useUser((state) => state.user);
    const setLastUpdated = usePortfoliosStore((state) => state.setLastUpdated);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            description: "",
        },
    });

    function onSubmit(values: z.infer<typeof formSchema>) {
        const randomId = Math.random().toString(36).substring(2, 15);

        fetch(`/api/user/portfolios/${user?.email}/${randomId}`, {
            method: "PUT",
            body: JSON.stringify(values),
            headers: {
                "Content-Type": "application/json",
            },
        }).then((response) => {
            if (response.ok) {
                form.reset();
                toast.success("Portfolio created successfully", {
                    richColors: true,
                    position: "top-center",
                });
            } else {
                toast.error("Portfolio already exists", {
                    richColors: true,
                    position: "top-center",
                });
            }
        });

        setLastUpdated();
    }

    return (
        <div
            className="w-full flex flex-col gap-4 items-center"
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-1/2 max-w-[600px]">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Portfolio Name" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Create a name for your portfolio.
                                </FormDescription>
                            </FormItem>
                        )}
                    ></FormField>
                    <FormField
                        control={form.control}
                        name="description"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Description</FormLabel>
                                <FormControl>
                                    <Input placeholder="Portfolio Description" {...field} />
                                </FormControl>
                                <FormDescription>
                                    Create a description for your portfolio.
                                </FormDescription>
                            </FormItem>
                        )}
                    ></FormField>
                    <Button type="submit" className="cursor-pointer">Create Portfolio</Button>
                </form>
            </Form>
        </div>
    )
}

export default AddPortfolioForm;