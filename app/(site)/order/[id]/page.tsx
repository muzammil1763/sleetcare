"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Package } from "lucide-react";
import { useEffect, useState } from "react";

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
  createdAt: string;
  orderItems: OrderItem[];
  shippingAddress?: {
    address: string;
    city: string;
    postalCode: string;
    country: string;
    phone?: string;
  };
};

export default function OrderConfirmation() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.id) setOrder(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#dde2f0] border-t-[#1e2a5e] rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center text-center">
        <div>
          <p className="text-sm font-light text-[#5a6380] mb-4">Order not found</p>
          <Link href="/">
            <button className="bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3 hover:bg-[#2d3a8c] transition-colors">
              Return Home
            </button>
          </Link>
        </div>
      </div>
    );
  }

  const totalItems = order.orderItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <div className="container pt-16 pb-20 max-w-3xl">

        {/* Success Header */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 mx-auto bg-[#1e2a5e] flex items-center justify-center mb-6">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
          <h1 className="font-display text-4xl text-[#1e2a5e] mb-3">Order Placed!</h1>
          <p className="text-sm font-light text-[#5a6380]">
            Thank you for your order. A confirmation has been sent to your email.
          </p>
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-[#dde2f0] p-6 mb-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-5">Order Summary</p>
          <div className="space-y-0">
            {[
              { label: "Order ID",  value: order.id.slice(-8).toUpperCase(), mono: true },
              { label: "Customer",  value: order.customer },
              { label: "Email",     value: order.email },
              ...(order.phone ? [{ label: "Phone", value: order.phone, mono: false }] : []),
              { label: "Status",    value: order.status },
              { label: "Items",     value: String(totalItems) },
            ].map((row, i, arr) => (
              <div key={row.label} className={`flex justify-between py-3 ${i < arr.length - 1 ? "border-b border-[#dde2f0]" : ""}`}>
                <span className="text-xs font-light text-[#5a6380]">{row.label}</span>
                <span className={`text-xs font-medium text-[#1e2a5e] ${row.mono ? "font-mono" : ""}`}>{row.value}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Order Items */}
        <div className="bg-white border border-[#dde2f0] p-6 mb-5">
          <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-5 flex items-center gap-2">
            <Package className="w-4 h-4" /> Order Items
          </p>
          <div className="space-y-4">
            {order.orderItems.map((item) => (
              <div key={item.id} className="flex gap-4 pb-4 border-b border-[#dde2f0] last:border-0 last:pb-0">
                <div className="w-16 h-16 bg-[#dde8f8] flex items-center justify-center overflow-hidden shrink-0">
                  {item.product.image
                    ? <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    : <Package className="w-6 h-6 text-[#8fa0d8]" />
                  }
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-medium text-[#1e2a5e] mb-1">{item.product.name}</h3>
                  <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-[#2d3a8c] mb-2">{item.product.category}</p>
                  <div className="flex items-center gap-4 text-xs font-light text-[#5a6380]">
                    <span>Qty: <span className="font-medium text-[#1e2a5e]">{item.qty}</span></span>
                    <span>Price: <span className="font-medium text-[#1e2a5e]">Rs. {item.price.toLocaleString("en-PK")}</span></span>
                  </div>
                </div>
                <div className="text-right shrink-0">
                  <p className="text-[10px] font-light text-[#5a6380] mb-1">Subtotal</p>
                  <p className="text-sm font-medium text-[#1e2a5e]">Rs. {(item.price * item.qty).toLocaleString("en-PK")}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shipping Address */}
        {order.shippingAddress && (
          <div className="bg-white border border-[#dde2f0] p-6 mb-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-4">Shipping Address</p>
            <div className="text-sm font-light text-[#5a6380] space-y-1">
              <p>{order.shippingAddress.address}</p>
              <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
              <p>{order.shippingAddress.country}</p>
              {order.shippingAddress.phone && (
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Order Total */}
        <div className="bg-[#1e2a5e] p-6 mb-8">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium uppercase tracking-[0.15em] text-[#c8d0f0]">Order Total</span>
            <span className="font-display text-3xl text-white">Rs. {order.total.toLocaleString("en-PK")}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 justify-center">
          <Link href="/shop">
            <button className="border border-[#dde2f0] text-[11px] font-medium uppercase tracking-[0.2em] text-[#5a6380] px-8 py-3.5 hover:border-[#1e2a5e] hover:text-[#1e2a5e] transition-colors">
              Continue Shopping
            </button>
          </Link>
          <Link href="/">
            <button className="bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#2d3a8c] transition-colors">
              Return Home
            </button>
          </Link>
        </div>

      </div>
    </div>
  );
}
