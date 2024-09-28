import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { PlayComponent } from './pages/play/play.component';
import { FinishComponent } from './pages/finish/finish.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';

export const routes: Routes = [
   { path: 'home', component: HomeComponent },
   { path: 'play/:quizId', component: PlayComponent },
   { path: 'finish', component: FinishComponent },
   { path: '', redirectTo: 'home', pathMatch: 'full' },
   { path: '**', component: PageNotFoundComponent },
];
