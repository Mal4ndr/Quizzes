import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';


@Component({
  selector: 'app-finish',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.scss'
})
export class FinishComponent implements OnInit {
  score: number = 0;
  totalTime: number = 0;
  totalQuestions: number = 0;
  averageTimePerQuestion: number = 0;
  successRate: number = 0;

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit(): void {
    // retrieve the quiz results from the service
    const results = this.quizService.getQuizResults();

    if (results) {
      this.score = results.score;
      this.totalTime = results.totalTime;
      this.totalQuestions = results.totalQuestions;
      this.calculateStatistics();
    } else {
      // if no results are available, navigate back to home
      this.router.navigate(['/home']);
    }
  }

  calculateStatistics(): void {
    // calculate average time per question
    this.averageTimePerQuestion = this.totalTime / this.totalQuestions;

    // calculate success rate as a percentage
    this.successRate = (this.score / this.totalQuestions) * 100;
  }
}
