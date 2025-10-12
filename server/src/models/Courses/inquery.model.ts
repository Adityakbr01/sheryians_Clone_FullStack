import { IEnquiry } from "@/types/models/courses/enquiry";
import mongoose, { Schema, Document, Model } from "mongoose";



const enquirySchema: Schema<IEnquiry> = new Schema(
    {
        name: {
            type: String,
            required: [true, "Name is required"],
            trim: true,
            minlength: [2, "Name must be at least 2 characters long"],
        },
        phone: {
            type: String,
            required: [true, "Phone number is required"],
            match: [/^\d{10}$/, "Phone number must be 10 digits"],
        },
        datetime: {
            type: String,
            required: [true, "Date and time is required"],
        },
        enquiryFor: {
            type: String,
            enum: ["online", "offline"],
            required: [true, "Enquiry type is required"],
        },
        courseName: {
            type: String,
            required: function () {
                return this.enquiryFor === "online";
            },
            trim: true,
        },
        isChecked: {
            type: Boolean,
            default: false,
        },
        isDeleted: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true, // automatically adds createdAt and updatedAt
    }
);

const Enquiry: Model<IEnquiry> =
    mongoose.models.Enquiry || mongoose.model<IEnquiry>("Enquiry", enquirySchema);

export default Enquiry;
