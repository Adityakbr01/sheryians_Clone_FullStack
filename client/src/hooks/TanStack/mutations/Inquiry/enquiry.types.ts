export interface Enquiry {
    _id: string;
    name: string;
    phone: string;
    datetime: string;
    enquiryFor: "online" | "offline";
    courseName?: string;
    isChecked: boolean;
    isDeleted: boolean;
    createdAt: string;
    updatedAt: string;
}

export interface CreateEnquiryDto {
    name: string;
    phone: string;
    datetime: string;
    enquiryFor: "online" | "offline";
    courseName?: string;
}

export interface FilterEnquiryParams {
    datetimeFrom?: string;
    datetimeTo?: string;
    isChecked?: boolean;
    isDeleted?: boolean;
}
