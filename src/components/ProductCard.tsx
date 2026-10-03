import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { brl, getProductStats, type Product } from "@/lib/catalog";

export function ProductCard({ p }: { p: Product }) {
  const off = p.oldPrice ? Math.round((1 - p.price / p.oldPrice) * 100) : 0;
  const { rating, sales } = getProductStats(p);
  return (
    <Link
      to="/produto/$slug"
      params={{ slug: p.slug }}
      className="group relative overflow-hidden rounded-xl border bg-card transition hover:-translate-y-1 hover:border-primary"
    >
      {off > 0 && (
        <span className="absolute left-2 top-2 z-10 rounded-md bg-accent px-2 py-0.5 text-xs font-bold text-accent-foreground">
          -{off}%
        </span>
      )}
      <div className="aspect-square overflow-hidden bg-muted">
        <img
          src={p.image}
          alt={p.name}
          loading="lazy"
          className="h-full w-full object-cover transition group-hover:scale-105"
        />
      </div>
      <div className="p-3">
        <h3 className="line-clamp-2 min-h-10 text-sm font-semibold">{p.name}</h3>
        <div
          className="product-rating mt-2"
          aria-label={`Avaliação ${rating} de 5, ${sales} vendas`}
        >
          <span className="product-stars" aria-hidden="true">
            {Array.from({ length: 5 }, (_, index) => (
              <Star key={index} className="h-3.5 w-3.5" fill="currentColor" />
            ))}
          </span>
          <span>{rating.toFixed(1)}</span>
          <span className="product-sales">{sales} vendas</span>
        </div>
        {p.oldPrice && (
          <p className="mt-1 text-xs text-muted-foreground line-through">{brl(p.oldPrice)}</p>
        )}
        <p className="font-display text-lg font-bold text-primary">{brl(p.price)}</p>
        <p className="text-xs text-muted-foreground">À vista no Pix</p>
      </div>
    </Link>
  );
}
