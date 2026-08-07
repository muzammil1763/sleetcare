"use client";

import { useEffect, useState, useCallback } from "react";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, RefreshCw, X, Loader2, Server } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";
import Image from "next/image";

type Service = {
  id: string; name: string; slug: string; tagline: string;
  description: string; icon: string; image?: string; active: boolean;
  useCases: string[]; benefits: string[]; order?: number;
};

const ICONS = ["Network", "Activity", "Settings2", "Server", "Cpu", "Radio", "Wifi", "Shield"];

const emptyForm = (): Omit<Service, "id"> => ({
  name: "", slug: "", tagline: "", description: "",
  icon: "Server", image: "", active: true, useCases: [], benefits: [], order: 0,
});

const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function AdminServices() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Service | null>(null);
  const [form, setForm] = useState<Omit<Service, "id">>(emptyForm());
  const [saving, setSaving] = useState(false);
  const [ucInput, setUcInput] = useState("");
  const [benInput, setBenInput] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/services");
      const data = await res.json();
      setServices(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: "Failed to load services", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const onToggle = async (s: Service) => {
    try {
      const res = await fetch(`/api/services/${s.id}`, {
        method: "PUT", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !s.active }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      setServices((prev) => prev.map((x) => x.id === s.id ? { ...x, active: !s.active } : x));
      toast({ title: `${s.name} is now ${!s.active ? "active" : "inactive"}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setUcInput(""); setBenInput(""); setOpen(true); };
  const openEdit = (s: Service) => {
    setEditing(s);
    setForm({ name: s.name, slug: s.slug, tagline: s.tagline, description: s.description, icon: s.icon, image: s.image ?? "", active: s.active, useCases: [...s.useCases], benefits: [...s.benefits], order: s.order ?? 0 });
    setUcInput(""); setBenInput("");
    setOpen(true);
  };

  const onSave = async () => {
    if (!form.name || !form.slug) return;
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/services/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Service updated" });
      } else {
        const res = await fetch("/api/services", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Service created" });
      }
      setOpen(false);
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  const onDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "Service deleted" });
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const addTag = (field: "useCases" | "benefits", val: string) => {
    if (!val.trim()) return;
    setForm((f) => ({ ...f, [field]: [...f[field], val.trim()] }));
    if (field === "useCases") setUcInput(""); else setBenInput("");
  };

  const removeTag = (field: "useCases" | "benefits", i: number) =>
    setForm((f) => ({ ...f, [field]: f[field].filter((_, idx) => idx !== i) }));

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="chip mb-2">// Visibility Control</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Service Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{services.length} services in database</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="hero" onClick={openCreate}><Plus /> Add service</Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide max-w-full">
          <table className="w-full text-sm min-w-max">
            <thead className="bg-muted/30 border-b border-border">
              <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Image</th>
                <th className="px-5 py-3">Service</th>
                <th className="px-5 py-3">Slug</th>
                <th className="px-5 py-3 text-center">Order</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-center">Toggle</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></td></tr>
              ) : services.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">No services yet.</td></tr>
              ) : services.map((s) => (
                <tr key={s.id} className="border-b border-border/40 hover:bg-muted/20 transition">
                  <td className="px-5 py-4">
                    {s.image ? (
                      <img src={s.image} alt={s.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground font-mono">IMG</div>
                    )}
                  </td>
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-md bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Server className="w-4 h-4 text-primary" />
                      </div>
                      <div>
                        <div className="font-medium">{s.name}</div>
                        <div className="text-xs text-muted-foreground">{s.tagline}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-4 font-mono text-xs text-muted-foreground">{s.slug}</td>
                  <td className="px-5 py-4 text-center font-mono text-sm">{s.order ?? 0}</td>
                  <td className="px-5 py-4">
                    {s.active ? (
                      <span className="chip text-emerald-600 border-emerald-300 bg-emerald-50">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> Active
                      </span>
                    ) : (
                      <span className="chip text-muted-foreground">
                        <span className="w-1.5 h-1.5 rounded-full bg-muted-foreground" /> Inactive
                      </span>
                    )}
                  </td>
                  <td className="px-5 py-4 text-center">
                    <Switch checked={s.active} onCheckedChange={() => onToggle(s)} />
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="inline-flex gap-1">
                      <button className="p-2 rounded-md hover:bg-muted transition" onClick={() => openEdit(s)}><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition" onClick={() => onDelete(s.id)}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader><DialogTitle>{editing ? "Edit service" : "Add service"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="majestic/services" label="Service Image" />
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Name</Label>
                <Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value, slug: editing ? form.slug : autoSlug(e.target.value) })} className="mt-1.5" />
              </div>
              <div>
                <Label>Slug</Label>
                <Input value={form.slug} onChange={(e) => setForm({ ...form, slug: e.target.value })} className="mt-1.5 font-mono text-xs" />
              </div>
            </div>
            <div><Label>Tagline</Label><Input value={form.tagline} onChange={(e) => setForm({ ...form, tagline: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Description</Label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Icon</Label>
                <Select value={form.icon} onValueChange={(v) => setForm({ ...form, icon: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{ICONS.map((i) => <SelectItem key={i} value={i}>{i}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <Label>Display Order</Label>
                <Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} className="mt-1.5" min="0" />
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Switch checked={form.active} onCheckedChange={(v) => setForm({ ...form, active: v })} />
              <Label>{form.active ? "Active (visible to customers)" : "Inactive (hidden from customers)"}</Label>
            </div>
            <div>
              <Label>Use Cases</Label>
              <div className="flex gap-2 mt-1.5">
                <Input value={ucInput} onChange={(e) => setUcInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("useCases", ucInput))} placeholder="Type and press Enter" />
                <Button type="button" variant="outline" size="sm" onClick={() => addTag("useCases", ucInput)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.useCases.map((uc, i) => (
                  <span key={i} className="chip flex items-center gap-1 text-xs">{uc}<button onClick={() => removeTag("useCases", i)}><X className="w-3 h-3" /></button></span>
                ))}
              </div>
            </div>
            <div>
              <Label>Benefits</Label>
              <div className="flex gap-2 mt-1.5">
                <Input value={benInput} onChange={(e) => setBenInput(e.target.value)} onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag("benefits", benInput))} placeholder="Type and press Enter" />
                <Button type="button" variant="outline" size="sm" onClick={() => addTag("benefits", benInput)}>Add</Button>
              </div>
              <div className="flex flex-wrap gap-2 mt-2">
                {form.benefits.map((b, i) => (
                  <span key={i} className="chip flex items-center gap-1 text-xs">{b}<button onClick={() => removeTag("benefits", i)}><X className="w-3 h-3" /></button></span>
                ))}
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
            <Button variant="hero" onClick={onSave} disabled={saving}>{saving ? "Saving..." : "Save"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
