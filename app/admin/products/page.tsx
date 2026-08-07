"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Pencil, Trash2, Plus, Search, RefreshCw, Loader2, Upload, X, Video } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import ImageUpload from "@/components/ui/image-upload";
import { Switch } from "@/components/ui/switch";

type Category = {
  id: string;
  name: string;
  description: string;
};

type Product = {
  id: string; name: string; category: string; price: number;
  stock: number; shortDesc: string; description: string;
  specs: { label: string; value: string }[]; icon: string; image?: string; images?: string[];
  videoUrl?: string; active?: boolean; order?: number;
};

const emptyForm = () => ({
  name: "", category: "", price: 0, stock: 0,
  shortDesc: "", description: "", specs: [] as { label: string; value: string }[],
  icon: "Package", image: "", images: [] as string[], videoUrl: "",
  active: true, order: 0,
});

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const [productsRes, categoriesRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/categories"),
      ]);
      const productsData = await productsRes.json();
      const categoriesData = await categoriesRes.json();
      setProducts(Array.isArray(productsData) ? productsData : []);
      setCategories(Array.isArray(categoriesData) ? categoriesData : []);
      // Set default category if not set
      if (form.category === "" && categoriesData.length > 0) {
        setForm((f) => ({ ...f, category: categoriesData[0].name }));
      }
    } catch (e) {
      toast({ title: "Failed to load data", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, [form.category]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => { load(); }, [load]);

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(q.toLowerCase()) ||
    p.category.toLowerCase().includes(q.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({
      name: p.name, category: p.category, price: p.price, stock: p.stock,
      shortDesc: p.shortDesc, description: p.description, specs: p.specs ?? [],
      icon: p.icon, image: p.image ?? "", images: p.images ?? [],
      videoUrl: p.videoUrl ?? "", active: p.active ?? true, order: p.order ?? 0,
    });
    setOpen(true);
  };

  const onSave = async () => {
    if (!form.name) return;
    setSaving(true);
    try {
      if (editing) {
        const res = await fetch(`/api/products/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Product updated" });
      } else {
        const res = await fetch("/api/products", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Product added" });
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
    if (!confirm("Delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "Product deleted" });
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="chip mb-2">// Catalog</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Product Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{products.length} products in database</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search..." className="pl-9 w-56" />
          </div>
          <Button variant="outline" size="icon" onClick={load} title="Refresh" disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="hero" onClick={openCreate}><Plus /> Add product</Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide max-w-full">
          <table className="w-full text-sm min-w-max">
            <thead className="bg-muted/30 border-b border-border">
              <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Image</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3 text-right">Price</th>
                <th className="px-5 py-3 text-right">Stock</th>
                <th className="px-5 py-3 text-center">Order</th>
                <th className="px-5 py-3 text-center">Status</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-10 text-center text-muted-foreground">No products found.</td></tr>
              ) : filtered.map((p) => (
                <tr key={p.id} className="border-b border-border/40 hover:bg-muted/20 transition">
                  <td className="px-5 py-3">
                    {p.image ? (
                      <img src={p.image} alt={p.name} className="w-12 h-12 rounded-lg object-cover border border-border" />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-muted border border-border flex items-center justify-center text-[10px] text-muted-foreground font-mono">IMG</div>
                    )}
                  </td>
                  <td className="px-5 py-3 font-medium">
                    {p.name}
                    <div className="text-[10px] font-mono text-muted-foreground">{p.id.slice(-8)}</div>
                  </td>
                  <td className="px-5 py-3"><span className="chip">{p.category}</span></td>
                  <td className="px-5 py-3 text-right font-mono">Rs. {p.price.toLocaleString("en-PK")}</td>
                  <td className="px-5 py-3 text-right font-mono">
                    <span className={p.stock < 40 ? "text-amber-600 font-semibold" : ""}>{p.stock}</span>
                  </td>
                  <td className="px-5 py-3 text-center font-mono text-sm">{p.order ?? 0}</td>
                  <td className="px-5 py-3 text-center">
                    <span className={`chip text-xs ${p.active ? 'bg-emerald-50 text-emerald-600 border-emerald-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {p.active ? 'Active' : 'Hidden'}
                    </span>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button className="p-2 rounded-md hover:bg-muted transition" onClick={() => openEdit(p)}><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition" onClick={() => onDelete(p.id)}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="bg-card border-border max-w-2xl max-h-[90vh] overflow-y-auto scrollbar-hide">
          <DialogHeader><DialogTitle>{editing ? "Edit product" : "Add product"}</DialogTitle></DialogHeader>
          <div className="space-y-4 pr-4">
            <ImageUpload value={form.image} onChange={(url) => setForm({ ...form, image: url })} folder="sleetcare/products" label="Main Product Image" />
            
            {/* Multiple Images + Video Upload */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Product Gallery</Label>
                <div className="flex gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForm({ ...form, images: [...form.images, ""] })}
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Image
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => setForm({ ...form, images: [...form.images, "video:"] })}
                    className="text-purple-600 border-purple-200 hover:bg-purple-50"
                  >
                    <Plus className="w-3 h-3 mr-1" /> Add Video
                  </Button>
                </div>
              </div>
              <div className="space-y-3">
                {form.images.map((img, i) => {
                  const isVideo = img.startsWith("video:");
                  const videoUrl = isVideo ? img.replace("video:", "") : "";
                  return (
                    <div key={i} className="flex gap-2 items-start">
                      <div className="flex-1">
                        {isVideo ? (
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-purple-600">Gallery Video {i + 1}</label>
                            {videoUrl ? (
                              <div className="relative rounded-xl overflow-hidden border border-purple-200 group">
                                <video
                                  src={videoUrl}
                                  controls
                                  className="w-full h-48 object-cover bg-black"
                                />
                                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                                  <label className="bg-white text-slate-900 text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-slate-100 transition flex items-center gap-1.5 cursor-pointer">
                                    <Upload className="w-3.5 h-3.5" /> Replace
                                    <input type="file" accept="video/*" className="hidden"
                                      onChange={async (e) => {
                                        const file = e.target.files?.[0];
                                        if (!file) return;
                                        const fd = new FormData();
                                        fd.append("file", file);
                                        fd.append("folder", "sleetcare/products");
                                        const res = await fetch("/api/upload", { method: "POST", body: fd });
                                        const data = await res.json();
                                        if (data.url) {
                                          const newImages = [...form.images];
                                          newImages[i] = `video:${data.url}`;
                                          setForm({ ...form, images: newImages });
                                        }
                                      }}
                                    />
                                  </label>
                                  <button type="button" onClick={() => { const n = [...form.images]; n[i] = "video:"; setForm({ ...form, images: n }); }}
                                    className="bg-red-500 text-white text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-red-600 transition flex items-center gap-1.5">
                                    <X className="w-3.5 h-3.5" /> Remove
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <label className="border-2 border-dashed border-purple-200 rounded-xl h-40 flex flex-col items-center justify-center gap-3 cursor-pointer hover:border-purple-400 hover:bg-purple-50/30 transition">
                                <div className="w-12 h-12 rounded-xl bg-purple-50 flex items-center justify-center">
                                  <Video className="w-6 h-6 text-purple-500" />
                                </div>
                                <div className="text-center">
                                  <p className="text-sm font-medium text-purple-600">Click to upload video</p>
                                  <p className="text-xs text-muted-foreground mt-0.5">MP4, MOV, WebM up to 100MB</p>
                                </div>
                                <input type="file" accept="video/*" className="hidden"
                                  onChange={async (e) => {
                                    const file = e.target.files?.[0];
                                    if (!file) return;
                                    toast({ title: "Uploading video…", description: "This may take a moment." });
                                    const fd = new FormData();
                                    fd.append("file", file);
                                    fd.append("folder", "sleetcare/products");
                                    const res = await fetch("/api/upload", { method: "POST", body: fd });
                                    const data = await res.json();
                                    if (data.url) {
                                      const newImages = [...form.images];
                                      newImages[i] = `video:${data.url}`;
                                      setForm({ ...form, images: newImages });
                                      toast({ title: "Video uploaded" });
                                    } else {
                                      toast({ title: "Upload failed", description: data.error, variant: "destructive" });
                                    }
                                  }}
                                />
                              </label>
                            )}
                          </div>
                        ) : (
                          <ImageUpload
                            value={img}
                            onChange={(url) => {
                              const newImages = [...form.images];
                              newImages[i] = url;
                              setForm({ ...form, images: newImages });
                            }}
                            folder="sleetcare/products"
                            label={`Gallery Image ${i + 1}`}
                          />
                        )}
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => setForm({ ...form, images: form.images.filter((_, idx) => idx !== i) })}
                        className="shrink-0 mt-6"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </Button>
                    </div>
                  );
                })}
                {form.images.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No gallery images or videos added yet</p>
                )}
              </div>
            </div>
            
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={form.category} onValueChange={(v) => setForm({ ...form, category: v })}>
                  <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                  <SelectContent>{categories.map((c) => <SelectItem key={c.id} value={c.name}>{c.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div><Label>Price (PKR)</Label><Input type="number" value={form.price} onChange={(e) => setForm({ ...form, price: +e.target.value })} className="mt-1.5" min="0" step="1" /></div>
              <div><Label>Stock</Label><Input type="number" value={form.stock} onChange={(e) => setForm({ ...form, stock: Math.max(1, +e.target.value) })} className="mt-1.5" min="1" /></div>
              <div><Label>Icon</Label><Input value={form.icon} onChange={(e) => setForm({ ...form, icon: e.target.value })} className="mt-1.5" placeholder="Cpu" /></div>
              <div><Label>Display Order</Label><Input type="number" value={form.order} onChange={(e) => setForm({ ...form, order: +e.target.value })} className="mt-1.5" min="0" /></div>
              <div className="flex items-center gap-3 mt-6">
                <Switch id="active" checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
                <Label htmlFor="active" className="cursor-pointer">Active (visible to customers)</Label>
              </div>
            </div>
            <div><Label>Short description</Label><Input value={form.shortDesc} onChange={(e) => setForm({ ...form, shortDesc: e.target.value })} className="mt-1.5" /></div>
            <div><Label>Full description</Label><textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} rows={3} className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring resize-none" /></div>

            {/* Product Video URL */}
            <div>
              <Label>Product Video URL <span className="text-muted-foreground font-normal">(optional)</span></Label>
              <Input
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                className="mt-1.5"
                placeholder="https://www.youtube.com/watch?v=... or youtu.be/..."
              />
              <p className="text-xs text-muted-foreground mt-1">
                Supports YouTube, youtu.be, YouTube Shorts, or any direct video URL. Shown on the product page.
              </p>
              {/* Live mini-preview */}
              {form.videoUrl && (() => {
                const url = form.videoUrl;
                const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
                const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
                const shorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
                const embed = url.includes("youtube.com/embed/") ? url
                  : short ? `https://www.youtube.com/embed/${short[1]}`
                  : watch ? `https://www.youtube.com/embed/${watch[1]}`
                  : shorts ? `https://www.youtube.com/embed/${shorts[1]}`
                  : url;
                return (
                  <div className="mt-2 aspect-video bg-muted overflow-hidden rounded-md">
                    <iframe src={embed} className="w-full h-full" allowFullScreen title="Video preview" />
                  </div>
                );
              })()}
            </div>
            
            {/* Specifications */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Specifications</Label>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setForm({ ...form, specs: [...form.specs, { label: "", value: "" }] })}
                >
                  <Plus className="w-3 h-3 mr-1" /> Add Spec
                </Button>
              </div>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {form.specs.map((spec, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <Input 
                      placeholder="Label (e.g., Processor)" 
                      value={spec.label} 
                      onChange={(e) => {
                        const newSpecs = [...form.specs];
                        newSpecs[i].label = e.target.value;
                        setForm({ ...form, specs: newSpecs });
                      }}
                      className="flex-1"
                    />
                    <Input 
                      placeholder="Value (e.g., ARM Cortex-M4)" 
                      value={spec.value} 
                      onChange={(e) => {
                        const newSpecs = [...form.specs];
                        newSpecs[i].value = e.target.value;
                        setForm({ ...form, specs: newSpecs });
                      }}
                      className="flex-1"
                    />
                    <Button 
                      type="button" 
                      variant="outline" 
                      size="icon" 
                      onClick={() => setForm({ ...form, specs: form.specs.filter((_, idx) => idx !== i) })}
                      className="shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}
                {form.specs.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">No specifications added yet</p>
                )}
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
