"use client";

import Link from "next/link";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";
import { serviceIcons } from "@/data/mock";

type EngineeringService = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  features: string[];
};

export default function EngineeringServiceDetail() {
  const params = useParams();
  const slug = params.slug as string;
  const router = useRouter();
  const [service, setService] = useState<EngineeringService | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });

  useEffect(() => {
    const loadService = async () => {
      try {
        const res = await fetch("/api/engineering-services");
        const data = await res.json();
        const found = data.find((s: EngineeringService) => s.slug === slug);
        if (found) {
          setService(found);
        } else {
          router.push("/engineering");
        }
      } catch (error) {
        console.error("Failed to load service:", error);
        router.push("/engineering");
      } finally {
        setLoading(false);
      }
    };
    loadService();
  }, [slug, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast({ title: "Please fill in all required fields", variant: "destructive" });
      return;
    }

    if (!service) {
      toast({ title: "Service information not loaded", variant: "destructive" });
      return;
    }

    setSubmitting(true);
    try {
      const inquiryData = {
        name: form.name,
        email: form.email,
        phone: form.phone || "",
        company: form.company || "",
        message: form.message,
        itemName: service.name,
        itemId: service.id,
        type: "engineering",
      };

      console.log("Submitting inquiry:", inquiryData);

      const res = await fetch("/api/inquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(inquiryData),
      });

      if (!res.ok) throw new Error("Failed to submit inquiry");

      // Fetch WhatsApp number and open chat
      try {
        const settings = await fetch("/api/settings").then((r) => r.json());
        const waNumber = (settings.contact_whatsapp ?? "").replace(/\D/g, "");
        if (waNumber) {
          const sep = "━━━━━━━━━━━━━━━━━━━━";
          const msg = `🧥 *Jacket Inquiry - Rugged Hides*\n${sep}\n*Jacket:* ${service.name}\n*Name:* ${form.name}\n*Email:* ${form.email}\n*Phone:* ${form.phone || "N/A"}\n*Company:* ${form.company || "N/A"}\n*Message:* ${form.message}\n${sep}\nSent from ruggedhides.com`;
          const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(msg)}`;
          window.open(waUrl, "_blank");
        }
      } catch {
        // WhatsApp is best-effort
      }

      toast({ title: "Inquiry submitted!", description: "We'll get back to you soon." });
      setForm({ name: "", email: "", phone: "", company: "", message: "" });
    } catch (error) {
      console.error("Inquiry submission error:", error);
      toast({ title: "Failed to submit inquiry", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container pt-40 text-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary mx-auto" />
      </div>
    );
  }

  if (!service) {
    return null;
  }

  const Icon = serviceIcons[service.icon as keyof typeof serviceIcons] ?? serviceIcons.Settings;

  return (
    <div className="container pt-24 pb-12">
      <Link href="/engineering" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8">
        <ArrowLeft className="w-4 h-4" /> All Engineering Services
      </Link>

      <div className="grid lg:grid-cols-2 gap-10">
        {/* Service Info */}
        <div>
          <div className="aspect-video glass-card flex items-center justify-center relative overflow-hidden mb-6">
            {service.image ? (
              <>
                <img 
                  src={service.image} 
                  alt={service.name} 
                  className="absolute inset-0 w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              </>
            ) : (
              <>
                <div className="absolute inset-0 grid-bg opacity-20" />
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/10" />
                <Icon className="w-32 h-32 text-primary relative z-10 drop-shadow-[0_0_40px_hsl(var(--primary)/0.6)]" />
              </>
            )}
          </div>

          <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{service.name}</h1>
          <p className="text-muted-foreground mt-4 text-lg leading-relaxed">{service.description}</p>

          {service.features && service.features.length > 0 && (
            <div className="mt-8 glass-card p-6">
              <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-4">Key Features</h3>
              <ul className="space-y-3">
                {service.features.map((feature, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm leading-relaxed">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Inquiry Form */}
        <div>
          <div className="glass-card p-6 sticky top-24">
            <h2 className="text-xl font-bold mb-2">Request a Quote</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Fill out the form below and our team will get back to you within 24 hours.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label>Full Name *</Label>
                <Input 
                  required 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  className="mt-1.5" 
                />
              </div>

              <div>
                <Label>Email *</Label>
                <Input 
                  required 
                  type="email" 
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  className="mt-1.5" 
                />
              </div>

              <div>
                <Label>Phone Number</Label>
                <Input 
                  type="tel" 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  placeholder="+92 300 1234567"
                  className="mt-1.5" 
                />
              </div>

              <div>
                <Label>Company Name</Label>
                <Input 
                  value={form.company} 
                  onChange={(e) => setForm({ ...form, company: e.target.value })} 
                  className="mt-1.5" 
                />
              </div>

              <div>
                <Label>Project Details *</Label>
                <textarea 
                  required
                  value={form.message} 
                  onChange={(e) => setForm({ ...form, message: e.target.value })} 
                  rows={4}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none"
                  placeholder="Tell us about your project requirements..."
                />
              </div>

              <Button 
                type="submit" 
                variant="hero" 
                size="lg" 
                className="w-full" 
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin mr-2" />
                    Submitting...
                  </>
                ) : (
                  "Submit Inquiry"
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                By submitting this form, you agree to our terms and privacy policy.
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
