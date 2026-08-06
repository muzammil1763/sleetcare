"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Code2, CircuitBoard, Settings, Package, CheckCircle2, Zap, Shield, Clock, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

const iconMap: Record<string, any> = {
  Code2,
  CircuitBoard,
  Settings,
  Package,
  Activity,
  Zap,
};

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

const process = [
  { step: "01", title: "Requirement Analysis", desc: "We understand your technical requirements, constraints, and project goals through detailed consultation.", icon: Activity },
  { step: "02", title: "Design", desc: "Our engineers create detailed designs, schematics, and specifications based on your requirements.", icon: CircuitBoard },
  { step: "03", title: "Prototyping", desc: "We build and test prototypes to validate the design and make necessary refinements.", icon: Settings },
  { step: "04", title: "Delivery", desc: "Final product delivery with complete documentation, source code, and technical support.", icon: Package },
];

const whyChoose = [
  { icon: Shield, title: "Expert Team", desc: "Our engineers have 10+ years of experience in embedded systems and hardware design." },
  { icon: Zap, title: "Fast Turnaround", desc: "We deliver projects on time without compromising on quality or reliability." },
  { icon: CheckCircle2, title: "Quality Assurance", desc: "Every project goes through rigorous testing and quality checks before delivery." },
  { icon: Clock, title: "Long-term Support", desc: "We provide ongoing technical support and maintenance for all our engineering projects." },
];

export default function Engineering() {
  const [engServices, setEngServices] = useState<EngineeringService[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      const res = await fetch("/api/engineering-services");
      const data = await res.json();
      setEngServices(data.filter((s: EngineeringService) => s.active));
    } catch (error) {
      console.error("Failed to load engineering services:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative">
          <div className="max-w-3xl">
            <div className="chip mb-4">// Engineering Services</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Professional{" "}
              <span className="text-gradient-primary">Engineering Services</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              We provide specialized engineering services beyond IoT systems — from firmware development to PCB design and assembly.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact">
                <Button variant="hero" size="lg">Start a Project <ArrowRight className="ml-1 w-4 h-4" /></Button>
              </Link>
              <Link href="/services">
                <Button variant="outline" size="lg">View IoT Solutions</Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── Services Grid ── */}
      <section className="container pb-20 pt-16">
        <div className="chip mb-4">// What We Offer</div>
        <h2 className="text-3xl font-bold tracking-tight mb-8">Our Engineering Services</h2>
        
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 animate-spin text-primary" />
          </div>
        ) : engServices.length === 0 ? (
          <div className="text-center py-20 text-muted-foreground">
            No engineering services available at the moment.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {engServices.map((s) => {
              const IconComponent = iconMap[s.icon] || Code2;
              return (
                <Link key={s.id} href={`/engineering/${s.slug}`} className="glass-card overflow-hidden group hover:-translate-y-1 transition-transform block">
                  {/* Image */}
                  {s.image && (
                    <div className="relative h-48 w-full overflow-hidden">
                      <Image 
                        src={s.image} 
                        alt={s.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="p-7">
                    <div className="w-12 h-12 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-5">
                      <IconComponent className="w-6 h-6 text-secondary" />
                    </div>
                    <h3 className="font-semibold text-xl mb-2">{s.name}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">{s.description}</p>
                    {s.features && s.features.length > 0 && (
                      <ul className="space-y-2">
                        {s.features.map((f, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="w-4 h-4 text-secondary mt-0.5 shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Process ── */}
      <section className="py-20 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent">
        <div className="container">
          <div className="text-center mb-14">
            <div className="chip mx-auto mb-3">// Process</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">How We Work</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">A clear, proven process from idea to delivery.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {process.map((step, i) => (
              <div key={step.step} className="glass-card p-7 relative group hover:-translate-y-1 transition-transform">
                {i < process.length - 1 && (
                  <div className="hidden lg:block absolute top-10 -right-3 w-6 h-px bg-gradient-to-r from-secondary/40 to-transparent z-10" />
                )}
                <div className="font-mono text-5xl font-bold text-secondary/15 mb-4 leading-none">{step.step}</div>
                <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                  <step.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold text-lg">{step.title}</h3>
                <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Why Choose Us ── */}
      <section className="container py-20">
        <div className="chip mb-4">// Why Choose Us</div>
        <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">Why work with our engineering team</h2>
        <p className="text-muted-foreground leading-relaxed mb-10 max-w-2xl">
          We combine deep technical expertise with a client-first approach to deliver engineering solutions that exceed expectations.
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {whyChoose.map((item) => (
            <div key={item.title} className="glass-card p-6 group hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-4">
                <item.icon className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
        <div className="mt-10">
          <Link href="/contact">
            <Button variant="hero" size="lg">Discuss Your Project <ArrowRight className="ml-1 w-4 h-4" /></Button>
          </Link>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="relative overflow-hidden py-24">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-orange-950 to-slate-900" />
        <div className="absolute inset-0 grid-bg opacity-20" />
        <div className="absolute top-0 left-1/4 w-96 h-96 rounded-full bg-orange-500/15 blur-[100px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 rounded-full bg-amber-500/15 blur-[100px]" />
        <div className="container relative z-10 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-orange-400/30 bg-orange-400/10 backdrop-blur-md mb-8">
            <span className="w-1.5 h-1.5 rounded-full bg-orange-400 animate-pulse" />
            <span className="text-xs font-mono text-orange-300 uppercase tracking-widest">Ready to build</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto">
            Have an engineering{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">project in mind?</span>
          </h2>
          <p className="mt-5 text-slate-300 text-lg max-w-xl mx-auto">
            Talk to our engineering team about your project. We'll provide a detailed proposal and timeline.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-400 text-white border-0 shadow-lg shadow-orange-500/30 font-semibold px-8">
                Get a Quote <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
            <Link href="/services">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-md px-8">
                View IoT Solutions
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
