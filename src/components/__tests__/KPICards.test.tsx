import { describe, it, expect } from 'vitest';
import { act, screen } from '@testing-library/react';
import { render } from '../../test/test-utils';
import KPICards from '../KPICards';

describe('KPICards', () => {
  const mockState = {
    products: {
      products: [
        { id: '1', stock: 334, demand: 400 }
      ],
      productsWithStatus: [],
      kpis: { totalStock: 334, totalDemand: 400, fillRate: 68.5 },
      loading: false,
      error: null
    },
    ui: {
      dateRange: '30d' as const,
      selectedProduct: null,
      isDrawerOpen: false
    }
  };

  it('renders all KPI cards', () => {
    render(<KPICards />, { preloadedState: mockState });
    
    expect(screen.getByText('Total Stock')).toBeInTheDocument();
    expect(screen.getByText('Total Demand')).toBeInTheDocument();
    expect(screen.getByText('Fill Rate')).toBeInTheDocument();
  });

  it('displays correct KPI values', () => {
    render(<KPICards />, { preloadedState: mockState });
    
    expect(screen.getByText('334')).toBeInTheDocument();
    expect(screen.getByText('400')).toBeInTheDocument();
    expect(screen.getByText('83.5%')).toBeInTheDocument();
  });

  it('formats large numbers with commas', async () => {
    const largeNumberState = {
      products: {
        products: [
          { id: '1', stock: 906, demand: 920 }
        ],
        productsWithStatus: [],
        kpis: { totalStock: 906, totalDemand: 920, fillRate: 81.0 },
        loading: false,
        error: null
      },
      ui: {
        dateRange: '30d' as const,
        selectedProduct: null,
        isDrawerOpen: false
      }
    };

    await act(async () => {
      render(<KPICards />, { preloadedState: largeNumberState });
    });
    
    expect(screen.getByText('906')).toBeInTheDocument();
    expect(screen.getByText('920')).toBeInTheDocument();
  });

  it('applies correct styling to cards', () => {
    render(<KPICards />, { preloadedState: mockState });
    
    const cards = screen.getAllByRole('generic').filter(el => 
      el.className.includes('bg-white') && el.className.includes('rounded-lg')
    );
    
    expect(cards).toHaveLength(3);
  });
});