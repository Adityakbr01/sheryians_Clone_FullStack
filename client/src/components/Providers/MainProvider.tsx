"use client";
import React from "react";
import { TanStackProvider } from "./tanstack-provider";
import ReactToast from "./ReactToast";

function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="max-w-8xl mx-auto w-full h-full">
      <TanStackProvider>
        {children}
        <ReactToast />
      </TanStackProvider>

    </main>
  );
}

export default MainProvider;
