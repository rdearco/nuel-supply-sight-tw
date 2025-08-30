import React from 'react';
import { Provider } from 'react-redux';
import { ApolloProvider } from '@apollo/client';
import { store } from './store';
import { apolloClient } from './services/graphql';
import TopBar from './components/TopBar';
import KPICards from './components/KPICards';
import TrendChart from './components/TrendChart';
import Filters from './components/Filters';
import ProductsTable from './components/ProductsTable';
import ProductDrawer from './components/ProductDrawer';

const App: React.FC = () => {
  return (
    <Provider store={store}>
      <ApolloProvider client={apolloClient}>
        <div className="min-h-screen bg-gray-50">
          <TopBar />
          
          <main className="max-w-7xl mx-auto px-6 py-8">
            <KPICards />
            <TrendChart />
            <Filters />
            <ProductsTable />
            <ProductDrawer />
          </main>
        </div>
      </ApolloProvider>
    </Provider>
  );
};

export default App;