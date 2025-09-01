import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductsService } from '../../services/products.service';

@Component({
  selector: 'app-kpi-cards',
  imports: [CommonModule],
  templateUrl: './kpi-cards.html',
  styleUrl: './kpi-cards.css'
})
export class KpiCards {
  private productsService = inject(ProductsService);
  
  protected kpiData = this.productsService.kpiData;
  protected isLoading = this.productsService.isLoading;
}
