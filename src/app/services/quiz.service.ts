import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';

import { Quiz } from '../models/quiz.model';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class QuizService {

  constructor(private http: HttpClient) { }

  // fetch array of categories
  fetchCategories(): Observable<{ trivia_categories: { id: number; name: string }[] }> {
    return this.http.get<{ trivia_categories: { id: number; name: string }[] }>(environment.triviaDb.categoriesUrl);
  }

  // fetch array with 10 questions of a category passed as a param
  fetchQuestionsByCategory(categoryId: number): Observable<{ results: Quiz[] }> {
    return this.http.get<{ results: Quiz[] }>(`${environment.triviaDb.baseUrl}?amount=10&category=${categoryId}`);
  }
}
