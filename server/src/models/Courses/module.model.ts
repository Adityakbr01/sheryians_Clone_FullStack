import mongoose, { Schema } from "mongoose";
import { IModule } from "../../types/models/courses/module";
import { lessonSchema } from "./lesson.model";

const moduleSchema = new Schema<IModule>({
  title: { type: String, required: true, trim: true },
  lessons: { type: [lessonSchema], default: [] },
  isDeleted: { type: Boolean, default: false },
  course: { type: Schema.Types.ObjectId, ref: "course", required: true },
});

const Module = mongoose.model<IModule>("Module", moduleSchema);
export { Module, moduleSchema };

