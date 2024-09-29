import { Component, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../models/quiz.model';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  quizzes: Quiz[] = [];

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit(): void {
    this.quizService.fetchQuestions().subscribe({
      next: (data) => this.quizzes = this.quizService.buildQuizzes(data.results),
      error: (error) => console.error('Error fetching questions: ', error)
    });
  }

  playRandomQuiz(): void {
    const randomIndex = Math.floor(Math.random() * this.quizzes.length);
    const randomQuizId = this.quizzes[randomIndex].id;
    this.router.navigate(['/play', randomQuizId]);
  }
}
