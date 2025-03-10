import { Suspense } from "react";
import Title from "./components/title";

function RegisterPage() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen py-2">
        <Suspense fallback={<div>Loading...</div>}>
            <Title />
        </Suspense>
        <p className="mt-4 text-lg">This is the register page.</p>
        </div>
    );
}

export default RegisterPage;