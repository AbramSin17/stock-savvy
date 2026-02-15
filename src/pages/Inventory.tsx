import { useState, useMemo } from "react";
import { Search, Plus, Filter, Pencil, Trash2 } from "lucide-react";
import { useInventory } from "@/store/inventoryStore";
import { formatRupiah, formatNumber } from "@/lib/format";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

const statusConfig = {
  safe: { label: "Aman", className: "bg-success/10 text-success border-success/20" },
  low: { label: "Hampir Habis", className: "bg-warning/10 text-warning border-warning/20" },
  out: { label: "Habis", className: "bg-destructive/10 text-destructive border-destructive/20" },
};

const emptyForm = { name: "", category: "", buyPrice: "", sellPrice: "", stock: "", minStock: "", supplier: "", description: "" };

export default function Inventory() {
  const { items, addItem, updateItem, deleteItem } = useInventory();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const { toast } = useToast();

  const filtered = useMemo(() => {
    return items.filter((item) => {
      const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) || item.category.toLowerCase().includes(search.toLowerCase());
      const matchStatus = statusFilter === "all" || item.status === statusFilter;
      return matchSearch && matchStatus;
    });
  }, [search, statusFilter, items]);

  const setField = (key: string, value: string) => setForm((f) => ({ ...f, [key]: value }));

  const openAdd = () => { setEditId(null); setForm(emptyForm); setDialogOpen(true); };
  const openEdit = (id: string) => {
    const item = items.find((i) => i.id === id);
    if (!item) return;
    setEditId(id);
    setForm({ name: item.name, category: item.category, buyPrice: String(item.buyPrice), sellPrice: String(item.sellPrice), stock: String(item.stock), minStock: String(item.minStock), supplier: item.supplier, description: item.description });
    setDialogOpen(true);
  };

  const handleSubmit = () => {
    if (!form.name || !form.category) { toast({ title: "Error", description: "Nama dan kategori wajib diisi.", variant: "destructive" }); return; }
    const data = { name: form.name, category: form.category, buyPrice: Number(form.buyPrice) || 0, sellPrice: Number(form.sellPrice) || 0, stock: Number(form.stock) || 0, minStock: Number(form.minStock) || 0, supplier: form.supplier, description: form.description };
    if (editId) {
      updateItem(editId, data);
      toast({ title: "Berhasil", description: "Barang berhasil diperbarui." });
    } else {
      addItem(data);
      toast({ title: "Berhasil", description: "Barang baru telah ditambahkan." });
    }
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteItem(id);
    toast({ title: "Dihapus", description: "Barang telah dihapus." });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Inventaris</h1>
          <p className="text-sm text-muted-foreground">{items.length} barang terdaftar</p>
        </div>
        <Button onClick={openAdd}><Plus className="mr-2 h-4 w-4" />Tambah Barang</Button>
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader><DialogTitle>{editId ? "Edit Barang" : "Tambah Barang Baru"}</DialogTitle></DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2"><Label>Nama Barang</Label><Input placeholder="Masukkan nama barang" value={form.name} onChange={(e) => setField("name", e.target.value)} /></div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Kategori</Label><Input placeholder="Kategori" value={form.category} onChange={(e) => setField("category", e.target.value)} /></div>
              <div className="grid gap-2"><Label>Supplier</Label><Input placeholder="Supplier" value={form.supplier} onChange={(e) => setField("supplier", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Harga Beli</Label><Input type="number" placeholder="0" value={form.buyPrice} onChange={(e) => setField("buyPrice", e.target.value)} /></div>
              <div className="grid gap-2"><Label>Harga Jual</Label><Input type="number" placeholder="0" value={form.sellPrice} onChange={(e) => setField("sellPrice", e.target.value)} /></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2"><Label>Stok {editId ? "Saat Ini" : "Awal"}</Label><Input type="number" placeholder="0" value={form.stock} onChange={(e) => setField("stock", e.target.value)} /></div>
              <div className="grid gap-2"><Label>Minimum Stok</Label><Input type="number" placeholder="0" value={form.minStock} onChange={(e) => setField("minStock", e.target.value)} /></div>
            </div>
            <div className="grid gap-2"><Label>Deskripsi</Label><Input placeholder="Deskripsi singkat" value={form.description} onChange={(e) => setField("description", e.target.value)} /></div>
            <Button onClick={handleSubmit} className="w-full">Simpan</Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Filters */}
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input placeholder="Cari barang..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full sm:w-44"><Filter className="mr-2 h-4 w-4" /><SelectValue placeholder="Status" /></SelectTrigger>
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
                <th className="px-5 py-3 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((item) => (
                <tr key={item.id} className="transition-colors hover:bg-muted/30">
                  <td className="px-5 py-3.5">
                    <p className="font-medium text-foreground">{item.name}</p>
                    <p className="text-xs text-muted-foreground">{item.description}</p>
                  </td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{item.category}</td>
                  <td className="px-5 py-3.5 text-right font-medium">{formatNumber(item.stock)}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant="outline" className={cn("text-xs", statusConfig[item.status].className)}>{statusConfig[item.status].label}</Badge>
                  </td>
                  <td className="px-5 py-3.5 text-right text-sm">{formatRupiah(item.sellPrice)}</td>
                  <td className="px-5 py-3.5 text-sm text-muted-foreground">{item.supplier}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-center gap-1">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => openEdit(item.id)}><Pencil className="h-4 w-4" /></Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild><Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:text-destructive"><Trash2 className="h-4 w-4" /></Button></AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader><AlertDialogTitle>Hapus Barang?</AlertDialogTitle><AlertDialogDescription>Barang "{item.name}" akan dihapus permanen.</AlertDialogDescription></AlertDialogHeader>
                          <AlertDialogFooter><AlertDialogCancel>Batal</AlertDialogCancel><AlertDialogAction onClick={() => handleDelete(item.id)}>Hapus</AlertDialogAction></AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">Tidak ada barang ditemukan</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
