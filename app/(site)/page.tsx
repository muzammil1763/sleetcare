"use client";

import Link from "next/link";
import { ArrowRight, Heart, ShoppingBag, Package, Leaf, FlaskConical, Heart as HeartIcon, Recycle, Star, CheckCircle2, Truck, RotateCcw } from "lucide-react";
import { useAppStore } from "@/store/AppStore";
import { productIcons } from "@/data/mock";
import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";

type CategoryWithImage = { id: string; name: string; description: string; image: string | null; };

export default function Home() {
  const { products: storeProducts, loadProducts, addToCart } = useAppStore();
  const router = useRouter();
  const [currentProductIndex, setCurrentProductIndex] = useState(0);
  const [stats, setStats] = useState([
    { label: "Cruelty Free",     value: "100%" },
    { label: "Premium Products", value: "50+"  },
    { label: "Happy Customers",  value: "10K+" },
    { label: "Countries Served", value: "25+"  },
  ]);
  const productsScrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => { loadProducts(); }, [loadProducts]);

  useEffect(() => {
    fetch("/api/home-stats").then(r => r.json()).then(d => {
      if (d && !d.error) setStats([
        { label: d.happy_customers?.label  || "Cruelty Free",     value: d.happy_customers?.value  || "100%" },
        { label: d.products_sold?.label    || "Premium Products", value: d.products_sold?.value    || "50+"  },
        { label: d.satisfaction_rate?.label|| "Happy Customers",  value: d.satisfaction_rate?.value|| "10K+" },
        { label: d.delivery_time?.label    || "Countries Served", value: d.delivery_time?.value    || "25+"  },
      ]);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    const el = productsScrollRef.current;
    if (!el) return;
    const t = setInterval(() => {
      if (el.scrollLeft + el.clientWidth >= el.scrollWidth - 10) el.scrollTo({ left: 0, behavior: "smooth" });
      else el.scrollBy({ left: 340, behavior: "smooth" });
    }, 5000);
    return () => clearInterval(t);
  }, [storeProducts]);

  const activeProducts = storeProducts.filter(p => p.active !== false).sort((a, b) => (a.order ?? 0) - (b.order ?? 0));

  useEffect(() => {
    const el = productsScrollRef.current;
    if (!el) return;
    const fn = () => setCurrentProductIndex(Math.min(Math.round(el.scrollLeft / 340), activeProducts.length - 1));
    el.addEventListener("scroll", fn);
    return () => el.removeEventListener("scroll", fn);
  }, [activeProducts.length]);

  return (
    <div className="overflow-x-hidden">

      {/* ── 1. HERO ── */}
      <section className="relative w-full min-h-[80vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <img src="/hero.png" alt="Sleet Care" className="w-full h-full object-cover object-center" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e2a5e]/85 via-[#1e2a5e]/50 to-transparent" />
        </div>
        <div className="container relative z-10 py-24">
          <div className="max-w-xl">
            <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#8fa0d8] mb-6">100% Natural · Cruelty Free · Pakistan</p>
            <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
              Skin that glows,<br />
              <em className="italic font-light text-[#c8d0f0]">honestly made</em>
            </h1>
            <p className="text-sm font-light text-white/75 leading-relaxed mb-10 max-w-md">
              Sleet Care formulas are developed with dermatologists, built from 100% traceable natural ingredients, and tested on all six Fitzpatrick skin types — no shortcuts, no greenwashing.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/shop">
                <button className="bg-white text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#eef0f8] transition-colors">
                  Shop Collection
                </button>
              </Link>
              <Link href="/about">
                <button className="border border-white/50 text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 hover:bg-white hover:text-[#1e2a5e] transition-colors">
                  Our Story
                </button>
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-6 text-[10px] uppercase tracking-[0.15em] text-white/50">
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#8fa0d8]" /> Fragrance Free</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#8fa0d8]" /> Vegan</span>
              <span className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-[#8fa0d8]" /> Dermatologist Tested</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── 2. STATS BAND ── */}
      <section className="py-12 bg-[#1e2a5e]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-[#8fa0d8]/20">
            {stats.map((s) => (
              <div key={s.label} className="px-4">
                <p className="font-display text-4xl md:text-5xl text-white mb-1">{s.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8fa0d8]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3. THREE IMAGES SHOWCASE ── */}
      <section className="py-20 bg-[#f7f8fc]">
        <div className="container">
          <div className="text-center mb-12">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-3">The Collection</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">Clean beauty, honestly bottled</h2>
            <p className="text-sm font-light text-[#5a6380] mt-3 max-w-lg mx-auto">Every product starts with a question: does this ingredient earn its place? If the answer isn't yes, it doesn't make it in.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { src: "/img1.png", label: "Skin Care", desc: "Barrier-first formulas for every skin type. Clinically tested, fragrance-free." },
              { src: "/img2.png", label: "Serums",    desc: "Actives at evidence-backed concentrations. No trace amounts, no theatre." },
              { src: "/img3.png", label: "Moisturisers", desc: "Seal in treatment with lightweight, non-comedogenic hydration." },
            ].map((item) => (
              <Link key={item.label} href="/shop" className="group block">
                <div className="relative overflow-hidden aspect-[4/5] mb-5">
                  <img src={item.src} alt={item.label} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1e2a5e]/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-5 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                    <button className="w-full bg-white text-[#1e2a5e] text-[10px] font-medium uppercase tracking-[0.2em] py-2.5 hover:bg-[#eef0f8] transition-colors">
                      Shop {item.label}
                    </button>
                  </div>
                </div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#2d3a8c] mb-1">{item.label}</p>
                <h3 className="font-display text-xl text-[#1e2a5e] mb-2 group-hover:text-[#2d3a8c] transition-colors">{item.desc}</h3>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link href="/shop">
              <button className="border border-[#1e2a5e] text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-3.5 hover:bg-[#1e2a5e] hover:text-white transition-colors">
                View All Products <ArrowRight className="inline w-3.5 h-3.5 ml-1" />
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 4. BEST SELLERS ── */}
      <section className="py-20 bg-[#eef0f8]">
        <div className="container">
          <div className="flex items-end justify-between mb-10">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-3">Trending Now</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">Best Sellers</h2>
            </div>
            <Link href="/shop" className="text-[11px] font-medium uppercase tracking-[0.18em] text-[#5a6380] hover:text-[#1e2a5e] transition-colors flex items-center gap-2">
              View All <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {activeProducts.length === 0 ? (
            /* ── Empty state — no fake products ── */
            <div className="text-center py-16">
              <div className="w-16 h-16 mx-auto border border-[#dde2f0] flex items-center justify-center mb-6">
                <ShoppingBag className="w-7 h-7 text-[#8fa0d8]" />
              </div>
              <h3 className="font-display text-2xl text-[#1e2a5e] mb-3">Collection coming soon</h3>
              <p className="text-sm font-light text-[#5a6380] mb-6 max-w-sm mx-auto">
                Our products are being added. Check back shortly or get in touch with us.
              </p>
              <Link href="/contact">
                <button className="border border-[#1e2a5e] text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3 hover:bg-[#1e2a5e] hover:text-white transition-colors">
                  Contact Us
                </button>
              </Link>
            </div>
          ) : (
            <>
              <div ref={productsScrollRef} className="flex gap-5 overflow-x-auto pb-4 snap-x snap-mandatory scrollbar-hide scroll-smooth">
                {activeProducts.map((p, idx) => {
                  const Icon = productIcons[p.icon as keyof typeof productIcons] ?? Package;
                  const fallback = ["/img1.png", "/img2.png", "/img3.png"][idx % 3];
                  return (
                    <div key={p.id} className="flex-shrink-0 w-[calc(100vw-3rem)] sm:w-[260px] md:w-[280px] snap-start group">
                      <div className="relative aspect-[3/4] overflow-hidden bg-[#dde8f8]">
                        <img src={p.image || fallback} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                        <button className="absolute top-3 right-3 w-8 h-8 bg-white/90 flex items-center justify-center hover:bg-white transition-colors opacity-0 group-hover:opacity-100">
                          <Heart className="w-4 h-4 text-[#5a6380]" />
                        </button>
                        {idx < 3 && (
                          <div className="absolute top-3 left-3 bg-[#1e2a5e] text-white text-[9px] font-medium uppercase tracking-[0.1em] px-2 py-1">
                            {idx === 0 ? "Bestseller" : idx === 1 ? "New" : "Popular"}
                          </div>
                        )}
                        <div className="absolute bottom-0 left-0 right-0 bg-[#1e2a5e]/90 px-4 py-3 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                          <div className="flex gap-2">
                            <button
                              onClick={() => { addToCart(p.id, 1); const t = document.createElement("div"); t.className = "fixed bottom-4 right-4 bg-[#1e2a5e] text-white px-6 py-3 shadow-xl z-50 text-sm font-light"; t.textContent = "Added to cart"; document.body.appendChild(t); setTimeout(() => t.remove(), 2000); }}
                              className="flex-1 text-[10px] font-medium uppercase tracking-[0.15em] text-white border border-white/40 py-1.5 hover:bg-white/10 transition-colors flex items-center justify-center gap-1.5">
                              <ShoppingBag className="w-3 h-3" /> Add to Cart
                            </button>
                            <button
                              onClick={() => { addToCart(p.id, 1); router.push("/cart"); }}
                              className="flex-1 text-[10px] font-medium uppercase tracking-[0.15em] text-[#1e2a5e] bg-white py-1.5 hover:bg-[#eef0f8] transition-colors">
                              Shop Now
                            </button>
                          </div>
                        </div>
                      </div>
                      <div className="pt-4 pb-2">
                        <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#2d3a8c] mb-1">{p.category}</p>
                        <Link href={`/products/${p.id}`}><h3 className="font-display text-lg text-[#1e2a5e] leading-snug hover:text-[#2d3a8c] transition-colors">{p.name}</h3></Link>
                        <p className="mt-1 text-xs font-light text-[#5a6380] line-clamp-2">{p.shortDesc}</p>
                        <p className="mt-2 text-sm font-medium text-[#1e2a5e]">Rs. {p.price.toLocaleString("en-PK")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="flex justify-center gap-2 mt-8">
                {activeProducts.map((_, i) => (
                  <button key={i} onClick={() => productsScrollRef.current?.scrollTo({ left: 340 * i, behavior: "smooth" })}
                    className={`h-px transition-all ${i === currentProductIndex ? "bg-[#1e2a5e] w-8" : "bg-[#dde2f0] w-4 hover:bg-[#5a6380]"}`} />
                ))}
              </div>
            </>
          )}
        </div>
      </section>

      {/* ── 5. SPLIT STORY — img1 ── */}
      <section className="py-0 bg-[#f7f8fc]">
        <div className="grid lg:grid-cols-2 min-h-[520px]">
          <div className="overflow-hidden">
            <img src="/img1.png" alt="Natural skincare ingredients" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
          </div>
          <div className="flex items-center px-10 py-16 lg:px-16 bg-[#f7f8fc]">
            <div className="max-w-md">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">Why We Exist</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e] leading-[1.2] mb-6">
                Small batches,<br />serious standards
              </h2>
              <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-4">
                We formulate in batches of a few thousand units so nothing sits in a warehouse losing potency. Every batch is stability tested, patch tested on all six Fitzpatrick skin types, and released with a signed certificate of analysis.
              </p>
              <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-8">
                We buy cold-pressed oils direct from growers, use steam-distilled hydrosols rather than fragrance oils, and reject any raw material we can't trace back to its source.
              </p>
              <ul className="space-y-2.5 mb-8">
                {["Zero synthetic fragrance", "No parabens or sulfates", "FSC-certified packaging", "Leaping Bunny certified"].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-light text-[#5a6380]">
                    <CheckCircle2 className="w-4 h-4 text-[#2d3a8c] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/about">
                <button className="flex items-center gap-2 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#2d3a8c] transition-colors">
                  Read Our Story <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 6. RITUAL STEPS ── */}
      <section className="py-20 bg-[#1e2a5e]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8fa0d8] mb-4">The Sleet Ritual</p>
            <h2 className="font-display text-3xl md:text-4xl text-white">Three steps, morning and night</h2>
            <p className="text-sm font-light text-[#c8d0f0]/70 mt-3 max-w-lg mx-auto">Built on one principle — only what works earns a step.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { step: "01", title: "Cleanse", sub: "Radiance Face Wash", desc: "Lift the day away with a pH-balanced gel that removes SPF, pollution and makeup without stripping your acid mantle." },
              { step: "02", title: "Treat",   sub: "Glow Face Serum",   desc: "Press in actives while skin is still damp. Niacinamide, hyaluronic acid and bakuchiol at clinically studied concentrations." },
              { step: "03", title: "Seal",    sub: "Hydrating Moisturiser", desc: "Lock in treatment with a ceramide-rich, non-comedogenic barrier cream that holds moisture for up to 48 hours." },
            ].map(item => (
              <div key={item.step} className="border border-[#8fa0d8]/20 p-8 hover:border-[#8fa0d8]/50 transition-colors">
                <p className="font-display text-6xl text-[#8fa0d8]/20 mb-4">{item.step}</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8fa0d8] mb-2">{item.sub}</p>
                <h3 className="font-display text-2xl text-white mb-3">{item.title}</h3>
                <p className="text-sm font-light text-[#c8d0f0]/70 leading-relaxed">{item.desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/shop">
              <button className="border border-[#8fa0d8]/50 text-white text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-white hover:text-[#1e2a5e] transition-colors">
                Shop the Ritual
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── 7. SPLIT — img2 reversed ── */}
      <section className="py-0 bg-[#eef0f8]">
        <div className="grid lg:grid-cols-2 min-h-[520px]">
          <div className="flex items-center px-10 py-16 lg:px-16 order-2 lg:order-1">
            <div className="max-w-md">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">Ingredient Honesty</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e] leading-[1.2] mb-6">
                What's never<br />in the bottle
              </h2>
              <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-6">Our permanent exclusion list — applied across every product we've ever made, without exception.</p>
              <div className="grid grid-cols-2 gap-3 mb-8">
                {["Parabens","Synthetic fragrance","Sulfates (SLS/SLES)","Mineral oil","Phthalates","Formaldehyde releasers","Animal-derived actives","Microplastics"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm font-light text-[#5a6380]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d3a8c] shrink-0" /> {item}
                  </div>
                ))}
              </div>
              <Link href="/about">
                <button className="flex items-center gap-2 border border-[#1e2a5e] text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#1e2a5e] hover:text-white transition-colors">
                  Our Standards <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
          <div className="overflow-hidden order-1 lg:order-2">
            <img src="/img2.png" alt="Clean ingredients" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
          </div>
        </div>
      </section>

      {/* ── 8. FOUR COMMITMENTS ── */}
      <section className="py-20 bg-[#f7f8fc]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">What We Stand For</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">Four commitments we don't negotiate</h2>
            <p className="text-sm font-light text-[#5a6380] mt-3 max-w-xl mx-auto">Not marketing copy. These are structural decisions baked into every product, every batch, every shipment.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Leaf,        title: "Ingredient honesty",  desc: "Full INCI lists and active percentages on every carton and product page. No hiding." },
              { icon: FlaskConical,title: "Evidence over hype",  desc: "Clinically studied concentrations only. No trace amounts for label claims." },
              { icon: HeartIcon,   title: "Kind by default",     desc: "Leaping Bunny certified, fully vegan, never sold where animal testing is required." },
              { icon: Recycle,     title: "Lighter footprint",   desc: "Glass jars, FSC cartons, soy inks, plastic-free mailers and a take-back scheme." },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white border border-[#dde2f0] p-8 hover:border-[#2d3a8c]/40 hover:shadow-md transition-all group">
                  <div className="w-10 h-10 border border-[#dde2f0] flex items-center justify-center mb-5 group-hover:bg-[#1e2a5e] group-hover:border-[#1e2a5e] transition-colors">
                    <Icon className="w-5 h-5 text-[#2d3a8c] group-hover:text-white transition-colors" />
                  </div>
                  <h3 className="font-display text-xl text-[#1e2a5e] mb-3">{item.title}</h3>
                  <p className="text-sm font-light text-[#5a6380] leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 9. SPLIT — img3 ── */}
      <section className="py-0 bg-white">
        <div className="grid lg:grid-cols-2 min-h-[520px]">
          <div className="overflow-hidden">
            <img src="/img3.png" alt="Sleet Care product range" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" />
          </div>
          <div className="flex items-center px-10 py-16 lg:px-16 bg-white">
            <div className="max-w-md">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">For Every Skin Type</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e] leading-[1.2] mb-6">
                Tested on all six<br />Fitzpatrick types
              </h2>
              <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-8">
                Most brands test on two. We patch test every formula on all six Fitzpatrick skin types before release — because reactive skin deserves the same confidence as every other type. Every batch ships with a certificate of analysis available on request.
              </p>
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Stability Tested", value: "Every Batch" },
                  { label: "Patch Tested",     value: "6 Skin Types" },
                  { label: "Shelf Life",        value: "24 Months" },
                  { label: "Preservative",      value: "Phenoxyethanol" },
                ].map(s => (
                  <div key={s.label} className="border-l-2 border-[#dde2f0] pl-4">
                    <p className="font-display text-lg text-[#1e2a5e]">{s.value}</p>
                    <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#8fa0d8]">{s.label}</p>
                  </div>
                ))}
              </div>
              <Link href="/shop">
                <button className="flex items-center gap-2 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#2d3a8c] transition-colors">
                  Explore Range <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── 10. TESTIMONIALS ── */}
      <section className="py-20 bg-[#eef0f8]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">Real Skin, Real Results</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">What our community says</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Six weeks with the Glow Serum and my texture is completely different. The first routine I've actually finished a bottle of.", author: "Amara O.", tag: "Verified Buyer", stars: 5 },
              { quote: "I have reactive skin and nothing has ever felt this calm. The toner and moisturizer together are unbeatable.", author: "Hannah L.", tag: "Verified Buyer", stars: 5 },
              { quote: "Beautiful packaging, honest ingredient lists, arrived with zero plastic. The kind of brand I've been looking for.", author: "Priya S.", tag: "Verified Buyer", stars: 5 },
            ].map(t => (
              <div key={t.author} className="bg-white border border-[#dde2f0] p-8 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-5">
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} className="w-4 h-4 text-[#2d3a8c] fill-[#2d3a8c]" />
                  ))}
                </div>
                <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="border-t border-[#dde2f0] pt-5">
                  <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#1e2a5e]">{t.author}</p>
                  <p className="text-[10px] font-light text-[#8fa0d8] mt-0.5">{t.tag}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 11. FEATURES IMAGE ── */}
      <section className="w-full">
        <img src="/features.png" alt="Sleet Care features" className="w-full object-cover" />
      </section>

      {/* ── 12. BRAND STORY BAND ── */}
      <section className="py-24 bg-[#1e2a5e]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8fa0d8] mb-5">Our Story</p>
              <h2 className="font-display text-4xl md:text-5xl text-white leading-[1.15] mb-6">
                Beauty That Cares
              </h2>
              <p className="text-sm font-light text-[#c8d0f0]/80 leading-relaxed mb-5 max-w-md">
                Sleet Care began with a stubborn question: why do so many products promise gentleness and then deliver a stinging face? Eight years later the answer is still the same — better ingredients, honestly used.
              </p>
              <p className="text-sm font-light text-[#c8d0f0]/80 leading-relaxed mb-10 max-w-md">
                Every formula is developed with dermatologists, made with 100% traceable natural ingredients, shipped plastic-free and priced for everyday use — not aspirational marketing.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/about">
                  <button className="bg-white text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#eef0f8] transition-colors">
                    Learn More
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="border border-[#8fa0d8]/50 text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-white hover:text-[#1e2a5e] transition-colors">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-5">
              {stats.map(s => (
                <div key={s.label} className="border border-[#8fa0d8]/20 p-7 hover:border-[#8fa0d8]/60 transition-colors text-center">
                  <p className="font-display text-4xl text-white mb-2">{s.value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8fa0d8]">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── 13. TRUST STRIP ── */}
      <section className="py-14 bg-white border-y border-[#dde2f0]">
        <div className="container">
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: Truck,       title: "Free Delivery",      desc: "On all orders over Rs. 5,000 anywhere in Pakistan." },
              { icon: RotateCcw,   title: "30-Day Returns",     desc: "Unopened items returned within 30 days, no questions." },
              { icon: Leaf,        title: "100% Natural",       desc: "Every ingredient is traceable to its source farm or grower." },
              { icon: Star,        title: "Dermatologist Tested",desc: "Every formula approved by a qualified cosmetic dermatologist." },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="flex items-start gap-4">
                  <div className="w-10 h-10 border border-[#dde2f0] flex items-center justify-center shrink-0">
                    <Icon className="w-4.5 h-4.5 text-[#2d3a8c]" />
                  </div>
                  <div>
                    <h3 className="font-display text-base text-[#1e2a5e] mb-1">{item.title}</h3>
                    <p className="text-xs font-light text-[#5a6380] leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 14. CTA ── */}
      <section className="py-28 bg-[#eef0f8] relative overflow-hidden">
        <div className="absolute inset-0 opacity-30">
          <img src="/img2.png" alt="" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-[#eef0f8]/80" />
        </div>
        <div className="container relative z-10 text-center">
          <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-5">The Full Collection</p>
          <h2 className="font-display text-4xl md:text-5xl lg:text-6xl text-[#1e2a5e] leading-[1.1] mb-6">
            Everything we make,<br />
            <em className="italic font-light">in one place</em>
          </h2>
          <p className="text-sm font-light text-[#5a6380] max-w-lg mx-auto mb-10 leading-relaxed">
            Clean formulas across skincare, serums, moisturisers and more — dermatologically tested, cruelty-free, and packed in recyclable glass. Delivered across Pakistan.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/shop">
              <button className="bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#2d3a8c] transition-colors">
                Shop Now
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-[#1e2a5e] text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#1e2a5e] hover:text-white transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
