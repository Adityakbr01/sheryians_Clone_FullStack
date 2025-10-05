"use client"
import React, { useState, useRef } from 'react';
import Link from 'next/link';

// Assuming shadcn/ui components are available at these paths
// Adjust the import paths based on your project structure
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

// A simple User icon for the upload placeholder
const UserIcon = (props) => (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
    </svg>
);


function Page() {
    // State to manage the current active step
    const [step, setStep] = useState(1);

    // State for all form inputs
    const [mobileNumber, setMobileNumber] = useState("");
    const [otp, setOtp] = useState(new Array(6).fill(""));
    const [userInfo, setUserInfo] = useState({
        profilePic: null,
        fullName: "",
        email: "",
        city: "",
    });

    const fileInputRef = useRef(null);

    // --- Event Handlers ---

    const handleNextStep = () => {
        // Add validation logic here before proceeding
        setStep((prevStep) => prevStep + 1);
    };

    const handleOtpChange = (element, index) => {
        if (isNaN(element.value)) return false; // Only allow numbers

        setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

        // Focus next input
        if (element.nextSibling) {
            element.nextSibling.focus();
        }
    };
    
    const handleUserInfoChange = (e) => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({ ...prevState, [name]: value }));
    };

    const handleProfilePicChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setUserInfo(prevState => ({ ...prevState, profilePic: e.target.files[0] }));
        }
    };

    const handleFinalSubmit = () => {
        // Combine all data and send to your backend API
        const formData = {
            mobileNumber,
            otp: otp.join(""),
            ...userInfo,
        };
        console.log("Final form data:", formData);
        alert("Signup complete! Check the console for the form data.");
        // Here you would typically make an API call
    };


    // --- Sub-Components for each step ---

    const Stepper = () => (
        <div className="flex items-center justify-center w-full">
            {/* Step 1 */}
            <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 1 ? 'bg-blue-500' : 'bg-gray-700'}`}>1</div>
                <span className="ml-2 text-sm text-white">Mobile</span>
            </div>

            {/* Connector 1 */}
            <div className={`flex-1 h-0.5 mx-4 ${step > 1 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>

            {/* Step 2 */}
            <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 2 ? 'bg-blue-500' : 'bg-gray-700'}`}>2</div>
                <span className="ml-2 text-sm text-white">Verify</span>
            </div>

            {/* Connector 2 */}
            <div className={`flex-1 h-0.5 mx-4 ${step > 2 ? 'bg-blue-500' : 'bg-gray-700'}`}></div>

            {/* Step 3 */}
            <div className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${step >= 3 ? 'bg-blue-500' : 'bg-gray-700'}`}>3</div>
                <span className="ml-2 text-sm text-white">Info</span>
            </div>
        </div>
    );

    const MobileStep = () => (
        <div className='text-center'>
            <h2 className="text-2xl font-bold text-white">Enter Your Mobile Number</h2>
            <p className="text-gray-400 mt-2">You will receive an OTP on this number</p>
            <div className="flex justify-center mt-8">
                <div className="w-80">
                    <Input 
                        type="tel" 
                        placeholder="Mobile Number" 
                        value={mobileNumber}
                        onChange={(e) => setMobileNumber(e.target.value)}
                        className="text-center bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:ring-blue-500 focus:border-blue-500" 
                    />
                    <Button onClick={handleNextStep} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Send OTP</Button>
                </div>
            </div>
        </div>
    );
    
    const OtpStep = () => (
        <div className='text-center'>
            <h2 className="text-2xl font-bold text-white">Verify OTP</h2>
            <p className="text-gray-400 mt-2">Enter the 6-digit code sent to your number</p>
            <div className="flex justify-center mt-8 space-x-2">
                {otp.map((data, index) => (
                    <Input 
                        key={index}
                        type="text" 
                        maxLength={1} 
                        value={data}
                        onChange={e => handleOtpChange(e.target, index)}
                        onFocus={e => e.target.select()}
                        className="w-12 h-12 text-center text-xl bg-gray-800 border-gray-700 text-white" 
                    />
                ))}
            </div>
            <Button onClick={handleNextStep} className="w-80 mt-6 bg-blue-600 hover:bg-blue-700">Verify</Button>
            <p className="text-gray-400 mt-4 text-sm">Didn't receive OTP? <button className="text-blue-500 hover:underline">Resend</button></p>
        </div>
    );

    const UserInfoStep = () => (
         <div className='text-center'>
            <h2 className="text-2xl font-bold text-white">Tell us more about you</h2>
            <div className="flex flex-col items-center mt-8 space-y-4 w-80 mx-auto">
                <div 
                    className="w-24 h-24 rounded-full bg-gray-800 border-2 border-gray-700 flex items-center justify-center cursor-pointer hover:border-blue-500 transition-colors"
                    onClick={() => fileInputRef.current?.click()}
                >
                    {userInfo.profilePic ? (
                        <img src={URL.createObjectURL(userInfo.profilePic)} alt="Profile" className="w-full h-full rounded-full object-cover"/>
                    ) : (
                        <div className="text-gray-400 text-center">
                            <UserIcon className="mx-auto h-8 w-8"/>
                            <span className="text-xs">Upload</span>
                        </div>
                    )}
                </div>
                <input 
                    type="file" 
                    ref={fileInputRef} 
                    onChange={handleProfilePicChange}
                    className="hidden" 
                    accept="image/*"
                />

                <Input name="fullName" value={userInfo.fullName} onChange={handleUserInfoChange} type="text" placeholder="Full Name" className="bg-gray-800 border-gray-700 text-white text-center" />
                <Input name="email" value={userInfo.email} onChange={handleUserInfoChange} type="email" placeholder="Email Address" className="bg-gray-800 border-gray-700 text-white text-center" />
                <Input name="city" value={userInfo.city} onChange={handleUserInfoChange} type="text" placeholder="City" className="bg-gray-800 border-gray-700 text-white text-center" />
                <Button onClick={handleFinalSubmit} className="w-full mt-4 bg-blue-600 hover:bg-blue-700">Finish Signup</Button>
            </div>
        </div>
    );

    // --- Main Component Render ---

    return (
        <div className='w-full min-h-screen flex flex-col justify-between p-8' style={{
            backgroundImage: 'url("/images/signupNewUserBG.svg")',
            backgroundSize: "cover",
            backgroundPosition: "center"
        }}>
            {/* Top Section: Header and Stepper */}
            <div className="w-full max-w-md mx-auto">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-white">SIGN UP</h1>
                    <p className="text-gray-400 mt-1">
                        Already have an account? <Link href="/signin" className="text-blue-500 hover:underline">Sign In</Link>
                    </p>
                </div>
                <Stepper />
            </div>

            {/* Middle Section: Active Step Content */}
            <div className="flex-grow flex items-center justify-center">
                <div className="w-full max-w-md">
                    {step === 1 && <MobileStep />}
                    {step === 2 && <OtpStep />}
                    {step === 3 && <UserInfoStep />}
                </div>
            </div>

            {/* Bottom Section: Social Login and Terms */}
            <div className="w-full max-w-md mx-auto text-center">
                <div className="flex items-center my-4">
                    <div className="flex-grow border-t border-gray-600"></div>
                    <span className="px-4 text-gray-400">OR</span>
                    <div className="flex-grow border-t border-gray-600"></div>
                </div>
                
                <Button variant="outline" className="w-full bg-transparent border-gray-600 text-white hover:bg-gray-800 hover:text-white">
                    {/* Add your Google Icon component here */}
                    Continue with Google
                </Button>

                <p className="text-xs text-gray-500 mt-6">
                    By continuing, you agree to our <Link href="/terms" className="underline">Terms of Service</Link> and <Link href="/privacy" className="underline">Privacy Policy</Link>.
                </p>
            </div>
        </div>
    )
}

export default Page;