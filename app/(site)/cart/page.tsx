"use client";

import Link from "next/link";
import { useAppStore } from "@/store/AppStore";
import { Package, Minus, Plus, Trash2, ArrowRight, ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

const LOCAL_IMGS = ["/img1.png", "/img2.png", "/img3.png"];

export default function Cart() {
  const { cart, products, updateCartQty, removeFromCart } = useAppStore();
  const [deliveryCharges, setDeliveryCharges] = useState(250);
  const router = useRouter();

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { if (d?.delivery_charges) setDeliveryCharges(Number(d.delivery_charges)); })
      .catch(() => {});
  }, []);

  const items = cart
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId)! }))
    .filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);
  const total = subtotal + deliveryCharges;

  if (items.length === 0) {
    return (
      <div className="container pt-28 pb-16 text-center px-4">
        <div className="w-16 h-16 mx-auto border border-[#dde2f0] flex items-center justify-center mb-6">
          <ShoppingCart className="w-7 h-7 text-[#8fa0d8]" />
        </div>
        <h1 className="font-display text-3xl text-[#1e2a5e]">Your cart is empty</h1>
        <p className="text-sm font-light text-[#5a6380] mt-2">Browse our collection to add items.</p>
        <Link href="/shop">
          <button className="mt-8 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#2d3a8c] transition-colors">
            View Collection
          </button>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <div className="container pt-8 pb-16 px-4 md:px-6">
        <h1 className="font-display text-2xl md:text-4xl text-[#1e2a5e] mb-6 md:mb-10">Your Cart</h1>

        <div className="flex flex-col lg:grid lg:grid-cols-3 gap-6 lg:gap-8">

          {/* ── Items ── */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ product, qty }, idx) => {
              const fallbackImg = LOCAL_IMGS[idx % 3];
              return (
                <div key={product.id} className="bg-white border border-[#dde2f0] p-3 sm:p-4">

                  {/* Mobile layout */}
                  <div className="flex gap-3">
                    {/* Image */}
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-[#dde8f8] shrink-0 overflow-hidden">
                      <img
                        src={product.image || fallbackImg}
                        alt={product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    {/* Info + controls */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/products/${product.id}`}
                          className="text-sm font-medium text-[#1e2a5e] hover:text-[#2d3a8c] transition line-clamp-2 leading-snug"
                        >
                          {product.name}
                        </Link>
                        {/* Remove — mobile top right */}
                        <button
                          onClick={() => removeFromCart(product.id)}
                          className="p-1 text-[#8fa0d8] hover:text-red-400 transition-colors shrink-0"
                          aria-label="Remove"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] font-light text-[#5a6380] mt-0.5">
                        {product.category} · Rs. {product.price.toLocaleString("en-PK")} each
                      </div>

                      {/* Qty + line total row */}
                      <div className="flex items-center justify-between mt-2.5">
                        <div className="flex items-center border border-[#dde2f0]">
                          <button
                            className="p-1.5 hover:bg-[#eef0f8] transition-colors"
                            onClick={() => updateCartQty(product.id, qty - 1)}
                          >
                            <Minus className="w-3 h-3 text-[#5a6380]" />
                          </button>
                          <span className="px-2 w-8 text-center text-sm font-medium text-[#1e2a5e]">{qty}</span>
                          <button
                            className="p-1.5 hover:bg-[#eef0f8] transition-colors"
                            onClick={() => updateCartQty(product.id, qty + 1)}
                          >
                            <Plus className="w-3 h-3 text-[#5a6380]" />
                          </button>
                        </div>
                        <span className="text-sm font-semibold text-[#1e2a5e]">
                          Rs. {(product.price * qty).toLocaleString("en-PK")}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* ── Order Summary ── */}
          <aside>
            <div className="bg-white border border-[#dde2f0] p-5 lg:sticky lg:top-28">
              <h3 className="font-display text-xl text-[#1e2a5e] mb-5">Order Summary</h3>

              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#5a6380] font-light">Subtotal</dt>
                  <dd className="font-medium text-[#1e2a5e]">Rs. {subtotal.toLocaleString("en-PK")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5a6380] font-light">Delivery</dt>
                  <dd className={`font-medium ${deliveryCharges === 0 ? "text-emerald-600" : "text-[#1e2a5e]"}`}>
                    {deliveryCharges === 0 ? "Free" : `Rs. ${deliveryCharges.toLocaleString("en-PK")}`}
                  </dd>
                </div>
              </dl>

              <div className="border-t border-[#dde2f0] mt-4 pt-4 flex justify-between items-baseline mb-5">
                <span className="text-sm text-[#5a6380]">Total</span>
                <span className="text-2xl font-bold text-[#1e2a5e]" style={{ fontFamily: "Jost, system-ui, sans-serif" }}>
                  Rs. {total.toLocaleString("en-PK")}
                </span>
              </div>

              <Link href="/guest-checkout">
                <button
                  className="w-full h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] transition-colors flex items-center justify-center gap-2">
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link href="/shop">
                <button className="w-full mt-2.5 h-9 text-[11px] font-light text-[#8fa0d8] hover:text-[#5a6380] transition-colors">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}
