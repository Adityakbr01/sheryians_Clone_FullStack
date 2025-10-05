import mongoose, { Schema, Document } from "mongoose";
import { ILesson, LessonType } from "../../types/models/courses/lesson";
import { quizQuestionSchema } from "./quizQuestion.model";
import { IQuizQuestion } from "../../types/models/courses/quizQuestion";



// -------------------------------------
// Schema
// -------------------------------------
const lessonSchema = new Schema<ILesson>(
  {
    title: { type: String, required: true, trim: true },
    type: {
      type: String,
      enum: Object.values(LessonType),
      required: true,
    },

    videoUrl: {
      type: String,
      validate: {
        validator: function (this: ILesson, v: string) {
          return this.type !== LessonType.VIDEO || !!v;
        },
        message: "videoUrl is required when lesson type is VIDEO",
      },
    },

    duration: {
      type: Number,
      min: 1,
      validate: {
        validator: function (this: ILesson, v: number) {
          return this.type !== LessonType.VIDEO || !!v;
        },
        message: "duration is required when lesson type is VIDEO",
      },
    },

    quizQuestions: {
      type: [quizQuestionSchema],
      validate: {
        validator: function (this: ILesson, v: IQuizQuestion[]) {
          return this.type !== LessonType.QUIZ || (Array.isArray(v) && v.length > 0);
        },
        message: "quizQuestions are required when lesson type is QUIZ",
      },
    },
  },
  { timestamps: true }
);

// -------------------------------------
// Model Export
// -------------------------------------
const Lesson = mongoose.model<ILesson>("Lesson", lessonSchema);
export { lessonSchema, Lesson };
