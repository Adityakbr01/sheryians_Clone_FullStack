"use client";
import React from "react";
import { footerData } from "@/constants/footerData";
import Image from "next/image";
import Link from "next/link";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
    const { socials, company, community, contact, email, address } = footerData;
    const currentYear = new Date().getFullYear();

    return (
        <footer
            id="footer"
            role="contentinfo"
            className="w-full bg-transparent font-HelveticaNow text-white py-16 px-6 md:px-16"
        >
            {/* Top Separator */}
            <Separator className="bg-[#222222]" />

            {/* Top Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 py-12">
                {/* 1️⃣ Logo & Socials */}
                <div className="space-y-4 text-start">
                    <Image
                        src="https://ik.imagekit.io/sheryians/light-logo_lNzGXRRlQ.png?updatedAt=1701272916848"
                        alt="Sheryians Logo"
                        width={60}
                        height={60}
                        className="opacity-90 hover:opacity-100 transition-opacity duration-300"
                        priority={false}
                        loading="lazy"
                    />
                    <p className="text-gray-300 text-sm leading-relaxed">
                        Let’s connect with our socials
                    </p>
                    <div className="flex gap-3 text-2xl">
                        {socials.map((item) => {
                            const Icon = item.icon; // get the component
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    aria-label={item.name}
                                    className="transition-transform duration-300 hover:scale-110 text-gray-300 hover:text-[var(--custom-primary)]"
                                >
                                    <Icon />
                                </Link>
                            );
                        })}
                    </div>
                </div>

                {/* 2️⃣ Company Section */}
                <div className="space-y-4 text-start">
                    <h2 className="text-xl font-semibold">COMPANY</h2>
                    <ul className="space-y-2 text-gray-300 text-sm" role="list">
                        {company.map((link) => (
                            <li key={link.label} role="listitem">
                                <Link
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--custom-primary)] focus:text-[var(--custom-primary)] transition-colors block py-1"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 3️⃣ Community Section */}
                <div className="space-y-4 text-start">
                    <h2 className="text-xl font-semibold">COMMUNITY</h2>
                    <ul className="space-y-2 text-gray-300 text-sm" role="list">
                        {community.map((link) => (
                            <li key={link.label} role="listitem">
                                <Link
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--custom-primary)] focus:text-[var(--custom-primary)] transition-colors block py-1"
                                >
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* 4️⃣ Contact Section */}
                <div className="space-y-4 text-start">
                    <h2 className="text-xl font-semibold">GET IN TOUCH</h2>
                    <div className="space-y-3 text-gray-300 text-sm leading-relaxed">
                        {contact.map((info) => (
                            <div key={info.label} className="space-y-1">
                                <p className="capitalize text-gray-400">
                                    {info.label}: <span className="font-medium">{info.time}</span>
                                </p>
                                <a
                                    href={`tel:${info.phone}`}
                                    className="hover:text-[var(--custom-primary)] font-semibold block"
                                >
                                    {info.phone}
                                </a>
                            </div>
                        ))}
                        <a
                            href={`mailto:${email}`}
                            className="hover:text-[var(--custom-primary)] block"
                        >
                            {email}
                        </a>
                        <div className="space-y-1">
                            <a
                                href={address.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[var(--custom-primary)] block"
                            >
                                {address.line1}
                            </a>
                            <a
                                href={address.mapLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="hover:text-[var(--custom-primary)]"
                            >
                                {address.line2}
                            </a>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Separator */}
            <Separator className="bg-[#222222]" />

            {/* Copyright Section */}
            <div className="pt-6 text-center text-gray-300 font-medium text-xs sm:text-sm leading-relaxed">
                <p>
                    © {currentYear} Sheryians Pvt. Ltd. <br className="sm:hidden" /> All Rights Reserved.
                </p>
            </div>
        </footer>
    );
};

export default Footer;