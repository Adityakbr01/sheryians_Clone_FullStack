import mongoose, { Schema, Document } from "mongoose";
import { IQuizQuestion } from "../../types/models/courses/quizQuestion";



// -------------------------------------
// Schema
// -------------------------------------
const quizQuestionSchema = new Schema<IQuizQuestion>(
  {
    questionText: { type: String, required: true, trim: true },

    options: {
      type: [String],
      required: true,
      validate: [
        (val: string[]) => val.length >= 2 && val.length <= 4,
        "A question must have between 2 and 4 options.",
      ],
    },

    correctAnswer: {
      type: String,
      required: true,
      trim: true,
      validate: {
        validator: function (this: IQuizQuestion, value: string) {
          return this.options.includes(value);
        },
        message: "Correct answer must be one of the options.",
      },
    },
  },
  { _id: false } // since this will be embedded in Lesson, we don’t need separate _id
);

// -------------------------------------
// Export
// -------------------------------------
export { quizQuestionSchema };
