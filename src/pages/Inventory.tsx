import { useState, useMemo } from "react";
import { Search, Plus, Filter } from "lucide-react";
import { inventoryItems } from "@/data/mockData";
import { formatRupiah, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  safe: { label: "Aman", className: "bg-success/10 text-success border-success/20" },
  low: { label: "Hampir Habis", className: "bg-warning/10 text-warning border-warning/20" },
  out: { label: "Habis", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return inventoryItems.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter]);

  const handleAdd = () => {
    setDialogOpen(false);
    toast({ title: "Berhasil", description: "Barang baru telah ditambahkan." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventaris</h1>
          <p className="text-sm text-muted-foreground">{inventoryItems.length} barang terdaftar</p>
        </div>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button><Plus className="mr-2 h-4 w-4" />Tambah Barang</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader><DialogTitle>Tambah Barang Baru</DialogTitle></DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label>Nama Barang</Label>
                <Input placeholder="Masukkan nama barang" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Kategori</Label>
                  <Input placeholder="Kategori" />
                </div>
                <div className="grid gap-2">
                  <Label>Supplier</Label>
                  <Input placeholder="Supplier" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Harga Beli</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <Label>Harga Jual</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label>Stok Awal</Label>
                  <Input type="number" placeholder="0" />
                </div>
                <div className="grid gap-2">
                  <Label>Minimum Stok</Label>
                  <Input type="number" placeholder="0" />
                </div>
              </div>
              <div className="grid gap-2">
                <Label>Deskripsi</Label>
                <Input placeholder="Deskripsi singkat" />
              </div>
              <Button onClick={handleAdd} className="w-full">Simpan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari barang..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Semua Status</SelectItem>
            <SelectItem value="safe">Aman</SelectItem>
            <SelectItem value="low">Hampir Habis</SelectItem>
            <SelectItem value="out">Habis</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Nama Barang</th>
                <th className="px-5 py-3">Kategori</th>
                <th className="px-5 py-3 text-right">Stok</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Harga Jual</th>
                <th className="px-5 py-3">Supplier</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item, i) => (
                <tr key={item.id} className="transition-colors hover:bg-muted/30" style={{ animationDelay: `${i * 50}ms` }}>
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{item.category}</td>
                  <td className="px-5 py-3.5 text-right font-medium">{formatNumber(item.stock)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant="outline" className={cn("text-xs", statusConfig[item.status].className)}>
                      {statusConfig[item.status].label}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm">{formatRupiah(item.sellPrice)}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{item.supplier}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">Tidak ada barang ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
