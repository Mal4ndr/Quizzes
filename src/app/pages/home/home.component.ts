import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../models/quiz.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  quizzes: Quiz[] = [];

  constructor(private quizService: QuizService) { }

  ngOnInit(): void {
    this.quizService.fetchQuestions().subscribe({
      next: (data) => this.quizzes = this.quizService.organizeQuizzes(data.results),
      error: (error) => console.error('Error fetching questions: ', error)
    });
  }
}
