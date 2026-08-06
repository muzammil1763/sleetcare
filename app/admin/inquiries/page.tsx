"use client";

import { useEffect, useState, useCallback } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Search, RefreshCw, Loader2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type InquiryData = {
  type: "service" | "product" | "engineering";
  itemId: string;
  itemName: string;
  phone: string;
  company: string;
  message: string;
  qty: number;
  submittedAt: string;
};

type Inquiry = {
  id: string;
  customer: string;
  email: string;
  status: string;
  date: string;
  createdAt: string;
  parsed?: InquiryData;
};

function parseInquiry(raw: Inquiry): Inquiry {
  try {
    const jsonStr = raw.date.replace(/^INQUIRY:/, "");
    const parsed: any = JSON.parse(jsonStr);
    
    // Backward compatibility: handle old 'service' field name
    if (parsed.service && !parsed.itemName) {
      parsed.itemName = parsed.service;
    }
    
    return { ...raw, parsed };
  } catch {
    return raw;
  }
}

const typeColor: Record<string, string> = {
  service: "text-sky-600 border-sky-300 bg-sky-50",
  product: "text-purple-600 border-purple-300 bg-purple-50",
  engineering: "text-orange-600 border-orange-300 bg-orange-50",
};

export default function AdminInquiries() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [viewInquiry, setViewInquiry] = useState<Inquiry | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/inquiries", { cache: "no-store" });
      const data = await res.json();
      const parsed = (Array.isArray(data) ? data : []).map(parseInquiry);
      setInquiries(parsed);
    } catch {
      toast({ title: "Failed to load inquiries", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = inquiries.filter((i) => {
    const lower = q.toLowerCase();
    return (
      i.customer.toLowerCase().includes(lower) ||
      i.email.toLowerCase().includes(lower) ||
      (i.parsed?.itemName ?? "").toLowerCase().includes(lower) ||
      (i.parsed?.company ?? "").toLowerCase().includes(lower)
    );
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="chip mb-2">// Inquiries</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">Inquiry Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{inquiries.length} inquiries received</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search inquiries..."
              className="pl-9 w-64"
            />
          </div>
          <Button variant="outline" size="icon" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Contact</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Item</th>
                <th className="px-5 py-3">Message</th>
                <th className="px-5 py-3">Date</th>
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
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-10 text-center text-muted-foreground">
                    No inquiries found.
                  </td>
                </tr>
              ) : (
                filtered.map((inq) => (
                  <tr key={inq.id} className="border-b border-border/40 hover:bg-muted/20 transition">
                    <td className="px-5 py-3">
                      <div className="font-medium">{inq.customer}</div>
                      {inq.parsed?.company && (
                        <div className="text-[11px] text-muted-foreground">{inq.parsed.company}</div>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-xs">{inq.email}</div>
                      <div className="text-[11px] text-muted-foreground font-mono">
                        {inq.parsed?.phone ?? "—"}
                      </div>
                    </td>
                    <td className="px-5 py-3">
                      {inq.parsed?.type ? (
                        <span
                          className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border ${typeColor[inq.parsed.type] ?? ""}`}
                        >
                          {inq.parsed.type === "service" ? "Service" : inq.parsed.type === "product" ? "Product" : "Engineering"}
                        </span>
                      ) : (
                        <span className="text-muted-foreground text-xs">—</span>
                      )}
                    </td>
                    <td className="px-5 py-3">
                      <div className="text-sm">{inq.parsed?.itemName ?? "—"}</div>
                      {inq.parsed?.type === "product" && inq.parsed.qty > 0 && (
                        <div className="text-[11px] text-muted-foreground">Qty: {inq.parsed.qty}</div>
                      )}
                    </td>
                    <td className="px-5 py-3 max-w-xs">
                      <p className="text-xs text-muted-foreground line-clamp-2">
                        {inq.parsed?.message || "—"}
                      </p>
                    </td>
                    <td className="px-5 py-3 font-mono text-muted-foreground text-xs whitespace-nowrap">
                      {inq.parsed?.submittedAt
                        ? new Date(inq.parsed.submittedAt).toLocaleDateString()
                        : "—"}
                    </td>
                    <td className="px-5 py-3 text-right">
                      <button 
                        onClick={() => setViewInquiry(inq)}
                        className="p-2 rounded-md hover:bg-muted transition"
                        title="View details"
                      >
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Inquiry Dialog */}
      <Dialog open={!!viewInquiry} onOpenChange={(v) => !v && setViewInquiry(null)}>
        <DialogContent className="bg-card border-border max-w-2xl">
          <DialogHeader>
            <DialogTitle className="font-mono">Inquiry Details</DialogTitle>
          </DialogHeader>
          {viewInquiry && (
            <div className="space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-4">
                <div className="border-b border-border pb-2">
                  <span className="text-muted-foreground text-xs">Customer Name</span>
                  <div className="font-medium">{viewInquiry.customer}</div>
                </div>
                <div className="border-b border-border pb-2">
                  <span className="text-muted-foreground text-xs">Email</span>
                  <div className="font-mono text-xs">{viewInquiry.email}</div>
                </div>
                {viewInquiry.parsed?.phone && (
                  <div className="border-b border-border pb-2">
                    <span className="text-muted-foreground text-xs">Phone</span>
                    <div className="font-mono text-xs">{viewInquiry.parsed.phone}</div>
                  </div>
                )}
                {viewInquiry.parsed?.company && (
                  <div className="border-b border-border pb-2">
                    <span className="text-muted-foreground text-xs">Company</span>
                    <div className="text-sm">{viewInquiry.parsed.company}</div>
                  </div>
                )}
                <div className="border-b border-border pb-2">
                  <span className="text-muted-foreground text-xs">Type</span>
                  <div>
                    {viewInquiry.parsed?.type ? (
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-mono uppercase border ${typeColor[viewInquiry.parsed.type] ?? ""}`}>
                        {viewInquiry.parsed.type === "service" ? "Service" : viewInquiry.parsed.type === "product" ? "Product" : "Engineering"}
                      </span>
                    ) : (
                      <span className="text-muted-foreground">—</span>
                    )}
                  </div>
                </div>
                <div className="border-b border-border pb-2">
                  <span className="text-muted-foreground text-xs">Date Submitted</span>
                  <div className="font-mono text-xs">
                    {viewInquiry.parsed?.submittedAt
                      ? new Date(viewInquiry.parsed.submittedAt).toLocaleString()
                      : "—"}
                  </div>
                </div>
              </div>

              {viewInquiry.parsed?.itemName && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">
                    {viewInquiry.parsed.type === "service" ? "Service Requested" : viewInquiry.parsed.type === "product" ? "Product Requested" : "Engineering Service Requested"}
                  </h3>
                  <div className="bg-muted/30 rounded-md p-3">
                    <div className="font-medium">{viewInquiry.parsed.itemName}</div>
                    {viewInquiry.parsed.type === "product" && viewInquiry.parsed.qty > 0 && (
                      <div className="text-xs text-muted-foreground mt-1">Quantity: {viewInquiry.parsed.qty}</div>
                    )}
                  </div>
                </div>
              )}

              {viewInquiry.parsed?.message && (
                <div className="border-t border-border pt-4">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-muted-foreground mb-2">Message</h3>
                  <div className="bg-muted/30 rounded-md p-3">
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{viewInquiry.parsed.message}</p>
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
