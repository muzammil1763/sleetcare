"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { CheckCircle2, Package, Upload, X, Loader2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "@/hooks/use-toast";

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
  paymentMethod?: string;
  paymentScreenshot?: string;
  orderItems: OrderItem[];
  shippingAddress?: {
    address?: string;
    city?: string;
    zip?: string;
    country?: string;
    phone?: string;
    deliveryCharges?: number;
  };
};

export default function OrderConfirmation() {
  const params = useParams();
  const id = params.id as string;
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetch(`/api/orders/${id}`)
      .then((r) => r.json())
      .then((data) => { if (data.id) setOrder(data); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !order) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image.", variant: "destructive" });
      return;
    }
    setUploading(true);
    try {
      let screenshotUrl = "";

      // Try Cloudinary first
      try {
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "sleetcare_payments");
        const res = await fetch("https://api.cloudinary.com/v1_1/dsleetcare/image/upload", {
          method: "POST", body: formData,
        });
        if (res.ok) {
          const data = await res.json();
          screenshotUrl = data.secure_url;
        }
      } catch {}

      // Fallback to base64
      if (!screenshotUrl) {
        screenshotUrl = await new Promise<string>((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve(ev.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      // Save to order
      const res = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ paymentScreenshot: screenshotUrl }),
      });
      if (!res.ok) throw new Error("Failed to save screenshot");
      setOrder((prev) => prev ? { ...prev, paymentScreenshot: screenshotUrl } : prev);
      toast({ title: "Screenshot updated", description: "Payment proof saved successfully." });
    } catch (e: any) {
      toast({ title: "Upload failed", description: e.message, variant: "destructive" });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

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
  const deliveryCharges = order.shippingAddress?.deliveryCharges;
  const subtotal = order.orderItems.reduce((sum, item) => sum + item.price * item.qty, 0);

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
              { label: "Payment",   value: order.paymentMethod === "bank" ? "Bank Transfer" : "Cash on Delivery" },
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
              {order.shippingAddress.address && <p>{order.shippingAddress.address}</p>}
              <p>
                {order.shippingAddress.city}
                {order.shippingAddress.zip ? `, ${order.shippingAddress.zip}` : ""}
              </p>
              {order.shippingAddress.country && <p>{order.shippingAddress.country}</p>}
              {order.shippingAddress.phone && (
                <p className="mt-2">Phone: {order.shippingAddress.phone}</p>
              )}
            </div>
          </div>
        )}

        {/* Payment Proof — bank transfer only */}
        {order.paymentMethod === "bank" && (
          <div className="bg-white border border-[#dde2f0] p-6 mb-5">
            <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-4">Payment Proof</p>

            {order.paymentScreenshot ? (
              <div className="space-y-3">
                <img
                  src={order.paymentScreenshot}
                  alt="Payment proof"
                  className="w-full max-h-72 object-contain border border-[#dde2f0] bg-[#f7f8fc]"
                />
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs font-medium text-emerald-600">
                    <CheckCircle2 className="w-4 h-4" />
                    Screenshot uploaded
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={uploading}
                    className="flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.15em] text-[#2d3a8c] border border-[#dde2f0] px-3 py-1.5 hover:border-[#1e2a5e] transition-colors disabled:opacity-50"
                  >
                    {uploading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                    {uploading ? "Uploading…" : "Re-upload"}
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="p-4 bg-amber-50 border border-amber-200">
                  <p className="text-xs font-medium text-amber-700">⚠ No payment screenshot uploaded yet</p>
                  <p className="text-xs font-light text-amber-600 mt-1">Please upload your payment confirmation to avoid delays.</p>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex flex-col items-center gap-2 py-6 bg-[#eef0f8] border border-dashed border-[#8fa0d8] hover:border-[#1e2a5e] transition-colors disabled:opacity-50"
                >
                  {uploading
                    ? <Loader2 className="w-7 h-7 text-[#2d3a8c] animate-spin" />
                    : <Upload className="w-7 h-7 text-[#2d3a8c]" />
                  }
                  <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#2d3a8c]">
                    {uploading ? "Uploading…" : "Upload Payment Screenshot"}
                  </span>
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleScreenshotUpload}
              className="hidden"
            />
          </div>
        )}

        {/* Order Total — with breakdown */}
        <div className="bg-[#1e2a5e] p-6 mb-8">
          {deliveryCharges != null && (
            <div className="space-y-2 mb-4 pb-4 border-b border-[#2d3a8c]">
              <div className="flex justify-between text-sm">
                <span className="font-light text-[#c8d0f0]">Products subtotal</span>
                <span className="font-medium text-white">Rs. {subtotal.toLocaleString("en-PK")}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="font-light text-[#c8d0f0]">Delivery charges</span>
                <span className="font-medium text-white">
                  {deliveryCharges === 0 ? "Free" : `Rs. ${deliveryCharges.toLocaleString("en-PK")}`}
                </span>
              </div>
            </div>
          )}
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
