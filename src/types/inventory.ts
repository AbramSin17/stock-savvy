export interface InventoryItem {
  id: string;
  name: string;
  category: string;
  buyPrice: number;
  sellPrice: number;
  stock: number;
  minStock: number;
  supplier: string;
  description: string;
  status: "safe" | "low" | "out";
}

export interface Transaction {
  id: string;
  type: "in" | "out" | "sale";
  itemName: string;
  quantity: number;
  date: string;
  supplier?: string;
  destination?: string;
  totalCost?: number;
  sellPrice?: number;
  totalAmount?: number;
  notes?: string;
}

export interface Category {
  id: string;
  name: string;
  itemCount: number;
}

export interface DashboardStats {
  totalItems: number;
  totalStock: number;
  lowStockItems: number;
  monthlySales: number;
  monthlyIncoming: number;
  monthlyOutgoing: number;
}

export interface SalesData {
  date: string;
  amount: number;
}

export interface StockData {
  month: string;
  quantity: number;
}
