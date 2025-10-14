// src/models/courseSyllabus.model.ts
import { ICourseSyllabus, ISection, ISubTopic, ITopic } from "@/types/models/courses/courseSyllabus";
import mongoose, { Schema, Document, Model } from "mongoose";


const SubTopicSchema = new Schema<ISubTopic>(
  {
    title: { type: String, required: true, trim: true },
    subTopics: { type: [Object], default: [] },
  },
  { _id: false }
);

const TopicSchema = new Schema<ITopic>(
  {
    title: { type: String, required: true, trim: true },
    subTopics: { type: [SubTopicSchema], default: [] },
  },
  { _id: false }
);

const SectionSchema = new Schema<ISection>(
  {
    title: { type: String, required: true, trim: true },
    topics: { type: [TopicSchema], default: [] },
  },
  { _id: false }
);

const CourseSyllabusSchema = new Schema<ICourseSyllabus>(
  {
    courseId: { type: Schema.Types.ObjectId, ref: "Course", required: true },
    syllabus: { type: [SectionSchema], default: [] },
  },
  { timestamps: true }
);

const CourseSyllabus: Model<ICourseSyllabus> = mongoose.model<ICourseSyllabus>(
  "CourseSyllabus",
  CourseSyllabusSchema
);

export default CourseSyllabus;
