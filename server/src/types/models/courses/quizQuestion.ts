// -------------------------------------
// Interface
// -------------------------------------
export interface IQuizQuestion extends Document {
  questionText: string;
  options: string[];
  correctAnswer: string;
}