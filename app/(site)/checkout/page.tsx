"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/store/AppStore";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

export default function Checkout() {
  const { data: session, status } = useSession();
  const { cart, products, clearCart } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    phone: "", address: "", city: "", zip: "", country: "",
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login?callbackUrl=/checkout");
    }
  }, [status, router]);

  const subtotal = cart.reduce(
    (s, i) => s + (products.find((p) => p.id === i.productId)?.price ?? 0) * i.qty,
    0
  );
  const total = subtotal;

  if (status === "loading") {
    return (
      <div className="container pt-40 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  if (!session) {
    return null;
  }

  if (cart.length === 0) {
    if (typeof window !== "undefined") router.push("/cart");
    return null;
  }

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: session.user?.name || "Customer",
          email: session.user?.email,
          phone: form.phone,
          items: cart,
          shippingAddress: form,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Failed to place order");
      }

      clearCart();
      toast({ title: "Order placed!", description: "Thank you for your order." });
      router.push(`/order/${data.id}`);
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  return (
    <div className="container pt-24 pb-12 max-w-5xl">
      <h1 className="text-3xl font-bold tracking-tight mb-8">Checkout</h1>
      <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <section className="glass-card p-6">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">Contact</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label>Full name</Label>
                <Input value={session.user?.name || ""} disabled className="mt-1.5" />
              </div>
              <div>
                <Label>Email</Label>
                <Input value={session.user?.email || ""} disabled className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label>Phone Number</Label>
                <Input required {...field("phone")} type="tel" placeholder="+1 (555) 000-0000" className="mt-1.5" />
              </div>
            </div>
          </section>

          <section className="glass-card p-6">
            <h2 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">Shipping</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <Label>Address</Label>
                <Input required {...field("address")} className="mt-1.5" />
              </div>
              <div>
                <Label>City</Label>
                <Input required {...field("city")} className="mt-1.5" />
              </div>
              <div>
                <Label>ZIP / Postal</Label>
                <Input required {...field("zip")} className="mt-1.5" />
              </div>
              <div className="sm:col-span-2">
                <Label>Country</Label>
                <Input required {...field("country")} className="mt-1.5" />
              </div>
            </div>
          </section>
        </div>

        <aside>
          <div className="glass-card p-6 sticky top-28">
            <h3 className="font-semibold mb-4">Summary</h3>
            <div className="space-y-2 max-h-64 overflow-auto pr-1">
              {cart.map((i) => {
                const p = products.find((x) => x.id === i.productId)!;
                return (
                  <div key={i.productId} className="flex justify-between text-sm">
                    <span className="truncate pr-2">
                      {p.name} <span className="text-muted-foreground">×{i.qty}</span>
                    </span>
                    <span className="font-mono">Rs. {(p.price * i.qty).toLocaleString("en-PK")}</span>                  </div>
                );
              })}
            </div>
            <div className="border-t border-border mt-4 pt-4 flex justify-between items-baseline">
              <span className="text-sm text-muted-foreground">Total</span>
              <span className="font-mono text-2xl font-semibold">Rs. {total.toLocaleString("en-PK")}</span>
            </div>
            <Button type="submit" variant="hero" size="lg" className="w-full mt-5" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  Processing...
                </>
              ) : (
                "Place order"
              )}
            </Button>
            <p className="text-xs text-muted-foreground text-center mt-4">
              By placing this order, you agree to our terms and conditions.
            </p>
          </div>
        </aside>
      </form>
    </div>
  );
}
