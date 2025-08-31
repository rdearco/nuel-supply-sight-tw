export interface Product {
  id: string;
  name: string;
  sku: string;
  warehouse: string;
  stock: number;
  demand: number;
}

export interface ProductWithStatus extends Product {
  status: ProductStatus;
}

export type ProductStatus = 'Healthy' | 'Low' | 'Critical';

export interface KPIs {
  totalStock: number;
  totalDemand: number;
  fillRate: number;
}

export interface TrendData {
  date: string;
  stock: number;
  demand: number;
}

export interface Filters {
  search: string;
  warehouse: string;
  status: string;
}