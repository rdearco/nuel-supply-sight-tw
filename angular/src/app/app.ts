import { Component, signal } from '@angular/core';
import { KpiCards } from './components/kpi-cards/kpi-cards';
import { TrendChart } from './components/trend-chart/trend-chart';
import { TopBar } from './components/top-bar/top-bar';
import { ProductsTable, ProductWithStatus } from './components/products-table/products-table';
import { ProductDrawer } from './components/product-drawer/product-drawer';

@Component({
  selector: 'app-root',
  imports: [KpiCards, TrendChart, TopBar, ProductsTable, ProductDrawer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('supply-sight-dashboard');
  protected selectedProduct = signal<ProductWithStatus | null>(null);
  protected isDrawerOpen = signal(false);

  protected onProductClicked(product: ProductWithStatus): void {
    this.selectedProduct.set(product);
    this.isDrawerOpen.set(true);
  }

  protected onDrawerClosed(): void {
    this.isDrawerOpen.set(false);
    this.selectedProduct.set(null);
  }
}
