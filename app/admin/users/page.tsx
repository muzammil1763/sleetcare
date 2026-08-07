"use client";

import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, RefreshCw, Search, Loader2, Eye } from "lucide-react";
import { toast } from "@/hooks/use-toast";

type UserRole = "Admin" | "Operator" | "Viewer";
type UserStatus = "Active" | "Suspended";

type User = {
  id: string; name: string; email: string;
  role: UserRole; status: UserStatus; lastActive: string; createdAt?: string;
};

type UserDetail = User & {
  orders: {
    id: string; total: number; status: string;
    date: string; createdAt: string; items: number;
  }[];
};

const roleColor: Record<UserRole, string> = {
  Admin:    "text-primary border-primary/30 bg-primary/10",
  Operator: "text-secondary border-secondary/30 bg-secondary/10",
  Viewer:   "text-muted-foreground border-border bg-muted/30",
};

const statusOrderColor: Record<string, string> = {
  Pending:    "text-amber-600 bg-amber-50 border-amber-200",
  Processing: "text-purple-600 bg-purple-50 border-purple-200",
  Shipped:    "text-sky-600 bg-sky-50 border-sky-200",
  Delivered:  "text-emerald-600 bg-emerald-50 border-emerald-200",
  Cancelled:  "text-red-600 bg-red-50 border-red-200",
};

const emptyForm = () => ({ name: "", email: "", password: "", role: "Viewer" as UserRole });

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);
  const [viewUser, setViewUser] = useState<UserDetail | null>(null);
  const [viewLoading, setViewLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: "Failed to load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (u: User) => { setEditing(u); setForm({ name: u.name, email: u.email, password: "", role: u.role }); setOpen(true); };

  const openView = async (u: User) => {
    setViewLoading(true);
    setViewUser({ ...u, orders: [] });
    try {
      const res = await fetch(`/api/users/${u.id}`);
      const data = await res.json();
      setViewUser(data);
    } catch {
      toast({ title: "Failed to load user details", variant: "destructive" });
    } finally {
      setViewLoading(false);
    }
  };

  const onSave = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      if (editing) {
        const body: any = { name: form.name, role: form.role };
        if (form.password) body.password = form.password;
        const res = await fetch(`/api/users/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "User updated" });
      } else {
        if (!form.password) { toast({ title: "Password required", variant: "destructive" }); setSaving(false); return; }
        const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "User created" });
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
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "User deleted" });
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const onToggleStatus = async (u: User) => {
    const newStatus: UserStatus = u.status === "Active" ? "Suspended" : "Active";
    try {
      const res = await fetch(`/api/users/${u.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: newStatus } : x));
      toast({ title: `User ${newStatus === "Active" ? "activated" : "suspended"}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="chip mb-2">// Access Control</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} users in database</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." className="pl-9 w-56" />
          </div>
          <Button variant="outline" size="icon" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="hero" onClick={openCreate}><Plus /> Add user</Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Last active</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No users found.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/40 hover:bg-muted/20 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 border border-border flex items-center justify-center font-mono text-xs font-bold">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3"><span className={`chip ${roleColor[u.role]}`}>{u.role}</span></td>
                  <td className="px-5 py-3">
                    <button onClick={() => onToggleStatus(u)} className="hover:opacity-80 transition">
                      {u.status === "Active" ? (
                        <span className="chip text-emerald-600 border-emerald-300 bg-emerald-50 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="chip text-red-600 border-red-300 bg-red-50 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Suspended
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-muted-foreground">
                    {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button className="p-2 rounded-md hover:bg-muted transition" onClick={() => openView(u)} title="View details"><Eye className="w-3.5 h-3.5" /></button>
                      <button className="p-2 rounded-md hover:bg-muted transition" onClick={() => openEdit(u)} title="Edit"><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition" onClick={() => onDelete(u.id)} title="Delete"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Detail Dialog */}
      <Dialog open={!!viewUser} onOpenChange={(v) => !v && setViewUser(null)}>
        <DialogContent className="bg-card border-border max-w-lg max-h-[90vh] flex flex-col">
          <DialogHeader>
            <DialogTitle className="font-mono">
              {viewUser && (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 border border-border flex items-center justify-center font-mono text-xs font-bold">
                    {viewUser.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                  </div>
                  {viewUser.name}
                </div>
              )}
            </DialogTitle>
          </DialogHeader>
          {viewUser && (
            <div className="overflow-y-auto flex-1 space-y-4 text-sm pr-1">
              {viewLoading ? (
                <div className="flex items-center justify-center py-10">
                  <Loader2 className="w-5 h-5 animate-spin text-primary" />
                </div>
              ) : (
                <>
                  {/* Info grid */}
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-muted/30 rounded-md p-3">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Email</div>
                      <div className="font-mono text-xs break-all">{viewUser.email}</div>
                    </div>
                    <div className="bg-muted/30 rounded-md p-3">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Role</div>
                      <span className={`chip text-xs ${roleColor[viewUser.role]}`}>{viewUser.role}</span>
                    </div>
                    <div className="bg-muted/30 rounded-md p-3">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Status</div>
                      <span className={`chip text-xs flex items-center gap-1 w-fit ${viewUser.status === "Active" ? "text-emerald-600 border-emerald-300 bg-emerald-50" : "text-red-600 border-red-300 bg-red-50"}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${viewUser.status === "Active" ? "bg-emerald-500" : "bg-red-500"}`} />
                        {viewUser.status}
                      </span>
                    </div>
                    <div className="bg-muted/30 rounded-md p-3">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Joined</div>
                      <div className="text-xs">{viewUser.createdAt ? new Date(viewUser.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "—"}</div>
                    </div>
                    <div className="bg-muted/30 rounded-md p-3 col-span-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-1">Last Active</div>
                      <div className="text-xs">{viewUser.lastActive ? new Date(viewUser.lastActive).toLocaleString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" }) : "—"}</div>
                    </div>
                  </div>

                  {/* Order history */}
                  <div className="border-t border-border pt-4">
                    <h3 className="text-[10px] font-mono uppercase tracking-wider text-muted-foreground mb-3">
                      Order History ({viewUser.orders.length})
                    </h3>
                    {viewUser.orders.length === 0 ? (
                      <div className="text-center py-6 text-muted-foreground text-xs">No orders yet.</div>
                    ) : (
                      <div className="space-y-2">
                        {viewUser.orders.map((o) => (
                          <div key={o.id} className="flex items-center justify-between p-2.5 bg-muted/20 rounded-md border border-border/40">
                            <div>
                              <div className="font-mono text-[10px] text-muted-foreground mb-0.5">#{o.id.slice(-6).toUpperCase()}</div>
                              <div className="text-xs text-muted-foreground">{o.items} item{o.items !== 1 ? "s" : ""} · {new Date(o.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</div>
                            </div>
                            <div className="text-right">
                              <div className="font-mono text-sm font-medium mb-1">Rs. {o.total.toLocaleString("en-PK")}</div>
                              <span className={`text-[9px] font-medium uppercase tracking-[0.1em] px-2 py-0.5 border rounded-sm ${statusOrderColor[o.status] ?? "bg-gray-50 text-gray-600 border-gray-200"}`}>
                                {o.status}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit / Create Dialog */}
      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>{editing ? "Edit user" : "Add user"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
            {!editing && <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>}
            <div>
              <Label>Password {editing && <span className="text-muted-foreground text-xs ml-1">(leave blank to keep)</span>}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" placeholder={editing ? "••••••••" : "Min 6 characters"} />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{["Admin", "Operator", "Viewer"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
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

type UserRole = "Admin" | "Operator" | "Viewer";
type UserStatus = "Active" | "Suspended";

type User = {
  id: string; name: string; email: string;
  role: UserRole; status: UserStatus; lastActive: string;
};

const roleColor: Record<UserRole, string> = {
  Admin:    "text-primary border-primary/30 bg-primary/10",
  Operator: "text-secondary border-secondary/30 bg-secondary/10",
  Viewer:   "text-muted-foreground border-border bg-muted/30",
};

const emptyForm = () => ({ name: "", email: "", password: "", role: "Viewer" as UserRole });

export default function AdminUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<User | null>(null);
  const [form, setForm] = useState(emptyForm());
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/users");
      const data = await res.json();
      setUsers(Array.isArray(data) ? data : []);
    } catch {
      toast({ title: "Failed to load users", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = users.filter(
    (u) => u.name.toLowerCase().includes(q.toLowerCase()) || u.email.toLowerCase().includes(q.toLowerCase())
  );

  const openCreate = () => { setEditing(null); setForm(emptyForm()); setOpen(true); };
  const openEdit = (u: User) => { setEditing(u); setForm({ name: u.name, email: u.email, password: "", role: u.role }); setOpen(true); };

  const onSave = async () => {
    if (!form.name || !form.email) return;
    setSaving(true);
    try {
      if (editing) {
        const body: any = { name: form.name, role: form.role };
        if (form.password) body.password = form.password;
        const res = await fetch(`/api/users/${editing.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "User updated" });
      } else {
        if (!form.password) { toast({ title: "Password required", variant: "destructive" }); setSaving(false); return; }
        const res = await fetch("/api/users", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
        if (!res.ok) throw new Error((await res.json()).error);
        toast({ title: "User created" });
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
    if (!confirm("Delete this user?")) return;
    try {
      const res = await fetch(`/api/users/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error);
      toast({ title: "User deleted" });
      load();
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  const onToggleStatus = async (u: User) => {
    const newStatus: UserStatus = u.status === "Active" ? "Suspended" : "Active";
    try {
      const res = await fetch(`/api/users/${u.id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status: newStatus }) });
      if (!res.ok) throw new Error((await res.json()).error);
      setUsers((prev) => prev.map((x) => x.id === u.id ? { ...x, status: newStatus } : x));
      toast({ title: `User ${newStatus === "Active" ? "activated" : "suspended"}` });
    } catch (e: any) {
      toast({ title: "Error", description: e.message, variant: "destructive" });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <div className="chip mb-2">// Access Control</div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">{users.length} users in database</p>
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search users..." className="pl-9 w-56" />
          </div>
          <Button variant="outline" size="icon" onClick={load} disabled={loading}>
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
          <Button variant="hero" onClick={openCreate}><Plus /> Add user</Button>
        </div>
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto scrollbar-hide">
          <table className="w-full text-sm">
            <thead className="bg-muted/30 border-b border-border">
              <tr className="text-left text-[10px] font-mono uppercase tracking-wider text-muted-foreground">
                <th className="px-5 py-3">User</th>
                <th className="px-5 py-3">Email</th>
                <th className="px-5 py-3">Role</th>
                <th className="px-5 py-3">Status</th>
                <th className="px-5 py-3 text-right">Last active</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center"><Loader2 className="w-6 h-6 animate-spin text-primary mx-auto" /></td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-10 text-center text-muted-foreground">No users found.</td></tr>
              ) : filtered.map((u) => (
                <tr key={u.id} className="border-b border-border/40 hover:bg-muted/20 transition">
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/30 to-secondary/20 border border-border flex items-center justify-center font-mono text-xs font-bold">
                        {u.name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase()}
                      </div>
                      <span className="font-medium">{u.name}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3 font-mono text-xs text-muted-foreground">{u.email}</td>
                  <td className="px-5 py-3"><span className={`chip ${roleColor[u.role]}`}>{u.role}</span></td>
                  <td className="px-5 py-3">
                    <button onClick={() => onToggleStatus(u)} className="hover:opacity-80 transition">
                      {u.status === "Active" ? (
                        <span className="chip text-emerald-600 border-emerald-300 bg-emerald-50 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active
                        </span>
                      ) : (
                        <span className="chip text-red-600 border-red-300 bg-red-50 flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-500" /> Suspended
                        </span>
                      )}
                    </button>
                  </td>
                  <td className="px-5 py-3 text-right font-mono text-xs text-muted-foreground">
                    {u.lastActive ? new Date(u.lastActive).toLocaleDateString() : "—"}
                  </td>
                  <td className="px-5 py-3 text-right">
                    <div className="inline-flex gap-1">
                      <button className="p-2 rounded-md hover:bg-muted transition" onClick={() => openEdit(u)}><Pencil className="w-3.5 h-3.5" /></button>
                      <button className="p-2 rounded-md hover:bg-destructive/10 hover:text-destructive transition" onClick={() => onDelete(u.id)}><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (!v) setEditing(null); }}>
        <DialogContent className="bg-card border-border">
          <DialogHeader><DialogTitle>{editing ? "Edit user" : "Add user"}</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <div><Label>Name</Label><Input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="mt-1.5" /></div>
            {!editing && <div><Label>Email</Label><Input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="mt-1.5" /></div>}
            <div>
              <Label>Password {editing && <span className="text-muted-foreground text-xs ml-1">(leave blank to keep)</span>}</Label>
              <Input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} className="mt-1.5" placeholder={editing ? "••••••••" : "Min 6 characters"} />
            </div>
            <div>
              <Label>Role</Label>
              <Select value={form.role} onValueChange={(v) => setForm({ ...form, role: v as UserRole })}>
                <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
                <SelectContent>{["Admin", "Operator", "Viewer"].map((r) => <SelectItem key={r} value={r}>{r}</SelectItem>)}</SelectContent>
              </Select>
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
