import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useState } from "react";
import { Shell } from "@/components/Shell";
import { brl, getProduct, orderText, store } from "@/lib/catalog";
import { useCart } from "@/lib/cart";
import { checkPix, createPix } from "@/lib/pix.functions";
import { lookupRobloxUser } from "@/lib/roblox.functions";

export const Route = createFileRoute("/carrinho")({
  head: () => ({
    meta: [
      { title: "Carrinho — Saphire Blox" },
      { name: "description", content: "Finalize sua compra no Pix e receba pelo WhatsApp." },
      { property: "og:title", content: "Carrinho — Saphire Blox" },
      { property: "og:description", content: "Finalize sua compra no Pix e receba pelo WhatsApp." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: CartPage,
});

type Pix = { transactionId: string; qrCode: string; copyPaste: string; message: string };
type RobloxUser = { id: number; username: string; displayName: string; avatarUrl: string };

function CartPage() {
  const cart = useCart();
  const create = useServerFn(createPix);
  const check = useServerFn(checkPix);
  const lookupUser = useServerFn(lookupRobloxUser);
  const [name, setName] = useState("");
  const [roblox, setRoblox] = useState("");
  const [pix, setPix] = useState<Pix | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  const [copied, setCopied] = useState(false);
  const [paid, setPaid] = useState(false);
  const [robloxUser, setRobloxUser] = useState<RobloxUser | null>(null);
  const [lookingUp, setLookingUp] = useState(false);

  const items = cart.items.flatMap((i) => {
    const product = getProduct(i.slug);
    return product ? [{ product, qty: i.qty }] : [];
  });
  const total = items.reduce((a, i) => a + i.product.price * i.qty, 0);
  const needsRoblox = items.some((i) => i.product.needsRoblox);

  useEffect(() => {
    setRobloxUser(null);
    if (!needsRoblox || roblox.trim().length < 3) return;
    const timer = window.setTimeout(async () => {
      setLookingUp(true);
      try {
        const result = await lookupUser({ data: { username: roblox.trim() } });
        setRobloxUser(result);
      } catch {
        setRobloxUser(null);
      } finally {
        setLookingUp(false);
      }
    }, 600);
    return () => window.clearTimeout(timer);
  }, [roblox, needsRoblox]);

  useEffect(() => {
    if (!pix || paid) return;
    const t = setInterval(async () => {
      try {
        const r = await check({ data: { transactionId: pix.transactionId } });
        if (r.state === "COMPLETO") {
          setPaid(true);
          cart.clear();
          window.location.href = `https://wa.me/${store.whatsapp}?text=${encodeURIComponent(pix.message)}`;
        }
      } catch {
        /* keep polling */
      }
    }, 4000);
    return () => clearInterval(t);
  }, [pix, paid]);

  async function pay() {
    setErr("");
    if (!name.trim()) return setErr("Informe seu nome.");
    if (needsRoblox && !roblox.trim()) return setErr("Informe seu user do Roblox.");
    setLoading(true);
    try {
      const message = orderText(items, roblox.trim()) + `\n\nNome do comprador: ${name.trim()}`;
      const r = await create({
        data: { amount: total, name: name.trim(), description: message.slice(0, 1000) },
      });
      setPix({ ...r, message });
    } catch (e) {
      setErr(e instanceof Error ? e.message : "Erro ao gerar Pix");
    } finally {
      setLoading(false);
    }
  }

  if (pix) {
    return (
      <Shell>
        <div className="mx-auto max-w-md px-4 py-10 text-center">
          <h1 className="title-glow text-3xl font-bold">
            {paid ? "Pagamento confirmado!" : "Pague com Pix"}
          </h1>
          <p className="mt-2 text-muted-foreground">
            {paid
              ? "Redirecionando para o WhatsApp..."
              : `Total ${brl(total)} · aguardando pagamento...`}
          </p>
          {pix.qrCode && (
            <img
              src={pix.qrCode}
              alt="QR Code Pix"
              className="mx-auto mt-6 w-64 rounded-xl bg-foreground p-2"
            />
          )}
          <textarea
            readOnly
            value={pix.copyPaste}
            className="mt-4 h-24 w-full rounded-lg border bg-card p-2 text-xs"
          />
          <button
            className="btn-glow mt-3 w-full rounded-xl py-3 font-bold"
            onClick={() => {
              navigator.clipboard.writeText(pix.copyPaste);
              setCopied(true);
            }}
          >
            {copied ? "Copiado!" : "Copiar código Pix"}
          </button>
          <p className="mt-4 text-xs text-muted-foreground">
            Após a confirmação automática do pagamento, você será levado ao WhatsApp para receber o
            pedido.
          </p>
        </div>
      </Shell>
    );
  }

  return (
    <Shell>
      <div className="mx-auto max-w-3xl px-4 py-10">
        <h1 className="title-glow text-3xl font-bold">Carrinho</h1>
        {items.length === 0 ? (
          <p className="mt-6 text-muted-foreground">
            Seu carrinho está vazio.{" "}
            <Link to="/" className="text-primary underline">
              Ver produtos
            </Link>
          </p>
        ) : (
          <>
            <div className="mt-6 space-y-3">
              {items.map(({ product: p, qty }) => (
                <div key={p.slug} className="flex items-center gap-3 rounded-xl border bg-card p-3">
                  <img src={p.image} alt="" className="h-16 w-16 rounded-lg object-cover" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{p.name}</p>
                    <p className="text-primary">{brl(p.price)}</p>
                  </div>
                  <button
                    className="h-8 w-8 rounded bg-secondary"
                    onClick={() => cart.setQty(p.slug, qty - 1)}
                  >
                    −
                  </button>
                  <span className="w-6 text-center">{qty}</span>
                  <button
                    className="h-8 w-8 rounded bg-secondary"
                    onClick={() => cart.setQty(p.slug, qty + 1)}
                  >
                    +
                  </button>
                </div>
              ))}
            </div>
            <div className="mt-6 space-y-3 rounded-xl border bg-card p-4">
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                maxLength={100}
                placeholder="Seu nome"
                className="w-full rounded-lg border bg-background p-3"
              />
              {needsRoblox && (
                <div>
                  <input
                    value={roblox}
                    onChange={(e) => setRoblox(e.target.value)}
                    maxLength={50}
                    placeholder="Seu user do Roblox"
                    className="w-full rounded-lg border bg-background p-3"
                  />
                  <div className="mt-2 min-h-14">
                    {lookingUp && (
                      <p className="text-sm text-muted-foreground">Buscando usuário...</p>
                    )}
                    {!lookingUp && robloxUser && (
                      <div className="roblox-user flex items-center gap-3 rounded-lg border p-2">
                        {robloxUser.avatarUrl && (
                          <img
                            src={robloxUser.avatarUrl}
                            alt={`Avatar de ${robloxUser.username}`}
                            className="h-12 w-12 rounded-md object-cover"
                          />
                        )}
                        <div>
                          <p className="font-semibold">{robloxUser.displayName}</p>
                          <p className="text-sm text-muted-foreground">@{robloxUser.username}</p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              <div className="flex items-center justify-between font-display text-xl">
                <span>Total</span>
                <span className="text-primary">{brl(total)}</span>
              </div>
              {err && <p className="text-sm text-destructive">{err}</p>}
              <button
                disabled={loading}
                onClick={pay}
                className="btn-glow w-full rounded-xl py-3 font-bold disabled:opacity-60"
              >
                {loading ? "Gerando Pix..." : "Pagar com Pix"}
              </button>
            </div>
          </>
        )}
      </div>
    </Shell>
  );
}
