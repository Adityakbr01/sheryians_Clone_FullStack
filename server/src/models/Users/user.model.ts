import mongoose, { Schema } from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { IUser } from "../../types/models/Users/user";
import _config from "@/config";

const userSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: false,
      unique: true,
      lowercase: true,
      trim: true,
      minlength: [3, "Username must be at least 3 characters long"],
      maxlength: [30, "Username cannot exceed 30 characters"],
      index: true,
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/\S+@\S+\.\S+/, "Please use a valid email address"],
    },

    providers: {
      type: [String],
      enum: ["Google", "Local", "Github", "Facebook"],
      default: ["Local"],
    },

    password: {
      type: String,
      required: function (this: IUser) {
        return this.providers.includes("Local");
      },
      minlength: [6, "Password must be at least 6 characters long"],
      select: false,
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin", "course-manager"],
      default: "student",
    },

    occupation: {
      type: String,
      enum: ["student", "working professional", "intern", "freelancer"],
      default: "student",
    },

    city: {
      type: String,
      required: false,
      trim: true,
    },

    profilePicture: {
      type: String,
      default: "",
      validate: {
        validator: (v: string) =>
          v === "" || /^https?:\/\/.+\.(jpg|jpeg|png|gif|webp|svg)$/.test(v),
        message: "Profile picture must be a valid image URL",
      },
    },

    isEmailVerified: {
      type: Boolean,
      default: false,
    },

    isVerified: {
      type: Boolean,
      default: false,
    },

    phone: {
      type: String,
      required: false,
      unique: true,
      trim: true,
    },

    otp: {
      type: String,
      select: false,
    },

    otpExpiry: {
      type: Date,
    },

    refreshToken: {
      type: String,
      select: false,
    },

    enrolledCourses: [
      {
        courseId: {
          type: Schema.Types.ObjectId,
          ref: "Course",
          required: true,
        },
        enrolledAt: {
          type: Date,
          default: Date.now,
        },
      },
    ],

    isBanned: {
      type: Boolean,
      default: false,
    },

    lastLogin: {
      type: Date,
    },

    bio: {
      type: String,
      maxlength: 500,
      default: "",
    },

    socialLinks: {
      github: { type: String, trim: true, default: "" },
      linkedin: { type: String, trim: true, default: "" },
      twitter: { type: String, trim: true, default: "" },
    },
  },
  { timestamps: true }
);

userSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password as string, salt);
  next();
});


userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  if (!this.password) return false;
  return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateAccessToken = function (): string {
  return jwt.sign(
    { id: this._id, role: this.role },
    _config.ENV.JWT_ACCESS_TOKEN_SECRET as string,
    { expiresIn: "15m" }
  );
};

userSchema.methods.generateRefreshToken = function (): string {
  return jwt.sign(
    { id: this._id },
    _config.ENV.JWT_REFRESH_TOKEN_SECRET as string,
    { expiresIn: "7d" }
  );
};

const User = mongoose.model<IUser>("User", userSchema);
export default User;
