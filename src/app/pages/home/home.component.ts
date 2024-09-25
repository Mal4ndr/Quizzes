import { Component, inject, OnInit } from '@angular/core';
import { QuizService } from '../../services/quiz.service';
import { Quiz } from '../../models/quiz.model';
import { CommonModule } from '@angular/common';

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
    this.quizService.fetchCategories().subscribe({
      next: (categoryData) => {

      }
    });
  }

  selectRandomCategories(categories: { id: number, name: string }[], count: number): { id: number, name: string }[] {
    const shuffled = [...categories].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, count);
  }
}
