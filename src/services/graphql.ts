import { ApolloClient, InMemoryCache, gql } from '@apollo/client';
import { SchemaLink } from '@apollo/client/link/schema';
import { makeExecutableSchema } from '@graphql-tools/schema';
import { mockProducts, generateTrendData } from '../data/mockData';
import { Product, ProductUpdateData } from '../types';

// Create a fully mutable copy of mockProducts for mutations
// eslint-disable-next-line prefer-const
let products: Product[] = structuredClone(mockProducts);

// GraphQL schema
const typeDefs = gql`
  type Product {
    id: ID!
    name: String!
    sku: String!
    warehouse: String!
    stock: Int!
    demand: Int!
  }

  type TrendPoint {
    date: String!
    stock: Float!
    demand: Float!
  }

  type Query {
    products: [Product!]!
    product(id: ID!): Product
    warehouses: [String!]!
    kpis(range: String!): KPIs!
    trendData(range: String!): [TrendPoint!]!
  }

  type KPIs {
    totalStock: Int!
    totalDemand: Int!
    fillRate: Float!
  }

  type Mutation {
    updateProduct(id: ID!, input: ProductUpdateInput!): Product!
  }

  input ProductUpdateInput {
    demand: Int
    stock: Int
    warehouse: String
  }
`;

// Resolvers
const resolvers = {
  Query: {
    products: () => products,
    product: (_: unknown, { id }: { id: string }) => products.find(p => p.id === id),
    warehouses: () => [...new Set(products.map(p => p.warehouse))],
    kpis: (_: unknown, { range: _range }: { range: string }) => {
      const totalStock = products.reduce((sum, p) => sum + p.stock, 0);
      const totalDemand = products.reduce((sum, p) => sum + p.demand, 0);
      const fillRate = totalDemand > 0 ? 
        (products.reduce((sum, p) => sum + Math.min(p.stock, p.demand), 0) / totalDemand) * 100 
        : 0;
      
      return {
        totalStock,
        totalDemand,
        fillRate: Number(fillRate.toFixed(1))
      };
    },
    trendData: (_: unknown, { range }: { range: string }) => {
      const days = range === '7d' ? 7 : range === '14d' ? 14 : 30;
      return generateTrendData(days);
    },
  },
  Mutation: {
    updateProduct: (_: unknown, { id, input }: { id: string; input: ProductUpdateData }) => {
      const index = products.findIndex(p => p.id === id);
      if (index === -1) {
        throw new Error(`Product with id ${id} not found`);
      }
      
      products[index] = { ...products[index], ...input };
      return products[index];
    },
  },
};

// Create executable schema
const schema = makeExecutableSchema({ typeDefs, resolvers });

// Create Apollo Client with SchemaLink for mock server
export const apolloClient = new ApolloClient({
  link: new SchemaLink({ schema }),
  cache: new InMemoryCache(),
  defaultOptions: {
    query: {
      fetchPolicy: 'cache-first',
    },
    watchQuery: {
      fetchPolicy: 'cache-first',
    },
  },
});

// GraphQL queries and mutations
export const GET_PRODUCTS = gql`
  query GetProducts {
    products {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export const GET_PRODUCT = gql`
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;

export const GET_KPIS = gql`
  query GetKPIs($range: String!) {
    kpis(range: $range) {
      totalStock
      totalDemand
      fillRate
    }
  }
`;

export const GET_TREND_DATA = gql`
  query GetTrendData($range: String!) {
    trendData(range: $range) {
      date
      stock
      demand
    }
  }
`;

export const UPDATE_PRODUCT = gql`
  mutation UpdateProduct($id: ID!, $input: ProductUpdateInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      sku
      warehouse
      stock
      demand
    }
  }
`;