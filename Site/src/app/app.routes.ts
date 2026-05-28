import { Routes } from '@angular/router';
import { HomeComponent } from './home/home';
import { DocsComponent } from './docs/docs';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'docs', component: DocsComponent },
];
