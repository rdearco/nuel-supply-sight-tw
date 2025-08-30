import React, { ReactElement } from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { configureStore } from '@reduxjs/toolkit';
import productsReducer from '../store/productsSlice';
import uiReducer from '../store/uiSlice';
import { ApolloClient, InMemoryCache } from '@apollo/client';

// Create a test store
const createTestStore = (preloadedState = {}) => {
  return configureStore({
    reducer: {
      products: productsReducer,
      ui: uiReducer,
    },
    preloadedState,
  });
};

// Create a custom render function that includes providers
interface CustomRenderOptions extends Omit<RenderOptions, 'wrapper'> {
  preloadedState?: any;
  store?: ReturnType<typeof createTestStore>;
}

// Create a test-only Apollo client
const createTestApolloClient = () => {
  return new ApolloClient({
    cache: new InMemoryCache(),
    defaultOptions: {
      query: {
        fetchPolicy: 'no-cache',
      },
      watchQuery: {
        fetchPolicy: 'no-cache',
      },
    },
  });
};

const customRender = (
  ui: ReactElement,
  {
    preloadedState = {},
    store = createTestStore(preloadedState),
    ...renderOptions
  }: CustomRenderOptions = {}
) => {
  const testClient = createTestApolloClient();
  
  const Wrapper = ({ children }: { children: React.ReactNode }) => {
    return (
      <Provider store={store}>
        <ApolloProvider client={testClient}>
          {children}
        </ApolloProvider>
      </Provider>
    );
  };

  return render(ui, { wrapper: Wrapper, ...renderOptions });
};

// Re-export everything
export * from '@testing-library/react';
export { customRender as render };
export { createTestStore };