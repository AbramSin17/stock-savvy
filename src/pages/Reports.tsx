import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { formatRupiah } from "@/lib/format";
import { transactions } from "@/data/mockData";
import { useMemo } from "react";

export default function Reports() {
  const summary = useMemo(() => {
    const sales = transactions.filter((t) => t.type === "sale");
    const incoming = transactions.filter((t) => t.type === "in");
    const totalSales = sales.reduce((a, t) => a + (t.totalAmount || 0), 0);
    const totalCost = incoming.reduce((a, t) => a + (t.totalCost || 0), 0);
    return { totalSales, totalCost, profit: totalSales - totalCost };
  }, []);

  const comparisonData = [
    { name: "Pemasukan", value: summary.totalCost },
    { name: "Penjualan", value: summary.totalSales },
    { name: "Keuntungan", value: Math.max(0, summary.profit) },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Laporan</h1>
        <p className="text-sm text-muted-foreground">Ringkasan keuangan dan transaksi</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="glass-card p-5">
          <p className="text-sm text-muted-foreground">Total Pemasukan Stok</p>
          <p className="mt-1 text-xl font-bold">{formatRupiah(summary.totalCost)}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-muted-foreground">Total Penjualan</p>
          <p className="mt-1 text-xl font-bold text-primary">{formatRupiah(summary.totalSales)}</p>
        </div>
        <div className="glass-card p-5">
          <p className="text-sm text-muted-foreground">Keuntungan</p>
          <p className="mt-1 text-xl font-bold text-success">{formatRupiah(summary.profit)}</p>
        </div>
      </div>

      <div className="glass-card p-5">
        <h3 className="mb-4 text-sm font-semibold">Perbandingan Keuangan</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={comparisonData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(222, 30%, 16%)" />
            <XAxis dataKey="name" tick={{ fontSize: 12, fill: "hsl(215, 20%, 55%)" }} />
            <YAxis tick={{ fontSize: 11, fill: "hsl(215, 20%, 55%)" }} tickFormatter={(v) => `${(v / 1000000).toFixed(0)}jt`} />
            <Tooltip formatter={(v: number) => formatRupiah(v)} contentStyle={{ background: "hsl(222, 44%, 8%)", border: "1px solid hsl(222, 30%, 16%)", borderRadius: 8 }} />
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {comparisonData.map((_, i) => {
                const colors = ["hsl(199, 89%, 48%)", "hsl(160, 84%, 39%)", "hsl(38, 92%, 50%)"];
                return <Cell key={i} fill={colors[i]} />;
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="border-b border-border px-5 py-3">
          <h3 className="text-sm font-semibold">Detail Semua Transaksi</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Tipe</th>
                <th className="px-5 py-3">Barang</th>
                <th className="px-5 py-3 text-right">Jumlah</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {transactions.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-medium ${t.type === "in" ? "text-chart-2" : t.type === "sale" ? "text-primary" : "text-destructive"}`}>
                      {t.type === "in" ? "Masuk" : t.type === "out" ? "Keluar" : "Penjualan"}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 font-medium">{t.itemName}</td>
                  <td className="px-5 py-3.5 text-right">{t.quantity}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3.5 text-right text-sm">{t.totalAmount ? formatRupiah(t.totalAmount) : t.totalCost ? formatRupiah(t.totalCost) : "-"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
