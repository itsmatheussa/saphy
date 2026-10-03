const CDN = "https://saphireblox.centralcart.ai/cdn/stores/29522";

export const store = {
  name: "Saphire Blox",
  tagline: "A melhor loja do Roblox",
  logo: "/saphire-logo.png",
  banner: `${CDN}/template_options/49621/hero-banner-0cef3114.png`,
  whatsapp: "5514997041442",
  whatsappLabel: "+55 14 99704-1442",
};

export type Product = {
  slug: string;
  name: string;
  image: string;
  price: number;
  oldPrice?: number | undefined;
  section: string;
  game: string;
  needsRoblox: boolean;
};

export const sections = [
  "Nova atualização",
  "Populares",
  "Contas Blox Fruits inventário",
  "Contas Slayers 2",
  "Giros Slayers 2",
];

const p = (
  slug: string,
  name: string,
  img: string,
  price: number,
  oldPrice: number | undefined,
  section: string,
  game: string,
  needsRoblox = false,
): Product => ({
  slug,
  name,
  image: `${CDN}/packages/${img}.png`,
  price,
  oldPrice,
  section,
  game,
  needsRoblox,
});

const s = sections as [string, string, string, string, string];
export const products: Product[] = [
  p(
    "magnetic-dough-ou-dragon-inventario",
    "Magnetic, Dough ou Dragon - Inventário",
    "30831eb7-e7b1-4c2d-8967-2c4af27c2120",
    16.9,
    33,
    s[0],
    "blox-fruits",
  ),
  p(
    "magnetic-kitsune-ou-dragon-inventario",
    "Magnetic, Kitsune ou Dragon - Inventário",
    "bf2d3170-7f6b-4992-a1ea-b7bebc213471",
    43.99,
    77,
    s[0],
    "blox-fruits",
  ),
  p(
    "kitsune-ou-magnetic-godhuman",
    "Kitsune ou Magnetic + Godhuman",
    "ce09fec3-fca9-44f2-a928-b15c9159229d",
    49.99,
    88,
    s[0],
    "blox-fruits",
  ),
  p(
    "magnetic-permanente",
    "Magnetic Permanente",
    "a5fe3f5f-a5dc-4497-aab6-4500bb675f16",
    157.99,
    270,
    s[0],
    "blox-fruits",
    true,
  ),
  p(
    "skin-arcsteel-magnetic",
    "Skin Arcsteel Magnetic",
    "d07b0711-c589-4130-a83d-6c91b12b50dc",
    359,
    undefined,
    s[0],
    "blox-fruits",
    true,
  ),
  p(
    "1-fruta-mitica-inventario-level-aleatorio",
    "1 Fruta Mítica Inventário + Level Aleatório",
    "c51ea47f-3195-4f98-a2de-56ae2e147764",
    9.99,
    12.99,
    s[1],
    "blox-fruits",
  ),
  p(
    "1-fruta-mitica-inventario-godhuman",
    "1 Fruta Mítica Inventário + Godhuman",
    "43023424-cf8b-408c-bef9-6885c0c75b03",
    12.99,
    19.99,
    s[1],
    "blox-fruits",
  ),
  p(
    "kitsune-inventario-godhuman",
    "Kitsune Inventário + Godhuman",
    "a00d75a3-98b2-4852-bc81-bc760a7901ce",
    43.99,
    66,
    s[1],
    "blox-fruits",
  ),
  p(
    "caixa-de-frutas-permanentes",
    "Caixa de Frutas Permanentes",
    "baa849c1-a156-4a74-b3c8-5f29b9bf7870",
    21.99,
    33,
    s[1],
    "blox-fruits",
    true,
  ),
  p(
    "caixa-de-gamepass",
    "Caixa de Gamepass",
    "bef5b6dc-3c28-4195-b784-26b9a1cb5f6f",
    27.99,
    50.8,
    s[1],
    "blox-fruits",
    true,
  ),
  p(
    "kitsune-dragon-ou-gas-inventario",
    "Kitsune, Dragon ou Gás - Inventário",
    "ccb4757e-46af-4a00-a582-2d6c57905d9e",
    17.99,
    22,
    s[1],
    "blox-fruits",
  ),
  p(
    "control-inventario",
    "Control Inventário",
    "3eb51433-8e3c-4852-9b25-ea4bea4e4873",
    39.99,
    50,
    s[2],
    "blox-fruits",
  ),
  p(
    "tiger-inventario",
    "Tiger Inventário",
    "cbf22d7c-89aa-40e4-8194-36efc8cd2fda",
    24.99,
    44,
    s[2],
    "blox-fruits",
  ),
  p(
    "buddha-inventario",
    "Buddha Inventário",
    "ea4749a5-9056-4c1e-9855-c56616371765",
    10.99,
    22,
    s[2],
    "blox-fruits",
  ),
  p(
    "yeti-inventario",
    "Yeti Inventário",
    "4d84e5a0-4839-408a-8cff-fba802477d0f",
    19.99,
    33,
    s[2],
    "blox-fruits",
  ),
  p(
    "dough-inventario",
    "Dough Inventário",
    "6267bad2-ed31-43bc-8ebe-f7a9b3f7e2ff",
    12.99,
    22,
    s[2],
    "blox-fruits",
  ),
  p(
    "conta-cla-kamado",
    "Conta Clã Kamado",
    "18436d58-cd92-4b52-acf5-7be8dd69a419",
    19.99,
    33,
    s[3],
    "project-slayers",
  ),
  p(
    "conta-cla-uzui",
    "Conta Clã Uzui",
    "76602712-bc44-4666-ac0f-526cde3565a9",
    6.99,
    15,
    s[3],
    "project-slayers",
  ),
  p(
    "conta-cla-rengoku",
    "Conta Clã Rengoku",
    "48089637-04ae-48e9-a81c-b8374a290d1e",
    6.99,
    15,
    s[3],
    "project-slayers",
  ),
  p(
    "conta-cla-soyama",
    "Conta Clã Soyama",
    "b3e9f0b2-25e2-47f5-944b-2fd423993e31",
    6.99,
    15,
    s[3],
    "project-slayers",
  ),
  p(
    "conta-cla-aleatorio",
    "Conta Clã Aleatório",
    "6bc2deed-419d-4068-a6b6-69f718bb8ddb",
    4.99,
    15,
    s[3],
    "project-slayers",
  ),
  p(
    "spins-project-slayers-2",
    "Spins Project Slayers 2",
    "e6e07ed5-e79d-4348-9cda-9bc39eee7957",
    6.99,
    undefined,
    s[4],
    "project-slayers",
    true,
  ),
];

const productSales = [
  248, 193, 176, 121, 87, 214, 164, 139, 118, 96, 152, 109, 83, 71, 66, 92, 58, 47, 43, 39, 35, 31,
  27, 24, 21, 18,
];
const productRatings = [
  4.9, 4.8, 4.9, 4.7, 4.8, 4.9, 4.8, 4.9, 4.7, 4.8, 4.9, 4.8, 4.7, 4.9, 4.8, 4.9, 4.8, 4.7, 4.9,
  4.8, 4.9, 4.8, 4.7, 4.9, 4.8, 4.9,
];

export function getProductStats(product: Pick<Product, "slug">) {
  const index = products.findIndex((item) => item.slug === product.slug);
  return {
    sales: productSales[index] ?? 12,
    rating: productRatings[index] ?? 4.8,
  };
}

export const getProduct = (slug: string) => products.find((x) => x.slug === slug);
export const brl = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
export const isAccount = (x: Product) =>
  x.name.toLowerCase().includes("conta") || x.name.toLowerCase().includes("inventário");

/** Builds the order description used both on WhatsApp and on MisticPay. */
export function orderText(items: { product: Product; qty: number }[], roblox?: string) {
  const lines = items.map(({ product, qty }) => {
    const tipo = product.needsRoblox
      ? "Gamepass/entrega no usuário Roblox"
      : isAccount(product)
        ? "Conta/inventário"
        : "Produto";
    return `${qty}x ${product.name} (${tipo})`;
  });
  const needs = items.some((i) => i.product.needsRoblox);
  const accounts = items.filter((i) => isAccount(i.product) && !i.product.needsRoblox);
  let msg = `Olá! Acabei de pagar no Pix na ${store.name}.\n\nPedido:\n${lines.join("\n")}`;
  if (accounts.length)
    msg += `\n\nConta(s) escolhida(s): ${accounts.map((a) => `${a.qty}x ${a.product.name}`).join(", ")}`;
  if (needs)
    msg += `\n\nMeu user do Roblox para receber a gamepass/entrega: ${roblox || "(não informado)"}`;
  msg += "\n\nPode conferir e me enviar o produto, por favor!";
  return msg;
}
