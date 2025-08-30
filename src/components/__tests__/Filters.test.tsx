import { describe, it, expect } from 'vitest';
import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import Filters from '../Filters';

describe('Filters', () => {
  const mockState = {
    ui: {
      filters: {
        search: '',
        warehouse: 'All Warehouses',
        status: 'All Status'
      }
    }
  };

  it('renders search input', () => {
    render(<Filters />, { preloadedState: mockState });
    
    const searchInput = screen.getByPlaceholderText('Search by name, SKU, or ID');
    expect(searchInput).toBeInTheDocument();
  });

  it('renders warehouse dropdown with default value', () => {
    render(<Filters />, { preloadedState: mockState });
    
    expect(screen.getByText('All Warehouses')).toBeInTheDocument();
  });

  it('renders status dropdown with default value', () => {
    render(<Filters />, { preloadedState: mockState });
    
    expect(screen.getByText('All Status')).toBeInTheDocument();
  });

  it('allows typing in search input', async () => {
    const user = userEvent.setup();
    render(<Filters />, { preloadedState: mockState });
    
    const searchInput = screen.getByPlaceholderText('Search by name, SKU, or ID');
    await user.type(searchInput, 'test search');
    
    expect(searchInput).toHaveValue('test search');
  });

  it('opens warehouse dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<Filters />, { preloadedState: mockState });
    
    const warehouseButton = screen.getByRole('button', { name: /all warehouses/i });
    await user.click(warehouseButton);
    
    await waitFor(() => {
      expect(screen.getByText('BLR-A')).toBeInTheDocument();
      expect(screen.getByText('PNQ-C')).toBeInTheDocument();
      expect(screen.getByText('DEL-B')).toBeInTheDocument();
    });
  });

  it('opens status dropdown when clicked', async () => {
    const user = userEvent.setup();
    render(<Filters />, { preloadedState: mockState });
    
    const statusButton = screen.getByRole('button', { name: /all status/i });
    await user.click(statusButton);
    
    await waitFor(() => {
      expect(screen.getByText('Healthy')).toBeInTheDocument();
      expect(screen.getByText('Low')).toBeInTheDocument();
      expect(screen.getByText('Critical')).toBeInTheDocument();
    });
  });

  it('displays search icon', () => {
    render(<Filters />, { preloadedState: mockState });
    
    const searchIcon = screen.getByRole('textbox').parentElement?.querySelector('svg');
    expect(searchIcon).toBeInTheDocument();
  });

  it('shows dropdown chevron icons', () => {
    render(<Filters />, { preloadedState: mockState });
    
    const dropdownButtons = screen.getAllByRole('button');
    dropdownButtons.forEach(button => {
      const chevronIcon = button.querySelector('svg');
      expect(chevronIcon).toBeInTheDocument();
    });
  });
});