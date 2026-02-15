import { Package, Boxes, AlertTriangle, TrendingUp, ArrowDownToLine, ArrowUpFromLine } from "lucide-react";
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import StatCard from "@/components/dashboard/StatCard";
import { dashboardStats, monthlySalesData, stockInData, topSellingItems, categoryDistribution } from "@/data/mockData";
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
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-sm text-muted-foreground">Ringkasan inventaris dan penjualan</p>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        <StatCard title="Total Barang" value={formatNumber(dashboardStats.totalItems)} icon={Package} variant="primary" />
        <StatCard title="Total Stok" value={formatNumber(dashboardStats.totalStock)} icon={Boxes} />
        <StatCard title="Hampir Habis" value={formatNumber(dashboardStats.lowStockItems)} icon={AlertTriangle} variant="warning" />
        <StatCard title="Penjualan Bulan Ini" value={formatRupiah(dashboardStats.monthlySales)} icon={TrendingUp} trend="+12% dari bulan lalu" trendUp />
        <StatCard title="Barang Masuk" value={formatRupiah(dashboardStats.monthlyIncoming)} icon={ArrowDownToLine} />
        <StatCard title="Barang Keluar" value={formatNumber(dashboardStats.monthlyOutgoing) + " unit"} icon={ArrowUpFromLine} variant="destructive" />
      </div>

      {/* Charts Row 1 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Sales Line Chart */}
        <div className="glass-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Grafik Penjualan Februari</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={monthlySalesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="date" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="amount" stroke="hsl(160, 84%, 39%)" strokeWidth={2} dot={{ r: 3, fill: "hsl(160, 84%, 39%)" }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Stock In Bar Chart */}
        <div className="glass-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Pemasukan Stok Bulanan</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={stockInData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis dataKey="month" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} />
              <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantity" fill="hsl(199, 89%, 48%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Charts Row 2 */}
      <div className="grid gap-4 lg:grid-cols-2">
        {/* Top Selling */}
        <div className="glass-card p-5">
          <h3 className="mb-4 text-sm font-semibold">5 Barang Paling Laris</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={topSellingItems} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
              <XAxis type="number" tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} />
              <YAxis dataKey="name" type="category" width={100} tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="quantity" fill="hsl(160, 84%, 39%)" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Category Pie */}
        <div className="glass-card p-5">
          <h3 className="mb-4 text-sm font-semibold">Distribusi Kategori</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie
                data={categoryDistribution}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
              >
                {categoryDistribution.map((_, i) => (
                  <Cell key={i} fill={CHART_COLORS[i]} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
