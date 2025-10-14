"use client";
import { usePersonalInfo } from "@/hooks/TanStack/mutations/User/usePersonalInfo";
import { useRegister } from "@/hooks/TanStack/mutations/User/useRegister";
import { useResendOtp } from "@/hooks/TanStack/mutations/User/useResendOtp";
import { useVerifyOtp } from "@/hooks/TanStack/mutations/User/useVerifyOtp";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { set, z } from "zod";
import EmailStep from "./EmailStep";
import OtpStep from "./OtpStep";
import PersonalStep from "./PersonalStep";
import { AxiosError } from "axios";

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
    const router = useRouter(); // Add this line
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("");
    const [step, setStep] = useState(1); // 1 = email/password, 2 = OTP, 3 = personal info
    const [loading, setLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);
    const [resendMessage, setResendMessage] = useState("");
    const otpInputRef = useRef<HTMLInputElement>(null);

    const registerMutation = useRegister();
    const verifyOtpMutation = useVerifyOtp();
    const resendOtpMutation = useResendOtp();
    const personalInfoMutation = usePersonalInfo();


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

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            // Clean up OTP resend related data if user navigates away without completing
            if (step !== 3) {
                localStorage.removeItem("otpResendCount");
                localStorage.removeItem("otpLastResendTime");
            }
        };
    }, [step]);

    // Step 1: Email/Password Form
    const emailForm = useForm<EmailFormData>({
        resolver: zodResolver(emailSchema),
        defaultValues: { email: "", password: "" },
    });

    const onEmailSubmit = async (data: EmailFormData) => {
        setEmail(data.email);
        registerMutation.mutate(data, {
            onSuccess: () => {
                setStep(2); // Go to OTP step
            },
            onError: (error: unknown) => {
                console.log(error)
                if (error instanceof AxiosError) {
                    if (error.status === 409) {
                        setStep(2); // If user already exists, go to OTP step
                    }
                    emailForm.setError("root", {
                        message: error?.response?.data?.message || "Something went wrong",
                    });
                }
            },
            onSettled: () => setLoading(false),
        });
        setLoading(true);
    };

    // Step 2: OTP Form
    const otpForm = useForm<OtpFormData>({
        resolver: zodResolver(otpSchema),
        defaultValues: { otp: "" },
    });

    const onOtpSubmit = async (data: OtpFormData) => {
        setLoading(true);
        verifyOtpMutation.mutate(
            { email, otp: data.otp },
            {
                onSuccess: () => {
                    setStep(3); // Go to personal info
                },
                onError: (error: unknown) => {
                    if (error instanceof AxiosError) {
                        otpForm.setError("otp", {
                            message: error?.response?.data?.message || "Invalid OTP",
                        });
                    }
                },
                onSettled: () => setLoading(false),
            }
        );
    };


    const handleResendOtp = async () => {
        setResendLoading(true);
        setResendMessage("");

        resendOtpMutation.mutate(
            { email },
            {
                onSuccess: (data) => {
                    setResendMessage(data.message || "OTP sent successfully");

                    // Clear the resend message after 3 seconds
                    setTimeout(() => {
                        setResendMessage("");
                    }, 3000);
                },
                onError: (err: unknown) => {
                    if (err instanceof AxiosError) {
                        setResendMessage(err?.response?.data?.message || "Failed to resend OTP");
                    }
                },
                onSettled: () => setResendLoading(false),
            }
        );
    };

    // Step 3: Personal Info Form
    const personalForm = useForm<PersonalFormData>({
        resolver: zodResolver(personalSchema),
        defaultValues: { name: "", phone: "" },
    });

    const onPersonalSubmit = async (data: PersonalFormData) => {
        setLoading(true);
        personalInfoMutation.mutate(
            { email, ...data },
            {
                onSuccess: () => {
                    // Cleanup
                    emailForm.reset();
                    otpForm.reset();
                    personalForm.reset();
                    setEmail("");
                    setStep(1);
                    localStorage.removeItem("authStep");
                    localStorage.removeItem("authEmail");
                    // Clean up OTP resend related data
                    localStorage.removeItem("otpResendCount");
                    localStorage.removeItem("otpLastResendTime");
                    router.push("/signin");
                },
                onError: (err: unknown) => {
                    if (err instanceof AxiosError) {
                        personalForm.setError("root", {
                            message: err?.response?.data?.message || "Failed to save personal info",
                        });
                    }
                },
                onSettled: () => setLoading(false),
            }
        );
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