import { CourseLanguage, CourseStatus, CourseType, ICourse } from "@/types/models/courses/course";
import mongoose, { Model, Schema } from "mongoose";
import slugify from "slugify";

const courseSchema = new Schema<ICourse>(
  {
    // --- Core Course Details ---
    title: { type: String, required: true, trim: true },
    slug: { type: String, unique: true, lowercase: true, trim: true },
    description: { type: String, required: true },
    instructor: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // --- Pricing Information ---
    price: { type: Number, required: true, min: 0 },
    originalPrice: { type: Number, required: true },
    gst: { type: Boolean, default: true },
    discountPercentage: {
      type: Number,
      min: 0,
      max: 95,
      default: 0,
    },

    // --- Course Metadata ---
    category: { type: String, trim: true },
    tags: [{ type: String, trim: true }],
    subTag: { type: String, trim: true },
    offer: { type: String, trim: true },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator: (v: string) => /^https?:\/\/.+/.test(v),
        message: "Thumbnail must be a valid URL",
      },
    },
    CourseLanguage: {
      type: String,
      enum: Object.values(CourseLanguage),
      default: CourseLanguage.HINGLISH,
    },
    type: {
      type: String,
      enum: Object.values(CourseType),
      default: CourseType.LIVE,
    },

    CourseStatus: {
      type: String,
      enum: Object.values(CourseStatus),
      default: CourseStatus.UPCOMING,
    },

    // --- Extra Fields ---
    providesCertificate: { type: Boolean, default: true },
    schedule: { type: String, trim: true },
    batchStartDate: { type: Date },

    // --- Relations ---
    modules: {
      type: [{ type: Schema.Types.ObjectId, ref: "Module" }],
      default: [],
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

courseSchema.index(
  {
    title: "text",
    description: "text",
    category: "text",
  }
);

courseSchema.pre("save", function (next) {
  // Slug auto-generate
  if (this.isModified("title")) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  // 💰 Price calculation
  if (this.originalPrice && this.discountPercentage >= 0) {
    const discountAmount = (this.originalPrice * this.discountPercentage) / 100;
    this.price = this.originalPrice - discountAmount;
  } else if (this.originalPrice) {
    this.price = this.originalPrice;
  }

  next();
});

courseSchema.pre("save", function (next) {
  if (this.isModified("title") && this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }

  if (this.originalPrice != null) { // check for undefined/null
    const discount = this.discountPercentage ?? 0; // fallback to 0 if undefined
    this.price = this.originalPrice - (this.originalPrice * discount) / 100;
  }

  next();
});

courseSchema.pre(["findOneAndUpdate", "updateOne"], function (next) {
  const update = this.getUpdate() as any;

  if (update.title) {
    update.slug = slugify(update.title, { lower: true, strict: true });
  }

  if (update.originalPrice && typeof update.discountPercentage !== "undefined") {
    const discountAmount =
      (update.originalPrice * update.discountPercentage) / 100;
    update.price = update.originalPrice - discountAmount;
  } else if (update.originalPrice && typeof update.discountPercentage === "undefined") {
    update.price = update.originalPrice;
  }

  this.setUpdate(update);
  next();
});

courseSchema.virtual("calculatedDiscountPercentage").get(function (this: ICourse) {
  if (this.originalPrice && this.price) {
    return Math.round(
      ((this.originalPrice - this.price) / this.originalPrice) * 100
    );
  }
  return 0;
});


const Course: Model<ICourse> = mongoose.model<ICourse>("Course", courseSchema);
export default Course;
