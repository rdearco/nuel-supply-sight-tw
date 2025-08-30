import { describe, it, expect } from 'vitest';
import productsReducer, { updateProduct, setLoading, setError } from '../productsSlice';
import { mockProducts } from '../../data/mockData';
import { ProductStatus } from '../../types';

describe('productsSlice', () => {
  const initialState = {
    products: mockProducts,
    productsWithStatus: mockProducts.map(product => ({
      ...product,
      status: (product.stock > product.demand ? 'Healthy' : 
              product.stock === product.demand ? 'Low' : 'Critical') as ProductStatus
    })),
    kpis: {
      totalStock: 334,
      totalDemand: 400,
      fillRate: 68.5
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
    
    // Total stock should decrease by 130 (334 - 130 = 204)
    expect(actual.kpis.totalStock).toBe(204);
    expect(actual.kpis.totalDemand).toBe(400); // Should remain same
    expect(actual.kpis.fillRate).toBeLessThan(68.5); // Should decrease
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
    // Update to make all products have exact stock = demand
    const state1 = productsReducer(initialState, updateProduct({
      id: 'P-1001', updates: { stock: 120 }
    }));
    const state2 = productsReducer(state1, updateProduct({
      id: 'P-1002', updates: { stock: 80 }
    }));
    const state3 = productsReducer(state2, updateProduct({
      id: 'P-1003', updates: { stock: 80 }
    }));
    const finalState = productsReducer(state3, updateProduct({
      id: 'P-1004', updates: { stock: 120 }
    }));
    
    // Fill rate should be 100% when all demands can be met exactly
    expect(finalState.kpis.fillRate).toBe(100);
  });
});