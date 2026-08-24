import { Router, Response } from "express";
import { supabaseForUser, supabaseAdmin } from "./supabaseClient.js";
import { requireAuth, requireAdmin } from "./middleware/auth.js";
import { AuthRequest } from "./types.js";
import { Resend } from "resend";
const resend = new Resend(process.env.RESEND_API_KEY);

const orderRouter = Router();

orderRouter.use(requireAuth);

orderRouter.post("/", async (req: AuthRequest, res: Response) => {
  const sb = supabaseForUser(req.token!);
  const { shipping_address } = req.body;

  const { data: cartItems, error: cartError } = await sb
    .from("cart_items")
    .select("quantity, product:products(id, name, price)")
    .eq("user_id", req.user!.id);

  if (cartError) return res.status(500).json({ error: cartError.message });
  if (!cartItems?.length) return res.status(400).json({ error: "Varukorgen är tom" });

  const total = cartItems.reduce((sum, i: any) => sum + i.quantity * i.product.price, 0);

  const { data: order, error: orderError } = await sb
    .from("orders")
    .insert({ user_id: req.user!.id, total, shipping_address })
    .select()
    .single();
  if (orderError) return res.status(500).json({ error: orderError.message });

  const orderItems = cartItems.map((i: any) => ({
    order_id: order.id,
    product_id: i.product.id,
    quantity: i.quantity,
    unit_price: i.product.price,
  }));
  const { error: itemsError } = await sb.from("order_items").insert(orderItems);
  if (itemsError) return res.status(500).json({ error: itemsError.message });

  await sb.from("cart_items").delete().eq("user_id", req.user!.id);

  res.status(201).json({ ...order, items: orderItems });

  sendInvoiceEmail(req.user!.email!, order, cartItems).catch((err) =>
    console.error("Kunde inte skicka faktura:", err)
  );
});

async function sendInvoiceEmail(email: string, order: any, cartItems: any[]) {
  const rows = cartItems
    .map((i) => `<tr><td>${i.product.name}</td><td>${i.quantity}</td><td>${i.product.price} slantar</td></tr>`)
    .join("");

  await resend.emails.send({
    from: "onboarding@resend.dev",
    to: email,
    subject: `Faktura för order #${order.id}`,
    html: `<h2>Tack för din beställning!</h2>
      <table border="1" cellpadding="6"><tr><th>Produkt</th><th>Antal</th><th>Pris</th></tr>${rows}</table>
      <p><strong>Totalt: ${order.total} slantar</strong></p>`,
  });
}

orderRouter.get("/", requireAdmin, async (req: AuthRequest, res: Response) => {
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select("*, profiles(email), order_items(*, products(name))")
    .order("created_at", { ascending: false });
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

orderRouter.get("/mine", async (req: AuthRequest, res: Response) => {
  const sb = supabaseForUser(req.token!);
  const { data, error } = await sb
    .from("orders")
    .select("*, order_items(*, products(name))")
    .eq("user_id", req.user!.id);
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

orderRouter.patch("/:id/status", requireAdmin, async (req: AuthRequest, res: Response) => {
  const { status } = req.body;
  const { data, error } = await supabaseAdmin
    .from("orders")
    .update({ status })
    .eq("id", req.params.id)
    .select()
    .single();
  if (error) return res.status(500).json({ error: error.message });
  res.json(data);
});

export default orderRouter;