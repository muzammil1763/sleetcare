"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Pencil, Trash2, Plus, RefreshCw, Loader2, Play, ExternalLink } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type Vlog = {
  id: string;
  title: string;
  description: string;
  videoUrl: string;
  thumbnail?: string;
  active: boolean;
  order: number;
  createdAt: string;
};

const emptyForm = () => ({
  title: "",
  description: "",
  videoUrl: "",
  thumbnail: "",
  active: true,
  order: 0,
});

// Extract YouTube/video embed URL from any YouTube link
function toEmbedUrl(url: string): string {
  if (!url) return "";
  // Already an embed
  if (url.includes("youtube.com/embed/")) return url;
  // youtu.be/ID
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return `https://www.youtube.com/embed/${short[1]}`;
  // youtube.com/watch?v=ID
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return `https://www.youtube.com/embed/${watch[1]}`;
  // youtube.com/shorts/ID
  const shorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return `https://www.youtube.com/embed/${shorts[1]}`;
  // Return as-is (direct video URL)
  return url;
}

// Get YouTube thumbnail from URL
function getYoutubeThumbnail(url: string): string {
  const short = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
  if (short) return `https://img.youtube.com/vi/${short[1]}/hqdefault.jpg`;
  const watch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
  if (watch) return `https://img.youtube.com/vi/${watch[1]}/hqdefault.jpg`;
  const embed = url.match(/youtube\.com\/embed\/([a-zA-Z0-9_-]{11})/);
  if (embed) return `https://img.youtube.com/vi/${embed[1]}/hqdefault.jpg`;
  const shorts = url.match(/youtube\.com\/shorts\/([a-zA-Z0-9_-]{11})/);
  if (shorts) return `https://img.youtube.com/vi/${shorts[1]}/hqdefault.jpg`;
  return "";
}

export default function AdminVlogs() {
  const [vlogs, setVlogs] = useState<Vlog[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Vlog | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [previewUrl, setPreviewUrl] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/vlogs");
      const data = await res.json();
      setVlogs(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: "Failed to load vlogs", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  // Auto-preview when URL changes
  useEffect(() => {
    setPreviewUrl(toEmbedUrl(form.videoUrl));
  }, [form.videoUrl]);

  const openCreate = () => {
    setEditing(null);
    setForm(emptyForm());
    setOpen(true);
  };

  const openEdit = (v: Vlog) => {
    setEditing(v);
    setForm({
      title: v.title,
      description: v.description,
      videoUrl: v.videoUrl,
      thumbnail: v.thumbnail ?? "",
      active: v.active,
      order: v.order,
    });
    setOpen(true);
  };

  const onSave = async () => {
    if (!form.title.trim() || !form.videoUrl.trim()) {
      toast({ title: "Title and Video URL are required", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const payload = {
        ...form,
        // Auto-generate thumbnail from YouTube if not provided
        thumbnail: form.thumbnail || getYoutubeThumbnail(form.videoUrl) || undefined,
      };
      if (editing) {
        const res = await fetch(`/api/vlogs/${editing.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Vlog updated" });
      } else {
        const res = await fetch("/api/vlogs", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "Vlog added" });
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
    if (!confirm("Delete this vlog?")) return;
    try {
      const res = await fetch(`/api/vlogs/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "Vlog deleted" });
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const toggleActive = async (v: Vlog) => {
    try {
      await fetch(`/api/vlogs/${v.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: !v.active }),
      });
      load();
    } catch {
      toast({ title: "Failed to update", variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "var(--font-body), Jost, system-ui, sans-serif" }}>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-2">Content</p>
          <h1
            className="text-[#1e2a5e] leading-tight"
            style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "28px", fontWeight: 400 }}
          >
            Vlogs
          </h1>
          <p className="text-sm font-light text-[#5a6380] mt-1">{vlogs.length} videos in library</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={load}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2.5 border border-[#dde2f0] bg-white text-[11px] font-medium uppercase tracking-[0.12em] text-[#5a6380] hover:border-[#1e2a5e] hover:text-[#1e2a5e] transition-colors"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </button>
          <button
            onClick={openCreate}
            className="flex items-center gap-2 px-5 py-2.5 bg-[#1e2a5e] text-[#f7f8fc] text-[11px] font-medium uppercase tracking-[0.12em] hover:bg-[#2d3a8c] transition-colors"
          >
            <Plus className="w-3.5 h-3.5" /> Add Vlog
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white border border-[#dde2f0] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm min-w-max">
            <thead className="border-b border-[#dde2f0] bg-[#f7f8fc]">
              <tr className="text-left">
                {["Thumbnail", "Title & Description", "Video URL", "Order", "Status", "Actions"].map((h) => (
                  <th key={h} className="px-5 py-3 text-[9px] font-medium uppercase tracking-[0.2em] text-[#5a6380]">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Loader2 className="w-5 h-5 animate-spin text-[#8fa0d8] mx-auto" />
                  </td>
                </tr>
              ) : vlogs.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-5 py-16 text-center">
                    <Play className="w-10 h-10 text-[#dde2f0] mx-auto mb-3" />
                    <p className="text-sm font-light text-[#8fa0d8]">No vlogs yet. Add your first video.</p>
                  </td>
                </tr>
              ) : (
                vlogs.map((v) => {
                  const thumb = v.thumbnail || getYoutubeThumbnail(v.videoUrl);
                  return (
                    <tr key={v.id} className="border-b border-[#dde2f0] last:border-0 hover:bg-[#f7f8fc] transition-colors">
                      {/* Thumbnail */}
                      <td className="px-5 py-3">
                        <div className="w-24 h-14 bg-[#dde8f8] overflow-hidden shrink-0">
                          {thumb ? (
                            <img src={thumb} alt={v.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center">
                              <Play className="w-5 h-5 text-[#8fa0d8]" />
                            </div>
                          )}
                        </div>
                      </td>
                      {/* Title */}
                      <td className="px-5 py-3 max-w-[260px]">
                        <p className="font-medium text-[#1e2a5e] text-sm truncate">{v.title}</p>
                        <p className="text-[11px] font-light text-[#5a6380] line-clamp-2 mt-0.5">{v.description}</p>
                      </td>
                      {/* URL */}
                      <td className="px-5 py-3">
                        <a
                          href={v.videoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1.5 text-[11px] font-light text-[#2d3a8c] hover:text-[#1e2a5e] transition-colors max-w-[180px] truncate"
                        >
                          <ExternalLink className="w-3 h-3 shrink-0" />
                          <span className="truncate">{v.videoUrl}</span>
                        </a>
                      </td>
                      {/* Order */}
                      <td className="px-5 py-3 text-sm font-light text-[#5a6380]">{v.order}</td>
                      {/* Status */}
                      <td className="px-5 py-3">
                        <Switch
                          checked={v.active}
                          onCheckedChange={() => toggleActive(v)}
                          className="data-[state=checked]:bg-[#1e2a5e]"
                        />
                      </td>
                      {/* Actions */}
                      <td className="px-5 py-3">
                        <div className="flex gap-1">
                          <button
                            onClick={() => openEdit(v)}
                            className="p-2 hover:bg-[#eef0f8] transition-colors text-[#5a6380] hover:text-[#1e2a5e]"
                          >
                            <Pencil className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => onDelete(v.id)}
                            className="p-2 hover:bg-red-50 transition-colors text-[#5a6380] hover:text-red-600"
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

      {/* Add / Edit Dialog */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="bg-white border-[#dde2f0] max-w-2xl max-h-[90vh] overflow-y-auto rounded-none">
          <DialogHeader>
            <DialogTitle
              className="text-[#1e2a5e]"
              style={{ fontFamily: "var(--font-display), Georgia, serif", fontSize: "22px", fontWeight: 400 }}
            >
              {editing ? "Edit Vlog" : "Add New Vlog"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 py-2">
            {/* Title */}
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">
                Title *
              </Label>
              <Input
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="e.g. Summer Lawn Collection 2025"
                className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm"
              />
            </div>

            {/* Description */}
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">
                Description
              </Label>
              <textarea
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                placeholder="Brief description of the vlog..."
                className="w-full border border-[#dde2f0] px-3 py-2 text-sm font-light text-[#1e2a5e] focus:outline-none focus:border-[#1e2a5e] resize-none placeholder:text-[#8fa0d8]"
              />
            </div>

            {/* Video URL */}
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">
                Video URL * <span className="normal-case tracking-normal font-light text-[#8fa0d8]">(YouTube, Vimeo, or direct .mp4)</span>
              </Label>
              <Input
                value={form.videoUrl}
                onChange={(e) => setForm({ ...form, videoUrl: e.target.value })}
                placeholder="https://www.youtube.com/watch?v=..."
                className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light"
              />
              <p className="text-[10px] font-light text-[#8fa0d8] mt-1">
                Supports: youtube.com/watch, youtu.be, youtube.com/shorts, or any direct video URL
              </p>
            </div>

            {/* Live Preview */}
            {previewUrl && (
              <div>
                <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">
                  Preview
                </Label>
                <div className="aspect-video bg-[#dde8f8] overflow-hidden">
                  <iframe
                    src={previewUrl}
                    className="w-full h-full"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    title="Video preview"
                  />
                </div>
              </div>
            )}

            {/* Thumbnail URL (optional) */}
            <div>
              <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">
                Custom Thumbnail URL <span className="normal-case tracking-normal font-light text-[#8fa0d8]">(optional — auto-detected for YouTube)</span>
              </Label>
              <Input
                value={form.thumbnail}
                onChange={(e) => setForm({ ...form, thumbnail: e.target.value })}
                placeholder="https://..."
                className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm font-light"
              />
            </div>

            {/* Order + Active */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#5a6380] mb-2 block">
                  Display Order
                </Label>
                <Input
                  type="number"
                  value={form.order}
                  onChange={(e) => setForm({ ...form, order: +e.target.value })}
                  min={0}
                  className="border-[#dde2f0] rounded-none focus:border-[#1e2a5e] text-sm"
                />
              </div>
              <div className="flex items-end gap-3 pb-1">
                <Switch
                  id="vlog-active"
                  checked={form.active}
                  onCheckedChange={(c) => setForm({ ...form, active: c })}
                  className="data-[state=checked]:bg-[#1e2a5e]"
                />
                <Label htmlFor="vlog-active" className="text-sm font-light text-[#5a6380] cursor-pointer">
                  Visible on site
                </Label>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <button
              onClick={() => setOpen(false)}
              className="px-5 py-2.5 border border-[#dde2f0] text-[11px] font-medium uppercase tracking-[0.12em] text-[#5a6380] hover:border-[#1e2a5e] hover:text-[#1e2a5e] transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onSave}
              disabled={saving}
              className="px-5 py-2.5 bg-[#1e2a5e] text-[#f7f8fc] text-[11px] font-medium uppercase tracking-[0.12em] hover:bg-[#2d3a8c] disabled:opacity-50 transition-colors flex items-center gap-2"
            >
              {saving && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              {saving ? "Saving…" : editing ? "Update" : "Add Vlog"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
