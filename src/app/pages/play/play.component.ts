import { Component, OnInit } from '@angular/core';
import { Quiz } from '../../models/quiz.model';
import { ActivatedRoute, Router } from '@angular/router';
import { QuizService } from '../../services/quiz.service';
import { CommonModule } from '@angular/common';
import { Question } from '../../models/question.model';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit {
  quiz!: Quiz;
  currentQuestionIndex: number = 0;
  selectedAnswer: string | null = null;
  correctAnswer: string | null = null;
  isAnswerSelected: boolean = false;
  loadingError: boolean = false;

  totalScore: number = 0;
  totalTime: number = 0;
  startTime!: number;

  selectedAnswers: (string | null)[] = [];

  constructor(
    private quizService: QuizService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const quizId = this.route.snapshot.paramMap.get('quizId');

    if (quizId) {
      this.quiz = this.quizService.getQuizById(quizId) as Quiz;

      if (!this.quiz) {
        // show loading error
        this.loadingError = true;

        // redirect after a few seconds
        setTimeout(() => {
          this.router.navigate(['/home']);
        }, 5000); // 5 seconds delay
        return;
      }

      this.startTime = Date.now();
    } else {
      this.router.navigate(['/home']);
    }
  }

  // Retrieves question by index from an array
  get currentQuestion(): Question {
    return this.quiz.questions[this.currentQuestionIndex];
  }

  // Takes the user's input as the chosen answer and informs about it
  selectAnswer(answer: string): void {
    this.selectedAnswer = answer;
    this.isAnswerSelected = true;

    // save the selected answer in the array
    this.selectedAnswers[this.currentQuestionIndex] = answer;
  }

  nextQuestion(): void {
    if (this.selectedAnswer) {
      // check if the answer is correct
      if (this.selectedAnswer === this.currentQuestion.correct_answer) {
        this.totalScore++;
      }

      // retrieve correct answer for current question 
      this.correctAnswer = this.currentQuestion.correct_answer;
    }

    // reset selected answer state for next question
    this.resetStateForNextQuestion();

    // check if current question isn't the last
    if (this.currentQuestionIndex < this.quiz.questions.length - 1) {
      this.currentQuestionIndex++;
      this.selectedAnswer = this.selectedAnswers[this.currentQuestionIndex]; // load the saved answer if it exists
    } else {
      this.finishQuiz();
    }
  }

  previousQuestion(): void {
    if (this.currentQuestionIndex > 0) {
      this.currentQuestionIndex--;
      this.selectedAnswer = this.selectedAnswers[this.currentQuestionIndex]; // load the saved answer if it exists
      this.isAnswerSelected = !!this.selectedAnswer; // update answer selected state
    }
  }

  resetStateForNextQuestion(): void {
    this.isAnswerSelected = false;
    this.selectedAnswer = null;
    this.correctAnswer = null;
  }

  cancelQuiz(): void {
    this.router.navigate(['/home']);
  }

  finishQuiz(): void {
    this.totalTime = Math.floor((Date.now() - this.startTime) / 1000);
    this.quizService.setQuizResults(this.totalScore, this.totalTime, this.quiz.questions.length);
    this.router.navigate(['/finish']);
  }
}