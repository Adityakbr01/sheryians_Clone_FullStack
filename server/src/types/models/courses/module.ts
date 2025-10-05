// -------------------------------------
// Interface

import { ILesson } from "./lesson";

// -------------------------------------
export interface IModule extends Document {
  title: string;
  lessons: ILesson[];
}
