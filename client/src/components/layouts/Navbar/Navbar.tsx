"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Squeeze as Hamburger } from "hamburger-react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { BASE_LINKS, CLASSROOM_LINK, PROFILE_LINK, SIGNIN_LINK } from "./typesAndData";



export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const [isOpen, setOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState(0);
  const [visible, setVisible] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // 🧭 Links Memo — no mutation
  const navLinks = useMemo(() => {
    const links = [...BASE_LINKS];
    if (user) {
      if (user.enrolledCourses) links.push(CLASSROOM_LINK);
      links.push(PROFILE_LINK);
    } else {
      links.push(SIGNIN_LINK);
    }
    return links;
  }, [user]);

  // 🧭 Optimized Scroll behavior
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
          setPrevScrollPos(currentScrollPos);
          setScrolled(currentScrollPos > window.innerHeight * 0.1);
          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`flex w-full text-white px-4 md:px-8 fixed z-[1000] left-1/2 -translate-x-1/2 top-0 py-2 md:py-4 mx-auto justify-between items-center transition-transform duration-300 
        ${visible ? "translate-y-0" : "md:-translate-y-[20vh]"} 
        ${scrolled ? "backdrop-blur-[4px]" : ""}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 transition-none">
        <div className="flex items-center w-9 h-9 md:w-10 md:h-10">
          <Image
            src="/images/sherry_light-logo.webp"
            alt="Sheryians Logo"
            width={35}
            height={35}
          />
        </div>
        <h3 className="font-NeuMachina leading-5">
          Sheryians <br /> coding school
        </h3>
      </Link>

      {/* Desktop Nav */}
      <div className="hidden md:flex items-center">
        <ul className="flex items-center md:gap-6 lg:gap-10 text-sm font-light font-NeuMachina">
          {navLinks.map((link, idx) => (
            <Link
              href={link.href}
              key={idx}
              className={`cursor-pointer flex items-center gap-2 ${link.bgColor ? "px-5 py-1 font-medium text-base rounded-sm shine font-HelveticaNow" : ""
                } ${link.textColor ? "font-bold" : ""} ${link.className || ""}`}
              style={{
                background: link.bgColor,
                color: link.textColor || "inherit",
              }}
            >
              {link.isProfile ? (
                <Image
                  src={"https://cdn-icons-png.flaticon.com/128/1326/1326390.png"}
                  alt="Profile"
                  width={35}
                  height={35}
                  className="rounded-full object-cover"
                />
              ) : (
                link.value
              )}
            </Link>
          ))}
        </ul>
      </div>

      {/* Mobile Toggle */}
      <div
        className="relative z-50 block md:hidden text-white"
        onClick={() => setOpen(!isOpen)}
      >
        <Hamburger size={22} toggled={isOpen} toggle={setOpen} />
      </div>

      {/* Mobile Menu */}
      <div
        className={`absolute md:hidden ${isOpen ? "right-0" : "right-[-100%]"
          } w-full h-screen bg-[#0C0C0C] text-white top-0 transition-all duration-300 ease-in-out`}
      >
        <div className="w-full p-6 border-b border-white flex justify-between items-center">
          <h1 className="text-2xl font-NeuMachina">Menu</h1>
        </div>
        <ul className="flex flex-col items-start gap-6 p-8 text-2xl font-light text-white opacity-70 font-NeuMachina">
          {navLinks.map((link, idx) => (
            <Link
              href={link.href}
              key={idx}
              onClick={() => setOpen(false)}
              className={`cursor-pointer flex items-center gap-2 ${link.className || ""}`}
              style={{ color: link.textColor || "white" }}
            >
              {link.isProfile ? (
                <Image
                  src={"https://cdn-icons-png.flaticon.com/128/1326/1326390.png"}
                  alt="Profile"
                  width={45}
                  height={45}
                  className="rounded-full object-cover"
                />
              ) : (
                link.value
              )}
            </Link>
          ))}
        </ul>
      </div>
    </nav>
  );
}
