"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Pencil, Trash2, GripVertical } from "lucide-react";
import ImageUpload from "@/components/ui/image-upload";

type EngineeringService = {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  image?: string;
  active: boolean;
  features: string[];
  order: number;
};

const iconOptions = ["Code2", "CircuitBoard", "Settings", "Package", "Wrench", "Cpu", "Zap"];

export default function EngineeringServicesAdmin() {
  const [services, setServices] = useState<EngineeringService[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState<EngineeringService | null>(null);
  const [form, setForm] = useState({
    name: "",
    slug: "",
    description: "",
    icon: "Code2",
    image: "",
    active: true,
    features: [""],
    order: 0,
  });

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await fetch("/api/engineering-services");
      const data = await res.json();
      setServices(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load services", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const openDialog = (service?: EngineeringService) => {
    if (service) {
      setEditingService(service);
      setForm({
        name: service.name,
        slug: service.slug,
        description: service.description,
        icon: service.icon,
        image: service.image || "",
        active: service.active,
        features: service.features.length > 0 ? service.features : [""],
        order: service.order,
      });
    } else {
      setEditingService(null);
      setForm({
        name: "",
        slug: "",
        description: "",
        icon: "Code2",
        image: "",
        active: true,
        features: [""],
        order: services.length,
      });
    }
    setDialogOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const filteredFeatures = form.features.filter((f) => f.trim() !== "");
      const payload = { ...form, features: filteredFeatures };

      const res = await fetch(
        editingService ? `/api/engineering-services/${editingService.id}` : "/api/engineering-services",
        {
          method: editingService ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        }
      );

      if (!res.ok) throw new Error((await res.json()).error);

      toast({ title: "Success", description: `Service ${editingService ? "updated" : "created"}` });
      setDialogOpen(false);
      loadServices();
    } catch (error: any) {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    try {
      const res = await fetch(`/api/engineering-services/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete");
      toast({ title: "Success", description: "Service deleted" });
      loadServices();
    } catch (error) {
      toast({ title: "Error", description: "Failed to delete service", variant: "destructive" });
    }
  };

  const addFeature = () => {
    setForm({ ...form, features: [...form.features, ""] });
  };

  const updateFeature = (index: number, value: string) => {
    const newFeatures = [...form.features];
    newFeatures[index] = value;
    setForm({ ...form, features: newFeatures });
  };

  const removeFeature = (index: number) => {
    setForm({ ...form, features: form.features.filter((_, i) => i !== index) });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Engineering Services</h1>
          <p className="text-muted-foreground mt-1">Manage engineering services</p>
        </div>
        <Button onClick={() => openDialog()}>
          <Plus className="w-4 h-4 mr-2" /> Add Service
        </Button>
      </div>

      {loading && services.length === 0 ? (
        <div className="flex justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="glass-card overflow-x-auto scrollbar-hide">
          <table className="w-full min-w-max">
            <thead className="border-b border-border">
              <tr className="text-left text-sm text-muted-foreground">
                <th className="p-4 font-medium">Order</th>
                <th className="p-4 font-medium">Image</th>
                <th className="p-4 font-medium">Name</th>
                <th className="p-4 font-medium">Slug</th>
                <th className="p-4 font-medium">Features</th>
                <th className="p-4 font-medium">Status</th>
                <th className="p-4 font-medium">Actions</th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id} className="border-b border-border hover:bg-muted/30 transition">
                  <td className="p-4">
                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                  </td>
                  <td className="p-4">
                    {service.image ? (
                      <img src={service.image} alt={service.name} className="w-16 h-16 rounded object-cover" />
                    ) : (
                      <div className="w-16 h-16 rounded bg-muted flex items-center justify-center text-xs text-muted-foreground">
                        No image
                      </div>
                    )}
                  </td>
                  <td className="p-4 font-medium">{service.name}</td>
                  <td className="p-4 font-mono text-sm text-muted-foreground">{service.slug}</td>
                  <td className="p-4 text-sm">{service.features.length} features</td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-xs font-medium ${
                        service.active
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-gray-50 text-gray-700 border border-gray-200"
                      }`}
                    >
                      {service.active ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={() => openDialog(service)}>
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => handleDelete(service.id)}>
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editingService ? "Edit Service" : "Add Service"}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Name *</Label>
                <Input
                  required
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="mt-1.5"
                />
              </div>
              <div>
                <Label>Slug *</Label>
                <Input
                  required
                  value={form.slug}
                  onChange={(e) => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/\s+/g, "-") })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                required
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                className="mt-1.5"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Icon</Label>
                <select
                  value={form.icon}
                  onChange={(e) => setForm({ ...form, icon: e.target.value })}
                  className="mt-1.5 w-full rounded-md border border-input bg-background px-3 py-2"
                >
                  {iconOptions.map((icon) => (
                    <option key={icon} value={icon}>
                      {icon}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label>Order</Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: +e.target.value })}
                  className="mt-1.5"
                />
              </div>
            </div>

            <div>
              <Label>Image</Label>
              <div className="mt-1.5">
                <ImageUpload
                  value={form.image}
                  onChange={(url) => setForm({ ...form, image: url })}
                />
              </div>
            </div>

            <div>
              <Label>Features</Label>
              <div className="space-y-2 mt-1.5">
                {form.features.map((feature, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={feature}
                      onChange={(e) => updateFeature(index, e.target.value)}
                      placeholder="Feature description"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeFeature(index)}
                      disabled={form.features.length === 1}
                    >
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={addFeature}>
                  <Plus className="w-3 h-3 mr-1" /> Add Feature
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Switch checked={form.active} onCheckedChange={(checked) => setForm({ ...form, active: checked })} />
              <Label>Active</Label>
            </div>

            <div className="flex gap-2 pt-4">
              <Button type="submit" disabled={loading} className="flex-1">
                {loading && <Loader2 className="w-4 h-4 animate-spin mr-2" />}
                {editingService ? "Update" : "Create"}
              </Button>
              <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>
                Cancel
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
