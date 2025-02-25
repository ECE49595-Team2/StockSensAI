import { Drawer, DrawerContent, DrawerHeader, DrawerTrigger } from "@/shadcn/ui/drawer";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/shadcn/ui/tabs";
import { DialogTitle } from "@radix-ui/react-dialog";
import { AuthForm, AuthFormType } from "@/components/auth/auth-form";

function AuthDrawer({ children }: { children: React.ReactNode }) {
    return (
        <Drawer>
            <DrawerTrigger asChild>
                {children}
            </DrawerTrigger>
            <DrawerContent className="w-full h-[90svh] flex flex-col items-center gap-5">
                <DialogTitle className="text-4xl font-anton">
                    Let's get started
                </DialogTitle>

                <Tabs defaultValue="login" className="flex flex-col w-full h-full items-center overflow-scroll mb-5">
                    <TabsList className="h-[3rem] shadow-xl shadow-orange shadow-blur-md flex gap-5">
                        <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white w-[9rem] h-[2.5rem] shadow-xl shadow-black shadow-blur-md">Login</TabsTrigger>
                        <TabsTrigger value="signup" className="data-[state=active]:bg-primary data-[state=active]:text-white w-[9rem] h-[2.5rem]">Signup</TabsTrigger>
                    </TabsList>
                    <TabsContent value="login" className="h-full w-screen flex flex-col items-center gap-5">
                        <DrawerHeader>
                            <h1 className="font-geist-mono font-bold text-xl">Login</h1>
                        </DrawerHeader>

                        <AuthForm type={AuthFormType.LogIn} />
                    </TabsContent>
                    <TabsContent value="signup" className="flex flex-col w-full h-full items-center">
                        <DrawerHeader>
                            <h1 className="font-geist-mono font-bold text-xl">Signup</h1>
                        </DrawerHeader>
                        <AuthForm type={AuthFormType.SignUp} />
                    </TabsContent>
                </Tabs>

            </DrawerContent>
        </Drawer>
    )
}

export default AuthDrawer;