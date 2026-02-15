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

export default function IncomingGoods() {
  const { items, transactions, addIncoming } = useInventory();
  const { toast } = useToast();
  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [qty, setQty] = useState("");
  const [supplier, setSupplier] = useState("");
  const [notes, setNotes] = useState("");
  const [totalCost, setTotalCost] = useState("");

  const incoming = useMemo(
    () => transactions.filter((t) => t.type === "in" && t.itemName.toLowerCase().includes(search.toLowerCase())),
    [search, transactions]
  );

  const handleSubmit = () => {
    if (!selectedItem || !qty || Number(qty) <= 0) {
      toast({ title: "Error", description: "Pilih barang dan masukkan jumlah.", variant: "destructive" });
      return;
    }
    addIncoming(selectedItem, Number(qty), supplier, notes, Number(totalCost) || 0);
    toast({ title: "Berhasil", description: "Barang masuk telah dicatat." });
    setDialogOpen(false);
    setSelectedItem(""); setQty(""); setSupplier(""); setNotes(""); setTotalCost("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Barang Masuk</h1>
          <p className="text-sm text-muted-foreground">Riwayat pemasukan stok</p>
        </div>
        <Button onClick={() => setDialogOpen(true)}><Plus className="mr-2 h-4 w-4" />Catat Barang Masuk</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader><DialogTitle>Catat Barang Masuk</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label>Pilih Barang</Label>
              <Select value={selectedItem} onValueChange={setSelectedItem}>
                <SelectTrigger><SelectValue placeholder="Pilih barang..." /></SelectTrigger>
                <SelectContent>{items.map((i) => <SelectItem key={i.id} value={i.id}>{i.name}</SelectItem>)}</SelectContent>
              </Select>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Jumlah</Label><Input type="number" placeholder="0" value={qty} onChange={(e) => setQty(e.target.value)} /></div>
              <div className="grid gap-2"><Label>Total Biaya</Label><Input type="number" placeholder="0" value={totalCost} onChange={(e) => setTotalCost(e.target.value)} /></div>
            </div>
            <div className="grid gap-2"><Label>Supplier</Label><Input placeholder="Nama supplier" value={supplier} onChange={(e) => setSupplier(e.target.value)} /></div>
            <div className="grid gap-2"><Label>Catatan</Label><Input placeholder="Catatan" value={notes} onChange={(e) => setNotes(e.target.value)} /></div>
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
                <th className="px-5 py-3">Supplier</th>
                <th className="px-5 py-3">Tanggal</th>
                <th className="px-5 py-3 text-right">Total Biaya</th>
                <th className="px-5 py-3">Catatan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {incoming.map((t) => (
                <tr key={t.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5 font-medium">{t.itemName}</td>
                  <td className="px-5 py-3.5 text-right">{formatNumber(t.quantity)}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.supplier || "-"}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.date}</td>
                  <td className="px-5 py-3.5 text-right text-sm">{t.totalCost ? formatRupiah(t.totalCost) : "-"}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{t.notes || "-"}</td>
                </tr>
              ))}
              {incoming.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">Tidak ada data</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
