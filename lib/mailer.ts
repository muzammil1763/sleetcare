import { createTransport } from "nodemailer";

const BRAND = "Sleet Care";
const ACCENT = "#1e2a5e";
const LIGHT = "#eef0f8";
const MUTED = "#5a6380";
const BORDER = "#dde2f0";

function fmt(n: number | undefined | null): string {
  return "Rs. " + Number(n ?? 0).toLocaleString("en-US");
}

function getTransporter() {
  return createTransport({
    host: process.env.SMTP_HOST || "smtp.gmail.com",
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
}

// ─── Status label (text only, no links) ──────────────────────────────────────
function statusLabel(status: string): string {
  const map: Record<string, { bg: string; color: string; label: string }> = {
    Pending:    { bg: "#fef9ec", color: "#b45309", label: "Pending"    },
    Processing: { bg: "#eff6ff", color: "#1d4ed8", label: "Processing" },
    Shipped:    { bg: "#f5f3ff", color: "#6d28d9", label: "Shipped"    },
    Delivered:  { bg: "#f0fdf4", color: "#15803d", label: "Delivered"  },
    Cancelled:  { bg: "#fef2f2", color: "#b91c1c", label: "Cancelled"  },
  };
  const s = map[status] ?? { bg: "#f9fafb", color: "#374151", label: status };
  return `<span style="display:inline-block;padding:5px 14px;background:${s.bg};color:${s.color};font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;border-radius:2px;">${s.label}</span>`;
}

// ─── Status description ───────────────────────────────────────────────────────
function statusMessage(status: string): string {
  const map: Record<string, string> = {
    Pending:    "We have received your order and it is awaiting confirmation.",
    Processing: "Your order is being prepared and will be dispatched soon.",
    Shipped:    "Your order has been handed to our delivery partner and is on its way.",
    Delivered:  "Your order has been delivered. Thank you for shopping with Sleet Care!",
    Cancelled:  "Your order has been cancelled. For any queries, please contact our support.",
  };
  return map[status] ?? "Your order status has been updated.";
}

// ─── Items table ─────────────────────────────────────────────────────────────
function itemsTable(items: { name: string; qty: number; price: number }[]): string {
  const rows = items.map(i => `
    <tr>
      <td style="padding:10px 0;border-bottom:1px solid #f0f4fa;font-size:13px;color:${ACCENT};">${i.name}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f4fa;font-size:13px;color:${MUTED};text-align:center;">x${i.qty}</td>
      <td style="padding:10px 0;border-bottom:1px solid #f0f4fa;font-size:13px;color:${ACCENT};text-align:right;font-weight:600;">${fmt(i.price * i.qty)}</td>
    </tr>`).join("");

  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin:16px 0 0;">
      <thead>
        <tr style="border-bottom:2px solid ${BORDER};">
          <th style="text-align:left;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;padding-bottom:8px;font-weight:600;">Item</th>
          <th style="text-align:center;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;padding-bottom:8px;font-weight:600;">Qty</th>
          <th style="text-align:right;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;padding-bottom:8px;font-weight:600;">Amount</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

// ─── Price breakdown ──────────────────────────────────────────────────────────
function priceBreakdown(subtotal: number, deliveryCharges: number, total: number): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0" style="margin-top:4px;">
      <tr>
        <td style="font-size:13px;color:${MUTED};padding:5px 0;">Products subtotal</td>
        <td style="font-size:13px;color:${ACCENT};text-align:right;padding:5px 0;">${fmt(subtotal)}</td>
      </tr>
      <tr>
        <td style="font-size:13px;color:${MUTED};padding:5px 0;">Delivery charges</td>
        <td style="font-size:13px;color:${ACCENT};text-align:right;padding:5px 0;">${deliveryCharges === 0 ? "Free" : fmt(deliveryCharges)}</td>
      </tr>
      <tr style="border-top:2px solid ${BORDER};">
        <td style="font-size:15px;font-weight:700;color:${ACCENT};padding:10px 0 4px;">Order Total</td>
        <td style="font-size:15px;font-weight:700;color:${ACCENT};text-align:right;padding:10px 0 4px;">${fmt(total)}</td>
      </tr>
    </table>`;
}

// ─── Base HTML wrapper ────────────────────────────────────────────────────────
function baseTemplate(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width,initial-scale=1" />
  <title>${BRAND}</title>
</head>
<body style="margin:0;padding:0;background:#f4f6fb;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f4f6fb;padding:32px 16px;">
    <tr><td align="center">
      <table width="560" cellpadding="0" cellspacing="0" style="max-width:560px;width:100%;">

        <!-- Brand header -->
        <tr>
          <td style="background:${ACCENT};padding:28px 36px;text-align:center;">
            <p style="margin:0;font-size:20px;font-weight:400;letter-spacing:5px;text-transform:uppercase;color:#ffffff;">${BRAND}</p>
            <p style="margin:6px 0 0;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#8fa0d8;">100% Natural Skincare</p>
          </td>
        </tr>

        <!-- Body -->
        <tr>
          <td style="background:#ffffff;padding:36px;border-left:1px solid ${BORDER};border-right:1px solid ${BORDER};border-bottom:1px solid ${BORDER};">
            ${content}
          </td>
        </tr>

        <!-- Footer -->
        <tr>
          <td style="padding:20px 36px;text-align:center;">
            <p style="margin:0;font-size:11px;color:#aab0c0;">© ${new Date().getFullYear()} ${BRAND}. All rights reserved.</p>
            <p style="margin:6px 0 0;font-size:11px;color:#aab0c0;">Faisalabad, Punjab, Pakistan &nbsp;|&nbsp; hello@sleetcare.com &nbsp;|&nbsp; +92 300 8662833</p>
            <p style="margin:8px 0 0;font-size:10px;color:#c8ccd8;">You are receiving this email because you placed an order on Sleet Care.</p>
          </td>
        </tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`;
}

// ─── Public interface ─────────────────────────────────────────────────────────
export interface OrderEmailData {
  orderId: string;
  customerName: string;
  customerEmail: string;
  status: string;
  items: { name: string; qty: number; price: number }[];
  subtotal: number;
  deliveryCharges: number;
  total: number;
  paymentMethod: string;
  shippingAddress?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    phone?: string;
  };
  isGuest?: boolean;
}

// ─── Order Confirmation ───────────────────────────────────────────────────────
export async function sendOrderConfirmationEmail(data: OrderEmailData) {
  const shortId = data.orderId.slice(-8).toUpperCase();
  const payment = data.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery";

  const addressLines = data.shippingAddress
    ? [
        data.shippingAddress.address,
        [data.shippingAddress.city, data.shippingAddress.zip].filter(Boolean).join(", "),
        data.shippingAddress.country,
        data.shippingAddress.phone ? "Phone: " + data.shippingAddress.phone : "",
      ].filter(Boolean).join("<br>")
    : null;

  const content = `
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#2d3a8c;font-weight:700;">Order Confirmed</p>
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:400;color:${ACCENT};">Thank you, ${data.customerName}!</h1>
    <p style="font-size:14px;color:${MUTED};line-height:1.7;margin:0 0 28px;">
      Your order has been received and is now ${data.paymentMethod === "bank" ? "awaiting payment verification" : "being prepared for delivery"}.
    </p>

    <!-- Order info box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT};border:1px solid ${BORDER};margin-bottom:28px;">
      <tr>
        <td style="padding:16px 20px;border-right:1px solid ${BORDER};">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;">Order ID</p>
          <p style="margin:0;font-size:14px;font-weight:700;color:${ACCENT};">#${shortId}</p>
        </td>
        <td style="padding:16px 20px;border-right:1px solid ${BORDER};">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;">Status</p>
          <p style="margin:0;">${statusLabel(data.status)}</p>
        </td>
        <td style="padding:16px 20px;">
          <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;">Payment</p>
          <p style="margin:0;font-size:13px;color:${ACCENT};">${payment}</p>
        </td>
      </tr>
    </table>

    <!-- Items -->
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;font-weight:600;">Order Items</p>
    ${itemsTable(data.items)}

    <!-- Price breakdown -->
    <div style="margin-top:20px;padding-top:4px;">
      ${priceBreakdown(data.subtotal, data.deliveryCharges, data.total)}
    </div>

    ${addressLines ? `
    <!-- Shipping address -->
    <div style="margin-top:28px;padding:16px 20px;background:${LIGHT};border:1px solid ${BORDER};">
      <p style="margin:0 0 8px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;font-weight:600;">Shipping Address</p>
      <p style="margin:0;font-size:13px;color:${MUTED};line-height:1.7;">${addressLines}</p>
    </div>` : ""}

    ${data.paymentMethod === "bank" ? `
    <div style="margin-top:24px;padding:14px 20px;background:#fffbeb;border:1px solid #fde68a;">
      <p style="margin:0;font-size:13px;color:#92400e;line-height:1.6;">
        <strong>Action required:</strong> Please send your payment to the bank details provided during checkout and upload your payment screenshot on the order tracking page.
      </p>
    </div>` : ""}

    <p style="margin:32px 0 0;font-size:13px;color:${MUTED};line-height:1.7;">
      For any questions about your order, reply to this email or contact us at <strong>hello@sleetcare.com</strong> or call <strong>+92 300 8662833</strong>.
    </p>
  `;

  await getTransporter().sendMail({
    from: `"Sleet Care Orders" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Your Sleet Care order #${shortId} is confirmed`,
    html: baseTemplate(content),
    text: `Hi ${data.customerName}, your order #${shortId} has been confirmed. Total: ${fmt(data.total)}. Payment: ${payment}. For support email hello@sleetcare.com`,
  });
}

// ─── Status Update ────────────────────────────────────────────────────────────
export async function sendOrderStatusEmail(data: OrderEmailData) {
  const shortId = data.orderId.slice(-8).toUpperCase();

  const content = `
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:3px;text-transform:uppercase;color:#2d3a8c;font-weight:700;">Order Update</p>
    <h1 style="margin:0 0 20px;font-size:24px;font-weight:400;color:${ACCENT};">Hi ${data.customerName},</h1>
    <p style="font-size:14px;color:${MUTED};line-height:1.7;margin:0 0 28px;">
      There is an update on your order <strong>#${shortId}</strong>.
    </p>

    <!-- Status box -->
    <table width="100%" cellpadding="0" cellspacing="0" style="background:${LIGHT};border:1px solid ${BORDER};margin-bottom:28px;">
      <tr>
        <td style="padding:20px;text-align:center;">
          <p style="margin:0 0 10px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;">Current Status</p>
          ${statusLabel(data.status)}
          <p style="margin:16px 0 0;font-size:14px;color:${MUTED};line-height:1.7;">${statusMessage(data.status)}</p>
        </td>
      </tr>
    </table>

    <!-- Items -->
    <p style="margin:0 0 4px;font-size:10px;letter-spacing:2px;text-transform:uppercase;color:#8fa0d8;font-weight:600;">Your Items</p>
    ${itemsTable(data.items)}

    <!-- Price breakdown -->
    <div style="margin-top:20px;padding-top:4px;">
      ${priceBreakdown(data.subtotal, data.deliveryCharges, data.total)}
    </div>

    <p style="margin:32px 0 0;font-size:13px;color:${MUTED};line-height:1.7;">
      For any questions, reply to this email or contact us at <strong>hello@sleetcare.com</strong> or call <strong>+92 300 8662833</strong>.
    </p>
  `;

  await getTransporter().sendMail({
    from: `"Sleet Care Orders" <${process.env.SMTP_USER}>`,
    to: data.customerEmail,
    subject: `Order #${shortId} status: ${data.status}`,
    html: baseTemplate(content),
    text: `Hi ${data.customerName}, your order #${shortId} status is now: ${data.status}. ${statusMessage(data.status)} Total: ${fmt(data.total)}. For support email hello@sleetcare.com`,
  });
}
