import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-finish',
  standalone: true,
  imports: [RouterLink],
  templateUrl: './finish.component.html',
  styleUrl: './finish.component.scss'
})
export class FinishComponent implements OnInit {
  score: number = 0;
  totalTime: number = 0;
  totalQuestions: number = 0;

  constructor(private router: Router) { }

  ngOnInit(): void {
    const navigation = this.router.getCurrentNavigation();
    if (navigation && navigation.extras.state) {
      this.score = navigation.extras.state['score'];
      this.totalTime = navigation.extras.state['time'];
      this.totalQuestions = navigation.extras.state['totalQuestions'];
    }
  }
}
