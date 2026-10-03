import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

const API = "https://api.misticpay.com/api";
export const createPix = createServerFn({ method: "POST" })
  .inputValidator((d) =>
    z
      .object({
        amount: z.number().positive().max(10000),
        name: z.string().min(1).max(100),
        description: z.string().min(1).max(1000),
      })
      .parse(d),
  )
  .handler(async ({ data }) => {
    const auth = process.env["MISTIC_AUTH"];
    if (!auth) throw new Error("Pagamento temporariamente indisponível.");
    const transactionId = `sb_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const res = await fetch(`${API}/transactions/create`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        amount: Number(data.amount.toFixed(2)),
        payerName: data.name,
        // A loja não pede CPF ao comprador. A MisticPay ainda exige um
        // documento no payload, então o valor técnico fica somente no servidor.
        payerDocument: process.env["MISTIC_PAYER_DOCUMENT"] || "77777777777",
        transactionId,
        description: data.description,
      }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      message?: string;
      data?: { transactionId: string; qrCodeBase64?: string; copyPaste?: string };
    };
    if (!res.ok || !json.data) throw new Error(json.message || "Erro ao gerar Pix");
    return {
      transactionId,
      qrCode: json.data.qrCodeBase64 ?? "",
      copyPaste: json.data.copyPaste ?? "",
    };
  });

export const checkPix = createServerFn({ method: "POST" })
  .inputValidator((d) => z.object({ transactionId: z.string().min(1).max(100) }).parse(d))
  .handler(async ({ data }) => {
    const auth = process.env["MISTIC_AUTH"];
    if (!auth) throw new Error("Pagamento temporariamente indisponível.");
    const res = await fetch(`${API}/transactions/check`, {
      method: "POST",
      headers: { Authorization: `Basic ${auth}`, "Content-Type": "application/json" },
      body: JSON.stringify({ transactionId: data.transactionId }),
    });
    const json = (await res.json().catch(() => ({}))) as {
      transaction?: { transactionState?: string };
    };
    return { state: json.transaction?.transactionState ?? "PENDENTE" };
  });
