// src/models/course.model.ts
import { CourseLanguage, CourseType, ICourse } from "@/types/models/courses/course";
import mongoose, { Model, Schema } from "mongoose";
import slugify from "slugify";
import { moduleSchema } from "./module.model";

// =================================================================
// MAIN COURSE SCHEMA
// =================================================================
const courseSchema = new Schema<ICourse>(
  {
    // --- Core Course Details ---
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true }, // auto-generated
    description: { type: String, required: true },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Pricing Information ---
    price: { type: Number, required: true, min: 0 }, // Final price after discount
    originalPrice: { type: Number }, // Before discount
    gst: { type: Boolean, default: true },

    // --- Course Metadata ---
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    subTag: { type: String, trim: true },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: "Thumbnail must be a valid URL",
      },
    },
    language: {
      type: String,
      enum: Object.values(CourseLanguage),
      default: CourseLanguage.HINGLISH,
    },
    type: {
      type: String,
      enum: Object.values(CourseType),
      default: CourseType.LIVE,
    },

    // --- New Fields ---
    providesCertificate: { type: Boolean, default: true },
    schedule: { type: String, trim: true },
    totalContentHours: { type: String, trim: true },
    totalLectures: { type: String, trim: true },
    totalQuestions: { type: String, trim: true },
    batchStartDate: { type: Date },

    modules: [moduleSchema],

    CourseSyllabusSchema: { type: Schema.Types.ObjectId, ref: "CourseSyllabus" },


    // --- Soft Delete ---
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);


// =================================================================
// INDEXES
// =================================================================
courseSchema.index({ title: "text", description: "text", tags: 1, category: 1 });
courseSchema.index({ slug: 1 });

// =================================================================
// HOOKS
// =================================================================
courseSchema.pre("save", function (next) {
  if (!this.isModified("title")) return next();
  this.slug = slugify(this.title, { lower: true, strict: true });
  next();
});

// =================================================================
// VIRTUALS
// =================================================================
courseSchema.virtual("discountPercentage").get(function (this: ICourse) {
  if (this.originalPrice && this.price) {
    return Math.round(((this.originalPrice - this.price) / this.originalPrice) * 100);
  }
  return 0;
});

// =================================================================
// MODEL EXPORT
// =================================================================
const course: Model<ICourse> = mongoose.model<ICourse>("course", courseSchema);
export default course;
