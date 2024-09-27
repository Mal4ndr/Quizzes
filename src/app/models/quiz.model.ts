import { Question } from "./question.model";

export interface Quiz {
   category: string;
   questions: Question[];
}