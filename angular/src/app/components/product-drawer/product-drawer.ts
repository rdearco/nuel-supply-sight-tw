import { Component, input, output, signal, inject, computed } from '@angular/core';
import { NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductsService, ProductWithStatus } from '../../services/products.service';

interface UpdateDemandForm {
  demand: number;
}

interface TransferStockForm {
  stock?: number;
  warehouse: string;
}

@Component({
  selector: 'app-product-drawer',
  imports: [NgClass, FormsModule],
  templateUrl: './product-drawer.html',
  styleUrl: './product-drawer.css'
})
export class ProductDrawer {
  isOpen = input<boolean>(false);
  selectedProductId = input<string | null>(null);
  closed = output<void>();
  
  private productsService = inject(ProductsService);
  
  protected selectedProduct = computed(() => {
    const id = this.selectedProductId();
    return id ? this.productsService.getProductById(id) : null;
  });
  
  protected isUpdating = this.productsService.isUpdating;
  
  protected demandForm = signal<UpdateDemandForm>({ demand: 0 });
  protected stockForm = signal<TransferStockForm>({ stock: undefined, warehouse: 'BLR-A' });
  
  protected warehouses = ['BLR-A', 'PNQ-C', 'DEL-B'];
  
  protected isSubmittingDemand = signal(false);
  protected isSubmittingStock = signal(false);

  protected getStatusBadgeClasses(status: string): string {
    const baseClasses = 'inline-flex items-center justify-center px-3 py-1 rounded-full text-sm font-semibold';
    
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

  protected onClose(): void {
    this.closed.emit();
  }

  protected async onUpdateDemand(): Promise<void> {
    const product = this.selectedProduct();
    const demand = this.demandForm().demand;
    
    if (product && demand > 0) {
      this.isSubmittingDemand.set(true);
      try {
        await this.productsService.updateProduct(product.id, { demand });
        // Reset form
        this.demandForm.set({ demand: 0 });
      } catch (error) {
        console.error('Failed to update demand:', error);
      } finally {
        this.isSubmittingDemand.set(false);
      }
    }
  }

  protected async onTransferStock(): Promise<void> {
    const product = this.selectedProduct();
    const form = this.stockForm();
    
    if (product && form.stock !== undefined && form.stock !== 0) {
      this.isSubmittingStock.set(true);
      try {
        const newStock = product.stock + form.stock;
        await this.productsService.updateProduct(product.id, { 
          stock: newStock, 
          warehouse: form.warehouse 
        });
        // Reset form
        this.stockForm.set({ stock: undefined, warehouse: form.warehouse });
      } catch (error) {
        console.error('Failed to transfer stock:', error);
      } finally {
        this.isSubmittingStock.set(false);
      }
    }
  }

  protected formatNumber(num: number): string {
    return num.toLocaleString();
  }

  protected updateDemandValue(value: string): void {
    const numValue = parseFloat(value);
    this.demandForm.set({ demand: isNaN(numValue) ? 0 : numValue });
  }

  protected updateStockValue(value: string): void {
    const numValue = parseFloat(value);
    const currentForm = this.stockForm();
    this.stockForm.set({ 
      ...currentForm, 
      stock: isNaN(numValue) ? undefined : numValue 
    });
  }

  protected updateWarehouse(warehouse: string): void {
    const currentForm = this.stockForm();
    this.stockForm.set({ ...currentForm, warehouse });
  }

  protected isDemandButtonDisabled(): boolean {
    const demand = this.demandForm().demand;
    return demand == null || demand === 0 || isNaN(demand) || this.isSubmittingDemand() || this.isUpdating();
  }

  protected isStockButtonDisabled(): boolean {
    const stock = this.stockForm().stock;
    return stock == null || stock === 0 || isNaN(stock) || this.isSubmittingStock() || this.isUpdating();
  }
}