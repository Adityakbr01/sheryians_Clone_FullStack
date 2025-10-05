// src/models/courseSyllabus.model.ts
import mongoose, { Schema, Document, Model } from "mongoose";

// ----------------------
// Interfaces
// ----------------------
export interface ISubTopic {
  title: string;
  subTopics?: ISubTopic[]; // recursion support
}

export interface ITopic {
  title: string;
  subTopics?: ISubTopic[];
}

export interface ISection {
  title: string; // e.g. "Web Development", "AI and Generative AI"
  topics: ITopic[];
}

export interface ICourseSyllabus extends Document {
  courseId: mongoose.Types.ObjectId;
  syllabus: ISection[];
}

// ----------------------
// Schemas
// ----------------------

// Recursive sub-topic schema
const SubTopicSchema = new Schema<ISubTopic>(
  {
    title: { type: String, required: true, trim: true },
    subTopics: { type: [Object], default: [] }, // recursive nesting
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

// ----------------------
// Model
// ----------------------
const CourseSyllabus: Model<ICourseSyllabus> = mongoose.model<ICourseSyllabus>(
  "CourseSyllabus",
  CourseSyllabusSchema
);

export default CourseSyllabus;
