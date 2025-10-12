import { z } from "zod";

// Create enquiry body validation
export const createEnquirySchema = z.object({
    name: z.string().min(2, "Name must be at least 2 characters long"),
    phone: z.string().regex(/^\d{10}$/, "Phone must be 10 digits"),
    datetime: z.string().refine(
        (val) => !isNaN(Date.parse(val)),
        "Invalid datetime format"
    ),
    enquiryFor: z.enum(["online", "offline"]),
    courseName: z.string().optional(), // required only if enquiryFor === "online"
});

// Filter enquiries query validation
export const filterEnquirySchema = z.object({
    datetimeFrom: z.string().optional(),
    datetimeTo: z.string().optional(),
    isChecked: z
        .string()
        .optional()
        .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
    isDeleted: z
        .string()
        .optional()
        .transform((val) => (val === "true" ? true : val === "false" ? false : undefined)),
});

// TypeScript types
export type CreateEnquiryInput = z.infer<typeof createEnquirySchema>;
export type FilterEnquiryInput = z.infer<typeof filterEnquirySchema>;
