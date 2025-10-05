"use client"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AuthStrategies from "../AuthPageComponents/AuthStrategies/AuthStrategies";
import EmailSignInForm from "../AuthPageComponents/signIn/EmailSignInForm";
import PhoneSignInForm from "../AuthPageComponents/signIn/PhoneSignInForm";

const tabs = [
  {
    id: 1,
    value: "account",
    label: "Phone",
    content: <PhoneSignInForm />,
    isAvailable: false,
  },
  {
    id: 2,
    value: "password",
    label: "Email",
    content: <EmailSignInForm />,
    isAvailable: true,
  },
];

function SignIn() {
  return (
    <div className="form-container flex flex-col items-center md:justify-between justify-center gap-8 w-full py-8 p-6">
      {/* Top */}
      <div className="top flex flex-col gap-4 w-full max-w-[400px]">
        <h1 className="text-4xl text-[var(--custom-textColor)]">Sign In</h1>

        <Tabs defaultValue="password" className="w-full md:w-[400px]">
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
      <AuthStrategies isSignupPage={false} />
    </div>
  );
}

export default SignIn;
