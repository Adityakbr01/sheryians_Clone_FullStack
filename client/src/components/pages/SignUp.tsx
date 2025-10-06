"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";
import AuthStrategies from "../AuthPageComponents/AuthStrategies/AuthStrategies";
import EmailSignUpForm from "../AuthPageComponents/signup/EmailSignUpForm";
import PhoneSignUpForm from "../AuthPageComponents/signup/PhoneSignUpForm";

const tabs = [
    {
        id: 1,
        value: "account",
        label: "Phone",
        content: <PhoneSignUpForm />,
        isAvailable: false,
    },
    {
        id: 2,
        value: "password",
        label: "Email",
        content: <EmailSignUpForm />,
        isAvailable: true,
    },
];

function SignUp() {

    return (
        <div className="form-container flex flex-col items-center md:justify-between justify-center w-full gap-8 py-8 p-6">
            {/* Top */}
            <div className="top flex flex-col gap-4 w-full max-w-[400px]">
                <h1 className="text-4xl text-[var(--custom-textColor)]">
                    Sign Up
                    <p className="text-[1.1rem] font-light text-gray-400 mt-2">
                        Already have an account?{" "}
                        <Link href={"/signin"} className="text-blue-600 cursor-pointer">
                            Sign In
                        </Link>
                    </p>
                </h1>

                <Tabs defaultValue="password" className="w-full md:w-[400px] text-white">
                    <TabsList className="bg-transparent text-white flex gap-6 justify-center">
                        {tabs.map((tab) => (
                            <div
                                key={tab.id}
                                className={`relative group ${!tab.isAvailable ? "cursor-not-allowed" : ""}`}
                            >
                                <TabsTrigger value={tab.value} disabled={!tab.isAvailable} className="text-white">
                                    {tab.label}
                                </TabsTrigger>
                            </div>
                        ))}
                    </TabsList>

                    {tabs.map((tab) => (
                        <TabsContent key={tab.id} value={tab.value}>
                            {tab.content}
                        </TabsContent>
                    ))}
                </Tabs>
            </div>

            {/* Divider */}
            <div className="flex items-center w-full max-w-[400px] gap-2">
                <div className="flex-1 h-[1px] bg-[#3c3c3c]" />
                <p className="text-sm font-light text-gray-400">OR</p>
                <div className="flex-1 h-[1px] bg-[#3c3c3c]" />
            </div>

            {/* Strategies */}
            <AuthStrategies isSignupPage={true} />
        </div>
    );
}

export default SignUp;
