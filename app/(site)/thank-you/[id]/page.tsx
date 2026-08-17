"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { CheckCircle2, Package, Loader2, ArrowRight, Home, ShoppingBag } from "lucide-react";
import { trackPurchase } from "@/lib/meta-pixel";

type OrderItem = {
  id: string;
  qty: number;
  price: number;
  product: {
    id: string;
    name: string;
    image?: string;
    category: string;
  };
};

type OrderDetail = {
  id: string;
  customer: string;
  email: string;
  phone?: string;
  total: number;
  status: string;
  paymentMethod?: string;
  orderItems: OrderItem[];
  shippingAddress?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    deliveryCharges?: number;
  };
};

export default function ThankYou() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const purchaseFiredRef = useRef(false);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then(r => r.json())
      .then(data => {
        if (data.id) {
          setOrder(data);
          // Fire Purchase pixel once — sessionStorage guard in trackPurchase prevents double-fire
          if (!purchaseFiredRef.current) {
            purchaseFiredRef.current = true;
            trackPurchase({
              id: data.id,
              total: data.total,
              itemIds: (data.orderItems || []).map((i: { product: { id: string } }) => i.product.id),
            });
          }
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#8fa0d8]" />
      </div>
    );
  }

  const subtotal = order?.orderItems.reduce((s, i) => s + i.price * i.qty, 0) ?? 0;
  const delivery = order?.shippingAddress?.deliveryCharges ?? (order && order.total > subtotal ? order.total - subtotal : 0);
  const shortId = order?.id.slice(-8).toUpperCase() ?? "";

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <div className="container pt-16 pb-20 max-w-2xl px-4">

        {/* ── Success mark ── */}
        <div className="text-center mb-12">
          <div className="relative inline-flex mb-8">
            <div className="w-20 h-20 bg-[#1e2a5e] flex items-center justify-center">
              <CheckCircle2 className="w-10 h-10 text-white" />
            </div>
            {/* Decorative corner dots */}
            <div className="absolute -top-2 -right-2 w-4 h-4 bg-[#8fa0d8]" />
            <div className="absolute -bottom-2 -left-2 w-3 h-3 bg-[#dde2f0]" />
          </div>

          <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#2d3a8c] mb-3">
            Order Confirmed
          </p>
          <h1
            className="text-[#1e2a5e] mb-4"
            style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "clamp(32px,6vw,48px)", fontWeight: 400, lineHeight: 1.1 }}
          >
            Thank you{order?.customer ? `,\u00a0${order.customer.split(" ")[0]}` : ""}!
          </h1>
          <p className="text-sm font-light text-[#5a6380] leading-relaxed max-w-sm mx-auto">
            Your order has been placed successfully. We&rsquo;ll send a confirmation to{" "}
            <span className="font-medium text-[#1e2a5e]">{order?.email}</span>.
          </p>
        </div>

        {/* ── Order ID banner ── */}
        <div className="bg-white border border-[#dde2f0] p-4 mb-6 flex items-center justify-between gap-4">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#8fa0d8] mb-0.5">Order Reference</p>
            <p className="text-lg font-mono font-semibold text-[#1e2a5e]">#{shortId}</p>
          </div>
          <div className="text-right">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#8fa0d8] mb-0.5">Payment</p>
            <p className="text-sm font-medium text-[#1e2a5e]">
              {order?.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery"}
            </p>
          </div>
        </div>

        {/* ── Items ── */}
        {order && order.orderItems.length > 0 && (
          <div className="bg-white border border-[#dde2f0] mb-6">
            <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#5a6380] px-5 pt-5 pb-3 border-b border-[#dde2f0]">
              Items Ordered
            </p>
            <div className="divide-y divide-[#dde2f0]">
              {order.orderItems.map(item => (
                <div key={item.id} className="flex items-center gap-4 px-5 py-4">
                  <div className="w-14 h-14 bg-[#dde8f8] shrink-0 overflow-hidden">
                    {item.product.image
                      ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                      : <Package className="w-6 h-6 text-[#8fa0d8] m-auto mt-4" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-[#1e2a5e] truncate">{item.product.name}</p>
                    <p className="text-[10px] font-light text-[#8fa0d8] uppercase tracking-[0.1em]">{item.product.category}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <p className="text-sm font-medium text-[#1e2a5e]">Rs. {(item.price * item.qty).toLocaleString("en-PK")}</p>
                    <p className="text-[10px] font-light text-[#8fa0d8]">Qty {item.qty}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Total */}
            <div className="border-t border-[#dde2f0] px-5 py-4 space-y-1.5">
              <div className="flex justify-between text-xs font-light text-[#5a6380]">
                <span>Subtotal</span>
                <span>Rs. {subtotal.toLocaleString("en-PK")}</span>
              </div>
              <div className="flex justify-between text-xs font-light text-[#5a6380]">
                <span>Delivery</span>
                <span>{delivery === 0 ? "Free" : `Rs. ${delivery.toLocaleString("en-PK")}`}</span>
              </div>
              <div className="flex justify-between text-sm font-semibold text-[#1e2a5e] pt-1.5 border-t border-[#dde2f0]">
                <span>Total</span>
                <span>Rs. {order.total.toLocaleString("en-PK")}</span>
              </div>
            </div>
          </div>
        )}

        {/* ── What's next ── */}
        <div className="bg-white border border-[#dde2f0] p-5 mb-8">
          <p className="text-[9px] font-medium uppercase tracking-[0.25em] text-[#5a6380] mb-4">What Happens Next</p>
          <div className="space-y-3">
            {[
              { step: "01", text: order?.paymentMethod === "bank" ? "We verify your payment and confirm within a few hours." : "Our team processes your order right away." },
              { step: "02", text: "Your order is carefully packed and dispatched within 1–2 business days." },
              { step: "03", text: "Delivery typically takes 3–5 business days depending on your city." },
            ].map(({ step, text }) => (
              <div key={step} className="flex items-start gap-4">
                <span className="text-[10px] font-mono font-semibold text-[#2d3a8c] bg-[#eef0f8] px-2 py-1 shrink-0">{step}</span>
                <p className="text-xs font-light text-[#5a6380] leading-relaxed pt-0.5">{text}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Actions ── */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/shop" className="flex-1">
            <button className="w-full h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] transition-colors flex items-center justify-center gap-2">
              <ShoppingBag className="w-4 h-4" /> Continue Shopping
            </button>
          </Link>
          <Link href={`/order/${id}`} className="flex-1">
            <button className="w-full h-12 border border-[#dde2f0] text-[#5a6380] text-[11px] font-medium uppercase tracking-[0.2em] hover:border-[#1e2a5e] hover:text-[#1e2a5e] transition-colors flex items-center justify-center gap-2">
              View Order Details <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>

        <div className="text-center mt-8">
          <Link href="/" className="inline-flex items-center gap-1.5 text-[10px] font-light text-[#8fa0d8] hover:text-[#5a6380] transition-colors uppercase tracking-[0.15em]">
            <Home className="w-3 h-3" /> Back to Home
          </Link>
        </div>

      </div>
    </div>
  );
}
