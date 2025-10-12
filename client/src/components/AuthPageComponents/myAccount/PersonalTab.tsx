"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useLogout } from "@/hooks/TanStack/mutations/User/useLogout";
import { Occupation, User } from "@/store/auth";
import { LogOut, Pencil } from "lucide-react";
import Image from "next/image";
import Link from "next/link";


interface PersonalTabProps {
    user: User;
    setUser: (user: User) => void;
    logoutMutation: ReturnType<typeof useLogout>;// adjust generic types if needed
}

function PersonalTab({ user, setUser, logoutMutation }: PersonalTabProps) {

    return (
        <div className="space-y-8">
            {/* Profile Image */}
            <div className="flex sm:flex-row items-center gap-4 sm:gap-6">
                <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border border-gray-700">
                    <Image
                        src={user?.avatar || "https://cdn-icons-png.flaticon.com/128/1326/1326390.png"}
                        alt={`${user.username} profile`}
                        fill
                        className="object-cover"
                    />
                    <Button
                        size="icon"
                        variant="secondary"
                        className="absolute w-8 h-8 bottom-1 right-1 bg-[var(--custom-primary)] z-20 rounded-full hover:opacity-90"
                    >
                        <Pencil size={14} />
                    </Button>
                </div>

                <div className="text-center sm:text-left">
                    <h2 className="text-lg sm:text-xl font-semibold">{user.username}</h2>
                    <p className="text-sm text-gray-400">{user.email}</p>
                </div>
            </div>

            {/* Form */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                        id="name"
                        value={user.username}
                        onChange={(e) => setUser({ ...user, username: e.target.value })}
                        className="mt-1"
                    />
                </div>

                <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                        id="email"
                        type="email"
                        disabled
                        value={user.email}
                        className="mt-1 cursor-not-allowed text-gray-400"
                    />
                </div>

                <div>
                    <Label htmlFor="phone">Contact Number</Label>
                    <Input
                        id="phone"
                        type="tel"
                        disabled
                        value={user.phone}
                        className="mt-1 cursor-not-allowed text-gray-400"
                    />
                </div>

                <div>
                    <Label htmlFor="occupation">Occupation</Label>
                    <Select
                        value={user.occupation}
                        onValueChange={(value) =>
                            setUser({ ...user, occupation: value as Occupation })
                        }
                    >
                        <SelectTrigger className="mt-1">
                            <SelectValue placeholder="Select occupation" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="student">Student</SelectItem>
                            <SelectItem value="workingProfessional">
                                Working Professional
                            </SelectItem>
                            <SelectItem value="intern">Intern</SelectItem>
                            <SelectItem value="freelancer">Freelancer</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                        id="city"
                        value={user.city}
                        onChange={(e) => setUser({ ...user, city: e.target.value })}
                        className="mt-1"
                    />
                </div>
            </div>

            {/* Logout */}
            <div className="pt-4 flex justify-center sm:justify-end">
                <Button onClick={() => logoutMutation.mutate()}
                    disabled={logoutMutation.isPending} asChild variant="destructive" className="w-full sm:w-auto">
                    <Link href="/signin" className="flex items-center gap-2">
                        <span>Logout</span> <LogOut size={16} />
                    </Link>
                </Button>
            </div>
        </div>
    )
}

export default PersonalTab