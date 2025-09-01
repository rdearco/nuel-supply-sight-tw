import { Component, output, inject, signal, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { ProductsService, ProductWithStatus, ProductStatus } from '../../services/products.service';

@Component({
  selector: 'app-products-table',
  imports: [NgClass],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css'
})
export class ProductsTable {
  productClicked = output<ProductWithStatus>();
  
  private productsService = inject(ProductsService);
  
  // Pagination state
  protected currentPage = signal(1);
  protected rowsPerPage = signal(10);
  
  // All products from service
  protected allProducts = this.productsService.productsWithStatus;
  protected isLoading = this.productsService.isLoading;
  protected isUpdating = this.productsService.isUpdating;
  
  // Computed paginated products
  protected paginatedProducts = computed(() => {
    const products = this.allProducts();
    const page = this.currentPage();
    const itemsPerPage = this.rowsPerPage();
    const startIndex = (page - 1) * itemsPerPage;
    
    return products.slice(startIndex, startIndex + itemsPerPage);
  });
  
  // Computed pagination info
  protected totalPages = computed(() => {
    return Math.ceil(this.allProducts().length / this.rowsPerPage());
  });
  
  protected startIndex = computed(() => {
    return (this.currentPage() - 1) * this.rowsPerPage() + 1;
  });
  
  protected endIndex = computed(() => {
    const start = this.startIndex();
    const total = this.allProducts().length;
    const itemsPerPage = this.rowsPerPage();
    return Math.min(start + itemsPerPage - 1, total);
  });

  protected getStatusBadgeClasses(status: ProductStatus): string {
    const baseClasses = 'inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold w-20';
    
    switch (status) {
      case 'Healthy':
        return `${baseClasses} bg-green-500 text-white`;
      case 'Low':
        return `${baseClasses} bg-yellow-500 text-white`;
      case 'Critical':
        return `${baseClasses} bg-red-500 text-white`;
      default:
        return `${baseClasses} bg-gray-500 text-white`;
    }
  }

  protected getRowClasses(status: ProductStatus): string {
    return `cursor-pointer hover:bg-gray-50 transition-colors ${status === 'Critical' ? 'bg-red-50' : ''}`;
  }

  protected onProductClick(product: ProductWithStatus): void {
    this.productClicked.emit(product);
  }

  protected formatNumber(num: number): string {
    return num.toLocaleString();
  }

  protected onRowsPerPageChange(event: Event): void {
    const select = event.target as HTMLSelectElement;
    const newRowsPerPage = parseInt(select.value, 10);
    this.rowsPerPage.set(newRowsPerPage);
    this.currentPage.set(1); // Reset to first page when changing rows per page
  }

  protected onPreviousPage(): void {
    if (this.currentPage() > 1) {
      this.currentPage.set(this.currentPage() - 1);
    }
  }

  protected onNextPage(): void {
    if (this.currentPage() < this.totalPages()) {
      this.currentPage.set(this.currentPage() + 1);
    }
  }

  protected canGoPrevious(): boolean {
    return this.currentPage() > 1;
  }

  protected canGoNext(): boolean {
    return this.currentPage() < this.totalPages();
  }
}