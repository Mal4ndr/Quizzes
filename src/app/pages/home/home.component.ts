import { Component, OnInit, signal } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { Quiz } from '../../models/quiz.model';
import { Router, RouterLink } from '@angular/router';
import { SpinnerComponent } from '../../components/spinner/spinner.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, SpinnerComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent implements OnInit {
  quizzes = signal<Quiz[]>([]);
  loading = signal<boolean>(false);
  lastFetchTime = signal<number>(0);
  errorMessage = signal<string | null>(null);

  constructor(private quizService: QuizService, private router: Router) { }

  ngOnInit(): void {
    this.fetchQuizzes();
  }

  fetchQuizzes(): void {
    const now = Date.now();
    const cooldownPeriod = 5000; // 5 seconds in milliseconds

    // check if enough time has passed since the last fetch
    if (this.loading() || (now - this.lastFetchTime() < cooldownPeriod)) {
      return; // prevent multiple fetch calls
    }

    this.loading.set(true); // set loading state
    this.errorMessage.set(null); // reset error message

    this.quizService.fetchQuestions().subscribe({
      next: (data) => {
        this.quizzes.set(this.quizService.buildQuizzes(data.results));
        this.loading.set(false); // reset loading state
        this.lastFetchTime.set(Date.now()); // update last fetch time
      },
      error: (error) => {
        console.error('Error fetching questions: ', error);
        this.loading.set(false); // reset loading state
        this.errorMessage.set('Sorry, we were unable to load data for the quizzes. Please try again later.'); // Set error message
      }
    });
  }

  playRandomQuiz(): void {
    if (this.quizzes().length > 0) {
      const randomIndex = Math.floor(Math.random() * this.quizzes().length);
      const randomQuizId = this.quizzes()[randomIndex].id;
      this.router.navigate(['/play', randomQuizId]);
    }
  }
}