"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/AppStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Banknote, CreditCard, CheckCircle2, Upload, X } from "lucide-react";
import Link from "next/link";
import { trackInitiateCheckout } from "@/lib/meta-pixel";

type PaymentMethod = "cod" | "bank";

export default function GuestCheckout() {
  const { cart, products, clearCart } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(250);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [screenshot, setScreenshot] = useState("");
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [contact, setContact] = useState({ name: "", email: "" });
  const [form, setForm] = useState({ phone: "", address: "", city: "", zip: "", country: "Pakistan" });

  // Pakistani phone validation: 03XX-XXXXXXX or +923XX-XXXXXXX
  const formatPhone = (val: string) => {
    const digits = val.replace(/\D/g, "");
    if (digits.startsWith("92")) {
      const local = digits.slice(2);
      if (local.length <= 3) return "+92 " + local;
      if (local.length <= 10) return "+92 " + local.slice(0, 3) + " " + local.slice(3);
      return "+92 " + local.slice(0, 3) + " " + local.slice(3, 10);
    }
    if (digits.startsWith("0")) {
      if (digits.length <= 4) return digits;
      if (digits.length <= 11) return digits.slice(0, 4) + " " + digits.slice(4);
      return digits.slice(0, 4) + " " + digits.slice(4, 11);
    }
    return val;
  };

  const isValidPhone = (phone: string) => {
    const digits = phone.replace(/\D/g, "");
    return (digits.startsWith("92") && digits.length === 12) ||
           (digits.startsWith("0") && digits.length === 11);
  };

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { if (d?.delivery_charges) setDeliveryCharges(Number(d.delivery_charges)); })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (cart.length === 0 && typeof window !== "undefined") router.push("/cart");
  }, [cart, router]);

  const subtotal = cart.reduce((s, i) => s + (products.find(p => p.id === i.productId)?.price ?? 0) * i.qty, 0);
  const total = subtotal + deliveryCharges;

  // Fire InitiateCheckout once when cart + prices are ready
  const checkoutFiredRef = useRef(false);
  useEffect(() => {
    if (cart.length === 0 || subtotal === 0) return;
    if (checkoutFiredRef.current) return;
    checkoutFiredRef.current = true;
    trackInitiateCheckout({
      contentIds: cart.map(i => i.productId),
      value: subtotal + deliveryCharges,
      numItems: cart.reduce((n, i) => n + i.qty, 0),
    });
  }, [cart, subtotal, deliveryCharges]);

  const handleScreenshotUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast({ title: "Invalid file", description: "Please upload an image file.", variant: "destructive" });
      return;
    }
    setScreenshotUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "sleetcare_payments");
      const res = await fetch("https://api.cloudinary.com/v1_1/dsleetcare/image/upload", { method: "POST", body: formData });
      if (res.ok) {
        const data = await res.json();
        setScreenshot(data.secure_url);
        toast({ title: "Screenshot uploaded" });
      } else throw new Error();
    } catch {
      const reader = new FileReader();
      reader.onload = ev => setScreenshot(ev.target?.result as string);
      reader.readAsDataURL(file);
    } finally {
      setScreenshotUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!contact.name.trim() || !contact.email.trim()) {
      toast({ title: "Required", description: "Please enter your name and email.", variant: "destructive" });
      return;
    }
    if (!isValidPhone(form.phone)) {
      toast({ title: "Invalid phone", description: "Enter a valid Pakistani number e.g. 0300 1234567 or +92 300 1234567", variant: "destructive" });
      return;
    }
    if (paymentMethod === "bank" && !screenshot) {
      toast({ title: "Screenshot required", description: "Please upload your payment screenshot.", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: contact.name,
          email: contact.email,
          phone: form.phone,
          items: cart,
          shippingAddress: form,
          paymentMethod,
          paymentScreenshot: screenshot || null,
          deliveryCharges,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");
      clearCart();
      toast({ title: "Order placed!", description: "Check your email for confirmation." });
      router.push(`/order/${data.id}`);
    } catch (err: any) {
      toast({ title: "Order failed", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const cf = (key: keyof typeof contact) => ({
    value: contact[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setContact({ ...contact, [key]: e.target.value }),
  });
  const ff = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, [key]: e.target.value }),
  });

  if (cart.length === 0) return null;

  return (
    <div className="bg-[#f7f8fc] min-h-screen">
      <div className="container pt-10 pb-16 max-w-5xl">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">Checkout</h1>
        </div>

        {/* Login option banner */}
        <div className="bg-white border border-[#dde2f0] p-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <p className="text-sm font-medium text-[#1e2a5e]">Already have an account?</p>
            <p className="text-xs font-light text-[#5a6380]">Sign in for faster checkout and order tracking from your dashboard.</p>
          </div>
          <Link href="/login?callbackUrl=/checkout" className="shrink-0">
            <button className="h-9 px-6 border border-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.15em] text-[#1e2a5e] hover:bg-[#1e2a5e] hover:text-white transition-colors whitespace-nowrap">
              Sign In
            </button>
          </Link>
        </div>

        <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">

            {/* Contact — guest fills this in */}
            <div className="bg-white border border-[#dde2f0] p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-5">Contact</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Full Name</Label>
                  <Input required {...cf("name")} placeholder="Jane Doe"
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
                <div>
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Email Address</Label>
                  <Input required type="email" {...cf("email")} placeholder="jane@email.com"
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                  <p className="text-[10px] font-light text-[#8fa0d8] mt-1">Order confirmation will be sent here</p>
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Phone Number</Label>
                  <Input
                    required
                    value={form.phone}
                    onChange={e => setForm({ ...form, phone: formatPhone(e.target.value) })}
                    type="tel"
                    placeholder="0300 1234567"
                    maxLength={16}
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light"
                  />
                  <p className="text-[10px] font-light text-[#8fa0d8] mt-1">Format: 0300 1234567 or +92 300 1234567</p>
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-white border border-[#dde2f0] p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-5">Shipping Address</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Street Address</Label>
                  <Input required {...ff("address")} placeholder="House #, Street, Mohalla / Area"
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
                <div>
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">City</Label>
                  <Input required {...ff("city")} placeholder="e.g. Lahore, Karachi, Faisalabad"
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
                <div>
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">ZIP / Postal Code</Label>
                  <Input {...ff("zip")} placeholder="e.g. 54000"
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Country</Label>
                  <Input required {...ff("country")}
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-white border border-[#dde2f0] p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-5">Payment Method</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <button type="button" onClick={() => setPaymentMethod("cod")}
                  className={`relative flex items-start gap-4 p-5 border-2 text-left transition-all ${paymentMethod === "cod" ? "border-[#1e2a5e] bg-[#eef0f8]" : "border-[#dde2f0] hover:border-[#8fa0d8]"}`}>
                  <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${paymentMethod === "cod" ? "bg-[#1e2a5e]" : "bg-[#eef0f8]"}`}>
                    <Banknote className={`w-5 h-5 ${paymentMethod === "cod" ? "text-white" : "text-[#2d3a8c]"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1e2a5e] mb-1">Cash on Delivery</p>
                    <p className="text-xs font-light text-[#5a6380] leading-relaxed">Pay in cash when your order arrives.</p>
                  </div>
                  {paymentMethod === "cod" && <CheckCircle2 className="w-5 h-5 text-[#1e2a5e] absolute top-3 right-3" />}
                </button>

                <button type="button" onClick={() => setPaymentMethod("bank")}
                  className={`relative flex items-start gap-4 p-5 border-2 text-left transition-all ${paymentMethod === "bank" ? "border-[#1e2a5e] bg-[#eef0f8]" : "border-[#dde2f0] hover:border-[#8fa0d8]"}`}>
                  <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${paymentMethod === "bank" ? "bg-[#1e2a5e]" : "bg-[#eef0f8]"}`}>
                    <CreditCard className={`w-5 h-5 ${paymentMethod === "bank" ? "text-white" : "text-[#2d3a8c]"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1e2a5e] mb-1">Bank Transfer</p>
                    <p className="text-xs font-light text-[#5a6380] leading-relaxed">Transfer before dispatch. Details below.</p>
                  </div>
                  {paymentMethod === "bank" && <CheckCircle2 className="w-5 h-5 text-[#1e2a5e] absolute top-3 right-3" />}
                </button>
              </div>

              {paymentMethod === "cod" && (
                <div className="mt-4 p-4 bg-[#eef0f8] border border-[#dde2f0]">
                  <p className="text-xs font-light text-[#5a6380] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2d3a8c] shrink-0" />
                    Please keep exact change ready. Our delivery partner will collect payment at your door.
                  </p>
                </div>
              )}

              {paymentMethod === "bank" && (
                <div className="mt-4 space-y-4">
                  <div className="p-4 bg-[#eef0f8] border border-[#dde2f0] space-y-2">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-3">Payment Details</p>
                    {[
                      { label: "Bank",          value: "Meezan Bank Limited",            copy: false },
                      { label: "Branch",        value: "Tata Market Branch, Faisalabad",  copy: false },
                      { label: "Branch Code",   value: "0413",                            copy: false },
                      { label: "Account Title", value: "Muhammad Hanan Ajmal",            copy: false },
                      { label: "Account No.",   value: "0413 0105170552",                 copy: true  },
                      { label: "IBAN",          value: "PK17 MEZN 0004 1301 0517 0552",   copy: true  },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between items-center text-xs">
                        <span className="font-light text-[#5a6380]">{r.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-medium text-[#1e2a5e] ${r.copy ? "font-mono" : ""}`}>{r.value}</span>
                          {r.copy && (
                            <button type="button" onClick={() => navigator.clipboard.writeText(r.value)}
                              className="p-1 bg-[#1e2a5e] text-white hover:bg-[#2d3a8c] transition-colors">
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                              </svg>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className={`p-4 bg-white border-2 border-dashed transition-colors ${screenshot ? "border-emerald-400" : "border-[#dde2f0] hover:border-[#2d3a8c]"}`}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-1">
                      Upload Payment Screenshot <span className="text-red-500">*</span>
                    </p>
                    {screenshot ? (
                      <div className="relative mt-3">
                        <img src={screenshot} alt="Payment screenshot" className="w-full max-h-48 object-contain border border-[#dde2f0] bg-[#f7f8fc]" />
                        <button type="button" onClick={() => { setScreenshot(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white flex items-center justify-center hover:bg-red-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-600">Screenshot attached</span>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()} disabled={screenshotUploading}
                        className="w-full flex flex-col items-center gap-3 py-8 bg-[#eef0f8] hover:bg-[#dde2f0] transition-colors disabled:opacity-60 mt-3">
                        {screenshotUploading ? <Loader2 className="w-8 h-8 text-[#2d3a8c] animate-spin" /> : <Upload className="w-8 h-8 text-[#2d3a8c]" />}
                        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#2d3a8c]">
                          {screenshotUploading ? "Uploading…" : "Click to Upload Screenshot"}
                        </span>
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*" onChange={handleScreenshotUpload} className="hidden" />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <aside>
            <div className="bg-white border border-[#dde2f0] p-6 sticky top-28">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-5">Summary</p>
              <div className="space-y-3 max-h-64 overflow-auto mb-5">
                {cart.map((i) => {
                  const p = products.find(x => x.id === i.productId);
                  if (!p) return null;
                  return (
                    <div key={i.productId} className="flex justify-between text-sm">
                      <span className="truncate pr-2 font-light text-[#5a6380]">{p.name} <span className="text-[#8fa0d8]">×{i.qty}</span></span>
                      <span className="font-medium text-[#1e2a5e] shrink-0">Rs. {(p.price * i.qty).toLocaleString("en-PK")}</span>
                    </div>
                  );
                })}
              </div>
              <div className="border-t border-[#dde2f0] pt-4 space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-[#5a6380]">Subtotal</span>
                  <span className="font-medium text-[#1e2a5e]">Rs. {subtotal.toLocaleString("en-PK")}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5a6380]">Delivery</span>
                  <span className={`font-medium ${deliveryCharges === 0 ? "text-emerald-600" : "text-[#1e2a5e]"}`}>
                    {deliveryCharges === 0 ? "Free" : `Rs. ${deliveryCharges.toLocaleString("en-PK")}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-[#5a6380]">Payment</span>
                  <span className="font-medium text-[#1e2a5e]">{paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}</span>
                </div>
              </div>
              <div className="border-t border-[#dde2f0] pt-4 flex justify-between items-baseline mb-6">
                <span className="text-sm font-medium text-[#1e2a5e]">Total</span>
                <span className="text-2xl font-bold text-[#1e2a5e]" style={{ fontFamily: "Jost, system-ui, sans-serif" }}>
                  Rs. {total.toLocaleString("en-PK")}
                </span>
              </div>
              <button type="submit" disabled={loading}
                className="w-full h-12 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] hover:bg-[#2d3a8c] disabled:opacity-60 transition-colors flex items-center justify-center gap-2">
                {loading ? <><Loader2 className="w-4 h-4 animate-spin" /> Processing…</> : "Place Order"}
              </button>
              <p className="text-[10px] font-light text-[#8fa0d8] text-center mt-4">
                By placing this order you agree to our terms and conditions.
              </p>
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
}
