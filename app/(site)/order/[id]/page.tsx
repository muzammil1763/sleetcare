"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useAppStore } from "@/store/AppStore";
import { Button } from "@/components/ui/button";
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
    // Fetch order details from API
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { 
        if (data.id) setOrder(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return (
      <div className="container pt-40 text-center">
        <div className="w-8 h-8 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="container pt-40 text-center">
        <p className="text-muted-foreground">Order not found</p>
        <Link href="/" className="mt-4 inline-block">
          <Button variant="hero">Return home</Button>
        </Link>
      </div>
    );
  }

  const totalItems = order.orderItems.reduce((sum, item) => sum + item.qty, 0);

  return (
    <div className="container pt-28 pb-20 max-w-3xl">
      {/* Success Header */}
      <div className="text-center mb-8">
        <div className="w-16 h-16 mx-auto rounded-full bg-primary/15 flex items-center justify-center animate-pulse-glow">
          <CheckCircle2 className="w-8 h-8 text-primary" />
        </div>
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mt-6">Order placed</h1>
        <p className="text-muted-foreground mt-3">Thank you for your order! A confirmation has been sent to your email.</p>
      </div>

      {/* Order Summary */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Order ID</span>
            <span className="text-primary">{order.id.slice(-8).toUpperCase()}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Customer</span>
            <span>{order.customer}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Email</span>
            <span>{order.email}</span>
          </div>
          {order.phone && (
            <div className="flex justify-between border-b border-border pb-3">
              <span className="text-muted-foreground">Phone</span>
              <span>{order.phone}</span>
            </div>
          )}
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Status</span>
            <span className="chip text-xs bg-highlight/10 text-highlight border-highlight/20">{order.status}</span>
          </div>
          <div className="flex justify-between border-b border-border pb-3">
            <span className="text-muted-foreground">Total Items</span>
            <span>{totalItems}</span>
          </div>
        </div>
      </div>

      {/* Order Items */}
      <div className="glass-card p-6 mb-6">
        <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <Package className="w-5 h-5" />
          Order Items
        </h2>
        <div className="space-y-4">
          {order.orderItems.map((item) => (
            <div key={item.id} className="flex gap-4 pb-4 border-b border-border last:border-0 last:pb-0">
              {/* Product Image */}
              <div className="w-20 h-20 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <Package className="w-8 h-8 text-muted-foreground" />
                )}
              </div>
              
              {/* Product Details */}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm mb-1">{item.product.name}</h3>
                <p className="text-xs text-muted-foreground mb-2">
                  <span className="chip text-[10px]">{item.product.category}</span>
                </p>
                <div className="flex items-center gap-4 text-sm">
                  <span className="text-muted-foreground">Qty: <span className="font-mono font-semibold text-foreground">{item.qty}</span></span>
                  <span className="text-muted-foreground">Price: <span className="font-mono font-semibold text-foreground">Rs. {item.price.toLocaleString("en-PK")}</span></span>
                </div>
              </div>
              
              {/* Item Total */}
              <div className="text-right shrink-0">
                <div className="text-xs text-muted-foreground mb-1">Subtotal</div>
                <div className="font-mono font-semibold">Rs. {(item.price * item.qty).toLocaleString("en-PK")}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Shipping Address */}
      {order.shippingAddress && (
        <div className="glass-card p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
          <div className="text-sm space-y-1">
            <p>{order.shippingAddress.address}</p>
            <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
            <p>{order.shippingAddress.country}</p>
            {order.shippingAddress.phone && (
              <p className="text-muted-foreground mt-2">Phone: {order.shippingAddress.phone}</p>
            )}
          </div>
        </div>
      )}

      {/* Order Total */}
      <div className="glass-card p-6 mb-8">
        <div className="flex justify-between items-center">
          <span className="text-lg font-semibold">Order Total</span>
          <span className="text-2xl font-bold font-mono text-primary">Rs. {order.total.toLocaleString("en-PK")}</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 justify-center">
        <Link href="/products">
          <Button variant="outline" size="lg">Continue shopping</Button>
        </Link>
        <Link href="/">
          <Button variant="hero" size="lg">Return home</Button>
        </Link>
      </div>
    </div>
  );
}
