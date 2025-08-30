import { Product, TrendData } from '../types';

export const mockProducts: Product[] = [
  {
    id: "P-1001",
    name: "12mm Hex Bolt",
    sku: "HEX-12-100",
    warehouse: "BLR-A",
    stock: 180,
    demand: 120
  },
  {
    id: "P-1002",
    name: "Steel Washer",
    sku: "WSR-08-500",
    warehouse: "BLR-A",
    stock: 50,
    demand: 80
  },
  {
    id: "P-1003",
    name: "M8 Nut",
    sku: "NUT-08-200",
    warehouse: "PNQ-C",
    stock: 80,
    demand: 80
  },
  {
    id: "P-1004",
    name: "Bearing 608ZZ",
    sku: "BRG-608-50",
    warehouse: "DEL-B",
    stock: 24,
    demand: 120
  }
];

export const generateTrendData = (days: number): TrendData[] => {
  const data: TrendData[] = [];
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    
    data.push({
      date: `Aug ${date.getDate()}`,
      stock: 400 + Math.random() * 20 - 10,
      demand: 340 + Math.random() * 40 - 20
    });
  }

  return data;
};

export const warehouses = ['All Warehouses', 'BLR-A', 'PNQ-C', 'DEL-B'];
export const statusOptions = ['All Status', 'Healthy', 'Low', 'Critical'];