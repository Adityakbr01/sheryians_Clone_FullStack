"use client";

import React, { useEffect, useMemo, useState } from "react";
import { Squeeze as Hamburger } from "hamburger-react";
import Image from "next/image";
import Link from "next/link";
import { useAuthStore } from "@/store/auth";
import { BASE_LINKS, CLASSROOM_LINK, PROFILE_LINK, SIGNIN_LINK } from "./typesAndData";
import RequestCallbackModal from "./RequestCallbackModal";
import { Phone } from "lucide-react";

export default function Navbar() {
  const user = useAuthStore((state) => state.user);
  const [isOpen, setOpen] = useState(false);
  const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
  const [visible, setVisible] = useState<boolean>(true);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showCallbackModal, setShowCallbackModal] = useState<boolean>(false);

  // ✅ Filter links (exclude callback link for mobile menu)
  const navLinks = useMemo(() => {
    const links = [...BASE_LINKS];
    if (user) {
      if (user.enrolledCourses) links.push(CLASSROOM_LINK);
      links.push(PROFILE_LINK);
    } else {
      links.push(SIGNIN_LINK);
    }
    return links.filter((link) => link.href !== "/request-callback");
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

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    if (href === "/request-callback") {
      e.preventDefault();
      setShowCallbackModal(true);
    }
  };

  return (
    <>
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
          <h3 className="font-NeuMachina text-[0.9rem] md:leading-5">
            Sheryians <br /> coding school
          </h3>
        </Link>

        {/* ✅ Desktop Nav */}
        <div className="hidden md:flex items-center">
          <ul className="flex items-center md:gap-6 lg:gap-10 text-sm font-light font-NeuMachina">
            {BASE_LINKS.concat(
              user ? (user.enrolledCourses ? [CLASSROOM_LINK, PROFILE_LINK] : [PROFILE_LINK]) : [SIGNIN_LINK]
            ).map((link, idx) => (
              <Link
                href={link.href}
                key={idx}
                onClick={(e) => handleLinkClick(e, link.href)}
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

        {/* 📱 Mobile Toggle — callback + hamburger */}
        <div className="relative z-5s0 flex gap-4 items-center md:hidden text-white">
          <button onClick={() => setShowCallbackModal(true)}>
            <Phone size={22} />
          </button>
          <div className="relative z-50">
            <Hamburger size={22} toggled={isOpen} toggle={setOpen} />
          </div>
        </div>

        {/* 📱 Mobile Menu */}
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
                onClick={(e) => {
                  handleLinkClick(e, link.href);
                  setOpen(false);
                }}
                className={`cursor-pointer flex items-center gap-2 ${link.className || ""}`}
                style={{
                  // ✅ Override SIGNIN_LINK text color to white on mobile
                  color: link === SIGNIN_LINK ? "#fff" : link.textColor || "white",
                }}
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

      <RequestCallbackModal
        isOpen={showCallbackModal}
        onClose={() => setShowCallbackModal(false)}
      />
    </>
  );
}
