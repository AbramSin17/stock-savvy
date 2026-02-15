import { useMemo } from "react";
import { Package, Boxes, AlertTriangle, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import { useInventory } from "@/store/inventoryStore";
import { formatRupiah, formatNumber } from "@/lib/format";

const CHART_COLORS = [
  "hsl(160, 84%, 39%)",
  "hsl(199, 89%, 48%)",
  "hsl(280, 65%, 60%)",
  "hsl(38, 92%, 50%)",
  "hsl(0, 72%, 51%)",
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="glass-card px-3 py-2 text-xs">
      <p className="text-muted-foreground">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-medium">
          {typeof p.value === "number" && p.value > 10000 ? formatRupiah(p.value) : formatNumber(p.value)}
        </p>
      ))}
    </div>
  );
};

export default function Dashboard() {
  const { items, transactions } = useInventory();

  const stats = useMemo(() => {
    const sales = transactions.filter((t) => t.type === "sale");
    const incoming = transactions.filter((t) => t.type === "in");
    const outgoing = transactions.filter((t) => t.type === "out");
    return {
      totalItems: items.length,
      totalStock: items.reduce((a, i) => a + i.stock, 0),
      lowStockItems: items.filter((i) => i.status === "low" || i.status === "out").length,
      monthlySales: sales.reduce((a, t) => a + (t.totalAmount || 0), 0),
      monthlyIncoming: incoming.reduce((a, t) => a + (t.totalCost || 0), 0),
      monthlyOutgoing: outgoing.reduce((a, t) => a + t.quantity, 0),
    };
  }, [items, transactions]);

  const salesByDate = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter((t) => t.type === "sale").forEach((t) => { map[t.date] = (map[t.date] || 0) + (t.totalAmount || 0); });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([date, amount]) => ({ date: date.slice(5), amount }));
  }, [transactions]);

  const topSelling = useMemo(() => {
    const map: Record<string, number> = {};
    transactions.filter((t) => t.type === "sale").forEach((t) => { map[t.itemName] = (map[t.itemName] || 0) + t.quantity; });
    return Object.entries(map).sort(([, a], [, b]) => b - a).slice(0, 5).map(([name, quantity]) => ({ name, quantity }));
  }, [transactions]);

  const categoryDist = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((i) => { map[i.category] = (map[i.category] || 0) + 1; });
    return Object.entries(map).map(([name, value], i) => ({ name, value, fill: CHART_COLORS[i % CHART_COLORS.length] }));
  }, [items]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan inventaris dan penjualan</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Barang" value={formatNumber(stats.totalItems)} icon={Package} variant="primary" />
        <StatCard title="Total Stok" value={formatNumber(stats.totalStock)} icon={Boxes} />
        <StatCard title="Hampir Habis" value={formatNumber(stats.lowStockItems)} icon={AlertTriangle} variant="warning" />
        <StatCard title="Penjualan" value={formatRupiah(stats.monthlySales)} icon={TrendingUp} />
        <StatCard title="Barang Masuk" value={formatRupiah(stats.monthlyIncoming)} icon={ArrowDownToLine} />
        <StatCard title="Barang Keluar" value={formatNumber(stats.monthlyOutgoing) + " unit"} icon={ArrowUpFromLine} variant="destructive" />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="glass-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Grafik Penjualan</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={salesByDate}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="amount" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(160, 84%, 39%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="glass-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Barang Paling Laris</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topSelling} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantity" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Distribusi Kategori</h3>
        <ResponsiveContainer width="100%" height={260}>
          <PieChart>
            <Pie data={categoryDist} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {categoryDist.map((entry, i) => <Cell key={i} fill={entry.fill} />)}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
