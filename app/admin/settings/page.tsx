"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Save, RefreshCw, Loader2, Mail, Phone, MessageCircle, MapPin, Building2, FileText } from "lucide-react";

type Settings = {
  contact_email: string;
  contact_phone: string;
  contact_whatsapp: string;
  contact_address: string;
  company_name: string;
  company_tagline: string;
  delivery_charges: string;
};

const defaultSettings: Settings = {
  contact_email: "",
  contact_phone: "",
  contact_whatsapp: "",
  contact_address: "",
  company_name: "",
  company_tagline: "",
  delivery_charges: "250",
};

const fields: { key: keyof Settings; label: string; icon: any; placeholder: string; hint?: string }[] = [
  { key: "company_name",      label: "Company Name",       icon: Building2,     placeholder: "Sleet Care Women" },
  { key: "company_tagline",  label: "Company Tagline",    icon: FileText,      placeholder: "Crafted for the modern woman..." },
  { key: "contact_email",    label: "Email Address",      icon: Mail,          placeholder: "hello@sleetcare.com" },
  { key: "contact_phone",    label: "Phone Number",       icon: Phone,         placeholder: "+92 300 8662833" },
  { key: "contact_whatsapp", label: "WhatsApp Number",    icon: MessageCircle, placeholder: "923008662833", hint: "Digits only, with country code. E.g. 923008662833" },
  { key: "contact_address",  label: "Office Address",     icon: MapPin,        placeholder: "Faisalabad, Punjab, Pakistan" },
  { key: "delivery_charges", label: "Delivery Charges (Rs.)", icon: FileText,  placeholder: "250", hint: "Enter 0 for free delivery. Shown at checkout." },
];

export default function AdminSettings() {
  const [settings, setSettings] = useState<Settings>(defaultSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/settings");
      const data = await res.json();
      setSettings({ ...defaultSettings, ...data });
    } catch {
      toast({ title: "Failed to load settings", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onSave = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "Settings saved", description: "Changes are now live on the site." });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-end justify-between">
        <div>
          <div className="chip mb-2">// Configuration</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Site Settings</h1>
          <p className="text-sm text-muted-foreground mt-1">Contact details shown in the footer and contact page.</p>
        </div>
        <Button variant="outline" size="icon" onClick={load} disabled={loading}>
          <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
        </Button>
      </div>

      {loading ? (
        <div className="glass-card p-12 flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : (
        <div className="glass-card p-6 space-y-5">
          {fields.map((f) => (
            <div key={f.key}>
              <Label className="flex items-center gap-2 mb-1.5">
                <f.icon className="w-3.5 h-3.5 text-muted-foreground" />
                {f.label}
              </Label>
              <Input
                value={settings[f.key]}
                onChange={(e) => setSettings({ ...settings, [f.key]: e.target.value })}
                placeholder={f.placeholder}
                className="font-mono text-sm"
              />
              {f.hint && <p className="text-xs text-muted-foreground mt-1">{f.hint}</p>}
            </div>
          ))}

          <div className="pt-2 border-t border-border">
            <Button variant="hero" onClick={onSave} disabled={saving} className="w-full sm:w-auto">
              {saving ? (
                <span className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /> Saving...</span>
              ) : (
                <span className="flex items-center gap-2"><Save className="w-4 h-4" /> Save Settings</span>
              )}
            </Button>
          </div>
        </div>
      )}

      {/* Preview */}
      {!loading && (
        <div className="glass-card p-6">
          <h3 className="text-sm font-semibold mb-4 text-muted-foreground uppercase tracking-wider font-mono">// Preview — Footer display</h3>
          <div className="space-y-2 text-sm">
            {settings.company_name && (
              <div className="flex items-center gap-2">
                <Building2 className="w-4 h-4 text-primary shrink-0" />
                <span className="font-semibold">{settings.company_name}</span>
              </div>
            )}
            {settings.company_tagline && (
              <div className="flex items-start gap-2 text-muted-foreground">
                <FileText className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <span>{settings.company_tagline}</span>
              </div>
            )}
            {settings.contact_email && (
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-primary shrink-0" />
                <a href={`mailto:${settings.contact_email}`} className="text-primary hover:underline">{settings.contact_email}</a>
              </div>
            )}
            {settings.contact_phone && (
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-primary shrink-0" />
                <span>{settings.contact_phone}</span>
              </div>
            )}
            {settings.contact_whatsapp && (
              <div className="flex items-center gap-2">
                <MessageCircle className="w-4 h-4 text-primary shrink-0" />
                <a href={`https://wa.me/${settings.contact_whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">
                  wa.me/{settings.contact_whatsapp}
                </a>
              </div>
            )}
            {settings.contact_address && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-primary shrink-0" />
                <span>{settings.contact_address}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
