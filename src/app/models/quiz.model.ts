import { Question } from "./question.model";

export interface Quiz {
   id: string,
   category: string;
   questions: Question[];
}