import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { CommonModule } from '@angular/common';
import { AppState } from '../../store/app.state';
import { KPIs } from '../../models/product.model';

@Component({
  selector: 'app-kpi-cards',
  imports: [CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css'
})
export class KpiCards implements OnInit {
  kpis$: Observable<KPIs>;

  constructor(private store: Store<AppState>) {
    this.kpis$ = this.store.select(state => state.products.kpis);
  }

  ngOnInit(): void {}
}
