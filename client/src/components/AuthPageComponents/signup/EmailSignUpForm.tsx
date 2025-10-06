"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import OtpStep from "./OtpStep";
import PersonalStep from "./PersonalStep";
import EmailStep from "./EmailStep";

// Zod schemas
const emailSchema = z.object({
    email: z.email("Please enter a valid email address"),
    password: z.string().min(6, "Password must be at least 6 characters"),
});

const otpSchema = z.object({
    otp: z.string().length(6, "Please enter a valid 6-digit OTP"),
});

const personalSchema = z.object({
    name: z.string().min(1, "Name is required"),
    phone: z.string().min(10, "Phone must be at least 10 characters"),
});

export type EmailFormData = z.infer<typeof emailSchema>;
export type OtpFormData = z.infer<typeof otpSchema>;
export type PersonalFormData = z.infer<typeof personalSchema>;


function EmailSignUpForm() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(3); // 1 = email/password, 2 = OTP, 3 = personal info
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const otpInputRef = useRef<HTMLInputElement>(null);

    // Persist step
    useEffect(() => {
        const savedStep = localStorage.getItem("authStep");
        const savedEmail = localStorage.getItem("authEmail");
        if (savedStep && savedEmail) {
            setStep(parseInt(savedStep));
            setEmail(savedEmail);
        }
    }, []);

    useEffect(() => {
        localStorage.setItem("authStep", step.toString());
        if (step > 1) {
            localStorage.setItem("authEmail", email);
        }
    }, [step, email]);

    // Auto focus OTP
    useEffect(() => {
        if (step === 2 && otpInputRef.current) {
            otpInputRef.current.focus();
        }
    }, [step]);

    // Step 1: Email/Password Form
    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "", password: "" },
    });

    const onEmailSubmit = async (data: EmailFormData) => {
        setEmail(data.email);
        setLoading(true);

        try {
            const res = await fetch("/api/auth/email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data),
            });
            const apiData = await res.json();
            console.log("✅ API Response:", apiData);

            if (res.ok) {
                setStep(2);
            } else {
                emailForm.setError("root", { message: apiData.message || "Authentication failed" });
            }
        } catch (error) {
            console.error("❌ API Error:", error);
            emailForm.setError("root", { message: "An error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    // Step 2: OTP Form
    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    const onOtpSubmit = async (data: OtpFormData) => {
        setLoading(true);

        try {
            const res = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: data.otp }),
            });
            const apiData = await res.json();
            console.log("✅ OTP Response:", apiData);

            if (res.ok) {
                setStep(3);
            } else {
                otpForm.setError("otp", { message: apiData.message || "Invalid OTP" });
            }
        } catch (error) {
            console.error("❌ OTP Error:", error);
            otpForm.setError("otp", { message: "Verification failed. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleResendOtp = async () => {
        setResendLoading(true);
        setResendMessage("");

        try {
            const res = await fetch("/api/auth/resend-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const apiData = await res.json();
            console.log("✅ Resend Response:", apiData);

            if (res.ok) {
                setResendMessage(`OTP resent to ${email}`);
                otpForm.reset();
            } else {
                otpForm.setError("otp", { message: apiData.message || "Failed to resend OTP" });
            }
        } catch (error) {
            console.error("❌ Resend Error:", error);
            otpForm.setError("otp", { message: "Failed to resend OTP. Please try again." });
        } finally {
            setResendLoading(false);
        }
    };

    // Step 3: Personal Info Form
    const personalForm = useForm<PersonalFormData>({
        resolver: zodResolver(personalSchema),
        defaultValues: { name: "", phone: "" },
    });

    const onPersonalSubmit = async (data: PersonalFormData) => {
        setLoading(true);

        try {
            const res = await fetch("/api/auth/personal", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, ...data }),
            });
            const apiData = await res.json();
            console.log("✅ Personal Info Response:", apiData);

            if (res.ok) {
                console.log("Sign up completed successfully!");
                // Reset forms and clear storage
                emailForm.reset();
                otpForm.reset();
                personalForm.reset();
                setEmail("");
                setStep(1);
                localStorage.removeItem("authStep");
                localStorage.removeItem("authEmail");
            } else {
                personalForm.setError("root", { message: apiData.message || "Failed to save personal info" });
            }
        } catch (error) {
            console.error("❌ Personal Info Error:", error);
            personalForm.setError("root", { message: "An error occurred. Please try again." });
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        if (step === 2) {
            otpForm.reset();
            setResendMessage("");
        } else if (step === 3) {
            personalForm.reset();
        }
        setStep(step - 1);
    };

    const { errors: emailErrors } = emailForm.formState;
    const { errors: otpErrors } = otpForm.formState;
    const { errors: personalErrors } = personalForm.formState;

    const togglePassword = () => setShowPassword(!showPassword);

    return (
        <>
            {step === 1 ? (
                <EmailStep
                    form={emailForm}
                    showPassword={showPassword}
                    togglePassword={togglePassword}
                    loading={loading}
                    errors={emailErrors}
                    onSubmit={onEmailSubmit}
                />
            ) : step === 2 ? (
                <OtpStep
                    form={otpForm}
                    email={email}
                    loading={loading}
                    resendLoading={resendLoading}
                    resendMessage={resendMessage}
                    onResend={handleResendOtp}
                    onBack={handleBack}
                    otpInputRef={otpInputRef}
                    errors={otpErrors}
                    onSubmit={onOtpSubmit}
                />
            ) : step === 3 ? (
                <PersonalStep
                    form={personalForm}
                    loading={loading}
                    onBack={handleBack}
                    errors={personalErrors}
                    onSubmit={onPersonalSubmit}
                />
            ) : null}
        </>
    );
}

export default EmailSignUpForm;