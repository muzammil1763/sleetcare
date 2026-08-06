"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/hooks/use-toast";
import { Loader2, CheckCircle2, MessageSquare } from "lucide-react";

interface InquiryFormProps {
  type: "service" | "product";
  itemName: string;
  itemId: string;
  qty?: number;
}

export default function InquiryForm({ type, itemName, itemId, qty }: InquiryFormProps) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const field = (key: keyof typeof form) => ({
    value: form[key],
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setForm({ ...form, [key]: e.target.value }),
  });

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, type, itemName, itemId, qty }),
      });
      if (!res.ok) throw new Error((await res.json()).error ?? "Failed to submit");

      // Fetch WhatsApp number and open chat
      try {
        const settings = await fetch("/api/settings").then((r) => r.json());
        const waNumber = (settings.contact_whatsapp ?? "").replace(/\D/g, "");
        if (waNumber) {
          const sep = "━━━━━━━━━━━━━━━━━━━━";
          let msg = "";
          if (type === "service") {
            msg = `🔧 *Service Inquiry - Majestic Women*\n${sep}\n*Service:* ${itemName}\n*Name:* ${form.name}\n*Email:* ${form.email}\n*Phone:* ${form.phone}\n*Company:* ${form.company || "N/A"}\n*Message:* ${form.message}\n${sep}\nSent from majestic.com`;
          } else {
            msg = `📦 *Product Inquiry - Majestic Women*\n${sep}\n*Product:* ${itemName}${qty ? `\n*Quantity:* ${qty}` : ""}\n*Name:* ${form.name}\n*Email:* ${form.email}\n*Phone:* ${form.phone}\n*Company:* ${form.company || "N/A"}\n*Message:* ${form.message}\n${sep}\nSent from majestic.com`;
          }
          const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
          window.open(waUrl, "_blank");
        }
      } catch {
        // WhatsApp is best-effort
      }

      setSubmitted(true);
      toast({ title: "Inquiry sent!", description: "We'll get back to you shortly." });
    } catch (err: any) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="glass-card p-6 text-center space-y-3">
        <CheckCircle2 className="w-10 h-10 text-primary mx-auto" />
        <h3 className="font-semibold">Inquiry Received</h3>
        <p className="text-sm text-muted-foreground">
          Thank you! Our team will reach out to you soon.
        </p>
        <Button variant="outline" size="sm" onClick={() => setSubmitted(false)}>
          Send another
        </Button>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-4 h-4 text-primary" />
        <h3 className="font-semibold">Inquire Now</h3>
      </div>
      <form onSubmit={onSubmit} className="space-y-3">
        <div>
          <Label className="text-xs">Full name *</Label>
          <Input required {...field("name")} className="mt-1" placeholder="John Smith" />
        </div>
        <div>
          <Label className="text-xs">Email *</Label>
          <Input required type="email" {...field("email")} className="mt-1" placeholder="john@company.com" />
        </div>
        <div>
          <Label className="text-xs">Phone *</Label>
          <Input required {...field("phone")} className="mt-1" placeholder="+1 555 000 0000" />
        </div>
        <div>
          <Label className="text-xs">Company</Label>
          <Input {...field("company")} className="mt-1" placeholder="Acme Corp" />
        </div>
        <div>
          <Label className="text-xs">Message / Requirements</Label>
          <Textarea
            {...field("message")}
            className="mt-1 resize-none"
            rows={3}
            placeholder="Tell us about your requirements..."
          />
        </div>
        <Button type="submit" variant="hero" className="w-full" disabled={loading}>
          {loading ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : null}
          {loading ? "Sending..." : "Send Inquiry"}
        </Button>
      </form>
    </div>
  );
}
