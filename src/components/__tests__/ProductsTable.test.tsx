import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../test/test-utils';
import ProductsTable from '../ProductsTable';

describe('ProductsTable', () => {
  const mockState = {
    products: {
      productsWithStatus: [
        {
          id: 'P-1001',
          name: '12mm Hex Bolt',
          sku: 'HEX-12-100',
          warehouse: 'BLR-A',
          stock: 180,
          demand: 120,
          status: 'Healthy'
        },
        {
          id: 'P-1002',
          name: 'Steel Washer',
          sku: 'WSR-08-500',
          warehouse: 'BLR-A',
          stock: 50,
          demand: 80,
          status: 'Critical'
        }
      ]
    },
    ui: {
      filters: {
        search: '',
        warehouse: 'All Warehouses',
        status: 'All Status'
      },
      currentPage: 1,
      rowsPerPage: 10
    }
  };

  it('renders table headers', () => {
    render(<ProductsTable />, { preloadedState: mockState });
    
    expect(screen.getByText('Product')).toBeInTheDocument();
    expect(screen.getByText('SKU')).toBeInTheDocument();
    expect(screen.getByText('Warehouse')).toBeInTheDocument();
    expect(screen.getByText('Stock')).toBeInTheDocument();
    expect(screen.getByText('Demand')).toBeInTheDocument();
    expect(screen.getByText('Status')).toBeInTheDocument();
  });

  it('displays product count in title', () => {
    render(<ProductsTable />, { preloadedState: mockState });
    
    expect(screen.getByText('Products (2)')).toBeInTheDocument();
  });

  it('renders product data', () => {
    render(<ProductsTable />, { preloadedState: mockState });
    
    expect(screen.getByText('12mm Hex Bolt')).toBeInTheDocument();
    expect(screen.getByText('HEX-12-100')).toBeInTheDocument();
    expect(screen.getByText('Steel Washer')).toBeInTheDocument();
    expect(screen.getByText('WSR-08-500')).toBeInTheDocument();
  });

  it('renders status badges with correct colors', () => {
    render(<ProductsTable />, { preloadedState: mockState });
    
    const healthyBadge = screen.getByText('Healthy');
    const criticalBadge = screen.getByText('Critical');
    
    expect(healthyBadge).toHaveClass('bg-green-500', 'text-white');
    expect(criticalBadge).toHaveClass('bg-red-500', 'text-white');
  });

  it('applies red background to critical rows', () => {
    render(<ProductsTable />, { preloadedState: mockState });
    
    const criticalRow = screen.getByText('Steel Washer').closest('tr');
    expect(criticalRow).toHaveClass('bg-red-50');
  });

  it('shows pagination controls', () => {
    render(<ProductsTable />, { preloadedState: mockState });
    
    expect(screen.getByText('Rows per page:')).toBeInTheDocument();
    expect(screen.getByText('10')).toBeInTheDocument();
    expect(screen.getByText('1–2 of 2')).toBeInTheDocument();
  });

  it('handles product row click', () => {
    render(<ProductsTable />, { preloadedState: mockState });
    
    const productRow = screen.getByText('12mm Hex Bolt').closest('tr');
    expect(productRow).toHaveClass('cursor-pointer');
    
    fireEvent.click(productRow!);
    // The drawer should be opened but testing that requires checking Redux state
  });

  it('filters products based on search', () => {
    const filteredState = {
      ...mockState,
      ui: {
        ...mockState.ui,
        filters: {
          ...mockState.ui.filters,
          search: 'hex'
        }
      }
    };
    
    render(<ProductsTable />, { preloadedState: filteredState });
    
    expect(screen.getByText('12mm Hex Bolt')).toBeInTheDocument();
    expect(screen.queryByText('Steel Washer')).not.toBeInTheDocument();
  });

  it('shows pagination buttons', () => {
    render(<ProductsTable />, { preloadedState: mockState });
    
    // Find pagination buttons by their SVG icons (ChevronLeftIcon and ChevronRightIcon)
    const buttons = screen.getAllByRole('button');
    const paginationButtons = buttons.filter(btn => btn.querySelector('svg'));
    
    expect(paginationButtons.length).toBe(2);
    // First button (previous) should be disabled since we're on page 1
    // Second button (next) should be disabled since we only have 2 items (fits on one page)
    expect(paginationButtons[0]).toBeDisabled(); // Previous button
    expect(paginationButtons[1]).toBeDisabled(); // Next button
  });
});