import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Product, ProductWithStatus, ProductStatus, KPIData, ProductUpdateData } from '../types';
import { mockProducts } from '../data/mockData';

const getProductStatus = (stock: number, demand: number): ProductStatus => {
  if (stock > demand) return 'Healthy';
  if (stock === demand) return 'Low';
  return 'Critical';
};

const calculateKPIs = (products: Product[], dateRange?: string): KPIData => {
  // Apply date range multiplier to simulate different data volumes for different periods
  const getDateRangeMultiplier = (range?: string): number => {
    switch (range) {
      case '7d': return 0.7;
      case '14d': return 0.85;
      case '30d': return 1.0;
      default: return 1.0;
    }
  };

  const multiplier = getDateRangeMultiplier(dateRange);
  
  const baseStock = products.reduce((sum, product) => sum + product.stock, 0);
  const baseDemand = products.reduce((sum, product) => sum + product.demand, 0);
  
  const totalStock = Math.round(baseStock * multiplier);
  const totalDemand = Math.round(baseDemand * multiplier);
  
  const fillRate = totalDemand > 0 ? 
    (products.reduce((sum, product) => sum + Math.min(product.stock * multiplier, product.demand * multiplier), 0) / totalDemand) * 100 
    : 0;

  return {
    totalStock,
    totalDemand,
    fillRate: Number(fillRate.toFixed(1))
  };
};

const addStatusToProducts = (products: Product[]): ProductWithStatus[] => {
  return products.map(product => ({
    ...product,
    status: getProductStatus(product.stock, product.demand)
  }));
};

interface ProductsState {
  products: Product[];
  productsWithStatus: ProductWithStatus[];
  kpis: KPIData;
  loading: boolean;
  error: string | null;
}

const initialState: ProductsState = {
  products: mockProducts,
  productsWithStatus: addStatusToProducts(mockProducts),
  kpis: calculateKPIs(mockProducts),
  loading: false,
  error: null,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    updateProduct: (state, action: PayloadAction<{ id: string; updates: ProductUpdateData }>) => {
      const { id, updates } = action.payload;
      const index = state.products.findIndex(p => p.id === id);
      
      if (index !== -1) {
        state.products[index] = { ...state.products[index], ...updates };
        state.productsWithStatus = addStatusToProducts(state.products);
        state.kpis = calculateKPIs(state.products);
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const { updateProduct, setLoading, setError } = productsSlice.actions;
export default productsSlice.reducer;