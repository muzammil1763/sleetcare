"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Plus, Save, Trash2, CheckCircle2, GripVertical } from "lucide-react";
import { Switch } from "@/components/ui/switch";

type SlaStat = {
  id?: string;
  label: string;
  value: string;
  order: number;
  active: boolean;
};

export default function SlaStatsAdmin() {
  const [stats, setStats] = useState<SlaStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/sla-stats");
      const data = await res.json();
      setStats(data);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load SLA stats", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const addNewStat = () => {
    setStats([
      ...stats,
      {
        label: "",
        value: "",
        order: stats.length,
        active: true,
      },
    ]);
  };

  const updateStat = (index: number, field: keyof SlaStat, value: any) => {
    const updated = [...stats];
    updated[index] = { ...updated[index], [field]: value };
    setStats(updated);
  };

  const removeStat = async (index: number) => {
    const stat = stats[index];
    
    if (stat.id) {
      // Delete from database
      try {
        const res = await fetch(`/api/sla-stats/${stat.id}`, {
          method: "DELETE",
        });
        
        if (!res.ok) throw new Error("Failed to delete");
        
        toast({ title: "Success", description: "SLA stat deleted successfully!" });
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete SLA stat", variant: "destructive" });
        return;
      }
    }
    
    // Remove from state
    const updated = stats.filter((_, i) => i !== index);
    setStats(updated);
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Validate all stats have required fields
      for (const stat of stats) {
        if (!stat.label.trim() || !stat.value.trim()) {
          toast({ 
            title: "Validation Error", 
            description: "All stats must have a label and value", 
            variant: "destructive" 
          });
          setSaving(false);
          return;
        }
      }

      // Save each stat
      for (const stat of stats) {
        if (stat.id) {
          // Update existing
          const res = await fetch(`/api/sla-stats/${stat.id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              label: stat.label,
              value: stat.value,
              order: stat.order,
              active: stat.active,
            }),
          });
          
          if (!res.ok) throw new Error("Failed to update stat");
        } else {
          // Create new
          const res = await fetch("/api/sla-stats", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              label: stat.label,
              value: stat.value,
              order: stat.order,
              active: stat.active,
            }),
          });
          
          if (!res.ok) throw new Error("Failed to create stat");
        }
      }
      
      toast({ title: "Success", description: "SLA stats updated successfully!" });
      loadStats(); // Reload to get IDs for new items
    } catch (error) {
      toast({ title: "Error", description: "Failed to save SLA stats", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-end justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">SLA Statistics</h1>
          <p className="text-muted-foreground mt-1">Manage the SLA commitments displayed on the services page</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={addNewStat} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Add Stat
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Saving...
              </>
            ) : (
              <>
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </div>

      <div className="glass-card p-6">
        {stats.length === 0 ? (
          <div className="text-center py-12">
            <CheckCircle2 className="w-12 h-12 text-muted-foreground/50 mx-auto mb-3" />
            <p className="text-muted-foreground mb-4">No SLA stats yet. Add your first one!</p>
            <Button onClick={addNewStat}>
              <Plus className="w-4 h-4 mr-2" />
              Add First Stat
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {stats.map((stat, index) => (
              <div key={index} className="glass-card p-5 space-y-4">
                <div className="flex items-start gap-4">
                  <div className="flex items-center gap-2 pt-8">
                    <GripVertical className="w-5 h-5 text-muted-foreground cursor-move" />
                    <div className="text-sm font-mono text-muted-foreground">
                      #{index + 1}
                    </div>
                  </div>

                  <div className="flex-1 grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Label *</Label>
                      <Input
                        value={stat.label}
                        onChange={(e) => updateStat(index, "label", e.target.value)}
                        placeholder="e.g., Platform uptime"
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The description text
                      </p>
                    </div>

                    <div>
                      <Label>Value *</Label>
                      <Input
                        value={stat.value}
                        onChange={(e) => updateStat(index, "value", e.target.value)}
                        placeholder="e.g., 99.99%"
                        className="mt-1.5 font-mono"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The metric or commitment
                      </p>
                    </div>

                    <div>
                      <Label>Order</Label>
                      <Input
                        type="number"
                        value={stat.order}
                        onChange={(e) => updateStat(index, "order", parseInt(e.target.value) || 0)}
                        className="mt-1.5"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Display order (lower first)
                      </p>
                    </div>

                    <div>
                      <Label>Status</Label>
                      <div className="flex items-center gap-3 mt-3">
                        <Switch
                          checked={stat.active}
                          onCheckedChange={(checked) => updateStat(index, "active", checked)}
                        />
                        <span className="text-sm">
                          {stat.active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeStat(index)}
                    className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-6"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>

                {/* Preview */}
                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground mb-2">Preview:</div>
                  <div className="glass-card p-4 flex items-center gap-3 max-w-sm">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />
                    <div>
                      <div className="font-mono font-bold text-sm">
                        {stat.value || "—"}
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {stat.label || "Label"}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex gap-3">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 text-sm">Tips for SLA stats:</h4>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• Use specific metrics (99.99%, &lt; 15 min, 24/7/365)</li>
                <li>• Keep labels concise and professional</li>
                <li>• Order them by importance or impact</li>
                <li>• Use industry-standard terminology</li>
                <li>• Typically display 4-6 key commitments</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving} size="lg">
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving Changes...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save All Changes
            </>
          )}
        </Button>
      </div>
    </div>
  );
}
