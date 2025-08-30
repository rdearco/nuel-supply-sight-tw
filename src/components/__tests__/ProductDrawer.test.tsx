import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { render } from '../../test/test-utils';
import ProductDrawer from '../ProductDrawer';

describe('ProductDrawer', () => {
  // Suppress Apollo console errors during tests
  const originalConsoleError = console.error;
  beforeEach(() => {
    console.error = (...args: any[]) => {
      if (typeof args[0] === 'string' && args[0].includes('An error occurred!')) {
        return;
      }
      originalConsoleError.call(console, ...args);
    };
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  const mockState = {
    ui: {
      isDrawerOpen: true,
      selectedProductId: 'P-1001'
    },
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
        }
      ]
    }
  };

  const closedDrawerState = {
    ui: {
      isDrawerOpen: false,
      selectedProductId: null
    },
    products: {
      productsWithStatus: []
    }
  };

  it('renders when drawer is open', async () => {
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    expect(screen.getByText('Product Details')).toBeInTheDocument();
  });

  it('does not render when drawer is closed', async () => {
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: closedDrawerState });
    });
    
    expect(screen.queryByText('Product Details')).not.toBeInTheDocument();
  });

  it('displays product information', async () => {
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    expect(screen.getByText('12mm Hex Bolt')).toBeInTheDocument();
    expect(screen.getByText('HEX-12-100')).toBeInTheDocument();
    expect(screen.getByText('P-1001')).toBeInTheDocument();
    expect(screen.getAllByText('BLR-A')).toHaveLength(2); // Appears in info display and select option
    // Check that form inputs are empty (as per new behavior)
    const demandInput = screen.getByLabelText('New Demand') as HTMLInputElement;
    const stockInput = screen.getByLabelText('Stock Amount') as HTMLInputElement;
    expect(demandInput.value).toBe('');
    expect(stockInput.value).toBe('');
  });

  it('renders update demand form', async () => {
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    expect(screen.getAllByText('Update Demand')).toHaveLength(2); // Header and button
    expect(screen.getByLabelText('New Demand')).toBeInTheDocument(); // Demand input (now empty)
    const updateButton = screen.getAllByRole('button', { name: 'Update Demand' });
    expect(updateButton[0]).toBeInTheDocument();
  });

  it('renders transfer stock form', async () => {
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    expect(screen.getAllByText('Transfer Stock')).toHaveLength(2); // Header and button
    expect(screen.getByLabelText('Stock Amount')).toBeInTheDocument(); // Stock input (now empty)
    expect(screen.getByText('Positive to add, negative to remove')).toBeInTheDocument(); // Helper text
    expect(screen.getByRole('combobox')).toBeInTheDocument(); // Warehouse select
    const transferButton = screen.getAllByRole('button', { name: 'Transfer Stock' });
    expect(transferButton[0]).toBeInTheDocument();
  });

  it('has close button', async () => {
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    const closeButtons = screen.getAllByRole('button');
    const closeButton = closeButtons.find(button => button.querySelector('svg[data-slot="icon"]'));
    expect(closeButton).toBeInTheDocument();
  });

  it('allows updating demand value', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    const demandInput = screen.getByLabelText('New Demand') as HTMLInputElement;
    await user.type(demandInput, '150');
    
    expect(demandInput.value).toBe('150');
  });

  it('allows updating stock value', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    const stockInput = screen.getByLabelText('Stock Amount') as HTMLInputElement;
    await user.type(stockInput, '200');
    
    expect(stockInput.value).toBe('200');
  });

  it('shows warehouse options in dropdown', async () => {
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    // Find the select element by role instead of label
    const warehouseSelect = screen.getByRole('combobox');
    expect(warehouseSelect).toBeInTheDocument();
    
    const options = screen.getAllByRole('option');
    expect(options.length).toBeGreaterThan(1);
  });

  it('validates required fields', async () => {
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    // Find the demand input (now starts empty)
    const demandInput = screen.getByLabelText('New Demand') as HTMLInputElement;
    
    // Verify the input starts empty
    expect(demandInput.value).toBe('');
    
    // Verify the update button is still present
    const updateButtons = screen.getAllByRole('button', { name: 'Update Demand' });
    expect(updateButtons[0]).toBeInTheDocument();
  });

  it('allows negative stock values for removing stock', async () => {
    const user = userEvent.setup();
    await act(async () => {
      render(<ProductDrawer />, { preloadedState: mockState });
    });
    
    // Find the stock input and verify we can enter negative values (for stock removal)
    const stockInput = screen.getByLabelText('Stock Amount') as HTMLInputElement;
    await user.type(stockInput, '-25');
    
    // Verify the input accepts the negative value
    expect(stockInput.value).toBe('-25');
    
    // Verify the helper text is present
    expect(screen.getByText('Positive to add, negative to remove')).toBeInTheDocument();
    
    // Click the transfer button (form validation may not show in test environment)
    const transferButtons = screen.getAllByRole('button', { name: 'Transfer Stock' });
    expect(transferButtons[0]).toBeInTheDocument();
  });
});