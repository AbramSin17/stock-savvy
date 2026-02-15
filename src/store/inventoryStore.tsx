import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
import { InventoryItem, Transaction } from "@/types/inventory";
import { inventoryItems as defaultItems, transactions as defaultTransactions } from "@/data/mockData";

interface InventoryStore {
  items: InventoryItem[];
  transactions: Transaction[];
  addItem: (item: Omit<InventoryItem, "id" | "status">) => void;
  updateItem: (id: string, data: Partial<Omit<InventoryItem, "id" | "status">>) => void;
  deleteItem: (id: string) => void;
  addIncoming: (itemId: string, quantity: number, supplier: string, notes: string, totalCost: number) => void;
  addOutgoing: (itemId: string, quantity: number, destination: string, notes: string) => boolean;
  addSale: (itemId: string, quantity: number) => boolean;
}

const StoreContext = createContext<InventoryStore | null>(null);

function computeStatus(stock: number, minStock: number): InventoryItem["status"] {
  if (stock <= 0) return "out";
  if (stock <= minStock) return "low";
  return "safe";
}

function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch {
    return fallback;
  }
}

let nextId = Date.now();
function genId() {
  return String(++nextId);
}

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>(() => loadFromStorage("invenpro_items", defaultItems));
  const [txns, setTxns] = useState<Transaction[]>(() => loadFromStorage("invenpro_txns", defaultTransactions));

  useEffect(() => { localStorage.setItem("invenpro_items", JSON.stringify(items)); }, [items]);
  useEffect(() => { localStorage.setItem("invenpro_txns", JSON.stringify(txns)); }, [txns]);

  const addItem = useCallback((data: Omit<InventoryItem, "id" | "status">) => {
    const newItem: InventoryItem = {
      ...data,
      id: genId(),
      status: computeStatus(data.stock, data.minStock),
    };
    setItems((prev) => [...prev, newItem]);
  }, []);

  const updateItem = useCallback((id: string, data: Partial<Omit<InventoryItem, "id" | "status">>) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const updated = { ...item, ...data };
        updated.status = computeStatus(updated.stock, updated.minStock);
        return updated;
      })
    );
  }, []);

  const deleteItem = useCallback((id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const addIncoming = useCallback((itemId: string, quantity: number, supplier: string, notes: string, totalCost: number) => {
    setItems((prev) =>
      prev.map((item) => {
        if (item.id !== itemId) return item;
        const newStock = item.stock + quantity;
        return { ...item, stock: newStock, status: computeStatus(newStock, item.minStock) };
      })
    );
    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item) return prev;
      const txn: Transaction = {
        id: genId(),
        type: "in",
        itemName: item.name,
        quantity,
        date: new Date().toISOString().split("T")[0],
        supplier,
        totalCost,
        notes,
      };
      setTxns((t) => [txn, ...t]);
      return prev;
    });
  }, []);

  const addOutgoing = useCallback((itemId: string, quantity: number, destination: string, notes: string): boolean => {
    let success = false;
    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item || item.stock < quantity) return prev;
      success = true;
      const txn: Transaction = {
        id: genId(),
        type: "out",
        itemName: item.name,
        quantity,
        date: new Date().toISOString().split("T")[0],
        destination,
        notes,
      };
      setTxns((t) => [txn, ...t]);
      return prev.map((i) => {
        if (i.id !== itemId) return i;
        const newStock = i.stock - quantity;
        return { ...i, stock: newStock, status: computeStatus(newStock, i.minStock) };
      });
    });
    return success;
  }, []);

  const addSale = useCallback((itemId: string, quantity: number): boolean => {
    let success = false;
    setItems((prev) => {
      const item = prev.find((i) => i.id === itemId);
      if (!item || item.stock < quantity) return prev;
      success = true;
      const saleTxn: Transaction = {
        id: genId(),
        type: "sale",
        itemName: item.name,
        quantity,
        date: new Date().toISOString().split("T")[0],
        sellPrice: item.sellPrice,
        totalAmount: item.sellPrice * quantity,
      };
      setTxns((t) => [saleTxn, ...t]);
      return prev.map((i) => {
        if (i.id !== itemId) return i;
        const newStock = i.stock - quantity;
        return { ...i, stock: newStock, status: computeStatus(newStock, i.minStock) };
      });
    });
    return success;
  }, []);

  return (
    <StoreContext.Provider value={{ items, transactions: txns, addItem, updateItem, deleteItem, addIncoming, addOutgoing, addSale }}>
      {children}
    </StoreContext.Provider>
  );
}

export function useInventory() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useInventory must be used within InventoryProvider");
  return ctx;
}
