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

export interface KPIData {
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

export type DateRange = '7d' | '14d' | '30d';

export interface ProductUpdateData {
  demand?: number;
  stock?: number;
  warehouse?: string;
}