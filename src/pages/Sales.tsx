import { useMemo, useState } from "react";
import { Search, Plus } from "lucide-react";
import { useInventory } from "@/store/inventoryStore";
import { formatRupiah, formatNumber } from "@/lib/format";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";

export default function Sales() {
  const { items, transactions, addSale } = useInventory();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [qty, setQty] = useState("");

  const sales = useMemo(
    () => transactions.filter((t) => t.type === "sale" && t.itemName.toLowerCase().includes(search.toLowerCase())),
    [search, transactions]
  );

  const selectedProduct = items.find((i) => i.id === selectedItem);

  const handleSubmit = () => {
    if (!selectedItem || !qty || Number(qty) <= 0) {
      toast({ title: "Error", description: "Pilih barang dan masukkan jumlah.", variant: "destructive" });
      return;
    }
    const item = items.find((i) => i.id === selectedItem);
    if (item && item.stock < Number(qty)) {
      toast({ title: "Error", description: `Stok tidak cukup. Tersedia: ${item.stock}`, variant: "destructive" });
      return;
    }
    addSale(selectedItem, Number(qty));
    toast({ title: "Berhasil", description: "Penjualan telah dicatat." });
    setDialogOpen(false);
    setSelectedItem(""); setQty("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Penjualan</h1>
          <p className="text-sm text-muted-foreground">Riwayat transaksi penjualan</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Catat Penjualan</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Catat Penjualan</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Pilih Barang</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger><SelectValue placeholder="Pilih barang..." /></SelectTrigger>
                <SelectContent>{items.filter((i) => i.stock > 0).map((i) => <SelectItem key={i.id} value={i.id}>{i.name} (stok: {i.stock})</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid gap-2"><Label>Jumlah</Label><Input type="number" placeholder="0" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
            {selectedProduct && (
              <div className="rounded-lg border border-border bg-muted/30 p-3 text-sm space-y-1">
                <p>Harga Jual: <span className="font-medium">{formatRupiah(selectedProduct.sellPrice)}</span></p>
                {qty && Number(qty) > 0 && <p>Total: <span className="font-bold text-primary">{formatRupiah(selectedProduct.sellPrice * Number(qty))}</span></p>}
              </div>
            )}
            <Button onClick={handleSubmit} className="w-full">Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>

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
                <th className="px-5 py-3 text-right">Harga Jual</th>
                <th className="px-5 py-3 text-right">Total</th>
                <th className="px-5 py-3">Tanggal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sales.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-medium">{t.itemName}</td>
                  <td className="px-5 py-3.5 text-right">{formatNumber(t.quantity)}</td>
                  <td className="px-5 py-3.5 text-right text-sm">{t.sellPrice ? formatRupiah(t.sellPrice) : "-"}</td>
                  <td className="px-5 py-3.5 text-right font-medium text-primary">{t.totalAmount ? formatRupiah(t.totalAmount) : "-"}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.date}</td>
                </tr>
              ))}
              {sales.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-muted-foreground">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
