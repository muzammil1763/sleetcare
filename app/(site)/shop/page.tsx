"use client";

import { useMemo, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/store/AppStore";
import { productIcons } from "@/data/mock";
import { Search, SlidersHorizontal, X, ChevronLeft, ChevronRight, ShoppingBag, Package, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

const priceRanges = [
  { label: "Under Rs. 5,000",         min: 0,     max: 5000 },
  { label: "Rs. 5,000 – Rs. 15,000",  min: 5000,  max: 15000 },
  { label: "Rs. 15,000 – Rs. 30,000", min: 15000, max: 30000 },
  { label: "Above Rs. 30,000",        min: 30000, max: Infinity },
];

const sortOptions = [
  { label: "Featured",           value: "featured" },
  { label: "Price: Low to High", value: "price-asc" },
  { label: "Price: High to Low", value: "price-desc" },
  { label: "Name: A to Z",       value: "name-asc" },
  { label: "Name: Z to A",       value: "name-desc" },
];

const ITEMS_PER_PAGE = 12;
const LOCAL_IMGS = ["/img1.png", "/img2.png", "/img3.png"];

export default function ShopPage() {
  const { products, loading, loadProducts, addToCart } = useAppStore();
  const router = useRouter();
  const [categories, setCategories] = useState<string[]>(["All"]);
  const [cat, setCat] = useState<string>("All");
  const [q, setQ] = useState("");
  const [selectedPriceRanges, setSelectedPriceRanges] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [currentPage, setCurrentPage] = useState(1);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await fetch("/api/categories", { cache: "no-store" });
        const data = await res.json();
        setCategories(["All", ...data.map((c: any) => c.name)]);
      } catch {}
    };
    loadCategories();
  }, []);

  useEffect(() => {
    loadProducts();
    const urlParams = new URLSearchParams(window.location.search);
    const s = urlParams.get("search");
    const c = urlParams.get("category");
    if (s) setQ(s);
    if (c) setCat(c);
  }, [loadProducts]);

  useEffect(() => { setCurrentPage(1); }, [cat, q, selectedPriceRanges, inStockOnly, sortBy]);

  const filtered = useMemo(() => {
    let result = products.filter((p) => {
      if (cat !== "All" && p.category !== cat) return false;
      if (q && !p.name.toLowerCase().includes(q.toLowerCase()) && !p.shortDesc.toLowerCase().includes(q.toLowerCase())) return false;
      if (selectedPriceRanges.length > 0) {
        const ok = selectedPriceRanges.some((idx) => {
          const r = priceRanges[idx];
          return p.price >= r.min && p.price < r.max;
        });
        if (!ok) return false;
      }
      if (inStockOnly && p.stock <= 0) return false;
      return true;
    });
    switch (sortBy) {
      case "price-asc":  result.sort((a, b) => a.price - b.price); break;
      case "price-desc": result.sort((a, b) => b.price - a.price); break;
      case "name-asc":   result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case "name-desc":  result.sort((a, b) => b.name.localeCompare(a.name)); break;
    }
    return result;
  }, [products, cat, q, selectedPriceRanges, inStockOnly, sortBy]);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedProducts = filtered.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  const togglePriceRange = (idx: number) =>
    setSelectedPriceRanges((prev) => prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]);

  const clearAllFilters = () => {
    setCat("All"); setQ(""); setSelectedPriceRanges([]); setInStockOnly(false); setSortBy("featured");
  };

  const activeFiltersCount = (cat !== "All" ? 1 : 0) + selectedPriceRanges.length + (inStockOnly ? 1 : 0);

  const FilterSidebar = ({ isMobile = false }) => (
    <div className={isMobile ? "h-full overflow-y-auto" : ""}>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-[#5a6380]" />
          <h2 className="text-[11px] font-body font-medium uppercase tracking-[0.2em] text-[#1e2a5e]">Filters</h2>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 bg-[#1e2a5e] text-white text-[9px] font-body font-medium">{activeFiltersCount}</span>
          )}
        </div>
        {isMobile && (
          <button onClick={() => setShowMobileFilters(false)} className="text-[#5a6380]">
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <button onClick={clearAllFilters} className="w-full mb-5 text-[10px] font-body font-medium uppercase tracking-[0.15em] text-[#2d3a8c] hover:text-[#1e2a5e] transition-colors text-left">
          Clear All
        </button>
      )}

      <div className="mb-6">
        <Label className="text-[10px] font-body font-medium uppercase tracking-[0.2em] text-[#5a6380] mb-3 block">Search</Label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#8fa0d8]" />
          <Input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search products..." className="pl-9 border-[#dde2f0] text-sm font-body font-light rounded-none focus:border-[#1e2a5e]" />
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-[#dde2f0]">
        <Label className="text-[10px] font-body font-medium uppercase tracking-[0.2em] text-[#5a6380] mb-3 block">Category</Label>
        <div className="space-y-1">
          {categories.map((c) => (
            <button key={c} onClick={() => setCat(c)}
              className={`w-full text-left px-3 py-2.5 text-[11px] font-body font-normal uppercase tracking-[0.12em] transition-colors ${
                cat === c ? "bg-[#1e2a5e] text-white" : "text-[#5a6380] hover:text-[#1e2a5e] hover:bg-[#eef0f8]"
              }`}
            >
              <div className="flex items-center justify-between">
                <span>{c}</span>
                {c !== "All" && <span className="text-[9px] text-[#8fa0d8]">{products.filter((p) => p.category === c).length}</span>}
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="mb-6 pb-6 border-b border-[#dde2f0]">
        <Label className="text-[10px] font-body font-medium uppercase tracking-[0.2em] text-[#5a6380] mb-3 block">Price Range</Label>
        <div className="space-y-2.5">
          {priceRanges.map((range, idx) => (
            <div key={idx} className="flex items-center gap-3">
              <Checkbox id={`price-${idx}`} checked={selectedPriceRanges.includes(idx)} onCheckedChange={() => togglePriceRange(idx)} className="rounded-none border-[#8fa0d8]" />
              <label htmlFor={`price-${idx}`} className="text-[11px] font-body font-light cursor-pointer text-[#5a6380]">{range.label}</label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <Label className="text-[10px] font-body font-medium uppercase tracking-[0.2em] text-[#5a6380] mb-3 block">Availability</Label>
        <div className="flex items-center gap-3">
          <Checkbox id="in-stock" checked={inStockOnly} onCheckedChange={(c) => setInStockOnly(c as boolean)} className="rounded-none border-[#8fa0d8]" />
          <label htmlFor="in-stock" className="text-[11px] font-body font-light cursor-pointer text-[#5a6380]">In Stock Only</label>
        </div>
      </div>
    </div>
  );

  return (
    <div className="overflow-x-hidden bg-[#f7f8fc]">
      {/* Hero */}
      <section className="relative overflow-hidden py-20 bg-[#eef0f8]">
        <div className="container text-center">
          <p className="text-[10px] font-body font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">The Full Collection</p>
          <h1 className="font-display text-5xl md:text-6xl text-[#1e2a5e] leading-[1.1]">Everything we make, in one place</h1>
          <p className="mt-4 text-sm font-body font-light text-[#5a6380] max-w-lg mx-auto leading-relaxed">
            Fifty-plus clean formulas across skincare, makeup, hair and body — all dermatologically tested, cruelty-free and packed in recyclable glass.
          </p>
        </div>
      </section>

      <section className="container py-10">
        <div className="flex gap-10">
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-28 bg-white border border-[#dde2f0] p-6">
              <FilterSidebar />
            </div>
          </aside>

          <div className="flex-1 min-w-0">
            <div className="lg:hidden mb-5">
              <button onClick={() => setShowMobileFilters(true)}
                className="flex items-center gap-2 px-5 py-2.5 border border-[#8fa0d8] text-[11px] font-body font-medium uppercase tracking-[0.15em] text-[#1e2a5e] hover:bg-[#1e2a5e] hover:text-white transition-colors">
                <SlidersHorizontal className="w-3.5 h-3.5" />
                Filters {activeFiltersCount > 0 && `(${activeFiltersCount})`}
              </button>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#dde2f0]">
              <p className="text-[11px] font-body font-light text-[#5a6380]">
                <span className="font-medium text-[#1e2a5e]">{filtered.length}</span> products found
              </p>
              <div className="flex items-center gap-3">
                <span className="text-[10px] font-body font-medium uppercase tracking-[0.15em] text-[#5a6380]">Sort:</span>
                <select value={sortBy} onChange={(e) => setSortBy(e.target.value)}
                  className="px-3 py-2 border border-[#dde2f0] text-[11px] font-body font-light text-[#1e2a5e] focus:outline-none focus:border-[#1e2a5e] bg-white">
                  {sortOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
              </div>
            </div>

            {loading ? (
              <div className="py-20 text-center">
                <div className="w-8 h-8 border-2 border-[#dde2f0] border-t-[#1e2a5e] rounded-full animate-spin mx-auto mb-4" />
                <p className="text-sm font-body font-light text-[#5a6380]">Loading collection...</p>
              </div>
            ) : filtered.length === 0 ? (
              <div className="py-20 text-center">
                <ShoppingBag className="w-12 h-12 text-[#8fa0d8] mx-auto mb-4" />
                <h3 className="font-display text-2xl text-[#1e2a5e] mb-2">No products found</h3>
                <p className="text-sm font-body font-light text-[#5a6380] mb-6">Try adjusting your filters</p>
                <button onClick={clearAllFilters} className="border border-[#8fa0d8] text-[11px] font-body font-medium uppercase tracking-[0.15em] text-[#5a6380] px-6 py-2.5 hover:border-[#1e2a5e] hover:text-[#1e2a5e] transition-colors">
                  Clear Filters
                </button>
              </div>
            ) : (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {paginatedProducts.map((p) => {
                    const Icon = productIcons[p.icon] ?? Package;
                    return (
                      <div key={p.id} className="group">
                        <div className="relative aspect-[3/4] overflow-hidden bg-[#dde8f8]">
                          {p.image ? (
                            <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          ) : (
                            <img src={LOCAL_IMGS[paginatedProducts.indexOf(p) % 3]} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                          )}
                          <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Heart className="w-3.5 h-3.5 text-[#5a6380]" />
                          </button>
                          {p.stock <= 0 && (
                            <div className="absolute inset-0 bg-white/60 flex items-center justify-center">
                              <span className="text-[10px] font-body font-medium uppercase tracking-[0.2em] text-[#5a6380] bg-white px-3 py-1.5 border border-[#dde2f0]">Sold Out</span>
                            </div>
                          )}
                          <div className="absolute bottom-0 left-0 right-0 bg-[#1e2a5e]/90 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                            <div className="flex gap-2">
                              <button
                                onClick={() => {
                                  addToCart(p.id, 1);
                                  const t = document.createElement("div");
                                  t.className = "fixed bottom-4 right-4 bg-[#1e2a5e] text-white px-6 py-3 shadow-xl z-50 text-sm font-body font-light tracking-wide";
                                  t.textContent = "Added to cart";
                                  document.body.appendChild(t);
                                  setTimeout(() => t.remove(), 2000);
                                }}
                                disabled={p.stock <= 0}
                                className="flex-1 text-[10px] font-body font-medium uppercase tracking-[0.15em] text-white border border-white/40 py-1.5 hover:bg-white/10 transition-colors disabled:opacity-50 flex items-center justify-center gap-1.5"
                              >
                                Add to Cart
                              </button>
                              <button
                                onClick={() => { addToCart(p.id, 1); router.push("/cart"); }}
                                disabled={p.stock <= 0}
                                className="flex-1 text-[10px] font-body font-medium uppercase tracking-[0.15em] text-[#1e2a5e] bg-white py-1.5 hover:bg-[#eef0f8] transition-colors disabled:opacity-50"
                              >
                                Shop Now
                              </button>
                            </div>
                          </div>
                        </div>
                        <div className="pt-4">
                          <p className="text-[10px] font-body font-medium uppercase tracking-[0.15em] text-[#2d3a8c] mb-1">{p.category}</p>
                          <Link href={`/products/${p.id}`}>
                            <h3 className="font-display text-lg text-[#1e2a5e] leading-snug hover:text-[#2d3a8c] transition-colors line-clamp-2">{p.name}</h3>
                          </Link>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-sm font-body font-normal text-[#1e2a5e]">Rs. {p.price.toLocaleString("en-PK")}</span>
                            {p.stock > 0 && p.stock <= 10 && (
                              <span className="text-[9px] font-body font-medium uppercase tracking-[0.1em] text-[#2d3a8c]">Only {p.stock} left</span>
                            )}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                {totalPages > 1 && (
                  <div className="mt-12 flex items-center justify-center gap-2">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage === 1}
                      className="flex items-center gap-1 px-4 py-2 border border-[#dde2f0] text-[11px] font-body font-medium uppercase tracking-[0.12em] text-[#5a6380] hover:border-[#1e2a5e] hover:text-[#1e2a5e] disabled:opacity-40 transition-colors">
                      <ChevronLeft className="w-3.5 h-3.5" /> Prev
                    </button>
                    <div className="flex gap-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => {
                        if (page === 1 || page === totalPages || (page >= currentPage - 1 && page <= currentPage + 1)) {
                          return (
                            <button key={page} onClick={() => setCurrentPage(page)}
                              className={`w-9 h-9 text-[11px] font-body font-medium transition-colors ${currentPage === page ? "bg-[#1e2a5e] text-white" : "border border-[#dde2f0] text-[#5a6380] hover:border-[#1e2a5e] hover:text-[#1e2a5e]"}`}>
                              {page}
                            </button>
                          );
                        } else if (page === currentPage - 2 || page === currentPage + 2) {
                          return <span key={page} className="w-9 h-9 flex items-center justify-center text-[#8fa0d8] text-sm">…</span>;
                        }
                        return null;
                      })}
                    </div>
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
                      className="flex items-center gap-1 px-4 py-2 border border-[#dde2f0] text-[11px] font-body font-medium uppercase tracking-[0.12em] text-[#5a6380] hover:border-[#1e2a5e] hover:text-[#1e2a5e] disabled:opacity-40 transition-colors">
                      Next <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </section>

      {showMobileFilters && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilters(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-80 max-w-[85vw] bg-white shadow-2xl">
            <div className="h-full overflow-y-auto p-6">
              <FilterSidebar isMobile />
            </div>
          </div>
        </div>
      )}

      <section className="py-14 bg-[#eef0f8]">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: "✦", title: "Natural Ingredients",  desc: "Every formula uses 100% natural, traceable ingredients tested for safety and efficacy." },
              { icon: "✦", title: "Free Shipping",        desc: "Complimentary shipping on all orders over Rs. 5,000. Delivered in 3–5 business days." },
              { icon: "✦", title: "Easy Returns",         desc: "30-day hassle-free return policy on all unopened items." },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-5">
                <div className="w-10 h-10 border border-[#8fa0d8] flex items-center justify-center shrink-0">
                  <span className="text-[#2d3a8c]">{item.icon}</span>
                </div>
                <div>
                  <h3 className="font-display text-lg text-[#1e2a5e] mb-1">{item.title}</h3>
                  <p className="text-sm font-body font-light text-[#5a6380]">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
