import { Component, signal, computed, output } from '@angular/core';
import { NgClass } from '@angular/common';

export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export type ProductStatus = 'Healthy' | 'Low' | 'Critical';

export interface ProductWithStatus extends Product {
  status: ProductStatus;
}

@Component({
  selector: 'app-products-table',
  imports: [NgClass],
  templateUrl: './products-table.html',
  styleUrl: './products-table.css'
})
export class ProductsTable {
  productClicked = output<ProductWithStatus>();

  private mockProducts: Product[] = [
    {
      id: "P-1001",
      name: "12mm Hex Bolt",
      sku: "HEX-12-100",
      warehouse: "BLR-A",
      stock: 180,
      demand: 120
    },
    {
      id: "P-1002",
      name: "Steel Washer",
      sku: "WSR-08-500",
      warehouse: "BLR-A",
      stock: 50,
      demand: 80
    },
    {
      id: "P-1003",
      name: "M8 Nut",
      sku: "NUT-08-200",
      warehouse: "PNQ-C",
      stock: 80,
      demand: 80
    },
    {
      id: "P-1004",
      name: "Bearing 608ZZ",
      sku: "BRG-608-50",
      warehouse: "DEL-B",
      stock: 24,
      demand: 120
    },
    {
      id: "P-1005",
      name: "10mm Socket Screw",
      sku: "SCK-10-250",
      warehouse: "BLR-A",
      stock: 95,
      demand: 75
    },
    {
      id: "P-1006",
      name: "Flat Washer 6mm",
      sku: "FWS-06-300",
      warehouse: "PNQ-C",
      stock: 200,
      demand: 150
    },
    {
      id: "P-1007",
      name: "Spring Lock Washer",
      sku: "SLW-08-400",
      warehouse: "DEL-B",
      stock: 45,
      demand: 90
    },
    {
      id: "P-1008",
      name: "Torx Bolt T20",
      sku: "TRX-T20-150",
      warehouse: "BLR-A",
      stock: 120,
      demand: 100
    },
    {
      id: "P-1009",
      name: "Rubber Gasket 25mm",
      sku: "GSK-25-100",
      warehouse: "PNQ-C",
      stock: 30,
      demand: 60
    },
    {
      id: "P-1010",
      name: "Allen Key 4mm",
      sku: "ALK-04-80",
      warehouse: "DEL-B",
      stock: 65,
      demand: 45
    }
  ];

  protected products = computed(() => {
    return this.mockProducts.map(product => ({
      ...product,
      status: this.calculateStatus(product.stock, product.demand)
    }));
  });

  private calculateStatus(stock: number, demand: number): ProductStatus {
    const ratio = stock / demand;
    if (ratio >= 1.0) return 'Healthy';
    if (ratio >= 0.5) return 'Low';
    return 'Critical';
  }

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
}