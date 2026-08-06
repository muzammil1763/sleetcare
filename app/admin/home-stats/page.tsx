"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { Loader2, Save, Wifi, Clock, Globe, TrendingUp } from "lucide-react";

type Stat = {
  key: string;
  value: string;
  label: string;
  icon: string;
};

const iconMap: Record<string, any> = {
  Wifi,
  Clock,
  Globe,
  TrendingUp,
};

const statKeys = [
  { key: "devices_deployed", defaultLabel: "Devices Deployed", defaultIcon: "Wifi" },
  { key: "uptime_sla", defaultLabel: "Uptime SLA", defaultIcon: "Clock" },
  { key: "industries_served", defaultLabel: "Industries Served", defaultIcon: "Globe" },
  { key: "happy_clients", defaultLabel: "Happy Clients", defaultIcon: "TrendingUp" },
];

export default function HomeStatsAdmin() {
  const [stats, setStats] = useState<Record<string, Stat>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = async () => {
    try {
      const res = await fetch("/api/home-stats");
      const data = await res.json();
      
      // Convert to editable format
      const statsData: Record<string, Stat> = {};
      statKeys.forEach((sk) => {
        if (data[sk.key]) {
          statsData[sk.key] = {
            key: sk.key,
            value: data[sk.key].value,
            label: data[sk.key].label,
            icon: data[sk.key].icon,
          };
        } else {
          // Initialize with defaults if not exists
          statsData[sk.key] = {
            key: sk.key,
            value: "",
            label: sk.defaultLabel,
            icon: sk.defaultIcon,
          };
        }
      });
      
      setStats(statsData);
    } catch (error) {
      toast({ title: "Error", description: "Failed to load stats", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const updateStat = (key: string, field: "value" | "label", newValue: string) => {
    setStats({
      ...stats,
      [key]: {
        ...stats[key],
        [field]: newValue,
      },
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Save each stat
      for (const stat of Object.values(stats)) {
        const res = await fetch("/api/home-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(stat),
        });
        
        if (!res.ok) throw new Error("Failed to save stat");
      }
      
      toast({ title: "Success", description: "Homepage stats updated successfully!" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to save stats", variant: "destructive" });
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
          <h1 className="text-3xl font-bold tracking-tight">Homepage Statistics</h1>
          <p className="text-muted-foreground mt-1">Manage the stats displayed on the homepage hero section</p>
        </div>
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

      <div className="glass-card p-6">
        <div className="grid md:grid-cols-2 gap-6">
          {statKeys.map((sk) => {
            const stat = stats[sk.key];
            const Icon = iconMap[stat?.icon] || Wifi;
            
            return (
              <div key={sk.key} className="glass-card p-6 space-y-4">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Icon className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-semibold capitalize">
                      {sk.key.replace(/_/g, " ")}
                    </h3>
                    <p className="text-xs text-muted-foreground">
                      Key: {sk.key}
                    </p>
                  </div>
                </div>

                <div>
                  <Label>Display Value *</Label>
                  <Input
                    value={stat?.value || ""}
                    onChange={(e) => updateStat(sk.key, "value", e.target.value)}
                    placeholder="e.g., 2.4M+, 99.99%, 18, 640+"
                    className="mt-1.5 text-lg font-mono"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    This is the number/value shown on the homepage
                  </p>
                </div>

                <div>
                  <Label>Label *</Label>
                  <Input
                    value={stat?.label || ""}
                    onChange={(e) => updateStat(sk.key, "label", e.target.value)}
                    placeholder="e.g., Devices Deployed"
                    className="mt-1.5"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    The text label shown below the value
                  </p>
                </div>

                <div className="pt-4 border-t border-border">
                  <div className="text-sm text-muted-foreground">Preview:</div>
                  <div className="mt-2 p-4 rounded-lg bg-muted/50 text-center">
                    <div className="font-mono text-2xl font-bold text-foreground">
                      {stat?.value || "—"}
                    </div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground mt-1">
                      {stat?.label || "Label"}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 p-4 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex gap-3">
            <div className="text-blue-600 mt-0.5">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="font-semibold text-blue-900 text-sm">Tips for effective stats:</h4>
              <ul className="mt-2 text-sm text-blue-800 space-y-1">
                <li>• Use "+" suffix for growing numbers (e.g., "2.4M+", "640+")</li>
                <li>• Use "%" for percentages (e.g., "99.99%")</li>
                <li>• Keep values short and impactful</li>
                <li>• Update regularly to show growth</li>
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
