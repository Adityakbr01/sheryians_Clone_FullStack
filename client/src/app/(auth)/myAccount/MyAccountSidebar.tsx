import { Button } from '@/components/ui/button'
import { BookOpen, User } from 'lucide-react'
import React from 'react'

function MyAccountSidebar({ activeTab, setActiveTab }: { activeTab: string, setActiveTab: React.Dispatch<React.SetStateAction<string>> }) {
    return (
        <div className="w-full md:w-1/4 pt-20 md:pt-32 flex flex-col md:p-6 gap-4 md:gap-6">
            <h1 className="text-2xl md:text-3xl font-extralight mb-2 md:mb-4 text-left">
                Account Center
            </h1>

            {/* Tabs: Stack vertically on desktop, horizontally on mobile */}
            <div className="flex md:flex-col gap-2 md:gap-3 md:justify-start">
                <Button
                    variant={activeTab === "personal" ? "secondary" : "ghost"}
                    onClick={() => setActiveTab("personal")}
                    className="justify-center md:justify-start cursor-pointer text-xs md:text-sm"
                >
                    <User size={16} className="md:mr-2" />
                    Personal
                </Button>

                <Button
                    variant={activeTab === "courses" ? "secondary" : "ghost"}
                    onClick={() => setActiveTab("courses")}
                    className="justify-center md:justify-start cursor-pointer text-xs md:text-sm"
                >
                    <BookOpen size={16} className="md:mr-2" />
                    Courses
                </Button>
            </div>
        </div>
    )
}

export default MyAccountSidebar