import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Question } from '../models/question.model';
import { Quiz } from '../models/quiz.model';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  // Fetch max amount of questions
  fetchQuestions(): Observable<{ results: Question[] }> {
    return this.http.get<{ results: Question[] }>(`${environment.triviaDb.baseUrl}/api.php?amount=50`);
  }

  // Organize fetched question into quizzes
  organizeQuizzes(questions: Question[]) {
    const categories: { [key: string]: Question[] } = {}; // an empty object to store categorized questions
    const quizzes: Quiz[] = []; // an array to store formed quizzes 

    // group questions into categories 
    this.groupQuestionsByCategory(questions, categories); // receive defined categories by reference

    // form the quizzes
    this.formQuizzesFromCategories(quizzes, categories); // receive filled quizzes by reference

    return quizzes;
  }

  // Define categories
  groupQuestionsByCategory(questions: Question[], categories: { [key: string]: Question[] }): void {
    questions.forEach(question => {
      // check if categories doesn't contain question's category, if it's not present create and initialize it
      if (!categories[question.category]) {
        categories[question.category] = [];
      }
      // if it contains, push question
      categories[question.category].push(question);
    });
  }

  // Form quizzes with 5 max questions that belong to 1 category
  formQuizzesFromCategories(quizzes: Quiz[], categories: { [key: string]: Question[] }): void {
    Object.keys(categories).forEach(category => {
      const categoryQuestions = categories[category]; // get an array of questions of current category

      if (categoryQuestions.length > 0 && quizzes.length < 10) {
        const quiz: Quiz = {
          category,
          questions: categoryQuestions.splice(0, 5) // take max 5 questions per quiz 
        };

        quizzes.push(quiz);
      }
    });

    // handle case when less than 10 different categories
    this.fillRemainingQuizzes(quizzes, categories);
  }

  // Form quizzes with random questions
  fillRemainingQuizzes(quizzes: Quiz[], categories: { [key: string]: Question[] }): void {
    const remainingQuestions: Question[] = Object.values(categories).flat(); // get one dimensional array of questions

    while (quizzes.length < 10 && remainingQuestions.length >= 5) {
      const newQuiz: Quiz = {
        category: 'Mixed',
        questions: remainingQuestions.splice(0, 5)
      };

      quizzes.push(newQuiz);
    }
  }
}
