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

  private quizResults: {
    score: number;
    totalTime: number;
    totalQuestions: number;
  } | null = null;

  constructor(private http: HttpClient) { }

  // Fetches max amount of questions
  public fetchQuestions(): Observable<{ results: Question[] }> {
    return this.http.get<{ results: Question[] }>(`${environment.triviaDb.baseUrl}/api.php?amount=50`);
  }

  // Builds quizzes from fetched questions 
  public buildQuizzes(questions: Question[]) {
    const categories: { [key: string]: Question[] } = {}; // an empty object to store categorized questions

    // group questions into categories 
    this.groupQuestionsByCategory(questions, categories); // receive defined categories by reference

    // form the quizzes
    this.quizzes = [];
    this.formQuizzesFromCategories(this.quizzes, categories); // receive filled quizzes by reference

    return this.quizzes;
  }

  // Saves quiz results
  public setQuizResults(score: number, totalTime: number, totalQuestions: number): void {
    this.quizResults = { score, totalTime, totalQuestions };
  }

  // Retrieves quiz results
  public getQuizResults() {
    return this.quizResults;
  }

  // Defines categories and add to them appropriate questions
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

  // Forms quizzes with 5 max questions that belong to 1 category
  private formQuizzesFromCategories(quizzes: Quiz[], categories: { [key: string]: Question[] }): void {
    Object.keys(categories).forEach(category => {
      const categoryQuestions = categories[category]; // get an array of questions of current category

      if (quizzes.length < 10) {
        const quizQuestions = categoryQuestions.slice(0, 5).map(question => ({
          ...question,
          id: uuidv4(),
          answers: this.shuffleAnswers([...question.incorrect_answers, question.correct_answer])
        }));

        quizzes.push({ id: uuidv4(), category: category, questions: quizQuestions });
      }
    });

    // handle case when less than 10 different categories
    this.fillRemainingQuizzes(quizzes, categories);
  }

  private shuffleAnswers(answers: string[]): string[] {
    return answers.sort(() => Math.random() - 0.5); // shuffles each pair of elements considering random number 
  }

  // Forms quizzes with random questions
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

  // Retrieves quiz by its id
  public getQuizById(id: string): Quiz | undefined {
    return this.quizzes.find(quiz => quiz.id === id);
  }
}
