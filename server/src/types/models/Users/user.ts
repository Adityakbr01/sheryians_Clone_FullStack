import mongoose, { Document } from "mongoose";

export interface IEnrolledCourse {
  courseId: mongoose.Types.ObjectId;
  enrolledAt: Date;
}

export interface ISocialLinks {
  github?: string;
  linkedin?: string;
  twitter?: string;
}

export type UserRole = "student" | "instructor" | "admin" | "course-manager";
export type UserProvider = "Google" | "Local" | "Github" | "Facebook";
export type OccupationType =
  | "student"
  | "working professional"
  | "intern"
  | "freelancer";

export interface IUser extends Document {
  username: string;
  email: string;
  providers: UserProvider[];
  password?: string; // optional for non-local providers
  role: UserRole;
  occupation: OccupationType;
  city?: string;
  profilePicture?: string;
  isEmailVerified: boolean;
  otp?: string;
  otpExpiry?: Date;
  refreshToken?: string;
  enrolledCourses: IEnrolledCourse[];
  isBanned: boolean;
  lastLogin?: Date;
  bio?: string;
  socialLinks: ISocialLinks;

  // instance methods
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateAccessToken(): string;
  generateRefreshToken(): string;
}

// If you want to add static methods:
export interface IUserModel extends mongoose.Model<IUser> {
  verifyAccessToken(token: string): any;
  verifyRefreshToken(token: string): any;
}
