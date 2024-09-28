import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Question } from '../models/question.model';
import { Quiz } from '../models/quiz.model';

import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';

import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class QuizService {
  private quizzes: Quiz[] = [];

  constructor(private http: HttpClient) { }

  // Fetch max amount of questions
  public fetchQuestions(): Observable<{ results: Question[] }> {
    return this.http.get<{ results: Question[] }>(`${environment.triviaDb.baseUrl}/api.php?amount=50`);
  }

  // Build quizzes from fetched questions 
  public buildQuizzes(questions: Question[]) {
    const categories: { [key: string]: Question[] } = {}; // an empty object to store categorized questions

    // group questions into categories 
    this.groupQuestionsByCategory(questions, categories); // receive defined categories by reference

    // form the quizzes
    this.quizzes = [];
    this.formQuizzesFromCategories(this.quizzes, categories); // receive filled quizzes by reference

    return this.quizzes;
  }

  // Define categories and add to them appropriate questions
  private groupQuestionsByCategory(questions: Question[], categories: { [key: string]: Question[] }): void {
    questions.forEach(question => {
      // check if categories don't contain question's category, if it's not present create and initialize it
      if (!categories[question.category]) {
        categories[question.category] = [];
      }
      // push question
      categories[question.category].push(question);
    });
  }

  // Form quizzes with 5 max questions that belong to 1 category
  private formQuizzesFromCategories(quizzes: Quiz[], categories: { [key: string]: Question[] }): void {
    Object.keys(categories).forEach(category => {
      const categoryQuestions = categories[category]; // get an array of questions of current category

      if (categoryQuestions.length > 0 && quizzes.length < 10) {
        const quiz: Quiz = {
          id: uuidv4(),
          category,
          questions: categoryQuestions.splice(0, 10) // take max 5 questions per quiz 
        };

        quizzes.push(quiz);
      }
    });

    // handle case when less than 10 different categories
    this.fillRemainingQuizzes(quizzes, categories);
  }

  // Form quizzes with random questions
  private fillRemainingQuizzes(quizzes: Quiz[], categories: { [key: string]: Question[] }): void {
    const remainingQuestions: Question[] = Object.values(categories).flat(); // get one dimensional array of questions

    while (quizzes.length < 10 && remainingQuestions.length >= 5) {
      const newQuiz: Quiz = {
        id: uuidv4(),
        category: 'Mixed',
        questions: remainingQuestions.splice(0, 5)
      };

      quizzes.push(newQuiz);
    }
  }

  // retrieve quiz by its id
  public getQuizById(id: string): Quiz | undefined {
    return this.quizzes.find(quiz => quiz.id === id);
  }
}
