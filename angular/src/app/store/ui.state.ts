import { createReducer, on, createAction, props } from '@ngrx/store';
import { Filters } from '../models/product.model';

export interface UIState {
  dateRange: '7d' | '14d' | '30d';
  filters: Filters;
  selectedProductId: string | null;
  isDrawerOpen: boolean;
  currentPage: number;
  rowsPerPage: number;
}

// Actions
export const setDateRange = createAction(
  '[UI] Set Date Range',
  props<{ dateRange: '7d' | '14d' | '30d' }>()
);
export const setFilters = createAction(
  '[UI] Set Filters',
  props<{ filters: Partial<Filters> }>()
);
export const setSelectedProduct = createAction(
  '[UI] Set Selected Product',
  props<{ productId: string | null }>()
);
export const setDrawerOpen = createAction(
  '[UI] Set Drawer Open',
  props<{ isOpen: boolean }>()
);
export const setCurrentPage = createAction(
  '[UI] Set Current Page',
  props<{ page: number }>()
);
export const setRowsPerPage = createAction(
  '[UI] Set Rows Per Page',
  props<{ rows: number }>()
);

// Initial state
const initialState: UIState = {
  dateRange: '7d',
  filters: {
    search: '',
    warehouse: 'All Warehouses',
    status: 'All Status'
  },
  selectedProductId: null,
  isDrawerOpen: false,
  currentPage: 1,
  rowsPerPage: 10
};

// Reducer
export const uiReducer = createReducer(
  initialState,
  on(setDateRange, (state, { dateRange }) => ({
    ...state,
    dateRange
  })),
  on(setFilters, (state, { filters }) => ({
    ...state,
    filters: { ...state.filters, ...filters },
    currentPage: 1 // Reset to first page when filters change
  })),
  on(setSelectedProduct, (state, { productId }) => ({
    ...state,
    selectedProductId: productId
  })),
  on(setDrawerOpen, (state, { isOpen }) => ({
    ...state,
    isDrawerOpen: isOpen
  })),
  on(setCurrentPage, (state, { page }) => ({
    ...state,
    currentPage: page
  })),
  on(setRowsPerPage, (state, { rows }) => ({
    ...state,
    rowsPerPage: rows,
    currentPage: 1 // Reset to first page when changing rows per page
  }))
);