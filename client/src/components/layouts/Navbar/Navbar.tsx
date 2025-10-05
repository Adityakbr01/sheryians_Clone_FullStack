"use client";

import React, { useEffect, useState } from "react";
import { Squeeze as Hamburger } from "hamburger-react";
import Image from "next/image";
import Link from "next/link";

type NavLink = {
  href: string;
  value: string;
  bgColor?: string;
  textColor?: string;
  className?: string;
};

const Links: NavLink[] = [
  { href: "/", value: "Home" },
  { href: "/courses", value: "Courses" },
  { href: "/Cohort2.0", value: "Cohort 2.0", textColor: "#BE524B", className: "animate-shake-with-pause" },
  { href: "/request-callback", value: "Request Callback" },
  { href: "/signin", value: "Sign in", bgColor: "#24cfa6", textColor: "#000" },
];

function Navbar() {
  const [isOpen, setOpen] = useState<boolean>(false);
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Scroll hide/show
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollPos = window.pageYOffset;
      setVisible(prevScrollPos > currentScrollPos || currentScrollPos < 10);
      setPrevScrollPos(currentScrollPos);
      setScrolled(currentScrollPos > window.innerHeight * 0.1);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [prevScrollPos]);

  return (
    <nav
      className={`flex w-full text-white px-8  fixed z-[1000] left-1/2 -translate-x-1/2 top-0 py-2 md:py-4 mx-auto justify-between items-center transition-transform duration-300 ${visible ? "translate-y-0 " : "md:-translate-y-[20vh]"
        } ${scrolled ? "backdrop-blur-[4px]" : ""}`}
    >
      {/* Logo Left */}
      <Link href="/" className="flex items-center justify-center gap-3 left">
        <div className="flex items-center w-9 h-9 md:w-10 md:h-10">
          <Image
            src="/images/sherry_light-logo.webp"
            alt="Sheryians Logo"
            width={35}
            height={35}
          />
        </div>
        <h3 className="flex flex-wrap items-center font-NeuMachina leading-5">
          Sheryians <br /> coding school
        </h3>
      </Link>

      {/* Desktop Menu */}
      <div className="hidden right md:flex items-center">
        <ul className="flex items-center md:gap-6 lg:gap-10 text-sm font-light font-NeuMachina">
          {Links.map((link, idx) => (
            <Link
              href={link.href}
              key={idx}
              className={`cursor-pointer ${link.bgColor ? "px-5 py-1 font-medium text-base rounded-sm shine font-HelveticaNow" : ""
                } ${link.textColor && "font-bold"} ${link.className || ""}`}
              style={{
                background: link.bgColor,
                color: link.textColor || "inherit",
              }}
            >
              {link.value}
            </Link>
          ))}
        </ul>
      </div>

      {/* Mobile Hamburger */}
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
          {Links.map((link, idx) => (
            <Link
              href={link.href}
              key={idx}
              onClick={() => setOpen(false)}
              className={`cursor-pointer ${link.className || ""}`}
              style={{ color: Links.length - 1 === idx ? "white" : link.textColor || "white" }}
            >
              {link.value}
            </Link>
          ))}
        </ul>
      </div>
    </nav>
  );
}

export default Navbar;