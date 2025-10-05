"use client";
import React, { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { z } from "zod";

// Zod schema for phone validation
const phoneSchema = z
    .string()
    .regex(/^\d{10}$/, "Phone number must be exactly 10 digits");

function PhoneSignUpForm() {
    const [phone, setPhone] = useState("");
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (phone.length === 10) {
            const validation = phoneSchema.safeParse(phone);
            if (!validation.success) {
                setError(validation.error.issues[0].message);
                return;
            }
            setError(null);
        }
    }, [phone]);

    const handleSubmit = async () => {
        if (!error && phone.length === 10) {
            console.log("📞 Signup with phone:", phone);
            // Call your API here
        }
    };

    return (
        <div className="mt-4 space-y-1">
            <Label
                htmlFor="phone"
                className="text-[#a6a6a6] text-[12px] font-HelveticaNow font-medium"
            >
                Mobile Number*
            </Label>
            <input
                id="phone"
                placeholder="Enter your mobile number"
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className={`border-b py-[0.30rem] w-full outline-none rounded-sm px-4 bg-[#1e1e1e] font-light placeholder:text-[12px] ${error ? "border-red-500" : "border-[#3c3c3c]"
                    }`}
            />
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}

            <button
                onClick={handleSubmit}
                disabled={true}
                className="mt-4 w-full rounded-full px-3 py-2 bg-[var(--custom-primary)] text-black font-medium cursor-pointer"
            >
                Continue
            </button>
        </div>
    );
}

export default PhoneSignUpForm;
