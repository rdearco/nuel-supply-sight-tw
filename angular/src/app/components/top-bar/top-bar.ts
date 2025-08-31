import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppState } from '../../store/app.state';
import { setDateRange } from '../../store/ui.state';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar implements OnInit {
  dateRange$: Observable<'7d' | '14d' | '30d'>;

  constructor(private store: Store<AppState>) {
    this.dateRange$ = this.store.select(state => state.ui.dateRange);
  }

  ngOnInit(): void {}

  selectDays(days: 7 | 14 | 30) {
    const dateRange: '7d' | '14d' | '30d' = `${days}d` as '7d' | '14d' | '30d';
    console.log(`Dispatching setDateRange action: ${dateRange}`);
    this.store.dispatch(setDateRange({ dateRange }));
    console.log(`Filtering for last ${days} days`);
  }

  isSelected(days: 7 | 14 | 30, currentRange: '7d' | '14d' | '30d'): boolean {
    const dateRange: '7d' | '14d' | '30d' = `${days}d` as '7d' | '14d' | '30d';
    return currentRange === dateRange;
  }
}
