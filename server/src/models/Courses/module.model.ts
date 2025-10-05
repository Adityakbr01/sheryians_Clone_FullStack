import mongoose, { Schema } from "mongoose";
import { IModule } from "../../types/models/courses/module";
import { lessonSchema } from "./lesson.model";


// -------------------------------------
// Schema
// -------------------------------------
const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true, trim: true },
  lessons: { type: [lessonSchema], default: [] },
});

// -------------------------------------
// Model
// -------------------------------------
const Module = mongoose.model<IModule>("Module", moduleSchema);
export { Module, moduleSchema };

