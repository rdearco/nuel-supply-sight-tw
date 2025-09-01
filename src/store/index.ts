import { configureStore, createSelector } from '@reduxjs/toolkit';
import productsReducer from './productsSlice';
import uiReducer from './uiSlice';
import { KPIData } from '../types';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    ui: uiReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Selectors that combine data from multiple slices
export const selectDateRangeAwareKPIs = createSelector(
  [(state: RootState) => state.products.products, (state: RootState) => state.ui.dateRange],
  (products, dateRange): KPIData => {
    // Apply date range multiplier to simulate different data volumes for different periods
    const getDateRangeMultiplier = (range: string): number => {
      switch (range) {
        case '7d': return 0.7;
        case '14d': return 0.85;
        case '30d': return 1.0;
        default: return 1.0;
      }
    };

    const multiplier = getDateRangeMultiplier(dateRange);
    
    const baseStock = products ? products.reduce((sum, product) => sum + product.stock, 0) : 0;
    const baseDemand = products ? products.reduce((sum, product) => sum + product.demand, 0) : 0;
    
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
  }
);