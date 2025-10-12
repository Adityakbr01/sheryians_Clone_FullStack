// 1️⃣ TypeScript interface for type safety
export interface IEnquiry extends Document {
    name: string;
    phone: string;
    datetime: string;
    enquiryFor: "online" | "offline";
    courseName?: string; // optional, only for online enquiries
    isChecked: boolean;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface FilterParams {
    datetimeFrom?: string; // ISO string
    datetimeTo?: string;   // ISO string
    isChecked?: boolean;
    isDeleted?: boolean;
}