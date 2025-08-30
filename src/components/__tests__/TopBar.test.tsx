import { describe, it, expect } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../../test/test-utils';
import TopBar from '../TopBar';

describe('TopBar', () => {
  it('renders SupplySight logo', () => {
    render(<TopBar />);
    expect(screen.getByText('SupplySight')).toBeInTheDocument();
  });

  it('renders date range options', () => {
    render(<TopBar />);
    expect(screen.getByText('7 DAYS')).toBeInTheDocument();
    expect(screen.getByText('14 DAYS')).toBeInTheDocument();
    expect(screen.getByText('30 DAYS')).toBeInTheDocument();
  });

  it('shows 7 DAYS as active by default', () => {
    render(<TopBar />);
    const sevenDaysButton = screen.getByText('7 DAYS');
    expect(sevenDaysButton).toHaveClass('bg-blue-600', 'text-white');
  });

  it('changes active date range when clicked', () => {
    render(<TopBar />);
    const fourteenDaysButton = screen.getByText('14 DAYS');
    
    fireEvent.click(fourteenDaysButton);
    
    expect(fourteenDaysButton).toHaveClass('bg-blue-600', 'text-white');
    expect(screen.getByText('7 DAYS')).toHaveClass('bg-gray-100', 'text-gray-600');
  });

  it('displays Date Range label', () => {
    render(<TopBar />);
    expect(screen.getByText('Date Range:')).toBeInTheDocument();
  });
});