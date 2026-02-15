import { InventoryItem, Transaction, Category, DashboardStats, SalesData, StockData } from "@/types/inventory";

export const categories: Category[] = [
  { id: "1", name: "Elektronik", itemCount: 12 },
  { id: "2", name: "Makanan & Minuman", itemCount: 8 },
  { id: "3", name: "Pakaian", itemCount: 15 },
  { id: "4", name: "Alat Tulis", itemCount: 6 },
  { id: "5", name: "Peralatan Rumah", itemCount: 10 },
];

export const inventoryItems: InventoryItem[] = [
  { id: "1", name: "Laptop ASUS VivoBook", category: "Elektronik", buyPrice: 7500000, sellPrice: 8500000, stock: 15, minStock: 5, supplier: "PT Asus Indonesia", description: "Laptop 14 inch, RAM 8GB", status: "safe" },
  { id: "2", name: "Mouse Wireless Logitech", category: "Elektronik", buyPrice: 150000, sellPrice: 250000, stock: 45, minStock: 10, supplier: "PT Logitech", description: "Mouse wireless 2.4GHz", status: "safe" },
  { id: "3", name: "Kopi Arabica 250gr", category: "Makanan & Minuman", buyPrice: 45000, sellPrice: 75000, stock: 3, minStock: 10, supplier: "CV Kopi Nusantara", description: "Kopi arabica premium", status: "low" },
  { id: "4", name: "Kaos Polos Cotton", category: "Pakaian", buyPrice: 35000, sellPrice: 65000, stock: 0, minStock: 20, supplier: "PT Textile Indo", description: "Kaos cotton combed 30s", status: "out" },
  { id: "5", name: "Pulpen Pilot G2", category: "Alat Tulis", buyPrice: 12000, sellPrice: 18000, stock: 120, minStock: 30, supplier: "PT Pilot Pen", description: "Pulpen gel 0.5mm", status: "safe" },
  { id: "6", name: "Keyboard Mechanical", category: "Elektronik", buyPrice: 450000, sellPrice: 650000, stock: 8, minStock: 5, supplier: "PT Keyboard Indo", description: "Keyboard TKL blue switch", status: "safe" },
  { id: "7", name: "Teh Celup 25pcs", category: "Makanan & Minuman", buyPrice: 8000, sellPrice: 15000, stock: 5, minStock: 15, supplier: "PT Teh Nusantara", description: "Teh hitam celup", status: "low" },
  { id: "8", name: "Sapu Ijuk Premium", category: "Peralatan Rumah", buyPrice: 25000, sellPrice: 45000, stock: 22, minStock: 10, supplier: "CV Bersih Jaya", description: "Sapu ijuk kualitas A", status: "safe" },
  { id: "9", name: "Headset Gaming", category: "Elektronik", buyPrice: 200000, sellPrice: 350000, stock: 2, minStock: 5, supplier: "PT Audio Tech", description: "Headset 7.1 surround", status: "low" },
  { id: "10", name: "Buku Tulis A5", category: "Alat Tulis", buyPrice: 5000, sellPrice: 8000, stock: 200, minStock: 50, supplier: "PT Sinar Dunia", description: "Buku tulis 80 halaman", status: "safe" },
];

export const transactions: Transaction[] = [
  { id: "1", type: "in", itemName: "Laptop ASUS VivoBook", quantity: 10, date: "2026-02-14", supplier: "PT Asus Indonesia", totalCost: 75000000, notes: "Restock bulanan" },
  { id: "2", type: "out", itemName: "Mouse Wireless Logitech", quantity: 5, date: "2026-02-13", destination: "Toko Cabang A", notes: "Transfer stok" },
  { id: "3", type: "sale", itemName: "Pulpen Pilot G2", quantity: 20, date: "2026-02-13", sellPrice: 18000, totalAmount: 360000 },
  { id: "4", type: "in", itemName: "Kopi Arabica 250gr", quantity: 50, date: "2026-02-12", supplier: "CV Kopi Nusantara", totalCost: 2250000, notes: "Order besar" },
  { id: "5", type: "sale", itemName: "Keyboard Mechanical", quantity: 3, date: "2026-02-12", sellPrice: 650000, totalAmount: 1950000 },
  { id: "6", type: "out", itemName: "Kaos Polos Cotton", quantity: 10, date: "2026-02-11", destination: "Event Promo", notes: "Giveaway" },
  { id: "7", type: "sale", itemName: "Laptop ASUS VivoBook", quantity: 2, date: "2026-02-10", sellPrice: 8500000, totalAmount: 17000000 },
  { id: "8", type: "in", itemName: "Buku Tulis A5", quantity: 100, date: "2026-02-10", supplier: "PT Sinar Dunia", totalCost: 500000, notes: "Restock" },
];

export const dashboardStats: DashboardStats = {
  totalItems: 10,
  totalStock: 420,
  lowStockItems: 3,
  monthlySales: 19310000,
  monthlyIncoming: 77750000,
  monthlyOutgoing: 15,
};

export const monthlySalesData: SalesData[] = [
  { date: "01 Feb", amount: 2500000 },
  { date: "03 Feb", amount: 1800000 },
  { date: "05 Feb", amount: 4200000 },
  { date: "07 Feb", amount: 3100000 },
  { date: "09 Feb", amount: 5600000 },
  { date: "10 Feb", amount: 17000000 },
  { date: "12 Feb", amount: 1950000 },
  { date: "13 Feb", amount: 360000 },
  { date: "15 Feb", amount: 890000 },
];

export const stockInData: StockData[] = [
  { month: "Sep", quantity: 120 },
  { month: "Okt", quantity: 180 },
  { month: "Nov", quantity: 95 },
  { month: "Des", quantity: 210 },
  { month: "Jan", quantity: 160 },
  { month: "Feb", quantity: 160 },
];

export const topSellingItems = [
  { name: "Laptop ASUS", quantity: 25 },
  { name: "Pulpen Pilot", quantity: 80 },
  { name: "Mouse Logitech", quantity: 45 },
  { name: "Keyboard Mech", quantity: 18 },
  { name: "Buku Tulis A5", quantity: 120 },
];

export const categoryDistribution = [
  { name: "Elektronik", value: 35, fill: "hsl(var(--chart-1))" },
  { name: "Makanan", value: 20, fill: "hsl(var(--chart-2))" },
  { name: "Pakaian", value: 25, fill: "hsl(var(--chart-3))" },
  { name: "Alat Tulis", value: 10, fill: "hsl(var(--chart-4))" },
  { name: "Rumah Tangga", value: 10, fill: "hsl(var(--chart-5))" },
];
