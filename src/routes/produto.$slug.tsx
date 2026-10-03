import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { brl, getProduct } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Produto não encontrado" }, { name: "robots", content: "noindex" }] };
    const { product } = loaderData;
    const t = `${product.name} — Saphire Blox`;
    const d = `${product.name} por ${brl(product.price)} no Pix. Entrega pelo WhatsApp.`;
    return {
      meta: [
        { title: t }, { name: "description", content: d },
        { property: "og:title", content: t }, { property: "og:description", content: d },
        { property: "og:type", content: "website" }, { name: "twitter:card", content: "summary_large_image" },
        { property: "og:image", content: product.image }, { name: "twitter:image", content: product.image },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const nav = useNavigate();
  return (
    <Shell>
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
        <img src={p.image} alt={p.name} className="w-full rounded-2xl border bg-card" />
        <div>
          <h1 className="title-glow text-3xl font-bold">{p.name}</h1>
          {p.oldPrice && <p className="mt-4 text-muted-foreground line-through">{brl(p.oldPrice)}</p>}
          <p className="font-display text-4xl font-bold text-primary">{brl(p.price)}</p>
          <p className="text-sm text-muted-foreground">À vista no Pix</p>
          {p.needsRoblox && <p className="mt-4 rounded-lg border bg-card p-3 text-sm">Você vai informar seu user do Roblox na finalização.</p>}
          <div className="mt-6 flex items-center gap-3">
            <button className="h-10 w-10 rounded-lg bg-secondary" onClick={() => setQty(Math.max(1, qty - 1))}>−</button>
            <span className="w-8 text-center font-bold">{qty}</span>
            <button className="h-10 w-10 rounded-lg bg-secondary" onClick={() => setQty(qty + 1)}>+</button>
          </div>
          <div className="mt-6 flex gap-3">
            <button className="btn-glow flex-1 rounded-xl py-3 font-bold" onClick={() => { cart.add(p.slug, qty); nav({ to: "/carrinho" }); }}>Comprar agora</button>
            <button className="flex-1 rounded-xl border py-3 font-semibold" onClick={() => cart.add(p.slug, qty)}>Adicionar ao carrinho</button>
          </div>
        </div>
      </div>
    </Shell>
  );
}
