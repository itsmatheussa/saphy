import { createFileRoute, notFound, useNavigate } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { useState } from "react";
import { Shell } from "@/components/Shell";
import { brl, getProduct, getProductStats } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/produto/$slug")({
  loader: ({ params }) => {
    const product = getProduct(params.slug);
    if (!product) throw notFound();
    return { product };
  },
  head: ({ loaderData }) => {
    if (!loaderData)
      return {
        meta: [{ title: "Produto não encontrado" }, { name: "robots", content: "noindex" }],
      };
    const { product } = loaderData;
    const t = `${product.name} — Saphire Blox`;
    const d = `${product.name} por ${brl(product.price)} no Pix. Entrega pelo WhatsApp.`;
    return {
      meta: [
        { title: t },
        { name: "description", content: d },
        { property: "og:title", content: t },
        { property: "og:description", content: d },
        { property: "og:type", content: "website" },
        { name: "twitter:card", content: "summary_large_image" },
        { property: "og:image", content: product.image },
        { name: "twitter:image", content: product.image },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product: p } = Route.useLoaderData();
  const { rating, sales } = getProductStats(p);
  const [qty, setQty] = useState(1);
  const cart = useCart();
  const nav = useNavigate();
  return (
    <Shell>
      <div className="mx-auto grid max-w-5xl gap-8 px-4 py-10 md:grid-cols-2">
        <img src={p.image} alt={p.name} className="w-full rounded-2xl border bg-card" />
        <div>
          <h1 className="title-glow text-3xl font-bold">{p.name}</h1>
          <div
            className="product-rating mt-3"
            aria-label={`Avaliação ${rating} de 5, ${sales} vendas`}
          >
            <span className="product-stars" aria-hidden="true">
              {Array.from({ length: 5 }, (_, index) => (
                <Star key={index} className="h-4 w-4" fill="currentColor" />
              ))}
            </span>
            <span>{rating.toFixed(1)} de 5</span>
            <span className="product-sales">{sales} vendas</span>
          </div>
          {p.oldPrice && (
            <p className="mt-4 text-muted-foreground line-through">{brl(p.oldPrice)}</p>
          )}
          <p className="font-display text-4xl font-bold text-primary">{brl(p.price)}</p>
          <p className="text-sm text-muted-foreground">À vista no Pix</p>
          {p.needsRoblox && (
            <p className="mt-4 rounded-lg border bg-card p-3 text-sm">
              Você vai informar seu user do Roblox na finalização.
            </p>
          )}
          <div className="mt-6 flex items-center gap-3">
            <button
              className="h-10 w-10 rounded-lg bg-secondary"
              onClick={() => setQty(Math.max(1, qty - 1))}
            >
              −
            </button>
            <span className="w-8 text-center font-bold">{qty}</span>
            <button className="h-10 w-10 rounded-lg bg-secondary" onClick={() => setQty(qty + 1)}>
              +
            </button>
          </div>
          <div className="mt-6 flex gap-3">
            <button
              className="btn-glow flex-1 rounded-xl py-3 font-bold"
              onClick={() => {
                cart.add(p.slug, qty);
                nav({ to: "/carrinho" });
              }}
            >
              Comprar agora
            </button>
            <button
              className="flex-1 rounded-xl border py-3 font-semibold"
              onClick={() => cart.add(p.slug, qty)}
            >
              Adicionar ao carrinho
            </button>
          </div>
        </div>
      </div>
      <section className="mx-auto max-w-5xl px-4 pb-12" aria-label={`Avaliações de ${p.name}`}>
        <div className="mb-4 flex items-center gap-2">
          <Star className="h-5 w-5 text-accent" fill="currentColor" />
          <h2 className="title-glow text-2xl font-bold">Avaliações de quem comprou</h2>
        </div>
        <div className="grid gap-4 md:grid-cols-3">
          {[
            ["Compra aprovada rapidinho e recebi tudo certinho!", "Cliente verificado"],
            ["Produto igual ao anúncio e atendimento muito rápido.", "Compra confirmada"],
            ["Já voltei para comprar de novo. Recomendo!", "Cliente recorrente"],
          ].map(([quote, label]) => (
            <article className="product-review-card" key={quote}>
              <div className="review-card-stars" aria-label="5 estrelas">
                {Array.from({ length: 5 }, (_, index) => (
                  <Star key={index} className="h-3.5 w-3.5" fill="currentColor" />
                ))}
              </div>
              <p>“{quote}”</p>
              <span>{label}</span>
            </article>
          ))}
        </div>
      </section>
    </Shell>
  );
}
