import { Link } from "@tanstack/react-router";
import { ShoppingCart, Search, X, MessageCircle } from "lucide-react";
import { useEffect, useState, type CSSProperties, type ReactNode } from "react";
import { store } from "@/lib/catalog";
import { useCart } from "@/lib/cart";

const STAR_COUNT = 42;

function Starfield() {
  return (
    <div className="starfield" aria-hidden="true">
      {Array.from({ length: STAR_COUNT }, (_, index) => (
        <span
          key={index}
          className="star"
          style={
            {
              "--i": index,
              "--star-duration": `${18 + (index % 7) * 1.8}s`,
              "--star-delay": `${-(index * 0.72)}s`,
              "--drift": `${index % 2 ? 3 : -3}vw`,
            } as CSSProperties
          }
        />
      ))}
    </div>
  );
}

function ProductSearch() {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    const onSearch = (event: Event) => setValue((event as CustomEvent<string>).detail ?? "");
    window.addEventListener("product-search-sync", onSearch);
    return () => window.removeEventListener("product-search-sync", onSearch);
  }, []);

  function update(value: string) {
    setValue(value);
    window.dispatchEvent(new CustomEvent("product-search", { detail: value }));
  }

  function toggle() {
    setOpen((current) => !current);
    window.setTimeout(() => document.getElementById("product-search-input")?.focus(), 120);
  }

  return (
    <div className={`product-search ${open ? "is-open" : ""}`}>
      <button
        className="search-trigger"
        type="button"
        onClick={toggle}
        aria-label={open ? "Fechar pesquisa" : "Pesquisar produtos"}
      >
        {open ? <X className="search-spring" /> : <Search className="search-spring" />}
      </button>
      <input
        id="product-search-input"
        value={value}
        onChange={(event) => update(event.target.value)}
        placeholder="Pesquisar produto..."
        aria-label="Pesquisar produto"
        tabIndex={open ? 0 : -1}
      />
    </div>
  );
}

export function Shell({ children }: { children: ReactNode }) {
  const { count } = useCart();
  return (
    <div className="site-shell flex min-h-screen flex-col">
      <Starfield />
      <header className="sticky top-0 z-20 px-2 pt-2 md:px-4 md:pt-4">
        <div className="header-shell mx-auto grid h-16 max-w-6xl grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center overflow-visible px-3 md:h-20 md:px-6">
          <ProductSearch />
          <div className="logo-slot">
            <Link to="/" className="logo-float inline-flex" aria-label="Início">
              <img
                src={store.logo}
                alt={store.name}
                className="logo-mark h-14 w-28 max-w-[7rem] object-contain md:h-16 md:w-32 md:max-w-[8rem]"
              />
            </Link>
          </div>
          <Link to="/carrinho" className="cart-button relative col-start-3 justify-self-end">
            <ShoppingCart className="h-4 w-4" /> <span className="hidden sm:inline">Carrinho</span>
            {count > 0 && (
              <span className="absolute -right-2 -top-2 grid h-5 min-w-5 place-items-center rounded-full bg-accent px-1 text-xs text-accent-foreground">
                {count}
              </span>
            )}
          </Link>
        </div>
      </header>
      <main className="relative z-[1] flex-1">{children}</main>
      <footer className="relative z-[1] border-t py-8 text-center text-sm text-muted-foreground">
        <p className="title-glow text-lg font-bold">{store.name}</p>
        <p>{store.tagline} · Pagamento via Pix · Entrega pelo WhatsApp</p>
        <a
          href={`https://wa.me/${store.whatsapp}`}
          target="_blank"
          rel="noreferrer"
          className="mt-2 inline-flex items-center gap-1 text-success"
        >
          <MessageCircle className="h-4 w-4" /> {store.whatsappLabel}
        </a>
        <p className="mt-2">
          © {new Date().getFullYear()} {store.name}
        </p>
      </footer>
    </div>
  );
}
