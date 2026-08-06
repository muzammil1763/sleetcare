"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Package, Loader2 } from "lucide-react";

type Category = {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
};

const LOCAL_IMGS = ["/img1.png", "/img2.png", "/img3.png"];

export default function Categories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [productCounts, setProductCounts] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories", { cache: "no-store" }),
          fetch("/api/products", { cache: "no-store" }),
        ]);
        const cats = await catRes.json();
        const prods = await prodRes.json();

        setCategories(cats.sort((a: Category, b: Category) => a.name.localeCompare(b.name)));

        // Count products per category
        const counts: Record<string, number> = {};
        if (Array.isArray(prods)) {
          prods.forEach((p: any) => {
            counts[p.category] = (counts[p.category] || 0) + 1;
          });
        }
        setProductCounts(counts);
      } catch {}
      finally { setLoading(false); }
    };
    load();
  }, []);

  return (
    <div className="overflow-x-hidden bg-[#f7f8fc]">

      {/* Hero */}
      <section className="relative py-24 bg-[#1e2a5e] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.05]"
          style={{ backgroundImage: "linear-gradient(rgba(200,208,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,208,240,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute right-0 top-0 bottom-0 w-[40%] hidden lg:block overflow-hidden">
          <img src="/img2.png" alt="Sleet Care collection" className="w-full h-full object-cover opacity-25" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e2a5e] to-transparent" />
        </div>
        <div className="container relative z-10 max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#8fa0d8] mb-6">Shop by Category</p>
          <h1 className="font-display text-5xl md:text-6xl text-white leading-[1.05] mb-6">
            Our Collections
          </h1>
          <p className="text-sm font-light text-[#c8d0f0]/70 leading-relaxed max-w-lg mb-10">
            From daily cleansers to targeted treatments — browse every Sleet Care category and find the formulas built for your skin type and concern.
          </p>
          <Link href="/shop">
            <button className="bg-white text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#eef0f8] transition-colors flex items-center gap-2">
              Shop All Products <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </Link>
        </div>
      </section>

      {/* Three images strip */}
      <section className="grid grid-cols-3 h-[180px] md:h-[240px]">
        {LOCAL_IMGS.map((src, i) => (
          <div key={i} className="overflow-hidden">
            <img src={src} alt={`Sleet Care ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
          </div>
        ))}
      </section>

      {/* Categories Grid */}
      <section className="py-20 bg-[#f7f8fc]">
        <div className="container">
          <div className="flex items-end justify-between mb-12">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-3">Browse All</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">
                {loading ? "Loading…" : `${categories.length} Collection${categories.length !== 1 ? "s" : ""}`}
              </h2>
            </div>
            <Link href="/shop" className="hidden md:flex items-center gap-2 text-[11px] font-medium uppercase tracking-[0.18em] text-[#5a6380] hover:text-[#1e2a5e] transition-colors">
              View All Products <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map(i => (
                <div key={i} className="aspect-[4/5] bg-[#dde2f0] animate-pulse" />
              ))}
            </div>
          ) : categories.length === 0 ? (
            /* ── No categories fallback ── */
            <div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
                {[
                  { name: "Skin Care",    desc: "Barrier-first formulas for every skin type. Tested on all six Fitzpatrick skin types.", img: "/img1.png" },
                  { name: "Serums",       desc: "Actives at clinically studied concentrations. No trace amounts, no ingredient theatre.", img: "/img2.png" },
                  { name: "Moisturisers",desc: "Seal in treatment with lightweight ceramide-rich hydration. Up to 48hr moisture lock.", img: "/img3.png" },
                  { name: "Cleansers",   desc: "pH-balanced formulas that remove makeup, SPF and pollution without stripping your barrier.", img: "/img1.png" },
                  { name: "Toners",      desc: "Prep your skin to absorb actives. Fragrance-free, alcohol-free and microbiome-friendly.", img: "/img2.png" },
                  { name: "SPF & Sun",   desc: "Broad-spectrum UV protection that doesn't pill under makeup or leave a white cast.", img: "/img3.png" },
                ].map((item, i) => (
                  <Link key={i} href="/shop" className="group">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#dde8f8]">
                      <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a5e]/85 via-[#1e2a5e]/20 to-transparent" />
                      <div className="absolute inset-0 bg-[#1e2a5e]/0 group-hover:bg-[#1e2a5e]/15 transition-colors duration-300" />
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="font-display text-2xl text-white leading-tight mb-2">{item.name}</p>
                        <p className="text-[11px] font-light text-[#c8d0f0]/80 leading-relaxed mb-3 line-clamp-2">{item.desc}</p>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-px bg-[#8fa0d8] group-hover:w-10 transition-all duration-300" />
                          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8fa0d8] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Shop Now
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
              <div className="text-center py-6 bg-[#eef0f8] border border-[#dde2f0]">
                <p className="text-sm font-light text-[#5a6380] mb-4">Categories will appear here once added from the admin panel.</p>
                <Link href="/shop">
                  <button className="bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3 hover:bg-[#2d3a8c] transition-colors">
                    Browse All Products
                  </button>
                </Link>
              </div>
            </div>
          ) : (
            /* ── Real categories from DB ── */
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((category, idx) => {
                const img = LOCAL_IMGS[idx % 3];
                const count = productCounts[category.name] || 0;
                return (
                  <Link key={category.id} href={`/products?category=${encodeURIComponent(category.name)}`} className="group">
                    <div className="relative aspect-[4/5] overflow-hidden bg-[#dde8f8]">
                      <img src={img} alt={category.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a5e]/85 via-[#1e2a5e]/20 to-transparent" />
                      <div className="absolute inset-0 bg-[#1e2a5e]/0 group-hover:bg-[#1e2a5e]/15 transition-colors duration-300" />
                      {count > 0 && (
                        <div className="absolute top-4 right-4 bg-white/90 text-[#1e2a5e] text-[9px] font-medium uppercase tracking-[0.1em] px-2.5 py-1">
                          {count} product{count !== 1 ? "s" : ""}
                        </div>
                      )}
                      <div className="absolute bottom-0 left-0 right-0 p-6">
                        <p className="font-display text-2xl text-white leading-tight mb-2">{category.name}</p>
                        <p className="text-[11px] font-light text-[#c8d0f0]/80 leading-relaxed mb-3 line-clamp-2">
                          {category.description || "Clean formulas, honestly made."}
                        </p>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-px bg-[#8fa0d8] group-hover:w-10 transition-all duration-300" />
                          <span className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8fa0d8] opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            Shop Now
                          </span>
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* Why Sleet Care */}
      <section className="py-20 bg-[#eef0f8]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">The Sleet Care Difference</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">Why our formulas stand apart</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { icon: "🌿", title: "Traceable Ingredients",  desc: "Every raw material is traced to its source farm or grower. No anonymous supply chains, no ingredient mystery." },
              { icon: "🔬", title: "Evidence-Based Formulas", desc: "Actives at clinically studied concentrations only. No trace amounts added just to put an ingredient on the label." },
              { icon: "♻️", title: "Plastic-Free Packaging",  desc: "Glass jars, FSC cartons, soy inks and plastic-free mailers. Take-back scheme available for all empties." },
            ].map((item) => (
              <div key={item.title} className="bg-white border border-[#dde2f0] p-8 hover:border-[#2d3a8c]/40 hover:shadow-md transition-all">
                <p className="text-3xl mb-5">{item.icon}</p>
                <h3 className="font-display text-xl text-[#1e2a5e] mb-3">{item.title}</h3>
                <p className="text-sm font-light text-[#5a6380] leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-[#1e2a5e]">
        <div className="container text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8fa0d8] mb-5">Build Your Ritual</p>
          <h2 className="font-display text-4xl md:text-5xl text-white leading-[1.15] mb-6">
            Every skin type,<br />
            <em className="italic font-light text-[#c8d0f0]">every concern</em>
          </h2>
          <p className="text-sm font-light text-[#c8d0f0]/70 max-w-md mx-auto mb-10">
            Browse the full Sleet Care range — dermatologist-tested, cruelty-free, and formulated with 100% traceable natural ingredients.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop">
              <button className="bg-white text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#eef0f8] transition-colors">
                Shop All Products
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-[#8fa0d8]/50 text-white text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-white hover:text-[#1e2a5e] transition-colors">
                Get Routine Advice
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
