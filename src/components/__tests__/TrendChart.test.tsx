import { describe, it, expect, vi } from 'vitest';
import { screen } from '@testing-library/react';
import { render } from '../../test/test-utils';
import TrendChart from '../TrendChart';

// Mock Recharts components
vi.mock('recharts', () => ({
  LineChart: ({ children }: { children: React.ReactNode }) => <div data-testid="line-chart">{children}</div>,
  Line: ({ name }: { name: string }) => <div data-testid={`line-${name.toLowerCase()}`}>{name}</div>,
  XAxis: () => <div data-testid="x-axis" />,
  YAxis: () => <div data-testid="y-axis" />,
  CartesianGrid: () => <div data-testid="grid" />,
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div data-testid="responsive-container">{children}</div>,
  Legend: () => <div data-testid="legend" />,
  Tooltip: () => <div data-testid="tooltip" />
}));

describe('TrendChart', () => {
  const mockState = {
    ui: {
      dateRange: '7d'
    }
  };

  it('renders chart title', () => {
    render(<TrendChart />, { preloadedState: mockState });
    expect(screen.getByText('Stock vs Demand Trend')).toBeInTheDocument();
  });

  it('renders chart components', () => {
    render(<TrendChart />, { preloadedState: mockState });
    
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
    expect(screen.getByTestId('responsive-container')).toBeInTheDocument();
    expect(screen.getByTestId('x-axis')).toBeInTheDocument();
    expect(screen.getByTestId('y-axis')).toBeInTheDocument();
    expect(screen.getByTestId('grid')).toBeInTheDocument();
    expect(screen.getByTestId('legend')).toBeInTheDocument();
    expect(screen.getByTestId('tooltip')).toBeInTheDocument();
  });

  it('renders both stock and demand lines', () => {
    render(<TrendChart />, { preloadedState: mockState });
    
    expect(screen.getByTestId('line-stock')).toBeInTheDocument();
    expect(screen.getByTestId('line-demand')).toBeInTheDocument();
  });

  it('applies correct styling to container', () => {
    render(<TrendChart />, { preloadedState: mockState });
    
    const container = screen.getByText('Stock vs Demand Trend').closest('div');
    expect(container).toHaveClass('bg-white', 'rounded-lg', 'border', 'border-gray-200');
  });

  it('responds to different date ranges', () => {
    const fourteenDayState = {
      ui: {
        dateRange: '14d'
      }
    };
    
    render(<TrendChart />, { preloadedState: fourteenDayState });
    expect(screen.getByTestId('line-chart')).toBeInTheDocument();
  });
});