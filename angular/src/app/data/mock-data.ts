import { Product, TrendData } from '../models/product.model';

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
  },
  {
    id: "P-1005",
    name: "10mm Socket Screw",
    sku: "SCK-10-250",
    warehouse: "BLR-A",
    stock: 95,
    demand: 75
  },
  {
    id: "P-1006",
    name: "Flat Washer 6mm",
    sku: "FWS-06-300",
    warehouse: "PNQ-C",
    stock: 200,
    demand: 150
  },
  {
    id: "P-1007",
    name: "Spring Lock Washer",
    sku: "SLW-08-400",
    warehouse: "DEL-B",
    stock: 45,
    demand: 90
  },
  {
    id: "P-1008",
    name: "Torx Bolt T20",
    sku: "TRX-T20-150",
    warehouse: "BLR-A",
    stock: 120,
    demand: 100
  },
  {
    id: "P-1009",
    name: "Rubber Gasket 25mm",
    sku: "GSK-25-100",
    warehouse: "PNQ-C",
    stock: 30,
    demand: 60
  },
  {
    id: "P-1010",
    name: "Allen Key 4mm",
    sku: "ALK-04-80",
    warehouse: "DEL-B",
    stock: 65,
    demand: 45
  },
  {
    id: "P-1011",
    name: "Wing Nut M10",
    sku: "WNG-10-120",
    warehouse: "BLR-A",
    stock: 85,
    demand: 85
  },
  {
    id: "P-1012",
    name: "Machine Screw 8mm",
    sku: "MSC-08-300",
    warehouse: "PNQ-C",
    stock: 140,
    demand: 110
  },
  {
    id: "P-1013",
    name: "Thumb Screw M6",
    sku: "THM-06-90",
    warehouse: "DEL-B",
    stock: 20,
    demand: 70
  },
  {
    id: "P-1014",
    name: "Carriage Bolt 12mm",
    sku: "CAR-12-200",
    warehouse: "BLR-A",
    stock: 160,
    demand: 130
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