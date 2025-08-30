# Claude Code Configuration

This file contains project-specific settings and commands for Claude Code.

## Tech Stack

- **Frontend**: React 19, TypeScript
- **State Management**: Redux Toolkit
- **UI Components**: Headless UI, React Hook Form
- **Styling**: Tailwind CSS
- **Charts**: Recharts
- **Icons**: Heroicons
- **Build Tool**: Vite
- **Testing**: Vitest + Testing Library
- **GraphQL**: Mock server with executable schema

## Prerequisites

- Node.js 20.19.4
- npm or yarn

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
│   ├── common/         # Shared utilities
│   │   └── util.ts     # Common functions (status badges, etc.)
│   ├── Filters.tsx     # Search and filter controls
│   ├── KPICards.tsx    # Key performance indicators
│   ├── ProductDrawer.tsx # Product detail drawer with forms
│   ├── ProductsTable.tsx # Main products table with pagination
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

- **State Management**: Uses Redux Toolkit for global state management with separate slices for products and UI state
- **Mock Data**: 14 diverse product entries with realistic hardware items and varied statuses
- **Real-time Updates**: All components subscribe to Redux store and auto-update when data changes
- **Testing**: Comprehensive test coverage with proper Redux state mocking
- **Form Management**: React Hook Form with validation and type safety
- **Shared Components**: Common utilities in `components/common/` for reusability

## Key Features

### Product Management
- **Interactive Product Table**: Sortable, filterable table with pagination (10/25/50 rows per page)
- **Product Detail Drawer**: Modal drawer with product information and edit forms
- **Status Management**: Dynamic status calculation (Healthy/Low/Critical) based on stock vs demand
- **Real-time KPIs**: Auto-updating total stock, demand, and fill rate calculations

### User Interface
- **Advanced Filtering**: Search by name/SKU/ID, filter by warehouse and status
- **Pagination Controls**: Customizable rows per page with navigation
- **Status Pills**: Color-coded status badges throughout the interface
- **Responsive Design**: Mobile-friendly layout with Tailwind CSS

### Data Operations
- **Update Demand**: Form to modify product demand with validation
- **Transfer Stock**: Add/remove stock with positive/negative values and warehouse selection
- **Form Validation**: Required fields, number validation, and disabled states
- **Auto-clearing Forms**: Forms reset after successful updates while keeping drawer open

### Charts & Visualization  
- **Trend Chart**: Interactive line chart showing stock vs demand over time
- **Real-time Data**: Chart updates automatically with current totals as today's data point
- **Dynamic Scaling**: Auto-adjusting Y-axis based on data range

## Recent Updates

- **Enhanced Product Drawer**: Added status pills, placeholders, disabled button states, and form clearing
- **Pagination System**: Added customizable rows per page (10/25/50 options)
- **Stock Transfer**: Implemented relative stock changes (positive to add, negative to remove)
- **Shared Utilities**: Created `components/common/util.ts` for reusable functions
- **Expanded Mock Data**: Added 10 additional diverse product entries (14 total)
- **Type Safety**: Fixed TypeScript issues and improved type definitions
- **Test Coverage**: Updated all test suites to work with new features and Redux state
- **Chart Integration**: Connected TrendChart to Redux store with real-time updates