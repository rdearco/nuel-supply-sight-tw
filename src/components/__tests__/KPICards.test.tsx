import { describe, it, expect } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../test/test-utils';
import KPICards from '../KPICards';

describe('KPICards', () => {
  const mockState = {
    products: {
      kpis: {
        totalStock: 334,
        totalDemand: 400,
        fillRate: 68.5
      }
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
    expect(screen.getByText('68.5%')).toBeInTheDocument();
  });

  it('formats large numbers with commas', () => {
    const largeNumberState = {
      products: {
        kpis: {
          totalStock: 1234567,
          totalDemand: 987654,
          fillRate: 75.0
        }
      }
    };
    
    render(<KPICards />, { preloadedState: largeNumberState });
    
    expect(screen.getByText('1,234,567')).toBeInTheDocument();
    expect(screen.getByText('987,654')).toBeInTheDocument();
  });

  it('applies correct styling to cards', () => {
    render(<KPICards />, { preloadedState: mockState });
    
    const cards = screen.getAllByRole('generic').filter(el => 
      el.className.includes('bg-white') && el.className.includes('rounded-lg')
    );
    
    expect(cards).toHaveLength(3);
  });
});