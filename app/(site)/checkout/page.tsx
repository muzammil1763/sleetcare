"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useAppStore } from "@/store/AppStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Banknote, CreditCard, CheckCircle2, Upload, Image as ImageIcon, X } from "lucide-react";

type PaymentMethod = "cod" | "bank";

export default function Checkout() {
  const { data: session, status } = useSession();
  const { cart, products, clearCart } = useAppStore();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [deliveryCharges, setDeliveryCharges] = useState(250);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [screenshot, setScreenshot] = useState<string>("");
  const [screenshotUploading, setScreenshotUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState({
    phone: "", address: "", city: "", zip: "", country: "Pakistan",
  });

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login?callbackUrl=/checkout");
  }, [status, router]);

  useEffect(() => {
    fetch("/api/settings")
      .then(r => r.json())
      .then(d => { if (d?.delivery_charges) setDeliveryCharges(Number(d.delivery_charges)); })
      .catch(() => {});
  }, []);

  const subtotal = cart.reduce(
    (s, i) => s + (products.find((p) => p.id === i.productId)?.price ?? 0) * i.qty, 0
  );
  const total = subtotal + deliveryCharges;

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#f7f8fc] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-[#1e2a5e]" />
      </div>
    );
  }

  if (!session) return null;

  if (cart.length === 0) {
    if (typeof window !== "undefined") router.push("/cart");
    return null;
  }

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
      const res = await fetch("https://api.cloudinary.com/v1_1/dsleetcare/image/upload", {
        method: "POST",
        body: formData,
      });
      if (!res.ok) {
        // Fallback: convert to base64 if Cloudinary not configured
        const reader = new FileReader();
        reader.onload = (ev) => {
          setScreenshot(ev.target?.result as string);
          setScreenshotUploading(false);
        };
        reader.readAsDataURL(file);
        return;
      }
      const data = await res.json();
      setScreenshot(data.secure_url);
      toast({ title: "Screenshot uploaded", description: "Payment proof attached successfully." });
    } catch {
      // Fallback: use base64
      const reader = new FileReader();
      reader.onload = (ev) => {
        setScreenshot(ev.target?.result as string);
      };
      reader.readAsDataURL(file);
    } finally {
      setScreenshotUploading(false);
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Require screenshot for bank transfer
    if (paymentMethod === "bank" && !screenshot) {
      toast({ title: "Payment screenshot required", description: "Please upload your payment screenshot before placing the order.", variant: "destructive" });
      return;
    }

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
          paymentMethod,
          paymentScreenshot: screenshot || null,
          deliveryCharges,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to place order");
      clearCart();
      toast({ title: "Order placed!", description: paymentMethod === "cod" ? "Pay on delivery. Thank you!" : "We'll confirm once payment is received." });
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
    <div className="bg-[#f7f8fc] min-h-screen">
      <div className="container pt-10 pb-16 max-w-5xl">
        <h1 className="font-display text-3xl md:text-4xl text-[#1e2a5e] mb-10">Checkout</h1>

        <form onSubmit={onSubmit} className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-5">

            {/* Contact */}
            <div className="bg-white border border-[#dde2f0] p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-5">Contact</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Full Name</Label>
                  <Input value={session.user?.name || ""} disabled className="border-[#dde2f0] rounded-none bg-[#f7f8fc] text-sm font-light" />
                </div>
                <div>
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Email</Label>
                  <Input value={session.user?.email || ""} disabled className="border-[#dde2f0] rounded-none bg-[#f7f8fc] text-sm font-light" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Phone Number</Label>
                  <Input required {...field("phone")} type="tel" placeholder="+92 300 0000000"
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-white border border-[#dde2f0] p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-5">Shipping Address</p>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Street Address</Label>
                  <Input required {...field("address")} placeholder="House #, Street, Area"
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
                <div>
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">City</Label>
                  <Input required {...field("city")} placeholder="Faisalabad"
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
                <div>
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">ZIP / Postal Code</Label>
                  <Input {...field("zip")} placeholder="38000"
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
                <div className="sm:col-span-2">
                  <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">Country</Label>
                  <Input required {...field("country")}
                    className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light" />
                </div>
              </div>
            </div>

            {/* Payment Method */}
            <div className="bg-white border border-[#dde2f0] p-6">
              <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-5">Payment Method</p>
              <div className="grid sm:grid-cols-2 gap-4">

                {/* COD */}
                <button type="button" onClick={() => setPaymentMethod("cod")}
                  className={`relative flex items-start gap-4 p-5 border-2 text-left transition-all ${
                    paymentMethod === "cod"
                      ? "border-[#1e2a5e] bg-[#eef0f8]"
                      : "border-[#dde2f0] hover:border-[#8fa0d8]"
                  }`}>
                  <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                    paymentMethod === "cod" ? "bg-[#1e2a5e]" : "bg-[#eef0f8]"
                  }`}>
                    <Banknote className={`w-5 h-5 ${paymentMethod === "cod" ? "text-white" : "text-[#2d3a8c]"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1e2a5e] mb-1">Cash on Delivery</p>
                    <p className="text-xs font-light text-[#5a6380] leading-relaxed">Pay in cash when your order arrives at your door.</p>
                  </div>
                  {paymentMethod === "cod" && (
                    <CheckCircle2 className="w-5 h-5 text-[#1e2a5e] absolute top-3 right-3" />
                  )}
                </button>

                {/* Bank Transfer */}
                <button type="button" onClick={() => setPaymentMethod("bank")}
                  className={`relative flex items-start gap-4 p-5 border-2 text-left transition-all ${
                    paymentMethod === "bank"
                      ? "border-[#1e2a5e] bg-[#eef0f8]"
                      : "border-[#dde2f0] hover:border-[#8fa0d8]"
                  }`}>
                  <div className={`w-10 h-10 flex items-center justify-center shrink-0 ${
                    paymentMethod === "bank" ? "bg-[#1e2a5e]" : "bg-[#eef0f8]"
                  }`}>
                    <CreditCard className={`w-5 h-5 ${paymentMethod === "bank" ? "text-white" : "text-[#2d3a8c]"}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-[#1e2a5e] mb-1">Bank Transfer</p>
                    <p className="text-xs font-light text-[#5a6380] leading-relaxed">Transfer payment before dispatch. Details sent by WhatsApp.</p>
                  </div>
                  {paymentMethod === "bank" && (
                    <CheckCircle2 className="w-5 h-5 text-[#1e2a5e] absolute top-3 right-3" />
                  )}
                </button>
              </div>

              {/* COD info */}
              {paymentMethod === "cod" && (
                <div className="mt-4 p-4 bg-[#eef0f8] border border-[#dde2f0]">
                  <p className="text-xs font-light text-[#5a6380] flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2d3a8c] shrink-0" />
                    Please keep exact change ready. Our delivery partner will collect payment at your door.
                  </p>
                </div>
              )}

              {/* Bank info + Screenshot Upload */}
              {paymentMethod === "bank" && (
                <div className="mt-4 space-y-4">
                  {/* Bank details */}
                  <div className="p-4 bg-[#eef0f8] border border-[#dde2f0] space-y-2">
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-3">Payment Details</p>
                    {[
                      { label: "Bank",           value: "Meezan Bank Limited",           copy: false },
                      { label: "Branch",         value: "Tata Market Branch, Faisalabad", copy: false },
                      { label: "Branch Code",    value: "0413",                           copy: false },
                      { label: "Account Title",  value: "Muhammad Hanan Ajmal",           copy: false },
                      { label: "Account No.",    value: "0413 0105170552",                copy: true  },
                      { label: "IBAN",           value: "PK17 MEZN 0004 1301 0517 0552",  copy: true  },
                    ].map(r => (
                      <div key={r.label} className="flex justify-between items-center text-xs">
                        <span className="font-light text-[#5a6380]">{r.label}</span>
                        <div className="flex items-center gap-1.5">
                          <span className={`font-medium text-[#1e2a5e] ${r.copy ? "font-mono" : ""}`}>{r.value}</span>
                          {r.copy && (
                            <button
                              type="button"
                              onClick={() => {
                                navigator.clipboard.writeText(r.value);
                                const el = document.getElementById(`copied-${r.label}`);
                                if (el) { el.style.display = "inline"; setTimeout(() => { el.style.display = "none"; }, 1500); }
                              }}
                              className="ml-1 p-1 bg-[#1e2a5e] text-white hover:bg-[#2d3a8c] transition-colors"
                              title={`Copy ${r.label}`}
                            >
                              <svg className="w-3 h-3" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                                <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
                                <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
                              </svg>
                            </button>
                          )}
                          {r.copy && (
                            <span id={`copied-${r.label}`} style={{ display: "none" }}
                              className="text-[9px] text-emerald-600 font-medium">Copied!</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Screenshot Upload — compulsory */}
                  <div className={`p-4 bg-white border-2 border-dashed transition-colors ${screenshot ? "border-emerald-400" : "border-[#dde2f0] hover:border-[#2d3a8c]"}`}>
                    <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-1">
                      Upload Payment Screenshot <span className="text-red-500">*</span>
                    </p>
                    <p className="text-[10px] font-light text-[#5a6380] mb-4">
                      Required — upload your payment confirmation screenshot to proceed.
                    </p>

                    {screenshot ? (
                      <div className="relative">
                        <img src={screenshot} alt="Payment screenshot"
                          className="w-full max-h-48 object-contain border border-[#dde2f0] bg-[#f7f8fc]" />
                        <button type="button"
                          onClick={() => { setScreenshot(""); if (fileInputRef.current) fileInputRef.current.value = ""; }}
                          className="absolute top-2 right-2 w-7 h-7 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors">
                          <X className="w-3.5 h-3.5" />
                        </button>
                        <div className="flex items-center gap-2 mt-3">
                          <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                          <span className="text-xs font-medium text-emerald-600">Screenshot attached successfully</span>
                        </div>
                      </div>
                    ) : (
                      <button type="button" onClick={() => fileInputRef.current?.click()}
                        disabled={screenshotUploading}
                        className="w-full flex flex-col items-center gap-3 py-8 bg-[#eef0f8] hover:bg-[#dde2f0] transition-colors disabled:opacity-60">
                        {screenshotUploading
                          ? <Loader2 className="w-8 h-8 text-[#2d3a8c] animate-spin" />
                          : <Upload className="w-8 h-8 text-[#2d3a8c]" />
                        }
                        <span className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#2d3a8c]">
                          {screenshotUploading ? "Uploading…" : "Click to Upload Screenshot"}
                        </span>
                        <span className="text-[10px] font-light text-[#8fa0d8]">JPG, PNG or WEBP</span>
                      </button>
                    )}
                    <input ref={fileInputRef} type="file" accept="image/*"
                      onChange={handleScreenshotUpload} className="hidden" />
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
                  const p = products.find((x) => x.id === i.productId)!;
                  if (!p) return null;
                  return (
                    <div key={i.productId} className="flex justify-between text-sm">
                      <span className="truncate pr-2 font-light text-[#5a6380]">
                        {p.name} <span className="text-[#8fa0d8]">×{i.qty}</span>
                      </span>
                      <span className="font-medium text-[#1e2a5e] shrink-0">Rs. {(p.price * i.qty).toLocaleString("en-PK")}</span>
                    </div>
                  );
                })}
              </div>

              <div className="border-t border-[#dde2f0] pt-4 flex justify-between items-baseline mb-2">
                <span className="text-sm text-[#5a6380]">Subtotal</span>
                <span className="text-sm font-medium text-[#1e2a5e]">Rs. {subtotal.toLocaleString("en-PK")}</span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-[#5a6380]">Delivery</span>
                <span className={`text-sm font-medium ${deliveryCharges === 0 ? "text-emerald-600" : "text-[#1e2a5e]"}`}>
                  {deliveryCharges === 0 ? "Free" : `Rs. ${deliveryCharges.toLocaleString("en-PK")}`}
                </span>
              </div>
              <div className="flex justify-between items-baseline mb-1">
                <span className="text-sm text-[#5a6380]">Payment</span>
                <span className="text-sm font-medium text-[#1e2a5e]">{paymentMethod === "cod" ? "Cash on Delivery" : "Bank Transfer"}</span>
              </div>

              <div className="border-t border-[#dde2f0] mt-4 pt-4 flex justify-between items-baseline mb-6">
                <span className="text-sm font-medium text-[#1e2a5e]">Total</span>
                <span className="font-display text-2xl text-[#1e2a5e]">Rs. {total.toLocaleString("en-PK")}</span>
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
