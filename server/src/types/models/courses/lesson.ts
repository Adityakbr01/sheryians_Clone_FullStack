// -------------------------------------
// Enums for Lesson Types

import { IQuizQuestion } from "./quizQuestion";

// -------------------------------------
export enum LessonType {
  VIDEO = "video",
  QUIZ = "quiz",
}

// -------------------------------------
// Interface
// -------------------------------------
export interface ILesson extends Document {
  title: string;
  type: LessonType;
  videoUrl?: string;
  duration?: number; // in minutes
  quizQuestions?: IQuizQuestion[];
}