"use client";
import React from "react";

function MainProvider({ children }: { children: React.ReactNode }) {
  return (
    <main
      className="max-w-8xl mx-auto w-full h-full">
      {children}
    </main>
  );
}

export default MainProvider;
