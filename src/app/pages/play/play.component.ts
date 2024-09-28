import { Component, OnInit } from '@angular/core';
import { Quiz } from '../../models/quiz.model';
import { ActivatedRoute } from '@angular/router';
import { QuizService } from '../../services/quiz.service';

@Component({
  selector: 'app-play',
  standalone: true,
  imports: [],
  templateUrl: './play.component.html',
  styleUrl: './play.component.scss'
})
export class PlayComponent implements OnInit {
  quizId: string | null = null;
  quiz: Quiz | undefined;

  constructor(private route: ActivatedRoute, private quizService: QuizService) { }

  ngOnInit(): void {
    this.quizId = this.route.snapshot.paramMap.get('quizId');

    if (this.quizId) {
      this.quiz = this.quizService.getQuizById(this.quizId);
    } else {
      console.error("Quiz's id is null")
    }
  }
}
