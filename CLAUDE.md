# Claude Code Configuration

This file contains project-specific settings and commands for Claude Code.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: 
- **Styling**: Tailwind CSS
- **Charts**: 
- **Icons**: 
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **GraphQL**: Mock server with executable schema

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build project
npm run build

# Run tests
npm test

# Lint code
npm run lint

# Type check
npm run typecheck
```

## Project Structure

- `src/` - Source code
- `public/` - Static assets
- `index.html` - Entry point
- `package.json` - Dependencies and scripts
- `vite.config.ts` - Vite configuration
- `tsconfig.json` - TypeScript configuration

## Project Structure

```
src/
├── components/          # React components
│   ├── __tests__/      # Component tests
│   ├── Filters.tsx     # Search and filter controls
│   ├── KPICards.tsx    # Key performance indicators
│   ├── ProductDrawer.tsx # Product detail drawer
│   ├── ProductsTable.tsx # Main products table
│   ├── TopBar.tsx      # Navigation header
│   └── TrendChart.tsx  # Stock vs demand chart
├── data/               # Mock data and generators
├── hooks/              # Custom React hooks
├── services/           # API service layer
├── store/              # Redux store and slices
├── test/               # Test utilities and setup
├── types/              # TypeScript definitions
├── App.tsx             # Root component
└── main.tsx           # Application entry point
```

## Architecture Notes

- **State Management**: Uses Redux Toolkit for global state management
- **Mock Data**: GraphQL service with in-memory mock data for development
- **Real-time Updates**: KPICards and TrendChart components subscribe to Redux store and auto-update when product data changes
- **Testing**: Tests updated to work with Redux state instead of mocking GraphQL hooks

## Key Features

- **Editable Mock Data**: GraphQL mutations properly update the in-memory product data
- **Reactive UI**: KPI cards and trend charts automatically recalculate when data changes
- **Data Synchronization**: Product updates trigger re-fetch to keep GraphQL service and Redux store in sync

## Recent Updates

- Fixed mock data mutability issues by creating proper mutable copies
- Updated KPICards and TrendChart to use Redux state for real-time updates
- Modified ProductDrawer to refetch data after mutations for consistency
- Updated test utilities to support preloaded Redux state
- Fixed TypeScript compilation issues with test setup