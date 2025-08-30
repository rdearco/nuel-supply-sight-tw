import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { DateRange, Filters } from '../types';

interface UIState {
  dateRange: DateRange;
  filters: Filters;
  selectedProductId: string | null;
  isDrawerOpen: boolean;
  currentPage: number;
}

const initialState: UIState = {
  dateRange: '7d',
  filters: {
    search: '',
    warehouse: 'All Warehouses',
    status: 'All Status',
  },
  selectedProductId: null,
  isDrawerOpen: false,
  currentPage: 1,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    setDateRange: (state, action: PayloadAction<DateRange>) => {
      state.dateRange = action.payload;
    },
    setFilters: (state, action: PayloadAction<Partial<Filters>>) => {
      state.filters = { ...state.filters, ...action.payload };
      state.currentPage = 1; // Reset to first page when filtering
    },
    setSelectedProduct: (state, action: PayloadAction<string | null>) => {
      state.selectedProductId = action.payload;
    },
    setDrawerOpen: (state, action: PayloadAction<boolean>) => {
      state.isDrawerOpen = action.payload;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.currentPage = action.payload;
    },
  },
});

export const { setDateRange, setFilters, setSelectedProduct, setDrawerOpen, setCurrentPage } = uiSlice.actions;
export default uiSlice.reducer;