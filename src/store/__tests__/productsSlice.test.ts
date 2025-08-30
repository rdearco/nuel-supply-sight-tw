import { describe, it, expect } from 'vitest';
import productsReducer, { updateProduct, setLoading, setError } from '../productsSlice';
import { mockProducts } from '../../data/mockData';
import { ProductStatus } from '../../types';
import type { RootState } from '../index';

describe('productsSlice', () => {
  const initialState: RootState['products'] = {
    products: mockProducts,
    productsWithStatus: mockProducts.map(product => ({
      ...product,
      status: (product.stock > product.demand ? 'Healthy' : 
              product.stock === product.demand ? 'Low' : 'Critical') as ProductStatus
    })),
    kpis: {
      totalStock: 1294,
      totalDemand: 1315,
      fillRate: 80.9
    },
    loading: false,
    error: null,
  };

  it('should return the initial state', () => {
    expect(productsReducer(undefined, { type: 'unknown' })).toBeDefined();
  });

  it('should handle setLoading', () => {
    const actual = productsReducer(initialState, setLoading(true));
    expect(actual.loading).toBe(true);
  });

  it('should handle setError', () => {
    const errorMessage = 'Something went wrong';
    const actual = productsReducer(initialState, setError(errorMessage));
    expect(actual.error).toBe(errorMessage);
  });

  it('should handle updateProduct for demand', () => {
    const updatePayload = {
      id: 'P-1001',
      updates: { demand: 150 }
    };
    
    const actual = productsReducer(initialState, updateProduct(updatePayload));
    
    const updatedProduct = actual.products.find(p => p.id === 'P-1001');
    expect(updatedProduct?.demand).toBe(150);
    
    // Check that status is recalculated
    const updatedProductWithStatus = actual.productsWithStatus.find(p => p.id === 'P-1001');
    expect(updatedProductWithStatus?.status).toBe('Healthy'); // 180 > 150
  });

  it('should handle updateProduct for stock and warehouse', () => {
    const updatePayload = {
      id: 'P-1001',
      updates: { 
        stock: 100,
        warehouse: 'DEL-B' 
      }
    };
    
    const actual = productsReducer(initialState, updateProduct(updatePayload));
    
    const updatedProduct = actual.products.find(p => p.id === 'P-1001');
    expect(updatedProduct?.stock).toBe(100);
    expect(updatedProduct?.warehouse).toBe('DEL-B');
    
    // Check that status is recalculated (100 < 120)
    const updatedProductWithStatus = actual.productsWithStatus.find(p => p.id === 'P-1001');
    expect(updatedProductWithStatus?.status).toBe('Critical');
  });

  it('should recalculate KPIs when product is updated', () => {
    const updatePayload = {
      id: 'P-1001',
      updates: { stock: 50 } // Reduce stock from 180 to 50
    };
    
    const actual = productsReducer(initialState, updateProduct(updatePayload));
    
    // Total stock should decrease by 130 (1294 - 130 = 1164)
    expect(actual.kpis.totalStock).toBe(1164);
    expect(actual.kpis.totalDemand).toBe(1315); // Should remain same
    expect(actual.kpis.fillRate).toBeLessThan(80.9); // Should decrease
  });

  it('should not update product if ID not found', () => {
    const updatePayload = {
      id: 'NON-EXISTENT',
      updates: { demand: 150 }
    };
    
    const actual = productsReducer(initialState, updateProduct(updatePayload));
    
    // State should remain unchanged
    expect(actual.products).toEqual(initialState.products);
    expect(actual.kpis).toEqual(initialState.kpis);
  });

  it('should calculate correct status for different scenarios', () => {
    // Test Low status (stock === demand)
    const lowStatusUpdate = {
      id: 'P-1001',
      updates: { stock: 120 } // Same as demand
    };
    
    const lowResult = productsReducer(initialState, updateProduct(lowStatusUpdate));
    const lowProduct = lowResult.productsWithStatus.find(p => p.id === 'P-1001');
    expect(lowProduct?.status).toBe('Low');
    
    // Test Critical status (stock < demand)
    const criticalStatusUpdate = {
      id: 'P-1001',
      updates: { stock: 80 } // Less than demand (120)
    };
    
    const criticalResult = productsReducer(initialState, updateProduct(criticalStatusUpdate));
    const criticalProduct = criticalResult.productsWithStatus.find(p => p.id === 'P-1001');
    expect(criticalProduct?.status).toBe('Critical');
  });

  it('should calculate fill rate correctly', () => {
    // Update multiple products to have exact stock = demand for better fill rate
    let currentState = initialState;
    
    // Update some products to have stock = demand
    const updates = [
      { id: 'P-1001', stock: 120 }, // was 180, demand 120
      { id: 'P-1002', stock: 80 },  // was 50, demand 80  
      { id: 'P-1004', stock: 120 }, // was 24, demand 120
      { id: 'P-1007', stock: 90 },  // was 45, demand 90
      { id: 'P-1009', stock: 60 },  // was 30, demand 60
      { id: 'P-1013', stock: 70 }   // was 20, demand 70
    ];
    
    for (const update of updates) {
      currentState = productsReducer(currentState, updateProduct({
        id: update.id, 
        updates: { stock: update.stock }
      }));
    }
    
    // Fill rate should be higher after these updates
    expect(currentState.kpis.fillRate).toBeGreaterThan(initialState.kpis.fillRate);
  });
});