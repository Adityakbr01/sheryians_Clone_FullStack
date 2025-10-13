"use client";
import React from "react";
import { TanStackProvider } from "./tanstack-provider";
import ReactToast from "./ReactToast";
import { useInitUser } from "@/hooks/TanStack/queries/User/useInitUser";
import { SidebarProvider } from "../ui/sidebar";

function MainProvider({ children }: { children: React.ReactNode }) {
  useInitUser();
  return (
    <main
      className="max-w-8xl mx-auto w-full h-full">
      <TanStackProvider>
        <SidebarProvider>
          {children}
        </SidebarProvider>
        <ReactToast />
      </TanStackProvider>

    </main>
  );
}

export default MainProvider;
