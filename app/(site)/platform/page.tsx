"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Server, BarChart3, Lock, Globe, MonitorSmartphone, Database, Shield, Zap, CheckCircle2, Cloud, Key, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";

const cloudFeatures = [
  { icon: Server, title: "Dedicated Cloud Infrastructure", desc: "Each client gets their own isolated cloud environment with dedicated resources for maximum security and performance." },
  { icon: BarChart3, title: "Real-time Dashboards & Analytics", desc: "Monitor all your devices in real-time with customizable dashboards, advanced analytics, and predictive insights." },
  { icon: MonitorSmartphone, title: "Remote Monitoring & Control", desc: "Access and control your IoT devices from anywhere in the world through web and mobile applications." },
  { icon: Lock, title: "Secure Data Management", desc: "End-to-end encryption, role-based access control, and compliance-ready data storage with automatic backups." },
  { icon: Database, title: "API Integration", desc: "RESTful APIs and WebSocket support for seamless integration with your existing systems and mobile apps." },
  { icon: Shield, title: "Enterprise-Grade Security", desc: "Multi-layer security with SSL/TLS encryption, DDoS protection, and regular security audits." },
];

const platformFeatures = [
  { icon: Activity, label: "Real-time Data Processing", value: "< 10ms latency" },
  { icon: Database, label: "Data Retention", value: "7 years" },
  { icon: Globe, label: "Global CDN", value: "99.99% uptime" },
  { icon: Key, label: "API Rate Limit", value: "10K req/min" },
];

const useCases = [
  { title: "Industrial Monitoring", desc: "Track machine performance, energy consumption, and production metrics in real-time.", icon: Server },
  { title: "Smart Buildings", desc: "Monitor HVAC, lighting, security systems, and optimize energy usage automatically.", icon: MonitorSmartphone },
  { title: "Fleet Management", desc: "Track vehicle location, fuel consumption, driver behavior, and maintenance schedules.", icon: Globe },
  { title: "Environmental Monitoring", desc: "Monitor air quality, temperature, humidity, and other environmental parameters.", icon: Activity },
];

export default function Platform() {
  return (
    <div className="overflow-x-hidden">

      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-20">
        <div className="absolute inset-0 bg-gradient-to-br from-orange-50/60 via-white to-amber-50/40" />
        <div className="absolute inset-0 grid-bg opacity-30" />
        <div className="container relative">
          <div className="max-w-3xl">
            <div className="chip mb-4">// IoT Platform</div>
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.05]">
              Secure IoT{" "}
              <span className="text-gradient-primary">Cloud Platform</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground leading-relaxed max-w-2xl">
              We provide a powerful and scalable cloud system for managing your IoT devices — with dedicated infrastructure for every client.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/contact">
                <Button variant="hero" size="lg">Request Cloud Demo <ArrowRight className="ml-1 w-4 h-4" /></Button>
              </Link>
              <a href="https://cloud.omnilynk.org" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg">Cloud Platform</Button>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* ── Platform Stats ── */}
      <section className="container pb-20 pt-16">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
          {platformFeatures.map((f) => (
            <div key={f.label} className="glass-card p-4 md:p-6 text-center group hover:-translate-y-1 transition-transform">
              <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto mb-2 md:mb-3">
                <f.icon className="w-4 h-4 md:w-5 md:h-5 text-primary" />
              </div>
              <div className="font-semibold text-xs md:text-sm">{f.label}</div>
              <div className="text-[10px] md:text-xs text-primary font-mono mt-1">{f.value}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Platform Highlights ── */}
      <section className="container py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left side - Feature list */}
          <div>
            <div className="chip mb-4">// Cloud Platform</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
              Secure IoT Cloud Platform
            </h2>
            <p className="text-muted-foreground leading-relaxed mb-8">
              We provide a powerful and scalable cloud system for managing your IoT devices — with dedicated infrastructure for every client.
            </p>
            
            <div className="space-y-4">
              {[
                { icon: Server, label: "Dedicated cloud for each client" },
                { icon: BarChart3, label: "Real-time dashboards and analytics" },
                { icon: MonitorSmartphone, label: "Remote monitoring and control" },
                { icon: Lock, label: "Secure data management" },
                { icon: Database, label: "API integration with mobile apps and systems" },
              ].map((item) => (
                <div key={item.label} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center shrink-0">
                    <item.icon className="w-5 h-5 text-orange-500" />
                  </div>
                  <span className="text-sm font-medium">{item.label}</span>
                </div>
              ))}
            </div>

            <div className="mt-8">
              <Link href="/contact">
                <Button variant="hero" size="lg">Request Cloud Demo <ArrowRight className="ml-1 w-4 h-4" /></Button>
              </Link>
            </div>
          </div>

          {/* Right side - Feature cards grid - 2 columns on mobile */}
          <div className="grid grid-cols-2 gap-3 md:gap-4">
            {[
              { icon: Server, title: "Dedicated Servers", subtitle: "Per Client", color: "orange" },
              { icon: BarChart3, title: "Live Dashboards", subtitle: "Real-time", color: "orange" },
              { icon: Lock, title: "Data Security", subtitle: "End-to-End", color: "orange" },
              { icon: Globe, title: "API Access", subtitle: "REST + WS", color: "orange" },
            ].map((card) => (
              <div 
                key={card.title} 
                className="relative glass-card p-4 md:p-6 text-center group hover:-translate-y-2 transition-all duration-300"
                style={{
                  transform: 'perspective(1000px) rotateX(0deg)',
                  boxShadow: '0 10px 30px -5px rgba(214, 94, 20, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)',
                }}
                onMouseEnter={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'perspective(1000px) rotateX(5deg) translateY(-8px)';
                  card.style.boxShadow = '0 20px 40px -10px rgba(214, 94, 20, 0.4), 0 0 0 1px rgba(255, 255, 255, 0.15)';
                }}
                onMouseLeave={(e) => {
                  const card = e.currentTarget;
                  card.style.transform = 'perspective(1000px) rotateX(0deg) translateY(0)';
                  card.style.boxShadow = '0 10px 30px -5px rgba(214, 94, 20, 0.3), 0 0 0 1px rgba(255, 255, 255, 0.1)';
                }}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent rounded-2xl" />
                <div className="relative">
                  <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center justify-center mx-auto mb-3 md:mb-4 shadow-lg shadow-orange-500/20">
                    <card.icon className="w-5 h-5 md:w-6 md:h-6 text-orange-500" />
                  </div>
                  <h3 className="font-semibold text-xs md:text-sm mb-1">{card.title}</h3>
                  <p className="text-[10px] md:text-xs text-orange-500 font-medium">{card.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Core Features ── */}
      <section className="py-20 bg-gradient-to-b from-transparent via-orange-50/40 to-transparent">
        <div className="container">
          <div className="text-center mb-12">
            <div className="chip mx-auto mb-3">// Platform Features</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything you need to manage IoT at scale</h2>
            <p className="mt-3 text-muted-foreground max-w-2xl mx-auto">
              Our cloud platform provides all the tools and infrastructure needed to deploy, monitor, and manage thousands of IoT devices.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cloudFeatures.map((f) => (
              <div key={f.title} className="glass-card p-7 group hover:-translate-y-1 transition-transform">
                <div className="w-12 h-12 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center mb-5">
                  <f.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{f.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Platform Architecture ── */}
      <section className="container py-20">
        <div className="grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <div className="chip mb-4">// Architecture</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Built for reliability and scale</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Our platform is built on modern cloud infrastructure with redundancy at every layer. From edge devices to cloud servers, every component is designed for 99.99% uptime.
            </p>
            <ul className="mt-8 space-y-3">
              {[
                "Microservices architecture for scalability",
                "Auto-scaling based on device load",
                "Multi-region deployment for low latency",
                "Automated backups and disaster recovery",
                "Real-time monitoring and alerting",
                "Zero-downtime updates and maintenance",
              ].map((item) => (
                <li key={item} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-primary/15 flex items-center justify-center mt-0.5 shrink-0">
                    <CheckCircle2 className="w-3 h-3 text-primary" />
                  </div>
                  <span className="text-sm font-medium">{item}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="relative">
            <div className="absolute -inset-4 bg-gradient-to-br from-orange-400/10 to-amber-400/10 blur-2xl rounded-3xl" />
            <div className="relative glass-card overflow-hidden rounded-2xl shadow-xl">
              <Image src="/End-to-End-IoT.webp" alt="IoT Platform Architecture" width={700} height={500} className="w-full h-auto object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 bg-white/80 backdrop-blur-md rounded-xl px-4 py-3 border border-white/40">
                <div className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">Platform Status</div>
                <div className="font-semibold text-sm mt-0.5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  All systems operational
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Use Cases ── */}
      <section className="py-20 bg-gradient-to-b from-transparent via-amber-50/30 to-transparent">
        <div className="container">
          <div className="text-center mb-12">
            <div className="chip mx-auto mb-3">// Use Cases</div>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Powering IoT across industries</h2>
            <p className="mt-3 text-muted-foreground max-w-xl mx-auto">
              Our platform is trusted by businesses across multiple industries for mission-critical IoT deployments.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {useCases.map((uc) => (
              <div key={uc.title} className="glass-card p-6 group hover:-translate-y-1 transition-transform">
                <div className="w-10 h-10 rounded-xl bg-secondary/10 border border-secondary/20 flex items-center justify-center mb-4">
                  <uc.icon className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="font-semibold mb-2">{uc.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{uc.desc}</p>
              </div>
            ))}
          </div>
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
            <span className="text-xs font-mono text-orange-300 uppercase tracking-widest">Cloud Platform</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-white tracking-tight max-w-3xl mx-auto">
            Ready to deploy your{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400">IoT solution?</span>
          </h2>
          <p className="mt-5 text-slate-300 text-lg max-w-xl mx-auto">
            Get a personalized demo of our cloud platform and see how we can help you manage your IoT infrastructure.
          </p>
          <div className="mt-10 flex flex-wrap gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-orange-500 hover:bg-orange-400 text-white border-0 shadow-lg shadow-orange-500/30 font-semibold px-8">
                Schedule a Demo <ArrowRight className="ml-1 w-4 h-4" />
              </Button>
            </Link>
            <a href="https://cloud.omnilynk.org" target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="outline" className="border-white/20 text-white hover:bg-white/10 backdrop-blur-md px-8">
                Login to Cloud
              </Button>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
}
