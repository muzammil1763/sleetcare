"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Leaf, FlaskConical, Heart, Recycle, CheckCircle2, Star, Users, Package, Globe } from "lucide-react";

export default function About() {
  const [stats, setStats] = useState([
    { label: "Cruelty Free",     value: "100%", icon: Heart },
    { label: "Premium Products", value: "50+",  icon: Package },
    { label: "Happy Customers",  value: "10K+", icon: Users },
    { label: "Countries Served", value: "25+",  icon: Globe },
  ]);

  useEffect(() => {
    fetch("/api/home-stats").then(r => r.json()).then(d => {
      if (!d || d.error) return;
      setStats([
        { label: d.happy_customers?.label   || "Cruelty Free",     value: d.happy_customers?.value   || "100%", icon: Heart },
        { label: d.products_sold?.label     || "Premium Products", value: d.products_sold?.value     || "50+",  icon: Package },
        { label: d.satisfaction_rate?.label || "Happy Customers",  value: d.satisfaction_rate?.value || "10K+", icon: Users },
        { label: d.delivery_time?.label     || "Countries Served", value: d.delivery_time?.value     || "25+",  icon: Globe },
      ]);
    }).catch(() => {});
  }, []);

  return (
    <div className="overflow-x-hidden">

      {/* ── HERO ── */}
      <section className="relative py-28 bg-[#1e2a5e] overflow-hidden">
        <div className="absolute inset-0 opacity-[0.06]"
          style={{ backgroundImage: "linear-gradient(rgba(200,208,240,1) 1px, transparent 1px), linear-gradient(90deg, rgba(200,208,240,1) 1px, transparent 1px)", backgroundSize: "48px 48px" }} />
        <div className="absolute right-0 top-0 bottom-0 w-[45%] hidden lg:block overflow-hidden">
          <img src="/img1.png" alt="Sleet Care" className="w-full h-full object-cover opacity-30" />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e2a5e] to-transparent" />
        </div>
        <div className="container relative z-10 max-w-2xl">
          <p className="text-[10px] font-medium uppercase tracking-[0.5em] text-[#8fa0d8] mb-6">Our Story</p>
          <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white leading-[1.05] mb-6">
            Beauty that cares —<br />
            <em className="italic font-light text-[#c8d0f0]">for your skin, and the planet</em>
          </h1>
          <p className="text-sm font-light text-white/70 leading-relaxed max-w-xl mb-10">
            Sleet Care began with one stubborn question: why do so many products promise gentleness and then deliver a stinging face? Eight years later, the answer is still the same — better ingredients, honestly used.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link href="/shop">
              <button className="bg-white text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 hover:bg-[#eef0f8] transition-colors">
                Shop the Range
              </button>
            </Link>
            <Link href="/contact">
              <button className="border border-[#8fa0d8]/50 text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-4 hover:bg-white hover:text-[#1e2a5e] transition-colors">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-0 bg-[#f7f8fc]">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4">
            {stats.map((s, i) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className={`py-10 px-6 text-center border-b border-[#dde2f0] ${i < 3 ? "md:border-r" : ""} border-r`}>
                  <Icon className="w-6 h-6 text-[#2d3a8c] mx-auto mb-3" />
                  <p className="font-display text-4xl text-[#1e2a5e] mb-1">{s.value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8fa0d8]">{s.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── WHY WE EXIST — img1 left ── */}
      <section className="py-0 bg-white">
        <div className="grid lg:grid-cols-2 min-h-[560px]">
          <div className="overflow-hidden">
            <img src="/img1.png" alt="Natural skincare ingredients" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" style={{ minHeight: 400 }} />
          </div>
          <div className="flex items-center px-10 py-16 lg:px-16">
            <div className="max-w-md">
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">Why We Exist</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e] leading-[1.2] mb-6">
                Small batches,<br />serious standards
              </h2>
              <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-4">
                We formulate in batches of a few thousand units so nothing sits in a warehouse losing potency. Every batch is stability tested, patch tested on all six Fitzpatrick skin types, and released with a signed certificate of analysis you can request at any time.
              </p>
              <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-8">
                Our 100% natural ingredient promise isn't a mood board — it's a sourcing policy. We buy cold-pressed oils direct from growers, use steam-distilled hydrosols rather than fragrance oils, and reject any raw material we can't trace back to its source.
              </p>
              <ul className="space-y-3 mb-8">
                {[
                  "GMP-certified manufacturing facility",
                  "Stability tested every single batch",
                  "Certificate of analysis available on request",
                  "Cold-pressed oils sourced direct from farms",
                ].map(item => (
                  <li key={item} className="flex items-center gap-3 text-sm font-light text-[#5a6380]">
                    <CheckCircle2 className="w-4 h-4 text-[#2d3a8c] shrink-0" /> {item}
                  </li>
                ))}
              </ul>
              <Link href="/shop">
                <button className="flex items-center gap-2 bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-8 py-3.5 hover:bg-[#2d3a8c] transition-colors">
                  Explore the Range <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOUR COMMITMENTS ── */}
      <section className="py-20 bg-[#eef0f8]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">What We Stand For</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">Four commitments we don't negotiate</h2>
            <p className="text-sm font-light text-[#5a6380] mt-4 max-w-xl mx-auto">Not marketing copy. These are structural decisions baked into every product, every batch, every shipment we've ever made.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
            {[
              { icon: Leaf,        title: "Ingredient honesty",  desc: "Full INCI lists and exact active percentages on every carton and product page. No hiding behind 'fragrance'." },
              { icon: FlaskConical,title: "Evidence over hype",  desc: "Clinically studied concentrations only. No trace amounts added just to put an ingredient on the label." },
              { icon: Heart,       title: "Kind by default",     desc: "Leaping Bunny certified, fully vegan, never sold in markets where animal testing is required by law." },
              { icon: Recycle,     title: "Lighter footprint",   desc: "Glass jars, FSC cartons, soy inks, plastic-free mailers, and a take-back scheme for all empties." },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.title} className="bg-white border border-[#dde2f0] p-8 hover:shadow-lg hover:border-[#2d3a8c]/30 transition-all group">
                  <div className="w-12 h-12 border border-[#dde2f0] flex items-center justify-center mb-6 group-hover:bg-[#1e2a5e] group-hover:border-[#1e2a5e] transition-colors">
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

      {/* ── NEVER IN THE BOTTLE — img2 right ── */}
      <section className="py-0 bg-[#f7f8fc]">
        <div className="grid lg:grid-cols-2 min-h-[560px]">
          <div className="flex items-center px-10 py-16 lg:px-16 order-2 lg:order-1">
            <div className="max-w-md">
              <p className="text-2xl mb-5">🌿</p>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">Ingredient Honesty</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e] leading-[1.2] mb-6">
                What's never<br />in the bottle
              </h2>
              <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-8">
                Our permanent exclusion list — applied across every product we've ever made, without exception. These aren't ingredients we avoid when it's convenient. They're ingredients we've removed permanently, regardless of cost or performance trade-offs.
              </p>
              <div className="grid grid-cols-2 gap-3">
                {["Parabens","Synthetic fragrance","Sulfates (SLS/SLES)","Mineral oil","Phthalates","Formaldehyde releasers","Animal-derived actives","Microplastics"].map(item => (
                  <div key={item} className="flex items-center gap-2 text-sm font-light text-[#5a6380]">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#2d3a8c] shrink-0" /> {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="overflow-hidden order-1 lg:order-2">
            <img src="/img2.png" alt="Clean ingredients" className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000" style={{ minHeight: 400 }} />
          </div>
        </div>
      </section>

      {/* ── JOURNEY TIMELINE ── */}
      <section className="py-20 bg-white">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">The Journey</p>
              <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e] mb-12">From one cream to a full ritual</h2>
              <div className="space-y-0">
                {[
                  { year: "2018", title: "A kitchen-table start", desc: "Founded after two years of reformulating a barrier cream that our founder's sensitive skin could actually tolerate. No lab, no funding — just a problem worth solving." },
                  { year: "2020", title: "First lab partnership",  desc: "We moved into a certified GMP facility and brought a cosmetic chemist and a consulting dermatologist in-house. Every formula was retested from scratch." },
                  { year: "2022", title: "Pakistan-wide launch",   desc: "Our first nationwide retail presence — stocked in 50+ salons, clinics and wellness stores across Lahore, Karachi and Islamabad." },
                  { year: "2023", title: "Plastic-free, end to end", desc: "Every SKU switched to glass and aluminium primary packaging, cutting our plastic use by 94% in a single year." },
                  { year: "2026", title: "Ten thousand routines",  desc: "Sleet Care now ships to 25+ countries with a 4.8-star average across more than 12,000 verified reviews." },
                ].map((item, i, arr) => (
                  <div key={item.year} className="flex gap-6">
                    <div className="flex flex-col items-center">
                      <div className="w-4 h-4 rounded-full bg-[#1e2a5e] shrink-0 mt-1 ring-4 ring-[#dde2f0]" />
                      {i < arr.length - 1 && <div className="w-px flex-1 bg-[#dde2f0] mt-2 min-h-[60px]" />}
                    </div>
                    <div className="pb-10">
                      <p className="font-display text-2xl text-[#1e2a5e] mb-1">{item.year}</p>
                      <p className="text-sm font-medium text-[#2d3a8c] mb-2">{item.title}</p>
                      <p className="text-sm font-light text-[#5a6380] leading-relaxed">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* img3 + Fitzpatrick box */}
            <div className="space-y-6 lg:pt-14">
              <div className="overflow-hidden">
                <img src="/img3.png" alt="Sleet Care product range" className="w-full h-[340px] object-cover hover:scale-105 transition-transform duration-1000" />
              </div>
              <div className="bg-[#eef0f8] border border-[#dde2f0] p-8">
                <p className="text-[10px] font-medium uppercase tracking-[0.25em] text-[#2d3a8c] mb-3">Testing Standard</p>
                <h3 className="font-display text-xl text-[#1e2a5e] mb-4">Tested on all six Fitzpatrick skin types</h3>
                <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-5">Most brands test on two. Every Sleet Care formula is patch tested across all six before a single unit ships.</p>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: "Stability Tested", value: "Every Batch"   },
                    { label: "Patch Tested",     value: "6 Skin Types"  },
                    { label: "Shelf Life",        value: "24 Months"     },
                    { label: "CoA Available",     value: "On Request"    },
                  ].map(s => (
                    <div key={s.label} className="border-l-2 border-[#2d3a8c]/30 pl-4">
                      <p className="font-display text-lg text-[#1e2a5e]">{s.value}</p>
                      <p className="text-[10px] font-medium uppercase tracking-[0.15em] text-[#8fa0d8]">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── TEAM / VALUES BAND ── */}
      <section className="py-20 bg-[#1e2a5e]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#8fa0d8] mb-4">The People Behind It</p>
            <h2 className="font-display text-3xl md:text-4xl text-white mb-4">Built by people who use every product</h2>
            <p className="text-sm font-light text-[#c8d0f0]/70 max-w-xl mx-auto">Our team includes a cosmetic chemist, a dermatologist, a sourcing specialist, and a founder who started this because no product on the market was gentle enough for her skin.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14">
            {[
              { role: "Cosmetic Chemist",    name: "In-house since 2020", desc: "Formulates every product from scratch, rejects any active that can't clear clinical evidence review." },
              { role: "Consulting Dermatologist", name: "Board certified",  desc: "Reviews every formula before manufacture. Signs off on every patch-testing protocol and concentration." },
              { role: "Sourcing Specialist", name: "Direct-from-farm",     desc: "Traces every raw material to its source. No ingredient enters the supply chain without a full provenance record." },
            ].map(p => (
              <div key={p.role} className="border border-[#8fa0d8]/20 p-8 hover:border-[#8fa0d8]/50 transition-colors">
                <div className="w-10 h-10 rounded-full bg-[#8fa0d8]/20 flex items-center justify-center mb-5">
                  <span className="text-[#c8d0f0] font-display text-lg">{p.role[0]}</span>
                </div>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8fa0d8] mb-1">{p.name}</p>
                <h3 className="font-display text-xl text-white mb-3">{p.role}</h3>
                <p className="text-sm font-light text-[#c8d0f0]/70 leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
            {stats.map(s => (
              <div key={s.label} className="text-center border border-[#8fa0d8]/20 p-6 hover:border-[#8fa0d8]/50 transition-colors">
                <p className="font-display text-4xl text-white mb-1">{s.value}</p>
                <p className="text-[10px] font-medium uppercase tracking-[0.2em] text-[#8fa0d8]">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── THREE IMAGES STRIP ── */}
      <section className="py-0 bg-white">
        <div className="grid grid-cols-3 h-[280px] md:h-[380px]">
          {["/img1.png", "/img2.png", "/img3.png"].map((src, i) => (
            <div key={i} className="overflow-hidden relative group">
              <img src={src} alt={`Sleet Care ${i + 1}`} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-[#1e2a5e]/0 group-hover:bg-[#1e2a5e]/30 transition-colors duration-300" />
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-20 bg-[#eef0f8]">
        <div className="container">
          <div className="text-center mb-14">
            <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-4">Real Skin, Real Results</p>
            <h2 className="font-display text-3xl md:text-4xl text-[#1e2a5e]">What our customers say</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
              { quote: "Six weeks with the Glow Serum and my texture is completely different. The first routine I've actually finished a bottle of.", author: "Amara O.", location: "Lahore" },
              { quote: "I have reactive skin and nothing has ever felt this calm. The toner and moisturizer together are unbeatable.", author: "Hannah L.", location: "Karachi" },
              { quote: "Beautiful packaging, honest ingredient lists, and it arrived in two days with zero plastic. Rare combination.", author: "Priya S.", location: "Islamabad" },
            ].map(t => (
              <div key={t.author} className="bg-white border border-[#dde2f0] p-8 hover:shadow-md transition-shadow">
                <div className="flex gap-0.5 mb-5">
                  {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-[#2d3a8c] fill-[#2d3a8c]" />)}
                </div>
                <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-6 italic">"{t.quote}"</p>
                <div className="border-t border-[#dde2f0] pt-5 flex items-center justify-between">
                  <div>
                    <p className="text-[11px] font-medium uppercase tracking-[0.15em] text-[#1e2a5e]">{t.author}</p>
                    <p className="text-[10px] font-light text-[#8fa0d8] mt-0.5">Verified Buyer · {t.location}</p>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-[#eef0f8] flex items-center justify-center">
                    <span className="font-display text-sm text-[#1e2a5e]">{t.author[0]}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 bg-[#f7f8fc]">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#2d3a8c] mb-5">Ready to Start?</p>
              <h2 className="font-display text-4xl md:text-5xl text-[#1e2a5e] leading-[1.15] mb-6">
                Build your routine<br />
                <em className="italic font-light text-[#2d3a8c]">the honest way</em>
              </h2>
              <p className="text-sm font-light text-[#5a6380] leading-relaxed mb-8 max-w-md">
                Browse our full range of dermatologist-tested, 100% natural skincare products — formulated for every skin type, shipped across Pakistan.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/shop">
                  <button className="bg-[#1e2a5e] text-white text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#2d3a8c] transition-colors flex items-center gap-2">
                    Shop Now <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </Link>
                <Link href="/contact">
                  <button className="border border-[#1e2a5e] text-[#1e2a5e] text-[11px] font-medium uppercase tracking-[0.2em] px-10 py-4 hover:bg-[#1e2a5e] hover:text-white transition-colors">
                    Contact Us
                  </button>
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <img src="/img1.png" alt="" className="w-full h-48 object-cover" />
              <img src="/img3.png" alt="" className="w-full h-48 object-cover mt-6" />
              <img src="/img2.png" alt="" className="col-span-2 w-full h-48 object-cover" />
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
