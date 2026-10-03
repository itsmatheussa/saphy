import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

type Item = { slug: string; qty: number };
type Cart = {
  items: Item[];
  count: number;
  add: (slug: string, qty?: number) => void;
  setQty: (slug: string, qty: number) => void;
  clear: () => void;
};
const Ctx = createContext<Cart | null>(null);
const KEY = "saphire-cart";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<Item[]>([]);
  useEffect(() => {
    try { setItems(JSON.parse(localStorage.getItem(KEY) || "[]")); } catch { /* ignore */ }
  }, []);
  const save = (v: Item[]) => { setItems(v); localStorage.setItem(KEY, JSON.stringify(v)); };
  const value: Cart = {
    items,
    count: items.reduce((a, i) => a + i.qty, 0),
    add: (slug, qty = 1) => {
      const f = items.find((i) => i.slug === slug);
      save(f ? items.map((i) => (i.slug === slug ? { ...i, qty: i.qty + qty } : i)) : [...items, { slug, qty }]);
    },
    setQty: (slug, qty) => save(qty <= 0 ? items.filter((i) => i.slug !== slug) : items.map((i) => (i.slug === slug ? { ...i, qty } : i))),
    clear: () => save([]),
  };
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export const useCart = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("CartProvider missing");
  return c;
};
