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