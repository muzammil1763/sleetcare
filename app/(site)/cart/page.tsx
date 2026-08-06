"use client";

import Link from "next/link";
import { useAppStore } from "@/store/AppStore";
import { productIcons } from "@/data/mock";
import { Button } from "@/components/ui/button";
import { Package, Minus, Plus, Trash2, ArrowRight, ShoppingCart } from "lucide-react";

const LOCAL_IMGS = ["/img1.png", "/img2.png", "/img3.png"];

export default function Cart() {
  const { cart, products, updateCartQty, removeFromCart } = useAppStore();
  const items = cart
    .map((i) => ({ ...i, product: products.find((p) => p.id === i.productId)! }))
    .filter((i) => i.product);
  const subtotal = items.reduce((s, i) => s + i.product.price * i.qty, 0);

  if (items.length === 0) {
    return (
      <div className="container pt-28 pb-16 text-center">
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
      <div className="container pt-10 pb-16">
        <h1 className="font-display text-3xl md:text-4xl text-[#1e2a5e] mb-10">Your Cart</h1>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-3">
            {items.map(({ product, qty }, idx) => {
              const Icon = productIcons[product.icon] ?? Package;
              const fallbackImg = LOCAL_IMGS[idx % 3];
              return (
                <div key={product.id} className="bg-white border border-[#dde2f0] p-4 flex gap-4 items-center">
                  {/* Image */}
                  <div className="w-20 h-20 bg-[#dde8f8] shrink-0 overflow-hidden">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <img src={fallbackImg} alt={product.name} className="w-full h-full object-cover" />
                    )}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <Link
                      href={`/products/${product.id}`}
                      className="text-sm font-medium text-[#1e2a5e] hover:text-[#2d3a8c] transition truncate block"
                    >
                      {product.name}
                    </Link>
                    <div className="text-[11px] font-light text-[#5a6380] mt-1">
                      {product.category} · Rs. {product.price.toLocaleString("en-PK")} each
                    </div>
                  </div>

                  {/* Qty controls */}
                  <div className="flex items-center border border-[#dde2f0]">
                    <button
                      className="p-2 hover:bg-[#eef0f8] transition-colors"
                      onClick={() => updateCartQty(product.id, qty - 1)}
                    >
                      <Minus className="w-3.5 h-3.5 text-[#5a6380]" />
                    </button>
                    <span className="px-3 w-10 text-center text-sm font-medium text-[#1e2a5e]">{qty}</span>
                    <button
                      className="p-2 hover:bg-[#eef0f8] transition-colors"
                      onClick={() => updateCartQty(product.id, qty + 1)}
                    >
                      <Plus className="w-3.5 h-3.5 text-[#5a6380]" />
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-sm font-medium text-[#1e2a5e] w-28 text-right">
                    Rs. {(product.price * qty).toLocaleString("en-PK")}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(product.id)}
                    className="p-2 text-[#8fa0d8] hover:text-red-400 transition-colors"
                    aria-label="Remove"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Order Summary */}
          <aside>
            <div className="bg-white border border-[#dde2f0] p-6 sticky top-28">
              <h3 className="font-display text-xl text-[#1e2a5e] mb-6">Order Summary</h3>
              <dl className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <dt className="text-[#5a6380] font-light">Subtotal</dt>
                  <dd className="font-medium text-[#1e2a5e]">Rs. {subtotal.toLocaleString("en-PK")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-[#5a6380] font-light">Shipping</dt>
                  <dd className="text-[#2d3a8c] font-medium">
                    {subtotal >= 5000 ? "Free" : "Rs. 250"}
                  </dd>
                </div>
              </dl>
              <div className="border-t border-[#dde2f0] mt-5 pt-5 flex justify-between items-baseline">
                <span className="text-sm text-[#5a6380]">Total</span>
                <span className="font-display text-2xl text-[#1e2a5e]">
                  Rs. {(subtotal + (subtotal >= 5000 ? 0 : 250)).toLocaleString("en-PK")}
                </span>
              </div>
              {subtotal < 5000 && (
                <p className="text-[10px] font-light text-[#8fa0d8] mt-2 text-center">
                  Add Rs. {(5000 - subtotal).toLocaleString("en-PK")} more for free shipping
                </p>
              )}
              <Link href="/checkout">
                <button className="w-full mt-6 h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] transition-colors flex items-center justify-center gap-2">
                  Checkout <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
              <Link href="/shop">
                <button className="w-full mt-3 h-10 border border-[#dde2f0] text-[11px] font-medium uppercase tracking-[0.15em] text-[#5a6380] hover:border-[#1e2a5e] hover:text-[#1e2a5e] transition-colors">
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
