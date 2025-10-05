"use client"
import React from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import PhoneSignInForm from "../AuthPageComponents/PhoneSignInForm"
import EmailSignInForm from "../AuthPageComponents/EmailSignInForm"
import AuthStrategies from "../AuthPageComponents/AuthStrategies"

function Auth() {
  return (
    <div className="form-container flex flex-col items-center justify-between gap-8 p-6">
      {/* Top */}
      <div className="top flex flex-col gap-4">
        <h1 className="text-4xl text-[var(--custom-textColor)]">
          Sign In
        </h1>
        <Tabs defaultValue="account" className="w-[400px]">
          <TabsList className="bg-transparent text-white flex gap-6 justify-center">
            <TabsTrigger value="account" className="text-white">
              Phone
            </TabsTrigger>
            <TabsTrigger value="password" className="text-white">
              Email
            </TabsTrigger>
          </TabsList>

          {/* Phone Tab */}
          <TabsContent value="account">
            <PhoneSignInForm />
          </TabsContent>

          {/* Email Tab */}
          <TabsContent value="password">
            <EmailSignInForm />
          </TabsContent>
        </Tabs>
      </div>

      {/* Divider */}
      <div className="flex items-center w-full max-w-[400px] gap-2">
        <div className="flex-1 h-[1px] bg-[#3c3c3c]" />
        <p className="text-sm font-light text-gray-400">OR</p>
        <div className="flex-1 h-[1px] bg-[#3c3c3c]" />
      </div>

      {/* Strategies */}
      <AuthStrategies />
    </div>
  )
}

export default Auth
