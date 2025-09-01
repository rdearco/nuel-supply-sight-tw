import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService, DateRange } from '../../services/products.service';

@Component({
  selector: 'app-top-bar',
  imports: [CommonModule],
  templateUrl: './top-bar.html',
  styleUrl: './top-bar.css'
})
export class TopBar {
  private productsService = inject(ProductsService);
  
  protected dateRange = this.productsService.dateRange;

  protected selectDays(days: 7 | 14 | 30): void {
    const dateRange: DateRange = `${days}d` as DateRange;
    console.log(`Setting date range: ${dateRange}`);
    this.productsService.setDateRange(dateRange);
    console.log(`Filtering for last ${days} days`);
  }

  protected isSelected(days: 7 | 14 | 30, currentRange: DateRange): boolean {
    const dateRange: DateRange = `${days}d` as DateRange;
    return currentRange === dateRange;
  }
}
