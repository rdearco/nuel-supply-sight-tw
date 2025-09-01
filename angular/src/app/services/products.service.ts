import { Injectable, signal, computed } from '@angular/core';

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

export interface ProductUpdateData {
  demand?: number;
  stock?: number;
  warehouse?: string;
}

export interface KPIData {
  totalStock: number;
  totalDemand: number;
  fillRate: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private isLoadingSignal = signal<boolean>(true);
  private isUpdatingSignal = signal<boolean>(false);
  
  private productsSignal = signal<Product[]>([
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
    },
    {
      id: "P-1011",
      name: "Wing Nut M10",
      sku: "WNG-10-120",
      warehouse: "BLR-A",
      stock: 85,
      demand: 85
    },
    {
      id: "P-1012",
      name: "Machine Screw 8mm",
      sku: "MSC-08-300",
      warehouse: "PNQ-C",
      stock: 140,
      demand: 110
    },
    {
      id: "P-1013",
      name: "Thumb Screw M6",
      sku: "THM-06-90",
      warehouse: "DEL-B",
      stock: 20,
      demand: 70
    },
    {
      id: "P-1014",
      name: "Carriage Bolt 12mm",
      sku: "CAR-12-200",
      warehouse: "BLR-A",
      stock: 160,
      demand: 130
    }
  ]);

  // Public readonly signals
  readonly isLoading = this.isLoadingSignal.asReadonly();
  readonly isUpdating = this.isUpdatingSignal.asReadonly();
  readonly products = this.productsSignal.asReadonly();
  
  readonly productsWithStatus = computed<ProductWithStatus[]>(() => {
    return this.productsSignal().map(product => ({
      ...product,
      status: this.calculateStatus(product.stock, product.demand)
    }));
  });

  readonly kpiData = computed<KPIData>(() => {
    const products = this.productsSignal();
    const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
    const totalDemand = products.reduce((sum, product) => sum + product.demand, 0);
    const fillRate = totalDemand > 0 ? Math.round((totalStock / totalDemand) * 100) : 0;
    
    return {
      totalStock,
      totalDemand,
      fillRate
    };
  });

  constructor() {
    // Simulate initial loading
    setTimeout(() => {
      this.isLoadingSignal.set(false);
    }, 1000);
  }

  private calculateStatus(stock: number, demand: number): ProductStatus {
    const ratio = stock / demand;
    if (ratio >= 1.0) return 'Healthy';
    if (ratio >= 0.5) return 'Low';
    return 'Critical';
  }

  async updateProduct(id: string, updates: ProductUpdateData): Promise<void> {
    this.isUpdatingSignal.set(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const currentProducts = this.productsSignal();
    const updatedProducts = currentProducts.map(product => {
      if (product.id === id) {
        const updatedProduct = { ...product };
        
        if (updates.demand !== undefined) {
          updatedProduct.demand = updates.demand;
        }
        
        if (updates.stock !== undefined) {
          updatedProduct.stock = updates.stock;
        }
        
        if (updates.warehouse !== undefined) {
          updatedProduct.warehouse = updates.warehouse;
        }
        
        return updatedProduct;
      }
      return product;
    });
    
    this.productsSignal.set(updatedProducts);
    this.isUpdatingSignal.set(false);
  }

  getProductById(id: string): ProductWithStatus | undefined {
    return this.productsWithStatus().find(product => product.id === id);
  }
}