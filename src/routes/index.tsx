import { createFileRoute } from "@tanstack/react-router";
import { MessageCircle, ShieldCheck, Sparkles, Zap } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Shell } from "@/components/Shell";
import { ProductCard } from "@/components/ProductCard";
import { products, sections, store } from "@/lib/catalog";

const title = "Saphire Blox — Frutas, contas e gamepasses de Roblox no Pix";
const desc =
  "Compre frutas, contas e gamepasses de Roblox no Pix e receba pelo WhatsApp logo após a confirmação.";
const bloxSections = sections.slice(0, 3);
const projectSections = sections.slice(3);

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title },
      { name: "description", content: desc },
      { property: "og:title", content: title },
      { property: "og:description", content: desc },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:image", content: store.banner },
      { name: "twitter:image", content: store.banner },
    ],
  }),
  component: Index,
});

function CategoryImage({ src, alt, href }: { src: string; alt: string; href: string }) {
  return (
    <a href={href} className="category-image-card" aria-label={`Ver produtos de ${alt}`}>
      <img src={src} alt={alt} />
    </a>
  );
}

function Index() {
  const [query, setQuery] = useState("");
  useEffect(() => {
    const onSearch = (event: Event) => {
      setQuery((event as CustomEvent<string>).detail?.trim().toLowerCase() ?? "");
      document.getElementById("produtos")?.scrollIntoView({ behavior: "smooth", block: "start" });
    };
    window.addEventListener("product-search", onSearch);
    return () => window.removeEventListener("product-search", onSearch);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!query) return products;
    return products.filter((product) =>
      `${product.name} ${product.section} ${product.game}`.toLowerCase().includes(query),
    );
  }, [query]);

  const renderGroup = (groupSections: string[], game: string) => {
    const groupProducts = filteredProducts.filter(
      (product) => groupSections.includes(product.section) && product.game === game,
    );
    return (
      <div className="space-y-10">
        {groupSections.map((section) => {
          const sectionProducts = groupProducts.filter((product) => product.section === section);
          if (!sectionProducts.length) return null;
          return (
            <section
              id={section.toLowerCase().replaceAll(" ", "-")}
              key={section}
              className="scroll-mt-28"
            >
              <h3 className="subcategory-title">{section}</h3>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
                {sectionProducts.map((product) => (
                  <ProductCard key={product.slug} p={product} />
                ))}
              </div>
            </section>
          );
        })}
        {!groupProducts.length && (
          <p className="rounded-xl border border-dashed p-8 text-center text-muted-foreground">
            Nenhum produto encontrado para “{query}”.
          </p>
        )}
      </div>
    );
  };

  return (
    <Shell>
      <section className="mx-auto max-w-6xl px-4 pt-8">
        <div className="banner-frame overflow-hidden rounded-lg border">
          <img src={store.banner} alt="Banner Saphire Blox" className="block h-auto w-full" />
        </div>
      </section>

      <section className="benefit-rail mt-5" aria-label="Benefícios da loja">
        <div className="benefit-track">
          {[1, 2].map((copy) => (
            <div className="benefit-line" key={copy} aria-hidden={copy === 2}>
              <span>
                <Zap /> Pix instantâneo
              </span>
              <i />
              <span>
                <MessageCircle /> Entrega pelo WhatsApp
              </span>
              <i />
              <span>
                <ShieldCheck /> Compra segura
              </span>
              <i />
            </div>
          ))}
        </div>
      </section>

      <section id="categorias" className="mx-auto max-w-6xl scroll-mt-28 px-4 pt-8">
        <div className="mb-4 flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h2 className="title-glow text-2xl font-bold">Categorias</h2>
        </div>
        <div className="grid grid-cols-2 gap-3 md:gap-5">
          <CategoryImage src="/bloxfruits-category.png" alt="Blox Fruits" href="#blox-fruits" />
          <CategoryImage
            src="/project-slayers-2-category.png"
            alt="Project Slayers 2"
            href="#project-slayers-2"
          />
        </div>
      </section>

      <section id="produtos" className="mx-auto max-w-6xl scroll-mt-28 px-4 pb-12 pt-12">
        {query && (
          <p className="mb-6 text-sm text-muted-foreground">
            Resultados para: <strong className="text-foreground">{query}</strong>
          </p>
        )}
        <div id="blox-fruits" className="scroll-mt-28">
          <div className="mb-6 flex items-center gap-3">
            <span className="game-divider" />
            <h2 className="title-glow text-2xl font-bold">Blox Fruits</h2>
          </div>
          {renderGroup(bloxSections, "blox-fruits")}
        </div>
        <div id="project-slayers-2" className="mt-14 scroll-mt-28">
          <div className="mb-6 flex items-center gap-3">
            <span className="game-divider project" />
            <h2 className="title-glow text-2xl font-bold">Project Slayers 2</h2>
          </div>
          {renderGroup(projectSections, "project-slayers")}
        </div>
      </section>
    </Shell>
  );
}
