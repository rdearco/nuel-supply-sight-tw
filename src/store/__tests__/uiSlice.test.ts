import { describe, it, expect } from 'vitest';
import uiReducer, { 
  setDateRange, 
  setFilters, 
  setSelectedProduct, 
  setDrawerOpen, 
  setCurrentPage,
  setRowsPerPage 
} from '../uiSlice';

describe('uiSlice', () => {
  const initialState = {
    dateRange: '7d' as const,
    filters: {
      search: '',
      warehouse: 'All Warehouses',
      status: 'All Status',
    },
    selectedProductId: null,
    isDrawerOpen: false,
    currentPage: 1,
    rowsPerPage: 10,
  };

  it('should return the initial state', () => {
    expect(uiReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  it('should handle setDateRange', () => {
    const actual = uiReducer(initialState, setDateRange('14d'));
    expect(actual.dateRange).toBe('14d');
  });

  it('should handle setFilters partially', () => {
    const actual = uiReducer(initialState, setFilters({ search: 'hex bolt' }));
    expect(actual.filters.search).toBe('hex bolt');
    expect(actual.filters.warehouse).toBe('All Warehouses'); // Should remain unchanged
    expect(actual.filters.status).toBe('All Status'); // Should remain unchanged
  });

  it('should handle setFilters with multiple fields', () => {
    const actual = uiReducer(initialState, setFilters({
      search: 'steel',
      warehouse: 'BLR-A',
      status: 'Critical'
    }));
    
    expect(actual.filters.search).toBe('steel');
    expect(actual.filters.warehouse).toBe('BLR-A');
    expect(actual.filters.status).toBe('Critical');
  });

  it('should reset currentPage to 1 when filters change', () => {
    const stateWithPage2 = { ...initialState, currentPage: 2 };
    const actual = uiReducer(stateWithPage2, setFilters({ search: 'test' }));
    
    expect(actual.currentPage).toBe(1);
    expect(actual.filters.search).toBe('test');
  });

  it('should handle setSelectedProduct', () => {
    const actual = uiReducer(initialState, setSelectedProduct('P-1001'));
    expect(actual.selectedProductId).toBe('P-1001');
  });

  it('should handle setSelectedProduct with null', () => {
    const stateWithProduct = { ...initialState, selectedProductId: 'P-1001' };
    const actual = uiReducer(stateWithProduct, setSelectedProduct(null));
    expect(actual.selectedProductId).toBeNull();
  });

  it('should handle setDrawerOpen', () => {
    const actual = uiReducer(initialState, setDrawerOpen(true));
    expect(actual.isDrawerOpen).toBe(true);
  });

  it('should handle setCurrentPage', () => {
    const actual = uiReducer(initialState, setCurrentPage(3));
    expect(actual.currentPage).toBe(3);
  });

  it('should handle multiple actions in sequence', () => {
    let state = uiReducer(initialState, setDateRange('30d'));
    state = uiReducer(state, setFilters({ warehouse: 'DEL-B' }));
    state = uiReducer(state, setSelectedProduct('P-1002'));
    state = uiReducer(state, setDrawerOpen(true));
    state = uiReducer(state, setCurrentPage(2));
    
    expect(state).toEqual({
      dateRange: '30d',
      filters: {
        search: '',
        warehouse: 'DEL-B',
        status: 'All Status',
      },
      selectedProductId: 'P-1002',
      isDrawerOpen: true,
      currentPage: 2,
      rowsPerPage: 10,
    });
  });

  it('should handle warehouse filter options', () => {
    const warehouses = ['BLR-A', 'PNQ-C', 'DEL-B'];
    
    warehouses.forEach(warehouse => {
      const actual = uiReducer(initialState, setFilters({ warehouse }));
      expect(actual.filters.warehouse).toBe(warehouse);
    });
  });

  it('should handle status filter options', () => {
    const statuses = ['Healthy', 'Low', 'Critical'];
    
    statuses.forEach(status => {
      const actual = uiReducer(initialState, setFilters({ status }));
      expect(actual.filters.status).toBe(status);
    });
  });

  it('should handle date range options', () => {
    const dateRanges: Array<'7d' | '14d' | '30d'> = ['7d', '14d', '30d'];
    
    dateRanges.forEach(dateRange => {
      const actual = uiReducer(initialState, setDateRange(dateRange));
      expect(actual.dateRange).toBe(dateRange);
    });
  });

  it('should handle setRowsPerPage', () => {
    const actual = uiReducer(initialState, setRowsPerPage(25));
    expect(actual.rowsPerPage).toBe(25);
    expect(actual.currentPage).toBe(1); // Should reset to page 1
  });

  it('should reset currentPage when rowsPerPage changes', () => {
    const stateWithDifferentPage = { ...initialState, currentPage: 3 };
    const actual = uiReducer(stateWithDifferentPage, setRowsPerPage(50));
    expect(actual.rowsPerPage).toBe(50);
    expect(actual.currentPage).toBe(1);
  });
});