// -------------------------------------
// Interface

import { Types } from "mongoose";
import { ILesson } from "./lesson";

// -------------------------------------
export interface IModule extends Document {
  title: string;
  lessons: ILesson[];
  isDeleted: boolean;
  course: Types.ObjectId; // Reference to the parent course
}
