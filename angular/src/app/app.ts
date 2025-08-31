import { Component, signal } from '@angular/core';
import { KpiCards } from './components/kpi-cards/kpi-cards';

@Component({
  selector: 'app-root',
  imports: [KpiCards],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('supply-sight-dashboard');
}
