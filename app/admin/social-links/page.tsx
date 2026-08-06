"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, RefreshCw, Loader2, Facebook, Twitter, Instagram, Linkedin, Youtube, Github, Mail, Phone, Globe, MessageCircle, Send } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type SocialLink = {
  id: string;
  platform: string;
  url: string;
  icon: string;
  label: string;
  active: boolean;
  order: number;
};

const emptyForm = () => ({
  platform: "Facebook",
  url: "",
  icon: "Facebook",
  label: "",
  active: true,
  order: 0,
});

const SOCIAL_PLATFORMS = [
  { value: "Facebook", label: "Facebook", icon: Facebook, placeholder: "https://facebook.com/yourpage" },
  { value: "Twitter", label: "Twitter / X", icon: Twitter, placeholder: "https://twitter.com/yourhandle" },
  { value: "Instagram", label: "Instagram", icon: Instagram, placeholder: "https://instagram.com/yourhandle" },
  { value: "LinkedIn", label: "LinkedIn", icon: Linkedin, placeholder: "https://linkedin.com/company/yourcompany" },
  { value: "YouTube", label: "YouTube", icon: Youtube, placeholder: "https://youtube.com/@yourchannel" },
  { value: "GitHub", label: "GitHub", icon: Github, placeholder: "https://github.com/yourorg" },
  { value: "WhatsApp", label: "WhatsApp", icon: MessageCircle, placeholder: "https://wa.me/1234567890" },
  { value: "Telegram", label: "Telegram", icon: Send, placeholder: "https://t.me/yourchannel" },
  { value: "Email", label: "Email", icon: Mail, placeholder: "mailto:contact@example.com" },
  { value: "Phone", label: "Phone", icon: Phone, placeholder: "tel:+1234567890" },
  { value: "Website", label: "Website", icon: Globe, placeholder: "https://yourwebsite.com" },
];

export default function AdminSocialLinks() {
  const [links, setLinks] = useState<SocialLink[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<SocialLink | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/social-links");
      const data = await res.json();
      setLinks(Array.isArray(data) ? data : []);
    } catch (e) {
      toast({ title: "Failed to load social links", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openCreate = () => { 
    setEditing(null); 
    setForm({ ...emptyForm(), order: links.length }); 
    setOpen(true); 
  };

  const openEdit = (link: SocialLink) => {
    setEditing(link);
    setForm({
      platform: link.platform,
      url: link.url,
      icon: link.icon,
      label: link.label,
      active: link.active,
      order: link.order,
    });
    setOpen(true);
  };

  const onSave = async () => {
    if (!form.platform || !form.url || !form.label) {
      toast({ title: "Please fill all required fields", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/social-links/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Social link updated" });
      } else {
        const res = await fetch("/api/social-links", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Social link added" });
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
    if (!confirm("Delete this social link?")) return;
    try {
      const res = await fetch(`/api/social-links/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "Social link deleted" });
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const toggleActive = async (link: SocialLink) => {
    try {
      const res = await fetch(`/api/social-links/${link.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !link.active }),
      });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: `Social link ${!link.active ? "activated" : "deactivated"}` });
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const getIcon = (iconName: string) => {
    const platform = SOCIAL_PLATFORMS.find(p => p.value === iconName);
    return platform?.icon || Globe;
  };

  const selectedPlatform = SOCIAL_PLATFORMS.find(p => p.value === form.platform);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="chip mb-2">// Social Media</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Social Links</h1>
          <p className="text-sm text-muted-foreground mt-1">{links.length} social links configured</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={load} title="Refresh" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="hero" onClick={openCreate}>
            <Plus /> Add social link
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Icon</th>
                <th className="px-5 py-3">Platform</th>
                <th className="px-5 py-3">Label</th>
                <th className="px-5 py-3">URL</th>
                <th className="px-5 py-3 text-center">Order</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center">
                    <Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" />
                  </td>
                </tr>
              ) : links.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    No social links found. Add your first one!
                  </td>
                </tr>
              ) : (
                links.map((link) => {
                  const Icon = getIcon(link.icon);
                  return (
                    <tr key={link.id} className="border-b border-border/40 hover:bg-muted/20 transition">
                      <td className="px-5 py-3">
                        <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-primary/20 to-secondary/10 border border-border flex items-center justify-center">
                          <Icon className="w-5 h-5 text-primary" />
                        </div>
                      </td>
                      <td className="px-5 py-3 font-medium">{link.platform}</td>
                      <td className="px-5 py-3">{link.label}</td>
                      <td className="px-5 py-3">
                        <a
                          href={link.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline text-xs font-mono truncate block max-w-xs"
                        >
                          {link.url}
                        </a>
                      </td>
                      <td className="px-5 py-3 text-center font-mono">{link.order}</td>
                      <td className="px-5 py-3 text-center">
                        <Switch
                          checked={link.active}
                          onCheckedChange={() => toggleActive(link)}
                        />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <div className="inline-flex gap-1">
                          <button
                            className="p-2 rounded-md hover:bg-muted transition"
                            onClick={() => openEdit(link)}
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            className="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition"
                            onClick={() => onDelete(link.id)}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="bg-card border-border max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit social link" : "Add social link"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label>Platform</Label>
              <Select
                value={form.platform}
                onValueChange={(v) => setForm({ ...form, platform: v, icon: v })}
              >
                <SelectTrigger className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {SOCIAL_PLATFORMS.map((platform) => {
                    const Icon = platform.icon;
                    return (
                      <SelectItem key={platform.value} value={platform.value}>
                        <div className="flex items-center gap-2">
                          <Icon className="w-4 h-4" />
                          {platform.label}
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Label</Label>
              <Input
                value={form.label}
                onChange={(e) => setForm({ ...form, label: e.target.value })}
                placeholder="e.g., Follow us on Facebook"
                className="mt-1.5"
              />
            </div>

            <div>
              <Label>URL</Label>
              <Input
                value={form.url}
                onChange={(e) => setForm({ ...form, url: e.target.value })}
                placeholder={selectedPlatform?.placeholder || "https://..."}
                className="mt-1.5"
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Display Order</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: +e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Active</Label>
                <div className="mt-1.5 flex items-center h-10">
                  <Switch
                    checked={form.active}
                    onCheckedChange={(checked) => setForm({ ...form, active: checked })}
                  />
                  <span className="ml-2 text-sm text-muted-foreground">
                    {form.active ? "Visible" : "Hidden"}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button variant="hero" onClick={onSave} disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
