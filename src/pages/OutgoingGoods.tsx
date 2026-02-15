import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { transactions } from "@/data/mockData";
import { formatNumber } from "@/lib/format";
import { Input } from "@/components/ui/input";

export default function OutgoingGoods() {
  const [search, setSearch] = useState("");
  const outgoing = useMemo(
    () => transactions.filter((t) => t.type === "out" && t.itemName.toLowerCase().includes(search.toLowerCase())),
    [search]
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Barang Keluar</h1>
        <p className="text-sm text-muted-foreground">Riwayat pengeluaran stok</p>
      </div>
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input placeholder="Cari..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
      </div>
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Barang</th>
                <th className="px-5 py-3 text-right">Jumlah</th>
                <th className="px-5 py-3">Tujuan</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {outgoing.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-medium">{t.itemName}</td>
                  <td className="px-5 py-3.5 text-right">{formatNumber(t.quantity)}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.destination || "-"}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.notes || "-"}</td>
                </tr>
              ))}
              {outgoing.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
