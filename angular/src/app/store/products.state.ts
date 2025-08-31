import { createReducer, on, createAction, props } from '@ngrx/store';
import { Product, ProductWithStatus, KPIs, ProductStatus } from '../models/product.model';
import { mockProducts } from '../data/mock-data';

export interface ProductsState {
  products: Product[];
  productsWithStatus: ProductWithStatus[];
  kpis: KPIs;
  loading: boolean;
  error: string | null;
}

// Actions
export const loadProducts = createAction('[Products] Load Products');
export const loadProductsSuccess = createAction(
  '[Products] Load Products Success',
  props<{ products: Product[] }>()
);
export const loadProductsFailure = createAction(
  '[Products] Load Products Failure',
  props<{ error: string }>()
);
export const updateProduct = createAction(
  '[Products] Update Product',
  props<{ id: string; updates: Partial<Product> }>()
);
export const setLoading = createAction(
  '[Products] Set Loading',
  props<{ loading: boolean }>()
);
export const setError = createAction(
  '[Products] Set Error',
  props<{ error: string | null }>()
);

// Helper functions
const calculateStatus = (stock: number, demand: number): ProductStatus => {
  if (stock > demand) return 'Healthy';
  if (stock === demand) return 'Low';
  return 'Critical';
};

const calculateKPIs = (products: Product[]): KPIs => {
  const totalStock = products.reduce((sum, product) => sum + product.stock, 0);
  const totalDemand = products.reduce((sum, product) => sum + product.demand, 0);
  const healthyProducts = products.filter(p => p.stock >= p.demand).length;
  const fillRate = (healthyProducts / products.length) * 100;

  return {
    totalStock,
    totalDemand,
    fillRate: Math.round(fillRate * 10) / 10
  };
};

const addStatusToProducts = (products: Product[]): ProductWithStatus[] => {
  return products.map(product => ({
    ...product,
    status: calculateStatus(product.stock, product.demand)
  }));
};

// Initial state
const initialState: ProductsState = {
  products: mockProducts,
  productsWithStatus: addStatusToProducts(mockProducts),
  kpis: calculateKPIs(mockProducts),
  loading: false,
  error: null
};

// Reducer
export const productsReducer = createReducer(
  initialState,
  on(loadProducts, (state) => ({
    ...state,
    loading: true,
    error: null
  })),
  on(loadProductsSuccess, (state, { products }) => ({
    ...state,
    products,
    productsWithStatus: addStatusToProducts(products),
    kpis: calculateKPIs(products),
    loading: false,
    error: null
  })),
  on(loadProductsFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error
  })),
  on(updateProduct, (state, { id, updates }) => {
    const updatedProducts = state.products.map(product =>
      product.id === id ? { ...product, ...updates } : product
    );
    
    return {
      ...state,
      products: updatedProducts,
      productsWithStatus: addStatusToProducts(updatedProducts),
      kpis: calculateKPIs(updatedProducts)
    };
  }),
  on(setLoading, (state, { loading }) => ({
    ...state,
    loading
  })),
  on(setError, (state, { error }) => ({
    ...state,
    error
  }))
);